import { useForm, UseFormProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAction, ActionResult } from "./useAction";

/**
 * Opciones para el hook useFormAction.
 * T es el esquema de Zod.
 * R es el tipo de retorno de la acción de servidor.
 * V es la forma de los valores del formulario (inferida de T).
 */
interface UseFormActionOptions<
  T extends z.ZodType<any, any>,
  R = any,
> extends UseFormProps<z.infer<T>> {
  schema: T;
  action: (data: z.output<T>) => Promise<ActionResult<R>>;
  onSuccess?: (result: ActionResult<R>) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  successDuration?: number;
  loadingMessage?: string;
}

/**
 * Hook de alto nivel para formularios.
 * Combina react-hook-form, zod y useAction para manejar todo el ciclo de vida del formulario
 */
export function useFormAction<T extends z.ZodType<any, any>, R = any>({
  schema,
  action,
  onSuccess,
  onError,
  successMessage,
  successDuration,
  loadingMessage = "Guardando...",
  ...formProps
}: UseFormActionOptions<T, R>) {
  type FormData = z.infer<T>;

  // Inicializar React Hook Form
  const form = useForm<FormData>({
    ...(formProps as any),
    resolver: zodResolver(schema) as any,
  });

  // Inicializar useAction
  const { execute, isLoading } = useAction(action, {
    onSuccess: (result) => {
      const toastOptions = successDuration ? { duration: successDuration } : undefined;
      
      if (successMessage) {
        toast.success(successMessage, toastOptions);
      } else if (result.message) {
        toast.success(result.message, toastOptions);
      }
      onSuccess?.(result);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Orquestador de envío
  const handleFormSubmit = async (data: any) => {
    let toastId;
    if (loadingMessage) {
      toastId = toast.loading(loadingMessage);
    }

    try {
      const result = await execute(data);
      if (toastId) toast.dismiss(toastId);
      return result;
    } catch (err) {
      if (toastId) toast.dismiss(toastId);
      throw err;
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleFormSubmit),
    isLoading,
  } as any;
}
