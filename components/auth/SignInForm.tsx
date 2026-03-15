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

      {/* Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-white/10" />
        <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase tracking-wider font-medium">
          O continúa con
        </span>
        <div className="flex-grow border-t border-white/10" />
      </div>

      {/* OAuth Buttons */}
      <div className="flex flex-col gap-3">
        <Button variant="outline" type="button" disabled={isLoading} className="group">
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform"
            viewBox="0 0 24 24"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
      </div>

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
