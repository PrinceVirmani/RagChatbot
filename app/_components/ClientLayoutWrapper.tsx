"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Sidebar } from "./sidebar/Sidebar";
import { MobileHeaderProvider } from "./MobileHeaderContext";
import { useAuth } from "./providers/AuthProvider";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Use ref to avoid router in useEffect dependency array
  const routerRef = useRef(router);
  routerRef.current = router;

  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith("/auth");
  const isChatPage = pathname === "/chat";

  // Public pages that don't require authentication
  // All routes under /auth are public (signin, signup, forgot-password, reset-password, etc.)
  const isPublicPage = isAuthPage;

  // Hydration check - ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Route protection logic - single source of truth for redirects
  useEffect(() => {
    if (!isClient || isInitializing) return;

    // If user is authenticated and trying to access public auth pages, redirect to chat
    if (isAuthenticated && isAuthPage) {
      routerRef.current.replace("/chat");
      return;
    }

    // If user is NOT authenticated and trying to access protected pages, redirect to signin
    if (!isAuthenticated && !isPublicPage) {
      routerRef.current.replace("/auth/signin");
      return;
    }
  }, [isAuthenticated, isInitializing, isClient, isAuthPage, isPublicPage]);

  // Show nothing while initializing to prevent hydration mismatches
  if (isInitializing || !isClient) {
    return <div className="w-full h-screen bg-white dark:bg-black" />;
  }

  // For public auth pages, just show the children
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For protected pages with authenticated user, show sidebar layout
  if (isAuthenticated) {
    return (
      <MobileHeaderProvider>
        <div className="flex h-screen w-full bg-white dark:bg-black text-black dark:text-white">
          <Sidebar />
          <div
            className={`flex-1 flex flex-col min-w-0 overflow-hidden ${
              isChatPage ? "pt-0" : "pt-14 lg:pt-0"
            }`}
          >
            {children}
          </div>
        </div>
      </MobileHeaderProvider>
    );
  }

  // Default: show nothing (will redirect to signin)
  return <div className="w-full h-screen bg-white dark:bg-black" />;
}
