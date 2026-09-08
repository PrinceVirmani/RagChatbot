// Server-only settings. Mirrors the RAG section of the Python
// boilerplate_app/core/config.py so both pipelines read the same env vars
// with the same defaults.
//
// Never import this from a client component — SUPABASE_SERVICE_ROLE_KEY and
// OPENROUTER_API_KEY must not reach the browser.

import "server-only";

function str(name: string, fallback: string): string {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : fallback;
}

function optional(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : undefined;
}

function bool(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v === undefined || !v.trim()) return fallback;
  return ["1", "true", "yes", "on"].includes(v.trim().toLowerCase());
}

function int(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

function float(name: string, fallback: number): number {
  const v = process.env[name];
  if (!v) return fallback;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

export const settings = {
  // Supabase — Postgres + pgvector + Storage
  supabaseUrl: optional("SUPABASE_URL"),
  supabaseServiceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY"),
  supabasePdfBucket: str("SUPABASE_PDF_BUCKET", "samsung_poc_pdfs"),

  // LLM
  openrouterApiKey: optional("OPENROUTER_API_KEY"),
  openrouterBaseUrl: str("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1"),
  openrouterModel: str("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
  // Every free model on OpenRouter is a hybrid thinking model, and the ones
  // that think by default (nvidia/nemotron-3-*) spend the whole generation
  // budget reasoning and then stream no answer text. Grounded extraction from
  // retrieved chunks does not need a scratchpad, so thinking is off unless
  // OPENROUTER_THINKING is set. Ignored by models with no reasoning mode.
  openrouterThinking: bool("OPENROUTER_THINKING", false),

  // Embeddings — OpenRouter/OpenAI-compatible endpoint
  embeddingsApiKey: optional("EMBEDDINGS_API_KEY"),
  embeddingsBaseUrl: str("EMBEDDINGS_BASE_URL", "https://openrouter.ai/api/v1"),
  embeddingsModel: str("EMBEDDINGS_MODEL", "openai/text-embedding-3-small"),
  embeddingsDim: int("EMBEDDINGS_DIM", 1536),

  // Retrieval tuning
  ragTopK: int("RAG_TOP_K", 40),
  // Max distinct pages from any single document allowed in a unified
  // retrieval result. Counts pages, not chunks.
  ragMaxPerDoc: int("RAG_MAX_PER_DOC", 10),
  // Drop retrieved chunks below this cosine similarity.
  ragSimFloor: float("RAG_SIM_FLOOR", 0.3),

  // Sent as attribution headers to OpenRouter.
  appReferer: str("OPENROUTER_REFERER", "http://localhost:3000"),
  appTitle: str("OPENROUTER_TITLE", "rag-pdf"),
} as const;

/** Throw early with a readable message instead of failing deep in a fetch. */
export function requireRagEnv(): void {
  const missing: string[] = [];
  if (!settings.supabaseUrl) missing.push("SUPABASE_URL");
  if (!settings.supabaseServiceRoleKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!settings.openrouterApiKey) missing.push("OPENROUTER_API_KEY");
  if (!settings.embeddingsApiKey && !settings.openrouterApiKey) {
    missing.push("EMBEDDINGS_API_KEY (or OPENROUTER_API_KEY)");
  }
  if (missing.length) {
    throw new Error(`missing required env: ${missing.join(", ")}`);
  }
}
