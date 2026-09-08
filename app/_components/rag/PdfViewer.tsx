"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileX2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Worker fetched from CDN — for production, vendor this in /public.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export default function PdfViewer({
  url,
  page,
  highlightText,
}: {
  url: string | null;
  page: number;
  highlightText?: string | null;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!numPages) return;
    const el = pageRefs.current[page];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page, numPages, url]);

  // Wraps the cited chunk's substrings on the active page in <mark> tags so
  // the .rag-highlight CSS class shows a translucent emerald background over
  // the canvas-rendered text underneath the text layer.
  const customTextRenderer = useCallback(
    ({ pageNumber, str }: { pageNumber: number; str: string }) => {
      if (!highlightText || pageNumber !== page) return str;
      const item = normalize(str);
      if (item.length < 3) return str;
      if (normalize(highlightText).includes(item)) {
        return `<mark class="rag-highlight">${escapeHtml(str)}</mark>`;
      }
      return str;
    },
    [highlightText, page],
  );

  if (!url) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center text-center max-w-xs px-6">
          <div className="h-12 w-12 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 shadow-[0_2px_6px_rgba(15,23,42,0.04)]">
            <FileX2 size={20} />
          </div>
          <div className="mt-4 text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
            No PDF selected
          </div>
          <div className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
            Pick a category and document, or click a citation to preview the source.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-y-auto bg-zinc-100 dark:bg-zinc-900 p-6 scrollbar-zinc"
    >
      {/* Floating page indicator */}
      {numPages > 0 && (
        <div className="sticky top-0 z-10 flex justify-center -mt-2 mb-2 pointer-events-none">
          <div className="pointer-events-auto rounded-full bg-zinc-900/85 backdrop-blur text-white text-[11px] font-medium px-2.5 py-1 shadow-[0_2px_6px_rgba(15,23,42,0.15)]">
            Page {page} / {numPages}
          </div>
        </div>
      )}
      <Document
        file={url}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading={
          <div className="text-[13px] text-zinc-500 dark:text-zinc-400 text-center py-10">
            Loading PDF…
          </div>
        }
        error={
          <div className="text-[13px] text-red-600 text-center py-10">
            Failed to load PDF.
          </div>
        }
        className="flex flex-col items-center"
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            ref={(el) => {
              pageRefs.current[n] = el;
            }}
            className={[
              "mb-5 rounded-lg overflow-hidden transition-all bg-white",
              n === page
                ? "ring-2 ring-emerald-500 shadow-[0_6px_24px_rgba(15,23,42,0.18)]"
                : "shadow-[0_2px_10px_rgba(15,23,42,0.08)]",
            ].join(" ")}
          >
            <Page
              pageNumber={n}
              width={720}
              renderTextLayer
              renderAnnotationLayer={false}
              customTextRenderer={customTextRenderer}
            />
          </div>
        ))}
      </Document>
    </div>
  );
}
