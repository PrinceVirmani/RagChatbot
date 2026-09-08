"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "../ui/Dialog";

interface InstructionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (instructions: string) => void;
  initialInstructions?: string;
}

export function InstructionsDialog({
  isOpen,
  onClose,
  onSave,
  initialInstructions = "",
}: InstructionsDialogProps) {
  const [instructions, setInstructions] = useState(initialInstructions);
  const [isMobile, setIsMobile] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSave = () => {
    onSave?.(instructions);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Set project instructions"
      subtitle="Set clear behavioral guidelines that help your AI agent respond more effectively."
      width={700}
      height={485}
      actions={
        <>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-[10px] border border-[#EBEBEB] bg-white text-[14px] font-medium leading-5 tracking-[-0.084px] text-[#5C5C5C] hover:bg-[#F7F7F7] transition-colors max-[480px]:flex-1"
            style={{
              boxShadow: "0px 1px 2px 0px rgba(10, 13, 20, 0.03)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-[12px] bg-[#1DAF61] text-[14px] font-medium leading-5 tracking-[-0.084px] text-white hover:bg-[#199B56] transition-colors max-[480px]:flex-1"
          >
            Save instructions
          </button>
        </>
      }
    >
      {/* Info Banner - Mobile */}
      {isMobile && (
        <>
          <div className="flex items-center gap-2 w-full">
            <Image src="/project/warn.svg" width={16} height={16} alt="Info" />
            <span className="text-[13px] font-medium leading-4 text-[#A3A3A3]">
              These instructions shape tone and context.
            </span>
          </div>
          <div className="-mx-4 border-b border-[#EBEBEB] mt-3" />
        </>
      )}

      {/* Info Banner + Text Area Container */}
      <div
        className={`flex flex-col w-[650px] max-w-full flex-1 min-h-0 ${isMobile ? "" : "gap-2"}`}
      >
        {/* Info Banner - Desktop */}
        {!isMobile && (
          <div className="px-3 pt-2 pb-4 bg-[#F7F7F7] rounded-t-[19px]">
            <div className="flex items-center gap-2">
              <Image src="/project/warn.svg" width={16} height={16} alt="Info" />
              <span className="text-[12px] leading-4 text-[#525252]">
                These instructions shape tone and context.
              </span>
            </div>
          </div>
        )}

        {/* Text Area */}
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="e.g. Use a friendly tone and bullet points when listing features."
          className={`w-full flex-1 p-5 bg-white text-[15px] font-normal leading-6 tracking-[-0.6%] text-[#525252] placeholder:text-[#5C5C5C] placeholder:text-[15px] placeholder:font-normal placeholder:leading-6 placeholder:tracking-[-0.006em] resize-none outline-none transition-colors ${
            isMobile
              ? "rounded-[14px]"
              : "rounded-[19px] relative z-10 -mt-2"
          }`}
          style={{
            boxShadow: isFocused
              ? "0px 0px 0px 2px #1DAF61"
              : isMobile
              ? "0px 0px 0px 1px #EBEBEB"
              : `0px 0px 0px 1px rgba(23, 23, 23, 0.08),
                 0px 1px 1px -0.5px rgba(23, 23, 23, 0.04),
                 0px 3px 3px -1.5px rgba(23, 23, 23, 0.04)`,
          }}
        />
      </div>
    </Dialog>
  );
}
