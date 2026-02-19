"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Zap, Activity, TrendingUp } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { PageSpinner } from "@/components/ui/Spinner";
import useStrategies from "@/hooks/useStrategies";
import useSignals from "@/hooks/useSignals";
import useExecutions from "@/hooks/useExecutions";
import useBilling from "@/hooks/useBilling";
import { formatCurrency, formatPnl } from "@/lib/utils";

export default function DashboardPage() {
  const { strategies, fetchStrategies, loading: strategiesLoading } = useStrategies();
  const { fetchSignals, loading: signalsLoading } = useSignals();
  const { executions, fetchExecutions, loading: execLoading } = useExecutions();
  const { subscription, fetchSubscription } = useBilling();
  const [liveSignals, setLiveSignals] = useState(0);

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

  const stats = [
    { label: "Active Strategies", value: activeStrategies, total: strategies.length, icon: Brain, color: "text-neon" },
    { label: "Live Signals", value: liveSignals, icon: Zap, color: "text-yellow-400" },
    { label: "Recent Executions", value: executions.length, icon: Activity, color: "text-blue-400" },
    { label: "Total PnL", value: formatPnl(totalPnl).text, icon: TrendingUp, color: formatPnl(totalPnl).color },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Overview of your trading activity
            {subscription?.status === "active" && subscription.plan && (
              <> &middot; <span className="text-neon">{subscription.plan.name} Plan</span></>
            )}
          </p>
        </div>

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
