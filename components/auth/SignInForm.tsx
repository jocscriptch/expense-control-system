"use client";

import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/FormField";
import { signInSchema } from "@/features/auth/schemas";
import { login } from "@/features/auth/actions";
import { useFormAction } from "@/hooks/useFormAction";

/**
 * Formulario de Inicio de Sesión.
 * Implementa un flujo limpio desacoplado de la lógica de negocio mediante useFormAction.
 */
export default function SignInForm() {
  const { control, onSubmit, isLoading } = useFormAction({
    schema: signInSchema,
    action: login,
    defaultValues: { email: "", password: "" },
    loadingMessage: "Autenticando...",
    onSuccess: () => {
      // Redirección manual tras éxito ya que el hook maneja el toast
      window.location.href = "/dashboard";
    },
  });

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-6 text-white">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <span className="material-symbols-outlined text-black font-bold">payments</span>
          </div>
          <span className="font-bold text-lg tracking-tight">
            Sistema de Gastos
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.02em] text-white">
          Bienvenida
        </h1>
        <p className="text-gray-400 text-base font-normal">
          Organiza tus gastos y entiende en qué se va tu dinero.
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
          maxLength={150}
          icon={<Mail className="w-5 h-5" />}
          disabled={isLoading}
        />

        <FormField
          name="password"
          control={control}
          label="Contraseña"
          placeholder="••••••••"
          type="password"
          autoComplete="current-password"
          maxLength={20}
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
          labelExtra={
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          }
        />

        <Button type="submit" disabled={isLoading} className="mt-2 w-full font-bold">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="material-symbols-outlined mr-2">login</span>
          )}
          Iniciar sesión
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-bold text-white hover:text-primary transition-colors inline-flex items-center gap-1 group"
          >
            Crear cuenta
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
