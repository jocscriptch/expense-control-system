"use client";

import React from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

interface OnboardingHighlightProps {
  id?: string;
  children: React.ReactNode;
  show: boolean;
  badgeText?: string;
  className?: string;
  badgePosition?: "top" | "bottom";
}

/**
 * Componente envoltorio que aplica un resaltado nativo (anillo pulsante + badge)
 * cuando se marca como 'show'. Solo visible en dispositivos móviles.
 *
 * Garantiza la consistencia del diseño premium de onboarding en toda la app.
 */
export function OnboardingHighlight({
  id,
  children,
  show,
  badgeText = "Configuración Inicial",
  className = "",
  badgePosition = "bottom",
}: OnboardingHighlightProps) {
  const isMobile = useIsMobile();

  const shouldDisplay = show && isMobile;

  return (
    <div
      id={id}
      className={`relative flex items-center transition-all duration-500 ${className} ${
        shouldDisplay
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background animate-pulse shadow-lg shadow-primary/20 rounded-xl"
          : ""
      }`}
    >
      {shouldDisplay && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-white font-black text-[10px] uppercase tracking-wider animate-bounce bg-primary px-3 py-1.5 rounded-full border border-primary/50 shadow-lg shadow-primary/30 z-[60] whitespace-nowrap ${
            badgePosition === "top" ? "-top-10" : "-bottom-8"
          }`}
        >
          <span className="material-symbols-outlined text-[14px] animate-pulse">
            {badgePosition === "top" ? "arrow_downward" : "arrow_upward"}
          </span>
          {badgeText}
        </div>
      )}

      {children}
    </div>
  );
}
