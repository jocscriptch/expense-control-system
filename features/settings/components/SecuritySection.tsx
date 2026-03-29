import React from "react";
import FormField from "@/components/ui/FormField";
import { Control } from "react-hook-form";
import { SettingsFormData } from "../schema";

interface SecuritySectionProps {
  control: Control<SettingsFormData>;
}

export function SecuritySection({ control }: SecuritySectionProps) {
  return (
    <section className="bg-surface rounded-xl border border-border p-4 md:p-8 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <span className="material-symbols-outlined text-primary text-2xl">lock</span>
        <h3 className="text-xl font-bold text-text-main">Seguridad</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <FormField
            name="currentPassword"
            control={control}
            label="Contraseña actual"
            type="password"
            placeholder="••••••••"
            icon={<span className="material-symbols-outlined text-lg">lock_person</span>}
          />
        </div>

        <div>
          <FormField
            name="password"
            control={control}
            label="Nueva contraseña"
            type="password"
            placeholder="••••••••"
            icon={<span className="material-symbols-outlined text-lg">password</span>}
          />
        </div>

        <div>
          <FormField
            name="confirmPassword"
            control={control}
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            icon={<span className="material-symbols-outlined text-lg">verified_user</span>}
          />
        </div>
        
        <div className="md:col-span-2 px-4 py-3 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-xs text-text-sub flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">info</span>
            Si cambias tu contraseña, se cerrará tu sesión actual por seguridad.
          </p>
        </div>
      </div>
    </section>
  );
}
