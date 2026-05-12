"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, CalendarDays, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import { PageSpinner } from "@/components/ui/Spinner";
import EquityCurveChart from "@/components/charts/EquityCurveChart";
import PerformanceBarChart, { buildChartData } from "@/components/charts/PerformanceBarChart";
import ExchangeSwitcher from "@/components/ui/ExchangeSwitcher";
import useAnalytics from "@/hooks/useAnalytics";
import { cn, formatCurrency } from "@/lib/utils";
import type { Exchange } from "@/types";

// ── Period definitions ──────────────────────────────────────────────

type PeriodKey = "wk" | "1m" | "3m" | "6m" | "1y" | "custom";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "wk", label: "This Week" },
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
  { key: "1y", label: "1Y" },
  { key: "custom", label: "Custom" },
];

/** Returns ISO date string for last Monday (or today if today is Monday) */
function thisMonday(): string {
  const d = new Date();
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

function periodToDays(key: PeriodKey): number {
  return { wk: 7, "1m": 30, "3m": 90, "6m": 180, "1y": 365, custom: 30 }[key];
}

function periodLabel(key: PeriodKey, days: number): string {
  return (
    { wk: "This Week", "1m": "Last 30 Days", "3m": "Last 3 Months", "6m": "Last 6 Months", "1y": "Last Year", custom: `Custom Range` }[key]
  );
}

// ── Main page ───────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { overview, equityCurve, loading, fetchOverview, fetchEquityCurve } = useAnalytics();
  const [period, setPeriod] = useState<PeriodKey>("1m");
  const [exchange, setExchange] = useState<Exchange | "all">("all");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Derived values — all computed before any conditional return to respect Rules of Hooks
  const daily = overview?.daily_performance ?? [];
  const days = periodToDays(period);
  const chartData = useMemo(() => buildChartData(daily, days), [daily, days]);
  const returnPct = overview?.pnl_on_volume_pct ?? 0;
  const returnPositive = returnPct >= 0;
  const exchangeLabel =
    exchange === "all" ? "" :
    exchange === "bybit" ? " (Bybit)" :
    exchange === "binance" ? " (Binance)" : " (HyperLiquid)";

  const fetchForPeriod = (p: PeriodKey, ex: Exchange | "all") => {
    const exch = ex === "all" ? undefined : ex;
    if (p === "wk") {
      fetchOverview({ start_date: thisMonday(), end_date: todayIso(), exchange: exch });
      fetchEquityCurve({ days: 7, exchange: exch });
    } else if (p === "custom") {
      // custom range is applied via the Apply button
    } else {
      const d = periodToDays(p);
      fetchOverview({ days: d, exchange: exch });
      fetchEquityCurve({ days: d, exchange: exch });
    }
  };

  useEffect(() => {
    fetchForPeriod(period, exchange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, exchange]);

  if (loading && !overview) return <PageSpinner />;

  const applyCustomRange = () => {
    if (!customStart || !customEnd) return;
    const exch = exchange === "all" ? undefined : exchange;
    const diffDays = Math.max(
      1,
      Math.ceil((new Date(customEnd).getTime() - new Date(customStart).getTime()) / 86400000) + 1
    );
    fetchOverview({ start_date: customStart, end_date: customEnd, exchange: exch });
    fetchEquityCurve({ days: Math.min(diffDays, 365), exchange: exch });
  };

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-neon" />
              Performance Analytics{exchangeLabel}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {overview?.total_trades ?? 0} closed trades
            </p>
          </div>
          <ExchangeSwitcher active={exchange} onChange={setExchange} size="sm" />
        </div>

        {/* ── Period Tabs ── */}
        <div className="flex flex-wrap items-center gap-1 bg-dark-200/80 border border-white/[0.06] rounded-xl p-1 w-fit">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                period === p.key
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── Custom Range Inputs ── */}
        {period === "custom" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500">Start Date</label>
              <input
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                type="date"
                className="bg-dark-200/80 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500">End Date</label>
              <input
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                type="date"
                className="bg-dark-200/80 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
              />
            </div>
            <button
              onClick={applyCustomRange}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neon/10 border border-neon/20 text-sm text-neon hover:bg-neon/20 transition-colors"
            >
              <CalendarDays className="h-4 w-4" />
              Apply
            </button>
          </motion.div>
        )}

        {/* ── Hero Return Card ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className={cn(
            "rounded-2xl border p-6 bg-dark-200/80 backdrop-blur-sm",
            returnPositive ? "border-neon/20" : "border-red-400/20"
          )}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">
                  Profits — {periodLabel(period, days)}{exchangeLabel}
                </p>
                <p
                  className="text-5xl font-bold tracking-tight mt-2"
                  style={{ color: returnPositive ? "#39FF14" : "#F87171" }}
                >
                  {returnPositive ? "+" : ""}{returnPct.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Return on capital deployed
                </p>
              </div>
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center",
                returnPositive ? "bg-neon/10" : "bg-red-400/10"
              )}>
                {returnPositive
                  ? <TrendingUp className="h-7 w-7 text-neon" />
                  : <TrendingDown className="h-7 w-7 text-red-400" />
                }
              </div>
            </div>

            {/* Trio stats */}
            <div className="mt-5 pt-5 border-t border-white/[0.06] grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Capital Traded</p>
                <p className="text-lg font-semibold text-white mt-1">
                  {formatCurrency(overview?.trade_volume ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Net Profit / Loss</p>
                <p
                  className="text-lg font-semibold mt-1"
                  style={{ color: (overview?.total_pnl ?? 0) >= 0 ? "#39FF14" : "#F87171" }}
                >
                  {(overview?.total_pnl ?? 0) >= 0 ? "+" : ""}
                  {formatCurrency(Math.abs(overview?.total_pnl ?? 0))}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Closed Trades</p>
                <p className="text-lg font-semibold text-white mt-1">
                  {overview?.total_trades ?? 0}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Performance Bar Chart ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlowCard>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white">Performance Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {days <= 31 ? "Daily" : "Weekly"} profit percentage{exchangeLabel}
              </p>
            </div>
            <PerformanceBarChart
              data={chartData}
              height={220}
              label={days <= 31 ? "Daily profit percentage" : "Weekly profit percentage"}
            />
          </GlowCard>
        </motion.div>

        {/* ── Equity Curve ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlowCard>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-neon" />
                Cumulative Profit Trend
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Running total PnL over the selected period
              </p>
            </div>
            <EquityCurveChart data={equityCurve} height={300} />
          </GlowCard>
        </motion.div>

        {/* ── Portfolio Returns (snapshot-based, only when available) ── */}
        {overview?.has_portfolio_history && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlowCard>
              <h2 className="text-base font-semibold text-white mb-4">Portfolio Balance Returns</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Today", value: overview.day_return_pct },
                  { label: "This Week", value: overview.week_return_pct },
                  { label: "This Month", value: overview.month_return_pct },
                  { label: `${overview.period_days}d Return`, value: overview.period_return_pct },
                ].map((r) => {
                  const pos = r.value >= 0;
                  return (
                    <div key={r.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">{r.label}</p>
                      <p className="text-2xl font-bold" style={{ color: r.value === 0 ? "#6b7280" : pos ? "#39FF14" : "#F87171" }}>
                        {pos && r.value !== 0 ? "+" : ""}{r.value.toFixed(2)}%
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-white/[0.05] grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Starting Balance</p>
                  <p className="mt-1 text-sm font-medium text-white">{formatCurrency(overview.starting_balance)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Current Balance</p>
                  <p className="mt-1 text-sm font-medium text-white">{formatCurrency(overview.ending_balance)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Avg Per Trade</p>
                  <p className="mt-1 text-sm font-medium" style={{ color: (overview.avg_trade_pnl ?? 0) >= 0 ? "#39FF14" : "#F87171" }}>
                    {(overview.avg_trade_pnl ?? 0) >= 0 ? "+" : ""}{formatCurrency(Math.abs(overview.avg_trade_pnl ?? 0))}
                  </p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        )}

        {/* ── Advanced Analytics (collapsible) ── */}
        <div className="rounded-xl border border-white/[0.06] bg-dark-200/40 overflow-hidden">
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-white hover:bg-white/[0.02] transition-colors"
          >
            <span className="text-sm font-medium">Advanced Analytics</span>
            {showAdvanced ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
          </button>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-5 pb-5 grid grid-cols-2 lg:grid-cols-3 gap-3 border-t border-white/[0.06]"
            >
              {[
                { label: "Win Rate", value: `${(overview?.win_rate ?? 0).toFixed(1)}%` },
                { label: "Profit Factor", value: `${(overview?.profit_factor ?? 0).toFixed(2)}` },
                { label: "Sharpe Ratio", value: `${(overview?.sharpe_ratio ?? 0).toFixed(2)}` },
                { label: "Max Drawdown", value: `${(overview?.max_drawdown ?? 0).toFixed(2)}%` },
                { label: "Best Trade", value: formatCurrency(overview?.best_trade ?? 0) },
                { label: "Worst Trade", value: formatCurrency(overview?.worst_trade ?? 0) },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-white/[0.06] p-3 mt-3">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">{item.label}</p>
                  <p className="text-white font-semibold mt-1">{item.value}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Empty State ── */}
        {!loading && (overview?.total_trades ?? 0) === 0 && (
          <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Closed Trades Yet{exchangeLabel}</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {exchange === "all"
                ? "Analytics will populate once you have closed trades."
                : `No closed trades on ${exchange === "bybit" ? "Bybit" : exchange === "binance" ? "Binance" : "HyperLiquid"} yet.`
              }
            </p>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
