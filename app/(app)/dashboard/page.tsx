"use client";

import React, { useEffect, useState } from "react";
import { getDashboardSummary } from "@/features/transactions/actions";
import { Skeleton } from "@/components/ui/Skeleton";
import { AmountDisplay } from "@/components/ui/AmountDisplay";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getDashboardSummary();
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 bg-surface rounded-2xl border border-border" />
          ))}
        </div>
        <Skeleton className="h-64 bg-surface rounded-2xl border border-border" />
      </div>
    );
  }

  const {
    totalExpenses,
    totalIncomes,
    monthlyBudget,
    remainingBudget,
    usedPercentage,
    availableBalance,
    recentTransactions
  } = data || {
    totalExpenses: 0,
    totalIncomes: 0,
    monthlyBudget: 0,
    remainingBudget: 0,
    usedPercentage: 0,
    availableBalance: 0,
    recentTransactions: []
  };



  return (
    <div className="space-y-6 transition-colors duration-200">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Gasto del mes */}
        <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-2 text-text-sub font-medium">
            <h3 className="text-sm">Gasto del mes</h3>
            <span className="material-symbols-outlined text-[20px] text-primary/40">payments</span>
          </div>
          <AmountDisplay value={totalExpenses} className="text-3xl font-black text-text-main" />
          <p className="text-[10px] uppercase font-bold tracking-wider text-text-dim mt-3">Total acumulado este mes</p>
        </div>

        {/* Card 2: Meta Mensual (Presupuesto) */}
        <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start mb-2 text-text-sub font-medium">
            <h3 className="text-sm">Meta Mensual</h3>
            <span className="material-symbols-outlined text-[20px] text-text-dim/30">account_balance_wallet</span>
          </div>
          <AmountDisplay value={monthlyBudget} className="text-3xl font-black text-text-main" symbolClassName="text-primary/40" />
          <p className="text-[10px] uppercase font-bold tracking-wider text-text-dim mt-3">Presupuesto global asignado</p>
        </div>

        {/* Card 3: Saldo Disponible (Barra de progreso) */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-text-sub text-sm font-medium">Saldo Disponible</h3>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${usedPercentage > 90 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`}>
                {usedPercentage.toFixed(0)}% Utilizado
              </span>
            </div>
            <AmountDisplay 
              value={remainingBudget} 
              className={`text-3xl font-black mb-4 ${remainingBudget >= 0 ? 'text-text-main' : 'text-red-500'}`} 
              symbolClassName={remainingBudget >= 0 ? 'text-primary/60' : 'text-red-500/40'}
            />
          </div>
          
          <div className="w-full bg-background rounded-full h-3 overflow-hidden shadow-inner p-[2px] border border-border/50">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out fill-mode-forwards ${usedPercentage > 90 ? 'bg-gradient-to-r from-red-600 to-red-400' : 'bg-gradient-to-r from-primary to-emerald-400'}`} 
              style={{ width: `${usedPercentage}%` }}
            >
              <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_2s_linear_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden mt-6">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <h3 className="text-base font-bold text-text-main">Últimos movimientos</h3>
          <a href="/dashboard/transactions" className="text-sm font-semibold text-primary hover:text-primary-hover">Ver todos</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-0">
            <thead className="bg-background/50 text-text-sub text-[10px] md:text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-4 md:px-6 py-4">Concepto</th>
                <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Descripción</th>
                <th className="px-4 md:px-6 py-4 hidden md:table-cell">Fecha</th>
                <th className="px-4 md:px-6 py-4 text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-text-dim italic">
                    Aún no hay movimientos este mes.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((trx: any) => (
                  <tr key={trx.id} className="hover:bg-surface-hover/50 transition-colors group text-sm md:text-base">
                    <td className="px-4 md:px-6 py-4 text-text-main">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div 
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 border"
                          style={{
                            backgroundColor: `${trx.category?.color || '#3b82f6'}15`,
                            color: trx.category?.color || '#3b82f6',
                            borderColor: `${trx.category?.color || '#3b82f6'}30`
                          }}
                        >
                          <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                            {trx.category?.icon || 'payments'}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-text-main block">{trx.category?.name || 'Varios'}</span>
                          <span className="text-[10px] text-text-dim sm:hidden">{trx.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-text-sub font-medium hidden sm:table-cell">{trx.description}</td>
                    <td className="px-4 md:px-6 py-4 text-text-dim text-sm hidden md:table-cell">
                      {new Date(trx.date).toLocaleDateString("es-CR", { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right font-bold">
                      <div className="flex justify-end">
                        <AmountDisplay 
                          value={Number(trx.amount)} 
                          className="text-lg font-black text-text-main"
                          symbolClassName="text-text-dim/40"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
