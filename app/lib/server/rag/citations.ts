// Filter the prefab citation list down to the [N]s the model actually used.
// Port of boilerplate_app/services/rag/citations.py.

import "server-only";

import type { Citation } from "@/app/lib/ragApi";

// Matches ASCII [N] and full-width 【N】. openai/gpt-oss-120b emits the latter
// unconditionally, which would make this return an empty list and strip every
// citation off the message with no error. Kept in sync with CITATION_RE in
// _components/rag/MessageBubble.tsx.
const USED_RE = /[[【](\d+)[\]】]/g;

export function extractUsedCitations(
  reply: string,
  allCitations: Citation[]
): Citation[] {
  const seen = new Set<number>();
  for (const m of reply.matchAll(USED_RE)) {
    seen.add(Number.parseInt(m[1], 10));
  }
  return allCitations.filter((c) => seen.has(c.n));
}
