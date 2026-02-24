"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  Percent,
  DollarSign,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import { PageSpinner } from "@/components/ui/Spinner";
import EquityCurveChart from "@/components/charts/EquityCurveChart";
import useAnalytics from "@/hooks/useAnalytics";
import { cn, formatCurrency } from "@/lib/utils";

const PERIODS = [
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
] as const;

export default function AnalyticsPage() {
  const { overview, equityCurve, loading, fetchOverview, fetchEquityCurve } = useAnalytics();
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchOverview(days);
    fetchEquityCurve({ days });
  }, [days, fetchOverview, fetchEquityCurve]);

  if (loading && !overview) return <PageSpinner />;

  const stats = [
    {
      label: "Win Rate",
      value: `${overview?.win_rate ?? 0}%`,
      icon: Target,
      color: (overview?.win_rate ?? 0) >= 50 ? "text-neon" : "text-red-400",
    },
    {
      label: "Profit Factor",
      value: (overview?.profit_factor ?? 0).toFixed(2),
      icon: Activity,
      color: (overview?.profit_factor ?? 0) >= 1 ? "text-neon" : "text-red-400",
    },
    {
      label: "Sharpe Ratio",
      value: (overview?.sharpe_ratio ?? 0).toFixed(2),
      icon: BarChart3,
      color: (overview?.sharpe_ratio ?? 0) >= 1 ? "text-neon" : (overview?.sharpe_ratio ?? 0) >= 0 ? "text-yellow-400" : "text-red-400",
    },
    {
      label: "Max Drawdown",
      value: `${overview?.max_drawdown ?? 0}%`,
      icon: TrendingDown,
      color: "text-red-400",
    },
  ];

  const secondaryStats = [
    {
      label: "Total PnL",
      value: formatCurrency(overview?.total_pnl ?? 0),
      icon: DollarSign,
      color: (overview?.total_pnl ?? 0) >= 0 ? "text-neon" : "text-red-400",
    },
    {
      label: "Avg Trade",
      value: formatCurrency(overview?.avg_trade_pnl ?? 0),
      icon: Percent,
      color: (overview?.avg_trade_pnl ?? 0) >= 0 ? "text-neon" : "text-red-400",
    },
    {
      label: "Best Trade",
      value: formatCurrency(overview?.best_trade ?? 0),
      icon: ArrowUp,
      color: "text-neon",
    },
    {
      label: "Worst Trade",
      value: formatCurrency(overview?.worst_trade ?? 0),
      icon: ArrowDown,
      color: "text-red-400",
    },
  ];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-neon" />
              Quant Analytics
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Performance metrics across {overview?.total_trades ?? 0} closed trades
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 bg-dark-200/80 border border-white/5 rounded-lg p-1">
            {PERIODS.map((period) => (
              <button
                key={period.value}
                onClick={() => setDays(period.value)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-medium transition-all",
                  days === period.value
                    ? "bg-white/10 text-white"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Stats */}
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
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {secondaryStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <GlowCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Equity Curve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GlowCard>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-neon" />
                Equity Curve
              </h2>
              <p className="text-xs text-gray-500 mt-1">Cumulative PnL over the last {days} days</p>
            </div>
            <EquityCurveChart data={equityCurve} height={350} />
          </GlowCard>
        </motion.div>

        {/* Empty State */}
        {overview?.total_trades === 0 && (
          <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-12 text-center">
            <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Closed Trades Yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Analytics will populate once you have closed trades. Create and activate a strategy to start generating execution data.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
