import { Control, Controller, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { SettingsFormData } from "../schema";

interface RegionalSectionProps {
  control: Control<SettingsFormData>;
}

export function RegionalSection({ control }: RegionalSectionProps) {
  return (
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
  );
}

interface AppearanceSectionProps {
  watch: UseFormWatch<SettingsFormData>;
  setValue: UseFormSetValue<SettingsFormData>;
}

export function AppearanceSection({ watch, setValue }: AppearanceSectionProps) {
  const selectedTheme = watch("theme");

  return (
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
  );
}
