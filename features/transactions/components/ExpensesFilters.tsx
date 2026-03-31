"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Category } from "../types";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ExpensesFiltersProps {
  categories?: Category[];
}

export function ExpensesFilters({ categories = [] }: ExpensesFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchTerm !== (searchParams.get("q") || "")) {
        setFilter("q", searchTerm || null);
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const currentCategory = searchParams.get("category");
  const currentMethod = searchParams.get("method");
  const householdOnly = searchParams.get("household") === "true";
  const dateFilter = searchParams.get("date");

  return (
    <div className="mb-6 bg-surface p-4 rounded-xl shadow-sm border border-border">
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <DateFilterSelector
          current={dateFilter}
          onChange={(v: string | null) => setFilter("date", v)}
        />
        <CategoryFilterSelector
          categories={categories}
          current={currentCategory}
          onChange={(v: string | null) => setFilter("category", v)}
        />
        <MethodFilterSelector
          current={currentMethod}
          onChange={(v: string | null) => setFilter("method", v)}
        />
      </div>

      <div className="hidden sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <DateFilterSelector
          current={dateFilter}
          onChange={(v: string | null) => setFilter("date", v)}
        />
        <CategoryFilterSelector
          categories={categories}
          current={currentCategory}
          onChange={(v: string | null) => setFilter("category", v)}
        />
        <MethodFilterSelector
          current={currentMethod}
          onChange={(v: string | null) => setFilter("method", v)}
        />
        <label className="flex items-center gap-2 cursor-pointer h-10 px-3 rounded-lg hover:bg-background transition-colors select-none">
          <input
            className="size-4 rounded cursor-pointer accent-[var(--color-primary)]"
            type="checkbox"
            checked={householdOnly}
            onChange={(e) =>
              setFilter("household", e.target.checked ? "true" : null)
            }
          />
          <span className="text-sm font-medium text-text-main">
            Solo gastos del hogar
          </span>
        </label>
        <div className="flex-grow"></div>
        <div className="relative w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-text-sub text-[20px]">
              search
            </span>
          </div>
          <input
            className="block w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm placeholder:text-text-dim text-text-main focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            placeholder="Buscar por descripción..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 sm:hidden">
        <label className="flex items-center gap-2 cursor-pointer h-10 px-3 rounded-lg hover:bg-background transition-colors select-none">
          <input
            className="size-4 rounded cursor-pointer accent-[var(--color-primary)]"
            type="checkbox"
            checked={householdOnly}
            onChange={(e) =>
              setFilter("household", e.target.checked ? "true" : null)
            }
          />
          <span className="text-sm font-medium text-text-main">
            Solo gastos del hogar
          </span>
        </label>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-text-sub text-[20px]">
              search
            </span>
          </div>
          <input
            className="block w-full rounded-lg border border-border bg-background py-2 pl-10 pr-3 text-sm placeholder:text-text-dim text-text-main focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            placeholder="Buscar por descripción..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  icon,
  label,
  isActive,
}: {
  icon: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <button
      className={`group relative flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-all focus:outline-none w-full sm:w-auto ${isActive ? "bg-primary/10 border-primary text-primary" : "bg-background border-border hover:border-primary/50 text-text-main"}`}
    >
      {isActive && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface sm:hidden" />
      )}
      <span
        className={`material-symbols-outlined text-[18px] ${isActive ? "text-primary" : "text-text-sub group-hover:text-primary"}`}
      >
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
      <span className="material-symbols-outlined text-text-sub text-lg ml-1 hidden sm:inline">
        expand_more
      </span>
    </button>
  );
}

function CategoryFilterSelector({
  categories,
  current,
  onChange,
}: {
  categories: Category[];
  current: string | null;
  onChange: (v: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = categories.find((c) => c.id === current);
  const label = selected ? selected.name : "Categoría: Todas";

  return (
    <div className="relative" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        <FilterButton
          icon={selected ? selected.icon || "category" : "category"}
          label={label}
          isActive={!!current}
        />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-64 bg-surface border border-border rounded-xl shadow-xl z-[1000] overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
          <div className="max-h-[280px] overflow-y-auto p-1.5 custom-scrollbar">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${!current ? "bg-primary/10 text-primary" : "hover:bg-background text-text-main"}`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-lg border ${!current ? "bg-primary/20 border-primary/30" : "bg-background border-border"}`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  apps
                </span>
              </div>
              <span className="text-sm font-semibold">
                Todas las categorías
              </span>
              {!current && (
                <span className="material-symbols-outlined ml-auto text-primary text-[20px]">
                  check
                </span>
              )}
            </button>
            <div className="h-px bg-border my-1 w-full" />

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onChange(cat.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors group ${current === cat.id ? "bg-primary/10 text-primary" : "hover:bg-background text-text-main"}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${current === cat.id ? "bg-primary/20 border-primary/30" : "bg-background border-border group-hover:border-text-dim"}`}
                  style={{ color: cat.color }}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {cat.icon || "category"}
                  </span>
                </div>
                <span className="text-sm font-semibold flex-1">{cat.name}</span>
                {current === cat.id && (
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MethodFilterSelector({
  current,
  onChange,
}: {
  current: string | null;
  onChange: (v: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const methods = [
    { id: "cash", name: "Efectivo", icon: "payments" },
    { id: "card", name: "Tarjeta", icon: "credit_card" },
    { id: "sinpe", name: "SINPE Móvil", icon: "smartphone" },
  ];

  const selected = methods.find((m) => m.id === current);
  const label = selected ? selected.name : "Método: Todos";

  return (
    <div className="relative" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        <FilterButton
          icon={selected ? selected.icon : "account_balance_wallet"}
          label={label}
          isActive={!!current}
        />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 sm:left-0 sm:right-auto sm:translate-x-0 w-52 bg-surface border border-border rounded-xl shadow-xl z-[1000] overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
          <div className="p-1.5">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${!current ? "bg-primary/10 text-primary" : "hover:bg-background text-text-main"}`}
            >
              <span className="material-symbols-outlined text-[20px] ml-1">
                apps
              </span>
              <span className="text-sm font-semibold flex-1">Todos</span>
              {!current && (
                <span className="material-symbols-outlined ml-auto text-primary text-[20px]">
                  check
                </span>
              )}
            </button>

            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  onChange(m.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors group ${current === m.id ? "bg-primary/10 text-primary" : "hover:bg-background text-text-main"}`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ml-1 ${current === m.id ? "text-primary" : "text-text-sub group-hover:text-text-main"}`}
                >
                  {m.icon}
                </span>
                <span className="text-sm font-semibold flex-1">{m.name}</span>
                {current === m.id && (
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DateFilterSelector({
  current,
  onChange,
}: {
  current: string | null;
  onChange: (v: string | null) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        const isCalendarClick = (e.target as HTMLElement).closest(".rdp");
        if (!isCalendarClick) setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let label = "Fecha: Todo";
  let icon = "calendar_today";
  let isActive = !!current;

  if (current === "this_month") label = "Último mes";
  else if (current === "this_year") label = "Este año";
  else if (current) {
    const d = new Date(current + "T00:00:00");
    if (!isNaN(d.getTime())) {
      label = format(d, "d MMM yyyy", { locale: es });
      icon = "event";
    }
  }

  const [calDate, setCalDate] = useState<Date | undefined>();

  const handleCalSelect = (d: Date | undefined) => {
    if (d) {
      onChange(format(d, "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        <FilterButton icon={icon} label={label} isActive={isActive} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[310px] bg-surface border border-border rounded-xl shadow-xl z-[1000] overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top flex flex-col">
          <div className="p-1.5 grid grid-cols-2 gap-1 border-b border-border bg-background/50">
            <button
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${!current ? "bg-primary text-[#0d1b12]" : "hover:bg-background text-text-sub"}`}
            >
              Todos
            </button>
            <button
              onClick={() => {
                onChange("this_month");
                setIsOpen(false);
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${current === "this_month" ? "bg-primary text-[#0d1b12]" : "hover:bg-background text-text-sub"}`}
            >
              Último mes
            </button>
            <button
              onClick={() => {
                onChange("this_year");
                setIsOpen(false);
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-colors col-span-2 ${current === "this_year" ? "bg-primary text-[#0d1b12]" : "hover:bg-background text-text-sub"}`}
            >
              Este año
            </button>
          </div>

          <div className="p-2 flex justify-center">
            <Calendar
              mode="single"
              selected={
                current && !["this_month", "this_year"].includes(current)
                  ? new Date(current + "T00:00:00")
                  : calDate
              }
              onSelect={handleCalSelect}
              locale={es}
              className="scale-95 origin-top"
            />
          </div>
        </div>
      )}
    </div>
  );
}
