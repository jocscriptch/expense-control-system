import React from "react";
import { getCategories } from "@/features/transactions/actions";
import { TransactionForm } from "@/features/transactions/components/TransactionForm";

/**
 * Página de Registro de Gasto.
 * Server Component que carga los datos iniciales necesarios.
 */
export default async function RegistrarGastoPage() {
  // Carga de categorías directamente en el servidor
  const categoriesResponse = await getCategories();
  
  // Si no hay categorías, pasamos un array vacío (por robustez)
  const initialCategories = categoriesResponse.success ? categoriesResponse.data : [];

  return (
    <div className="flex flex-col gap-6">
      <TransactionForm categories={initialCategories} />
    </div>
  );
}
