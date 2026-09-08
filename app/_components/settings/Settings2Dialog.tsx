"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { WorkspaceOverview } from "./WorkspaceOverview";
import { PeopleContent } from "./PeopleContent";
import { BillingContent } from "./BillingContent";
import { ProfileContent } from "./ProfileContent";
import { PreferencesContent } from "./PreferencesContent";
import { AppearanceContent } from "./AppearanceContent";
import { SecurityContent } from "./SecurityContent";
import { PrivacyDataContent } from "./PrivacyDataContent";
import { AISettingsContent } from "./AISettingsContent";
import { IntegrationsContent } from "./IntegrationsContent";
import { AdvancedContent } from "./AdvancedContent";
import { useAuth } from "../providers/AuthProvider";

interface Settings2DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId =
  | "workspace"
  | "people"
  | "billing"
  | "profile"
  | "preferences"
  | "appearance"
  | "security"
  | "privacy"
  | "ai"
  | "integrations"
  | "advanced";

interface NavItem {
  id: TabId;
  label: string;
  icon?: string;
  isUserCard?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}


const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.70718 8.99997L6.87891 6.17169L8.29312 4.75748L12.5355 8.99997L8.29312 13.2425L6.87891 11.8283L9.70718 8.99997Z" fill="#A3A3A3"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.29282 8.99997L11.1211 11.8283L9.70688 13.2425L5.46449 8.99997L9.70688 4.75748L11.1211 6.17169L8.29282 8.99997Z" fill="#A3A3A3"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.00005 7.93939L12.7124 4.22705L13.773 5.28771L10.0607 9.00005L13.773 12.7124L12.7124 13.773L9.00005 10.0607L5.28771 13.773L4.22705 12.7124L7.93939 9.00005L4.22705 5.28771L5.28771 4.22705L9.00005 7.93939Z" fill="#A3A3A3"/>
  </svg>
);

const SETTINGS_SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { id: "workspace", label: "", isUserCard: true }, // Label is set dynamically from user data
      { id: "people", label: "People", icon: "/settings/sidebar/people.svg" },
      { id: "billing", label: "Plans & Billing", icon: "/settings/sidebar/plans.svg" },
    ]
  },
  {
    title: "Account",
    items: [
      { id: "profile", label: "Profile", icon: "/settings/sidebar/profile.svg" },
      { id: "preferences", label: "Preferences", icon: "/settings/sidebar/preference.svg" },
      { id: "appearance", label: "Appearance", icon: "/settings/sidebar/appearance.svg" },
    ]
  },
  {
    title: "Security",
    items: [
      { id: "security", label: "Security", icon: "/settings/sidebar/security.svg" },
      { id: "privacy", label: "Privacy & Data", icon: "/settings/sidebar/privacy.svg" },
    ]
  },
  {
    title: "Features",
    items: [
      { id: "ai", label: "AI Settings", icon: "/settings/sidebar/ai.svg" },
      { id: "integrations", label: "Integrations", icon: "/settings/sidebar/integrations.svg" },
      { id: "advanced", label: "Advanced", icon: "/settings/sidebar/advanced.svg" },
    ]
  }
];

// Content title and description mapping
const CONTENT_INFO: Record<TabId, { title: string; description: string }> = {
  workspace: { title: "Workspace overview", description: "Manage your workspace ownership and settings." },
  people: { title: "Team members", description: "Manage workspace members, roles and permissions." },
  billing: { title: "Plans & Billing", description: "Manage subscription and billing settings." },
  profile: { title: "Profile", description: "Manage your personal account settings." },
  preferences: { title: "Preferences", description: "Customize your workspace experience." },
  appearance: { title: "Appearance", description: "Customize visual settings and interface." },
  security: { title: "Security", description: "Manage account security and access control." },
  privacy: { title: "Privacy & Data", description: "Control your data privacy and usage preferences." },
  ai: { title: "AI settings", description: "Customize AI behavior and response preferences." },
  integrations: { title: "Integrations", description: "Connect external apps and manage API access." },
  advanced: { title: "Advanced", description: "Developer tools and experimental features." },
};

// Helper function to get user initial from name or email
function getUserInitial(name?: string, email?: string): string {
  if (name) {
    return name.charAt(0).toUpperCase();
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return "?";
}

export function Settings2Dialog({ isOpen, onClose }: Settings2DialogProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("workspace");
  // Mobile view state: 'nav' shows navigation, 'content' shows selected content
  const [mobileView, setMobileView] = useState<'nav' | 'content'>('nav');
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  // Derive user display values
  const userName = user?.name || "User";
  const userInitial = getUserInitial(user?.name, user?.email);

  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset mobile view when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setMobileView('nav');
      setActiveTab("workspace");
    }
  }, [isOpen]);

  // Track viewport size to distinguish mobile vs desktop behavior
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobileScreen(window.innerWidth < 768);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  if (!isOpen) return null;

  // Handle tab selection - on mobile, also switch to content view
  const handleTabSelect = (tabId: TabId) => {
    setActiveTab(tabId);
    setMobileView('content');
  };

  // Handle back button on mobile
  const handleMobileBack = () => {
    setMobileView('nav');
  };

  const renderContent = () => {
    switch (activeTab) {
      case "workspace": return <WorkspaceOverview />;
      case "people": return <PeopleContent />;
      case "billing": return <BillingContent />;
      case "profile": return <ProfileContent />;
      case "preferences": return <PreferencesContent />;
      case "appearance": return <AppearanceContent />;
      case "security": return <SecurityContent />;
      case "privacy": return <PrivacyDataContent />;
      case "ai": return <AISettingsContent />;
      case "integrations": return <IntegrationsContent />;
      case "advanced": return <AdvancedContent />;
      default: return null;
    }
  };

  const contentInfo = CONTENT_INFO[activeTab];

  const renderNavItem = (item: NavItem) => {
    // In mobile nav view, items never show "active" styling; desktop still does.
    const isActive = !isMobileScreen && activeTab === item.id;

    // User card item
    if (item.isUserCard) {
      return (
        <button
          key={item.id}
          onClick={() => handleTabSelect(item.id)}
          className={`group flex w-full items-center gap-2 rounded-[10px] p-2 text-left transition-colors ${
            isActive
              ? "bg-[#f7f7f7]"
              : "bg-white hover:bg-[#f7f7f7]"
          }`}
        >
          {/* Avatar */}
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ebebeb]">
            <span className="text-xs text-[#171717]">{userInitial}</span>
          </div>
          {/* Name and Badge */}
          <div className="flex flex-1 items-center gap-1 min-w-0">
            <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">{userName}</span>
            <span className="rounded-[5px] bg-[#efebff] px-1.5 py-0.5 text-[11px] font-semibold text-[#7d52f4] uppercase tracking-[0.22px]">
              PRO
            </span>
          </div>
          {/* Arrow - visible on active or hover */}
          <div className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <ArrowRightIcon />
          </div>
        </button>
      );
    }

    // Regular nav item
    return (
      <button
        key={item.id}
        onClick={() => handleTabSelect(item.id)}
        className={`group flex w-full items-center gap-2 rounded-[10px] p-2 text-left transition-colors ${
          isActive
            ? "bg-[#f7f7f7]"
            : "bg-white hover:bg-[#f7f7f7]"
        }`}
      >
        {item.icon && (
          <div className="shrink-0">
            <Image
              src={isActive ? item.icon.replace(/\.svg$/, '-green.svg') : item.icon}
              alt={item.label}
              width={20}
              height={20}
            />
          </div>
        )}
        <span className={`flex-1 text-[13.5px] tracking-[-0.084px] ${isActive ? "text-[#171717] font-medium" : "text-[#5c5c5c]"}`}>{item.label}</span>
        {/* Arrow - visible on active or hover */}
        <div className={`transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
          <ArrowRightIcon />
        </div>
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/25 md:bg-[#ebebeb] transition-opacity"
      onClick={onClose}
    >
      {/* Settings Modal Container */}
      <div
        className="flex flex-col md:flex-row overflow-hidden rounded-t-[24px] md:rounded-[28px] bg-white md:p-1.5 md:gap-1.5 w-full md:w-auto max-h-[90vh] md:max-h-none"
        style={{
          boxShadow: "0px 20px 20px -10px rgba(23,23,23,0.04), 0px 10px 10px -5px rgba(23,23,23,0.04), 0px 6px 6px -3px rgba(23,23,23,0.04), 0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 0px 0px 1px rgba(23,23,23,0.08)"
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Header - Only visible on mobile */}
        <div className="flex md:hidden items-center justify-between px-5 py-4 border-b border-[#ebebeb]">
          {mobileView === 'content' ? (
            <button
              onClick={handleMobileBack}
              className="p-1 -ml-1 rounded-[6px] hover:bg-[#f7f7f7] transition-colors"
              aria-label="Back to settings menu"
            >
              <ArrowLeftIcon />
            </button>
          ) : (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-[#171717]">Settings</span>
              <span className="text-xs text-[#a3a3a3]">Manage your workspace ownership and settings.</span>
            </div>
          )}
          {mobileView === 'content' && (
            <div className="flex flex-col gap-0.5 flex-1 ml-2">
              <span className="text-sm font-medium text-[#171717]">{contentInfo.title}</span>
              <span className="text-xs text-[#a3a3a3] line-clamp-1">{contentInfo.description}</span>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1 -mr-1 rounded-[6px] hover:bg-[#f7f7f7] transition-colors"
            aria-label="Close settings"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation Sidebar - Hidden on mobile when viewing content */}
        <div className={`flex flex-col gap-0 md:gap-3 md:w-[240px] p-4 md:p-3.5 md:rounded-[24px] overflow-y-auto ${mobileView === 'content' ? 'hidden md:flex' : 'flex'}`}>
          {SETTINGS_SECTIONS.map((section, sectionIdx) => (
            <div key={sectionIdx} className="flex flex-col gap-1">
              {/* Section Title */}
              <div className="px-2 py-1 h-6">
                <span className="text-xs md:text-[13.5px] font-medium text-[#a3a3a3] tracking-[-0.084px]">{section.title}</span>
              </div>
              {/* Section Items */}
              {section.items.map(renderNavItem)}
              {/* Divider between sections - mobile only */}
              {sectionIdx < SETTINGS_SECTIONS.length - 1 && (
                <div className="my-3 h-px bg-[#ebebeb] md:hidden" />
              )}
            </div>
          ))}
        </div>

        {/* Content Panel - Hidden on mobile when viewing navigation */}
        <div
          className={`flex-col md:w-[900px] md:h-[708px] bg-white md:rounded-[24px] overflow-hidden flex-1 ${mobileView === 'nav' ? 'hidden md:flex' : 'flex'}`}
          style={{
            boxShadow: "0px 3px 3px -1.5px rgba(23,23,23,0.04), 0px 1px 1px -0.5px rgba(23,23,23,0.04), 0px 0px 0px 1px rgba(23,23,23,0.08)"
          }}
        >
          {/* Desktop Header - Hidden on mobile */}
          <div className="hidden md:flex items-start justify-between gap-4 px-7 pt-[22px] pb-0">
            <div className="flex flex-col gap-1">
              <span className="text-[13.5px] text-[#171717] tracking-[-0.084px]">
                {contentInfo.title}
              </span>
              <span className="text-[13.5px] text-[#a3a3a3] tracking-[-0.084px]">
                {contentInfo.description}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-[3px] rounded-[6px] bg-white hover:bg-[#f7f7f7] transition-colors"
              aria-label="Close settings"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden md:block mx-7 mt-7 h-px bg-[#ebebeb]" />

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7 md:py-7">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
