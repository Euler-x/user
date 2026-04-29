"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
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
  Wallet,
  RefreshCw,
  Play,
  Pause,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { PageSpinner } from "@/components/ui/Spinner";
import StatusBadge from "@/components/ui/StatusBadge";
import Tooltip from "@/components/ui/Tooltip";
import Sparkline from "@/components/charts/Sparkline";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import GettingStartedCard from "@/components/dashboard/GettingStartedCard";
import TickerBar from "@/components/dashboard/TickerBar";
import useStrategies from "@/hooks/useStrategies";
import useSignals from "@/hooks/useSignals";
import useExecutions from "@/hooks/useExecutions";
import useAnalytics from "@/hooks/useAnalytics";
import useMarketData from "@/hooks/useMarketData";
import useWalletBalance from "@/hooks/useWalletBalance";
import useBybitBalance from "@/hooks/useBybitBalance";
import useBilling from "@/hooks/useBilling";
import { useAuthStore } from "@/stores/authStore";
import ExchangeSwitcher from "@/components/ui/ExchangeSwitcher";
import { formatCurrency, formatNumber, formatPnl } from "@/lib/utils";
import type { Exchange } from "@/types";

// ── Palette (on-brand) ──────────────────────────────────────────────

const NEON = "#39FF14";
const CYAN = "#06B6D4";
const PURPLE = "#8B5CF6";
const AMBER = "#F59E0B";
const RED = "#F87171";

const EXPLORER_TX_URL: Record<string, string> = {
  hyperliquid: "https://app.hyperliquid.xyz/explorer/tx/",
  bybit: "https://www.bybit.com/trade/usdt/",
};

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

function SectionLabel({
  children,
  color = "neon",
}: {
  children: React.ReactNode;
  color?: "neon" | "cyan" | "purple" | "amber";
}) {
  const gradients = {
    neon: "from-neon/20 to-transparent",
    cyan: "from-cyan/20 to-transparent",
    purple: "from-purple/20 to-transparent",
    amber: "from-amber/20 to-transparent",
  };
  return (
    <div className="mb-5 flex items-center gap-4">
      <h2 className="whitespace-nowrap font-serif text-lg text-white">
        {children}
      </h2>
      <div
        className={`h-px flex-1 bg-gradient-to-r ${gradients[color]}`}
      />
    </div>
  );
}

function ProgressBar({
  value,
  max = 100,
  color = NEON,
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="h-[3px] w-full rounded-full bg-white/[0.06]">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(to right, ${color}88, ${color})`,
        }}
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
    <div className="rounded-lg border border-white/10 bg-dark-200 px-4 py-2.5 shadow-xl">
      <p className="font-serif text-[10px] text-gray-500">
        {formatChartDate(String(label))}
      </p>
      <p
        className="mt-0.5 font-serif text-sm font-semibold"
        style={{ color: pos ? NEON : RED }}
      >
        {pos ? "+" : ""}
        {formatCurrency(Math.abs(val))}
      </p>
    </div>
  );
}

const STRAT_DOT: Record<string, string> = {
  conservative: "bg-cyan",
  moderate: "bg-purple",
  aggressive: "bg-amber",
  custom: "bg-neon",
};

// Card accent colors per stat
const CARD_ACCENTS = {
  pnl: { border: "border-neon/[0.12]", hoverBorder: "hover:border-neon/25", shadow: "hover:shadow-glow", iconColor: "text-neon/40" },
  winRate: { border: "border-cyan/[0.12]", hoverBorder: "hover:border-cyan/25", shadow: "hover:shadow-glow-cyan", iconColor: "text-cyan/40" },
  sharpe: { border: "border-purple/[0.12]", hoverBorder: "hover:border-purple/25", shadow: "hover:shadow-glow-purple", iconColor: "text-purple/40" },
  activity: { border: "border-amber/[0.12]", hoverBorder: "hover:border-amber/25", shadow: "hover:shadow-glow-amber", iconColor: "text-amber/40" },
};

// ═════════════════════════════════════════════════════════════════════
// ── Dashboard ───────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const {
    strategies,
    fetchStrategies,
    activateStrategy,
    pauseStrategy,
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
  const {
    balance: walletBalance,
    loading: balanceLoading,
    error: balanceError,
    fetchBalance,
  } = useWalletBalance();
  const {
    balance: bybitBalance,
    loading: bybitBalanceLoading,
    error: bybitBalanceError,
    fetchBalance: fetchBybitBalance,
  } = useBybitBalance();

  const { subscription, fetchSubscription } = useBilling();

  const [liveSignals, setLiveSignals] = useState(0);
  const [chartPeriod, setChartPeriod] = useState<30 | 90>(30);
  const [dashExchange, setDashExchange] = useState<Exchange | "all">("all");
  const hasWallet = user?.has_wallet;
  const hasBybit = user?.bybit_configured;

  useEffect(() => {
    fetchStrategies();
    const sigParams: Record<string, unknown> = { page: 1, page_size: 5 };
    const execParams: Record<string, unknown> = { page: 1, page_size: 5 };
    if (dashExchange !== "all") {
      sigParams.exchange = dashExchange;
      execParams.exchange = dashExchange;
    }
    fetchSignals(sigParams).then((d) => d && setLiveSignals(d.total));
    fetchExecutions(execParams);
    fetchSubscription();
    if (hasWallet) {
      fetchBalance();
    }
    if (hasBybit) {
      fetchBybitBalance();
    }
  }, [fetchStrategies, fetchSignals, fetchExecutions, fetchBalance, fetchBybitBalance, fetchSubscription, hasWallet, hasBybit, dashExchange]);

  useEffect(() => {
    const overviewParams: Record<string, unknown> = { days: chartPeriod };
    if (dashExchange !== "all") overviewParams.exchange = dashExchange;
    fetchOverview(chartPeriod, dashExchange !== "all" ? dashExchange : undefined);
    fetchEquityCurve({ days: chartPeriod, ...(dashExchange !== "all" && { exchange: dashExchange }) });
  }, [chartPeriod, dashExchange, fetchOverview, fetchEquityCurve]);

  const loading = stratLoading || sigLoading || execLoading;
  if (loading && strategies.length === 0) return <PageSpinner />;

  const activeStrategies = strategies.filter((s) => s.is_active);
  const totalPnl =
    overview?.total_pnl ??
    executions.reduce((sum, e) => sum + (e.pnl ?? 0), 0);
  const pnlPositive = totalPnl >= 0;
  const totalAllocationPct = activeStrategies.reduce(
    (sum, s) => sum + s.allocation_pct,
    0
  );
  const returnPct = totalAllocationPct > 0 ? (totalPnl / totalAllocationPct) * 100 : 0;
  const chartColor =
    equityCurve.length > 0 &&
    equityCurve[equityCurve.length - 1]?.cumulative_pnl >= 0
      ? NEON
      : RED;
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

  // Ticker items from market data
  const tickerItems = [...topGainers.slice(0, 8), ...topLosers.slice(0, 4)]
    .filter((t) => t.midPrice > 0)
    .map((t) => ({
      symbol: t.symbol,
      price: t.midPrice,
      change: t.change24h ?? 0,
    }));

  // Sparkline data from equity curve
  const pnlSparkline = equityCurve.map((p) => p.cumulative_pnl);

  const isSubscribed = subscription?.status === "active" || subscription?.status === "expiring_soon";

  return (
    <PageTransition>
      <div className="relative space-y-8">
        {/* ── Ambient glow ── */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-neon/[0.015] blur-[150px]" />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Header ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gray-600">
            Welcome Back
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-white">
            {getGreeting()}
            {userName ? `, ${userName}` : ""}
          </h1>
          <div className="mx-auto mt-3 flex max-w-xs items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon/15" />
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600">
              {dateStr}
            </p>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon/15" />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link
              href="/strategies"
              className="inline-flex items-center gap-2 rounded-lg border border-neon/15 px-4 py-2 text-xs text-neon transition-all duration-300 hover:border-neon/30 hover:bg-neon/[0.04]"
            >
              <Plus className="h-3.5 w-3.5" /> New Strategy
            </Link>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs text-gray-400 transition-colors duration-300 hover:text-white"
            >
              <BarChart3 className="h-3.5 w-3.5" /> Analytics
            </Link>
          </div>
        </motion.div>

        {/* ── Welcome + Onboarding ── */}
        <WelcomeBanner />
        <GettingStartedCard
          emailVerified={user?.email_verified ?? false}
          hasWallet={!!hasWallet}
          isSubscribed={!!isSubscribed}
          strategyCount={strategies.length}
          executionCount={executions.length}
        />

        {/* ── Market Ticker ── */}
        <TickerBar items={tickerItems} />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Exchange Switcher + Wallet Balances ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {(hasWallet || hasBybit) && (
          <motion.div custom={0} variants={fadeIn} initial="hidden" animate="show" className="space-y-4">
            <div className="flex items-center justify-between">
              <SectionLabel>Account Balances</SectionLabel>
              <ExchangeSwitcher active={dashExchange} onChange={setDashExchange} showAll={hasWallet && hasBybit} />
            </div>

            <div className={`grid gap-4 ${hasWallet && hasBybit && dashExchange === "all" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
              {/* HL Balance */}
              {hasWallet && (dashExchange === "all" || dashExchange === "hyperliquid") && (
                <div className="rounded-xl border border-neon/[0.12] bg-dark-200/80 p-5 backdrop-blur-sm transition-all duration-500 hover:border-neon/25 hover:shadow-glow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <img src="https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120519/hyprliquid_orr9vl.webp" alt="HL" className="h-6 w-6 rounded-md" />
                      <div>
                        <p className="text-xs font-semibold text-white">HyperLiquid</p>
                        {walletBalance?.wallet_address_masked && (
                          <p className="font-mono text-[9px] text-gray-600">{walletBalance.wallet_address_masked}</p>
                        )}
                      </div>
                    </div>
                    <button onClick={fetchBalance} disabled={balanceLoading} className="rounded-md p-1.5 text-gray-600 hover:bg-white/[0.04] hover:text-gray-400 disabled:opacity-50">
                      <RefreshCw className={`h-3 w-3 ${balanceLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  {balanceLoading && !walletBalance ? (
                    <div className="flex justify-center py-4"><div className="h-4 w-4 animate-spin rounded-full border-2 border-neon/20 border-t-neon/60" /></div>
                  ) : walletBalance ? (
                    <>
                      <p className="font-serif text-2xl font-semibold tracking-tight text-white">{formatCurrency(walletBalance.total_balance)}</p>
                      <div className="my-3 h-px bg-white/[0.06]" />
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                        <div><p className="text-[9px] uppercase tracking-wider text-gray-600">Equity</p><p className="mt-0.5 text-xs font-medium text-white">{formatCurrency(walletBalance.account_equity)}</p></div>
                        <div><p className="text-[9px] uppercase tracking-wider text-gray-600">Available</p><p className="mt-0.5 text-xs font-medium text-white">{formatCurrency(walletBalance.available_balance)}</p></div>
                        <div><p className="text-[9px] uppercase tracking-wider text-gray-600">Unrealized PnL</p><p className="mt-0.5 text-xs font-medium" style={{ color: walletBalance.unrealized_pnl >= 0 ? NEON : RED }}>{walletBalance.unrealized_pnl >= 0 ? "+" : ""}{formatCurrency(walletBalance.unrealized_pnl)}</p></div>
                        <div><p className="text-[9px] uppercase tracking-wider text-gray-600">Positions</p><p className="mt-0.5 text-xs font-medium text-white">{walletBalance.open_positions} <span className="text-[9px] text-gray-600">open</span></p></div>
                      </div>
                    </>
                  ) : balanceError ? (
                    <p className="text-xs text-gray-500 py-2">Unable to sync balance</p>
                  ) : null}
                </div>
              )}

              {/* Bybit Balance */}
              {hasBybit && (dashExchange === "all" || dashExchange === "bybit") && (
                <div className="rounded-xl border border-orange-500/[0.12] bg-dark-200/80 p-5 backdrop-blur-sm transition-all duration-500 hover:border-orange-500/25">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <img src="https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120520/bybit_obnhd8.webp" alt="Bybit" className="h-6 w-6 rounded-md" />
                      <div>
                        <p className="text-xs font-semibold text-white">Bybit {bybitBalance?.testnet ? <span className="text-[9px] text-orange-400">(Testnet)</span> : ""}</p>
                        {bybitBalance?.api_key_masked && (
                          <p className="font-mono text-[9px] text-gray-600">{bybitBalance.api_key_masked}</p>
                        )}
                      </div>
                    </div>
                    <button onClick={fetchBybitBalance} disabled={bybitBalanceLoading} className="rounded-md p-1.5 text-gray-600 hover:bg-white/[0.04] hover:text-gray-400 disabled:opacity-50">
                      <RefreshCw className={`h-3 w-3 ${bybitBalanceLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  {bybitBalanceLoading && !bybitBalance ? (
                    <div className="flex justify-center py-4"><div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-400/20 border-t-orange-400/60" /></div>
                  ) : bybitBalance?.connected ? (
                    <>
                      <p className="font-serif text-2xl font-semibold tracking-tight text-white">{formatCurrency(bybitBalance.total_balance)}</p>
                      <div className="my-3 h-px bg-white/[0.06]" />
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                        <div><p className="text-[9px] uppercase tracking-wider text-gray-600">Equity</p><p className="mt-0.5 text-xs font-medium text-white">{formatCurrency(bybitBalance.account_equity)}</p></div>
                        <div><p className="text-[9px] uppercase tracking-wider text-gray-600">Available</p><p className="mt-0.5 text-xs font-medium text-white">{formatCurrency(bybitBalance.available_balance)}</p></div>
                        <div><p className="text-[9px] uppercase tracking-wider text-gray-600">Unrealized PnL</p><p className="mt-0.5 text-xs font-medium" style={{ color: bybitBalance.unrealized_pnl >= 0 ? NEON : RED }}>{bybitBalance.unrealized_pnl >= 0 ? "+" : ""}{formatCurrency(bybitBalance.unrealized_pnl)}</p></div>
                        <div><p className="text-[9px] uppercase tracking-wider text-gray-600">Positions</p><p className="mt-0.5 text-xs font-medium text-white">{bybitBalance.open_positions} <span className="text-[9px] text-gray-600">open</span></p></div>
                      </div>
                    </>
                  ) : bybitBalanceError ? (
                    <p className="text-xs text-gray-500 py-2">Unable to sync balance</p>
                  ) : null}
                </div>
              )}
            </div>
          </motion.div>
        )}

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
            <div className={`rounded-xl ${CARD_ACCENTS.pnl.border} bg-dark-200/80 p-6 backdrop-blur-sm transition-all duration-500 ${CARD_ACCENTS.pnl.hoverBorder} ${CARD_ACCENTS.pnl.shadow}`}>
              <div className="flex items-center justify-between">
                <Tooltip content="Net profit/loss across all strategies for the selected period" placement="right">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 cursor-help">
                    Total PnL
                  </p>
                </Tooltip>
                {pnlSparkline.length >= 2 && (
                  <Sparkline data={pnlSparkline} color={pnlPositive ? NEON : RED} />
                )}
              </div>
              <p
                className="mt-3 font-serif text-2xl font-semibold tracking-tight lg:text-3xl"
                style={{ color: pnlPositive ? NEON : RED }}
              >
                {pnlPositive ? "+" : ""}
                {formatCurrency(totalPnl)}
              </p>
              <div className="my-3 h-px bg-white/[0.06]" />
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center gap-1 text-[11px] font-medium"
                  style={{ color: pnlPositive ? NEON : RED }}
                >
                  {pnlPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {returnPct >= 0 ? "+" : ""}
                  {returnPct.toFixed(1)}%
                </span>
                <span className="text-[10px] text-gray-700">&middot;</span>
                <span className="text-[10px] text-gray-600">
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
            <div className={`rounded-xl ${CARD_ACCENTS.winRate.border} bg-dark-200/80 p-6 backdrop-blur-sm transition-all duration-500 ${CARD_ACCENTS.winRate.hoverBorder} ${CARD_ACCENTS.winRate.shadow}`}>
              <Tooltip content="Percentage of trades that closed with a positive PnL" placement="bottom">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 cursor-help">
                  Win Rate
                </p>
              </Tooltip>
              <p className="mt-3 font-serif text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                {overview ? `${overview.win_rate.toFixed(1)}%` : "\u2014"}
              </p>
              <div className="my-3">
                <ProgressBar
                  value={overview?.win_rate ?? 0}
                  color={CYAN}
                />
              </div>
              <div className="flex items-center gap-2">
                {overview && overview.profit_factor > 0 && (
                  <span className="text-[11px] text-gray-500">
                    Profit Factor{" "}
                    <span className="text-cyan">
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
            <div className={`rounded-xl ${CARD_ACCENTS.sharpe.border} bg-dark-200/80 p-6 backdrop-blur-sm transition-all duration-500 ${CARD_ACCENTS.sharpe.hoverBorder} ${CARD_ACCENTS.sharpe.shadow}`}>
              <Tooltip content="Risk-adjusted return. Above 1.0 is favorable, above 2.0 is exceptional" placement="bottom">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 cursor-help">
                  Sharpe Ratio
                </p>
              </Tooltip>
              <p className="mt-3 font-serif text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                {overview ? overview.sharpe_ratio.toFixed(2) : "\u2014"}
              </p>
              <div className="my-3 h-px bg-white/[0.06]" />
              <div className="flex items-center gap-2">
                {overview && (
                  <span className="text-[11px] italic text-purple-400">
                    {overview.sharpe_ratio >= 2
                      ? "Exceptional"
                      : overview.sharpe_ratio >= 1
                        ? "Favorable"
                        : "Developing"}
                  </span>
                )}
                {overview && overview.max_drawdown > 0 && (
                  <>
                    <span className="text-[10px] text-gray-700">
                      &middot;
                    </span>
                    <span className="text-[10px] text-red-400">
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
            <div className={`rounded-xl ${CARD_ACCENTS.activity.border} bg-dark-200/80 p-6 backdrop-blur-sm transition-all duration-500 ${CARD_ACCENTS.activity.hoverBorder} ${CARD_ACCENTS.activity.shadow}`}>
              <Tooltip content="Active strategies vs total. Includes live signals and recent trades" placement="bottom">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 cursor-help">
                  Activity
                </p>
              </Tooltip>
              <p className="mt-3 font-serif text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                {activeStrategies.length}
                <span className="ml-1 font-sans text-sm font-normal text-gray-600">
                  / {strategies.length}
                </span>
              </p>
              <div className="my-3 h-px bg-white/[0.06]" />
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Zap className="h-2.5 w-2.5 text-amber/50" />
                  {liveSignals} signals
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <Activity className="h-2.5 w-2.5 text-amber/50" />
                  {overview?.total_trades ?? 0} trades
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── Portfolio Returns ── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {overview?.has_portfolio_history && (
          <motion.div
            custom={3.5}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="rounded-xl border border-white/[0.06] bg-dark-200/80 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-5">
                <SectionLabel color="neon">Portfolio Returns</SectionLabel>
                <span className="text-[9px] uppercase tracking-widest text-gray-600">
                  vs. balance snapshots
                </span>
              </div>

              {/* Return percentages */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { label: "24h", value: overview.day_return_pct },
                  { label: "7d", value: overview.week_return_pct },
                  { label: "30d", value: overview.month_return_pct },
                ].map((r) => {
                  const pos = r.value >= 0;
                  return (
                    <div
                      key={r.label}
                      className="rounded-lg bg-dark-300/60 p-4 text-center border border-white/[0.04]"
                    >
                      <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-1.5">
                        {r.label}
                      </p>
                      <p
                        className="font-serif text-xl font-semibold tracking-tight"
                        style={{ color: pos ? NEON : RED }}
                      >
                        {pos ? "+" : ""}
                        {r.value.toFixed(2)}%
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Balance comparison + volume */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-600">
                    Starting Balance
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    {formatCurrency(overview.starting_balance)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-600">
                    Current Balance
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    {formatCurrency(overview.ending_balance)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-gray-600">
                    Trade Volume
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-white">
                    {formatCurrency(overview.trade_volume)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
            <div className="rounded-xl border border-white/[0.06] bg-dark-200/80 p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <SectionLabel>Portfolio Performance</SectionLabel>
                <div className="flex items-center">
                  {([30, 90] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setChartPeriod(d)}
                      className={`border-b-2 px-3 py-1.5 text-[11px] font-medium tracking-wider transition-all duration-300 ${
                        chartPeriod === d
                          ? "border-neon/40 text-neon"
                          : "border-transparent text-gray-600 hover:text-gray-400"
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
              </div>

              {equityCurve.length === 0 ? (
                <div className="flex h-[260px] flex-col items-center justify-center text-center">
                  <BarChart3 className="mb-3 h-8 w-8 text-gray-700" />
                  <p className="font-serif text-sm text-gray-500">
                    No equity data yet
                  </p>
                  <p className="mt-1 text-[11px] text-gray-600">
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
                        id="chartGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={chartColor}
                          stopOpacity={0.15}
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
                      stroke="rgba(255,255,255,0.03)"
                    />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={formatChartDate}
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatChartValue}
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      width={72}
                    />
                    <RechartsTooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="cumulative_pnl"
                      stroke={chartColor}
                      strokeWidth={1.5}
                      fill="url(#chartGrad)"
                      dot={false}
                      activeDot={{
                        r: 3.5,
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

          {/* ── Strategies ── */}
          <motion.div
            custom={5}
            variants={fadeIn}
            initial="hidden"
            animate="show"
          >
            <div className="flex h-full flex-col rounded-xl border border-white/[0.06] bg-dark-200/80 p-6 backdrop-blur-sm">
              <SectionLabel color="cyan">Strategies</SectionLabel>

              {strategies.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                  <Brain className="mb-3 h-7 w-7 text-gray-700" />
                  <p className="font-serif text-sm text-gray-500">
                    No strategies yet
                  </p>
                  <Link
                    href="/strategies"
                    className="mt-2 text-[11px] text-neon/70 transition-colors duration-300 hover:text-neon"
                  >
                    Create your first strategy
                  </Link>
                </div>
              ) : (
                <div className="flex-1">
                  {strategies.slice(0, 5).map((s, i) => {
                    const dot = STRAT_DOT[s.strategy_type] ?? "bg-neon";
                    return (
                      <Link
                        key={s.id}
                        href={`/strategies/${s.id}`}
                        className={`group flex items-center justify-between py-3.5 transition-colors duration-300 hover:bg-white/[0.02] ${
                          i < Math.min(strategies.length, 5) - 1
                            ? "border-b border-white/[0.05]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2 w-2 flex-shrink-0 rounded-full ${dot}`}
                          />
                          <div>
                            <p className="text-sm text-white">{s.name}</p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-600">
                              {s.strategy_type}
                              {s.is_active && (
                                <span className="ml-2 normal-case tracking-normal text-neon/50">
                                  &bull; Active
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tooltip content={s.is_active ? "Pause strategy" : "Activate strategy"} placement="left">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                s.is_active ? pauseStrategy(s.id) : activateStrategy(s.id);
                              }}
                              className="p-1 rounded-md hover:bg-white/5 transition-colors"
                            >
                              {s.is_active ? (
                                <Pause className="h-3 w-3 text-amber-400" />
                              ) : (
                                <Play className="h-3 w-3 text-neon" />
                              )}
                            </button>
                          </Tooltip>
                          <ChevronRight className="h-3.5 w-3.5 text-gray-700 transition-colors duration-300 group-hover:text-gray-500" />
                        </div>
                      </Link>
                    );
                  })}
                  {strategies.length > 5 && (
                    <Link
                      href="/strategies"
                      className="mt-3 block text-center text-[10px] text-gray-600 transition-colors duration-300 hover:text-gray-400"
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
            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-dark-200/80 backdrop-blur-sm">
              <div className="p-6 pb-4">
                <SectionLabel color="purple">Recent Trades</SectionLabel>
              </div>

              {executions.length === 0 ? (
                <div className="px-6 pb-8 pt-2 text-center">
                  <Zap className="mx-auto mb-3 h-7 w-7 text-gray-700" />
                  <p className="font-serif text-sm text-gray-500">
                    No trades recorded
                  </p>
                  <p className="mt-1 text-[11px] text-gray-600">
                    Activate a strategy to begin
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-gray-600">
                          Direction
                        </th>
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-gray-600">
                          Entry
                        </th>
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-gray-600">
                          PnL
                        </th>
                        <th className="px-6 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-gray-600">
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
                            className="border-b border-white/[0.03] transition-colors duration-300 hover:bg-white/[0.02]"
                          >
                            <td className="px-6 py-3.5">
                              <span
                                className="text-xs font-medium uppercase tracking-wider"
                                style={{ color: isBuy ? NEON : RED }}
                              >
                                {exec.direction}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 font-mono text-xs text-gray-400">
                              {formatCurrency(exec.entry_price)}
                            </td>
                            <td
                              className="px-6 py-3.5 font-serif text-xs font-medium"
                              style={{
                                color:
                                  exec.pnl == null
                                    ? "#6b7280"
                                    : exec.pnl >= 0
                                      ? NEON
                                      : RED,
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
                                  href={`${EXPLORER_TX_URL[exec.exchange || "hyperliquid"]}${exec.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-600 transition-colors duration-300 hover:text-neon"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              ) : (
                                <span className="text-gray-800">&mdash;</span>
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
                      className="text-[11px] text-gray-600 transition-colors duration-300 hover:text-neon"
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
            <div className="h-full rounded-xl border border-white/[0.06] bg-dark-200/80 p-6 backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <SectionLabel color="amber">Market</SectionLabel>
                <span className="flex items-center gap-1.5 text-[10px]">
                  {connected ? (
                    <span className="flex items-center gap-1.5 text-neon/60">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon/60" />
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-700">
                      <WifiOff className="h-2.5 w-2.5" />
                    </span>
                  )}
                </span>
              </div>

              {marketTokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Wifi className="mb-2 h-5 w-5 text-gray-700" />
                  <p className="text-xs text-gray-600">
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
                            ? "border-b border-white/[0.04]"
                            : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white">
                            {token.symbol}
                          </p>
                          <p className="font-mono text-[10px] text-gray-700">
                            {formatPrice(token.midPrice)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className="text-xs font-medium tabular-nums"
                            style={{ color: isUp ? NEON : RED }}
                          >
                            {isUp ? "+" : ""}
                            {formatNumber(token.change24h)}%
                          </span>
                          <p className="text-[9px] text-gray-700">
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
