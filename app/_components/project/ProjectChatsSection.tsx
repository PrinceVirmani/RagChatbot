"use client";

import Image from "next/image";
import { useState } from "react";

interface Chat {
  id: string;
  title: string;
  description: string;
  time: string;
  iconColor: "gray" | "green";
}



interface ChatItemProps {
  chat: Chat;
}

function ChatItem({ chat }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile / Tablet layout */}
      <div className="group flex w-full cursor-pointer items-start gap-3 rounded-[18px] border border-[#F1F1F1] bg-white px-3 py-3 shadow-[0_4px_10px_rgba(23,23,23,0.04)] hover:border-[#E5E5E5] transition-colors lg:hidden">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#F1F1F1] bg-[#F9F9F9]">
          <Image src="/project/star.svg" alt="Star" width={16} height={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium leading-5 tracking-[-0.3px] text-[#171717]">
                {chat.title}
              </p>
              <p className="mt-1 text-[13px] leading-5 text-[#5C5C5C]">
                {chat.description}
              </p>
            </div>
            <button
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full hover:bg-[#F4F4F4]"
              aria-label="More options"
            >
              <Image
                src="/project/three-dot-open.svg"
                alt="More options"
                width={3}
                height={13}
              />
            </button>
          </div>
          {chat.time ? (
            <span className="mt-3 block text-[12px] leading-4 text-[#A3A3A3]">
              {chat.time}
            </span>
          ) : null}
        </div>
      </div>

      {/* Desktop layout */}
      <div
        className="group hidden lg:flex items-center justify-between h-11 rounded-[14px] border border-[#F5F5F5] bg-white hover:bg-[#FAFAFA] transition-colors cursor-pointer gap-[14px] pl-3 pr-[14px] py-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-[14px] flex-1 min-w-0">
          <Image
            src={isHovered ? "/project/green-star.svg" : "/project/star.svg"}
            alt="Star"
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[14px] font-medium leading-5 tracking-[-0.6%] text-[#171717]">
              {chat.title}
            </span>
            <span className="text-[14px] font-medium leading-5 tracking-[-0.6%] text-[#D1D1D1]">
              —
            </span>
            <span className="text-[14px] leading-5 text-[#A3A3A3] group-hover:text-[#525252] transition-colors truncate">
              {chat.description}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {isHovered ? (
            <button className="p-1 hover:bg-[#F7F7F7] rounded transition-colors">
              <Image
                src="/project/three-dot-open.svg"
                alt="More options"
                width={3}
                height={13}
              />
            </button>
          ) : chat.time ? (
            <span className="text-[12px] leading-4 text-[#A3A3A3]">
              {chat.time}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

interface ProjectChatsSectionProps {
  chats?: Chat[];
}

export function ProjectChatsSection({ chats = [] }: ProjectChatsSectionProps) {
  const hasChats = chats.length > 0;

  return (
    <div className="flex flex-col gap-4 px-6">
      <span className="text-[14px] leading-5 tracking-[-0.084px] text-[#A3A3A3]">
        Chats in this project
      </span>

      {hasChats ? (
        <div className="flex flex-col gap-3">
          {chats.map((chat) => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-12 bg-white rounded-[16px]"
          style={{
            boxShadow: `
              0px 3px 3px -1.5px rgba(23, 23, 23, 0.04),
              0px 1px 1px -0.5px rgba(23, 23, 23, 0.04),
              0px 0px 0px 1px rgba(23, 23, 23, 0.08)
            `,
          }}
        >
          <Image
            src="/project/star.svg"
            alt="Star"
            width={21}
            height={20}
          />
          <div className="flex flex-col items-center gap-1 mt-4 text-center max-w-[320px]">
            <p className="text-[14px] leading-5 tracking-[-0.084px] text-[#A3A3A3]">
              Start a chat to keep conversations organized and re-use project knowledge.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
