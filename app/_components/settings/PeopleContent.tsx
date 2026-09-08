"use client";

import { useState } from "react";
import NextImage from "next/image";

// SVG Icons
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5833 14.5833L17.5 17.5M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 5.41667C10.4602 5.41667 10.8333 5.04357 10.8333 4.58333C10.8333 4.1231 10.4602 3.75 10 3.75C9.53976 3.75 9.16667 4.1231 9.16667 4.58333C9.16667 5.04357 9.53976 5.41667 10 5.41667Z" fill="#A3A3A3"/>
    <path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16667 10 9.16667C9.53976 9.16667 9.16667 9.53976 9.16667 10C9.16667 10.4602 9.53976 10.8333 10 10.8333Z" fill="#A3A3A3"/>
    <path d="M10 16.25C10.4602 16.25 10.8333 15.8769 10.8333 15.4167C10.8333 14.9564 10.4602 14.5833 10 14.5833C9.53976 14.5833 9.16667 14.9564 9.16667 15.4167C9.16667 15.8769 9.53976 16.25 10 16.25Z" fill="#A3A3A3"/>
  </svg>
);

// Spectrum Logo Component (from public/settings/Logo.svg with circular border)
const SpectrumLogo = () => (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ebebeb] bg-white">
    <NextImage
      src="/settings/Logo.svg"
      alt="Workspace logo"
      width={20}
      height={20}
    />
  </div>
);

interface AvatarProps {
  initials: string;
  bgColor: string;
  textColor?: string;
}

function Avatar({ initials, bgColor, textColor = "#171717" }: AvatarProps) {
  return (
    <div
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: bgColor }}
    >
      <span
        className="text-xs font-medium"
        style={{ color: textColor }}
      >
        {initials}
      </span>
    </div>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="flex items-center justify-between md:justify-start gap-3">
      <span className="md:w-[200px] text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
        {label}
      </span>
      <span className="md:flex-1 text-[13.5px] text-[#171717] tracking-[-0.084px]">
        {value}
      </span>
    </div>
  );
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Member";
  initials: string;
  avatarBg: string;
  avatarTextColor: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Sophia Williams",
    email: "sophia@gmail.com",
    role: "Admin",
    initials: "S",
    avatarBg: "#ffecc0",
    avatarTextColor: "#624c18",
  },
  {
    id: "2",
    name: "James Brown",
    email: "james@gmail.com",
    role: "Admin",
    initials: "J",
    avatarBg: "#ebebeb",
    avatarTextColor: "#171717",
  },
  {
    id: "3",
    name: "Arthur Taylor",
    email: "arthur@gmail.com",
    role: "Member",
    initials: "A",
    avatarBg: "#c0d5ff",
    avatarTextColor: "#122368",
  },
  {
    id: "4",
    name: "Emma Wright",
    email: "sophia@gmail.com",
    role: "Member",
    initials: "E",
    avatarBg: "#c0eaff",
    avatarTextColor: "#124b68",
  },
];

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-start">
      <div className="flex flex-col gap-1 md:w-[300px] shrink-0">
        <span className="text-[13.5px] font-medium text-[#171717] tracking-[-0.084px]">
          {title}
        </span>
        <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {description}
        </span>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

interface MemberRowProps {
  member: TeamMember;
}

function MemberRow({ member }: MemberRowProps) {
  const isAdmin = member.role === "Admin";

  return (
    <div className="flex items-center gap-2.5">
      {/* Avatar and Name */}
      <div className="flex items-center gap-2 sm:w-[200px]">
        <Avatar
          initials={member.initials}
          bgColor={member.avatarBg}
          textColor={member.avatarTextColor}
        />
        <span className="text-[13.5px] text-[#171717] tracking-[-0.084px] truncate">
          {member.name}
        </span>
      </div>

      {/* Email */}
      <span className="flex-1 text-[13.5px] text-[#a3a3a3] tracking-[-0.084px] truncate text-right sm:text-left sm:w-[176px] sm:flex-none">
        {member.email}
      </span>

      {/* Role Badge - Desktop only */}
      <div className="hidden sm:flex flex-1">
        <span
          className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-[6px] text-xs font-medium ${
            isAdmin
              ? "bg-[#dcfce7] text-[#22c55e]"
              : "bg-[#f5f5f5] text-[#7b7b7b]"
          }`}
        >
          {member.role}
        </span>
      </div>

      {/* More Button - Desktop only */}
      <button className="hidden sm:block p-0.5 rounded hover:bg-[#f7f7f7] transition-colors">
        <MoreIcon />
      </button>
    </div>
  );
}

export function PeopleContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  const filteredMembers = TEAM_MEMBERS.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All roles" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Team Overview Section */}
      <Section title="Team overview" description="Workspace statistics & details.">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Profile Row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Logo and Info */}
            <div className="flex items-center gap-3 flex-1">
              {/* Logo */}
              <SpectrumLogo />

              {/* Name & Date */}
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <span className="text-[13.5px] font-medium text-[#171717] tracking-[-0.084px]">
                  Spectrum™
                </span>
                <span className="text-xs text-[#a3a3a3]">
                  Team created date <span className="text-[#5c5c5c]">May 18, 2025</span>
                </span>
              </div>
            </div>

            {/* Manage Button */}
            <button
              className="w-[290px] sm:w-auto self-end sm:self-auto flex items-center justify-center gap-0.5 px-2 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
              }}
            >
              <span className="px-1">Manage</span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#ebebeb]" />

          {/* Details */}
          <div className="flex flex-col gap-3 md:gap-3.5">
            <DetailItem label="Used seats" value="3/10 seats" />
            <DetailItem label="Admins" value="2 members" />
            <DetailItem label="Pending invites" value="1 invite" />
            <DetailItem label="Active today" value="3 members" />
          </div>
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Members Section */}
      <Section title="Members" description="User roles and permissions.">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Filter Row */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div
              className="flex flex-1 items-center gap-2 px-2.5 py-1.5 rounded-[10px] bg-white"
              style={{
                boxShadow: "0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 0px 0px 1px rgba(23,23,23,0.08)"
              }}
            >
              <SearchIcon />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-[13.5px] text-[#171717] placeholder-[#a3a3a3] tracking-[-0.084px] outline-none"
              />
            </div>

            {/* Role Filter */}
            <button
              className="shrink-0 flex items-center justify-center gap-1 pl-3 pr-2 py-1.5 rounded-[10px] bg-white"
              style={{
                boxShadow: "0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 0px 0px 1px rgba(23,23,23,0.08)"
              }}
            >
              <span className="text-[13.5px] text-[#5c5c5c] tracking-[-0.084px]">
                {roleFilter}
              </span>
              <ChevronDownIcon />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#ebebeb]" />

          {/* Members List */}
          <div className="flex flex-col gap-4 md:gap-5">
            {filteredMembers.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
