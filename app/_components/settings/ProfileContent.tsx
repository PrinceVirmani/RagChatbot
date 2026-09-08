"use client";

import Image from "next/image";

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

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondaryValue?: string;
}

function InfoRow({ icon, label, value, secondaryValue }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 w-[140px] sm:w-[200px] shrink-0">
        {icon}
        <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {label}
        </span>
      </div>
      <div className="flex-1 flex items-center gap-1">
        <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
          {value}
        </span>
        {secondaryValue && (
          <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
            {secondaryValue}
          </span>
        )}
      </div>
    </div>
  );
}

export function ProfileContent() {
  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Profile Picture Section */}
      <Section title="Profile picture" description="Update your avatar image.">
        <div className="flex flex-col gap-3">
          {/* Avatar and Upload Info */}
          {/* Mobile: avatar and text side by side; Desktop: stacked */}
          <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
            {/* Avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ebebeb]">
              <span className="text-base text-[#171717]">JB</span>
            </div>

            {/* Upload Info */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
                Upload image
              </span>
              <span className="text-xs text-[#a3a3a3]">
                Min 400x400px, PNG or JPEG formats.
              </span>
            </div>
          </div>

          {/* Upload Button */}
          <button
            className="w-[290px] sm:w-auto self-end sm:self-start flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
            style={{
              boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
            }}
          >
            Upload
          </button>
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Personal Information Section */}
      <Section title="Personal information" description="Edit your account details.">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Header with name and edit button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[13.5px] font-medium text-[#171717] tracking-[-0.084px]">
                James Brown
              </span>
              <span className="text-xs text-[#a3a3a3]">
                Member since <span className="text-[#5c5c5c]">May 16, 2025</span>
              </span>
            </div>

            {/* Edit Profile Button */}
            <button
              className="shrink-0 flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
              }}
            >
              Edit profile
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#ebebeb]" />

          {/* Info Rows */}
          <div className="flex flex-col gap-3.5 md:gap-4">
            <InfoRow
              icon={
                <Image
                  src="/settings/people/fullname.svg"
                  alt="Full name"
                  width={16}
                  height={16}
                />
              }
              label="Full name"
              value="James Brown"
            />
            <InfoRow
              icon={
                <Image
                  src="/settings/people/mail-fill (1).svg"
                  alt="Email address"
                  width={20}
                  height={20}
                />
              }
              label="Email address"
              value="james@alignui.com"
            />
            <InfoRow
              icon={
                <Image
                  src="/settings/people/time-fill.svg"
                  alt="Time zone"
                  width={20}
                  height={20}
                />
              }
              label="Time zone"
              value="UTC-05:00"
              secondaryValue="(Eastern Time)"
            />
            <InfoRow
              icon={
                <Image
                  src="/settings/people/language.svg"
                  alt="Language"
                  width={20}
                  height={20}
                />
              }
              label="Language"
              value="English"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}
