"use client";

import React from "react";
import { useTransactionForm } from "../hooks/useTransactionForm";
import type { Category } from "../types";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { TransactionOptions } from "./TransactionOptions";
import { useRouter } from "next/navigation";

import { ReceiptUpload } from "./ReceiptUpload";

interface TransactionFormProps {
  categories: Category[];
}

/**
 * Shell del formulario de Registro de Gasto.
 * Orquestra los sub-componentes y el layout general.
 */
export function TransactionForm({ categories }: TransactionFormProps) {
  const router = useRouter();
  const { control, onSubmit, isLoading, setValue } = useTransactionForm();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* ... cabecera ... */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-text-main">
          Registrar Gasto
        </h1>
        <p className="text-primary text-sm font-medium">
          Ingresa los detalles de tu nuevo movimiento
        </p>
      </div>

      <div className="w-full max-w-5xl bg-surface rounded-xl border border-border flex flex-col lg:flex-row transition-colors overflow-hidden ring-1 ring-border/50 shadow-sm">
        {/* Columna Izquierda: Datos principales */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 border-r border-border">
          {/* Monto */}
          <div className="">
            <label className="block text-sm font-medium text-text-sub mb-2">
              Monto del gasto
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-bold text-text-main pl-4">
                ₡
              </span>
              <input
                autoFocus
                type="number"
                min="0.01"
                step="0.01"
                className="w-full bg-background border-0 rounded-2xl py-4 md:py-6 pl-10 md:pl-12 pr-6 text-3xl md:text-5xl font-bold text-text-main placeholder:text-text-dim focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
                placeholder="0.00"
                onChange={(e) => setValue("amount", parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Categoría y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-text-main">
                Categoría
              </label>
              <div className="relative">
                <select
                  className="w-full h-12 pl-11 pr-10 bg-background border border-border rounded-xl text-base focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer text-text-main"
                  onChange={(e) => setValue("category_id", e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Seleccionar
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none">
                  category
                </span>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-dim pointer-events-none text-xl">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 relative">
              <label className="text-sm font-medium text-text-main">Fecha</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full h-12 pl-11 pr-4 bg-background border border-border rounded-xl text-base focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-text-main"
                  onChange={(e) => setValue("date", e.target.value)}
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sub pointer-events-none">
                  calendar_today
                </span>
              </div>
            </div>
          </div>

          <PaymentMethodSelector control={control} />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-main">
              Nota (Opcional)
            </label>
            <textarea
              rows={2}
              className="w-full p-3 bg-background border border-border rounded-xl text-base text-text-main focus:border-primary focus:ring-1 focus:ring-primary resize-none placeholder:text-text-dim"
              placeholder="Añade una descripción..."
              onChange={(e) => setValue("description", e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Columna Derecha: Opciones y Comprobante */}
        <div className="w-full lg:w-[320px] bg-surface p-6 sm:p-8 flex flex-col gap-6 justify-between border-l border-border">
          <div className="flex flex-col gap-6">
            <TransactionOptions control={control} />

            <ReceiptUpload 
              onFileSelect={(file) => setValue("file", file)} 
            />
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-3 mt-auto pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-[#0fd650] text-[#0d1b12] font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0d1b12]"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined font-fill text-[20px]">
                    check_circle
                  </span>
                  Guardar gasto
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
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
