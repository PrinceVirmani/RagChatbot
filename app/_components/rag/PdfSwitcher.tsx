"use client";

import { ChevronDown, FileText, FileWarning } from "lucide-react";
import type { DocumentRow } from "@/app/lib/ragApi";

export default function PdfSwitcher({
  docs,
  activeId,
  onChange,
}: {
  docs: DocumentRow[];
  activeId: string | null;
  onChange: (id: string) => void;
}) {
  if (docs.length === 0) {
    return (
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center gap-2 text-[13px] text-zinc-500 dark:text-zinc-400 rounded-[10px] border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 px-3 py-2">
          <FileWarning size={14} className="text-zinc-400" />
          No documents in this category.
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
          <FileText size={14} />
        </span>
        <select
          value={activeId ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-9 pr-9 py-2 text-[13px] font-medium text-zinc-800 dark:text-zinc-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors"
        >
          {docs.map((d) => (
            <option key={d.id} value={d.id}>
              {d.filename} · {d.page_count}p
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
          <ChevronDown size={14} />
        </span>
      </div>
    </div>
  );
}
