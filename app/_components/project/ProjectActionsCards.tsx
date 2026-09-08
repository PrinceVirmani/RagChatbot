"use client";

import Image from "next/image";

interface ProjectFile {
  id: string;
  type: "excel" | "word" | "pdf";
}

interface ActionCardProps {
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
  files?: ProjectFile[];
  hasInstructions?: boolean;
}

function getFileIcon(type: ProjectFile["type"]) {
  switch (type) {
    case "excel":
      return "/project/excel.svg";
    case "word":
      return "/project/word.svg";
    case "pdf":
      return "/project/pdf.svg";
  }
}

function ActionCard({
  title,
  description,
  onClick,
  className,
  files,
  hasInstructions,
}: ActionCardProps) {
  const hasFiles = files && files.length > 0;

  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-between text-left px-2 pt-2 pb-3 transition-colors hover:bg-[#FAFAFA] ${className ?? ""}`}
    >
      <div className="flex flex-col gap-0.5 mt-0.5">
        <span className="text-[14px] leading-5 tracking-[-0.084px] text-[#171717]">
          {title}
        </span>
        <span className="text-[12px] leading-4 text-[#A3A3A3]">
          {description}
        </span>
      </div>

      {hasFiles ? (
        <div className="flex items-center gap-1">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-center w-7 h-7 bg-white rounded-[9px] border border-[#F5F5F5] p-1"
            >
              <Image
                src={getFileIcon(file.type)}
                alt={file.type}
                width={14}
                height={15}
              />
            </div>
          ))}
          <div className="flex items-center justify-center w-7 h-7 bg-white rounded-[9px] border border-[#F7F7F7] p-1 gap-0.5">
            <Image
              src="/project/plus.svg"
              alt="Add"
              width={11}
              height={11}
            />
          </div>
        </div>
      ) : hasInstructions ? (
        <div className="flex items-center justify-center w-7 h-7 bg-white rounded-[9px] border border-[#F7F7F7] p-1 gap-0.5">
          <Image
            src="/project/pencil.svg"
            alt="Edit"
            width={13}
            height={13}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-7 h-7 bg-white rounded-[9px] border border-[#F7F7F7] p-1 gap-0.5">
          <Image
            src="/project/plus.svg"
            alt="Add"
            width={11}
            height={11}
          />
        </div>
      )}
    </button>
  );
}

interface ProjectActionsCardsProps {
  onProjectFilesClick?: () => void;
  onInstructionsClick?: () => void;
  files?: ProjectFile[];
  instructionsText?: string;
  hasChats?: boolean;
}

export function ProjectActionsCards({
  onProjectFilesClick,
  onInstructionsClick,
  files,
  instructionsText,
  hasChats = false,
}: ProjectActionsCardsProps) {
  const showFiles = hasChats && files && files.length > 0;
  const showInstructions = hasChats && !!instructionsText;

  return (
    <div className="w-full bg-white rounded-b-[19px] rounded-t-none border border-[#E9E9E9] border-t-0 px-2 sm:px-4">
      <div className="flex flex-col min-[480px]:flex-row pt-5">
        <ActionCard
          title="Project files"
          description={showFiles ? `${files.length} files` : "No files added yet"}
          onClick={onProjectFilesClick}
          className="min-[480px]:pr-4"
          files={showFiles ? files : undefined}
        />
        {/* Vertical divider for row layout, horizontal for column layout */}
        <div className="hidden min-[480px]:flex items-center py-4">
          <div className="w-px h-full bg-[#E4E4E4]" />
        </div>
        <div className="min-[480px]:hidden w-full h-px bg-[#E4E4E4]" />
        <ActionCard
          title="Instructions"
          description={showInstructions ? instructionsText : "Set project behavior guidelines"}
          onClick={onInstructionsClick}
          className="min-[480px]:pl-4"
          hasInstructions={showInstructions}
        />
      </div>
    </div>
  );
}
