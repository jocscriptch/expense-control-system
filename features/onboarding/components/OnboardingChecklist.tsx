"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "driver.js/dist/driver.css";
import { useOnboardingStatus } from "../hooks/useOnboardingStatus";
import {
  dismissOnboardingAction,
  type OnboardingStatus,
} from "../actions/onboardingActions";
import {
  budgetTourSteps,
  categoryTourSteps,
  transactionTourSteps,
} from "../lib/tours";
import { useTransactionModal } from "@/features/transactions/context/TransactionModalContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import { startNavigationTour, startModalTour } from "../lib/tourUtils";

interface Step {
  id: string;
  label: string;
  description: string;
  icon: string;
  done: boolean;
  action: () => void;
}

interface OnboardingChecklistProps {
  initialStatus: OnboardingStatus | null;
}

/**
 * Componente principal de la Checklist de Bienvenida.
 * Refactorizado para mayor legibilidad y mantenibilidad.
 */
export function OnboardingChecklist({
  initialStatus,
}: OnboardingChecklistProps) {
  const { status, refresh } = useOnboardingStatus(initialStatus);
  const [isDismissing, setIsDismissing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useIsMobile();
  const router = useRouter();
  const { openModal } = useTransactionModal();

  if (!status || status.isDismissed || status.isComplete) return null;

  const completedCount = [
    status.hasBudget,
    status.hasCategories,
    status.hasTransactions,
  ].filter(Boolean).length;
  const totalSteps = 3;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const steps: Step[] = [
    {
      id: "budget",
      label: "Define tu meta mensual",
      description: "Establece cuánto quieres gastar como máximo cada mes.",
      icon: "track_changes",
      done: status.hasBudget,
      action: () => startNavigationTour(budgetTourSteps, router, "/dashboard/settings", "budget", "Ver Ajustes"),
    },
    {
      id: "categories",
      label: "Crea tus categorías",
      description: "Organiza tus gastos por tipo: Alimentación, Transporte, etc.",
      icon: "label",
      done: status.hasCategories,
      action: () => startNavigationTour(categoryTourSteps, router, "/dashboard/categories", "categories", "Ver Categorías"),
    },
    {
      id: "transaction",
      label: "Registra tu primer gasto",
      description: "Agrega un gasto para ver tus gráficos y reportes en acción.",
      icon: "receipt_long",
      done: status.hasTransactions,
      action: () => startModalTour(transactionTourSteps, openModal, "¡Empecemos!"),
    },
  ];

  const handleDismiss = async () => {
    setIsDismissing(true);
    await dismissOnboardingAction();
    await refresh();
  };

  const nextStepIndex = steps.findIndex((s) => !s.done);

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {/* Banner Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-[20px] text-primary">rocket_launch</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-text-main">Configura tu cuenta</h3>
              <p className="text-[10px] font-bold text-text-dim uppercase tracking-widest">
                {completedCount} de {totalSteps} pasos completados
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 bg-background rounded-full overflow-hidden border border-border/50">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-primary">{progressPercent}%</span>
            </div>

            <button
              onClick={() => setIsExpanded((p) => !p)}
              className="p-1.5 text-text-dim hover:text-text-main transition-colors rounded-lg hover:bg-background/60"
            >
              <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${isExpanded ? "rotate-0" : "rotate-180"}`}>
                expand_less
              </span>
            </button>

            <button
              onClick={handleDismiss}
              disabled={isDismissing}
              className="p-1.5 text-text-dim hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Steps List */}
        {isExpanded && (
          <div className="divide-y divide-border/30">
            {steps.map((step, index) => (
              <OnboardingStepItem 
                key={step.id} 
                step={step} 
                isNext={index === nextStepIndex}
                isMobile={isMobile}
                onAction={() => {
                  if (isMobile) {
                    if (step.id === "transaction") openModal();
                    else router.push(`${step.id === "budget" ? "/dashboard/settings" : "/dashboard/categories"}?onboarding=true`);
                  } else {
                    step.action();
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sub-componente para cada elemento de la lista.
 * Mejora la separación de responsabilidades y la legibilidad.
 */
function OnboardingStepItem({ 
  step, 
  isNext, 
  isMobile, 
  onAction 
}: { 
  step: Step; 
  isNext: boolean; 
  isMobile: boolean;
  onAction: () => void;
}) {
  return (
    <div className={`flex items-center gap-4 px-4 md:px-5 py-3.5 transition-colors ${
      step.done ? "opacity-60" : isNext ? "bg-primary/[0.03]" : "opacity-50"
    }`}>
      {/* Icono de Estado */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
        step.done ? "bg-primary border-primary" : isNext ? "bg-primary/10 border-primary/40" : "bg-background border-border"
      }`}>
        {step.done ? (
          <span className="material-symbols-outlined text-[16px] text-[#0d1b12] font-black">check</span>
        ) : (
          <span className={`material-symbols-outlined text-[16px] ${isNext ? "text-primary" : "text-text-dim"}`}>{step.icon}</span>
        )}
      </div>

      {/* Título y Descripción */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${step.done ? "text-text-dim line-through" : "text-text-main leading-tight"}`}>
          {step.label}
        </p>
        {!step.done && (
          <p className="text-[10px] text-text-dim font-medium leading-relaxed mt-0.5 max-w-[220px] sm:max-w-none">
            {step.description}
          </p>
        )}
      </div>

      {/* Botón de Acción Condicional */}
      {!step.done && isNext && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAction();
          }}
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 text-primary text-[11px] font-black uppercase tracking-wide transition-all active:scale-95 animate-micro-bounce"
        >
          <span className="material-symbols-outlined text-[14px]">
            {step.id === "transaction" ? "add_circle" : "near_me"}
          </span>
          <span className="hidden sm:inline">{isMobile ? "Configurar" : "Guíame"}</span>
          <span className="sm:hidden">{step.id === "transaction" ? "Nuevo" : "Ir"}</span>
        </button>
      )}

      {step.done && (
        <span className="flex-shrink-0 text-[10px] font-black text-primary uppercase tracking-widest">✓ Listo</span>
      )}
    </div>
  );
}
