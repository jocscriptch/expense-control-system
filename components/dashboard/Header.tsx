"use client";

import Button from "@/components/ui/button";
import { getLastMonths } from "@/lib/utils/date";
import { useTransactionModal } from "@/features/transactions/context/TransactionModalContext";
import { useCommandMenu } from "@/context/CommandMenuContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { openModal } = useTransactionModal();
  const { openCommandMenu } = useCommandMenu();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const months = getLastMonths(3);

  const currentMonth = searchParams.has("month") ? Number(searchParams.get("month")) : new Date().getMonth();
  const currentYear = searchParams.has("year") ? Number(searchParams.get("year")) : new Date().getFullYear();

  const currentMonthLabel = months.find(m => m.month === currentMonth && m.year === currentYear)?.label || months[0].label;

  const handleMonthChange = (m: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", m.month.toString());
    params.set("year", m.year.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

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
        {/* Month Selector - Desktop Only */}
        <div className="hidden md:block">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={`group relative flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold transition-all focus:outline-none ${
                    currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                    ? "bg-background border-border hover:border-primary/50 text-text-main"
                    : "bg-background border-primary/40 text-text-main shadow-sm"
                }`}
              >
                <span className="capitalize">{currentMonthLabel}</span>
                <span className={`material-symbols-outlined text-lg ml-0.5 transition-colors ${
                  currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                  ? "text-text-sub group-hover:text-primary"
                  : "text-primary"
                }`}>
                  expand_more
                </span>
                {/* Indicador sutil de que no es el mes actual */}
                {!(currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary/60"></span>
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1.5 bg-surface border border-border shadow-2xl mt-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col gap-1">
                {months.map((m) => {
                  const isActive = currentMonth === m.month && currentYear === m.year;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleMonthChange(m)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold rounded-lg transition-all capitalize group ${
                        isActive
                          ? "bg-primary text-[#0d1b12]"
                          : "text-text-sub hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {m.label}
                      </div>
                      {isActive && (
                        <span className="material-symbols-outlined text-[20px]">check</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="hidden md:block h-6 w-px bg-border mx-1"></div>

        <Button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-[#102216] px-3 md:px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 border-0 font-bold shrink-0 h-10"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span className="text-sm hidden sm:inline font-black">Nuevo gasto</span>
        </Button>
      </div>
    </header>
  );
}
