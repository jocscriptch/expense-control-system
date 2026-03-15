"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { getLastMonths } from "@/lib/utils/date";

export default function Header() {
  const router = useRouter();
  const months = getLastMonths(3);
  
  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 z-10 shrink-0">
      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg leading-5 bg-background text-text-main placeholder:text-text-dim focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow" 
            placeholder="Buscar transacciones, categorías..." 
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Month Selector */}
        <div className="relative">
          <select className="appearance-none bg-surface border border-border text-text-main py-2 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:border-primary text-sm font-medium cursor-pointer hover:bg-surface-hover transition-colors capitalize">
            {months.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-dim">
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </div>
        </div>

        <div className="h-6 w-px bg-border mx-1"></div>

        <Button 
          onClick={() => router.push('/dashboard/new-expense')}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-[#102216] px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 border-0 font-bold"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span className="text-sm">Nuevo gasto</span>
        </Button>
      </div>
    </header>
  );
}

