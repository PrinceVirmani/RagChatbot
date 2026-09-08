"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
// import { SettingsDialog } from "../settings/SettingsDialog";
import { Settings2Dialog } from "../settings/Settings2Dialog";
import { useMobileHeader } from "../MobileHeaderContext";
import { useAuth } from "../providers/AuthProvider";
import { chatApi, Conversation } from "@/app/lib/chatApi";

interface SidebarItem {
  label: string;
  icon?: string;
  activeIcon?: string;
  active?: boolean;
  hasArrow?: boolean;
  hasMenu?: boolean;
  isAction?: boolean; // For "New chat" styling
  path?: string;
  subtitle?: string; // For displaying time or other info
}

const MOCK_PROJECTS = [
  {
    id: "1",
    title: "Research & Analysis",
    description: "User research insights & data analysis",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "2",
    title: "Web Search",
    description: "Search functionality and SEO optimization",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "3",
    title: "API Documentation",
    description: "Rest API documentation and examples",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "4",
    title: "Feature Overview",
    description: "Product feature planning and specifications",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "5",
    title: "Knowledge Base",
    description: "Key tips for effective project management",
    updatedAt: "Updated 12 days ago",
  },
  {
    id: "6",
    title: "User Guide",
    description: "User onboarding and guide creation",
    updatedAt: "Updated 12 days ago",
  },
];

const MAIN_NAV_ITEMS: SidebarItem[] = [
  { label: "New chat", icon: "/sidebar/add-circle-line.svg", isAction: true, path: "/chat" },
  { label: "Projects", icon: "/sidebar/folder-2-line.svg", activeIcon: "/sidebar/folder-2-line-active.svg", path: "/project" },
  { label: "Library", icon: "/sidebar/book-open-line.svg", activeIcon: "/sidebar/book-open-line-active.svg" },
];

const PINNED_ITEMS: SidebarItem[] = [
  { label: "Research & Analysis", icon: "/sidebar/folder-2-line.svg", activeIcon: "/sidebar/folder-2-line-active.svg" },
  { label: "Web Search", icon: "/sidebar/folder-2-line.svg", activeIcon: "/sidebar/folder-2-line-active.svg", hasArrow: true },
  { label: "Knowledge Base", icon: "/sidebar/folder-2-line.svg", activeIcon: "/sidebar/folder-2-line-active.svg" },
].map(item => {
  const project = MOCK_PROJECTS.find(p => p.title === item.label);
  return project ? { ...item, path: `/project/${project.id}` } : item;
});

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

interface UserMenuItem {
  label: string;
  icon: string;
  toggle?: boolean;
  hasSubmenu?: boolean;
  variant?: "default" | "danger";
}

const USER_MENU_ITEMS: UserMenuItem[] = [
  {
    label: "Dark mode",
    icon: "/sidebar/Darkmodetoggle.svg",
    toggle: true,
  },
  {
    label: "Settings",
    icon: "/sidebar/settings.svg",
  },
  {
    label: "Language",
    icon: "/sidebar/language1.svg",
  },
  {
    label: "Need help?",
    icon: "/sidebar/needhelp.svg",
  },
  {
    label: "Log out",
    icon: "/sidebar/logout.svg",
    variant: "danger",
  },
];

// Helper function to get user initials from name or email
function getUserInitials(name?: string, email?: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "??";
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { rightElement, leftElement, setOpenSidebarFn } = useMobileHeader();
  const { logout, user } = useAuth();

  // Derive user display values
  const userInitials = getUserInitials(user?.name, user?.email);
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeItemMenu, setActiveItemMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [isDarkModeOn, setIsDarkModeOn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [hasMoreConversations, setHasMoreConversations] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isCompact = isCollapsed && !isMobile;

  // Register the openSidebar function with context
  useEffect(() => {
    setOpenSidebarFn(() => setIsMobileOpen(true));
  }, [setOpenSidebarFn]);

  // Close menu on scroll to prevent detached fixed menu
  useEffect(() => {
    const handleScroll = () => {
      if (activeItemMenu) setActiveItemMenu(null);
    };
    
    const div = scrollRef.current;
    if (div) {
      div.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (div) {
        div.removeEventListener('scroll', handleScroll);
      }
    };
  }, [activeItemMenu]);

  // Handle external sidebar toggle (e.g. from ChatPage)
  useEffect(() => {
    const handleOpenSidebar = () => setIsMobileOpen(true);
    window.addEventListener('open-sidebar', handleOpenSidebar);
    return () => window.removeEventListener('open-sidebar', handleOpenSidebar);
  }, []);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [pathname, isMobile]);

  // Fetch initial 5 conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const response = await chatApi.getConversations(5, 0);
        setConversations(response.data);
        setHasMoreConversations(response.meta.pagination.has_more);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Load more conversations when "View more" is clicked
  const handleLoadMore = async () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      // Fetch next 5 conversations (offset = current count)
      const offset = conversations.length;
      const response = await chatApi.getConversations(5, offset);
      if (response.data && response.data.length > 0) {
        setConversations(prev => [...prev, ...response.data]);
      }
      setHasMoreConversations(response.meta?.pagination?.has_more ?? false);
    } catch (error) {
      console.error('Failed to load more conversations:', error);
      // On error, assume no more conversations to prevent infinite retries
      setHasMoreConversations(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Collapse back to showing only first 5 conversations
  const handleShowLess = () => {
    setConversations(prev => prev.slice(0, 5));
    setHasMoreConversations(true); // Assume there might be more after collapsing
  };

  // Convert all fetched conversations to SidebarItems
  const recentConversationItems: SidebarItem[] = conversations.map(conv => ({
    label: conv.title || "New conversation",
    path: `/chat?conversation=${conv.id}`,
    hasMenu: true,
    subtitle: formatTimeAgo(conv.updated_at),
  }));

  const filterItems = (items: SidebarItem[]) => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredPinned = filterItems(PINNED_ITEMS);
  const filteredRecent = filterItems(recentConversationItems);

  const handleItemClick = (label: string, isAction?: boolean, path?: string) => {
    // Use path for uniqueness if available, otherwise fall back to label
    setActiveItem(path || label);
    if (isAction) {
      // Handle "New chat" - dispatch event to reset chat state
      window.dispatchEvent(new CustomEvent('new-chat'));
      // Navigate to /chat without any conversation param
      if (path) {
        // If already on /chat, the event will reset state
        // Push to ensure URL is clean (no query params)
        router.push(path);
      }
    } else if (path) {
      router.push(path);
    }
  };

  const renderNavSection = (
    items: SidebarItem[],
    title?: string,
    accessory: "arrow" | "menu" | "none" = "arrow"
  ) => {
    if (items.length === 0) return null;

    return (
      <div className={`${isCompact ? "mb-1" : "mb-6"}`}>
        {title && !isCompact && (
          <h3 className="mb-2 px-3 text-xs font-medium text-zinc-400">
            {title}
          </h3>
        )}
        <div className="space-y-1">
          {items.map((item, index) => {
            // Use path for uniqueness if available, otherwise fall back to label
            const itemKey = item.path || item.label;
            const isActive = activeItem === itemKey;
            const isNewChat = item.isAction;
            const isMenuOpen =
              accessory === "menu" && activeItemMenu === item.label;

            return (
              <div key={index} className="relative">
                <div
                  onClick={() => handleItemClick(item.label, item.isAction, item.path)}
                  className={`group flex w-full items-center cursor-pointer ${
                    isCompact ? "justify-center" : "justify-between"
                  } rounded-lg px-3 py-2 text-left transition-colors ${
                    isActive
                      ? "bg-zinc-50 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                  } ${
                    isNewChat && !isActive
                      ? "hover:bg-zinc-50 dark:hover:bg-zinc-900"
                      : ""
                  }`}
                  title={isCompact ? item.label : undefined}
                  aria-label={item.label}
                >
                  <div
                    className={`flex items-center gap-3 overflow-hidden ${
                      isNewChat ? "text-[#1DAF61]" : ""
                    }`}
                  >
                    {item.icon && (
                      <div className="relative flex items-center justify-center peer">
                        <Image
                          src={isActive && item.activeIcon ? item.activeIcon : item.icon}
                          alt={item.label}
                          width={isNewChat && isCompact ? 24 : 20}
                          height={isNewChat && isCompact ? 24 : 20}
                          className={`${
                            !isNewChat && !isActive ? "opacity-60" : ""
                          } ${isActive && !isNewChat ? "text-[#1DAF61]" : ""}`}
                        />
                      </div>
                    )}
                    {isCompact && item.icon && (
                      <div className="absolute left-full ml-2 z-50 hidden peer-hover:block">
                        <div className="relative flex items-center bg-[#171717] text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                          <div className="absolute -left-1 w-2 h-2 bg-[#171717] rotate-45" />
                          <span className="relative z-10">{item.label}</span>
                        </div>
                      </div>
                    )}
                    {!isCompact && (
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate font-normal text-sm leading-5 tracking-[-0.006em]">
                          {item.label}
                        </span>
                        {item.subtitle && (
                          <span className="truncate text-xs text-zinc-400">
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Accessory icons on the right */}
                  {!isCompact && !item.isAction && accessory === "arrow" && (
                    <Image
                      src="/sidebar/RightArrow.svg"
                      alt="Arrow"
                      width={8}
                      height={8}
                      className={`transition-opacity ${
                        isMobile
                          ? "opacity-50"
                          : "opacity-0 group-hover:opacity-50"
                      }`}
                    />
                  )}

                  {!isCompact && !item.isAction && accessory === "menu" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeItemMenu === item.label) {
                          setActiveItemMenu(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuPosition({
                            top: rect.top + rect.height / 2,
                            left: rect.right + 8
                          });
                          setActiveItemMenu(item.label);
                        }
                      }}
                      className="ml-1 flex items-center justify-center"
                      aria-label="More options"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`text-zinc-500 transition-opacity ${
                          isMobile
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <path
                          d="M9 2.92499C8.44313 2.92499 7.9875 3.38061 7.9875 3.93749C7.9875 4.49436 8.44313 4.94999 9 4.94999C9.55688 4.94999 10.0125 4.49436 10.0125 3.93749C10.0125 3.38061 9.55688 2.92499 9 2.92499ZM9 13.05C8.44313 13.05 7.9875 13.5056 7.9875 14.0625C7.9875 14.6194 8.44313 15.075 9 15.075C9.55688 15.075 10.0125 14.6194 10.0125 14.0625C10.0125 13.5056 9.55688 13.05 9 13.05ZM9 7.98749C8.44313 7.98749 7.9875 8.44311 7.9875 8.99999C7.9875 9.55686 8.44313 10.0125 9 10.0125C9.55688 10.0125 10.0125 9.55686 10.0125 8.99999C10.0125 8.44311 9.55688 7.98749 9 7.98749Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  )}
                </div>


                {/* Context menu for items with dots */}
                {accessory === "menu" && isMenuOpen && (
                  <div
                    style={menuPosition ? {
                      position: "fixed",
                      top: menuPosition.top,
                      left: isMobile ? undefined : menuPosition.left,
                      right: isMobile ? "12px" : undefined,
                      transform: "translateY(-50%)"
                    } : undefined}
                    className={`absolute z-50 ${
                      isMobile
                        ? "right-3 top-1/2 -translate-y-1/2"
                        : "left-full ml-2 top-1/2 -translate-y-1/2"
                    }`}
                  >
                    <div className="rounded-2xl bg-white shadow-lg border border-zinc-100 min-w-[150px] p-1.5 flex flex-col gap-0.5">
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#5C5C5C] hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                        onClick={() => {
                          setActiveItemMenu(null);
                        }}
                      >
                        <Image
                          src="/project/pushpin-line.svg"
                          alt="Pinned"
                          width={20}
                          height={20}
                        />
                        <span>Pinned</span>
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#5C5C5C] hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                        onClick={() => {
                          setActiveItemMenu(null);
                        }}
                      >
                        <Image
                          src="/project/pencil.svg"
                          alt="Rename"
                          width={16}
                          height={16}
                        />
                        <span>Rename</span>
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        onClick={() => {
                          setActiveItemMenu(null);
                        }}
                      >
                        <Image
                          src="/project/delete-bin-line.svg"
                          alt="Delete"
                          width={20}
                          height={20}
                          className="text-red-500"
                        />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderUserMenuContent = () => (
    <>
      {/* Header: User info */}
      <div className="flex items-center gap-3 p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium">
          {userInitials}
        </div>
        <div className="flex flex-1 flex-col overflow-hidden text-left">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm text-zinc-900 dark:text-white">
              {userName}
            </span>
            <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
              PRO
            </span>
          </div>
          <span className="truncate text-xs text-[#A3A3A3]">
            {userEmail}
          </span>
        </div>
      </div>

      {/* Items */}
      <div
        className={`flex flex-col gap-0.5 py-1.5 ${
          isMobile ? "px-0" : "px-1.5"
        }`}
      >
        {/* Divider below header (matches Dark mode divider) */}
        <div className="border-t border-zinc-200 mb-0.5 dark:border-zinc-700" />
        {USER_MENU_ITEMS.map((item, index) => (
          <div key={index}>
            {/* Divider above Log out */}
            {item.label === "Log out" && (
              <div className="border-t border-zinc-200 my-2 dark:border-zinc-700" />
            )}

            <button
              onClick={async () => {
                if (item.label === "Dark mode") {
                  setIsDarkModeOn((prev) => !prev);
                  return;
                }
                if (item.label === "Settings") {
                  setIsSettingsOpen(true);
                  setIsUserMenuOpen(false);
                  return;
                }
                if (item.label === "Log out") {
                  setIsLoggingOut(true);
                  try {
                    await logout();
                    // Router redirect is handled by logout function
                  } catch (error) {
                    console.error("Logout failed:", error);
                  } finally {
                    setIsLoggingOut(false);
                  }
                  return;
                }
              }}
              disabled={item.label === "Log out" && isLoggingOut}
              className={`flex w-full items-center ${
                item.toggle || item.hasSubmenu ? "justify-between" : "gap-2"
              } rounded-lg px-2 ${
                item.label === "Dark mode" ? "py-1.5" : "py-2"
              } text-left text-sm text-[#5C5C5C] hover:text-black transition-colors ${
                item.variant === "danger" && !(item.label === "Log out" && isLoggingOut)
                  ? "hover:bg-red-50 dark:hover:bg-red-900/20"
                  : item.variant === "danger" && (item.label === "Log out" && isLoggingOut)
                  ? "bg-red-50 dark:bg-red-900/20 opacity-70 cursor-not-allowed"
                  : "hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.label === "Log out" && isLoggingOut ? (
                  <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={item.label === "Dark mode" ? 16 : 20}
                    height={item.label === "Dark mode" ? 16 : 20}
                    className={`transition-[filter] duration-200 group-hover:brightness-0 dark:group-hover:brightness-200 ${
                      item.variant === "danger" ? "text-red-600" : ""
                    }`}
                  />
                )}
                <span>{item.label === "Log out" && isLoggingOut ? "Logging out..." : item.label}</span>
              </div>
              {item.toggle &&
                (item.label === "Dark mode" ? (
                  <Image
                    src={
                      isDarkModeOn
                        ? "/sidebar/switch-on.svg"
                        : "/sidebar/switch-off.svg"
                    }
                    alt="Dark mode switch"
                    width={36}
                    height={28}
                    className="transition-transform duration-150 ease-out self-center mt-1"
                    style={{
                      transform: isDarkModeOn ? "translateX(1px)" : "translateX(0)",
                    }}
                  />
                ) : (
                  <div className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-zinc-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 dark:bg-zinc-700">
                    <span className="translate-x-0 pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                  </div>
                ))}
              {item.hasSubmenu && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-zinc-400"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              )}
            </button>

            {/* Divider below Dark mode */}
            {item.label === "Dark mode" && (
              <div className="border-t border-zinc-200 mt-0.5 mb-1.5 dark:border-zinc-700" />
            )}
          </div>
        ))}
      </div>

      {/* Footer: Version */}
      <div className="p-2">
        <span className="text-xs text-zinc-400 ml-2.5">v.1.5.69 · Terms &amp; Conditions</span>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header - Only visible on mobile when sidebar is closed */}
      {/* Hidden on /chat page */}
      {isMobile && !isMobileOpen && pathname !== '/chat' && (
        <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-white border-b border-zinc-200 px-4 py-3 lg:hidden">
          {leftElement || (
            <button
              onClick={() => setIsMobileOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100"
              aria-label="Toggle menu"
            >
              <Image
                src="/sidebar/menu-3-line.svg"
                alt="Open sidebar"
                width={24}
                height={24}
                className="text-zinc-900"
              />
            </button>
          )}
          {rightElement || (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DAF61]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 10c0-3 2-5 5-5s5 2 5 5v5" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Mobile Overlay - Click to close menu */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop view or Mobile drawer */}
      <aside
        className={`flex h-screen flex-col transition-all duration-300 ${
          isMobile
            ? `border-r border-zinc-200 fixed left-0 top-0 z-40 h-full w-full max-w-none transform transition-transform duration-300 pt-0 ${
                isMobileOpen
                  ? "translate-x-0 pointer-events-auto"
                  : "-translate-x-full pointer-events-none"
              } lg:static lg:translate-x-0 lg:pt-0 lg:pointer-events-auto`
            : `${isCollapsed ? "w-20" : "w-[280px]"} relative`
        }`}
        style={{
          backgroundColor: '#FFFFFF',
          ...(isMobile && !isMobileOpen ? { display: 'none' } : {})
        }}
      >
      {/* Mobile-only overlay to close item context menu when clicking elsewhere */}
      {activeItemMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveItemMenu(null)}
        />
      )}
      {/* Top Header - Hidden on mobile */}
      <div
        className={`flex items-center shrink-0 ${
          isMobile ? "hidden lg:flex" : ""
        } ${
          isCollapsed ? "justify-center flex-col gap-4" : "justify-between"
        } px-5 pt-6 pb-4`}
      >
        <button 
          onClick={isCollapsed ? () => setIsCollapsed(!isCollapsed) : undefined}
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DAF61] cursor-pointer hover:opacity-90`}
          aria-label={isCollapsed ? "Expand Sidebar" : undefined}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10c0-3 2-5 5-5s5 2 5 5v5" />
          </svg>
        </button>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-zinc-400 hover:text-zinc-600"
            aria-label="Toggle Sidebar"
          >
            <Image
              src="/sidebar/side-bar-toggle.svg"
              alt="Toggle Sidebar"
              width={20}
              height={20}
              className={isCollapsed ? "rotate-180" : ""}
            />
          </button>
        )}
      </div>

      {/* Search Bar (Static/Non-Scrollable) - Hidden on mobile */}
      {!isCollapsed && !isMobile && (
        <div className="px-4 mb-4 shrink-0">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Image
                src="/sidebar/search-line.svg"
                alt="Search"
                width={16}
                height={16}
                className="opacity-50"
              />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-zinc-50 border border-transparent py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-300 focus:bg-white focus:outline-none dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      )}

      {/* Mobile Search Bar - Inside drawer */}
      {isMobile && (
        <div className="px-4 mb-4 shrink-0">
          {/* Logo + Close button row */}
          <div className="flex items-center justify-between pt-4 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1DAF61]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 10c0-3 2-5 5-5s5 2 5 5v5" />
              </svg>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100"
              aria-label="Close menu"
            >
              <Image
                src="/sidebar/close-line.svg"
                alt="Close sidebar"
                width={24}
                height={24}
              />
            </button>
          </div>

          <div className="border-t border-zinc-200 mb-4" />

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Image
                src="/sidebar/search-line.svg"
                alt="Search"
                width={16}
                height={16}
                className="opacity-50"
              />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-zinc-50 border border-transparent py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-300 focus:bg-white focus:outline-none dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
      )}

      {/* Static Main Navigation Section (Non-Scrollable, Fixed at Top) */}
      <div className="px-2 shrink-0">
        {/* Line before New chat in collapsed state */}
        {isCompact && <div className="mx-3 my-3 h-px bg-zinc-200 dark:bg-zinc-800" />}

        {/* Main items: Right icon on mobile, none on desktop */}
        {renderNavSection(
          searchQuery ? filterItems(MAIN_NAV_ITEMS) : MAIN_NAV_ITEMS,
          undefined,
          isMobile ? "arrow" : "none"
        )}

        {/* Search Icon in Collapsed State (after Library) */}
        {isCompact && (
          <div className="mb-6">
            <button 
              className="relative flex w-full items-center justify-center rounded-lg px-3 py-1 text-left transition-colors text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
              onClick={() => setIsCollapsed(false)}
              aria-label="Search"
            >
              <div className="relative flex items-center justify-center peer">
                <Image
                  src="/sidebar/search-line.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="opacity-50"
                />
              </div>
              
              {/* Tooltip for Collapsed State */}
              <div className="absolute left-full ml-2 z-50 hidden peer-hover:block">
                <div className="relative flex items-center bg-[#171717] text-white text-xs font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-md">
                  {/* Tooltip Arrow */}
                  <div className="absolute -left-1 w-2 h-2 bg-[#171717] rotate-45" />
                  <span className="relative z-10">Search</span>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Scrollable Navigation Items (History, Pinned, etc) */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-2 min-h-0 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />

        {/* Pinned: Arrows */}
        {!isCompact && (
          <>
            {renderNavSection(filteredPinned, "Pinned", 'arrow')}
            <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />
          </>
        )}

        {/* Recents: Menu (dots) */}
        {isLoadingConversations ? (
          <div className="px-3 py-2">
            <h3 className="mb-2 text-xs font-medium text-zinc-400">Recents</h3>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <div className="w-4 h-4 border-2 border-zinc-300 border-t-transparent rounded-full animate-spin" />
              <span>Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {renderNavSection(filteredRecent, "Recents", 'menu')}

            {/* View more / View less buttons */}
            {(hasMoreConversations || conversations.length > 5) && (
              <div className="px-3 pb-2 flex items-center gap-3">
                {/* View more button - show when there are more to load from API */}
                {hasMoreConversations && (
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="text-xs text-[#1DAF61] hover:text-[#168a4d] font-medium transition-colors disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-[#1DAF61] border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "View more"
                    )}
                  </button>
                )}

                {/* View less button - show when more than initial 5 are loaded */}
                {conversations.length > 5 && (
                  <button
                    onClick={handleShowLess}
                    className="text-xs text-zinc-500 hover:text-zinc-700 font-medium transition-colors"
                  >
                    View less
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* User (Fixed at Bottom) */}
      <div className="border-t border-zinc-100 p-4 dark:border-zinc-800 mt-auto shrink-0 relative">
        {/* Desktop overlay - Click to close menu */}
        {isUserMenuOpen && !isMobile && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}

        {/* Desktop user menu (popover to the right) */}
        {isUserMenuOpen && !isMobile && (
          <div className="absolute bottom-16 left-full -ml-6 z-50 w-[260px]">
            <div className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-[#171717] overflow-hidden">
              {renderUserMenuContent()}
            </div>
          </div>
        )}

        {/* Mobile user menu (bottom sheet) */}
        {isUserMenuOpen && isMobile && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
              className="absolute inset-0 bg-black/25"
              onClick={() => setIsUserMenuOpen(false)}
            />
            <div className="relative w-full">
              <div className="w-full rounded-t-[24px] bg-white shadow-lg overflow-hidden">
                {renderUserMenuContent()}
              </div>
            </div>
          </div>
        )}

        <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`flex w-full items-center gap-3 ${isCompact ? "justify-center" : ""} hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg p-2 -ml-2`}
            aria-label="User Profile"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium">
            {userInitials}
          </div>
          {!isCompact && (
            <>
              <div className="flex flex-1 flex-col overflow-hidden text-left">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {userName}
                  </span>
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                    PRO
                  </span>
                </div>
                <span className="truncate text-xs text-zinc-500">
                  {userEmail}
                </span>
              </div>
              <Image
                src="/sidebar/arrow-down-s-line.svg"
                alt="User Menu"
                width={22}
                height={22}
                className={`text-zinc-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
              />
            </>
          )}
        </button>
      </div>

      {/* <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      /> */}
      <Settings2Dialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </aside>
    </>
  );
}
