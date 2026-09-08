"use client";

import { Zap } from "lucide-react";

export function AdvancedSettings() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-zinc-200 rounded-xl dark:border-zinc-800">
      <div className="rounded-full bg-zinc-100 p-3 mb-4 dark:bg-zinc-800">
        <Zap className="h-6 w-6 text-zinc-400" />
      </div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Advanced</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-xs dark:text-zinc-400">
        Access advanced configurations and developer tools.
      </p>
    </div>
  );
}
