"use client";

import React from "react";
import { Skeleton } from "../ui/Skeleton";

/**
 * Esqueleto de carga para la sección de usuario del Sidebar.
 * Encapsula la estructura visual (avatar, nombre, correo) con animaciones.
 */
export function SidebarUserSkeleton({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3 px-2"} py-2 rounded-lg`}
    >
      <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />

      {!isCollapsed && (
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-3 w-32 rounded opacity-70" />
        </div>
      )}
    </div>
  );
}
