// Embed query → match_chunks RPC. No reranker, no MMR, no expansion.
// Port of boilerplate_app/services/rag/retrieval.py.

import "server-only";

import { settings } from "../config";
import { getSupabase } from "../supabase";
import { embedQuery } from "./embeddings";

export interface ChunkRow {
  id: string;
  document_id: string;
  page_number: number;
  content: string;
  filename: string;
  similarity: number | null;
}

/**
 * Per-category retrieval. Preserved so the category-scoped UI can be
 * re-enabled without rewriting this module.
 */
export async function retrieveChunks(
  query: string,
  category: string
): Promise<ChunkRow[]> {
  const embedding = await embedQuery(query);
  const sb = getSupabase();
  const { data, error } = await sb.rpc("samsung_poc_match_chunks", {
    query_embedding: embedding,
    in_category: category,
    match_count: settings.ragTopK,
  });
  if (error) throw new Error(`match_chunks failed: ${error.message}`);
  return (data as ChunkRow[]) ?? [];
}

/** Unified retrieval across every chunk, regardless of category. */
export async function retrieveChunksAll(query: string): Promise<ChunkRow[]> {
  const embedding = await embedQuery(query);
  const sb = getSupabase();

  // Over-fetch so the per-doc cap + similarity floor can drop noise without
  // starving the result. Ask the RPC for 2x the final top-K.
  const overFetch = Math.max(settings.ragTopK * 2, settings.ragTopK + 8);
  const { data, error } = await sb.rpc("samsung_poc_match_chunks_all", {
    query_embedding: embedding,
    match_count: overFetch,
  });
  if (error) throw new Error(`match_chunks_all failed: ${error.message}`);

  const rows = ((data as ChunkRow[]) ?? []);

  // Rows arrive ordered by similarity desc from the RPC.
  // Two filters applied in order:
  //   1. Similarity floor — drop chunks below `ragSimFloor`. Because rows are
  //      sorted, we can stop as soon as we hit one below the floor.
  //   2. Per-document cap by DISTINCT PAGE — count unique pages per doc, not
  //      chunks. Chunks from a page already accepted come in for free; only a
  //      *new* page from a doc that's hit its cap is rejected. Lets one
  //      comprehensive standard contribute many overlapping chunks per page
  //      while still preventing it from monopolising the unique-page slots.
  const maxPagesPerDoc = settings.ragMaxPerDoc;
  const simFloor = settings.ragSimFloor;
  const pagesPerDoc = new Map<string, Set<number>>();
  const filtered: ChunkRow[] = [];
  let droppedLowSim = 0;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const sim = r.similarity;
    if (sim !== null && sim !== undefined && sim < simFloor) {
      // Sorted desc → all subsequent are also below.
      droppedLowSim = rows.length - i;
      break;
    }
    const docId = r.document_id;
    const page = r.page_number;
    if (!docId || page === null || page === undefined) continue;

    let pages = pagesPerDoc.get(docId);
    if (!pages) {
      pages = new Set<number>();
      pagesPerDoc.set(docId, pages);
    }
    if (!pages.has(page) && pages.size >= maxPagesPerDoc) continue;

    filtered.push(r);
    pages.add(page);
    if (filtered.length >= settings.ragTopK) break;
  }

  // Debug: surface the retrieved chunks so we can tell whether retrieval
  // missed the answer vs. the LLM ignored it. Remove once tuning is done.
  const preview = filtered
    .slice(0, 10)
    .map((r) => `${r.filename ?? "?"}#p${r.page_number ?? "?"}`)
    .join(", ");
  console.log(
    `[retrieval] query=${JSON.stringify(query)} → ${filtered.length} chunks ` +
      `(over-fetched ${rows.length}, dropped ${droppedLowSim} below ${simFloor} sim, ` +
      `≤${maxPagesPerDoc} pages/doc): ${preview}`
  );

  return filtered;
}
