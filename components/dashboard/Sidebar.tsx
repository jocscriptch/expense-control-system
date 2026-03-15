"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard", active: true },
  { icon: "add_circle", label: "Registrar gasto", href: "/dashboard/new-expense" },
  { icon: "list_alt", label: "Gastos", href: "/dashboard/expenses" },
  { icon: "receipt_long", label: "Comprobantes", href: "/dashboard/receipts" },
  { icon: "bar_chart", label: "Reportes", href: "/dashboard/reports" },
  { icon: "label", label: "Categorías", href: "/dashboard/categories" },
  { icon: "pie_chart", label: "Presupuestos", href: "/dashboard/budgets" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Prevents hydration mismatch

  // Load preference from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const storedPref = localStorage.getItem("sidebarCollapsed");
    if (storedPref !== null) {
      setIsCollapsed(storedPref === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  // Prevent hydration errors by not rendering width until mounted
  if (!isMounted)
    return (
      <aside className="w-64 bg-surface border-r border-border flex flex-col h-full flex-shrink-0 z-20"></aside>
    );

  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"} transition-all duration-300 ease-in-out bg-surface border-r border-border flex flex-col h-full flex-shrink-0 z-20 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute right-[-2px] translate-x-1/2 top-[64px] w-8 h-8 flex items-center justify-center bg-surface border border-border text-text-sub rounded-full hover:text-primary hover:border-primary shadow-sm z-30 transition-transform hover:scale-105"
      >
        <span className="material-symbols-outlined text-[18px] leading-none">
          {isCollapsed ? "chevron_right" : "chevron_left"}
        </span>
      </button>

      {/* Brand */}
      <div
        className={`py-6 flex items-center ${isCollapsed ? "justify-center px-0" : "px-6 gap-3"}`}
      >
        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-primary flex items-center justify-center text-[#102216] shadow-sm">
          <span className="material-symbols-outlined text-white font-fill">
            account_balance_wallet
          </span>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col whitespace-nowrap overflow-hidden">
            <h1 className="text-text-main text-lg font-bold leading-none tracking-tight">
              ControlGastos
            </h1>
            <p className="text-text-sub text-xs font-medium mt-1">
              Gestión Inteligente
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg transition-colors group ${
                isActive
                  ? "bg-primary/10 text-primary "
                  : "text-text-sub hover:bg-surface-hover hover:text-text-main"
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? "font-fill text-primary" : "group-hover:text-text-main transition-colors"}`}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span
                  className={`text-sm whitespace-nowrap overflow-hidden ${isActive ? "font-semibold" : "font-medium"}`}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-border">
          <Link
            href="/dashboard/settings"
            title={isCollapsed ? "Ajustes" : undefined}
            className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-3"} py-2.5 rounded-lg text-text-sub hover:bg-surface-hover hover:text-text-main transition-colors group`}
          >
            <span className="material-symbols-outlined group-hover:text-text-main transition-colors">
              settings
            </span>
            {!isCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
                Ajustes
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* User Info / Logout Button */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 group/user relative">
          <Link
            href="/dashboard/settings"
            className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3 px-2"} py-2 rounded-lg transition-colors hover:bg-surface-hover flex-1 overflow-hidden`}
            title={isCollapsed ? "Configuración" : undefined}
          >
            <div className="h-9 w-9 flex-shrink-0 rounded-full border border-border bg-background flex items-center justify-center text-text-main overflow-hidden shadow-sm group-hover/user:ring-2 group-hover/user:ring-primary/30 transition-all">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold">{user?.name?.charAt(0) || "U"}</span>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex flex-col flex-1 overflow-hidden whitespace-nowrap text-left">
                <span className="text-sm font-semibold text-text-main truncate group-hover/user:text-primary transition-colors">
                  {user?.name || "Usuario"}
                </span>
                <span className="text-[10px] text-text-sub truncate">{user?.email || "Cargando..."}</span>
              </div>
            )}
          </Link>

          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="material-symbols-outlined text-text-sub hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-all text-lg cursor-pointer"
              title="Cerrar sesión"
            >
              logout
            </button>
          )}
        </div>
      </div>

    </aside>
  );
}
