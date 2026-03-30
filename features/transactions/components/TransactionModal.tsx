"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TransactionForm } from "./TransactionForm";
import { EditTransactionForm } from "./EditTransactionForm";
import type { Category, TransactionWithCategory } from "../types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  editingTransaction?: TransactionWithCategory | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  categories,
  editingTransaction,
}: TransactionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  const content = (
    <div className="fixed inset-0 z-[999] flex flex-col justify-end sm:items-center sm:justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      <div
        className={`relative w-full sm:max-w-3xl bg-surface border-t sm:border border-border sm:rounded-3xl shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.4)] sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-350 ease-out
          ${
            isVisible
              ? "translate-y-0 sm:translate-y-0 sm:scale-100 sm:opacity-100"
              : "translate-y-full sm:translate-y-0 sm:scale-95 sm:opacity-0"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        <div className="flex items-center justify-between px-5 pt-4 pb-3 sm:px-6 sm:pt-5 border-b border-border">
          <div>
            <h2 className="text-lg font-black text-text-main tracking-tight">
              {editingTransaction ? "Editar Gasto" : "Registrar Gasto"}
            </h2>
            <p className="text-xs text-text-sub mt-0.5">
              {editingTransaction
                ? "Modifica los detalles de tu movimiento"
                : "Ingresa los detalles de tu nuevo movimiento"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-sub hover:text-text-main hover:bg-surface-hover rounded-xl transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto max-h-[85dvh] sm:max-h-[80vh]">
          {editingTransaction ? (
            <EditTransactionForm
              transaction={editingTransaction}
              categories={categories}
              onClose={onClose}
              onSuccess={onClose}
            />
          ) : (
            <TransactionForm
              categories={categories}
              onClose={onClose}
              onSuccess={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
