"use client";

import { Mail, Lock, User, Loader2 } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/FormField";
import { signUpSchema } from "@/features/auth/schemas";
import { signup } from "@/features/auth/actions";
import { useFormAction } from "@/hooks/useFormAction";

/**
 * Formulario de Registro.
 * Utiliza useFormAction para centralizar la validación y el envío de datos.
 */
export default function SignUpForm() {
  const { control, onSubmit, isLoading, reset } = useFormAction({
    schema: signUpSchema,
    action: signup,
    defaultValues: { name: "", email: "", password: "" },
    loadingMessage: "Creando cuenta...",
    successDuration: 6000,
    onSuccess: () => {
      // No redirigimos inmediatamente para que el usuario lea el mensaje del correo
      reset();
    },
  });

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-6 text-white">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <span className="material-symbols-outlined text-black font-bold">
              payments
            </span>
          </div>
          <span className="font-bold text-lg tracking-tight">
            Sistema de Gastos
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.02em] text-white">
          Empezar ahora
        </h1>
        <p className="text-gray-400 text-base font-normal">
          Crea tu cuenta gratis y toma el control de tu dinero.
        </p>
      </header>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <FormField
          name="name"
          control={control}
          label="Nombre completo"
          placeholder="Ej. Juan Pérez"
          type="text"
          autoComplete="name"
          maxLength={100}
          icon={<User className="w-5 h-5" />}
          disabled={isLoading}
        />

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
          autoComplete="new-password"
          maxLength={20}
          icon={<Lock className="w-5 h-5" />}
          disabled={isLoading}
          labelExtra={
            <div className="text-[10px] text-gray-500 font-medium">
              Usa letras, números y al menos un símbolo.
            </div>
          }
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full font-bold"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <span className="material-symbols-outlined mr-2">person_add</span>
          )}
          Crear cuenta
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-bold text-white hover:text-primary transition-colors inline-flex items-center gap-1 group"
          >
            Iniciar sesión
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
