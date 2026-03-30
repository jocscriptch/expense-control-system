"use client";

import React, { useRef, useEffect } from "react";
import Button from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { User } from "@/features/auth/types";
import { useSettings } from "../hooks/useSettings";
import { useAvatarUpload } from "../hooks/useAvatarUpload";
import { ProfileSection } from "./ProfileSection";
import { SecuritySection } from "./SecuritySection";
import { RegionalSection, AppearanceSection } from "./SettingsSections";

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    watch,
    setValue,
    onSubmit,
    isSubmitting,
    reset,
    formState: { isDirty },
  } = useSettings(user);
  const { isUploading, isImageLoading, setIsImageLoading, handleAvatarChange } =
    useAvatarUpload(user.id);

  useEffect(() => {
    reset({
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
    });
  }, [user, reset]);

  const isButtonDisabled = isSubmitting || !isDirty;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8 pb-10">
      {/* SECCIÓN: PERFIL PERSONAL */}
      <section className="bg-surface rounded-xl border border-border p-4 md:p-8 shadow-sm transition-colors duration-200">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
          <span className="material-symbols-outlined text-primary text-2xl">
            person
          </span>
          <h3 className="text-xl font-bold text-text-main">Perfil Personal</h3>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-12 gap-8">
          {/* Sub-UI: Avatar UI (se mantiene aquí por accesibilidad al ref) */}
          <div className="md:col-span-3 flex flex-col items-center justify-center gap-4">
            <div
              className="relative group cursor-pointer"
              onClick={() =>
                !isUploading && !isImageLoading && fileInputRef.current?.click()
              }
            >
              <div className="size-36 md:size-44 rounded-full overflow-hidden border-4 border-border shadow-md bg-background flex items-center justify-center relative">
                {(isUploading || isImageLoading) && (
                  <div className="absolute inset-0 z-10 bg-background flex items-center justify-center">
                    <Skeleton className="absolute inset-0 rounded-full" />
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary z-20"></div>
                  </div>
                )}

                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Foto de perfil"
                    onLoad={() => setIsImageLoading(false)}
                    className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                      isUploading || isImageLoading
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                  />
                ) : (
                  <span className="text-4xl font-bold text-text-sub">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white">
                  edit
                </span>
              </div>
            </div>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] && handleAvatarChange(e.target.files[0])
              }
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-bold text-primary hover:text-primary-hover px-4 py-2 bg-primary/5 rounded-full md:bg-transparent md:p-0"
            >
              Cambiar foto
            </button>
          </div>

          {/* Sub-Componente: Profile Fields */}
          <ProfileSection control={control} watch={watch} setValue={setValue} />
        </div>
      </section>

      {/* SECCIÓN: SEGURIDAD */}
      <SecuritySection control={control} />

      {/* SECCIONES: REGIÓN Y APARIENCIA */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RegionalSection control={control} />
        <AppearanceSection watch={watch} setValue={setValue} />
      </section>

      {/* FOOTER DE ACCIONES */}
      <div className="sticky bottom-4 md:bottom-0 z-20 mt-4 md:mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 md:gap-4 rounded-xl border border-border bg-surface md:bg-surface/95 md:backdrop-blur-sm p-4 md:p-6 shadow-xl md:shadow-lg transition-colors duration-200">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-text-sub hover:text-text-main"
        >
          Cancelar
        </button>
        <Button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-base font-bold transition-all duration-300 ${
            isButtonDisabled
              ? "bg-primary/20 text-[#0d1b12]/50 cursor-not-allowed border-0 shadow-none"
              : "bg-primary text-[#0d1b12] border-0 shadow-lg shadow-primary/20 hover:bg-primary-hover hover:scale-105"
          }`}
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
