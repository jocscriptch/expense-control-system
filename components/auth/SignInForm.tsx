"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

import Button from "@/components/ui/button";
import FormField from "@/components/ui/FormField";
import { signInSchema, type SignInFormValues } from "@/features/auth/schemas";
import { login } from "@/features/auth/actions";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      const res = await login(data);
      if (res.success) {
        window.location.href = "/dashboard";
      } else {
        toast.error(res.error || "Error al iniciar sesión", { duration: 3000 });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error inesperado";
      toast.error(message, { duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
              />
            </svg>
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

        <Button type="submit" disabled={isLoading} className="mt-2 w-full">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
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
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </p>
      </div>
    </div>
  );
}
