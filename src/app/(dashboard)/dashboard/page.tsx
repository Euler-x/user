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

// ── Palette ─────────────────────────────────────────────────────────

const GOLD = "#C9A96E";
const SAGE = "#6B8F71";
const WINE = "#9B5858";

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
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
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

// ── Animation ───────────────────────────────────────────────────────

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" },
  }),
};

// ── Sub-components ──────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <h2 className="whitespace-nowrap font-serif text-lg text-cream">
        {children}
      </h2>
      <div className="h-px flex-1 bg-gradient-to-r from-gold/15 to-transparent" />
    </div>
  );
}

function GoldBar({
  value,
  max = 100,
}: {
  value: number;
  max?: number;
}) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="h-[3px] w-full rounded-full bg-[#1E1C18]">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
      />
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value as number;
  const pos = val >= 0;
  return (
    <div className="rounded-lg border border-gold/10 bg-[#1A1714] px-4 py-2.5 shadow-xl">
      <p className="font-serif text-[10px] text-[#8A8578]">
        {formatChartDate(String(label))}
      </p>
      <p
        className="mt-0.5 font-serif text-sm font-semibold"
        style={{ color: pos ? GOLD : WINE }}
      >
        {pos ? "+" : ""}
        {formatCurrency(Math.abs(val))}
      </p>
    </div>
  );
}

const STRAT_DOT: Record<string, string> = {
  conservative: "bg-[#6B7FA5]",
  moderate: "bg-[#8A7BAD]",
  aggressive: "bg-[#9B5858]",
  custom: "bg-gold",
};

// ═════════════════════════════════════════════════════════════════════
// ── Dashboard ───────────────────────────────────────────────────────
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

  useEffect(() => {
    fetchStrategies();
    fetchSignals({ page: 1, page_size: 5 }).then(
      (d) => d && setLiveSignals(d.total)
    );
    fetchExecutions({ page: 1, page_size: 5 });
  }, [fetchStrategies, fetchSignals, fetchExecutions]);

  useEffect(() => {
    fetchOverview(chartPeriod);
    fetchEquityCurve({ days: chartPeriod });
  }, [chartPeriod, fetchOverview, fetchEquityCurve]);

  const loading = stratLoading || sigLoading || execLoading;
  if (loading && strategies.length === 0) return <PageSpinner />;

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
      ? GOLD
      : WINE;
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
      <div className="relative space-y-8">
        {/* ── Warm ambient glow ── */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gold/[0.02] blur-[150px]" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Header ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#5C574D]">
            Welcome Back
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-cream">
            {getGreeting()}
            {userName ? `, ${userName}` : ""}
          </h1>
          <div className="mx-auto mt-3 flex max-w-xs items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/20" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#5C574D]">
              {dateStr}
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/20" />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/strategies"
              className="inline-flex items-center gap-2 rounded-lg border border-gold/15 px-4 py-2 text-xs text-gold transition-all duration-300 hover:border-gold/30 hover:bg-gold/[0.04]"
            >
              <Plus className="h-3.5 w-3.5" /> New Strategy
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-[#8A8578] transition-colors duration-300 hover:text-cream"
            >
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Link>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Stat Cards ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* ── Total PnL ── */}
          <motion.div
            custom={0}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-xl border border-gold/[0.08] bg-[#13110F]/90 p-6 backdrop-blur-sm transition-all duration-500 hover:border-gold/[0.18] hover:shadow-gold-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8A8578]">
                Total PnL
              </p>
              <p
                className="mt-3 font-serif text-2xl font-semibold tracking-tight lg:text-3xl"
                style={{ color: pnlPositive ? GOLD : WINE }}
              >
                {pnlPositive ? "+" : ""}
                {formatCurrency(totalPnl)}
              </p>
              <div className="my-3 h-px bg-gold/[0.08]" />
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: pnlPositive ? SAGE : WINE }}
                >
                  {pnlPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {returnPct >= 0 ? "+" : ""}
                  {returnPct.toFixed(1)}%
                </span>
                <span className="text-[10px] text-[#3A3530]">&middot;</span>
                <span className="text-[10px] text-[#5C574D]">
                  {chartPeriod} days
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── Win Rate ── */}
          <motion.div
            custom={1}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-xl border border-gold/[0.08] bg-[#13110F]/90 p-6 backdrop-blur-sm transition-all duration-500 hover:border-gold/[0.18] hover:shadow-gold-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8A8578]">
                Win Rate
              </p>
              <p className="mt-3 font-serif text-2xl font-semibold tracking-tight text-cream lg:text-3xl">
                {overview ? `${overview.win_rate.toFixed(1)}%` : "\u2014"}
              </p>
              <div className="my-3">
                <GoldBar value={overview?.win_rate ?? 0} />
              </div>
              <div className="flex items-center gap-2">
                {overview && overview.profit_factor > 0 && (
                  <span className="text-[11px] text-[#8A8578]">
                    Profit Factor{" "}
                    <span className="text-gold">
                      {overview.profit_factor.toFixed(2)}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Sharpe Ratio ── */}
          <motion.div
            custom={2}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-xl border border-gold/[0.08] bg-[#13110F]/90 p-6 backdrop-blur-sm transition-all duration-500 hover:border-gold/[0.18] hover:shadow-gold-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8A8578]">
                Sharpe Ratio
              </p>
              <p className="mt-3 font-serif text-2xl font-semibold tracking-tight text-cream lg:text-3xl">
                {overview ? overview.sharpe_ratio.toFixed(2) : "\u2014"}
              </p>
              <div className="my-3 h-px bg-gold/[0.08]" />
              <div className="flex items-center gap-2">
                {overview && (
                  <span className="text-[11px] italic text-gold/60">
                    {overview.sharpe_ratio >= 2
                      ? "Exceptional"
                      : overview.sharpe_ratio >= 1
                        ? "Favorable"
                        : "Developing"}
                  </span>
                )}
                {overview && overview.max_drawdown > 0 && (
                  <>
                    <span className="text-[10px] text-[#3A3530]">
                      &middot;
                    </span>
                    <span className="text-[10px]" style={{ color: WINE }}>
                      DD {overview.max_drawdown.toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Activity ── */}
          <motion.div
            custom={3}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-xl border border-gold/[0.08] bg-[#13110F]/90 p-6 backdrop-blur-sm transition-all duration-500 hover:border-gold/[0.18] hover:shadow-gold-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8A8578]">
                Activity
              </p>
              <p className="mt-3 font-serif text-2xl font-semibold tracking-tight text-cream lg:text-3xl">
                {activeStrategies.length}
                <span className="ml-1 font-sans text-sm font-normal text-[#5C574D]">
                  / {strategies.length}
                </span>
              </p>
              <div className="my-3 h-px bg-gold/[0.08]" />
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-[#8A8578]">
                  <Zap className="h-2.5 w-2.5 text-gold/50" />
                  {liveSignals} signals
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-[#8A8578]">
                  <Activity className="h-2.5 w-2.5 text-gold/50" />
                  {overview?.total_trades ?? 0} trades
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Chart + Strategies ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Equity Curve ── */}
          <motion.div
            className="lg:col-span-2"
            custom={4}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-xl border border-gold/[0.08] bg-[#13110F]/90 p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <SectionLabel>Portfolio Performance</SectionLabel>
                <div className="flex items-center">
                  {([30, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setChartPeriod(d)}
                      className={`border-b-2 px-3 py-1.5 text-[11px] font-medium tracking-wider transition-all duration-300 ${
                        chartPeriod === d
                          ? "border-gold/40 text-gold"
                          : "border-transparent text-[#5C574D] hover:text-[#8A8578]"
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
              </div>

              {equityCurve.length === 0 ? (
                <div className="flex h-[260px] flex-col items-center justify-center text-center">
                  <BarChart3 className="mb-3 h-8 w-8 text-[#2A2520]" />
                  <p className="font-serif text-sm text-[#5C574D]">
                    No equity data yet
                  </p>
                  <p className="mt-1 text-[11px] text-[#3A3530]">
                    Begin trading to chart your journey
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={equityCurve}
                    margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="vintageGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={chartColor}
                          stopOpacity={0.12}
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
                      stroke="rgba(201,169,110,0.04)"
                    />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatChartDate}
                      tick={{ fill: "#5C574D", fontSize: 10 }}
                      axisLine={{ stroke: "rgba(201,169,110,0.08)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatChartValue}
                      tick={{ fill: "#5C574D", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={72}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cumulative_pnl"
                      stroke={chartColor}
                      strokeWidth={1.5}
                      fill="url(#vintageGrad)"
                      dot={false}
                      activeDot={{
                        r: 3.5,
                        fill: chartColor,
                        stroke: "#13110F",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          {/* ── Strategies ── */}
          <motion.div
            custom={5}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="flex h-full flex-col rounded-xl border border-gold/[0.08] bg-[#13110F]/90 p-6 backdrop-blur-sm">
              <SectionLabel>Strategies</SectionLabel>

              {strategies.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                  <Brain className="mb-3 h-7 w-7 text-[#2A2520]" />
                  <p className="font-serif text-sm text-[#5C574D]">
                    No strategies yet
                  </p>
                  <Link
                    href="/strategies"
                    className="mt-2 text-[11px] text-gold/70 transition-colors duration-300 hover:text-gold"
                  >
                    Create your first strategy
                  </Link>
                </div>
              ) : (
                <div className="flex-1">
                  {strategies.slice(0, 5).map((s, i) => {
                    const dot = STRAT_DOT[s.strategy_type] ?? "bg-gold";
                    return (
                      <Link
                        key={s.id}
                        href={`/strategies/${s.id}`}
                        className={`group flex items-center justify-between py-3.5 transition-colors duration-300 hover:bg-gold/[0.02] ${
                          i < Math.min(strategies.length, 5) - 1
                            ? "border-b border-gold/[0.06]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2 w-2 flex-shrink-0 rounded-full ${dot}`}
                          />
                          <div>
                            <p className="text-sm text-cream">{s.name}</p>
                            <p className="text-[10px] uppercase tracking-wider text-[#5C574D]">
                              {s.strategy_type}
                              {s.is_active && (
                                <span className="ml-2 normal-case tracking-normal text-gold/50">
                                  &bull; Active
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-[#2A2520] transition-colors duration-300 group-hover:text-[#5C574D]" />
                      </Link>
                    );
                  })}
                  {strategies.length > 5 && (
                    <Link
                      href="/strategies"
                      className="mt-3 block text-center text-[10px] text-[#5C574D] transition-colors duration-300 hover:text-[#8A8578]"
                    >
                      View all {strategies.length} strategies
                    </Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Trades + Market ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Recent Trades ── */}
          <motion.div
            className="lg:col-span-2"
            custom={6}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="overflow-hidden rounded-xl border border-gold/[0.08] bg-[#13110F]/90 backdrop-blur-sm">
              <div className="p-6 pb-4">
                <SectionLabel>Recent Trades</SectionLabel>
              </div>

              {executions.length === 0 ? (
                <div className="px-6 pb-8 pt-2 text-center">
                  <Zap className="mx-auto mb-3 h-7 w-7 text-[#2A2520]" />
                  <p className="font-serif text-sm text-[#5C574D]">
                    No trades recorded
                  </p>
                  <p className="mt-1 text-[11px] text-[#3A3530]">
                    Activate a strategy to begin
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/[0.06]">
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-[#5C574D]">
                          Direction
                        </th>
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-[#5C574D]">
                          Entry
                        </th>
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-[#5C574D]">
                          PnL
                        </th>
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-[#5C574D]">
                          Status
                        </th>
                        <th className="w-10 px-6 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {executions.slice(0, 5).map((exec) => {
                        const pnl = formatPnl(exec.pnl);
                        const isBuy = exec.direction === "buy";
                        return (
                          <tr
                            key={exec.id}
                            className="border-b border-gold/[0.04] transition-colors duration-300 hover:bg-gold/[0.02]"
                          >
                            <td className="px-6 py-3.5">
                              <span
                                className="text-xs font-medium uppercase tracking-wider"
                                style={{ color: isBuy ? SAGE : WINE }}
                              >
                                {exec.direction}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 font-mono text-xs text-[#8A8578]">
                              {formatCurrency(exec.entry_price)}
                            </td>
                            <td
                              className="px-6 py-3.5 font-serif text-xs font-medium"
                              style={{
                                color:
                                  exec.pnl == null
                                    ? "#5C574D"
                                    : exec.pnl >= 0
                                      ? SAGE
                                      : WINE,
                              }}
                            >
                              {pnl.text}
                            </td>
                            <td className="px-6 py-3.5">
                              <StatusBadge status={exec.status} />
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              {exec.tx_hash ? (
                                <a
                                  href={`${EXPLORER_TX_URL}${exec.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#3A3530] transition-colors duration-300 hover:text-gold"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              ) : (
                                <span className="text-[#1E1C18]">&mdash;</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="px-6 py-3 text-right">
                    <Link
                      href="/executions"
                      className="text-[11px] text-[#5C574D] transition-colors duration-300 hover:text-gold"
                    >
                      View all trades &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Market Movers ── */}
          <motion.div
            custom={7}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="h-full rounded-xl border border-gold/[0.08] bg-[#13110F]/90 p-6 backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <SectionLabel>Market</SectionLabel>
                <span className="flex items-center gap-1.5 text-[10px]">
                  {connected ? (
                    <span className="flex items-center gap-1.5 text-gold/60">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold/60" />
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#3A3530]">
                      <WifiOff className="h-2.5 w-2.5" />
                    </span>
                  )}
                </span>
              </div>

              {marketTokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Wifi className="mb-2 h-5 w-5 text-[#2A2520]" />
                  <p className="text-xs text-[#5C574D]">
                    {connected ? "No movers" : "Connecting\u2026"}
                  </p>
                </div>
              ) : (
                <div>
                  {marketTokens.map((token, i) => {
                    const isUp = token.change24h >= 0;
                    return (
                      <motion.div
                        key={token.symbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.06, duration: 0.6 }}
                        className={`flex items-center justify-between py-2.5 ${
                          i < marketTokens.length - 1
                            ? "border-b border-gold/[0.04]"
                            : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-cream">
                            {token.symbol}
                          </p>
                          <p className="font-mono text-[10px] text-[#3A3530]">
                            {formatPrice(token.midPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-xs font-medium tabular-nums"
                            style={{ color: isUp ? SAGE : WINE }}
                          >
                            {isUp ? "+" : ""}
                            {formatNumber(token.change24h)}%
                          </span>
                          <p className="text-[9px] text-[#3A3530]">
                            {formatCompact(token.dayNtlVlm)}
                          </p>
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
