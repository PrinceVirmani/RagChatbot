"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "../ui/Dialog";

type ProjectFileType = "pdf" | "word" | "excel" | "ppt";

interface ProjectFile {
  id: string;
  name: string;
  type: ProjectFileType;
}

const MOCK_PROJECT_FILES: ProjectFile[] = [
  { id: "1", name: "project-license-agreement.pdf", type: "pdf" },
  { id: "2", name: "chat-history-1124204.pdf", type: "pdf" },
  { id: "3", name: "user-manual-v1.docx", type: "word" },
  { id: "4", name: "data-sheet.xlsx", type: "excel" },
  { id: "5", name: "presentation.pptx", type: "ppt" },
];

const FILE_TYPE_META: Record<ProjectFileType, { icon: string; label: string }> = {
  pdf: { icon: "/project/pdf.svg", label: "PDF" },
  word: { icon: "/project/word.svg", label: "DOCX" },
  excel: { icon: "/project/excel.svg", label: "XLSX" },
  ppt: { icon: "/project/ppt.svg", label: "PPTX" },
};

interface ProjectFilesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  onSave?: () => void;
}

export function ProjectFilesDialog({
  isOpen,
  onClose,
  projectName,
  onSave,
}: ProjectFilesDialogProps) {
  const files = MOCK_PROJECT_FILES;
  const hasFiles = files.length > 0;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSave = () => {
    onSave?.();
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Upload project files"
      subtitle="Attach relevant files to help your agent give better answers."
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
            className="px-3 py-2 rounded-[12px] bg-[#1DAF61] text-[14px]  leading-5 tracking-[-0.084px] text-white hover:bg-[#199B56] transition-colors max-[480px]:flex-1"
          >
            Save project files
          </button>
        </>
      }
    >
      {/* Warning Banner - Mobile */}
      {isMobile && (
        <>
          <div className="flex items-center  gap-2 w-full">
            <Image src="/project/warn.svg" width={16} height={16} alt="Info" />
            <span className="text-[13px] font-medium leading-4 text-[#A3A3A3]">
              Responses may be lower quality due to file count.
            </span>
          </div>
          <div className="-mx-4 border-b border-[#EBEBEB] mt-3" />
        </>
      )}

      {/* Warning Banner + Files List */}
      <div className="flex flex-col w-full flex-1 min-h-0 overflow-hidden">
        {/* Warning Banner - Desktop */}
        {!isMobile && (
          <div className="px-3 pt-2 pb-4 bg-[#F7F7F7] rounded-t-[19px]">
            <div className="flex items-center gap-2">
              <Image src="/project/warn.svg" width={16} height={16} alt="Info" />
              <span className="text-[12px] leading-4 text-[#525252]">
                Responses may be lower quality due to file count.
              </span>
            </div>
          </div>
        )}

        {/* Files Area */}
        <div
          className={`flex w-full flex-col gap-[3px] flex-1 min-h-0 overflow-y-auto ${
            isMobile
              ? "bg-transparent p-0 mt-0"
              : "rounded-[19px] bg-white relative z-10 -mt-2 p-4"
          }`}
          style={
            isMobile
              ? {
                  minHeight: "220px",
                }
              : {
                  border: "1px solid #EBEBEB",
                  minHeight: "280px",
                  boxShadow: `
                    0px 0px 0px 1px rgba(23, 23, 23, 0.08),
                    0px 1px 1px -0.5px rgba(23, 23, 23, 0.04),
                    0px 3px 3px -1.5px rgba(23, 23, 23, 0.04)
                  `,
                }
          }
        >
          {hasFiles ? (
            files.map((file) => {
              const meta = FILE_TYPE_META[file.type];
              return (
                <div
                  key={file.id}
                  className="group flex items-center gap-3 rounded-[16px] bg-white px-[10px] pr-[16px] py-[10px] transition-colors hover:bg-[#F7F7F7] hover:pr-[14px]"
                  style={{ width: "100%", minHeight: "60px" }}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#F5F5F5] bg-white p-2">
                    <Image src={meta.icon} alt={`${meta.label} icon`} width={16} height={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium leading-5 text-[#171717] [letter-spacing:-0.006em] truncate">
                      {file.name}
                    </p>
                    <span className="text-[12px] font-medium leading-4 text-[#A3A3A3] uppercase tracking-[0.00em]">
                      {meta.label}
                    </span>
                  </div>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-white p-[6px] transition-all max-lg:opacity-100 max-lg:pointer-events-auto lg:opacity-0 lg:pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
                    style={{
                      boxShadow: "0px 1px 2px 0px rgba(10, 13, 20, 0.03)",
                    }}
                    aria-label={`Remove ${file.name}`}
                  >
                    <Image
                      src="/project/gray-bin.svg"
                      alt="Remove file"
                      width={15}
                      height={15}
                      className="lg:hidden"
                    />
                    <Image
                      src="/project/black-bin.svg"
                      alt="Remove file"
                      width={15}
                      height={15}
                      className="hidden lg:block"
                    />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-colors py-16">
              <Image src="/project/upload-folder.svg" alt="Upload folder" width={24} height={24} />
              <div className="flex flex-col items-center gap-2 max-w-[360px] text-center">
                <p className="text-[15px] text-[#A3A3A3]">
                  Upload documents, code files, images, and more. You can access{" "}
                  <span className="text-[#525252]">{projectName}</span> content during chat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
