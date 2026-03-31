import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { upsertCategoryAction } from "../actions";
import { CategoryFormData } from "../types";
import { formatInputAmount, parseInputAmount } from "@/components/ui/AmountDisplay";
import toast from "react-hot-toast";

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



export function CategoryFormModal({
  isOpen,
  onClose,
  categoryData,
}: CategoryFormModalProps) {
  // Estado local para los campos simulados
  const [name, setName] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [color, setColor] = useState("#f97316");
  const [icon, setIcon] = useState("category");
  const [budget, setBudget] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!categoryData;

  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (categoryData) {
        setName(categoryData.name);
        setType(categoryData.type);
        setColor(categoryData.color);
        setIcon(categoryData.icon);
        setBudget(categoryData.budget?.amount_limit ? categoryData.budget.amount_limit.toString() : "");
      } else {
        setName("");
        setType("expense");
        setColor("#13ec5b"); // color primary por defecto
        setIcon("");
        setBudget("");
      }
    }
  }, [isOpen, categoryData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Pequeño delay para activar la animación
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 350);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData: CategoryFormData = {
      id: categoryData?.id,
      name,
      type: "expense", // Forzamos siempre gasto
      color,
      icon: icon || fallbackIcon,
      amount_limit: budget ? parseFloat(budget) : null,
    };

    try {
      const result = await upsertCategoryAction(formData);
      if (result.success) {
        toast.success(isEditing ? "Categoría actualizada" : "Categoría creada");
        onClose();
      } else {
        setError(result.error || "Ocurrió un error inesperado.");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentIcons = PREDEFINED_EXPENSE_ICONS;
  const fallbackIcon = "category";
  const placeholderText = "Ej. Comida, Transporte, Renta";

  const content = (
    <div className="fixed inset-0 z-[1000] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div 
        className={`relative w-full sm:max-w-lg bg-surface border-t sm:border border-border sm:rounded-3xl shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.4)] sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-350 ease-out flex flex-col max-h-[90vh]
          ${isVisible
            ? "translate-y-0 sm:translate-y-0 sm:scale-100 sm:opacity-100"
            : "translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle para el bottom sheet en móvil */}
        <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex justify-between items-center px-5 pt-3 pb-3 sm:p-6 border-b border-border/50 shrink-0">
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

        <div className="overflow-y-auto w-full">
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}


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

          {/* Límite de Presupuesto */}
          <div className="transition-all duration-300 opacity-100 max-h-40">
            <label className="text-xs font-medium text-text-sub mb-1 block">
              Monto Mensual de Categoría
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim font-medium">
                ₡
              </span>
              <input
                type="text"
                value={formatInputAmount(budget)}
                onChange={(e) => {
                  const val = parseInputAmount(e.target.value);
                  setBudget(val);
                }}
                placeholder="Ej. 50 000"
                required
                className="w-full bg-background border border-border rounded-lg pl-8 pr-3 py-2.5 text-lg font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-main"
              />
            </div>
          </div>

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
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-[#0d1b12] text-sm font-bold rounded-xl hover:bg-primary-hover hover:scale-105 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
            >
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>}
              {isEditing ? "Guardar cambios" : "Crear Categoría"}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
