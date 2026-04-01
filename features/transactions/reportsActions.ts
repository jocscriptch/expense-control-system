"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/features/auth/actions";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  format,
  eachMonthOfInterval,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  getEffectiveDate,
  getMonthRange,
  formatDateToISO,
} from "@/lib/utils/date";

// ==========================================
// TIPOS PÚBLICOS
// ==========================================

export interface CategoryChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface TrendDataPoint {
  name: string;
  amount: number;
}

export interface HouseholdDataPoint {
  name: string;
  hogar: number;
  personal: number;
}

export interface ReportsData {
  totalCurrentPeriod: number;
  totalPreviousPeriod: number;
  changePercentage: number;
  topCategories: CategoryChartData[];
  categoryDistribution: CategoryChartData[];
  trendData: TrendDataPoint[];
  householdData: HouseholdDataPoint[];
}

export interface ReportsFilters {
  period: "week" | "month" | "year" | "custom";
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
}

// Helper: Calcular rangos de fechas
function getPeriodDates(filters: ReportsFilters) {
  const referenceNow = getEffectiveDate(filters.month, filters.year);

  if (filters.period === "custom" && filters.startDate && filters.endDate) {
    const from = new Date(filters.startDate + "T00:00:00");
    const to = new Date(filters.endDate + "T23:59:59");
    const diffDays = Math.ceil((to.getTime() - from.getTime()) / 86400000);
    return {
      from,
      to,
      prevFrom: subDays(from, diffDays + 1),
      prevTo: subDays(from, 1),
    };
  }

  if (filters.period === "week") {
    const from = subDays(referenceNow, 6);
    return {
      from,
      to: referenceNow,
      prevFrom: subDays(from, 7),
      prevTo: subDays(from, 1),
    };
  }

  if (filters.period === "year") {
    const targetYear =
      filters.year !== undefined ? filters.year : referenceNow.getFullYear();
    return {
      from: new Date(targetYear, 0, 1),
      to: new Date(targetYear, 11, 31, 23, 59, 59),
      prevFrom: new Date(targetYear - 1, 0, 1),
      prevTo: new Date(targetYear - 1, 11, 31, 23, 59, 59),
    };
  }

  // Default: mes actual (o el proporcionado)
  const prevMonth = subMonths(referenceNow, 1);
  return {
    from: startOfMonth(referenceNow),
    to: endOfMonth(referenceNow),
    prevFrom: startOfMonth(prevMonth),
    prevTo: endOfMonth(prevMonth),
  };
}

// Acción principal
export async function getReportsData(filters: ReportsFilters): Promise<{
  success: boolean;
  data?: ReportsData;
  error?: string;
}> {
  const supabase = await createClient();

  try {
    const user = await getUser();
    if (!user) throw new Error("No autenticado");

    const { from, to, prevFrom, prevTo } = getPeriodDates(filters);

    const fromStr = from.toISOString().split("T")[0];
    const toStr = to.toISOString().split("T")[0];
    const prevFromStr = prevFrom.toISOString().split("T")[0];
    const prevToStr = prevTo.toISOString().split("T")[0];

    // Transacciones del periodo ACTUAL con categoría
    const { data: current, error: e1 } = await supabase
      .from("transactions")
      .select(
        `
        id, amount, date, is_household,
        category:categories ( id, name, icon, color, type )
      `,
      )
      .eq("user_id", user.id)
      .gte("date", fromStr)
      .lte("date", toStr)
      .order("date", { ascending: true });

    if (e1) throw e1;

    // Transacciones del periodo ANTERIOR con categoría (para filtrar expenses)
    const { data: previous, error: e2 } = await supabase
      .from("transactions")
      .select(`amount, category:categories ( type )`)
      .eq("user_id", user.id)
      .gte("date", prevFromStr)
      .lte("date", prevToStr);

    if (e2) throw e2;

    // Filtrar solo gastos (expense)
    const expenses = (current || []).filter(
      (t: any) => t.category?.type === "expense",
    );
    const prevExpenses = (previous || []).filter(
      (t: any) => t.category?.type === "expense",
    );

    const totalCurrentPeriod = expenses.reduce(
      (s: number, t: any) => s + Number(t.amount),
      0,
    );
    const totalPreviousPeriod = prevExpenses.reduce(
      (s: number, t: any) => s + Number(t.amount),
      0,
    );

    const changePercentage =
      totalPreviousPeriod > 0
        ? ((totalCurrentPeriod - totalPreviousPeriod) / totalPreviousPeriod) *
          100
        : 0;

    // Agrupación por categoría
    const catMap = new Map<
      string,
      { name: string; color: string; total: number }
    >();
    for (const t of expenses) {
      const cat = t.category as any;
      if (!cat?.id) continue;
      const entry = catMap.get(cat.id) ?? {
        name: cat.name,
        color: cat.color || "#94a3b8",
        total: 0,
      };
      entry.total += Number(t.amount);
      catMap.set(cat.id, entry);
    }

    const categoryDistribution: CategoryChartData[] = Array.from(
      catMap.values(),
    )
      .sort((a, b) => b.total - a.total)
      .map((cat) => ({
        name: cat.name,
        value: cat.total,
        color: cat.color,
        percentage:
          totalCurrentPeriod > 0
            ? Math.round((cat.total / totalCurrentPeriod) * 100)
            : 0,
      }));

    const topCategories = categoryDistribution.slice(0, 3);

    // Tendencia de los últimos 6 meses (alineada al mes de referencia)
    const referenceNow = getEffectiveDate(filters.month, filters.year);

    const trendStart = startOfMonth(subMonths(referenceNow, 5));
    const trendEnd = endOfMonth(referenceNow);

    const { data: trendRaw } = await supabase
      .from("transactions")
      .select(`amount, date, category:categories ( type )`)
      .eq("user_id", user.id)
      .gte("date", trendStart.toISOString().split("T")[0])
      .lte("date", trendEnd.toISOString().split("T")[0]);

    const trendMonths = eachMonthOfInterval({
      start: trendStart,
      end: trendEnd,
    });
    const trendData: TrendDataPoint[] = trendMonths.map((m) => {
      const monthStr = format(m, "yyyy-MM");
      const total = (trendRaw || [])
        .filter(
          (t: any) =>
            t.category?.type === "expense" && t.date.startsWith(monthStr),
        )
        .reduce((s: number, t: any) => s + Number(t.amount), 0);
      return { name: format(m, "MMM", { locale: es }), amount: total };
    });

    // Hogar vs Personal (últimos 4 meses)
    const householdMonths = eachMonthOfInterval({
      start: startOfMonth(subMonths(new Date(), 3)),
      end: endOfMonth(new Date()),
    });

    const householdData: HouseholdDataPoint[] = householdMonths.map((m) => {
      const monthStr = format(m, "yyyy-MM");
      const monthly = (trendRaw || []).filter((t: any) =>
        t.date.startsWith(monthStr),
      );

      const currentMonthFull = (current || []).filter((t: any) =>
        t.date?.startsWith(monthStr),
      );
      return {
        name: format(m, "MMM", { locale: es }),
        hogar: currentMonthFull
          .filter((t: any) => t.is_household && t.category?.type === "expense")
          .reduce((s: number, t: any) => s + Number(t.amount), 0),
        personal: currentMonthFull
          .filter((t: any) => !t.is_household && t.category?.type === "expense")
          .reduce((s: number, t: any) => s + Number(t.amount), 0),
      };
    });

    return {
      success: true,
      data: {
        totalCurrentPeriod,
        totalPreviousPeriod,
        changePercentage,
        topCategories,
        categoryDistribution,
        trendData,
        householdData,
      },
    };
  } catch (error: any) {
    console.error("Error getReportsData:", error);
    return { success: false, error: error.message };
  }
}

// Mini chart del Dashboard (últimos 6 meses)
export async function getDashboardTrendData(
  month?: number,
  year?: number,
): Promise<{
  success: boolean;
  data?: TrendDataPoint[];
}> {
  const supabase = await createClient();

  try {
    const user = await getUser();
    if (!user) return { success: false };

    const referenceNow = getEffectiveDate(month, year);

    const start = startOfMonth(subMonths(referenceNow, 5));
    const end = endOfMonth(referenceNow);

    const { data: raw } = await supabase
      .from("transactions")
      .select(`amount, date, category:categories ( type )`)
      .eq("user_id", user.id)
      .gte("date", start.toISOString().split("T")[0])
      .lte("date", end.toISOString().split("T")[0]);

    const months = eachMonthOfInterval({ start, end: referenceNow });
    const data: TrendDataPoint[] = months.map((m) => {
      const monthStr = format(m, "yyyy-MM");
      const total = (raw || [])
        .filter(
          (t: any) =>
            t.category?.type === "expense" && t.date.startsWith(monthStr),
        )
        .reduce((s: number, t: any) => s + Number(t.amount), 0);
      return { name: format(m, "MMM", { locale: es }), amount: total };
    });

    return { success: true, data };
  } catch {
    return { success: false };
  }
}
