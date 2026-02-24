"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Play, Pause, Save, Shield, TrendingUp,
  Flame, Zap, Layers, Activity, BarChart3, AlertTriangle,
  Clock, Target, Gauge, LineChart,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import GlowCard from "@/components/ui/GlowCard";
import { PageSpinner } from "@/components/ui/Spinner";
import EquityCurveChart from "@/components/charts/EquityCurveChart";
import useStrategies from "@/hooks/useStrategies";
import useAnalytics from "@/hooks/useAnalytics";
import { formatCurrency, formatDate, capitalize } from "@/lib/utils";
import type { Strategy, StrategyUpdate, RiskProfile, StrategyTimeframe } from "@/types";

const STRATEGY_COLORS: Record<string, { color: string; icon: typeof Shield }> = {
  conservative: { color: "#3B82F6", icon: Shield },
  moderate: { color: "#39FF14", icon: TrendingUp },
  aggressive: { color: "#F59E0B", icon: Flame },
};

export default function StrategyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getStrategy, updateStrategy, activateStrategy, pauseStrategy } = useStrategies();
  const { strategyAnalytics, equityCurve, fetchStrategyAnalytics, fetchEquityCurve } = useAnalytics();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StrategyUpdate>({});

  useEffect(() => {
    getStrategy(id)
      .then((s) => {
        setStrategy(s);
        setForm({
          name: s.name,
          risk_profile: s.risk_profile,
          leverage_limit: s.leverage_limit,
          max_positions: s.max_positions,
          capital_allocation: s.capital_allocation,
          max_drawdown_percent: s.max_drawdown_percent,
          daily_loss_cap_percent: s.daily_loss_cap_percent ?? undefined,
          target_volatility: s.target_volatility ?? undefined,
          expected_volatility: s.expected_volatility ?? undefined,
          timeframe: s.timeframe ?? undefined,
          target_return_min: s.target_return_min ?? undefined,
          target_return_max: s.target_return_max ?? undefined,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, getStrategy]);

  useEffect(() => {
    if (!loading && strategy) {
      fetchStrategyAnalytics(id);
      fetchEquityCurve({ strategy_id: id, days: 30 });
    }
  }, [id, loading, strategy, fetchStrategyAnalytics, fetchEquityCurve]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateStrategy(id, form);
      setStrategy(updated);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    if (!strategy) return;
    const updated = strategy.is_active ? await pauseStrategy(id) : await activateStrategy(id);
    setStrategy(updated);
  };

  if (loading) return <PageSpinner />;
  if (!strategy)
    return <div className="text-center text-gray-500 py-20">Strategy not found</div>;

  const theme = STRATEGY_COLORS[strategy.strategy_type] || { color: "#39FF14", icon: Zap };
  const Icon = theme.icon;
  const color = theme.color;

  return (
    <PageTransition>
      <div className="space-y-6 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Strategies
        </button>

        {/* Header with strategy-colored accent */}
        <div className="relative rounded-2xl border border-white/10 bg-dark-200/80 backdrop-blur-xl p-6 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6 }}
          />
          <div
            className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[100px] pointer-events-none opacity-5"
            style={{ background: color }}
          />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: `${color}15`,
                  border: `1px solid ${color}30`,
                }}
              >
                <Icon className="h-6 w-6" style={{ color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{strategy.name}</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  <span style={{ color }} className="font-medium">
                    {capitalize(strategy.strategy_type)}
                  </span>{" "}
                  &middot; Created {formatDate(strategy.created_at)}
                  {strategy.timeframe && (
                    <> &middot; <span className="text-gray-300">{capitalize(strategy.timeframe)}</span></>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={strategy.is_active ? "success" : "default"}>
                {strategy.is_active ? "Active" : "Paused"}
              </Badge>
              <Button variant="secondary" size="sm" onClick={handleToggle}>
                {strategy.is_active ? (
                  <>
                    <Pause className="h-3 w-3" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3" /> Activate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Paused Reason Banner */}
        {strategy.paused_reason && !strategy.is_active && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 rounded-xl p-4"
          >
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Strategy Auto-Paused</p>
              <p className="text-xs text-gray-400 mt-0.5">{strategy.paused_reason}</p>
              {strategy.paused_at && (
                <p className="text-xs text-gray-600 mt-1">Paused at {new Date(strategy.paused_at).toLocaleString()}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Capital", value: formatCurrency(strategy.capital_allocation), icon: BarChart3 },
            { label: "Leverage", value: `${strategy.leverage_limit}x`, icon: TrendingUp },
            { label: "Positions", value: strategy.max_positions.toString(), icon: Layers },
            { label: "Drawdown", value: `${strategy.max_drawdown_percent}%`, icon: AlertTriangle },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="rounded-xl bg-dark-200/60 border border-white/5 p-4 text-center"
            >
              <stat.icon className="h-4 w-4 mx-auto mb-2 text-gray-500" />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Risk Management & Strategy Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Daily Loss Cap", value: strategy.daily_loss_cap_percent ? `${strategy.daily_loss_cap_percent}%` : "—", icon: Shield },
            { label: "Target Vol", value: strategy.target_volatility ? `${strategy.target_volatility}%` : "—", icon: Gauge },
            { label: "Timeframe", value: strategy.timeframe ? capitalize(strategy.timeframe) : "—", icon: Clock },
            {
              label: "Target Return",
              value: strategy.target_return_min && strategy.target_return_max
                ? `${strategy.target_return_min}–${strategy.target_return_max}%`
                : "—",
              icon: Target,
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="rounded-xl bg-dark-200/60 border border-white/5 p-4 text-center"
            >
              <stat.icon className="h-4 w-4 mx-auto mb-2" style={{ color }} />
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Strategy Analytics */}
        {strategyAnalytics && strategyAnalytics.total_trades > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <GlowCard>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <LineChart className="h-5 w-5" style={{ color }} />
                Performance Analytics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Win Rate", value: `${strategyAnalytics.win_rate.toFixed(1)}%`, positive: strategyAnalytics.win_rate >= 50 },
                  { label: "Profit Factor", value: strategyAnalytics.profit_factor.toFixed(2), positive: strategyAnalytics.profit_factor >= 1 },
                  { label: "Total PnL", value: formatCurrency(strategyAnalytics.total_pnl), positive: strategyAnalytics.total_pnl >= 0 },
                  { label: "Sharpe Ratio", value: strategyAnalytics.sharpe_ratio.toFixed(2), positive: strategyAnalytics.sharpe_ratio >= 1 },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/[0.03] rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.positive ? "text-neon" : "text-red-400"}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
              <EquityCurveChart data={equityCurve} height={200} />
            </GlowCard>
          </motion.div>
        )}

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-dark-200/80 backdrop-blur-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Activity className="h-5 w-5" style={{ color }} />
            Edit Parameters
          </h2>
          <div className="space-y-4">
            <Input
              label="Name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Risk Profile</label>
                <select
                  value={form.risk_profile || strategy.risk_profile}
                  onChange={(e) => setForm({ ...form, risk_profile: e.target.value as RiskProfile })}
                  className="w-full bg-dark-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Timeframe</label>
                <select
                  value={form.timeframe || ""}
                  onChange={(e) => setForm({ ...form, timeframe: (e.target.value || undefined) as StrategyTimeframe | undefined })}
                  className="w-full bg-dark-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50"
                >
                  <option value="">Not set</option>
                  <option value="scalping">Scalping</option>
                  <option value="intraday">Intraday</option>
                  <option value="swing">Swing</option>
                  <option value="position">Position</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Capital (USD)"
                type="number"
                value={form.capital_allocation ?? strategy.capital_allocation}
                onChange={(e) => setForm({ ...form, capital_allocation: Number(e.target.value) })}
              />
              <Input
                label="Leverage"
                type="number"
                value={form.leverage_limit ?? strategy.leverage_limit}
                onChange={(e) => setForm({ ...form, leverage_limit: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Max Positions"
                type="number"
                value={form.max_positions ?? strategy.max_positions}
                onChange={(e) => setForm({ ...form, max_positions: Number(e.target.value) })}
              />
              <Input
                label="Max Drawdown %"
                type="number"
                value={form.max_drawdown_percent ?? strategy.max_drawdown_percent}
                onChange={(e) => setForm({ ...form, max_drawdown_percent: Number(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Daily Loss Cap %"
                type="number"
                value={form.daily_loss_cap_percent ?? ""}
                onChange={(e) => setForm({ ...form, daily_loss_cap_percent: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 5"
              />
              <Input
                label="Target Volatility %"
                type="number"
                value={form.target_volatility ?? ""}
                onChange={(e) => setForm({ ...form, target_volatility: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expected Volatility %"
                type="number"
                value={form.expected_volatility ?? ""}
                onChange={(e) => setForm({ ...form, expected_volatility: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 18"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Target Return Min %"
                  type="number"
                  value={form.target_return_min ?? ""}
                  onChange={(e) => setForm({ ...form, target_return_min: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="e.g. 25"
                />
                <Input
                  label="Max %"
                  type="number"
                  value={form.target_return_max ?? ""}
                  onChange={(e) => setForm({ ...form, target_return_max: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="e.g. 60"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} loading={saving}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
