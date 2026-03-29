import React from "react";

export const formatCurrencyParts = (val: number) => {
  const absVal = Math.abs(val);
  // Forzamos el formato: espacios para miles, coma para decimales (ej: 350 000,00)
  const formatted = absVal.toLocaleString("es-CR", { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  // Reemplazamos puntos por espacios
  const parts = formatted.replace(/\./g, " ").split(",");
  
  return {
    symbol: "₡",
    integer: val < 0 ? `-${parts[0]}` : parts[0],
    decimal: parts[1] || "00"
  };
};

export const formatInputAmount = (val: number | string | null | undefined): string => {
  if (!val) return "";
  return Number(val).toLocaleString("es-CR", { minimumFractionDigits: 0 }).replace(/\./g, " ");
};

export const parseInputAmount = (val: string): string => {
  return val.replace(/\D/g, "");
};

interface AmountDisplayProps {
  value: number;
  className?: string;
  symbolClassName?: string;
  gap?: string; // Para permitir control de gap (por ej, gap-[2px] en tablas)
}

export function AmountDisplay({ 
  value, 
  className = "", 
  symbolClassName = "text-primary/60",
  gap = "gap-1"
}: AmountDisplayProps) {
  const { symbol, integer, decimal } = formatCurrencyParts(value);
  
  return (
    <div className={`flex items-baseline ${gap} ${className}`}>
      <span className={`text-[0.6em] font-black self-start mt-1 ${symbolClassName}`}>
        {symbol}
      </span>
      <span className="leading-none">{integer}</span>
      <span className="text-[0.5em] font-bold opacity-40">,{decimal}</span>
    </div>
  );
}
