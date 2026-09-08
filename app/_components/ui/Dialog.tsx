"use client";

import { useEffect } from "react";
import Image from "next/image";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  width?: number;
  height?: number;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
  width = 548,
  height,
}: DialogProps) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex bg-[rgba(51,51,51,0.24)] items-end justify-center sm:items-center sm:px-0 px-0 pb-0 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[28px] sm:rounded-[28px] sm:px-6 px-4 py-5 flex flex-col gap-5 w-full sm:w-auto sm:max-w-none max-w-[548px] max-h-[calc(100vh-60px)] overflow-hidden"
        style={{
          width: "100%",
          maxWidth: `${width}px`,
          ...(height && { height: `${height}px` }),
          boxShadow: `
            0px 20px 20px -10px rgba(23, 23, 23, 0.04),
            0px 10px 10px -5px rgba(23, 23, 23, 0.04),
            0px 6px 6px -3px rgba(23, 23, 23, 0.04),
            0px 3px 3px -1.5px rgba(23, 23, 23, 0.04),
            0px 1px 1px -0.5px rgba(23, 23, 23, 0.04),
            0px 0px 0px 1px rgba(23, 23, 23, 0.08),
            inset 0px -1px 1px -0.5px rgba(23, 23, 23, 0.06)
          `,
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-1 flex-1">
            <h2 className="text-[16px] leading-6 tracking-[-0.176px] text-[#171717]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[14px] leading-5 tracking-[-0.084px] text-[#A3A3A3]">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#F7F7F7] transition-colors"
            aria-label="Close dialog"
          >
            <Image
              src="/project/close.svg"
              alt="Close"
              width={10}
              height={10}
            />
          </button>
        </div>

        {/* Divider below header - mobile only */}
        <div className="hidden max-sm:block -mx-4 border-b border-[#EBEBEB]" />

        {/* Content */}
        <div className="flex flex-col gap-3 w-full flex-1 min-h-0">
          {children}
        </div>

        {/* Divider above actions - mobile only */}
        {actions && <div className="hidden max-sm:block -mx-4 border-b border-[#EBEBEB]" />}

        {/* Actions */}
        {actions && (
          <div className="flex items-center justify-end gap-3 w-full max-[480px]:justify-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
