"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import EquityCurveChart from "@/components/charts/EquityCurveChart";
import GlowCard from "@/components/ui/GlowCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { PageSpinner } from "@/components/ui/Spinner";
import useStrategies from "@/hooks/useStrategies";
import useSignals from "@/hooks/useSignals";
import useExecutions from "@/hooks/useExecutions";
import useAnalytics from "@/hooks/useAnalytics";
import useMarketData from "@/hooks/useMarketData";
import { formatCurrency, formatNumber, formatPnl } from "@/lib/utils";

const EXPLORER_TX_URL = "https://app.hyperliquid.xyz/explorer/tx/";

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

export default function DashboardPage() {
  const { strategies, fetchStrategies, loading: strategiesLoading } = useStrategies();
  const { fetchSignals, loading: signalsLoading } = useSignals();
  const { executions, fetchExecutions, loading: execLoading } = useExecutions();
  const { overview, equityCurve, fetchOverview, fetchEquityCurve } = useAnalytics();
  const { topGainers, connected } = useMarketData();
  const [liveSignals, setLiveSignals] = useState(0);

  useEffect(() => {
    fetchStrategies();
    fetchSignals({ page: 1, page_size: 5 }).then((d) => d && setLiveSignals(d.total));
    fetchExecutions({ page: 1, page_size: 5 });
    fetchOverview(30);
    fetchEquityCurve({ days: 30 });
  }, [fetchStrategies, fetchSignals, fetchExecutions, fetchOverview, fetchEquityCurve]);

  const loading = strategiesLoading || signalsLoading || execLoading;
  if (loading && strategies.length === 0) return <PageSpinner />;

  const activeStrategies = strategies.filter((s) => s.is_active);
  const totalPnl = overview?.total_pnl ?? executions.reduce((sum, e) => sum + (e.pnl ?? 0), 0);
  const pnlPositive = totalPnl >= 0;

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">{getGreeting()}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total PnL — Hero stat */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <GlowCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Total PnL</p>
                  <p className={`text-xl font-bold mt-1 ${pnlPositive ? "text-neon" : "text-red-400"}`}>
                    {pnlPositive ? "+" : ""}{formatCurrency(totalPnl)}
                  </p>
                </div>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${pnlPositive ? "bg-neon/10" : "bg-red-500/10"}`}>
                  {pnlPositive ? <TrendingUp className="h-4 w-4 text-neon" /> : <TrendingDown className="h-4 w-4 text-red-400" />}
                </div>
              </div>
              {overview && (
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-[10px] font-medium ${pnlPositive ? "text-neon/70" : "text-red-400/70"}`}>
                    {overview.total_trades} trades
                  </span>
                  <span className="text-gray-700 text-[10px]">&middot;</span>
                  <span className="text-[10px] text-gray-500">{overview.period_days}d</span>
                </div>
              )}
            </GlowCard>
          </motion.div>

          {/* Win Rate */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <GlowCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Win Rate</p>
                  <p className="text-xl font-bold mt-1 text-white">
                    {overview ? `${overview.win_rate.toFixed(1)}%` : "—"}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Target className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              {overview && overview.profit_factor > 0 && (
                <p className="text-[10px] text-gray-500 mt-2">
                  PF {overview.profit_factor.toFixed(2)}
                </p>
              )}
            </GlowCard>
          </motion.div>

          {/* Sharpe Ratio */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlowCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Sharpe Ratio</p>
                  <p className="text-xl font-bold mt-1 text-white">
                    {overview ? overview.sharpe_ratio.toFixed(2) : "—"}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                </div>
              </div>
              {overview && overview.max_drawdown > 0 && (
                <p className="text-[10px] text-red-400/70 mt-2">
                  Max DD {overview.max_drawdown.toFixed(1)}%
                </p>
              )}
            </GlowCard>
          </motion.div>

          {/* Activity Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlowCard>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Activity</p>
                  <p className="text-xl font-bold mt-1 text-white">{activeStrategies.length}<span className="text-sm text-gray-500 font-normal">/{strategies.length}</span></p>
                </div>
                <div className="h-8 w-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-yellow-400" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5 text-yellow-400" /> {liveSignals} signals
                </span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Activity className="h-2.5 w-2.5 text-blue-400" /> {executions.length} trades
                </span>
              </div>
            </GlowCard>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equity Curve — takes 2/3 */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Portfolio Performance</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">30-day equity curve</p>
                </div>
                <Link
                  href="/analytics"
                  className="text-[11px] text-gray-500 hover:text-neon flex items-center gap-1 transition-colors"
                >
                  View Analytics <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
              <EquityCurveChart data={equityCurve} height={220} />
            </div>
          </motion.div>

          {/* Active Strategies — takes 1/3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Active Strategies</h2>
                <Link
                  href="/strategies"
                  className="text-[11px] text-gray-500 hover:text-neon flex items-center gap-1 transition-colors"
                >
                  All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {activeStrategies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                    <Brain className="h-5 w-5 text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-500">No active strategies</p>
                  <Link href="/strategies" className="text-[11px] text-neon hover:underline mt-1">
                    Create one
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeStrategies.slice(0, 4).map((s) => (
                    <Link
                      key={s.id}
                      href={`/strategies/${s.id}`}
                      className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        s.strategy_type === "conservative" ? "bg-blue-500/10" :
                        s.strategy_type === "moderate" ? "bg-purple-500/10" :
                        s.strategy_type === "aggressive" ? "bg-red-500/10" :
                        "bg-neon/10"
                      }`}>
                        <Brain className={`h-3.5 w-3.5 ${
                          s.strategy_type === "conservative" ? "text-blue-400" :
                          s.strategy_type === "moderate" ? "text-purple-400" :
                          s.strategy_type === "aggressive" ? "text-red-400" :
                          "text-neon"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{s.name}</p>
                        <p className="text-[10px] text-gray-500 capitalize">{s.strategy_type} &middot; {s.leverage_limit}x</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                  {activeStrategies.length > 4 && (
                    <p className="text-center text-[10px] text-gray-600 pt-1">
                      +{activeStrategies.length - 4} more
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Executions — 2/3 */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-3">
                <h2 className="text-sm font-semibold text-white">Recent Trades</h2>
                <Link
                  href="/executions"
                  className="text-[11px] text-gray-500 hover:text-neon flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {executions.length === 0 ? (
                <div className="px-5 pb-5 pt-2 text-center">
                  <p className="text-xs text-gray-500 py-6">No trades yet. Activate a strategy to start.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-5 py-2.5 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider">Direction</th>
                        <th className="px-5 py-2.5 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider">Entry</th>
                        <th className="px-5 py-2.5 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider">PnL</th>
                        <th className="px-5 py-2.5 text-left text-[10px] font-medium text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-2.5 text-right text-[10px] font-medium text-gray-600 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {executions.slice(0, 5).map((exec) => {
                        const pnl = formatPnl(exec.pnl);
                        return (
                          <tr key={exec.id} className="hover:bg-white/[0.015] transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-1.5">
                                {exec.direction === "buy" ? (
                                  <ArrowUpRight className="h-3.5 w-3.5 text-neon" />
                                ) : (
                                  <ArrowDownRight className="h-3.5 w-3.5 text-red-400" />
                                )}
                                <span className={`text-xs font-medium ${exec.direction === "buy" ? "text-neon" : "text-red-400"}`}>
                                  {exec.direction.toUpperCase()}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-xs font-mono text-gray-300">
                              {formatCurrency(exec.entry_price)}
                            </td>
                            <td className={`px-5 py-3 text-xs font-medium ${pnl.color}`}>
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
                                  className="inline-flex items-center gap-1 text-[10px] text-neon/60 hover:text-neon transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-gray-800 text-[10px]">—</span>
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

          {/* Market Movers — 1/3 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Market Movers</h2>
                <div className="flex items-center gap-1.5">
                  {connected ? (
                    <span className="flex items-center gap-1 text-[10px] text-neon font-medium">
                      <Wifi className="h-2.5 w-2.5" /> Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-gray-500">
                      <WifiOff className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
              </div>

              {topGainers.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-xs text-gray-500">
                    {connected ? "No movers right now" : "Connecting..."}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {topGainers.slice(0, 8).map((token, i) => (
                    <motion.div
                      key={token.symbol}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + i * 0.03 }}
                      className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] font-bold text-gray-400">
                          {token.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white">{token.symbol}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{formatPrice(token.midPrice)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-semibold ${token.change24h >= 0 ? "text-neon" : "text-red-400"}`}>
                          {token.change24h >= 0 ? "+" : ""}{formatNumber(token.change24h)}%
                        </p>
                        <p className="text-[10px] text-gray-600">{formatCompact(token.dayNtlVlm)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
