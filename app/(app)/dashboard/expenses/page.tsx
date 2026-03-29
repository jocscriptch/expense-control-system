import React from "react";
import { ExpensesFilters } from "@/features/transactions/components/ExpensesFilters";
import { ExpensesTable } from "@/features/transactions/components/ExpensesTable";

export default function ExpensesListPage() {
  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* Page Header & Title */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main">
            Lista de Gastos
          </h2>
          <p className="text-text-sub mt-1">
            Gestiona y visualiza tus gastos personales y del hogar de manera
            eficiente.
          </p>
        </div>
      </div>

      {/* Filters Section (Feature) */}
      <ExpensesFilters />

      {/* Data Table Section (Feature) */}
      <ExpensesTable />
    </div>
  );
}
