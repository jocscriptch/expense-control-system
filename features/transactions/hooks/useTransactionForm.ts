import { useRouter } from "next/navigation";
import { transactionSchema, TransactionFormValues } from "../schema";
import { createTransaction } from "../actions";
import { useFormAction } from "@/hooks/useFormAction";

/**
 * Hook para manejar la lógica del formulario de registro de gasto.
 * Integra validación Zod, estados de envío y notificaciones.
 */
export function useTransactionForm() {
  const router = useRouter();

  // Inicialización del formulario usando useFormAction estándar
  const { control, onSubmit, isLoading, watch, setValue } = useFormAction({
    schema: transactionSchema,
    action: createTransaction,
    defaultValues: {
      amount: 0,
      category_id: "",
      date: new Date().toISOString().split("T")[0],
      payment_method: "cash",
      description: "",
      is_recurring: false,
      is_household: false,
      is_shared: false,
    },
    loadingMessage: "Registrando tu gasto...",
    onSuccess: () => {
      // Retornar al dashboard tras un guardado exitoso
      router.push("/dashboard");
    },
  });

  return {
    control,
    onSubmit,
    isLoading,
    watch,
    setValue,
  };
}
