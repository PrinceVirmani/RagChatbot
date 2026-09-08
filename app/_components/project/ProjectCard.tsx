"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  updatedAt: string;
  onClick?: () => void;
  onPin?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}


export function ProjectCard({
  title,
  description,
  updatedAt,
  onClick,
  onPin,
  onRename,
  onDelete,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
    setIsMenuOpen(false);
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!isMenuOpen) setIsMenuOpen(false);
      }}
      className={`relative flex flex-col gap-6 p-6 rounded-[20px] cursor-pointer transition-all w-full max-w-[342px] min-[360px]:w-[342px] h-[184px] ${
        isHovered ? "bg-[#F7F7F7]" : "bg-white"
      }`}
      style={{
        boxShadow: `
          0px 3px 3px -1.5px rgba(23, 23, 23, 0.04),
          0px 1px 1px -0.5px rgba(23, 23, 23, 0.04),
          0px 0px 0px 1px rgba(23, 23, 23, 0.08)
        `,
      }}
    >
      {/* 3-dot menu button */}
      {(isHovered || isMenuOpen || isMobile) && (
        <div className="absolute top-4 right-4" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="p-1 rounded-lg hover:bg-[#EBEBEB] transition-colors"
          >
            <Image
              src="/ChatBoxImages/more-2-line.svg"
              alt="More"
              width={20}
              height={20}
            />
          </button>

          {/* Dropdown menu */}
          {isMenuOpen && (
            <div
              className="absolute top-8 right-0 w-[148px] bg-white rounded-[18px] p-1 z-10 border border-[#F0F0F0]"
              style={{
                boxShadow: "0px 14px 30px rgba(0, 0, 0, 0.08)",
              }}
            >
              <button
                onClick={(e) => handleMenuItemClick(e, onPin)}
                className="group/item flex items-center gap-2 w-full px-2 py-[6px] rounded-lg hover:bg-[#F7F7F7] transition-colors"
              >
                <Image
                  src="/project/pushpin-line.svg"
                  alt="Pin"
                  width={16}
                  height={16}
                />
                <span className="text-[12px] leading-4 text-[#5C5C5C] group-hover/item:text-[#171717] transition-colors">
                  Pinned
                </span>
              </button>
              <button
                onClick={(e) => handleMenuItemClick(e, onRename)}
                className="group/item flex items-center gap-2 w-full px-2 py-[6px] rounded-lg hover:bg-[#F7F7F7] transition-colors"
              >
                <Image
                  src="/project/pencil.svg"
                  alt="Rename"
                  width={12}
                  height={12}
                />
                <span className="text-[12px] leading-4 text-[#5C5C5C] group-hover/item:text-[#171717] transition-colors">
                  Rename
                </span>
              </button>
              <button
                onClick={(e) => handleMenuItemClick(e, onDelete)}
                className="group/item flex items-center gap-2 w-full px-2 py-[6px] rounded-lg hover:bg-[#F7F7F7] transition-colors"
              >
                <Image
                  src="/project/delete-bin-line.svg"
                  alt="Delete"
                  width={16}
                  height={16}
                />
                <span className="text-[12px] leading-4 text-[#5C5C5C] group-hover/item:text-[#171717] transition-colors">
                  Delete
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col gap-6">
        <Image
          src={isHovered ? "/project/fill-project.svg" : "/project/folder-fill.svg"}
          alt="Folder"
          width={18}
          height={16}
          className="transition-all duration-200"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] leading-6 tracking-[-0.176px] text-[#171717] truncate">
            {title}
          </h3>
          <p className="text-[14px] leading-5 tracking-[-0.084px] text-[#A3A3A3] line-clamp-2">
            {description}
          </p>
        </div>
      </div>
      <span className="mt-auto text-[12px] leading-4 text-[#A3A3A3]">{updatedAt}</span>
    </div>
  );
}
