"use client";

import React, { useState, useEffect } from "react";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData?: any | null;
}

const PREDEFINED_EXPENSE_ICONS = [
  "home",
  "restaurant",
  "directions_car",
  "shopping_cart",
  "local_hospital",
  "school",
  "movie",
  "bolt",
  "flight",
  "pets",
  "fitness_center",
  "checkroom",
  "build",
  "water_drop",
  "styler",
  "sports_esports",
  "menu_book",
  "train",
  "local_cafe",
  "celebration",
  "favorite",
  "child_care",
  "spa",
  "receipt_long",
];

const PREDEFINED_INCOME_ICONS = [
  "payments",
  "account_balance_wallet",
  "savings",
  "trending_up",
  "work",
  "redeem",
  "storefront",
  "monetization_on",
  "account_balance",
  "contract",
  "volunteer_activism",
  "real_estate_agent",
  "sell",
  "stars",
  "add_circle",
  "attach_money",
  "cases",
  "assured_workload",
  "diamond",
  "point_of_sale",
  "handshake",
  "apartment",
  "verified",
  "thumb_up",
];

export function CategoryFormModal({
  isOpen,
  onClose,
  categoryData,
}: CategoryFormModalProps) {
  // Estado local para los campos simulados
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [color, setColor] = useState("#f97316");
  const [icon, setIcon] = useState("category");
  const [budget, setBudget] = useState("");

  const isEditing = !!categoryData;

  useEffect(() => {
    if (isOpen) {
      if (categoryData) {
        setName(categoryData.name);
        setType(categoryData.type);
        setColor(categoryData.color);
        setIcon(categoryData.icon);
        setBudget(categoryData.budget ? categoryData.budget.toString() : "");
      } else {
        setName("");
        setType("expense");
        setColor("#13ec5b"); // color primary por defecto
        setIcon("");
        setBudget("");
      }
    }
  }, [isOpen, categoryData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submit (cerrar modal)
    onClose();
  };

  const currentIcons =
    type === "income" ? PREDEFINED_INCOME_ICONS : PREDEFINED_EXPENSE_ICONS;
  const fallbackIcon = type === "income" ? "payments" : "category";
  const placeholderText =
    type === "income"
      ? "Ej. Salario, Bono, Venta"
      : "Ej. Comida, Transporte, Renta";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity p-4">
      {/* Contenedor del Modal */}
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-border/50">
          <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              {isEditing ? "edit_note" : "add_circle"}
            </span>
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-sub hover:text-red-500 hover:bg-surface-hover p-1.5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Tipo de Categoría (Segmented Control Avanzado) */}
          <div className="flex items-center gap-2 bg-surface-hover p-1.5 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setIcon("");
                setColor("#13ec5b");
              }}
              className={`flex-1 py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${
                type === "expense"
                  ? "bg-background shadow-md text-red-500 font-bold border border-border"
                  : "text-text-sub font-medium hover:text-text-main hover:bg-surface"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${type === "expense" ? "bg-red-500" : "bg-transparent"}`}
              ></span>
              Gasto
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income");
                setIcon("");
                setColor("#13ec5b");
              }}
              className={`flex-1 py-2 text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${
                type === "income"
                  ? "bg-background shadow-md text-primary font-bold border border-border"
                  : "text-text-sub font-medium hover:text-text-main hover:bg-surface"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${type === "income" ? "bg-primary" : "bg-transparent"}`}
              ></span>
              Ingreso
            </button>
          </div>

          <div className="flex gap-4">
            {/* Ícono seleccionado (visual) */}
            <div
              className="w-16 h-16 rounded-xl border border-border flex items-center justify-center shadow-inner shrink-0 transition-colors"
              style={{ backgroundColor: `${color}15`, color: color }}
            >
              <span className="material-symbols-outlined text-3xl">
                {icon || fallbackIcon}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              {/* Nombre */}
              <div>
                <label className="text-xs font-medium text-text-sub mb-1 block">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={placeholderText}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  required
                />
              </div>

              {/* Selector de Icono / Color */}
              <div>
                <label className="text-xs font-medium text-text-sub mb-2 block">
                  Color y Selecciona un Icono
                </label>
                <div className="flex gap-4 items-start">
                  {/* Selector de color */}
                  <div className="relative shrink-0 mt-0.5">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-[52px] w-[52px] p-0 border border-border rounded-xl cursor-pointer bg-background overflow-hidden shadow-sm hover:scale-105 transition-transform hover:ring-2 ring-primary/30"
                      title="Seleccionar color"
                    />
                  </div>

                  {/* Grilla visual de íconos (Grid Perfecto) */}
                  <div className="flex-1 grid grid-cols-4 sm:grid-cols-8 gap-2 bg-background p-3 rounded-xl border border-border shadow-inner">
                    {currentIcons.map((ico) => (
                      <button
                        key={ico}
                        type="button"
                        onClick={() => setIcon(ico)}
                        className={`flex justify-center items-center w-full aspect-square rounded-lg transition-colors ${
                          icon === ico
                            ? "shadow-sm"
                            : "text-text-sub hover:text-text-main hover:bg-surface-hover"
                        }`}
                        style={
                          icon === ico
                            ? {
                                color: color,
                                backgroundColor: `${color}15`,
                                boxShadow: `inset 0 0 0 2px ${color}`,
                              }
                            : {}
                        }
                        title="Seleccionar Icono"
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          {ico}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Límite de Presupuesto (Sólo para Gastos) */}
          {type === "expense" && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <label className="text-xs font-medium text-text-sub mb-1 block">
                Límite Mensual (Presupuesto)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim font-medium">
                  ₡
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={budget}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || Number(val) >= 0) {
                      setBudget(val);
                    }
                  }}
                  placeholder="0.00 (Opcional)"
                  className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          )}

          {/* Footer del Formulario */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-text-sub hover:text-text-main transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-[#0d1b12] text-sm font-bold rounded-xl hover:bg-primary-hover hover:scale-105 transition-all shadow-md shadow-primary/20"
            >
              {isEditing ? "Guardar cambios" : "Crear Categoría"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
