import React from "react";

interface ResponsiveTableWrapperProps {
  desktopContent: React.ReactNode;
  mobileContent: React.ReactNode;
  footerContent?: React.ReactNode;
}

/**
 * Componente envoltorio genérico para listas de datos.
 * Maneja automáticamente la estructura responsiva:
 * - Renderiza una tabla horizontal con scroll en Escritorio.
 * - Renderiza una lista apilada de tarjetas en Móviles.
 * - Mantiene estilos unificados (bordes, fondos, sombras) en todo el sistema.
 */
export function ResponsiveTableWrapper({
  desktopContent,
  mobileContent,
  footerContent,
}: ResponsiveTableWrapperProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-colors duration-200">
      {/* ─── DESKTOP ─── */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar">
        {desktopContent}
      </div>

      {/* ─── MOBILE ─── */}
      <div className="md:hidden divide-y divide-border">{mobileContent}</div>

      {/* ─── FOOTER (Paginación, Totales, etc) ─── */}
      {footerContent && <div>{footerContent}</div>}
    </div>
  );
}
