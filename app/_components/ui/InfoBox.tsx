"use client";

import Image from "next/image";

interface InfoBoxProps {
  title: string;
  description: string;
}

export function InfoBox({ title, description }: InfoBoxProps) {
  return (
    <div className="flex items-start gap-[10px] p-[14px] bg-[#F7F7F7] rounded-[14px]">
      <div className="shrink-0 mt-[3px]">
        <Image
          src="/icons/warn.svg"
          alt="Warning"
          width={15}
          height={15}
        />
      </div>
      <div className="flex flex-col gap-[6px]">
        <p className="text-[14px] leading-5 tracking-[-0.084px] text-[#5C5C5C]">
          {title}
        </p>
        <p className="text-[14px] leading-5 tracking-[-0.084px] text-[#A3A3A3]">
          {description}
        </p>
      </div>
    </div>
  );
}
