"use client";

import React from "react";
import { Control, useController } from "react-hook-form";
import type { TransactionFormValues } from "../schema";

interface PaymentMethodSelectorProps {
  control: Control<TransactionFormValues>;
}

export function PaymentMethodSelector({ control }: PaymentMethodSelectorProps) {
  const { field } = useController({
    name: "payment_method",
    control,
  });

  const methods = [
    { id: "cash", label: "Efectivo", icon: "payments" },
    { id: "card", label: "Tarjeta", icon: "credit_card" },
    { id: "sinpe", label: "SINPE", icon: "phonelink_ring" },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-main">
        Método de pago
      </label>
      <div className="flex p-1 bg-background rounded-xl border border-border">
        {methods.map((method) => (
          <label
            key={method.id}
            className="flex-1 relative cursor-pointer group"
          >
            <input
              type="radio"
              name="payment_method"
              className="sr-only peer"
              value={method.id}
              checked={field.value === method.id}
              onChange={() => field.onChange(method.id)}
            />
            <div className="py-2.5 px-3 rounded-lg text-center text-sm font-medium text-text-sub peer-checked:bg-surface peer-checked:text-primary peer-checked:shadow-sm transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                {method.icon}
              </span>
              {method.label}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
