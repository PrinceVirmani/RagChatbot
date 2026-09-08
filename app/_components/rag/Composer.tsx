"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function Composer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [text]);

  const submit = () => {
    const v = text.trim();
    if (!v || disabled) return;
    onSend(v);
    setText("");
  };

  const canSend = !disabled && text.trim().length > 0;

  return (
    <div className="px-4 pb-4 pt-2 bg-white dark:bg-zinc-950">
      <div
        className={[
          "flex items-end gap-2 rounded-2xl border bg-white dark:bg-zinc-900 px-3 py-2.5 transition-all",
          "shadow-[0_2px_6px_rgba(15,23,42,0.04)]",
          disabled
            ? "border-zinc-200 dark:border-zinc-800 opacity-70"
            : "border-zinc-200 dark:border-zinc-800 focus-within:border-emerald-500 focus-within:shadow-[0_2px_10px_rgba(15,23,42,0.08)]",
        ].join(" ")}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={disabled ? "Pick a category first…" : "Ask a question about the PDFs…"}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none bg-transparent text-[14px] leading-5 font-medium tracking-[-0.006em] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none disabled:cursor-not-allowed max-h-[200px] py-1.5 scrollbar-zinc"
        />
        <button
          onClick={submit}
          disabled={!canSend}
          aria-label="Send message"
          className={[
            "shrink-0 h-9 w-9 rounded-[10px] flex items-center justify-center transition-all",
            canSend
              ? "bg-zinc-900 hover:bg-zinc-800 text-white shadow-[0_2px_6px_rgba(15,23,42,0.15)]"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed",
          ].join(" ")}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </div>
      <div className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500 px-1">
        Press <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 font-mono text-[10px]">Enter</kbd> to send,{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 font-mono text-[10px]">Shift+Enter</kbd> for newline.
      </div>
    </div>
  );
}
