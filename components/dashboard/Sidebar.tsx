"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { SidebarUserSkeleton } from "./SidebarUserSkeleton";

const menuItems = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard", active: true },
  {
    icon: "add_circle",
    label: "Registrar gasto",
    href: "/dashboard/new-expense",
  },
  { icon: "list_alt", label: "Gastos", href: "/dashboard/expenses" },
  { icon: "category", label: "Categorías", href: "/dashboard/categories" },
  { icon: "receipt_long", label: "Comprobantes", href: "/dashboard/receipts" },
  { icon: "bar_chart", label: "Reportes", href: "/dashboard/reports" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, signOut, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

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
    setIsLogoutDialogOpen(false);
    onClose?.();
    await signOut();
    window.location.href = "/login";
  };

  if (!isMounted)
    return (
      <aside className="hidden lg:flex lg:w-64 bg-surface border-r border-border flex-col h-full flex-shrink-0 z-20"></aside>
    );

  return (
    <aside
      className={`fixed lg:relative inset-y-0 left-0 z-50 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${
        isCollapsed ? "lg:w-20" : "lg:w-64"
      } w-64 md:w-72 lg:w-auto transition-all duration-300 ease-in-out bg-surface border-r border-border flex flex-col h-full flex-shrink-0 shadow-2xl lg:shadow-none`}
    >
      <button
        onClick={toggleSidebar}
        className="hidden lg:flex absolute right-[-2px] translate-x-1/2 top-[64px] w-8 h-8 items-center justify-center bg-surface border border-border text-text-sub rounded-full hover:text-primary hover:border-primary shadow-sm z-30 transition-transform hover:scale-105"
      >
        <span className="material-symbols-outlined text-[18px] leading-none">
          {isCollapsed ? "chevron_right" : "chevron_left"}
        </span>
      </button>

      {/* Brand */}
      <div
        className={`py-8 flex items-center ${isCollapsed ? "justify-center px-0" : "px-6 gap-3"}`}
      >
        <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-primary flex items-center justify-center text-[#102216] shadow-sm">
          <span className="material-symbols-outlined text-white font-fill">
            account_balance_wallet
          </span>
        </div>

        <div
          className={`flex flex-col whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100 w-auto"}`}
        >
          <h1 className="text-text-main text-lg font-bold leading-none tracking-tight">
            ControlGastos
          </h1>
          <p className="text-text-sub text-[10px] font-bold mt-0.5 uppercase tracking-wider opacity-70">
            Intelligent Cash
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center ${isCollapsed ? "lg:justify-center px-3 lg:px-0" : "gap-3 px-3"} py-3 md:py-2.5 rounded-lg transition-all duration-300 group ${
                isActive
                  ? "bg-[#102216] text-white shadow-lg shadow-[#102216]/20"
                  : "text-text-sub hover:bg-surface-hover hover:text-text-main"
              }`}
            >
              <span
                className={`material-symbols-outlined ${isActive ? "font-fill text-primary" : "group-hover:text-text-main transition-colors"}`}
              >
                {item.icon}
              </span>
              <span
                className={`text-base lg:text-sm whitespace-nowrap overflow-hidden ${isActive ? "font-bold" : "font-medium"} transition-all duration-300 ${
                  isCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100 w-auto"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-border">
          <Link
            href="/dashboard/settings"
            onClick={() => onClose?.()}
            title={isCollapsed ? "Ajustes" : undefined}
            className={`flex items-center ${isCollapsed ? "lg:justify-center px-3 lg:px-0" : "gap-3 px-3"} py-3 md:py-2.5 rounded-lg transition-all duration-300 group ${
              pathname === "/dashboard/settings"
                ? "bg-[#102216] text-white shadow-lg shadow-[#102216]/20"
                : "text-text-sub hover:bg-surface-hover hover:text-text-main"
            }`}
          >
            <span
              className={`material-symbols-outlined transition-colors ${
                pathname === "/dashboard/settings"
                  ? "font-fill text-primary"
                  : "group-hover:text-text-main"
              }`}
            >
              settings
            </span>
            <span
              className={`text-base lg:text-sm whitespace-nowrap overflow-hidden ${
                pathname === "/dashboard/settings"
                  ? "font-semibold"
                  : "font-medium"
              } ${isCollapsed ? "lg:hidden block" : "block"}`}
            >
              Ajustes
            </span>
          </Link>
        </div>
      </nav>

      {/* User Info / Logout Button */}
      <div className="p-4 border-t border-border">
        {isLoading ? (
          <SidebarUserSkeleton isCollapsed={isCollapsed} />
        ) : (
          <div className="flex items-center gap-2 group/user relative">
            <Link
              href="/dashboard/settings"
              onClick={() => onClose?.()}
              className={`flex items-center ${isCollapsed ? "justify-center w-full" : "gap-3 px-2"} py-2 rounded-lg transition-colors hover:bg-surface-hover flex-1 overflow-hidden`}
              title={isCollapsed ? "Configuración" : undefined}
            >
              <div className="h-9 w-9 flex-shrink-0 rounded-full border border-border bg-background flex items-center justify-center text-text-main overflow-hidden shadow-sm group-hover/user:ring-2 group-hover/user:ring-primary/30 transition-all">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>

              <div
                className={`flex flex-col flex-1 overflow-hidden whitespace-nowrap text-left transition-all duration-300 ${isCollapsed ? "lg:opacity-0 lg:w-0" : "opacity-100 w-auto"}`}
              >
                <span className="text-sm font-bold text-text-main truncate group-hover/user:text-primary transition-colors">
                  {user?.name || "Usuario"}
                </span>
                <span className="text-[10px] text-text-sub truncate opacity-70">
                  {user?.email || "No identificado"}
                </span>
              </div>
            </Link>

            <button
              onClick={() => setIsLogoutDialogOpen(true)}
              className={`flex-shrink-0 material-symbols-outlined text-text-sub hover:text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all text-xl cursor-pointer ${isCollapsed ? "lg:hidden block" : "block"}`}
              title="Cerrar sesión"
            >
              logout
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="¿Cerrar sesión?"
        description="Estás a punto de salir de tu cuenta. ¿Estás seguro de que deseas continuar?"
        confirmText="Cerrar sesión"
        variant="danger"
      />
    </aside>
  );
}
