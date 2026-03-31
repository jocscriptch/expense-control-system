"use client";

import Button from "@/components/ui/button";
import { getLastMonths } from "@/lib/utils/date";
import { useTransactionModal } from "@/features/transactions/context/TransactionModalContext";
import { useCommandMenu } from "@/context/CommandMenuContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { openModal } = useTransactionModal();
  const { openCommandMenu } = useCommandMenu();
  const months = getLastMonths(3);

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-3 md:px-6 z-10 shrink-0 sticky top-0">
      <div className="flex items-center gap-1 md:gap-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-text-sub hover:text-primary transition-colors"
          aria-label="Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>
      </div>

      {/* Search Bar - Interactive Trigger */}
      <div className="flex-1 max-w-md mx-2 md:mx-4">
        <button
          onClick={() => openCommandMenu()}
          className="group relative w-full flex items-center gap-3 px-3 py-1.5 border border-border rounded-full bg-background/50 hover:bg-background/80 hover:border-primary/50 transition-all cursor-pointer shadow-inner"
        >
          <span className="material-symbols-outlined text-[18px] text-text-dim group-hover:text-primary transition-colors">
            search
          </span>
          <span className="text-text-dim text-xs md:text-sm flex-1 text-left">
            ¿Qué necesitas hoy?...
          </span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-text-dim opacity-100 italic">
            <span className="text-[10px]">⌘</span> K
          </kbd>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-6">
        {/* Month Selector - Hidden on mobile */}
        <div className="relative hidden md:block">
          <select className="appearance-none bg-surface border border-border text-text-main py-2 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:border-primary text-sm font-medium cursor-pointer hover:bg-surface-hover transition-colors capitalize">
            {months.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-dim">
            <span className="material-symbols-outlined text-lg">
              expand_more
            </span>
          </div>
        </div>

        <div className="hidden md:block h-6 w-px bg-border mx-1"></div>

        <Button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-[#102216] px-3 md:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 border-0 font-bold shrink-0"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span className="text-sm hidden sm:inline">Nuevo gasto</span>
        </Button>
      </div>
    </header>
  );
}
