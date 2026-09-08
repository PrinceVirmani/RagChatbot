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

interface ButtonRowProps {
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "danger";
  onClick?: () => void;
}

function ButtonRow({ title, description, buttonText, buttonVariant = "default", onClick }: ButtonRowProps) {
  const isDanger = buttonVariant === "danger";

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
        className={`w-full sm:w-auto flex items-center justify-center px-3 py-1.5 rounded-[10px] border text-[13.5px] tracking-[-0.084px] transition-colors ${
          isDanger
            ? "border-[#fecaca] bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2]"
            : "border-[#ebebeb] bg-white text-[#5c5c5c] hover:bg-[#f7f7f7]"
        }`}
        style={isDanger ? {} : {
          boxShadow: "0px 1px 2px 0px rgba(10,13,20,0.03)"
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

export function PrivacyDataContent() {
  // Data collection settings
  const [crashReports, setCrashReports] = useState(true);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);

  // Data usage settings
  const [personalization, setPersonalization] = useState(true);
  const [aiTraining, setAiTraining] = useState(false);

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Data Collection Section */}
      <Section title="Data collection" description="Control what data we collect and how.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ToggleRow
            title="Crash reports"
            description="Automatically send error reports to help fix bugs"
            enabled={crashReports}
            onToggle={() => setCrashReports(!crashReports)}
          />
          <ToggleRow
            title="Analytics tracking"
            description="Get notified of new sign-ins"
            enabled={analyticsTracking}
            onToggle={() => setAnalyticsTracking(!analyticsTracking)}
          />
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Data Usage Section */}
      <Section title="Data usage" description="Manage how your data is used.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ToggleRow
            title="Personalization"
            description="Use your data to personalize your experience"
            enabled={personalization}
            onToggle={() => setPersonalization(!personalization)}
          />
          <ToggleRow
            title="AI training"
            description="Use conversations to improve AI responses"
            enabled={aiTraining}
            onToggle={() => setAiTraining(!aiTraining)}
          />
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Data Rights Section */}
      <Section title="Data rights" description="Your privacy rights and data control.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ButtonRow
            title="Download your data"
            description="Export all your conversations and account data"
            buttonText="Download"
          />
          <ButtonRow
            title="Delete account"
            description="Permanently delete your account and all data"
            buttonText="Delete"
            buttonVariant="danger"
          />
        </div>
      </Section>
    </div>
  );
}
