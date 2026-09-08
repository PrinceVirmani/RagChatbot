"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquareText, Trash2, Sparkles } from "lucide-react";
// Per-category UI (preserved for re-enable):
// import { BookOpen } from "lucide-react";
// import CategorySelect from "./CategorySelect";
// import { labelFor, type CategoryId } from "@/app/lib/categories";
import Composer from "./Composer";
import MessageBubble from "./MessageBubble";
import {
  clearMessages,
  streamChat,
  type Citation,
} from "@/app/lib/ragApi";

interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  streaming?: boolean;
}

const SUGGESTIONS = [
  "What is the carbon equivalent formula in MSS SP-75 and its maximum allowed value?",
  "What is the scope of API 670?",
  "What does IS 5572 classify, and what zones does it define?",
  "What are the inspection document types defined by EN 10204, and what is the key difference between 3.1 and 3.2?",
  "What does ASME B16.9 cover?",
];

export default function ChatPanel({
  onCitationClick,
}: {
  // Per-category props (preserved for re-enable):
  // category: CategoryId | null;
  // onCategoryChange: (id: CategoryId) => void;
  onCitationClick: (c: Citation) => void;
}) {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Per-category clear-on-change effect (preserved for re-enable):
  // useEffect(() => {
  //   setMessages([]);
  // }, [category]);

  const send = async (text: string) => {
    if (busy) return;

    const userMsg: UiMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    const assistantMsg: UiMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: "",
      citations: [],
      streaming: true,
    };
    setMessages((p) => [...p, userMsg, assistantMsg]);
    setBusy(true);

    try {
      await streamChat({
        question: text,
        onHeader: (citations) => {
          setMessages((p) =>
            p.map((m) =>
              m.id === assistantMsg.id ? { ...m, citations } : m
            )
          );
        },
        onDelta: (delta) => {
          setMessages((p) =>
            p.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: m.content + delta }
                : m
            )
          );
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "error";
      setMessages((p) =>
        p.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: `Error: ${msg}`, streaming: false }
            : m
        )
      );
    } finally {
      setMessages((p) =>
        p.map((m) =>
          m.id === assistantMsg.id ? { ...m, streaming: false } : m
        )
      );
      setBusy(false);
    }
  };

  const onClear = async () => {
    if (busy) return;
    if (!confirm("Clear all messages?")) return;
    await clearMessages();
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex h-9 w-9 shrink-0 rounded-[10px] bg-linear-to-br from-emerald-500 to-emerald-600 items-center justify-center text-white shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
            <MessageSquareText size={16} strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold tracking-[-0.006em] text-zinc-900 dark:text-zinc-100 truncate">
              RAG Assistant
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              Grounded in your library
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Per-category selector (preserved for re-enable):
          <CategorySelect
            value={category}
            onChange={onCategoryChange}
            disabled={busy}
          />
          */}
          <button
            onClick={onClear}
            disabled={busy || messages.length === 0}
            title="Clear thread"
            aria-label="Clear thread"
            className="inline-flex items-center justify-center h-9 w-9 rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-zinc-500 disabled:hover:bg-white dark:disabled:hover:bg-zinc-900 disabled:hover:border-zinc-200 dark:disabled:hover:border-zinc-800 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 scrollbar-zinc">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
        {/* Per-category empty state (preserved for re-enable):
        {!category && (
          <EmptyState
            icon={<BookOpen size={20} />}
            title="Select a category"
            body="Choose one of the engineering libraries above to begin chatting with its documents."
          />
        )}
        */}
        {messages.length === 0 && (
          <EmptyState
            icon={<Sparkles size={20} />}
            title="Ask anything about your library"
            body="Questions are grounded in your uploaded PDFs and answered with citations."
            suggestions={SUGGESTIONS}
            onSuggest={(s) => send(s)}
            disabled={busy}
          />
        )}
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            content={m.content}
            citations={m.citations}
            streaming={m.streaming}
            onCitationClick={onCitationClick}
          />
        ))}
        <div ref={endRef} />
        </div>
      </div>

      <div className="w-full bg-white dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <Composer onSend={send} disabled={busy} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
  suggestions,
  onSuggest,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  suggestions?: string[];
  onSuggest?: (s: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto pt-12 pb-6">
      <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shadow-[0_2px_6px_rgba(15,23,42,0.04)]">
        {icon}
      </div>
      <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.011em] text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        {body}
      </p>
      {suggestions && suggestions.length > 0 && (
        <div className="mt-6 flex flex-col gap-2 w-full">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSuggest?.(s)}
              disabled={disabled}
              className="group text-left text-[13px] text-zinc-700 dark:text-zinc-300 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-500/5 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
