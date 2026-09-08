"use client";

import Image from "next/image";

interface ProjectSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ProjectSearchBar({ value, onChange, placeholder = "Search projects..." }: ProjectSearchBarProps) {
  return (
    <div
      className="flex items-center gap-2 w-full max-w-[700px] p-[10px] rounded-[14px] bg-white"
      style={{
        boxShadow: `
          0px 3px 3px -1.5px rgba(23, 23, 23, 0.04),
          0px 1px 1px -0.5px rgba(23, 23, 23, 0.04),
          0px 0px 0px 1px rgba(23, 23, 23, 0.08)
        `,
      }}
    >
      <Image
        src="/project/search-icon.svg"
        alt="Search"
        width={20}
        height={20}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 text-[14px] font-normal leading-5 tracking-[-0.084px] text-[#171717] placeholder:text-[#A3A3A3] bg-transparent border-none outline-none"
      />
    </div>
  );
}
