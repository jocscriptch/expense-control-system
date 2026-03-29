import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useFormAction } from "@/hooks/useFormAction";
import { settingsSchema, type SettingsFormData } from "../schema";
import { updateProfile } from "../actions";
import {
  verifyCurrentPassword,
  updatePassword,
  logout,
} from "@/features/auth/actions";
import type { User } from "@/features/auth/types";

/**
 * Hook de orquestación para la configuración del usuario.
 * Centraliza la lógica compleja de actualización de perfil y seguridad.
 */
export function useSettings(user: User) {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuramos el formulario principal
  const form = useFormAction({
    schema: settingsSchema,
    action: async (data: SettingsFormData) => {
      // Esta función interna NO se usará directamente sino a través de onSubmit orquestado
      return { success: true };
    },
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      currency: user.currency || "CRC",
      language: user.language || "es",
      theme: (user.theme as any) || "system",
      monthly_budget: user.monthly_budget || 0,
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  /**
   * Orquestador personalizado de envío.
   * Maneja el flujo secuencial de verificación, actualización y re-login si es necesario.
   */
  const handleSettingsSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Guardando cambios...");

    try {
      let passwordChanged = false;

      // Lógica de Seguridad (Cambio de Contraseña)
      if (data.password && data.password.length > 0) {
        toast.loading("Verificando contraseña actual...", { id: toastId });

        const isCurrentValid = await verifyCurrentPassword(
          data.currentPassword || "",
        );
        if (!isCurrentValid) {
          toast.error("La contraseña actual es incorrecta", { id: toastId });
          setIsSubmitting(false);
          return;
        }

        toast.loading("Actualizando contraseña...", { id: toastId });
        const passResult = await updatePassword({ password: data.password });

        if (!passResult.success) {
          toast.error(passResult.error || "Error al cambiar contraseña", {
            id: toastId,
          });
          setIsSubmitting(false);
          return;
        }
        passwordChanged = true;
      }

      // Lógica de Perfil
      toast.loading("Guardando perfil...", { id: toastId });
      const result = await updateProfile(user.id, data);

      if (result.success) {
        if (passwordChanged) {
          toast.success("Seguridad actualizada. Cerrando sesión...", {
            id: toastId,
            duration: 4000,
          });
          setTimeout(async () => {
            await logout();
            router.push(
              "/login?message=Seguridad actualizada, inicia sesión de nuevo",
            );
          }, 2000);
        } else {
          await refreshUser();
          toast.success(result.message || "Cambios guardados", { id: toastId });
        }
      } else {
        toast.error(result.error || "Ocurrió un error", { id: toastId });
      }
    } catch (error) {
      toast.error("Error inesperado al guardar los cambios", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...form,
    onSubmit: form.handleSubmit(handleSettingsSubmit),
    isSubmitting: isSubmitting || form.isLoading,
  };
}
