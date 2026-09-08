"use client";

import { useLayoutEffect, useRef } from "react";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

export default function SplitView({
  left,
  right,
  rightVisible = true,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  rightVisible?: boolean;
}) {
  const rightRef = useRef<ImperativePanelHandle>(null);

  // Imperatively expand/collapse the right panel when `rightVisible` flips,
  // instead of swapping the rendered tree. Swapping the tree (e.g.
  // <div>{left}</div> vs <PanelGroup>...</PanelGroup>) remounts ChatPanel
  // and wipes the chat history — that was the regression.
  useLayoutEffect(() => {
    const p = rightRef.current;
    if (!p) return;
    if (rightVisible && p.isCollapsed()) p.expand();
    else if (!rightVisible && !p.isCollapsed()) p.collapse();
  }, [rightVisible]);

  return (
    <PanelGroup
      direction="horizontal"
      className="fixed inset-0 h-dvh w-screen bg-zinc-50 dark:bg-zinc-950"
    >
      <Panel defaultSize={rightVisible ? 35 : 100} minSize={25} order={1}>
        <div className="h-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          {left}
        </div>
      </Panel>
      <PanelResizeHandle
        className={
          rightVisible
            ? "group relative w-px bg-zinc-200 dark:bg-zinc-800 transition-colors data-[resize-handle-state=hover]:bg-emerald-500 data-[resize-handle-state=drag]:bg-emerald-500"
            : "hidden"
        }
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </PanelResizeHandle>
      <Panel
        ref={rightRef}
        collapsible
        collapsedSize={0}
        defaultSize={rightVisible ? 65 : 0}
        minSize={30}
        order={2}
      >
        <div className="h-full bg-zinc-50 dark:bg-zinc-950">{right}</div>
      </Panel>
    </PanelGroup>
  );
}
