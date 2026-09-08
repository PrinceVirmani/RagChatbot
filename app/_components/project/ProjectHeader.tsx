"use client";

import Image from "next/image";

interface ProjectHeaderProps {
  onCreateProject?: () => void;
}

export function ProjectHeader({ onCreateProject }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-[6px] w-full items-center lg:items-start text-center lg:text-left">
      <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full border border-[#F5F5F5] bg-white mb-4 mx-auto lg:mx-0">
        <Image
          src="/project/folder.svg"
          alt="Projects"
          width={21}
          height={19}
        />
      </div>
      <div className="flex flex-col items-center gap-3 w-full lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-[18px] font-medium leading-6 tracking-[-0.27px] text-[#171717]">
          Projects
        </h1>
        <button
          onClick={onCreateProject}
          className="hidden lg:flex items-center justify-center gap-[2px] px-2 py-[6px] rounded-[10px] bg-[#262626] hover:bg-[#333333] transition-colors"
        >
          <Image
            src="/project/add-icon.svg"
            alt="Add"
            width={20}
            height={20}
          />
          <span className="text-[14px] leading-5 tracking-[-0.084px] text-white">
            Create project
          </span>
        </button>
      </div>
      <p className="text-[14px] leading-5 tracking-[-0.084px] text-[#A3A3A3] max-w-[320px] lg:max-w-none mx-auto lg:mx-0">
        Easily manage and explore all your active projects in one place
      </p>
    </div>
  );
}
