import React from "react";
import FormField from "@/components/ui/FormField";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { SettingsFormData } from "../schema";

interface ProfileSectionProps {
  control: Control<SettingsFormData>;
  watch: UseFormWatch<SettingsFormData>;
  setValue: UseFormSetValue<SettingsFormData>;
}

export function ProfileSection({ control, watch, setValue }: ProfileSectionProps) {
  return (
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
  );
}
