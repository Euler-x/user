"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Activity, TrendingUp, Wifi, WifiOff, Wallet, ArrowRight, ExternalLink, Crown, Sparkles } from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import GlowCard from "@/components/ui/GlowCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { PageSpinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/stores/authStore";
import useStrategies from "@/hooks/useStrategies";
import useSignals from "@/hooks/useSignals";
import useExecutions from "@/hooks/useExecutions";
import useBilling from "@/hooks/useBilling";
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

export default function DashboardPage() {
  const { strategies, fetchStrategies, loading: strategiesLoading } = useStrategies();
  const { fetchSignals, loading: signalsLoading } = useSignals();
  const { executions, fetchExecutions, loading: execLoading } = useExecutions();
  const { subscription, fetchSubscription } = useBilling();
  const { tokens, topGainers, connected } = useMarketData();
  const user = useAuthStore((s) => s.user);
  const [liveSignals, setLiveSignals] = useState(0);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    fetchStrategies();
    fetchSignals({ page: 1, page_size: 5 }).then((d) => d && setLiveSignals(d.total));
    fetchExecutions({ page: 1, page_size: 5 });
    fetchSubscription();
  }, [fetchStrategies, fetchSignals, fetchExecutions, fetchSubscription]);

  const loading = strategiesLoading || signalsLoading || execLoading;
  if (loading && strategies.length === 0) return <PageSpinner />;

  const activeStrategies = strategies.filter((s) => s.is_active).length;
  const totalPnl = executions.reduce((sum, e) => sum + (e.pnl ?? 0), 0);
  const hasActiveSub = subscription?.status === "active" && subscription.plan;

  const stats = [
    { label: "Active Strategies", value: activeStrategies, total: strategies.length, icon: Brain, color: "text-neon" },
    { label: "Live Signals", value: liveSignals, icon: Zap, color: "text-yellow-400" },
    { label: "Recent Executions", value: executions.length, icon: Activity, color: "text-blue-400" },
    { label: "Total PnL", value: formatPnl(totalPnl).text, icon: TrendingUp, color: formatPnl(totalPnl).color },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              {hasActiveSub ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 text-xs font-semibold text-neon">
                  <Crown className="h-3 w-3" />
                  {subscription.plan!.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
                  Free
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">Overview of your trading activity</p>
          </div>
        </div>

        {/* Upgrade to Pro Banner */}
        {!hasActiveSub && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/billing"
              className="block w-full text-left relative overflow-hidden bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-5 hover:border-amber-500/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Upgrade to Pro</p>
                    <p className="text-xs text-gray-400 mt-0.5">Unlock more strategies, higher allocations, and ATE engine access</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-amber-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Connect Wallet Banner */}
        {user && !user.has_wallet && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setShowWalletModal(true)}
              className="w-full text-left relative overflow-hidden bg-gradient-to-r from-neon/10 via-neon/5 to-transparent border border-neon/20 rounded-2xl p-5 cursor-pointer hover:border-neon/40 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-neon/10 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-neon" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Connect Your Hyperliquid Wallet</p>
                    <p className="text-xs text-gray-400 mt-0.5">Link your wallet to enable automated trading with the ATE engine</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-neon opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          </motion.div>
        )}

        <ConnectWalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlowCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                      {stat.value}
                      {"total" in stat && <span className="text-sm text-gray-500 font-normal">/{stat.total}</span>}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Top Gainers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Top Gainers</h2>
            <div className="flex items-center gap-2 text-xs">
              {connected ? (
                <span className="flex items-center gap-1 text-neon">
                  <Wifi className="h-3 w-3" /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-500">
                  <WifiOff className="h-3 w-3" /> Connecting...
                </span>
              )}
              <span className="text-gray-600">{tokens.length} assets</span>
            </div>
          </div>

          {topGainers.length === 0 ? (
            <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-gray-500">
                {connected ? "No gainers at the moment." : "Connecting to market feed..."}
              </p>
            </div>
          ) : (
            <div className="bg-dark-200/80 border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">24h Change</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Volume (24h)</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Open Interest</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Funding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {topGainers.slice(0, 20).map((token, i) => (
                      <motion.tr
                        key={token.symbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-300">
                              {token.symbol.slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-white">{token.symbol}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono text-gray-200">
                          {formatPrice(token.midPrice)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-sm font-medium ${token.change24h >= 0 ? "text-neon" : "text-red-400"}`}>
                            {token.change24h >= 0 ? "+" : ""}{formatNumber(token.change24h)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 hidden sm:table-cell">
                          {formatCompact(token.dayNtlVlm)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 hidden md:table-cell">
                          {formatCompact(token.openInterest)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono text-gray-400 hidden lg:table-cell">
                          {(parseFloat(token.funding) * 100).toFixed(4)}%
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent Executions */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Executions</h2>
          {executions.length === 0 ? (
            <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No executions yet. Create and activate a strategy to start.</p>
            </div>
          ) : (
            <div className="bg-dark-200/80 border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Direction</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PnL</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {executions.slice(0, 5).map((exec) => (
                      <tr key={exec.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <span className={exec.direction === "buy" ? "text-neon" : "text-red-400"}>
                            {exec.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-300">{formatCurrency(exec.entry_price)}</td>
                        <td className={`px-4 py-3 text-sm font-medium ${formatPnl(exec.pnl).color}`}>
                          {formatPnl(exec.pnl).text}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={exec.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          {exec.tx_hash ? (
                            <a
                              href={`${EXPLORER_TX_URL}${exec.tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-neon/70 hover:text-neon transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-gray-700 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
