"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, FileText, Library, X } from "lucide-react";
import SplitView from "@/app/_components/rag/SplitView";
import ChatPanel from "@/app/_components/rag/ChatPanel";
import PdfViewer from "@/app/_components/rag/PdfViewer";
// Per-category UI (preserved for re-enable):
// import PdfSwitcher from "@/app/_components/rag/PdfSwitcher";
import { listDocuments, type Citation, type DocumentRow } from "@/app/lib/ragApi";
// import type { CategoryId } from "@/app/lib/categories";

export default function ChatPage() {
  // Unified mode: a single library, no category state.
  // const [category, setCategory] = useState<CategoryId | null>(null);
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<number>(1);
  const [activeHighlightText, setActiveHighlightText] = useState<string | null>(null);
  const [pdfOpen, setPdfOpen] = useState<boolean>(false);

  // Per-category UI previously let PdfSwitcher change activeId independently
  // of the citation chip flow, so we cleared the highlight here. With
  // PdfSwitcher commented out, the ONLY thing that changes activeId is a
  // citation click — and that same click sets highlightText in the same
  // batch. Running this effect would race against the citation click, wiping
  // the highlight before the async text layer renders. Preserved for the
  // PdfSwitcher re-enable path.
  // useEffect(() => {
  //   setActiveHighlightText(null);
  // }, [activeId]);

  // Load every document once on mount — no per-category scoping.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await listDocuments();
        if (!alive) return;
        setDocs(rows);
      } catch (e) {
        console.error(e);
        if (alive) setDocs([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const onCitationClick = (c: Citation) => {
    setActiveId(c.document_id);
    setActivePage(c.page_number);
    setActiveHighlightText(c.content ?? null);
    setPdfOpen(true);
  };

  const activeDoc = docs.find((d) => d.id === activeId) || null;

  return (
    <SplitView
      rightVisible={pdfOpen}
      left={
        <ChatPanel onCitationClick={onCitationClick} />
      }
      right={
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="flex items-center gap-2 min-w-0">
              <span className="shrink-0 h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                <FileText size={14} />
              </span>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold tracking-[-0.006em] text-zinc-900 dark:text-zinc-100 truncate">
                  {activeDoc ? activeDoc.filename : "Document preview"}
                </div>
                {activeDoc && (
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {activeDoc.page_count} pages
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-1.5 rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <Library size={13} />
                Manage library
                <ExternalLink size={11} className="opacity-60" />
              </Link>
              <button
                onClick={() => setPdfOpen(false)}
                title="Close PDF"
                aria-label="Close PDF"
                className="inline-flex items-center justify-center h-9 w-9 rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          {/* Per-category doc picker (preserved for re-enable):
          <PdfSwitcher
            docs={docs}
            activeId={activeId}
            onChange={(id) => {
              setActiveId(id);
              setActivePage(1);
            }}
          />
          */}
          <div className="flex-1 min-h-0">
            <PdfViewer
              url={activeDoc?.url ?? null}
              page={activePage}
              highlightText={activeHighlightText}
            />
          </div>
        </div>
      }
    />
  );
}
