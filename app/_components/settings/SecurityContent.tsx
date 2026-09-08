"use client";

import { useState } from "react";
import Image from "next/image";

// Toggle Switch Component
interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className="cursor-pointer transition-transform duration-150 ease-out"
    >
      <Image
        src={
          enabled
            ? "/sidebar/switch-on.svg"
            : "/sidebar/switch-off.svg"
        }
        alt="Toggle switch"
        width={40}
        height={30}
        style={{
          transform: enabled ? "translateX(1px)" : "translateX(0)",
        }}
      />
    </button>
  );
}

// Close/X Icon for session removal
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.00004 7.05719L11.3001 3.75714L12.2429 4.69998L8.94288 8.00003L12.2429 11.3001L11.3001 12.2429L8.00004 8.94288L4.69999 12.2429L3.75714 11.3001L7.05719 8.00003L3.75714 4.69998L4.69999 3.75714L8.00004 7.05719Z" fill="#A3A3A3"/>
  </svg>
);


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

interface ButtonRowProps {
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}

function ButtonRow({ title, description, buttonText, onClick }: ButtonRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
          {title}
        </span>
        <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {description}
        </span>
      </div>
      <button
        onClick={onClick}
        className="w-full sm:w-auto flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
        style={{
          boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

interface ToggleRowProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({ title, description, enabled, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-start sm:items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
          {title}
        </span>
        <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {description}
        </span>
      </div>
      <ToggleSwitch enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

interface Session {
  id: string;
  browser: string;
  icon: string;
  location: string;
  ip: string;
}

const SESSIONS: Session[] = [
  {
    id: "1",
    browser: "Google Chrome",
    icon: "/settings/Chrome OS.svg",
    location: "New York, US",
    ip: "108.62.8.33",
  },
  {
    id: "2",
    browser: "Arc",
    icon: "/settings/Arc.svg",
    location: "Los Angeles, US",
    ip: "173.13.91.22",
  },
  {
    id: "3",
    browser: "Mozilla Firefox",
    icon: "/settings/Firefox.svg",
    location: "London, UK",
    ip: "81.12.69.144",
  },
  {
    id: "4",
    browser: "Safari",
    icon: "/settings/Safari.svg",
    location: "Toronto, Canada",
    ip: "206.14.2.89",
  },
];

interface SessionRowProps {
  session: Session;
  onRemove: () => void;
}

function SessionRow({ session, onRemove }: SessionRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2.5">
      {/* Browser Icon and Name */}
      <div className="flex items-center justify-between sm:justify-start gap-2 sm:w-[160px]">
        <div className="flex items-center gap-2">
          <Image src={session.icon} alt={session.browser} width={20} height={20} />
          <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
            {session.browser}
          </span>
        </div>
        {/* Remove Button - Mobile */}
        <button
          onClick={onRemove}
          className="sm:hidden p-0.5 rounded hover:bg-[#f7f7f7] transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Location and IP - Mobile stacked */}
      <div className="flex items-center justify-between sm:flex-1 gap-2.5">
        {/* Location */}
        <span className="sm:w-[140px] text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {session.location}
        </span>

        {/* IP Address */}
        <span className="sm:flex-1 text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {session.ip}
        </span>
      </div>

      {/* Remove Button - Desktop */}
      <button
        onClick={onRemove}
        className="hidden sm:block p-0.5 rounded hover:bg-[#f7f7f7] transition-colors"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

export function SecurityContent() {
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [sessions, setSessions] = useState(SESSIONS);

  const removeSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Account Security Section */}
      <Section title="Account security" description="Password & login security settings.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ButtonRow
            title="Password"
            description="Last changed 3 months ago"
            buttonText="Change"
          />
          <ButtonRow
            title="Two-factor authentication"
            description="Add an extra layer of security to your account"
            buttonText="Enable 2FA"
          />
          <ToggleRow
            title="Login notifications"
            description="Get notified of new sign-ins"
            enabled={loginNotifications}
            onToggle={() => setLoginNotifications(!loginNotifications)}
          />
          <ButtonRow
            title="Password recovery"
            description="Update your recovery email address"
            buttonText="Update"
          />
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Access Control Section */}
      <Section title="Access control" description="Manage device access & sessions.">
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Active Sessions Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
                Active sessions
              </span>
              <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
                Manage your logged-in devices
              </span>
            </div>
            <button
              className="w-full sm:w-auto flex items-center justify-center px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
              style={{
                boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
              }}
            >
              View all
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#ebebeb]" />

          {/* Sessions List */}
          <div className="flex flex-col gap-4 md:gap-5">
            {sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                onRemove={() => removeSession(session.id)}
              />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
