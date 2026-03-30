import React from "react";
import { CategoryList } from "@/features/categories/components/CategoryList";

export default function CategoriesPage() {
  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main">
            Categorías y Presupuestos
          </h2>
          <p className="text-text-sub mt-1">
            Administra tus categorías de gastos e ingresos, y define límites de
            presupuesto mensuales para mantener el control de tus finanzas.
          </p>
        </div>
      </div>

      {/* Listado Principal de Categorías (con botones encapsulados) */}
      <CategoryList />
    </div>
  );
}
