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

// Minus Icon
const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.33334 7.33333H12.6667V8.66666H3.33334V7.33333Z" fill="#A3A3A3"/>
  </svg>
);

// Plus Icon
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.33334 7.33333V3.33333H8.66668V7.33333H12.6667V8.66666H8.66668V12.6667H7.33334V8.66666H3.33334V7.33333H7.33334Z" fill="#A3A3A3"/>
  </svg>
);

// Chevron Down Icon
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

interface SelectRowProps {
  title: string;
  description: string;
  value: string;
  options?: string[];
}

function SelectRow({ title, description, value }: SelectRowProps) {
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
        className="flex items-center justify-start gap-1 px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
        style={{
          boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
        }}
      >
        {value}
        <ChevronDownIcon />
      </button>
    </div>
  );
}

interface NumberInputRowProps {
  title: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function NumberInputRow({ title, description, value, onChange, min = 1, max = 120 }: NumberInputRowProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

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
      <div
        className="flex items-center justify-between sm:justify-center gap-0 sm:gap-2 px-4 py-1 rounded-[10px] border border-[#ebebeb] bg-white w-full sm:w-auto"
        style={{
          boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
        }}
      >
        <button
          onClick={handleDecrement}
          className="p-1 rounded hover:bg-[#f7f7f7] transition-colors"
          disabled={value <= min}
        >
          <MinusIcon />
        </button>
        <span className="text-[13.5px] text-[#171717] w-8 text-center flex-1">
          {value}
        </span>
        <button
          onClick={handleIncrement}
          className="p-1 rounded hover:bg-[#f7f7f7] transition-colors"
          disabled={value >= max}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

export function PreferencesContent() {
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [desktopNotifications, setDesktopNotifications] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);

  // Behavior settings
  const [autoSaveConversations, setAutoSaveConversations] = useState(true);
  const [enterToSend, setEnterToSend] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Notifications Section */}
      <Section title="Notifications" description="Email and push notification settings.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ToggleRow
            title="Email notifications"
            description="Receive updates via email"
            enabled={emailNotifications}
            onToggle={() => setEmailNotifications(!emailNotifications)}
          />
          <ToggleRow
            title="Desktop notifications"
            description="Show browser notifications"
            enabled={desktopNotifications}
            onToggle={() => setDesktopNotifications(!desktopNotifications)}
          />
          <ToggleRow
            title="Sound alerts"
            description="Play notification sounds"
            enabled={soundAlerts}
            onToggle={() => setSoundAlerts(!soundAlerts)}
          />
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Behavior Section */}
      <Section title="Behavior" description="Default actions and shortcuts.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ToggleRow
            title="Auto-save conversations"
            description="Automatically save chat history"
            enabled={autoSaveConversations}
            onToggle={() => setAutoSaveConversations(!autoSaveConversations)}
          />
          <ToggleRow
            title="Enter to send"
            description="Send messages with Enter key"
            enabled={enterToSend}
            onToggle={() => setEnterToSend(!enterToSend)}
          />
          <ToggleRow
            title="Show typing indicator"
            description="Display when AI is responding"
            enabled={showTypingIndicator}
            onToggle={() => setShowTypingIndicator(!showTypingIndicator)}
          />
          <SelectRow
            title="Default export format"
            description="Preferred file format for exports"
            value="PDF"
          />
          <NumberInputRow
            title="Session timeout"
            description="Auto-logout after inactivity (minutes)"
            value={sessionTimeout}
            onChange={setSessionTimeout}
            min={5}
            max={120}
          />
        </div>
      </Section>
    </div>
  );
}
