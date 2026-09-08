"use client";

import Image from "next/image";

interface ProjectDetailInfoProps {
  title: string;
}


export function ProjectDetailInfo({ title }: ProjectDetailInfoProps) {
  return (
    <div className="flex flex-col gap-4 px-6 lg:items-start items-center pt-4 lg:pt-6">
      {/* Folder Icon - centered on mobile */}
      <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full border border-[#F5F5F5] bg-white">
        <Image
          src="/project/folder.svg"
          alt="Folder"
          width={21}
          height={19}
        />
      </div>

      {/* Title, Badge and Actions - Desktop */}
      <div className="hidden lg:flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[18px] leading-6 tracking-[-0.27px] text-[#171717]">
            {title}
          </h1>
          <div className="flex items-center gap-1 px-2 py-1 bg-[#F7F7F7] rounded-md">
            <Image
              src="/project/lock-icon.svg"
              alt="Private project"
              width={10}
              height={11}
            />
            <span className="text-[12px] leading-4 text-[#A3A3A3]">
              Private
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center justify-center w-8 h-8 hover:bg-[#F7F7F7] rounded-lg transition-colors">
            <Image
              src="/project/star-icon.svg"
              alt="Star"
              width={20}
              height={20}
            />
          </button>
          <button className="flex items-center justify-center w-8 h-8 hover:bg-[#F7F7F7] rounded-lg transition-colors">
            <Image
              src="/project/three-dot-open.svg"
              alt="More options"
              width={3}
              height={13}
            />
          </button>
        </div>
      </div>

      {/* Title and Badge - Mobile (stacked, centered) */}
      <div className="flex flex-col items-center gap-2 lg:hidden max-[479px]:flex-row max-[479px]:gap-3 max-[479px]:justify-center max-[479px]:items-center max-[479px]:text-center">
        <h1 className="text-[18px] leading-6 tracking-[-0.27px] text-[#171717]">
          {title}
        </h1>
        <div className="flex items-center gap-1 px-2 py-1 bg-[#F7F7F7] rounded-md">
          <Image
            src="/project/lock-icon.svg"
            alt="Private project"
            width={10}
            height={11}
          />
          <span className="text-[12px] leading-4 text-[#A3A3A3]">
            Private
          </span>
        </div>
      </div>
    </div>
  );
}
