"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { EquityCurvePoint } from "@/types";

interface EquityCurveChartProps {
  data: EquityCurvePoint[];
  height?: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatCurrency(value: number) {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function EquityCurveChart({ data, height = 300 }: EquityCurveChartProps) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-500 text-sm"
        style={{ height }}
      >
        No equity data available yet.
      </div>
    );
  }

  const isPositive = data[data.length - 1]?.cumulative_pnl >= 0;
  const color = isPositive ? "#39FF14" : "#F87171";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(val) => formatDate(String(val))}
          tick={{ fill: "#6B7280", fontSize: 11 }}
          axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatCurrency(Number(v))}
          tick={{ fill: "#6B7280", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1a2e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelFormatter={(label) => formatDate(String(label))}
          formatter={(value, name) => [
            formatCurrency(Number(value ?? 0)),
            name === "cumulative_pnl" ? "Cumulative PnL" : "Trade PnL",
          ]}
        />
        <Area
          type="monotone"
          dataKey="cumulative_pnl"
          stroke={color}
          strokeWidth={2}
          fill="url(#equityGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
