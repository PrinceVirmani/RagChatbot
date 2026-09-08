// Strict RAG prompt + numbered source list.
// Port of boilerplate_app/services/rag/prompt.py — wording is byte-identical.
//
// Do NOT change the system prompt wording or the source-list format without
// also re-tuning the model. The frontend depends on the [N] marker contract.

import "server-only";

import type { Citation } from "@/app/lib/ragApi";

import type { ChunkRow } from "./retrieval";

export const SYSTEM_PROMPT =
  "You are a question-answering assistant grounded in the provided PDF excerpts.\n" +
  "Rules:\n" +
  "- Answer using the excerpts below. Do not introduce facts that are absent from them.\n" +
  "- After every claim, cite the supporting source as [N] using the numbers shown.\n" +
  "- If the excerpts contain only partial information, answer with what's there and " +
  "briefly note what's missing. Do not invent the rest.\n" +
  '- Only reply exactly "Not in source." if NONE of the excerpts touch on the question\'s topic.\n' +
  "- Be concise. Quote directly when useful.";

export interface RagPrompt {
  system: string;
  user: string;
  citations: Citation[];
}

export function buildRagPrompt(question: string, rows: ChunkRow[]): RagPrompt {
  const citations: Citation[] = [];
  const blocks: string[] = [];

  rows.forEach((row, i) => {
    const n = i + 1;
    citations.push({
      n,
      document_id: String(row.document_id),
      filename: row.filename,
      page_number: Number(row.page_number),
      content: row.content,
    });
    blocks.push(
      `[${n}] ${row.filename} — page ${row.page_number}\n${row.content}`
    );
  });

  const user = `SOURCES:\n${blocks.join("\n\n")}\n\nQUESTION: ${question}`;
  return { system: SYSTEM_PROMPT, user, citations };
}
