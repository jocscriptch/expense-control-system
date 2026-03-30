import React from "react";
import FormField from "@/components/ui/FormField";
import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { SettingsFormData } from "../schema";
import { formatInputAmount, parseInputAmount } from "@/components/ui/AmountDisplay";

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

      {/* SECCIÓN: Presupuesto Global - Rediseñado para consistencia de espaciado */}
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
          <h3 className="text-base font-bold text-text-main">Meta de Gasto Mensual</h3>
        </div>
        
        <p className="text-xs text-text-sub">
          Define cuánto planeas gastar en total este mes. La barra del Dashboard se ajustará a este monto.
        </p>

        <div className="relative flex items-center group max-w-[280px]">
          <span className="absolute left-3 text-primary font-black text-base select-none group-focus-within:scale-110 transition-transform">₡</span>
          <Controller
            name="monthly_budget"
            control={control}
            render={({ field: { onChange, value, ...field } }) => {
              // Lógica de formateo dinámico centralizada
              const displayValue = formatInputAmount(value);
              
              return (
                <input 
                  {...field}
                  type="text"
                  value={displayValue}
                  onChange={(e) => {
                    const val = parseInputAmount(e.target.value);
                    onChange(val ? Number(val) : 0);
                  }}
                  className="w-full rounded-xl border border-border bg-background text-text-main pl-8 pr-4 py-2.5 text-base font-bold outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all shadow-sm group-hover:border-primary/30"
                  placeholder="0.00"
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
