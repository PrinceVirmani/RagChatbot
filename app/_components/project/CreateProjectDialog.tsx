"use client";

import { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { InfoBox } from "../ui/InfoBox";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject?: (projectName: string) => void;
}

export function CreateProjectDialog({
  isOpen,
  onClose,
  onCreateProject,
}: CreateProjectDialogProps) {
  const [projectName, setProjectName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Reset input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setProjectName("");
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (projectName.trim()) {
      onCreateProject?.(projectName.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && projectName.trim()) {
      handleCreate();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create a project"
      subtitle="Attach relevant files to help your agent give better answers."
      actions={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-[10px] border border-[#EBEBEB] bg-white text-[14px] leading-5 tracking-[-0.084px] text-[#5C5C5C] hover:bg-[#F7F7F7] transition-colors max-[480px]:flex-1"
            style={{
              boxShadow: "0px 1px 2px 0px rgba(10, 13, 20, 0.03)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!projectName.trim()}
            className="px-3 py-2 rounded-[12px] bg-[#1DAF61] text-[14px] leading-5 tracking-[-0.084px] text-white hover:bg-[#199B56] transition-colors disabled:opacity-50 disabled:cursor-not-allowed max-[480px]:flex-1"
          >
            Create project
          </button>
        </>
      }
    >
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="e.g. Birthday Part Planning"
        className={`w-full px-4 py-3 rounded-[14px] text-[15px] leading-6 tracking-[-0.09px] outline-none ${
          isHovered ? "placeholder:text-[#5C5C5C]" : "placeholder:text-[#A3A3A3]"
        } text-[#171717]`}
        style={{
          backgroundColor: isFocused
            ? "#FFFFFF"
            : isHovered
            ? "var(--bg-weak-50, #F7F7F7)"
            : "#FFFFFF",
          color: "#171717",
          caretColor: "#171717",
          boxShadow: isFocused
            ? `0px 0px 0px 2px #1DAF61`
            : `0px 3px 3px -1.5px rgba(23, 23, 23, 0.04),
               0px 1px 1px -0.5px rgba(23, 23, 23, 0.04),
               0px 0px 0px 1px rgba(23, 23, 23, 0.08)`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      <InfoBox
        title="What's a project?"
        description="Projects keep chats, files, and custom instructions in one place. Use them for ongoing work, or just to keep things tidy."
      />
    </Dialog>
  );
}
