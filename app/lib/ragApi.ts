// RAG API client — implements the form-feed wire protocol from TECHNICAL_DOCS §9.

import type { CategoryId } from "./categories";

export interface Citation {
  n: number;
  document_id: string;
  filename: string;
  page_number: number;
  content?: string;
}

export interface RagMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[] | null;
  category: CategoryId;
  created_at: string;
}

export interface DocumentRow {
  id: string;
  category: CategoryId;
  filename: string;
  storage_path: string;
  page_count: number;
  created_at: string;
  url: string | null;
}

const API_BASE = "/api"; // proxied to FastAPI via next.config.ts

// ---------------------------------------------------------------------
// Chat — form-feed framed stream
// ---------------------------------------------------------------------

export async function streamChat(opts: {
  question: string;
  // Unified mode: category is optional. Pass it to scope retrieval to a
  // single legacy category; omit it for the unified library.
  category?: CategoryId;
  onHeader: (citations: Citation[]) => void;
  onDelta: (delta: string) => void;
  signal?: AbortSignal;
}): Promise<void> {
  const body: Record<string, unknown> = { question: opts.question };
  if (opts.category) body.category = opts.category;
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: opts.signal,
  });

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    throw new Error(`chat failed: ${res.status} ${text}`);
  }

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let headerParsed = false;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = dec.decode(value, { stream: true });

    if (!headerParsed) {
      buf += chunk;
      const ff = buf.indexOf("\f");
      if (ff !== -1) {
        const header = buf.slice(0, ff);
        try {
          const parsed = JSON.parse(header);
          opts.onHeader(parsed.citations || []);
        } catch {
          opts.onHeader([]);
        }
        const rest = buf.slice(ff + 1);
        if (rest) opts.onDelta(rest);
        buf = "";
        headerParsed = true;
      }
    } else {
      opts.onDelta(chunk);
    }
  }
}

// ---------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------

export async function listDocuments(
  category?: CategoryId
): Promise<DocumentRow[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${API_BASE}/documents${qs}`);
  if (!res.ok) throw new Error(`documents failed: ${res.status}`);
  const json = await res.json();
  return json.documents || [];
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/documents`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error(`delete failed: ${res.status}`);
}

export async function uploadPdf(
  file: File,
  category?: CategoryId
): Promise<{
  document_id: string;
  filename: string;
  category: CategoryId;
  page_count: number;
  chunk_count: number;
}> {
  const fd = new FormData();
  fd.append("file", file);
  if (category) fd.append("category", category);
  const res = await fetch(`${API_BASE}/ingest`, { method: "POST", body: fd });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`upload failed: ${res.status} ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------

export async function listMessages(category?: CategoryId): Promise<RagMessage[]> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${API_BASE}/messages${qs}`);
  if (!res.ok) throw new Error(`messages failed: ${res.status}`);
  const json = await res.json();
  return json.messages || [];
}

export async function clearMessages(category?: CategoryId): Promise<void> {
  const qs = category ? `?category=${encodeURIComponent(category)}` : "";
  const res = await fetch(`${API_BASE}/messages${qs}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`clear failed: ${res.status}`);
}
