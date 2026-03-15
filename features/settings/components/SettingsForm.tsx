"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { settingsSchema, type SettingsFormData } from "../schema";
import { updateProfile, updateAvatar } from "../actions";
import type { User } from "@/features/auth/types";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/button";
import FormField from "@/components/ui/FormField";

interface SettingsFormProps {
  user: User;
}

const CURRENCIES = [
  { code: "CRC", name: "CRC - Colón Costarricense" },
  { code: "USD", name: "USD - Dólar Estadounidense" },
  { code: "EUR", name: "EUR - Euro" },
  { code: "MXN", name: "MXN - Peso Mexicano" },
  { code: "COP", name: "COP - Peso Colombiano" },
];

export default function SettingsForm({ user }: SettingsFormProps) {
  const { refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      currency: user.currency || "CRC",
      language: user.language || "es",
      theme: (user.theme as "light" | "dark" | "system") || "system",
    },
  });

  const selectedTheme = watch("theme");

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Guardando cambios...");
    try {
      const result = await updateProfile(user.id, data);
      if (result.success) {
        await refreshUser();
        toast.success(result.message || "Cambios guardados", { id: toastId });
      } else {
        toast.error(result.error || "Ocurrió un error", { id: toastId });
      }
    } catch (error) {
      toast.error("Error inesperado al guardar los cambios", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen es demasiado grande. Máximo 2MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Subiendo imagen...");

    try {
      const result = await updateAvatar(user.id, file);
      if (result.success) {
        await refreshUser();
        toast.success(result.message || "Imagen actualizada", { id: toastId });
      } else {
        toast.error(result.error || "Error al subir", { id: toastId });
      }
    } catch (error) {
      toast.error("Error al subir la imagen", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 pb-10">
      {/* Sección: Perfil */}
      <section className="bg-surface rounded-xl border border-border p-4 md:p-8 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <span className="material-symbols-outlined text-primary text-2xl">person</span>
          <h3 className="text-xl font-bold text-text-main">Perfil Personal</h3>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
          {/* Avatar Upload */}
          <div className="md:col-span-3 flex flex-col items-center justify-center gap-4">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="size-28 md:size-32 rounded-full overflow-hidden border-4 border-border shadow-md bg-background flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                ) : user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  />
                ) : (
                  <span className="text-4xl font-bold text-text-sub">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">edit</span>
              </div>
            </div>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <button 
              type="button"
              className="text-sm font-bold text-primary hover:text-primary-hover transition-colors px-4 py-2 bg-primary/5 rounded-full md:bg-transparent md:p-0"
              onClick={() => fileInputRef.current?.click()}
            >
              Cambiar foto
            </button>
          </div>

          {/* Fields */}
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="name"
              control={control}
              label="Nombre completo"
              placeholder="Ej. Carlos Rodriguez"
              icon={<span className="material-symbols-outlined text-lg">edit</span>}
            />

            <FormField
              name="email"
              control={control}
              label="Correo electrónico"
              type="email"
              disabled
              icon={<span className="material-symbols-outlined text-lg">mail</span>}
              labelExtra={<span className="text-[10px] text-text-dim">(No editable)</span>}
            />

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-text-main block">
                Bio
              </label>
              <textarea
                className="w-full rounded-lg border border-border bg-background text-text-main px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px]"
                placeholder="Breve descripción sobre ti..."
                value={watch("bio") || ""}
                onChange={(e) => setValue("bio", e.target.value, { shouldDirty: true })}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sección: Región & Apariencia */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regional */}
        <div className="bg-surface rounded-xl border border-border p-6 md:p-8 shadow-sm flex flex-col h-full transition-colors duration-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <span className="material-symbols-outlined text-primary text-2xl">public</span>
            <h3 className="text-xl font-bold text-text-main">Región e Idioma</h3>
          </div>
          <div className="flex flex-col gap-6 flex-1">
            <div className="space-y-2 opacity-60">
              <label className="text-sm font-semibold text-text-main block">
                Moneda principal
              </label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full rounded-lg border border-border bg-surface-hover text-text-main px-4 py-3 text-sm outline-none"
                  value="CRC - Colón Costarricense"
                  disabled
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-text-dim">lock</span>
              </div>
              <p className="text-[10px] text-text-dim">La administración multi-moneda no está habilitada.</p>
            </div>

            <div className="space-y-2 opacity-60">
              <label className="text-sm font-semibold text-text-main block">
                Idioma
              </label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full rounded-lg border border-border bg-surface-hover text-text-main px-4 py-3 text-sm outline-none"
                  value="Español (Latinoamérica)"
                  disabled
                />
                <span className="material-symbols-outlined absolute right-3 top-3 text-text-dim">lock</span>
              </div>
              <p className="text-[10px] text-text-dim">El soporte multi idioma estará disponible pronto.</p>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="bg-surface rounded-xl border border-border p-6 md:p-8 shadow-sm flex flex-col h-full transition-colors duration-200">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <span className="material-symbols-outlined text-primary text-2xl">palette</span>
            <h3 className="text-xl font-bold text-text-main">Apariencia</h3>
          </div>
          <div className="flex flex-col gap-6 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-base font-semibold text-text-main">Tema del Sistema</span>
                <span className="text-sm text-text-sub">Personaliza cómo ves la aplicación.</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { id: "light", label: "Claro", icon: "light_mode" },
                { id: "dark", label: "Oscuro", icon: "dark_mode" },
                { id: "system", label: "Auto", icon: "settings_brightness" },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setValue("theme", theme.id as any, { shouldDirty: true });
                    document.dispatchEvent(new CustomEvent("theme-preview", { detail: theme.id }));
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    selectedTheme === theme.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50 bg-background text-text-sub"
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{theme.icon}</span>
                  <span className="text-xs font-bold">{theme.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <div className="sticky bottom-4 md:bottom-0 z-20 mt-4 md:mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 md:gap-4 rounded-xl border border-border bg-surface md:bg-surface/95 md:backdrop-blur-sm p-4 md:p-6 shadow-xl md:shadow-lg transition-colors duration-200">
        <button 
          type="button"
          className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-text-sub hover:text-text-main transition-colors"
          onClick={() => window.location.reload()}
        >
          Cancelar
        </button>
        <Button 
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-base font-bold text-black border-0 shadow-lg shadow-primary/20 bg-primary hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">save</span>
              Guardar cambios
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
