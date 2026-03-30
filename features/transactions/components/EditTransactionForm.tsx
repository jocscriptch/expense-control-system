"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { Category, TransactionWithCategory } from "../types";
import type { TransactionFormValues } from "../schema";
import { updateTransactionAction, getReceiptSignedUrlAction, deleteReceiptAction } from "../actions";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { TransactionOptions } from "./TransactionOptions";
import { CategorySelect } from "./CategorySelect";
import { DatePickerShadcn } from "./DatePickerShadcn";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ReceiptPreviewModal } from "./ReceiptPreviewModal";
import { ReceiptUpload } from "./ReceiptUpload";
import { useWatch } from "react-hook-form";
import toast from "react-hot-toast";

interface EditTransactionFormProps {
  transaction: TransactionWithCategory;
  categories: Category[];
}

export function EditTransactionForm({ transaction, categories }: EditTransactionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Estado para gestionar si el archivo actual fue borrado
  const [currentAttachment, setCurrentAttachment] = React.useState<string | null>(transaction.attachment_url || null);
  
  // Confirm Delete state
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false);

  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const handleViewCurrent = async () => {
    if (!currentAttachment) return;
    const loadingToast = toast.loading("Cargando comprobante...");
    const result = await getReceiptSignedUrlAction(currentAttachment);
    toast.dismiss(loadingToast);

    if (result.success && result.url) {
      setPreviewUrl(result.url);
      setIsPreviewOpen(true);
    } else {
      toast.error(result.error || "No se pudo cargar.");
    }
  };

  const handleDeleteCurrent = () => {
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentAttachment) return;
    setIsConfirmDeleteOpen(false);

    const loadingToast = toast.loading("Eliminando archivo...");
    const result = await deleteReceiptAction(transaction.id, currentAttachment);
    toast.dismiss(loadingToast);

    if (result.success) {
      setCurrentAttachment(null);
      toast.success("Archivo eliminado correctamente.");
    } else {
      toast.error(result.error || "No se pudo eliminar.");
    }
  };

  const { control, setValue, handleSubmit } = useForm<TransactionFormValues>({
    defaultValues: {
      amount: transaction.amount,
      category_id: transaction.category_id ?? "",
      date: transaction.date,
      description: transaction.description ?? "",
      payment_method: transaction.payment_method,
      is_recurring: transaction.is_recurring,
      is_household: transaction.is_household,
      is_shared: transaction.is_shared,
    },
  });

  const categoryId = useWatch({ control, name: "category_id" });
  const dateValue = useWatch({ control, name: "date" });
  const amountValue = useWatch({ control, name: "amount" });

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    try {
      const result = await updateTransactionAction(transaction.id, data);
      if (result.success) {
        toast.success("¡Gasto actualizado correctamente!");
        router.push("/dashboard/expenses");
      } else {
        toast.error(result.error || "Error al actualizar el gasto.");
      }
    } catch {
      toast.error("Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="w-full max-w-5xl bg-surface rounded-xl border border-border flex flex-col lg:flex-row transition-colors overflow-hidden ring-1 ring-border/50 shadow-sm">
        <div className="flex-1 p-6 sm:p-8 flex flex-col gap-6 border-r border-border">
          {/* Monto */}
          <div>
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
                defaultValue={transaction.amount}
                className="w-full bg-background border-0 rounded-2xl py-4 md:py-6 pl-10 md:pl-12 pr-6 text-3xl md:text-5xl font-bold text-text-main placeholder:text-text-dim focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
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
              rows={2}
              defaultValue={transaction.description ?? ""}
              className="w-full p-3 bg-background border border-border rounded-xl text-base text-text-main focus:border-primary focus:ring-1 focus:ring-primary resize-none placeholder:text-text-dim"
              placeholder="Añade una descripción..."
              onChange={(e) => setValue("description", e.target.value)}
            />
          </div>
        </div>

        <div className="w-full lg:w-[320px] bg-surface p-6 sm:p-8 flex flex-col gap-6 justify-between border-l border-border">
          <div className="flex flex-col gap-6">
            <TransactionOptions control={control} />

            {/* Gestión del Comprobante */}
            {currentAttachment ? (
              <div className="flex flex-col gap-3 p-4 bg-background border border-border rounded-xl">
                <label className="text-xs font-bold text-text-sub uppercase tracking-wider">
                  Comprobante Actual
                </label>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="material-symbols-outlined text-primary font-fill">receipt_long</span>
                    <span className="text-sm font-medium text-text-main truncate">
                      {currentAttachment.split("/").pop()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={handleViewCurrent}
                      className="p-1.5 text-text-sub hover:text-primary transition-colors hover:bg-primary/10 rounded-lg"
                      title="Ver actual"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteCurrent}
                      className="p-1.5 text-text-sub hover:text-red-500 transition-colors hover:bg-red-500/10 rounded-lg"
                      title="Borrar actual"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <ReceiptUpload onFileSelect={(file) => setValue("file", file)} />
            )}
          </div>

          <div className="flex flex-col gap-3 mt-auto pt-6">
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
                  Guardar cambios
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
      
      <ReceiptPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        fileUrl={previewUrl || ""}
        fileName={transaction.description || "Comprobante"}
      />

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar comprobante?"
        description="Esta acción eliminará el archivo del servidor de forma permanente. No se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        icon="delete_forever"
      />
    </form>
  );
}
