"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-10 shrink-0">
      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-lg leading-5 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm transition-shadow" 
            placeholder="Buscar transacciones, categorías..." 
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Month Selector */}
        <div className="relative">
          <select className="appearance-none bg-white border border-gray-100 text-gray-700 py-2 pl-4 pr-10 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-primary text-sm font-medium cursor-pointer hover:bg-gray-50 transition-colors">
            <option>Octubre 2023</option>
            <option>Septiembre 2023</option>
            <option>Agosto 2023</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

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
