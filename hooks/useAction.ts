import { useState, useCallback } from "react";

export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Hook para manejar el ciclo de vida de una Server Action.
 * Gestiona automáticamente el estado de carga y proporciona una ejecución segura.
 */
export function useAction<T, R = any>(
  action: (data: T) => Promise<ActionResult<R>>,
  options?: {
    onSuccess?: (result: ActionResult<R>) => void;
    onError?: (error: string) => void;
  },
) {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (data: T) => {
      setIsLoading(true);
      try {
        const result = await action(data);
        if (result.success) {
          options?.onSuccess?.(result);
        } else {
          options?.onError?.(result.error || "Ocurrió un error inesperado");
        }
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error de red";
        options?.onError?.(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [action, options],
  );

  return { execute, isLoading };
}
