import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTransactionByIdAction, getCategories } from "@/features/transactions/actions";
import { EditTransactionForm } from "@/features/transactions/components/EditTransactionForm";

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = await params;

  const [txResult, catResult] = await Promise.all([
    getTransactionByIdAction(id),
    getCategories(),
  ]);

  if (!txResult.success || !txResult.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-4">
        <Link 
          href="/dashboard/expenses"
          className="flex items-center gap-2 text-text-sub hover:text-primary transition-colors text-sm font-medium w-fit group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Volver a la lista
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main">
            Editar Gasto
          </h2>
          <p className="text-text-sub mt-1">
            Modifica los datos de este gasto y guarda los cambios.
          </p>
        </div>
      </div>
      <EditTransactionForm
        transaction={txResult.data}
        categories={catResult.data}
      />
    </div>
  );
}
