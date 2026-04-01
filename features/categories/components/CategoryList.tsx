"use client";

import React, { useState, useCallback } from "react";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";
import {
  getCategoriesWithBudgetsAction,
  deleteCategoryAction,
} from "../actions";
import { CategoryWithBudget } from "../types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { ResponsiveTableWrapper } from "@/components/ui/ResponsiveTableWrapper";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useIsMobile } from "@/hooks/useIsMobile";

interface CategoryListProps {
  initialCategories: CategoryWithBudget[];
}

export function CategoryList({ initialCategories }: CategoryListProps) {
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "true";
  const isMobile = useIsMobile();

  const [categories, setCategories] = useState<CategoryWithBudget[]>(
    initialCategories.filter((c) => c.type === "expense"),
  );
  
  React.useEffect(() => {
    setCategories(initialCategories.filter((c) => c.type === "expense"));
  }, [initialCategories]);

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryWithBudget | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<CategoryWithBudget | null>(null);
  const [deleteError, setDeleteError] = useState<{
    message: string;
    count?: number;
  } | null>(null);

  const fetchCategories = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    const result = await getCategoriesWithBudgetsAction();
    if (result.success && result.data) {
      setCategories(
        result.data.filter((c: CategoryWithBudget) => c.type === "expense"),
      );
    }
    if (!silent) setIsLoading(false);
  }, []);

  const handleOpenNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: CategoryWithBudget) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchCategories(true);
  };

  const initiateDelete = (category: CategoryWithBudget) => {
    setCategoryToDelete(category);
    setDeleteError(null);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    if (deleteError) {
      setIsDeleteConfirmOpen(false);
      setDeleteError(null);
      return;
    }

    const result = await deleteCategoryAction(categoryToDelete.id);
    if (result.success) {
      toast.success("Categoría eliminada", { icon: "🗑️" });
      setIsDeleteConfirmOpen(false);
      setCategoryToDelete(null);
      fetchCategories(true);
    } else {
      setDeleteError({
        message: result.message || "Error al eliminar",
        count: result.count,
      });
    }
  };

  const totalBudget = categories.reduce(
    (acc, cat) => acc + (cat.budget?.amount_limit || 0),
    0,
  );

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-2 text-sm font-medium text-text-sub">
              <h3>Presupuesto Total</h3>
              <span className="material-symbols-outlined text-[20px] text-primary/40">account_balance_wallet</span>
            </div>
            <AmountDisplay
              value={totalBudget}
              className="text-3xl font-bold text-text-main mt-1"
              symbolClassName="text-primary/60"
            />
            <p className="text-xs text-text-dim mt-3">Límite mensual planificado</p>
          </div>

          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-2 text-sm font-medium text-text-sub">
              <h3>Categorías de Gasto</h3>
              <span className="material-symbols-outlined text-[20px] text-text-dim">category</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-text-main">{categories.length}</span>
              <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full mx-1">Gastos</span>
            </div>
            <p className="text-xs text-text-dim mt-3">Control de flujos configurados</p>
          </div>

          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all flex flex-col justify-center items-start">
            <h3 className="text-text-main font-bold mb-3 italic">Gestión Rápida</h3>
            
            {/* 
                Lógica de resaltado nativa incorporada al contenedor del botón 
                para evitar wrappers que rompan el Tour (Web).
            */}
            <div 
              id="btn-new-category"
              className={`w-full relative transition-all duration-500 rounded-xl ${
                isOnboarding && isMobile 
                  ? "ring-4 ring-primary ring-offset-4 ring-offset-background animate-pulse shadow-2xl shadow-primary/40 p-[2px]" 
                  : "p-0"
              }`}
            >
              <button
                onClick={handleOpenNew}
                className="w-full flex items-center justify-center gap-2 bg-primary text-[#0d1b12] px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-hover hover:scale-[1.02] transition-all shadow-md shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Crear Nueva Categoría
              </button>
              
              {/* Badge flotante sincronizado (solo si se muestra el resaltado) */}
              {isOnboarding && isMobile && (
                <div className="absolute -bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="bg-primary text-[#0d1b12] text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
                    Configuración Inicial
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <ResponsiveTableWrapper
          desktopContent={
            <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
              <thead className="bg-background/80 text-text-sub font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4 w-16 text-center font-semibold tracking-wide">Icono</th>
                  <th className="px-6 py-4 w-auto font-semibold tracking-wide">Categoría</th>
                  <th className="px-6 py-4 w-40 text-right font-semibold tracking-wide">Límite Mensual</th>
                  <th className="px-6 py-4 w-24 text-right font-semibold tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-10 w-10 bg-border rounded-lg mx-auto" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-32 bg-border rounded" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 w-16 bg-border rounded ml-auto" /></td>
                      <td className="px-6 py-4" />
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-dim italic">No tienes categorías registradas aún.</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-background/50 transition-colors">
                      <td className="px-6 py-3 text-center align-middle">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center border mx-auto shadow-sm"
                          style={{
                            backgroundColor: `${cat.color}15`,
                            color: cat.color,
                            borderColor: `${cat.color}30`,
                          }}
                        >
                          <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-bold text-text-main text-base">{cat.name}</td>
                      <td className="px-6 py-3 text-right tabular-nums font-bold text-text-main text-base">
                        {cat.budget && <AmountDisplay value={Number(cat.budget.amount_limit)} />}
                      </td>
                      <td className="px-6 py-3 text-right flex justify-end gap-2 pr-6">
                        <button onClick={() => handleOpenEdit(cat)} className="p-1 text-text-sub hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                        <button onClick={() => initiateDelete(cat)} className="p-1 text-text-sub hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          }
          mobileContent={
            categories.map((cat) => (
              <div key={`mobile-${cat.id}`} className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}30` }}
                  >
                    <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>{cat.name}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => handleOpenEdit(cat)} className="p-1.5 text-text-sub hover:text-primary rounded-lg"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                    <button onClick={() => initiateDelete(cat)} className="p-1.5 text-text-sub hover:text-red-500 rounded-lg"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                  </div>
                </div>
              </div>
            ))
          }
        />
      </div>

      <CategoryFormModal isOpen={isModalOpen} onClose={handleCloseModal} categoryData={editingCategory} />
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={deleteError ? "No se puede eliminar" : "¿Eliminar categoría?"}
        description={deleteError ? deleteError.message : `¿Estás seguro de que deseas eliminar "${categoryToDelete?.name}"?`}
        confirmText={deleteError ? "Entendido" : "Eliminar"}
        variant={deleteError ? "primary" : "danger"}
      />
    </>
  );
}
