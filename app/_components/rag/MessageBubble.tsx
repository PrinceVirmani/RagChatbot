"use client";

import React from "react";
import { Sparkles, User } from "lucide-react";
import { Streamdown } from "streamdown";
import type { Citation } from "@/app/lib/ragApi";

// Accepts both ASCII [N] and full-width 【N】. Some open-weight models
// (openai/gpt-oss-120b in particular) emit 【N】 no matter what the system
// prompt says — tested against an explicit "ASCII brackets only" rule and it
// ignored it every time. Matching both keeps citation chips working across a
// model switch instead of silently rendering the marker as plain text.
// m[0] is the whole marker, m[1] the number, so the split logic is unchanged.
const CITATION_RE = /[[【](\d+)[\]】]/g;

function CitationChip({
  n,
  c,
  onClick,
}: {
  n: number;
  c: Citation;
  onClick?: (c: Citation) => void;
}) {
  return (
    <button
      onClick={() => onClick?.(c)}
      className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 mx-0.5 align-[1px] rounded text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
      title={`${c.filename} — page ${c.page_number}`}
    >
      {n}
    </button>
  );
}

// Walk children, splitting any string leaves on [N] tokens and inserting
// CitationChip components where a matching citation exists. Recurses through
// inline markdown elements (strong, em, code, a, etc.) so chips work inside
// formatted text — table cells, list items, paragraphs, anywhere.
function injectCitations(
  children: React.ReactNode,
  map: Map<number, Citation>,
  onClick?: (c: Citation) => void,
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return splitStringOnCitations(child, map, onClick);
    }
    if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return React.cloneElement(
        child,
        undefined,
        injectCitations(child.props.children, map, onClick),
      );
    }
    return child;
  });
}

function splitStringOnCitations(
  text: string,
  map: Map<number, Citation>,
  onClick?: (c: Citation) => void,
): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let key = 0;
  const re = new RegExp(CITATION_RE.source, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    const n = Number(m[1]);
    const c = map.get(n);
    parts.push(
      c ? (
        <CitationChip key={key++} n={n} c={c} onClick={onClick} />
      ) : (
        m[0]
      ),
    );
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length === 1 ? parts[0] : parts;
}

// Helper to build a Streamdown components-prop override for a given text-bearing
// HTML element. The element receives its rendered children; we run the citation
// walker over them and re-render the same element.
function withCitations<Tag extends keyof React.JSX.IntrinsicElements>(
  Tag: Tag,
  map: Map<number, Citation>,
  onClick?: (c: Citation) => void,
) {
  const Component = (props: React.JSX.IntrinsicElements[Tag]) => {
    const { children, ...rest } = props as { children?: React.ReactNode };
    return React.createElement(
      Tag,
      rest,
      injectCitations(children, map, onClick),
    );
  };
  Component.displayName = `WithCitations(${String(Tag)})`;
  return Component;
}

function TypingDots() {
  return (
    <div
      className="flex items-center gap-1 py-2"
      role="status"
      aria-label="Assistant is typing"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" />
    </div>
  );
}

export default function MessageBubble({
  role,
  content,
  citations,
  streaming,
  onCitationClick,
}: {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  streaming?: boolean;
  onCitationClick?: (c: Citation) => void;
}) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 group">
        <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-tr-md bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 text-[14px] leading-relaxed text-white dark:text-zinc-900 whitespace-pre-wrap shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
          {content}
        </div>
        <div className="shrink-0 h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
          <User size={14} />
        </div>
      </div>
    );
  }

  const map = new Map<number, Citation>();
  (citations || []).forEach((c) => map.set(c.n, c));

  // Override only the text-bearing tags. Block-level tags (ul, ol, table, etc.)
  // pass children through, so their inner text-bearing elements get the chips.
  const components = {
    p: withCitations("p", map, onCitationClick),
    li: withCitations("li", map, onCitationClick),
    td: withCitations("td", map, onCitationClick),
    th: withCitations("th", map, onCitationClick),
    h1: withCitations("h1", map, onCitationClick),
    h2: withCitations("h2", map, onCitationClick),
    h3: withCitations("h3", map, onCitationClick),
    h4: withCitations("h4", map, onCitationClick),
    blockquote: withCitations("blockquote", map, onCitationClick),
  };

  const used = (citations || []).filter((c) =>
    new RegExp(`[[【]${c.n}[\\]】]`).test(content),
  );

  return (
    <div className="flex gap-3">
      <div className="shrink-0 h-8 w-8 rounded-full bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
        <Sparkles size={14} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-3 pt-1">
        {streaming && !content.trim() ? (
          <TypingDots />
        ) : (
          <div
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200
              prose-p:my-1.5 prose-p:leading-relaxed
              prose-headings:mt-3 prose-headings:mb-1
              prose-table:my-2 prose-table:text-[13px] prose-table:border-collapse
              prose-th:bg-zinc-50 dark:prose-th:bg-zinc-900
              prose-th:px-3 prose-th:py-1.5 prose-th:text-left prose-th:font-semibold
              prose-th:border prose-th:border-zinc-200 dark:prose-th:border-zinc-800
              prose-td:px-3 prose-td:py-1.5 prose-td:align-top
              prose-td:border prose-td:border-zinc-200 dark:prose-td:border-zinc-800
              prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5
              prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-lg prose-pre:my-2
              prose-code:before:hidden prose-code:after:hidden
              prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em]
              prose-a:text-emerald-600 dark:prose-a:text-emerald-400"
          >
            <Streamdown
              parseIncompleteMarkdown
              components={components}
            >
              {content}
            </Streamdown>
          </div>
        )}
        {used.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 self-center mr-1">
              Sources:
            </span>
            {used.map((c) => (
              <button
                key={c.n}
                onClick={() => onCitationClick?.(c)}
                className="group inline-flex items-center gap-1.5 text-[11px] pl-1 pr-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                title={`Jump to ${c.filename} · page ${c.page_number}`}
              >
                <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-500/30 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20">
                  {c.n}
                </span>
                <span className="max-w-[200px] truncate text-zinc-700 dark:text-zinc-300 font-medium">
                  {c.filename}
                </span>
                <span className="text-zinc-400 dark:text-zinc-500">
                  · p.{c.page_number}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
