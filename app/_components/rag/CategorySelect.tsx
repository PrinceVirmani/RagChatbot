"use client";

import { ChevronDown, FolderOpen } from "lucide-react";
import { CATEGORIES, type CategoryId } from "@/app/lib/categories";

export default function CategorySelect({
  value,
  onChange,
  disabled,
}: {
  value: CategoryId | null;
  onChange: (id: CategoryId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative inline-flex items-center">
      <span className="pointer-events-none absolute left-3 text-zinc-400 dark:text-zinc-500">
        <FolderOpen size={14} />
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value as CategoryId)}
        disabled={disabled}
        className="appearance-none rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-8 pr-9 py-2 text-[13px] font-medium text-zinc-800 dark:text-zinc-100 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-zinc-300 dark:hover:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[220px]"
      >
        <option value="" disabled>
          Select a category…
        </option>
        {CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 text-zinc-400 dark:text-zinc-500">
        <ChevronDown size={14} />
      </span>
    </div>
  );
}
