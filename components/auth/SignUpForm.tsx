"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

import Button from "@/components/ui/button";
import FormField from "@/components/ui/FormField";
import { signUpSchema, type SignUpFormValues } from "@/features/auth/schemas";
import { signup } from "@/features/auth/actions";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const response = await signup(data);

      if (response.success) {
        toast.success(
          `Hola ${data.name}. Te hemos enviado un correo de confirmación para verificar tu cuenta.`,
          { duration: 4000, icon: "👋" },
        );
        reset();
      } else {
        // Handle specific Supabase errors
        const error = response.error || "Error al registrar";
        if (error.includes("User already registered")) {
          toast.error("Este correo electrónico ya está registrado", {
            duration: 4000,
          });
        } else if (error.includes("Password should be at least 6 characters")) {
          toast.error("La contraseña debe tener al menos 6 caracteres", {
            duration: 4000,
          });
        } else if (error.includes("Invalid email")) {
          toast.error("Por favor ingresa un correo electrónico válido", {
            duration: 4000,
          });
        } else {
          toast.error(error, { duration: 4000 });
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error inesperado";
      toast.error(message, { duration: 4000 });
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
          Crear cuenta
        </h1>
        <p className="text-gray-400 text-base font-normal">
          Comienza a organizar tus gastos de manera inteligente.
        </p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          name="name"
          control={control}
          label="Nombre Completo"
          placeholder="Tu nombre completo"
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
        />

        <Button type="submit" disabled={isLoading} className="mt-2 w-full">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Crear cuenta
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="font-bold text-white hover:text-primary transition-colors"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
