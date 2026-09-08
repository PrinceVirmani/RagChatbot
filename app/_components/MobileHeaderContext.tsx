"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface MobileHeaderContextType {
  rightElement: ReactNode | null;
  setRightElement: (element: ReactNode | null) => void;
  leftElement: ReactNode | null;
  setLeftElement: (element: ReactNode | null) => void;
  openSidebar: () => void;
  setOpenSidebarFn: (fn: () => void) => void;
}

const MobileHeaderContext =
  createContext<MobileHeaderContextType | null>(null);

export function MobileHeaderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [rightElement, setRightElement] = useState<ReactNode | null>(null);
  const [leftElement, setLeftElement] = useState<ReactNode | null>(null);
  const [openSidebarFn, setOpenSidebarFn] = useState<() => void>(() => () => {
    /* no-op until sidebar registers */
  });

  const registerOpenSidebar = useCallback(
    (fn: () => void) => setOpenSidebarFn(() => fn),
    []
  );

  return (
    <MobileHeaderContext.Provider
      value={{
        rightElement,
        setRightElement,
        leftElement,
        setLeftElement,
        openSidebar: openSidebarFn,
        setOpenSidebarFn: registerOpenSidebar,
      }}
    >
      {children}
    </MobileHeaderContext.Provider>
  );
}

export function useMobileHeader() {
  const context = useContext(MobileHeaderContext);
  if (!context) {
    throw new Error(
      "useMobileHeader must be used within MobileHeaderProvider"
    );
  }
  return context;
}
