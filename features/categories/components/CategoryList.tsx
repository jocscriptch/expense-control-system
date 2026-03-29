"use client";

import React, { useState } from "react";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";

const DUMMY_CATEGORIES = [
  {
    id: "1",
    name: "Comida",
    icon: "restaurant",
    color: "#f97316", // orange-500
    type: "expense",
    budget: 300,
  },
  {
    id: "2",
    name: "Transporte",
    icon: "directions_car",
    color: "#3b82f6", // blue-500
    type: "expense",
    budget: 150,
  },
  {
    id: "3",
    name: "Salario",
    icon: "payments",
    color: "#10b981", // emerald-500
    type: "income",
    budget: null,
  },
  {
    id: "4",
    name: "Vivienda",
    icon: "home",
    color: "#8b5cf6", // violet-500
    type: "expense",
    budget: 800,
  },
  {
    id: "5",
    name: "Ocio",
    icon: "movie",
    color: "#ec4899", // pink-500
    type: "expense",
    budget: 100,
  },
];

export function CategoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const handleOpenNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* KPI Cards / Resumen de Presupuestos (Acorde al Diseño de Tarjetas Superiores) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-text-sub text-sm font-medium">Presupuesto Total</h3>
              <span className="material-symbols-outlined text-[20px] text-primary/40">account_balance_wallet</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-text-main">₡1,350.00</span>
            </div>
            <p className="text-xs text-text-dim mt-3">Límite mensual planificado</p>
          </div>

          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-text-sub text-sm font-medium">Categorías Activas</h3>
              <span className="material-symbols-outlined text-[20px] text-text-dim">category</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-text-main">5</span>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                4 gastos, 1 ingreso
              </span>
            </div>
            <p className="text-xs text-text-dim mt-3">Control de flujos configurados</p>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all flex flex-col justify-center items-start">
            <h3 className="text-text-main font-bold mb-3">Gestión Rápida</h3>
            <button
              onClick={handleOpenNew}
              className="w-full flex items-center justify-center gap-2 bg-primary text-[#0d1b12] px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Crear Nueva Categoría
            </button>
          </div>
        </div>

        {/* Listado en Tabla Clásica Fiel al Diseño */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-colors duration-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
              <thead className="bg-background/80 text-text-sub font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4 w-16 text-center font-semibold tracking-wide">Icono</th>
                  <th className="px-6 py-4 w-auto font-semibold tracking-wide">Categoría</th>
                  <th className="px-6 py-4 w-40 font-semibold tracking-wide">Tipo</th>
                  <th className="px-6 py-4 w-40 text-right font-semibold tracking-wide">Límite Mensual</th>
                  <th className="px-6 py-4 w-24 text-right font-semibold tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {DUMMY_CATEGORIES.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-background/50 transition-colors">
                    {/* Icono */}
                    <td className="px-6 py-3 text-center align-middle">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center border mx-auto shadow-sm"
                        style={{ backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}30` }}
                      >
                        <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                      </div>
                    </td>

                    {/* Nombre */}
                    <td className="px-6 py-3">
                      <div className="font-bold text-text-main text-base">{cat.name}</div>
                      <div className="text-xs text-text-sub mt-0.5">Gestión activa</div>
                    </td>

                    {/* Tipo Gasto/Ingreso */}
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-background border border-border text-text-sub">
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.type === "income" ? "bg-primary" : "bg-red-500"}`}></span>
                        {cat.type === "expense" ? "Gasto" : "Ingreso"}
                      </span>
                    </td>

                    {/* Presupuesto */}
                    <td className="px-6 py-3 text-right">
                      {cat.budget ? (
                        <div className="font-medium text-text-main tabular-nums">
                          ₡{cat.budget.toFixed(2)}
                        </div>
                      ) : (
                        <span className="text-text-dim text-xs select-none">Sin límite</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-1 text-text-sub hover:text-primary transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          className="p-1 text-text-sub hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between border-t border-border bg-surface px-6 py-4">
            <div className="text-xs text-text-sub">
              Mostrando <span className="font-medium text-text-main">1</span> a{" "}
              <span className="font-medium text-text-main">5</span> de{" "}
              <span className="font-medium text-text-main">5</span> resultados
            </div>
            <div className="flex gap-2">
              <button className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-text-sub hover:border-primary hover:text-primary disabled:opacity-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg bg-primary text-[#0d1b12] text-sm font-bold shadow-sm">
                1
              </button>
              <button className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-text-sub hover:border-primary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryData={editingCategory}
      />
    </>
  );
}
