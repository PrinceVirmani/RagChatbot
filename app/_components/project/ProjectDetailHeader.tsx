"use client";

import Image from "next/image";
import Link from "next/link";

export function ProjectDetailHeader() {
  return (
    <div className="hidden lg:flex items-center px-6 py-4 shrink-0">
      <Link
        href="/project"
        className="flex items-center gap-3 text-[15px] font-normal leading-5 tracking-[-0.084px] text-[#5C5C5C] hover:text-[#171717] transition-colors"
      >
        <Image
          src="/project/arrow-left.svg"
          alt="Back to projects"
          width={14}
          height={9}
        />
        <span>All projects</span>
      </Link>
    </div>
  );
}
