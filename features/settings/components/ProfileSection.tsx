import React from "react";
import FormField from "@/components/ui/FormField";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { SettingsFormData } from "../schema";
import {
  formatInputAmount,
  parseInputAmount,
} from "@/components/ui/AmountDisplay";
import { useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ProfileSectionProps {
  control: Control<SettingsFormData>;
  watch: UseFormWatch<SettingsFormData>;
  setValue: UseFormSetValue<SettingsFormData>;
}

export function ProfileSection({
  control,
  watch,
  setValue,
}: ProfileSectionProps) {
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "true";
  const [isInputFocused, setIsInputFocused] = React.useState(false);
  const isMobile = useIsMobile();

  const budgetValue = watch("monthly_budget");

  const showOnboardingHighlight =
    isOnboarding &&
    isMobile &&
    !isInputFocused &&
    (!budgetValue || budgetValue === 0);

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
        labelExtra={
          <span className="text-[10px] text-text-dim">(No editable)</span>
        }
      />

      {/* Meta de Gasto Mensual con Resaltado Inteligente Integrado */}
      <div className="md:col-span-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">
            account_balance_wallet
          </span>
          <h3 className="text-sm font-bold text-text-main">
            Meta de Gasto Mensual
          </h3>
        </div>

        <p className="text-[11px] text-text-sub leading-relaxed">
          Define tu límite mensual. La barra del Dashboard se ajustará a este
          monto.
        </p>

        <div
          id="settings-monthly-budget"
          className={`relative flex items-center group w-full transition-all duration-500 rounded-xl ${
            showOnboardingHighlight
              ? "ring-4 ring-primary ring-offset-4 ring-offset-background animate-pulse shadow-2xl shadow-primary/40 p-[2px]"
              : "p-0"
          }`}
        >
          <span className="absolute left-3 text-primary font-black text-base select-none group-focus-within:scale-110 transition-transform z-10">
            ₡
          </span>
          <Controller
            name="monthly_budget"
            control={control}
            render={({ field: { onChange, value, ...field } }) => {
              const displayValue = formatInputAmount(value);
              return (
                <input
                  {...field}
                  type="text"
                  value={displayValue}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onChange={(e) => {
                    const val = parseInputAmount(e.target.value);
                    onChange(val ? Number(val) : 0);
                  }}
                  className={`w-full rounded-xl border bg-background text-text-main pl-8 pr-4 py-2.5 text-base font-bold outline-none transition-all shadow-sm ${
                    showOnboardingHighlight
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                  } group-hover:border-primary/30`}
                  placeholder="0.00"
                />
              );
            }}
          />

          {/* Badge flotante sincronizado (solo si se muestra el resaltado) */}
          {showOnboardingHighlight && (
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center pointer-events-none">
              <span className="bg-primary text-[#0d1b12] text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap animate-bounce">
                Configuración Inicial
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-1 space-y-2">
        <label className="text-sm font-medium text-text-main block">Bio</label>
        <textarea
          className="w-full rounded-lg border border-border bg-background text-text-main px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[90px] resize-none"
          placeholder="Breve descripción sobre ti..."
          value={watch("bio") || ""}
          onChange={(e) =>
            setValue("bio", e.target.value, { shouldDirty: true })
          }
        />
      </div>
    </div>
  );
}
