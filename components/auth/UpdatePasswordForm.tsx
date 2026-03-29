"use client";

import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/FormField";
import { updatePasswordSchema } from "@/features/auth/schemas";
import { updatePassword } from "@/features/auth/actions";
import { useFormAction } from "@/hooks/useFormAction";

/**
 * Formulario para establecer una nueva contraseña.
 * Usado en el flujo de "Olvidé mi contraseña" o cambio forzado.
 */
export default function UpdatePasswordForm() {
  const router = useRouter();
  const { control, onSubmit, isLoading } = useFormAction({
    schema: updatePasswordSchema,
    action: updatePassword,
    defaultValues: { password: "", confirmPassword: "" },
    loadingMessage: "Actualizando contraseña...",
    successMessage: "Contraseña actualizada. Ya puedes iniciar sesión.",
    onSuccess: () => {
      // Redirigir al login tras éxito
      setTimeout(() => router.push("/login"), 2000);
    },
  });

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.02em] text-white">
          Nueva contraseña
        </h1>
        <p className="text-gray-400 text-base font-normal">
          Elige una contraseña segura que no hayas usado antes.
        </p>
      </header>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <FormField
          name="password"
          control={control}
          label="Nueva contraseña"
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
          maxLength={20}
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
        />

        <FormField
          name="confirmPassword"
          control={control}
          label="Confirmar contraseña"
          placeholder="••••••••"
          type="password"
          autoComplete="new-password"
          maxLength={20}
          icon={<CheckCircle2 className="w-5 h-5" />}
          disabled={isLoading}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full font-bold"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="material-symbols-outlined mr-2">lock_reset</span>
          )}
          Actualizar contraseña
        </Button>
      </form>

      {/* Footer / Back */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-white hover:text-primary transition-colors inline-flex items-center gap-2 group"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Volver a iniciar sesión
        </Link>
      </div>

      {/* Security Tip */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <p className="text-xs text-text-sub leading-relaxed">
          <span className="text-primary font-bold block mb-1">
            Consejo de seguridad:
          </span>
          Asegúrate de que tu contraseña sea difícil de adivinar y no la
          compartas con nadie.
        </p>
      </div>
    </div>
  );
}
