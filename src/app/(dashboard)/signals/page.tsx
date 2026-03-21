"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, TrendingUp, TrendingDown, Minus, CreditCard,
  Brain, Activity, BarChart3, Clock, ExternalLink, X,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import Spinner, { PageSpinner } from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import useSignals from "@/hooks/useSignals";
import useBilling from "@/hooks/useBilling";
import usePagination from "@/hooks/usePagination";
import { formatCurrency, formatDateTime, formatNumber, capitalize } from "@/lib/utils";
import type { Signal, SignalDetail, Exchange } from "@/types";

const directionIcons = {
  buy: <TrendingUp className="h-4 w-4 text-neon" />,
  sell: <TrendingDown className="h-4 w-4 text-red-400" />,
  hold: <Minus className="h-4 w-4 text-yellow-400" />,
};

const EXPLORER_URLS: Record<string, string> = {
  hyperliquid: "https://app.hyperliquid.xyz/explorer/tx/",
  bybit: "https://www.bybit.com/trade/usdt/",
};

const EXCHANGE_LABELS: Record<string, string> = {
  hyperliquid: "HyperLiquid",
  bybit: "Bybit",
};

/* ──────────────────────────────────────────────────────────
   SIGNAL DETAIL MODAL
   ────────────────────────────────────────────────────────── */

function SignalDetailModal({
  signal,
  loading: detailLoading,
  onClose,
}: {
  signal: SignalDetail | null;
  loading: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {(signal || detailLoading) && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-dark-200 border border-white/10 shadow-neon-lg scrollbar-none"
            >
              {detailLoading || !signal ? (
                <div className="p-12 flex items-center justify-center">
                  <Spinner size="lg" />
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="sticky top-0 z-10 bg-dark-200/95 backdrop-blur-xl border-b border-white/5 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        signal.direction === "buy" ? "bg-neon/10" : signal.direction === "sell" ? "bg-red-500/10" : "bg-yellow-500/10"
                      }`}>
                        {directionIcons[signal.direction]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-bold text-white">{signal.symbol}</h2>
                          <Badge variant={signal.direction === "buy" ? "neon" : signal.direction === "sell" ? "danger" : "warning"}>
                            {signal.direction.toUpperCase()}
                          </Badge>
                          <StatusBadge status={signal.status} />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(signal.created_at)}</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Price Levels */}
                    <div>
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-neon" /> Price Levels
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                          <p className="text-xs text-gray-500">Entry Price</p>
                          <p className="text-white font-semibold mt-1">{formatCurrency(signal.entry_price)}</p>
                        </div>
                        <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                          <p className="text-xs text-gray-500">Confidence</p>
                          <p className="text-neon font-semibold mt-1">{formatNumber(signal.confidence * 100, 1)}%</p>
                        </div>
                        {signal.stop_loss && (
                          <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                            <p className="text-xs text-gray-500">Stop Loss</p>
                            <p className="text-red-400 font-semibold mt-1">{formatCurrency(signal.stop_loss)}</p>
                          </div>
                        )}
                        {signal.take_profit && (
                          <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                            <p className="text-xs text-gray-500">Take Profit</p>
                            <p className="text-neon font-semibold mt-1">{formatCurrency(signal.take_profit)}</p>
                          </div>
                        )}
                      </div>
                      {signal.risk_reward_ratio && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Risk:Reward Ratio</span>
                          <Badge variant="neon">{formatNumber(signal.risk_reward_ratio, 2)}</Badge>
                        </div>
                      )}
                      {signal.expires_at && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          Expires: {formatDateTime(signal.expires_at)}
                        </div>
                      )}
                    </div>

                    {/* Indicators */}
                    {signal.indicators && Object.keys(signal.indicators).length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-cyan-400" /> Market Indicators
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {Object.entries(signal.indicators).map(([key, value]) => (
                            <div key={key} className="bg-white/[0.02] rounded-lg px-3 py-2 border border-white/5">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                {key.replace(/_/g, " ")}
                              </p>
                              <p className="text-sm text-white mt-0.5">{String(value)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Model Responses */}
                    {signal.model_responses && Object.keys(signal.model_responses).length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Brain className="h-4 w-4 text-purple-400" /> AI Model Consensus
                        </h3>
                        <div className="space-y-2">
                          {Object.entries(signal.model_responses).map(([modelId, response]) => {
                            const r = response as Record<string, unknown>;
                            const modelSignal = String(r.signal || "HOLD").toUpperCase();
                            return (
                              <div
                                key={modelId}
                                className="bg-white/[0.02] rounded-xl p-3 border border-white/5"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-300 truncate max-w-[200px]">
                                    {modelId.split("/").pop() || modelId}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={modelSignal === "BUY" ? "neon" : modelSignal === "SELL" ? "danger" : "default"}
                                    >
                                      {modelSignal}
                                    </Badge>
                                    {r.confidence != null && (
                                      <span className="text-xs text-gray-400">
                                        {formatNumber(Number(r.confidence) * 100, 0)}%
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {r.reasoning ? (
                                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {String(r.reasoning)}
                                  </p>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Linked Executions */}
                    {signal.executions && signal.executions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-400" /> Executions
                        </h3>
                        <div className="space-y-2">
                          {signal.executions.map((exec) => (
                            <div
                              key={exec.id}
                              className="bg-white/[0.02] rounded-xl p-3 border border-white/5 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`text-xs font-semibold ${exec.direction === "buy" ? "text-neon" : "text-red-400"}`}>
                                  {exec.direction.toUpperCase()}
                                </span>
                                <span className="text-sm text-white">
                                  {exec.quantity.toFixed(4)} @ {formatCurrency(exec.entry_price)}
                                </span>
                                <span className="text-xs text-gray-500">{exec.leverage}x</span>
                                <StatusBadge status={exec.status} />
                              </div>
                              <div className="flex items-center gap-3">
                                {exec.pnl != null && (
                                  <span className={`text-sm font-medium ${exec.pnl >= 0 ? "text-neon" : "text-red-400"}`}>
                                    {exec.pnl >= 0 ? "+" : ""}{formatCurrency(exec.pnl)}
                                  </span>
                                )}
                                {exec.tx_hash && (
                                  <a
                                    href={`${EXPLORER_URLS[signal.exchange] || EXPLORER_URLS.hyperliquid}${exec.tx_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neon/70 hover:text-neon transition-colors"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────
   SIGNALS PAGE
   ────────────────────────────────────────────────────────── */

function SignalsPageInner() {
  const searchParams = useSearchParams();
  const exchangeParam = searchParams.get("exchange");
  const initialExchange: Exchange = exchangeParam === "bybit" ? "bybit" : "hyperliquid";

  const { signals, totalPages, loading, fetchSignals, fetchLive, getSignal } = useSignals();
  const { subscription, loading: billingLoading, fetchSubscription } = useBilling();
  const { page, pageSize, setPage } = usePagination();
  const [liveSignals, setLiveSignals] = useState<Signal[]>([]);
  const [tab, setTab] = useState<"all" | "live">("live");
  const [exchange, setExchange] = useState<Exchange>(initialExchange);

  // Sync exchange state when URL param changes (sidebar nav clicks)
  useEffect(() => {
    setExchange(initialExchange);
  }, [initialExchange]);

  const [subChecked, setSubChecked] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<SignalDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openSignalDetail = async (id: string) => {
    setDetailLoading(true);
    setSelectedSignal(null);
    try {
      const detail = await getSignal(id, exchange);
      setSelectedSignal(detail);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription().then(() => setSubChecked(true));
  }, [fetchSubscription]);

  const hasActiveSub = subscription?.status === "active" || subscription?.status === "expiring_soon";

  useEffect(() => {
    if (!subChecked || !hasActiveSub) return;
    if (tab === "live") {
      fetchLive({ exchange }).then((data) => data && setLiveSignals(data));
    } else {
      fetchSignals({ page, page_size: pageSize, exchange } as Record<string, unknown>);
    }
  }, [tab, page, pageSize, exchange, fetchSignals, fetchLive, subChecked, hasActiveSub]);

  const displaySignals = tab === "live" ? liveSignals : signals;

  if (billingLoading || !subChecked) return <PageSpinner />;

  if (!hasActiveSub) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Signals</h1>
            <p className="text-sm text-gray-400 mt-1">AI-generated trading signals</p>
          </div>
          <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Upgrade to Access Signals</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              AI-powered trading signals are available with an active subscription plan. Upgrade now to get real-time market insights.
            </p>
            <Link href="/billing">
              <Button>
                <CreditCard className="h-4 w-4" /> View Plans
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (loading && displaySignals.length === 0) return <PageSpinner />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{EXCHANGE_LABELS[exchange]} Signals</h1>
            <p className="text-sm text-gray-400 mt-1">AI-generated trading signals on {EXCHANGE_LABELS[exchange]}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={tab === "live" ? "primary" : "secondary"} onClick={() => setTab("live")}>
              <Zap className="h-3 w-3" /> Live
            </Button>
            <Button size="sm" variant={tab === "all" ? "primary" : "secondary"} onClick={() => { setTab("all"); setPage(1); }}>
              All Signals
            </Button>
          </div>
        </div>

        {/* Exchange tabs */}
        <div className="flex items-center gap-1 p-1 bg-dark-200/60 rounded-xl border border-white/5 w-fit">
          {(["hyperliquid", "bybit"] as Exchange[]).map((ex) => (
            <button
              key={ex}
              onClick={() => { setExchange(ex); setPage(1); }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                exchange === ex
                  ? "bg-neon/10 text-neon border border-neon/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {EXCHANGE_LABELS[ex]}
            </button>
          ))}
        </div>

        {displaySignals.length === 0 ? (
          <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-12 text-center">
            <Zap className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">{tab === "live" ? "No live signals right now" : "No signals found"}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displaySignals.map((signal, i) => (
              <motion.div
                key={signal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <GlowCard className="cursor-pointer" onClick={() => openSignalDetail(signal.id)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {directionIcons[signal.direction]}
                      <span className="font-semibold text-white">{signal.symbol}</span>
                    </div>
                    <StatusBadge status={signal.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Entry</p>
                      <p className="text-white">{formatCurrency(signal.entry_price)}</p>
                    </div>
                    <div>
                      <Tooltip content="AI model's certainty level for this trade signal" placement="top">
                        <p className="text-xs text-gray-500 cursor-help">Confidence</p>
                      </Tooltip>
                      <p className="text-neon">{formatNumber(signal.confidence * 100, 0)}%</p>
                    </div>
                    {signal.stop_loss && (
                      <div>
                        <Tooltip content="Price at which the position will be automatically closed to limit losses" placement="top">
                        <p className="text-xs text-gray-500 cursor-help">Stop Loss</p>
                      </Tooltip>
                        <p className="text-red-400">{formatCurrency(signal.stop_loss)}</p>
                      </div>
                    )}
                    {signal.take_profit && (
                      <div>
                        <Tooltip content="Target price at which the position will be closed for profit" placement="top">
                        <p className="text-xs text-gray-500 cursor-help">Take Profit</p>
                      </Tooltip>
                        <p className="text-neon">{formatCurrency(signal.take_profit)}</p>
                      </div>
                    )}
                  </div>
                  {signal.risk_reward_ratio && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      <Tooltip content="Risk-to-Reward ratio. Higher is better — e.g. 2.0 means potential reward is 2x the risk" placement="left">
                        <span className="text-gray-500 cursor-help">R:R Ratio</span>
                      </Tooltip>
                      <Badge variant="neon">{formatNumber(signal.risk_reward_ratio, 1)}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-600">{formatDateTime(signal.created_at)}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      signal.exchange === "bybit"
                        ? "bg-orange-500/10 text-orange-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {EXCHANGE_LABELS[signal.exchange] || signal.exchange}
                    </span>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "all" && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>

      <SignalDetailModal
        signal={selectedSignal}
        loading={detailLoading}
        onClose={() => { setSelectedSignal(null); setDetailLoading(false); }}
      />
    </PageTransition>
  );
}

export default function SignalsPage() {
  return (
    <Suspense>
      <SignalsPageInner />
    </Suspense>
  );
}
