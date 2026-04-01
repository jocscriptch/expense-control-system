"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  TransactionModalProvider,
  useTransactionModal,
} from "@/features/transactions/context/TransactionModalContext";
import { TransactionModal } from "@/features/transactions/components/TransactionModal";
import type { Category } from "@/features/transactions/types";

import { CommandMenuProvider } from "@/context/CommandMenuContext";
import { CommandMenu } from "@/components/dashboard/CommandMenu";
import { TourAutoStarter } from "@/features/onboarding/components/TourAutoStarter";
import { OnboardingCelebrator } from "@/features/onboarding/components/OnboardingCelebrator";

function DashboardInner({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: Category[];
}) {
  const { isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOpen, closeModal, editingTransaction } = useTransactionModal();

  if (isLoading) {
    return (
      <div className="bg-background h-screen w-screen flex flex-col items-center justify-center transition-colors duration-500">
        <div className="relative flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-surface p-6 rounded-full border border-border/50 shadow-2xl flex items-center justify-center w-24 h-24">
              <span className="material-symbols-outlined text-primary text-[44px] font-fill">
                savings
              </span>
            </div>
            <div className="absolute -inset-2 border border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-text-main font-black tracking-widest uppercase text-[10px] animate-pulse">
              Validando acceso
            </p>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground overflow-hidden h-[100dvh] flex transition-colors duration-200 relative">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {isMobileMenuOpen && (
        <div
          id="mobile-sidebar-overlay"
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="flex-1 overflow-y-auto p-3 pr-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </div>
      </main>

      <TransactionModal
        isOpen={isOpen}
        onClose={closeModal}
        categories={categories}
        editingTransaction={editingTransaction}
      />

      <CommandMenu />
      <TourAutoStarter />
      <OnboardingCelebrator />
    </div>
  );
}

export function DashboardLayoutClient({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: Category[];
}) {
  return (
    <TransactionModalProvider>
      <CommandMenuProvider>
        <DashboardInner categories={categories}>{children}</DashboardInner>
      </CommandMenuProvider>
    </TransactionModalProvider>
  );
}
