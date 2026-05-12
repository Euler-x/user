"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import type { DailyPerformance } from "@/types";

interface ChartEntry {
  label: string;
  pnl_pct: number;
  pnl: number;
}

export function buildChartData(
  daily: DailyPerformance[],
  periodDays: number
): ChartEntry[] {
  if (daily.length === 0) return [];

  if (periodDays <= 31) {
    // Daily bars — last 14 for readability on monthly view
    const slice = periodDays <= 7 ? daily : daily.slice(-14);
    return slice.map((d) => ({
      label: new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
      }),
      pnl_pct: d.pnl_pct,
      pnl: d.pnl,
    }));
  }

  // Weekly aggregation for 3M / 6M / 1Y
  const weekMap: Record<string, { pnl: number; volume: number; label: string }> = {};
  for (const d of daily) {
    const dt = new Date(d.date + "T00:00:00");
    const day = dt.getDay(); // 0=Sun
    const diff = day === 0 ? -6 : 1 - day; // shift to Monday
    const monday = new Date(dt);
    monday.setDate(dt.getDate() + diff);
    const key = monday.toISOString().split("T")[0];
    if (!weekMap[key]) {
      weekMap[key] = {
        pnl: 0,
        volume: 0,
        label: monday.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
    }
    weekMap[key].pnl += d.pnl;
    weekMap[key].volume += d.trade_volume;
  }

  return Object.entries(weekMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-24)
    .map(([, v]) => ({
      label: v.label,
      pnl_pct:
        v.volume > 0 ? parseFloat(((v.pnl / v.volume) * 100).toFixed(2)) : 0,
      pnl: parseFloat(v.pnl.toFixed(2)),
    }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload as ChartEntry;
  const pos = entry.pnl_pct >= 0;
  return (
    <div className="rounded-lg border border-white/10 bg-[#1a1a2e] px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="font-semibold" style={{ color: pos ? "#39FF14" : "#F87171" }}>
        {pos ? "+" : ""}
        {entry.pnl_pct.toFixed(2)}%
      </p>
      <p className="text-gray-500 mt-0.5">
        {pos ? "+" : ""}${Math.abs(entry.pnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
}

interface PerformanceBarChartProps {
  data: ChartEntry[];
  height?: number;
  label?: string;
}

export default function PerformanceBarChart({
  data,
  height = 220,
  label,
}: PerformanceBarChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-600 text-sm"
        style={{ height }}
      >
        No performance data for this period.
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }} barCategoryGap="30%">
          <XAxis
            dataKey="label"
            tick={{ fill: "#6B7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`}
            tick={{ fill: "#6B7280", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" />
          <Bar dataKey="pnl_pct" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.pnl_pct >= 0 ? "#06B6D4" : "#F87171"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {label && (
        <p className="text-center text-[11px] text-gray-600 mt-1">{label}</p>
      )}
    </div>
  );
}
