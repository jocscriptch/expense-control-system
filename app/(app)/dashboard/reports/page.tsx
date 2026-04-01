"use client";

import React, { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/Skeleton";
import { Calendar } from "@/components/ui/calendar";
import { format, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { useReports } from "@/features/transactions/hooks/useReports";
import {
  SpendingTrendChart,
  CategoryDistributionChart,
  HouseholdComparisonChart,
} from "@/features/transactions/components/ReportsCharts";
import { AmountDisplay } from "@/components/ui/AmountDisplay";
import { CategoryChartData } from "@/features/transactions/reportsActions";

type Period = "week" | "month" | "year" | "custom";

const periodLabels: Record<Period, string> = {
  week: "Esta Semana",
  month: "Este Mes",
  year: "Este Año",
  custom: "Personalizado",
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [customRange, setCustomRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);
  const [tempRange, setTempRange] = useState<
    { from?: Date; to?: Date } | undefined
  >(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { reportsData, isLoading: reportsLoading } = useReports({
    period,
    startDate: customRange?.from ?? undefined,
    endDate: customRange?.to ?? undefined,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const isLoading = isCalendarOpen ? false : reportsLoading;

  const labels = useMemo(() => {
    const current = periodLabels[period];
    let previous = "Periodo Anterior";

    if (period === "month") {
      const prevMonth = subMonths(new Date(), 1);
      previous = `Vs ${format(prevMonth, "MMMM", { locale: es })}`;
    } else if (period === "week") {
      previous = "Vs Semana Pasada";
    }

    return { current, previous };
  }, [period]);

  const changeAbs = reportsData ? Math.abs(reportsData.changePercentage) : 0;
  const changeIsPositive = reportsData
    ? reportsData.changePercentage > 0
    : false;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-text-main text-3xl font-black tracking-tight">
            Reportes y Análisis
          </h1>
          <p className="text-text-dim text-sm font-medium">
            Visualiza el rendimiento de tus finanzas personales.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 p-1 bg-surface-hover/30 rounded-xl border border-border/50">
          {(Object.entries(periodLabels) as [Period, string][]).map(
            ([key, label]) => {
              const isActive = period === key;

              let displayLabel = label;
              if (key === "custom" && customRange?.from) {
                const fromStr = format(customRange.from, "dd MMM", {
                  locale: es,
                });
                const toStr = customRange.to
                  ? format(customRange.to, "dd MMM", { locale: es })
                  : "...";
                displayLabel = `${fromStr} - ${toStr}`;
              }

              const btn = (
                <button
                  key={key}
                  onClick={() => {
                    if (key !== "custom") {
                      setPeriod(key);
                      setCustomRange(undefined);
                    }
                  }}
                  className={`
                  px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 border
                  ${
                    isActive
                      ? "bg-black text-primary border-primary/40 shadow-[0_0_15px_-5px_rgba(var(--primary-rgb),0.2)] scale-[1.02]"
                      : "bg-transparent text-text-dim border-transparent hover:text-text-main hover:bg-surface-hover/20"
                  }
                `}
                >
                  {displayLabel}
                </button>
              );

              if (key === "custom") {
                return (
                  <Popover
                    key={key}
                    open={isCalendarOpen}
                    onOpenChange={(open) => {
                      setIsCalendarOpen(open);
                      if (open) setTempRange(customRange);
                    }}
                  >
                    <PopoverTrigger asChild>{btn}</PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 rounded-2xl shadow-2xl border-border"
                      align="end"
                      side="bottom"
                      sideOffset={8}
                    >
                      <Calendar
                        mode="range"
                        selected={tempRange as any}
                        onSelect={(range: any) => {
                          setTempRange(range);

                          // determinar si el rango está completo
                          const isNowComplete =
                            range?.from &&
                            range?.to &&
                            range.from.getTime() !== range.to.getTime();

                          // si lo está, resetear el filtro de reportes de inmediato.
                          const wasComplete =
                            customRange?.from && customRange?.to;
                          if (!isNowComplete && wasComplete) {
                            setCustomRange(undefined);
                          }

                          if (isNowComplete) {
                            setCustomRange(range);
                            setPeriod("custom");
                            setIsCalendarOpen(false);
                          }
                        }}
                        initialFocus
                        className="p-3 font-sans"
                      />
                    </PopoverContent>
                  </Popover>
                );
              }
              return btn;
            },
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] rounded-2xl" />
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-7xl text-primary">
                  payments
                </span>
              </div>
              <p className="text-text-dim text-[10px] font-black uppercase tracking-widest mb-2">
                {labels.current}
              </p>
              <AmountDisplay
                value={reportsData?.totalCurrentPeriod ?? 0}
                className="text-3xl font-black text-text-main"
              />
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                    changeIsPositive
                      ? "bg-red-500/10 text-red-500"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {changeIsPositive ? "trending_up" : "trending_down"}
                  </span>
                  {changeAbs.toFixed(1)}%
                </span>
                <span className="text-text-dim text-[10px] font-bold uppercase tracking-tight">
                  {labels.previous}
                </span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border relative group hover:border-primary/30 transition-all">
              <p className="text-text-dim text-[10px] font-black uppercase tracking-widest mb-4">
                Top Categorías
              </p>
              <div className="space-y-3">
                {reportsData?.topCategories
                  .slice(0, 3)
                  .map((cat: CategoryChartData) => (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between group/item"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-xs font-bold text-text-main truncate max-w-[100px]">
                          {cat.name}
                        </span>
                        <span className="text-[10px] text-text-dim font-bold">
                          {cat.percentage}%
                        </span>
                      </div>
                      <AmountDisplay
                        value={cat.value}
                        className="text-xs font-black text-text-main"
                      />
                    </div>
                  ))}
                {(!reportsData || reportsData.topCategories.length === 0) && (
                  <p className="text-xs text-text-dim font-medium italic">
                    Sin datos este periodo
                  </p>
                )}
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border relative overflow-hidden group hover:border-primary/30 transition-all">
              <p className="text-text-dim text-[10px] font-black uppercase tracking-widest mb-4">
                Exceso vs Anterior
              </p>
              <AmountDisplay
                value={
                  reportsData
                    ? Math.max(
                        0,
                        reportsData.totalCurrentPeriod -
                          reportsData.totalPreviousPeriod,
                      )
                    : 0
                }
                className="text-2xl font-black text-red-500"
              />
              <p className="text-[9px] font-bold text-text-dim uppercase tracking-tighter mt-1 leading-none">
                {changeIsPositive
                  ? `Has gastado ${changeAbs.toFixed(1)}% más que antes`
                  : "Estás ahorrando vs el periodo anterior"}
              </p>
              <div className="mt-4 h-1.5 w-full bg-surface-hover rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${changeIsPositive ? "bg-red-500" : "bg-primary"}`}
                  style={{ width: `${Math.min(changeAbs, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="mb-8">
                <h3 className="text-lg font-black text-text-main">
                  Tendencia del gasto
                </h3>
                <p className="text-xs text-text-dim font-bold uppercase tracking-wider">
                  Últimos 6 meses
                </p>
              </div>
              <SpendingTrendChart data={reportsData?.trendData} />
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="mb-8">
                <h3 className="text-lg font-black text-text-main">
                  Distribución
                </h3>
                <p className="text-xs text-text-dim font-bold uppercase tracking-wider text-primary">
                  Por Categorías
                </p>
              </div>
              <CategoryDistributionChart
                data={reportsData?.categoryDistribution}
              />
            </div>
          </div>

          {/* Secondary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="mb-8">
                <h3 className="text-lg font-black text-text-main">
                  Hogar vs Personal
                </h3>
                <p className="text-xs text-text-dim font-bold uppercase tracking-wider">
                  Comparativa de tipo de gasto · Últimos 4 meses
                </p>
              </div>
              <HouseholdComparisonChart data={reportsData?.householdData} />
            </div>

            <div className="bg-surface border border-border rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden group hover:border-primary/30 transition-all shadow-sm">
              <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
                <span className="material-symbols-outlined text-[120px] text-primary">
                  lightbulb
                </span>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest mb-4 border border-primary/20">
                  <span className="material-symbols-outlined text-[14px]">
                    bolt
                  </span>
                  Insight
                </div>
                {reportsData && reportsData.topCategories.length > 0 ? (
                  <>
                    <h4 className="text-xl font-bold text-text-main mb-2 tracking-tight">
                      {changeIsPositive ? "Alerta de Gasto" : "¡Buen Control!"}
                    </h4>
                    <p className="text-text-sub text-sm leading-relaxed mb-6 font-medium">
                      {changeIsPositive ? (
                        <>
                          Has gastado un{" "}
                          <span className="text-red-500 font-bold">
                            {changeAbs.toFixed(1)}% más
                          </span>{" "}
                          en comparación al periodo anterior. Tu categoría con
                          mayor gasto es{" "}
                          <span className="text-text-main font-bold">
                            {reportsData.topCategories[0]?.name}
                          </span>{" "}
                          con el{" "}
                          <span className="text-text-main font-bold">
                            {reportsData.topCategories[0]?.percentage}%
                          </span>{" "}
                          del total.
                        </>
                      ) : (
                        <>
                          Excelente trabajo. Has reducido tu gasto un{" "}
                          <span className="text-primary font-bold">
                            {changeAbs.toFixed(1)}%
                          </span>{" "}
                          vs el periodo anterior. Tu mayor gasto sigue siendo en{" "}
                          <span className="text-text-main font-bold">
                            {reportsData.topCategories[0]?.name}
                          </span>
                          .
                        </>
                      )}
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-xl font-bold text-text-main mb-2 tracking-tight">
                      Sin suficientes datos
                    </h4>
                    <p className="text-text-sub text-sm leading-relaxed mb-6 font-medium">
                      Agrega más transacciones para que el sistema pueda generar
                      insights personalizados sobre tus hábitos de gasto.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
