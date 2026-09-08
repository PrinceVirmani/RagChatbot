// POST /api/chat — embed → match → prompt → stream LLM.
// Port of boilerplate_app/api/rag/chat.py.
//
// Wire format (do not change):
//     <JSON header>\f<plain text body>
// Separator is ASCII form-feed (\x0c). app/lib/ragApi.ts depends on this.

import { after, type NextRequest } from "next/server";

import { isCategory } from "@/app/lib/categories";
import type { Citation } from "@/app/lib/ragApi";
import { requireRagEnv } from "@/app/lib/server/config";
import { extractUsedCitations } from "@/app/lib/server/rag/citations";
import { streamOpenRouter } from "@/app/lib/server/rag/openrouterStream";
import { buildRagPrompt } from "@/app/lib/server/rag/prompt";
import { retrieveChunks, retrieveChunksAll } from "@/app/lib/server/rag/retrieval";
import { getSupabase } from "@/app/lib/server/supabase";

// Sentinel category for unified-era rows. Matches the 'all' value added in
// backend/supabase/migrations/0002_unify_chat.sql.
const UNIFIED_CATEGORY = "all";

// Referenced only by the commented-out per-category branch below. Keeps the
// imports live (and type-checked) so re-enabling is a comment flip.
void isCategory;
void retrieveChunks;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Long enough for a full grounded answer over ~40 chunks.
export const maxDuration = 300;

async function persistAssistant(
  content: string,
  citations: Citation[],
  category: string
): Promise<void> {
  try {
    const sb = getSupabase();
    const { error } = await sb.from("samsung_poc_messages").insert({
      role: "assistant",
      content,
      citations,
      category,
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error(`[chat] failed to persist assistant message: ${e}`);
  }
}

export async function POST(request: NextRequest) {
  let payload: { question?: string; category?: string };
  try {
    payload = await request.json();
  } catch {
    return new Response("invalid json body", { status: 400 });
  }

  const question = (payload.question ?? "").trim();
  if (!question) {
    return new Response("question required", { status: 400 });
  }
  // Category is no longer required in unified mode. The per-category branch
  // is preserved (commented) for future re-enable.
  // if (!isCategory(payload.category)) {
  //   return new Response("valid category required", { status: 400 });
  // }

  try {
    requireRagEnv();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "configuration error";
    console.error(`[chat] ${msg}`);
    return new Response(msg, { status: 500 });
  }

  let citations: Citation[];
  let system: string;
  let user: string;

  try {
    const sb = getSupabase();
    const { error: userInsertError } = await sb
      .from("samsung_poc_messages")
      .insert({
        role: "user",
        content: question,
        category: UNIFIED_CATEGORY,
      });
    if (userInsertError) throw new Error(userInsertError.message);

    // Unified retrieval — no category filter.
    const rows = await retrieveChunksAll(question);
    // Per-category retrieval (preserved for re-enable):
    // const rows = await retrieveChunks(question, payload.category!);
    ({ system, user, citations } = buildRagPrompt(question, rows));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "retrieval failed";
    console.error(`[chat] ${msg}`);
    return new Response(msg, { status: 500 });
  }

  // Bridge the stream's completion into an after() callback so persistence
  // runs post-response, matching FastAPI's BackgroundTasks behaviour.
  let settleFinished: (value: { full: string; used: Citation[] }) => void;
  const finished = new Promise<{ full: string; used: Citation[] }>((resolve) => {
    settleFinished = resolve;
  });

  after(async () => {
    const { full, used } = await finished;
    if (!full) return;
    await persistAssistant(full, used, UNIFIED_CATEGORY);
  });

  const header = JSON.stringify({ citations });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(`${header}\f`));
      const buf: string[] = [];
      try {
        for await (const delta of streamOpenRouter(
          [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          request.signal
        )) {
          buf.push(delta);
          controller.enqueue(encoder.encode(delta));
        }
      } catch (e) {
        // The client already has the header, so surface the failure inline
        // rather than as a status code it will never see.
        const msg = e instanceof Error ? e.message : "stream failed";
        console.error(`[chat] stream error: ${msg}`);
        if (!request.signal.aborted) {
          controller.enqueue(encoder.encode(`\n\n[stream error: ${msg}]`));
        }
      } finally {
        const full = buf.join("");
        settleFinished({ full, used: extractUsedCitations(full, citations) });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      // Stops nginx / Cloud Run ingress from buffering the stream.
      "X-Accel-Buffering": "no",
    },
  });
}
