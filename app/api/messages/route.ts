// GET/DELETE /api/messages — unified chat thread (category-scoped path preserved).
// Port of boilerplate_app/api/rag/messages.py.

import { type NextRequest } from "next/server";

import { isCategory } from "@/app/lib/categories";
import { getSupabase } from "@/app/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Supabase REST refuses an unfiltered delete, so use a tautology that matches
// every row. Mirrors the Python implementation.
const MATCH_ALL_SENTINEL_ID = "00000000-0000-0000-0000-000000000000";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  // Per-category validation (preserved for re-enable):
  // if (!isCategory(category)) {
  //   return Response.json({ error: "valid category required" }, { status: 400 });
  // }

  try {
    const sb = getSupabase();
    let query = sb
      .from("samsung_poc_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (category && isCategory(category)) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return Response.json({ messages: data ?? [] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "messages lookup failed";
    console.error(`[messages] ${msg}`);
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  // Per-category validation (preserved for re-enable):
  // if (!isCategory(category)) {
  //   return Response.json({ error: "valid category required" }, { status: 400 });
  // }

  try {
    const sb = getSupabase();
    const del = sb.from("samsung_poc_messages").delete();

    const { error } =
      category && isCategory(category)
        ? await del.eq("category", category)
        : // No category → wipe all messages.
          await del.neq("id", MATCH_ALL_SENTINEL_ID);

    if (error) throw new Error(error.message);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "clear failed";
    console.error(`[messages] ${msg}`);
    return Response.json({ error: msg }, { status: 500 });
  }

  return Response.json({ ok: true });
}
