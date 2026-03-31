"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import type {
  TrendDataPoint,
  CategoryChartData,
  HouseholdDataPoint,
} from "../reportsActions";

const formatAmount = (value: number) => {
  if (value >= 1000000) return `₡${(value / 1000000).toFixed(1)}M`;
  return `₡${value.toLocaleString("es-CR")}`;
};

interface SpendingTrendChartProps {
  data?: TrendDataPoint[];
}

export function SpendingTrendChart({ data }: SpendingTrendChartProps) {
  const chartData = data && data.length > 0 ? data : [];
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);
  const lastIndex = chartData.length - 1;

  if (chartData.every((d) => d.amount === 0)) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-text-dim">
        <span className="material-symbols-outlined text-4xl opacity-30">
          bar_chart
        </span>
        <p className="text-xs font-bold uppercase tracking-widest opacity-50">
          Sin datos en este periodo
        </p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(0,0,0,0.05)"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "rgba(19,236,91,0.05)", radius: 8 }}
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            itemStyle={{ color: "#fff", fontSize: "12px", fontWeight: "bold" }}
            formatter={(value) => [formatAmount(Number(value ?? 0)), "Gasto"]}
            labelStyle={{ display: "none" }}
          />
          <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === lastIndex
                    ? "#13ec5b"
                    : entry.amount === maxAmount
                      ? "rgba(19,236,91,0.5)"
                      : "rgba(19,236,91,0.2)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CategoryDistributionChartProps {
  data?: CategoryChartData[];
}

export function CategoryDistributionChart({
  data,
}: CategoryDistributionChartProps) {
  const chartData = data && data.length > 0 ? data : [];
  const top = chartData[0];

  if (chartData.length === 0) {
    return (
      <div className="h-[250px] flex flex-col items-center justify-center gap-2 text-text-dim">
        <span className="material-symbols-outlined text-4xl opacity-30">
          donut_large
        </span>
        <p className="text-xs font-bold uppercase tracking-widest opacity-50">
          Sin datos
        </p>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
            }}
            formatter={(value) => [formatAmount(Number(value ?? 0)), ""]}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Pie Central Label */}
      {top && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] text-text-dim uppercase font-black tracking-widest">
            Mayor
          </span>
          <span className="text-2xl font-black text-text-main leading-tight">
            {top.percentage}%
          </span>
        </div>
      )}
    </div>
  );
}

interface HouseholdComparisonChartProps {
  data?: HouseholdDataPoint[];
}

export function HouseholdComparisonChart({
  data,
}: HouseholdComparisonChartProps) {
  const chartData = data && data.length > 0 ? data : [];

  if (chartData.every((d) => d.hogar === 0 && d.personal === 0)) {
    return (
      <div className="h-[250px] flex flex-col items-center justify-center gap-2 text-text-dim">
        <span className="material-symbols-outlined text-4xl opacity-30">
          home
        </span>
        <p className="text-xs font-bold uppercase tracking-widest opacity-50">
          Sin datos en este periodo
        </p>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(0,0,0,0.05)"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "12px",
            }}
            formatter={(value) => [formatAmount(Number(value ?? 0)), ""]}
          />
          <Bar
            dataKey="hogar"
            fill="#13ec5b"
            radius={[5, 5, 0, 0]}
            name="Hogar"
          />
          <Bar
            dataKey="personal"
            fill="rgba(148,163,184,0.4)"
            radius={[5, 5, 0, 0]}
            name="Personal"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
