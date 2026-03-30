"use client";

import React from "react";
import { useTransactionForm } from "../hooks/useTransactionForm";
import type { Category } from "../types";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { TransactionOptions } from "./TransactionOptions";
import { useRouter } from "next/navigation";
import { ReceiptUpload } from "./ReceiptUpload";
import { CategorySelect } from "./CategorySelect";
import { DatePickerShadcn } from "./DatePickerShadcn";
import { useWatch } from "react-hook-form";

interface TransactionFormProps {
  categories: Category[];
  /** Cuando se pasa, el formulario se comporta en modo modal (sin encabezado de página) */
  onClose?: () => void;
  onSuccess?: () => void;
}

export function TransactionForm({ categories, onClose, onSuccess }: TransactionFormProps) {
  const router = useRouter();
  const isModalMode = !!onClose;

  const { control, onSubmit, isLoading, setValue } = useTransactionForm({
    onSuccess: onSuccess ?? (() => {}),
  });

  const categoryId = useWatch({ control, name: "category_id" });
  const dateValue = useWatch({ control, name: "date" });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Encabezado solo en modo página completa */}
      {!isModalMode && (
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-text-main">
            Registrar Gasto
          </h1>
          <p className="text-primary text-sm font-medium">
            Ingresa los detalles de tu nuevo movimiento
          </p>
        </div>
      )}

      <div className={`w-full bg-surface flex flex-col lg:flex-row transition-colors overflow-hidden ${isModalMode ? "gap-0" : "max-w-5xl rounded-xl border border-border ring-1 ring-border/50 shadow-sm"}`}>
        {/* Left panel: datos principales */}
        <div className={`flex-1 flex flex-col gap-5 ${isModalMode ? "p-5" : "p-6 sm:p-8 border-r border-border"}`}>
          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-text-sub mb-2">
              Monto del gasto
            </label>
            <div className="relative flex items-center">
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 font-bold text-text-main pl-4 ${isModalMode ? "text-xl" : "text-2xl md:text-4xl"}`}>
                ₡
              </span>
              <input
                autoFocus
                type="number"
                min="0.01"
                step="0.01"
                className={`w-full bg-background border-0 rounded-2xl font-bold text-text-main placeholder:text-text-dim focus:ring-2 focus:ring-primary focus:outline-none transition-shadow ${isModalMode ? "py-3 pl-9 pr-4 text-2xl" : "py-4 md:py-6 pl-10 md:pl-12 pr-6 text-3xl md:text-5xl"}`}
                placeholder="0.00"
                onChange={(e) => setValue("amount", parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CategorySelect
              categories={categories}
              value={categoryId}
              onChange={(id) => setValue("category_id", id)}
            />
            <DatePickerShadcn
              value={dateValue}
              onChange={(date) => setValue("date", date)}
            />
          </div>

          <PaymentMethodSelector control={control} />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main">
              Nota (Opcional)
            </label>
            <textarea
              rows={isModalMode ? 2 : 3}
              className="w-full p-3 bg-background border border-border rounded-xl text-base text-text-main focus:border-primary focus:ring-1 focus:ring-primary resize-none placeholder:text-text-dim"
              placeholder="Añade una descripción..."
              onChange={(e) => setValue("description", e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Right panel: opciones y comprobante */}
        <div className={`flex flex-col gap-5 justify-between ${isModalMode ? "border-t border-border p-5" : "w-full lg:w-[320px] bg-surface p-6 sm:p-8 border-l border-border"}`}>
          <div className="flex flex-col gap-5">
            <TransactionOptions control={control} />
            <ReceiptUpload onFileSelect={(file) => setValue("file", file)} />
          </div>

          <div className="flex flex-col gap-3 mt-auto pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-[#0fd650] text-[#0d1b12] font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0d1b12]" />
              ) : (
                <>
                  <span className="material-symbols-outlined font-fill text-[20px]">check_circle</span>
                  Guardar gasto
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose ?? (() => router.back())}
              className="w-full h-12 bg-transparent hover:bg-surface-hover text-text-sub hover:text-text-main font-medium rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
