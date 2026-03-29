"use client";

import React from "react";
import { Control, useController } from "react-hook-form";
import type { TransactionFormValues } from "../schema";

interface TransactionOptionsProps {
  control: Control<TransactionFormValues>;
}

/**
 * Agrupación de opciones adicionales (toggles).
 * Gestiona Gasto del Hogar, Compartido y Recurrente.
 */
export function TransactionOptions({ control }: TransactionOptionsProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-text-main">
        Opciones adicionales
      </h2>

      <div className="space-y-4">
        {/* Toggle: Gasto del hogar */}
        <ToggleItem
          control={control}
          name="is_household"
          label="Gasto del hogar"
          icon="home"
        />

        {/* Toggle: Compartido */}
        <ToggleItem
          control={control}
          name="is_shared"
          label="Compartido"
          icon="group"
        />

        {/* Toggle: Recurrente */}
        <ToggleItem
          control={control}
          name="is_recurring"
          label="Recurrente"
          icon="update"
        />
      </div>
    </div>
  );
}

interface ToggleItemProps {
  control: Control<TransactionFormValues>;
  name: keyof TransactionFormValues;
  label: string;
  icon: string;
}

/**
 * Componente interno reutilizable para cada Toggle con el estilo del diseño.
 */
function ToggleItem({ control, name, label, icon }: ToggleItemProps) {
  const { field } = useController({
    name: name as any,
    control,
  });

  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-text-sub group-hover:text-primary transition-colors shadow-sm">
          <span className="material-symbols-outlined text-lg">{icon}</span>
        </div>
        <span className="text-sm font-medium text-text-main">{label}</span>
      </div>
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={!!field.value}
          onChange={(e) => field.onChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </div>
    </label>
  );
}
