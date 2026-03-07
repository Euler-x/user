"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, TrendingUp, TrendingDown, Minus, CreditCard } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";
import useSignals from "@/hooks/useSignals";
import useBilling from "@/hooks/useBilling";
import usePagination from "@/hooks/usePagination";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/utils";
import type { Signal } from "@/types";

const directionIcons = {
  buy: <TrendingUp className="h-4 w-4 text-neon" />,
  sell: <TrendingDown className="h-4 w-4 text-red-400" />,
  hold: <Minus className="h-4 w-4 text-yellow-400" />,
};

export default function SignalsPage() {
  const { signals, totalPages, loading, fetchSignals, fetchLive } = useSignals();
  const { subscription, loading: billingLoading, fetchSubscription } = useBilling();
  const { page, pageSize, setPage } = usePagination();
  const [liveSignals, setLiveSignals] = useState<Signal[]>([]);
  const [tab, setTab] = useState<"all" | "live">("live");
  const [subChecked, setSubChecked] = useState(false);

  useEffect(() => {
    fetchSubscription().then(() => setSubChecked(true));
  }, [fetchSubscription]);

  const hasActiveSub = subscription?.status === "active" || subscription?.status === "expiring_soon";

  useEffect(() => {
    if (!subChecked || !hasActiveSub) return;
    if (tab === "live") {
      fetchLive().then((data) => data && setLiveSignals(data));
    } else {
      fetchSignals({ page, page_size: pageSize });
    }
  }, [tab, page, pageSize, fetchSignals, fetchLive, subChecked, hasActiveSub]);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Signals</h1>
            <p className="text-sm text-gray-400 mt-1">AI-generated trading signals</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant={tab === "live" ? "primary" : "secondary"} onClick={() => setTab("live")}>
              <Zap className="h-3 w-3" /> Live
            </Button>
            <Button size="sm" variant={tab === "all" ? "primary" : "secondary"} onClick={() => { setTab("all"); setPage(1); }}>
              All Signals
            </Button>
          </div>
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
                <GlowCard>
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
                  <p className="text-xs text-gray-600 mt-2">{formatDateTime(signal.created_at)}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "all" && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>
    </PageTransition>
  );
}
