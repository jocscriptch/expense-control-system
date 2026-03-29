"use client";

import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormField from "@/components/ui/FormField";
import { recoverSchema } from "@/features/auth/schemas";
import { sendRecoveryEmail } from "@/features/auth/actions";
import { useFormAction } from "@/hooks/useFormAction";

/**
 * Formulario de Recuperación de Contraseña.
 * Envía un correo con el enlace de restablecimiento.
 */
export default function RecoverPasswordForm() {
  const { control, onSubmit, isLoading } = useFormAction({
    schema: recoverSchema,
    action: sendRecoveryEmail,
    defaultValues: { email: "" },
    loadingMessage: "Enviando correo...",
    successMessage: "Si el correo existe, recibirás un enlace para restablecer tu contraseña.",
  });

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <Link 
          href="/login"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al inicio de sesión
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.02em] text-white">
          Recuperar acceso
        </h1>
        <p className="text-gray-400 text-base font-normal">
          Ingresa tu correo y te enviaremos instrucciones para restablecer tu contraseña.
        </p>
      </header>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <FormField
          name="email"
          control={control}
          label="Correo electrónico"
          placeholder="ejemplo@correo.com"
          type="email"
          autoComplete="email"
          icon={<Mail className="w-5 h-5" />}
          disabled={isLoading}
        />

        <Button type="submit" disabled={isLoading} className="mt-2 w-full font-bold">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Enviar instrucciones
        </Button>
      </form>

      {/* Help info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-xs text-gray-400 leading-relaxed">
          <span className="text-white font-bold block mb-1">¿No recibes el correo?</span>
          Revisa tu carpeta de spam o correo no deseado. Si el problema persiste, contacta con soporte.
        </p>
      </div>
    </div>
  );
}
