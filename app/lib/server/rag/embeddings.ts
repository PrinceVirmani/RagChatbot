// Query embedding — OpenRouter (or any OpenAI-compatible endpoint).
// Port of boilerplate_app/services/rag/embeddings.py.
//
// `dimensions` is sent explicitly so providers that default to a higher dim
// (e.g. text-embedding-3-large defaults to 3072, llama-nemotron-embed 2048)
// get truncated down to the pgvector column width. Nemotron returns L2-
// normalised vectors at 1536, so the truncation is Matryoshka and cosine
// distance stays meaningful.
//
// `input_type` matters: llama-nemotron-embed is an ASYMMETRIC model. The same
// sentence embedded as "query" vs "passage" lands at cos 0.34, and omitting
// the field defaults everything to "query". Queries must be typed here and
// chunks must be typed "passage" at ingest, or the two live in different
// spaces and retrieval silently returns noise. Symmetric models
// (text-embedding-3-*) ignore the field, so it is sent unconditionally.
//
// Only the query path lives here. Batch embedding belongs to the offline
// ingest pipeline, which stays in Python.

import "server-only";

import { settings } from "../config";

export async function embedQuery(text: string): Promise<number[]> {
  const apiKey = settings.embeddingsApiKey || settings.openrouterApiKey || "";

  const res = await fetch(`${settings.embeddingsBaseUrl}/embeddings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": settings.appReferer,
      "X-Title": settings.appTitle,
    },
    body: JSON.stringify({
      model: settings.embeddingsModel,
      input: text,
      dimensions: settings.embeddingsDim,
      input_type: "query",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`embeddings failed: ${res.status} ${detail}`);
  }

  const json = (await res.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };
  const embedding = json.data?.[0]?.embedding;
  if (!Array.isArray(embedding) || embedding.length === 0) {
    throw new Error("embeddings response contained no vector");
  }
  return embedding;
}
