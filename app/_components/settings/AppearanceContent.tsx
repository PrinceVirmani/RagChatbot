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
        className="flex items-center justify-center sm:justify-start gap-1 px-3 py-1.5 rounded-[10px] border border-[#ebebeb] bg-white text-[13.5px] text-[#5c5c5c] tracking-[-0.084px] hover:bg-[#f7f7f7] transition-colors"
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

// Radio Button Component
interface RadioOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

function RadioOption({ label, selected, onSelect }: RadioOptionProps) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-2"
    >
      <div className="flex items-center justify-center h-5 w-5">
        <div
          className={`h-4 w-4 rounded-full ${
            selected ? "border-[3px] border-[#16a34a]" : "border-2 border-[#d1d1d1]"
          }`}
        />
      </div>
      <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
        {label}
      </span>
    </button>
  );
}

interface RadioGroupRowProps {
  title: string;
  description: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function RadioGroupRow({ title, description, options, value, onChange }: RadioGroupRowProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
          {title}
        </span>
        <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
          {description}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {options.map((option) => (
          <RadioOption
            key={option}
            label={option}
            selected={value === option}
            onSelect={() => onChange(option)}
          />
        ))}
      </div>
    </div>
  );
}

export function AppearanceContent() {
  // Theme settings
  const [colorTheme, setColorTheme] = useState("Light");

  // Display settings
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  // Accessibility settings
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  const [focusIndicators, setFocusIndicators] = useState(true);

  return (
    <div className="flex flex-col gap-6 md:gap-7">
      {/* Theme Section */}
      <Section title="Theme" description="Color scheme and visual style.">
        <div className="flex flex-col gap-4 md:gap-5">
          <RadioGroupRow
            title="Color theme"
            description="Choose your preferred color scheme"
            options={["Light", "Dark", "System"]}
            value={colorTheme}
            onChange={setColorTheme}
          />
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Display Section */}
      <Section title="Display" description="Layout and typography options.">
        <div className="flex flex-col gap-4 md:gap-5">
          <SelectRow
            title="Font size"
            description="Adjust text size for better readability"
            value="Medium"
          />
          <ToggleRow
            title="Compact mode"
            description="Reduce spacing for more content on screen"
            enabled={compactMode}
            onToggle={() => setCompactMode(!compactMode)}
          />
          <ToggleRow
            title="Animations"
            description="Enable smooth transitions and effects"
            enabled={animations}
            onToggle={() => setAnimations(!animations)}
          />
        </div>
      </Section>

      {/* Divider */}
      <div className="h-px bg-[#ebebeb]" />

      {/* Accessibility Section */}
      <Section title="Accessibility" description="Accessibility and readability options.">
        <div className="flex flex-col gap-4 md:gap-5">
          <ToggleRow
            title="High contrast"
            description="Increase contrast for better visibility"
            enabled={highContrast}
            onToggle={() => setHighContrast(!highContrast)}
          />
          <ToggleRow
            title="Reduce motion"
            description="Minimize animations and transitions"
            enabled={reduceMotion}
            onToggle={() => setReduceMotion(!reduceMotion)}
          />
          <ToggleRow
            title="Focus indicators"
            description="Enhanced keyboard navigation"
            enabled={focusIndicators}
            onToggle={() => setFocusIndicators(!focusIndicators)}
          />
        </div>
      </Section>
    </div>
  );
}
