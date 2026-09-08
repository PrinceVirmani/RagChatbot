"use client";

import { Shield } from "lucide-react";

export function PrivacyDataSettings() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-zinc-200 rounded-xl dark:border-zinc-800">
      <div className="rounded-full bg-zinc-100 p-3 mb-4 dark:bg-zinc-800">
        <Shield className="h-6 w-6 text-zinc-400" />
      </div>
      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Privacy & Data</h3>
      <p className="text-sm text-zinc-500 mt-1 max-w-xs dark:text-zinc-400">
        Manage your data privacy settings and export options.
      </p>
    </div>
  );
}
