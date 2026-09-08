// GET/DELETE /api/documents — list (with fresh signed URLs) and delete.
// Port of boilerplate_app/api/rag/documents.py.

import { type NextRequest } from "next/server";

import { isCategory } from "@/app/lib/categories";
import { settings } from "@/app/lib/server/config";
import { getSupabase } from "@/app/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SIGNED_URL_TTL_SECONDS = 3600;

interface DocumentRecord {
  id: string;
  category: string;
  filename: string;
  storage_path: string;
  page_count: number;
  created_at: string;
  url?: string | null;
}

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  try {
    const sb = getSupabase();
    let query = sb
      .from("samsung_poc_documents")
      .select("*")
      .order("created_at", { ascending: true });

    if (category && isCategory(category)) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const rows = (data as DocumentRecord[]) ?? [];

    // Sign every path in parallel — the Python version did this serially.
    const documents = await Promise.all(
      rows.map(async (r) => {
        let url: string | null = null;
        try {
          const signed = await sb.storage
            .from(settings.supabasePdfBucket)
            .createSignedUrl(r.storage_path, SIGNED_URL_TTL_SECONDS);
          url = signed.data?.signedUrl ?? null;
        } catch {
          url = null;
        }
        return { ...r, url };
      })
    );

    return Response.json({ documents });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "documents lookup failed";
    console.error(`[documents] ${msg}`);
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  let payload: { id?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "invalid json body" }, { status: 400 });
  }

  if (!payload.id) {
    return Response.json({ error: "id required" }, { status: 400 });
  }

  const sb = getSupabase();

  let storagePath: string | null = null;
  try {
    const { data } = await sb
      .from("samsung_poc_documents")
      .select("storage_path")
      .eq("id", payload.id)
      .single();
    storagePath = (data as { storage_path?: string } | null)?.storage_path ?? null;
  } catch {
    storagePath = null;
  }

  if (storagePath) {
    try {
      await sb.storage.from(settings.supabasePdfBucket).remove([storagePath]);
    } catch {
      // best-effort — orphaned storage object is acceptable for POC
    }
  }

  const { error } = await sb
    .from("samsung_poc_documents")
    .delete()
    .eq("id", payload.id);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
