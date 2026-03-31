"use client";

import React, { useEffect, useState } from "react";
import { getDashboardSummary } from "@/features/transactions/actions";
import { getDashboardTrendData, getReportsData } from "@/features/transactions/reportsActions";
import { useSearchParams } from "next/navigation";
import type { TrendDataPoint, CategoryChartData } from "@/features/transactions/reportsActions";
import { Skeleton } from "@/components/ui/Skeleton";
import { SpendingTrendChart, CategoryDistributionChart } from "@/features/transactions/components/ReportsCharts";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { ResponsiveTableWrapper } from "@/components/ui/ResponsiveTableWrapper";
import { useTransactionModal } from "@/features/transactions/context/TransactionModalContext";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryChartData[]>([]);

  const searchParams = useSearchParams();
  const month = searchParams.get("month") ? Number(searchParams.get("month")) : undefined;
  const year = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
  
  const { refreshTrigger } = useTransactionModal();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [summaryResult, trendResult, reportsResult] = await Promise.all([
        getDashboardSummary(month, year),
        getDashboardTrendData(),
        getReportsData({ period: "month" }),
      ]);

      if (summaryResult.success) setData(summaryResult.data);
      if (trendResult.success && trendResult.data) setTrendData(trendResult.data);
      if (reportsResult.success && reportsResult.data) setCategoryData(reportsResult.data.categoryDistribution);

      setLoading(false);
    }
    fetchData();
  }, [month, year, refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
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
    <div className="space-y-6 transition-colors duration-200 pb-10">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1: Gasto del mes */}
        <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-red-500/30 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2 text-text-sub font-medium">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[10px]">Gastos</h3>
            <div className="size-8 rounded-full bg-red-500/10 flex items-center justify-center transition-colors group-hover:bg-red-500/20">
              <span className="material-symbols-outlined text-[18px] text-red-500/80">payments</span>
            </div>
          </div>
          <div>
            <AmountDisplay value={totalExpenses} className="text-3xl font-black text-text-main" symbolClassName="text-red-500/60" />
            <p className="text-[10px] uppercase font-bold tracking-wider text-text-dim mt-3 italic opacity-60">Acumulado del mes</p>
          </div>
        </div>

        {/* Card 2: Meta Mensual (Presupuesto) */}
        <div className="bg-surface p-5 md:p-6 rounded-2xl border border-border shadow-sm group hover:border-blue-500/30 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2 text-text-sub font-medium">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[10px]">Presupuesto</h3>
            <div className="size-8 rounded-full bg-blue-500/10 flex items-center justify-center transition-colors group-hover:bg-blue-500/20">
              <span className="material-symbols-outlined text-[18px] text-blue-500/80">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <AmountDisplay value={monthlyBudget} className="text-3xl font-black text-text-main" symbolClassName="text-blue-500/50" />
            <p className="text-[10px] uppercase font-bold tracking-wider text-text-dim mt-3 italic opacity-60">Límite definido</p>
          </div>
        </div>

        {/* Card 3: Saldo Disponible (Barra de progreso) */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm group hover:border-primary/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-text-sub text-sm font-bold uppercase tracking-widest text-[10px]">Saldo Disponible</h3>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-colors ${
                usedPercentage > 90 
                  ? "bg-red-500/10 text-red-500" 
                  : usedPercentage > 75 
                    ? "bg-amber-500/10 text-amber-500" 
                    : "bg-primary/10 text-primary"
              }`}>
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
              className={`h-full rounded-full transition-all duration-1000 ease-out fill-mode-forwards ${
                usedPercentage > 90 
                  ? 'bg-gradient-to-r from-red-600 to-red-400' 
                  : usedPercentage > 75 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                    : 'bg-gradient-to-r from-primary to-emerald-400'
              }`} 
              style={{ width: `${Math.min(usedPercentage, 100)}%` }}
            >
              <div className="w-full h-full opacity-30 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_2s_linear_infinite]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Quick View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-sm group hover:border-primary/20 transition-all">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-text-dim">Tendencia Mensual</h3>
            <a href="/dashboard/reports" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Ver Reportes</a>
          </div>
          <SpendingTrendChart data={trendData} />
        </div>
        
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm group hover:border-primary/20 transition-all flex flex-col">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-dim mb-6">Distribución</h3>
          <CategoryDistributionChart data={categoryData} />
          
          {categoryData.length > 0 && (
            <div className="mt-auto pt-6 grid grid-cols-2 gap-2 border-t border-border/50">
              {categoryData.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 overflow-hidden">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] font-bold text-text-sub uppercase tracking-tight truncate">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Recent Transactions List */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-sm font-black uppercase tracking-widest text-text-dim">Últimos movimientos</h3>
          <a
            href="/dashboard/expenses"
            className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest flex items-center gap-1 group"
          >
            Ver todos <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </a>
        </div>

        <ResponsiveTableWrapper
          desktopContent={
            <table className="w-full text-left border-collapse">
              <thead className="bg-background/40 text-text-sub text-[10px] uppercase font-bold tracking-widest border-b border-border/50">
                <tr>
                  <th className="px-6 py-4">Concepto</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4 text-center">Fecha</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-dim italic">
                      No hay movimientos este mes.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((trx: any) => (
                    <tr key={trx.id} className="hover:bg-surface-hover/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border border-white/5 shadow-sm"
                            style={{
                              backgroundColor: `${trx.category?.color || "#3b82f6"}15`,
                              color: trx.category?.color || "#3b82f6",
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {trx.category?.icon || "payments"}
                            </span>
                          </div>
                          <span className="font-bold text-text-main text-sm truncate max-w-[120px]">
                            {trx.category?.name || "Varios"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-text-sub text-sm truncate max-w-[180px] block group-hover:text-text-main transition-colors">
                          {trx.description || <span className="italic opacity-40">Sin detalles</span>}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest bg-background/80 px-2 py-1.5 rounded-lg border border-border/40 group-hover:border-border transition-colors">
                          {new Date(trx.date).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <AmountDisplay
                          value={Number(trx.amount)}
                          className="text-base font-black text-text-main justify-end"
                          symbolClassName={`mr-1 ${trx.type === 'income' ? 'text-primary/60' : 'text-rose-500/60'}`}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          }
          mobileContent={
            recentTransactions.length === 0 ? (
              <div className="p-10 text-center text-text-dim italic">
                Aún no hay movimientos este mes.
              </div>
            ) : (
              recentTransactions.map((trx: any) => (
                <div key={trx.id} className="p-4 flex flex-col gap-3 group active:bg-surface-hover/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border"
                        style={{
                          backgroundColor: `${trx.category?.color || "#3b82f6"}15`,
                          color: trx.category?.color || "#3b82f6",
                          borderColor: `${trx.category?.color || "#3b82f6"}30`,
                        }}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {trx.category?.icon || "payments"}
                        </span>
                        {trx.category?.name || "Varios"}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-text-dim uppercase">
                      {new Date(trx.date).toLocaleDateString("es-ES", { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-0.5 overflow-hidden pr-4">
                      <span className="text-sm font-medium text-text-main truncate">
                        {trx.description || <span className="italic opacity-30">Sin descripción</span>}
                      </span>
                    </div>
                    <AmountDisplay 
                      value={Number(trx.amount)} 
                      className="text-lg font-black text-text-main flex-shrink-0" 
                      symbolClassName={`mr-1 ${trx.type === 'income' ? 'text-primary/60' : 'text-rose-500/60'}`}
                    />
                  </div>
                </div>
              ))
            )
          }
        />
      </div>
    </div>
  );
}
