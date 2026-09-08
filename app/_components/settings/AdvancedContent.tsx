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

export function AdvancedContent() {
  // Developer settings
  const [debugMode, setDebugMode] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState(false);
  const [errorReporting, setErrorReporting] = useState(true);

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Developer Settings Section */}
      <Section title="Developer settings" description="Advanced developer and debug options.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ToggleRow
            title="Debug mode"
            description="Enable detailed debugging information"
            enabled={debugMode}
            onToggle={() => setDebugMode(!debugMode)}
          />
          <ToggleRow
            title="Console logs"
            description="Show technical logs in browser console"
            enabled={consoleLogs}
            onToggle={() => setConsoleLogs(!consoleLogs)}
          />
          <ToggleRow
            title="Error reporting"
            description="Send detailed error reports to developers"
            enabled={errorReporting}
            onToggle={() => setErrorReporting(!errorReporting)}
          />
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* System Section */}
      <Section title="System" description="Advanced system configuration.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ButtonRow
            title="Cache management"
            description="Clear application cache and temporary files"
            buttonText="Clear"
          />
          <ButtonRow
            title="Export settings"
            description="Download your configuration as JSON file"
            buttonText="Export"
          />
          <ButtonRow
            title="Import settings"
            description="Restore configuration from backup file"
            buttonText="Import"
          />
        </div>
      </Section>
    </div>
  );
}
