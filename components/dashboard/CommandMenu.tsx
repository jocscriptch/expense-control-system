"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Settings,
  Plus,
  Search,
  Moon,
  Sun,
  LogOut,
  Tags,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useAuth } from "@/context/AuthContext";
import { useCommandMenu } from "@/context/CommandMenuContext";
import { useTransactionModal } from "@/features/transactions/context/TransactionModalContext";
import { getTransactionsAction } from "@/features/transactions/actions";
import { logout } from "@/features/auth/actions";
import { TransactionWithCategory } from "@/features/transactions/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export function CommandMenu() {
  const { isOpen, setIsOpen, closeCommandMenu, toggleCommandMenu } =
    useCommandMenu() as any;
  const [transactions, setTransactions] = React.useState<
    TransactionWithCategory[]
  >([]);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const { updateTheme } = useAuth();
  const { openModal } = useTransactionModal();

  React.useEffect(() => {
    if (isOpen) {
      getTransactionsAction().then((res) => {
        if (res.success) {
          setTransactions(res.data.slice(0, 5));
        }
      });
    }
  }, [isOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      closeCommandMenu();
      command();
    },
    [closeCommandMenu],
  );

  const handleLogoutConfirm = async () => {
    setIsLogoutDialogOpen(false);
    await logout();
    window.location.href = "/login";
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Command.Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
            label="Buscador inteligente"
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setIsOpen(false)}
          >
            <VisuallyHidden.Root>
              <Dialog.Title>Buscador inteligente y comandos</Dialog.Title>
              <Dialog.Description>
                Buscador global para navegar, realizar acciones rápidas y buscar
                transacciones.
              </Dialog.Description>
            </VisuallyHidden.Root>

            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-[640px] overflow-hidden rounded-[32px] border border-black/5 dark:border-white/10 bg-white/95 dark:bg-surface/80 backdrop-blur-3xl shadow-[0_48px_96px_-24px_rgba(0,0,0,0.3)] dark:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.6)] ring-1 ring-black/[0.03] dark:ring-white/[0.03]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center border-b border-border/50 px-5 py-4 gap-3 group">
                <Search className="h-5 w-5 text-text-dim group-focus-within:text-primary transition-colors" />
                <div className="flex-1 flex items-center relative">
                  <Command.Input
                    autoFocus
                    placeholder="¿Qué necesitas hoy?..."
                    className="w-full bg-transparent text-text-main placeholder:text-text-dim outline-none border-none focus:ring-0 text-lg"
                  />
                </div>
                <kbd className="hidden sm:flex h-6 items-center gap-1 rounded-md border border-border bg-background/50 px-2 font-mono text-[10px] font-bold text-text-dim select-none shadow-sm">
                  <span className="text-[11px]">ESC</span>
                </kbd>
              </div>

              <Command.List className="max-h-[450px] overflow-y-auto p-2 scroll-smooth">
                <Command.Empty className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-text-dim opacity-50">
                      search_off
                    </span>
                    <p className="text-text-sub font-medium">
                      No se encontraron resultados.
                    </p>
                  </div>
                </Command.Empty>

                <Command.Group
                  heading="Navegación"
                  className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-text-dim/60"
                >
                  <Item
                    onSelect={() => runCommand(() => router.push("/dashboard"))}
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </Item>
                  <Item
                    onSelect={() =>
                      runCommand(() => router.push("/dashboard/expenses"))
                    }
                  >
                    <ReceiptText className="mr-3 h-4 w-4" />
                    <span>Lista de Gastos</span>
                  </Item>
                  <Item
                    onSelect={() =>
                      runCommand(() => router.push("/dashboard/reports"))
                    }
                  >
                    <PieChart className="mr-3 h-4 w-4" />
                    <span>Reportes y Análisis</span>
                  </Item>
                  <Item
                    onSelect={() =>
                      runCommand(() => router.push("/dashboard/categories"))
                    }
                  >
                    <Tags className="mr-3 h-4 w-4" />
                    <span>Gestión de Categorías</span>
                  </Item>
                  <Item
                    onSelect={() =>
                      runCommand(() => router.push("/dashboard/settings"))
                    }
                  >
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Ajustes</span>
                  </Item>
                </Command.Group>

                <Command.Separator className="my-2 h-px bg-border/50" />

                <Command.Group
                  heading="Acciones Pro"
                  className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-text-dim/60"
                >
                  <Item
                    onSelect={() => runCommand(() => openModal())}
                    className="text-primary font-bold"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 mr-3">
                      <Plus className="h-4 w-4" />
                    </div>
                    <span>Registrar Nuevo Gasto</span>
                  </Item>
                  <Item
                    onSelect={() => {
                      updateTheme(resolvedTheme === "dark" ? "light" : "dark");
                      closeCommandMenu();
                    }}
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="mr-3 h-4 w-4" />
                    ) : (
                      <Moon className="mr-3 h-4 w-4" />
                    )}
                    <span>
                      Cambiar a Modo{" "}
                      {resolvedTheme === "dark" ? "Claro" : "Oscuro"}
                    </span>
                  </Item>
                  <Item
                    onSelect={() => {
                      closeCommandMenu();
                      setIsLogoutDialogOpen(true);
                    }}
                    className="text-red-400"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </Item>
                </Command.Group>

                {transactions.length > 0 && (
                  <>
                    <Command.Separator className="my-2 h-px bg-border/50" />
                    <Command.Group
                      heading="Gastos Recientes"
                      className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-text-dim/60"
                    >
                      {transactions.map((t) => (
                        <Item
                          key={t.id}
                          onSelect={() =>
                            runCommand(() =>
                              router.push(`/dashboard/expenses?id=${t.id}`),
                            )
                          }
                        >
                          <div
                            className="mr-3 flex h-7 w-7 items-center justify-center rounded-full text-white text-[14px]"
                            style={{
                              backgroundColor: t.category?.color || "#13ec5b",
                            }}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {t.category?.icon || "payments"}
                            </span>
                          </div>
                          <div className="flex flex-1 flex-col truncate">
                            <span className="truncate font-medium">
                              {t.description ||
                                t.category?.name ||
                                "Sin descripción"}
                            </span>
                            <span className="text-[10px] text-text-dim">
                              {format(new Date(t.date), "PPP", { locale: es })}
                            </span>
                          </div>
                          <span className="ml-2 font-bold text-sm">
                            $
                            {Number(t.amount).toLocaleString("es-ES", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </Item>
                      ))}
                    </Command.Group>
                  </>
                )}
              </Command.List>

              <div className="hidden sm:flex items-center justify-between border-t border-border/40 bg-background/20 px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-text-dim/60">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-surface px-1.5 py-0.5 rounded border border-border/50">
                      ↑↓
                    </kbd>{" "}
                    Navegar
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-surface px-1.5 py-0.5 rounded border border-border/50">
                      ENTER
                    </kbd>{" "}
                    Seleccionar
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="bg-surface px-1.5 py-0.5 rounded border border-border/50">
                    ESC
                  </kbd>{" "}
                  para cerrar
                </div>
              </div>
            </motion.div>
          </Command.Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="¿Cerrar sesión?"
        description="Estás a punto de salir de tu cuenta. ¿Estás seguro de que deseas continuar?"
        confirmText="Cerrar sesión"
        variant="danger"
      />
    </>
  );
}

function Item({
  children,
  onSelect,
  className,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  className?: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      onClick={onSelect}
      className={`
        flex items-center rounded-xl px-4 py-3 text-sm transition-all cursor-pointer outline-none
        data-[selected=true]:bg-primary data-[selected=true]:text-[#102216]
        data-[selected=true]:shadow-lg data-[selected=true]:shadow-primary/20
        data-[selected=true]:translate-x-1 active:scale-[0.98]
        ${className}
      `}
    >
      {children}
    </Command.Item>
  );
}
