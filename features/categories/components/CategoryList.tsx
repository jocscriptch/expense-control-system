"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CategoryFormModal } from "@/features/categories/components/CategoryFormModal";
import {
  getCategoriesWithBudgetsAction,
  deleteCategoryAction,
} from "../actions";
import { CategoryWithBudget } from "../types";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { AmountDisplay } from "@/components/ui/AmountDisplay";

export function CategoryList() {
  const [categories, setCategories] = useState<CategoryWithBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    fetchCategories(false);
  }, [fetchCategories]);

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

  // Cálculos para KPIs
  const totalBudget = categories.reduce(
    (acc, cat) => acc + (cat.budget?.amount_limit || 0),
    0,
  );

  return (
    <>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-text-sub text-sm font-medium">
                Presupuesto Total
              </h3>
              <span className="material-symbols-outlined text-[20px] text-primary/40">
                account_balance_wallet
              </span>
            </div>
            <AmountDisplay
              value={totalBudget}
              className="text-3xl font-bold text-text-main mt-1"
              symbolClassName="text-primary/60"
            />
            <p className="text-xs text-text-dim mt-3">
              Límite mensual planificado
            </p>
          </div>

          <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-text-sub text-sm font-medium">
                Categorías de Gasto
              </h3>
              <span className="material-symbols-outlined text-[20px] text-text-dim">
                category
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-text-main">
                {categories.length}
              </span>
              <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full mx-1">
                Gastos
              </span>
            </div>
            <p className="text-xs text-text-dim mt-3">
              Control de flujos configurados
            </p>
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

        {/* Listado en Tabla */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-colors duration-200">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[800px] text-left text-sm whitespace-nowrap">
              <thead className="bg-background/80 text-text-sub font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4 w-16 text-center font-semibold tracking-wide">
                    Icono
                  </th>
                  <th className="px-6 py-4 w-auto font-semibold tracking-wide">
                    Categoría
                  </th>
                  <th className="px-6 py-4 w-40 text-right font-semibold tracking-wide">
                    Límite Mensual
                  </th>
                  <th className="px-6 py-4 w-24 text-right font-semibold tracking-wide">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-10 w-10 bg-border rounded-lg mx-auto"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-32 bg-border rounded"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-4 w-16 bg-border rounded ml-auto"></div>
                      </td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  ))
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-text-dim italic"
                    >
                      No tienes categorías registradas aún.
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="group hover:bg-background/50 transition-colors"
                    >
                      <td className="px-6 py-3 text-center align-middle">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center border mx-auto shadow-sm"
                          style={{
                            backgroundColor: `${cat.color}15`,
                            color: cat.color,
                            borderColor: `${cat.color}30`,
                          }}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {cat.icon}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-text-main text-base leading-none">
                            {cat.name}
                          </span>
                          {(cat.transactionCount ?? 0) > 0 && (
                            <span 
                              className="text-[10px] px-2 py-0.5 rounded-md font-bold border leading-none shadow-sm"
                              style={{
                                backgroundColor: `${cat.color}15`,
                                color: cat.color,
                                borderColor: `${cat.color}30`,
                              }}
                            >
                              {cat.transactionCount} {cat.transactionCount === 1 ? 'gasto' : 'gastos'}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-3 text-right">
                        {cat.budget ? (
                          <div className="flex justify-end tabular-nums">
                            <AmountDisplay
                              value={Number(cat.budget.amount_limit)}
                              className="font-bold text-text-main text-base"
                              symbolClassName="text-primary/60"
                              gap="gap-[2px]"
                            />
                          </div>
                        ) : (
                          <span className="text-text-dim text-xs select-none">
                            Sin límite
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-1 text-text-sub hover:text-primary transition-colors"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => initiateDelete(cat)}
                            className="p-1 text-text-sub hover:text-red-500 transition-colors"
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Formulario */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        categoryData={editingCategory}
      />

      {/* Diálogo de Confirmación de Borrado */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={deleteError ? "No se puede eliminar" : "¿Eliminar categoría?"}
        description={
          deleteError
            ? deleteError.message
            : `¿Estás seguro de que deseas eliminar "${categoryToDelete?.name}"? Esta acción no se puede deshacer.`
        }
        confirmText={deleteError ? "Entendido" : "Eliminar"}
        cancelText={deleteError ? "" : "Cancelar"}
        variant={deleteError ? "primary" : "danger"}
        icon={deleteError ? "error" : "delete"}
      />
    </>
  );
}
