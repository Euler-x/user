"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Activity,
  Brain,
  Zap,
  Wifi,
  WifiOff,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Plus,
  Shield,
  Flame,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { PageSpinner } from "@/components/ui/Spinner";
import StatusBadge from "@/components/ui/StatusBadge";
import useStrategies from "@/hooks/useStrategies";
import useSignals from "@/hooks/useSignals";
import useExecutions from "@/hooks/useExecutions";
import useAnalytics from "@/hooks/useAnalytics";
import useMarketData from "@/hooks/useMarketData";
import { useAuthStore } from "@/stores/authStore";
import { formatCurrency, formatNumber, formatPnl } from "@/lib/utils";

const EXPLORER_TX_URL = "https://app.hyperliquid.xyz/explorer/tx/";

// ── Helpers ─────────────────────────────────────────────────────────

function formatCompact(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return "$0";
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPrice(price: number): string {
  if (price >= 1000) return formatCurrency(price);
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(6)}`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatChartDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatChartValue(value: number) {
  const prefix = value >= 0 ? "+" : "";
  return `${prefix}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

// ── Animation variants ──────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

// ── Win Rate Ring ───────────────────────────────────────────────────

function WinRateRing({ rate, size = 54 }: { rate: number; size?: number }) {
  const sw = 4.5;
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const p = (Math.min(Math.max(rate, 0), 100) / 100) * c;

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={sw}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#wrGrad)"
          strokeWidth={sw}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${c}` }}
          animate={{ strokeDasharray: `${p} ${c}` }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
        />
        <defs>
          <linearGradient id="wrGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold text-white">
          {rate.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

// ── Chart Tooltip ───────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value as number;
  const pos = val >= 0;
  return (
    <div className="bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 shadow-2xl">
      <p className="text-[10px] text-slate-400 mb-0.5">
        {formatChartDate(String(label))}
      </p>
      <p
        className={`text-sm font-bold ${pos ? "text-neon" : "text-rose-400"}`}
      >
        {pos ? "+" : ""}
        {formatCurrency(Math.abs(val))}
      </p>
    </div>
  );
}

// ── Strategy theme map ──────────────────────────────────────────────

const STRAT_THEME: Record<
  string,
  { icon: string; bg: string; border: string }
> = {
  conservative: {
    icon: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-l-blue-500",
  },
  moderate: {
    icon: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-l-violet-500",
  },
  aggressive: {
    icon: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-l-rose-500",
  },
  custom: {
    icon: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-l-emerald-500",
  },
};

// ═════════════════════════════════════════════════════════════════════
// ── Dashboard Page ──────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const {
    strategies,
    fetchStrategies,
    loading: stratLoading,
  } = useStrategies();
  const { fetchSignals, loading: sigLoading } = useSignals();
  const {
    executions,
    fetchExecutions,
    loading: execLoading,
  } = useExecutions();
  const { overview, equityCurve, fetchOverview, fetchEquityCurve } =
    useAnalytics();
  const { topGainers, topLosers, connected } = useMarketData();

  const [liveSignals, setLiveSignals] = useState(0);
  const [chartPeriod, setChartPeriod] = useState<30 | 90>(30);

  // ── Initial data fetch ──
  useEffect(() => {
    fetchStrategies();
    fetchSignals({ page: 1, page_size: 5 }).then(
      (d) => d && setLiveSignals(d.total)
    );
    fetchExecutions({ page: 1, page_size: 5 });
  }, [fetchStrategies, fetchSignals, fetchExecutions]);

  // ── Chart data (responds to period change) ──
  useEffect(() => {
    fetchOverview(chartPeriod);
    fetchEquityCurve({ days: chartPeriod });
  }, [chartPeriod, fetchOverview, fetchEquityCurve]);

  // ── Loading state ──
  const loading = stratLoading || sigLoading || execLoading;
  if (loading && strategies.length === 0) return <PageSpinner />;

  // ── Computed values ──
  const activeStrategies = strategies.filter((s) => s.is_active);
  const totalPnl =
    overview?.total_pnl ??
    executions.reduce((sum, e) => sum + (e.pnl ?? 0), 0);
  const pnlPositive = totalPnl >= 0;
  const totalCapital = activeStrategies.reduce(
    (sum, s) => sum + s.capital_allocation,
    0
  );
  const returnPct = totalCapital > 0 ? (totalPnl / totalCapital) * 100 : 0;
  const chartColor =
    equityCurve.length > 0 &&
    equityCurve[equityCurve.length - 1]?.cumulative_pnl >= 0
      ? "#39FF14"
      : "#FB7185";
  const userName = user?.email?.split("@")[0] ?? null;
  const dateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const marketTokens = [
    ...topGainers.slice(0, 5),
    ...topLosers.slice(0, 3),
  ].slice(0, 8);

  return (
    <PageTransition>
      <div className="relative space-y-6">
        {/* ── Ambient glow ── */}
        <div className="pointer-events-none absolute -top-24 left-1/4 h-[500px] w-[500px] rounded-full bg-neon/[0.02] blur-[120px]" />
        <div className="pointer-events-none absolute -top-24 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/[0.03] blur-[120px]" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Header ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-white">
              {getGreeting()}
              {userName ? `, ${userName}` : ""}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{dateStr}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/strategies"
              className="inline-flex items-center gap-1.5 rounded-xl bg-neon/10 px-3.5 py-2 text-xs font-medium text-neon transition-colors hover:bg-neon/20"
            >
              <Plus className="h-3.5 w-3.5" /> New Strategy
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3.5 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
            >
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Link>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Stats Grid ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* ── Total PnL ── */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-200/80 backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-400" />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
                    {pnlPositive ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-rose-400" />
                    )}
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Total PnL
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold tracking-tight ${
                    pnlPositive ? "text-neon" : "text-rose-400"
                  }`}
                >
                  {pnlPositive ? "+" : ""}
                  {formatCurrency(totalPnl)}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      pnlPositive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {pnlPositive ? (
                      <ArrowUpRight className="h-2.5 w-2.5" />
                    ) : (
                      <ArrowDownRight className="h-2.5 w-2.5" />
                    )}
                    {returnPct >= 0 ? "+" : ""}
                    {returnPct.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {chartPeriod}D
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Win Rate ── */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-200/80 backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-400 to-indigo-500" />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10">
                    <Target className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Win Rate
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <WinRateRing rate={overview?.win_rate ?? 0} />
                  <div>
                    <p className="text-lg font-bold text-white">
                      {overview
                        ? `${overview.win_rate.toFixed(1)}%`
                        : "\u2014"}
                    </p>
                    {overview && overview.profit_factor > 0 && (
                      <p className="text-[11px] text-slate-500">
                        PF {overview.profit_factor.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Sharpe / Risk ── */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-200/80 backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-violet-400 to-purple-500" />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/10">
                    <Shield className="h-4 w-4 text-violet-400" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Sharpe Ratio
                  </span>
                </div>
                <p className="text-2xl font-bold tracking-tight text-white">
                  {overview ? overview.sharpe_ratio.toFixed(2) : "\u2014"}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  {overview && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        overview.sharpe_ratio >= 2
                          ? "bg-emerald-500/10 text-emerald-400"
                          : overview.sharpe_ratio >= 1
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {overview.sharpe_ratio >= 2
                        ? "Excellent"
                        : overview.sharpe_ratio >= 1
                          ? "Good"
                          : "Fair"}
                    </span>
                  )}
                  {overview && overview.max_drawdown > 0 && (
                    <span className="text-[10px] text-rose-400/70">
                      DD {overview.max_drawdown.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Activity ── */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileHover={{
              y: -3,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }}
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-200/80 backdrop-blur-xl">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500" />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
                    <Activity className="h-4 w-4 text-amber-400" />
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Activity
                  </span>
                </div>
                <p className="text-2xl font-bold tracking-tight text-white">
                  {activeStrategies.length}
                  <span className="ml-0.5 text-sm font-normal text-slate-500">
                    /{strategies.length}
                  </span>
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
                    </span>
                    {liveSignals} signals
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Flame className="h-2.5 w-2.5 text-orange-400" />{" "}
                    {overview?.total_trades ?? 0} trades
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Chart + Strategies Row ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Equity Curve ── */}
          <motion.div
            className="lg:col-span-2"
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-2xl border border-white/[0.06] bg-dark-200/80 p-5 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Portfolio Performance
                  </h2>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    Cumulative PnL over time
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-0.5">
                  {([30, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setChartPeriod(d)}
                      className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition-all ${
                        chartPeriod === d
                          ? "bg-white/10 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
              </div>

              {equityCurve.length === 0 ? (
                <div className="flex h-[250px] flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03]">
                    <BarChart3 className="h-6 w-6 text-slate-700" />
                  </div>
                  <p className="text-sm text-slate-500">No equity data yet</p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Start trading to see your performance curve
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart
                    data={equityCurve}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="eqGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={chartColor}
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="100%"
                          stopColor={chartColor}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatChartDate}
                      tick={{ fill: "#475569", fontSize: 10 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatChartValue}
                      tick={{ fill: "#475569", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={72}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cumulative_pnl"
                      stroke={chartColor}
                      strokeWidth={2}
                      fill="url(#eqGrad)"
                      dot={false}
                      activeDot={{
                        r: 4,
                        fill: chartColor,
                        stroke: "#111111",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* ── Active Strategies ── */}
          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-dark-200/80 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">
                  Strategies
                </h2>
                <Link
                  href="/strategies"
                  className="flex items-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-white"
                >
                  All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {strategies.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.03]">
                    <Brain className="h-5 w-5 text-slate-700" />
                  </div>
                  <p className="text-xs text-slate-500">No strategies yet</p>
                  <Link
                    href="/strategies"
                    className="mt-1.5 text-[11px] text-neon hover:underline"
                  >
                    Create your first strategy
                  </Link>
                </div>
              ) : (
                <div className="flex-1 space-y-1.5">
                  {strategies.slice(0, 5).map((s) => {
                    const theme =
                      STRAT_THEME[s.strategy_type] ?? STRAT_THEME.custom;
                    return (
                      <Link
                        key={s.id}
                        href={`/strategies/${s.id}`}
                        className={`group flex items-center gap-3 rounded-xl border-l-2 p-3 transition-colors hover:bg-white/[0.02] ${theme.border}`}
                      >
                        <div
                          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${theme.bg}`}
                        >
                          <Brain className={`h-3.5 w-3.5 ${theme.icon}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-xs font-medium text-white">
                              {s.name}
                            </p>
                            {s.is_active && (
                              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] capitalize text-slate-500">
                            {s.strategy_type} &middot; {s.leverage_limit}x
                          </p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-slate-700 transition-colors group-hover:text-slate-400" />
                      </Link>
                    );
                  })}
                  {strategies.length > 5 && (
                    <Link
                      href="/strategies"
                      className="block pt-2 text-center text-[10px] text-slate-600 transition-colors hover:text-slate-400"
                    >
                      +{strategies.length - 5} more
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Trades + Market Row ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Recent Trades ── */}
          <motion.div
            className="lg:col-span-2"
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-dark-200/80 backdrop-blur-xl">
              <div className="flex items-center justify-between px-5 pb-3 pt-5">
                <h2 className="text-sm font-semibold text-white">
                  Recent Trades
                </h2>
                <Link
                  href="/executions"
                  className="flex items-center gap-1 text-[11px] text-slate-500 transition-colors hover:text-white"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {executions.length === 0 ? (
                <div className="px-5 pb-6 pt-4 text-center">
                  <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                    <Zap className="h-5 w-5 text-slate-700" />
                  </div>
                  <p className="text-xs text-slate-500">No trades yet</p>
                  <p className="mt-0.5 text-[10px] text-slate-600">
                    Activate a strategy to start trading
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.04]">
                        <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-slate-600">
                          Direction
                        </th>
                        <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-slate-600">
                          Entry
                        </th>
                        <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-slate-600">
                          PnL
                        </th>
                        <th className="px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-wider text-slate-600">
                          Status
                        </th>
                        <th className="w-10 px-5 py-2.5 text-right text-[10px] font-medium uppercase tracking-wider text-slate-600" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {executions.slice(0, 5).map((exec) => {
                        const pnl = formatPnl(exec.pnl);
                        const isBuy = exec.direction === "buy";
                        return (
                          <tr
                            key={exec.id}
                            className="transition-colors hover:bg-white/[0.015]"
                          >
                            <td className="px-5 py-3">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold ${
                                  isBuy
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-rose-500/10 text-rose-400"
                                }`}
                              >
                                {isBuy ? (
                                  <ArrowUpRight className="h-3 w-3" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3" />
                                )}
                                {exec.direction.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-5 py-3 font-mono text-xs text-slate-300">
                              {formatCurrency(exec.entry_price)}
                            </td>
                            <td
                              className={`px-5 py-3 text-xs font-semibold ${pnl.color}`}
                            >
                              {pnl.text}
                            </td>
                            <td className="px-5 py-3">
                              <StatusBadge status={exec.status} />
                            </td>
                            <td className="px-5 py-3 text-right">
                              {exec.tx_hash ? (
                                <a
                                  href={`${EXPLORER_TX_URL}${exec.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.03] text-slate-500 transition-all hover:bg-neon/10 hover:text-neon"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-slate-800">
                                  &mdash;
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Market Movers ── */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="h-full rounded-2xl border border-white/[0.06] bg-dark-200/80 p-5 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">
                  Market Movers
                </h2>
                <div className="flex items-center gap-1.5">
                  {connected ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-neon">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon" />
                      </span>
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <WifiOff className="h-2.5 w-2.5" /> Offline
                    </span>
                  )}
                </div>
              </div>

              {marketTokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Wifi className="mb-2 h-5 w-5 text-slate-700" />
                  <p className="text-xs text-slate-500">
                    {connected ? "No movers right now" : "Connecting..."}
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {marketTokens.map((token, i) => {
                    const isUp = token.change24h >= 0;
                    const barWidth = Math.min(
                      Math.abs(token.change24h) * 3,
                      100
                    );
                    return (
                      <motion.div
                        key={token.symbol}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.04 }}
                        className="group flex items-center justify-between rounded-xl px-2.5 py-2.5 transition-colors hover:bg-white/[0.02]"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-[9px] font-bold text-slate-400">
                            {token.symbol.slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white">
                              {token.symbol}
                            </p>
                            <p className="font-mono text-[10px] text-slate-600">
                              {formatPrice(token.midPrice)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <div className="hidden w-12 overflow-hidden rounded-full bg-white/[0.04] sm:block">
                            <div
                              className={`h-1 rounded-full transition-all ${
                                isUp ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span
                            className={`min-w-[52px] text-right text-xs font-semibold tabular-nums ${
                              isUp ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {isUp ? "+" : ""}
                            {formatNumber(token.change24h)}%
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
