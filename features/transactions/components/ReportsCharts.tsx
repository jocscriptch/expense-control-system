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
  Legend,
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border/50 shadow-xl rounded-xl p-3 flex flex-col gap-1 z-50">
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest">{label || payload[0].name || "Total"}</span>
        <span className="text-sm font-black text-text-main">{formatAmount(Number(payload[0].value || 0))}</span>
      </div>
    );
  }
  return null;
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
            cursor={{ fill: "rgba(244, 63, 94, 0.05)", radius: 6 }}
            content={<CustomTooltip />}
          />
          <Bar dataKey="amount" radius={[6, 6, 6, 6]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === lastIndex
                    ? "#f43f5e" // rose-500
                    : entry.amount === maxAmount
                      ? "rgba(244, 63, 94, 0.45)" // max value subtle
                      : "rgba(244, 63, 94, 0.15)" // other values very subtle
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
            paddingAngle={2}
            dataKey="value"
            stroke="var(--color-surface)"
            strokeWidth={3}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
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

const HouseholdTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border/50 shadow-xl rounded-xl p-4 flex flex-col gap-2 z-50 min-w-[140px]">
        <span className="text-[10px] font-bold text-text-dim uppercase tracking-widest border-b border-border/50 pb-2 mb-1">{label}</span>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
              <span className="text-xs font-bold text-text-sub uppercase tracking-tight">{entry.name}</span>
            </div>
            <span className="text-sm font-black text-text-main">{formatAmount(Number(entry.value || 0))}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
          barGap={6}
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
            cursor={{ fill: "var(--color-surface-hover)" }}
            content={<HouseholdTooltip />}
          />
          <Legend 
            wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--color-text-dim)' }} 
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="hogar"
            fill="#3b82f6"
            radius={[4, 4, 4, 4]}
            name="Hogar"
          />
          <Bar
            dataKey="personal"
            fill="rgba(148,163,184,0.3)"
            radius={[4, 4, 4, 4]}
            name="Personal"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
