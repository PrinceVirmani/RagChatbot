"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  User, 
  Settings as SettingsIcon, 
  Users, 
  CreditCard,
  Eye,
  Lock,
  Shield,
  Sparkles,
  Link as LinkIcon,
  Zap,
  ChevronRight
} from "lucide-react";

import { UserNavCard } from "./UserNavCard";
import { ProfileSettings } from "./ProfileSettings";
import { PeopleSettings } from "./PeopleSettings";
import { BillingSettings } from "./BillingSettings";
import { PreferencesSettings } from "./PreferencesSettings";
import { AppearanceSettings } from "./AppearanceSettings";
import { SecuritySettings } from "./SecuritySettings";
import { PrivacyDataSettings } from "./PrivacyDataSettings";
import { AISettings } from "./AISettings";
import { IntegrationsSettings } from "./IntegrationsSettings";
import { AdvancedSettings } from "./AdvancedSettings";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabId = 
  | "user-card"
  | "profile" 
  | "preferences" 
  | "appearance" 
  | "people" 
  | "billing" 
  | "security" 
  | "privacy"
  | "ai"
  | "integrations"
  | "advanced";

interface NavItem {
  id: string;
  label?: string;
  icon?: any;
  component?: React.ElementType;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const SETTINGS_SECTIONS: NavSection[] = [
  {
    // Title "Workspace" dealt with manually
    items: [
      { id: "user-card", label: "James Brown", component: UserNavCard },
      { id: "people", label: "People", icon: Users },
      { id: "billing", label: "Plans & Billing", icon: CreditCard },
    ]
  },
  {
    title: "Account",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "preferences", label: "Preferences", icon: SettingsIcon },
      { id: "appearance", label: "Appearance", icon: Eye },
    ]
  },
  {
    title: "Security",
    items: [
      { id: "security", label: "Security", icon: Lock },
      { id: "privacy", label: "Privacy & Data", icon: Shield },
    ]
  },
  {
    title: "Features",
    items: [
      { id: "ai", label: "AI Settings", icon: Sparkles },
      { id: "integrations", label: "Integrations", icon: LinkIcon },
      { id: "advanced", label: "Advanced", icon: Zap },
    ]
  }
];

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

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

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeTab) {
      case "user-card": return <ProfileSettings />;
      case "profile": return <ProfileSettings />;
      case "people": return <PeopleSettings />;
      case "billing": return <BillingSettings />;
      case "preferences": return <PreferencesSettings />;
      case "appearance": return <AppearanceSettings />;
      case "security": return <SecuritySettings />;
      case "privacy": return <PrivacyDataSettings />;
      case "ai": return <AISettings />;
      case "integrations": return <IntegrationsSettings />;
      case "advanced": return <AdvancedSettings />;
      default: return null;
    }
  };

  const activeLabel = SETTINGS_SECTIONS.flatMap(s => s.items).find(i => i.id === activeTab)?.label ?? "Settings";

  const renderNavItem = (item: NavItem) => {
    const isActive = activeTab === item.id;

    if (item.component) {
      const Component = item.component;
      return (
        <Component 
          key={item.id}
          isActive={isActive}
          onClick={() => setActiveTab(item.id as TabId)}
        />
      );
    }

    if (!item.label || !item.icon) return null;

    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id as TabId)}
        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-1.5 text-left transition-colors ${
          isActive
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
        }`}
      >
        <Icon size={18} className={isActive ? "text-zinc-500 dark:text-zinc-400" : "text-zinc-400 group-hover:text-zinc-500"} />
        <span className="font-normal text-[13.5px] leading-5">{item.label}</span>
        <ChevronRight
          size={14}
          className={`ml-auto transition-opacity text-zinc-400 ${
            isActive ? "opacity-60" : "opacity-0 group-hover:opacity-50"
          }`}
        />
      </button>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div 
        className="flex h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 dark:border dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-zinc-200 flex flex-col overflow-y-auto dark:border-zinc-800">
           
           <div className="p-4 space-y-6">
              {/* Workspace Section Header & User Card */}
              <div>
                <h4 className="px-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                  Workspace
                </h4>

                {/* Workspace Items (Index 0) */}
                <nav className="space-y-0.5">
                    {SETTINGS_SECTIONS[0].items.map(renderNavItem)}
                </nav>
              </div>

              {/* Other Sections */}
              {SETTINGS_SECTIONS.slice(1).map((section, idx) => (
                <div key={idx}>
                  {section.title && (
                    <h4 className="px-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider dark:text-zinc-400">
                      {section.title}
                    </h4>
                  )}
                  <nav className="space-y-0.5">
                    {section.items.map(renderNavItem)}
                  </nav>
                </div>
              ))}
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between border-b border-zinc-100 p-6 dark:border-zinc-800">
                <div>
                   <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                     {activeLabel}
                   </h3>
                </div>
                <button 
                  onClick={onClose}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 transition-colors dark:hover:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-400"
                  aria-label="Close settings"
                >
                  <X size={20} />
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
                {renderContent()}
            </div>
        </div>
      </div>
    </div>
  );
}
