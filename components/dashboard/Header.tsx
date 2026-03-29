"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { getLastMonths } from "@/lib/utils/date";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
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

      {/* Search Bar - More flexible on mobile */}
      <div className="flex-1 max-w-md mx-2 md:mx-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-dim">
            <span className="material-symbols-outlined text-[18px]">
              search
            </span>
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-1.5 border border-border rounded-full bg-background/50 text-text-main placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-xs md:text-sm transition-all shadow-inner"
            placeholder="Buscar..."
          />
        </div>
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
          onClick={() => router.push("/dashboard/new-expense")}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-[#102216] px-3 md:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 border-0 font-bold shrink-0"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span className="text-sm hidden sm:inline">Nuevo gasto</span>
        </Button>
      </div>
    </header>
  );
}
