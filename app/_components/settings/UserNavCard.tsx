"use client";

import { ChevronRight } from "lucide-react";

interface UserNavCardProps {
  isActive?: boolean;
  onClick?: () => void;
}

export function UserNavCard({ isActive, onClick }: UserNavCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group w-full  p-2 rounded-lg text-left transition-colors ${
        isActive
          ? "bg-zinc-100 dark:bg-zinc-800"
          : "hover:bg-zinc-50 dark:hover:bg-zinc-900"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 shrink-0 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-600 dark:text-zinc-300 shadow-sm">
          JB
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-normal text-sm truncate ${
              isActive ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-200"
            }`}>
              James Brown
            </span>
            <span className="px-1 py-0.5 rounded bg-violet-100 text-[10px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              PRO
            </span>
          </div>
        </div>
        {/* Optional: Add Chevron if it behaves like other items, but usually large cards imply selection without chevron, or chevron is fine. User didn't ask for chevron specifically but "behave as other items". Standard items have chevron. I'll add it for consistency if it fits. */}
         <ChevronRight
            size={14}
            className={`ml-auto transition-opacity text-zinc-400 ${
              isActive ? "opacity-60" : "opacity-0 group-hover:opacity-50"
            }`}
          />
      </div>
    </button>
  );
}
