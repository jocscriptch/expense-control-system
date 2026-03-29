"use client";

import React, { useState, useRef, useEffect } from "react";
import type { Category } from "../types";

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
}

export function CategorySelect({
  categories,
  value,
  onChange,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCategory = categories.find((cat) => cat.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-sm font-medium text-text-main">Categoría</label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 pl-4 pr-10 bg-background border rounded-xl text-left flex items-center gap-3 transition-all focus:ring-2 focus:ring-primary/20 ${
          isOpen
            ? "border-primary ring-2 ring-primary/10 shadow-sm"
            : "border-border hover:border-text-dim"
        }`}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface text-text-sub border border-border/50">
          <span className="material-symbols-outlined text-[20px]">
            {selectedCategory?.icon || "category"}
          </span>
        </div>
        <span
          className={`text-base font-medium ${selectedCategory ? "text-text-main" : "text-text-dim"}`}
        >
          {selectedCategory?.name || "Seleccionar categoría"}
        </span>
        <span
          className={`material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-dim transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top">
          <div className="max-h-[280px] overflow-y-auto p-1.5 custom-scrollbar">
            {categories.length === 0 && (
              <p className="text-sm text-text-dim p-4 text-center">
                No hay categorías disponibles
              </p>
            )}

            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors group ${
                  value === cat.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-background text-text-sub hover:text-text-main"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
                    value === cat.id
                      ? "bg-primary/20 border-primary/30"
                      : "bg-background border-border group-hover:border-text-dim"
                  }`}
                  style={{ color: cat.color }}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {cat.icon || "category"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{cat.name}</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-60">
                    {cat.type === "expense" ? "Gasto" : "Ingreso"}
                  </span>
                </div>
                {value === cat.id && (
                  <span className="material-symbols-outlined ml-auto text-primary text-[20px]">
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
