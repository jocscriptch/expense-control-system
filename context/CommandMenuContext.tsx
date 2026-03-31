"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CommandMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCommandMenu: () => void;
  closeCommandMenu: () => void;
  toggleCommandMenu: () => void;
}

const CommandMenuContext = createContext<CommandMenuContextType | undefined>(undefined);

export function CommandMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCommandMenu = () => setIsOpen(true);
  const closeCommandMenu = () => setIsOpen(false);
  const toggleCommandMenu = () => setIsOpen((prev) => !prev);

  // Escuchar el atajo de teclado globalmente
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandMenu();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandMenuContext.Provider value={{ isOpen, setIsOpen, openCommandMenu, closeCommandMenu, toggleCommandMenu }}>
      {children}
    </CommandMenuContext.Provider>
  );
}

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (context === undefined) {
    throw new Error("useCommandMenu must be used within a CommandMenuProvider");
  }
  return context;
}
