"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  // ChevronDown,
  ExternalLink,
  FileText,
  FolderOpen,
  Loader2,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import {
  deleteDocument,
  listDocuments,
  uploadPdf,
  type DocumentRow,
} from "@/app/lib/ragApi";
// Per-category UI (preserved for re-enable):
// import { CATEGORIES, type CategoryId } from "@/app/lib/categories";

type StatusKind = "idle" | "info" | "success" | "error";

export default function AdminPage() {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  // Per-category state (preserved for re-enable):
  // const [category, setCategory] = useState<CategoryId>(CATEGORIES[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [statusKind, setStatusKind] = useState<StatusKind>("idle");

  const refresh = async () => {
    try {
      setDocs(await listDocuments());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatusKind("info");
    setStatus("Uploading, parsing and embedding…");
    try {
      // Unified mode: no category passed.
      const res = await uploadPdf(file);
      setStatusKind("success");
      setStatus(`Indexed ${res.chunk_count} chunks across ${res.page_count} pages.`);
      setFile(null);
      await refresh();
    } catch (e) {
      setStatusKind("error");
      setStatus(`${e instanceof Error ? e.message : "Upload failed."}`);
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(id);
    await refresh();
  };

  // Per-category grouping (preserved for re-enable):
  // const grouped = CATEGORIES.map((c) => ({
  //   ...c,
  //   docs: docs.filter((d) => d.category === c.id),
  // }));

  const totalDocs = docs.length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-950/85 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex h-9 w-9 shrink-0 rounded-[10px] bg-linear-to-br from-emerald-500 to-emerald-600 items-center justify-center text-white shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
              <FolderOpen size={16} strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <h1 className="text-[16px] font-semibold tracking-[-0.011em] text-zinc-900 dark:text-zinc-100">
                Library admin
              </h1>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                {totalDocs} document{totalDocs === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <ArrowLeft size={13} />
            Back to chat
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Upload card */}
        <section className="mb-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_2px_6px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-[14px] font-semibold tracking-[-0.006em] text-zinc-900 dark:text-zinc-100">
              Upload a PDF
            </h2>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Documents are parsed, chunked, and embedded into your library.
            </p>
          </div>
          <div className="p-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] items-end">
            {/* Per-category selector (preserved for re-enable):
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
                Category
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                  <FolderOpen size={14} />
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  disabled={uploading}
                  className="w-full appearance-none rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-9 pr-9 py-2 text-[13px] font-medium text-zinc-800 dark:text-zinc-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors disabled:opacity-50"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                  <ChevronDown size={14} />
                </span>
              </div>
            </label>
            */}

            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-medium text-zinc-600 dark:text-zinc-400">
                PDF file
              </span>
              <div
                className={[
                  "flex items-center gap-2 rounded-[10px] border bg-white dark:bg-zinc-900 px-3 py-2 transition-colors",
                  "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
                  uploading ? "opacity-50" : "",
                ].join(" ")}
              >
                <FileText size={14} className="text-zinc-400 shrink-0" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  disabled={uploading}
                  className="text-[13px] text-zinc-700 dark:text-zinc-300 flex-1 min-w-0 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-100 dark:file:bg-zinc-800 file:px-2 file:py-1 file:text-[12px] file:font-medium file:text-zinc-700 dark:file:text-zinc-300 hover:file:bg-zinc-200 dark:hover:file:bg-zinc-700"
                />
              </div>
            </label>

            <button
              onClick={onUpload}
              disabled={!file || uploading}
              className="inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white px-4 py-2 text-[13px] font-medium shadow-[0_2px_6px_rgba(15,23,42,0.15)] disabled:shadow-none transition-colors h-[38px]"
            >
              {uploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Working…
                </>
              ) : (
                <>
                  <Upload size={14} />
                  Upload
                </>
              )}
            </button>
          </div>
          {status && (
            <div
              className={[
                "mx-5 mb-5 flex items-center gap-2 px-3 py-2 rounded-[10px] text-[12px] border",
                statusKind === "success"
                  ? "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : statusKind === "error"
                  ? "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                  : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400",
              ].join(" ")}
            >
              {statusKind === "success" && <CheckCircle2 size={14} />}
              {statusKind === "error" && <XCircle size={14} />}
              {statusKind === "info" && <Loader2 size={14} className="animate-spin" />}
              {status}
            </div>
          )}
        </section>

        {/* Flat document list (unified library). Per-category grouping
            preserved below for re-enable. */}
        <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_2px_6px_rgba(15,23,42,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60">
            <h3 className="text-[13px] font-semibold tracking-[-0.006em] text-zinc-900 dark:text-zinc-100">
              Library
            </h3>
            <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
              {docs.length}
            </span>
          </div>
          {docs.length === 0 ? (
            <div className="px-5 py-6 text-[12px] text-zinc-500 dark:text-zinc-400 text-center">
              No documents yet.
            </div>
          ) : (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {docs.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 px-5 py-3 text-[13px] hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                      <FileText size={14} />
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium truncate text-zinc-900 dark:text-zinc-100">
                        {d.filename}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {d.page_count} pages · {new Date(d.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {d.url && (
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500 transition-colors"
                      >
                        <ExternalLink size={12} />
                        Open
                      </a>
                    )}
                    <button
                      onClick={() => onDelete(d.id)}
                      aria-label="Delete document"
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Per-category grouping (preserved for re-enable):
        <div className="space-y-4">
          {grouped.map((g) => (
            <section
              key={g.id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_2px_6px_rgba(15,23,42,0.04)] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60">
                <h3 className="text-[13px] font-semibold tracking-[-0.006em] text-zinc-900 dark:text-zinc-100">
                  {g.label}
                </h3>
                <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                  {g.docs.length}
                </span>
              </div>
              {g.docs.length === 0 ? (
                <div className="px-5 py-6 text-[12px] text-zinc-500 dark:text-zinc-400 text-center">
                  No documents in this category yet.
                </div>
              ) : (
                <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {g.docs.map((d) => ( ... ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        */}
      </div>
    </div>
  );
}
