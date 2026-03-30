import { useRouter } from "next/navigation";
import { transactionSchema, TransactionFormValues } from "../schema";
import { createTransaction } from "../actions";
import { useFormAction } from "@/hooks/useFormAction";

interface UseTransactionFormOptions {
  onSuccess?: () => void;
}

/**
 * Hook para manejar la lógica del formulario de registro de gasto.
 * Integra validación Zod, estados de envío y notificaciones.
 */
export function useTransactionForm({ onSuccess }: UseTransactionFormOptions = {}) {
  const router = useRouter();

  const { control, onSubmit, isLoading, watch, setValue, reset } = useFormAction({
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
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback para la página standalone
        router.push("/dashboard/expenses");
      }
    },
  });

  return {
    control,
    onSubmit,
    isLoading,
    watch,
    setValue,
    reset,
  };
}

