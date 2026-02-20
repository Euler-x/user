"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import Link from "next/link";
import {
  Shield, TrendingUp, Flame, Zap, Play, Pause, Trash2,
  CreditCard, ChevronRight, Lock, BarChart3, Target,
  ArrowRight, Activity, CheckCircle, AlertTriangle,
  Gauge, Layers, Eye, Sparkles, X,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import useStrategies from "@/hooks/useStrategies";
import useBilling from "@/hooks/useBilling";
import { formatCurrency, capitalize } from "@/lib/utils";
import type { StrategyType, RiskProfile } from "@/types";

/* ──────────────────────────────────────────────────────────
   PREDEFINED STRATEGY PRESETS
   ────────────────────────────────────────────────────────── */

interface StrategyPreset {
  id: StrategyType;
  name: string;
  tagline: string;
  description: string;
  icon: typeof Shield;
  color: string;
  gradient: string;
  borderColor: string;
  shadowColor: string;
  risk_profile: RiskProfile;
  leverage_limit: number;
  max_positions: number;
  max_drawdown_percent: number;
  default_capital: number;
  riskTolerance: string;
  tradeFrequency: string;
  avg_trades_day: string;
  characteristics: string[];
  riskLevel: number;
  returnLevel: number;
  volatilityLevel: number;
}

const STRATEGY_PRESETS: StrategyPreset[] = [
  {
    id: "conservative",
    name: "Conservative",
    tagline: "Capital Preservation",
    description:
      "Prioritizes capital protection with tight stop-losses and minimal leverage. Designed for reduced exposure and long-term portfolio discipline.",
    icon: Shield,
    color: "#3B82F6",
    gradient: "from-blue-500/20 via-blue-600/5 to-transparent",
    borderColor: "border-blue-500/30",
    shadowColor: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    risk_profile: "low",
    leverage_limit: 1,
    max_positions: 3,
    max_drawdown_percent: 5,
    default_capital: 5000,
    riskTolerance: "Low",
    tradeFrequency: "Low",
    avg_trades_day: "2 – 4",
    characteristics: [
      "Zero leverage exposure",
      "Tight stop-loss at 5%",
      "Max 3 concurrent positions",
      "Focus on high-cap assets",
      "Low-frequency execution",
    ],
    riskLevel: 2,
    returnLevel: 3,
    volatilityLevel: 2,
  },
  {
    id: "moderate",
    name: "Moderate",
    tagline: "Balanced Growth",
    description:
      "Balanced approach to risk management. Utilizes calculated leverage with diversified positions across multiple assets. Suitable for traders seeking moderate exposure.",
    icon: TrendingUp,
    color: "#39FF14",
    gradient: "from-neon/20 via-neon/5 to-transparent",
    borderColor: "border-neon/30",
    shadowColor: "shadow-[0_0_30px_rgba(57,255,20,0.15)]",
    risk_profile: "medium",
    leverage_limit: 3,
    max_positions: 5,
    max_drawdown_percent: 10,
    default_capital: 10000,
    riskTolerance: "Medium",
    tradeFrequency: "Medium",
    avg_trades_day: "5 – 10",
    characteristics: [
      "Up to 3x leverage",
      "Balanced drawdown at 10%",
      "Max 5 concurrent positions",
      "Mixed asset exposure",
      "Medium-frequency execution",
    ],
    riskLevel: 5,
    returnLevel: 6,
    volatilityLevel: 5,
  },
  {
    id: "aggressive",
    name: "Aggressive",
    tagline: "High Exposure",
    description:
      "High-conviction, high-leverage strategy for experienced traders. Operates with elevated risk tolerance and broader market exposure. Suitable for those who accept significant drawdown risk.",
    icon: Flame,
    color: "#F59E0B",
    gradient: "from-amber-500/20 via-orange-500/5 to-transparent",
    borderColor: "border-amber-500/30",
    shadowColor: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
    risk_profile: "high",
    leverage_limit: 10,
    max_positions: 10,
    max_drawdown_percent: 25,
    default_capital: 25000,
    riskTolerance: "High",
    tradeFrequency: "High",
    avg_trades_day: "10 – 25",
    characteristics: [
      "Up to 10x leverage",
      "Extended drawdown at 25%",
      "Max 10 concurrent positions",
      "Full-spectrum asset exposure",
      "High-frequency execution",
    ],
    riskLevel: 8,
    returnLevel: 9,
    volatilityLevel: 8,
  },
];

/* ──────────────────────────────────────────────────────────
   ANIMATED COMPONENTS
   ────────────────────────────────────────────────────────── */

function RiskMeter({ level, color, label }: { level: number; color: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span style={{ color }} className="font-medium">
          {level}/10
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${level * 10}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function PerformanceChart({ preset }: { preset: StrategyPreset }) {
  const paths: Record<string, string> = {
    conservative:
      "M0,80 C20,78 40,75 60,72 C80,69 100,65 120,60 C140,56 160,50 180,45 C200,42 220,38 240,35 C260,33 280,30 300,28",
    moderate:
      "M0,85 C20,80 40,72 60,68 C80,58 100,55 120,48 C140,44 160,35 180,30 C200,28 220,22 240,18 C260,15 280,12 300,10",
    aggressive:
      "M0,90 C20,88 40,70 60,75 C80,55 100,60 120,35 C140,40 160,20 180,25 C200,10 220,15 240,5 C260,8 280,3 300,0",
  };

  const path = paths[preset.id] || paths.moderate;

  return (
    <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`perf-grad-${preset.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={preset.color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={preset.color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${path} L300,100 L0,100 Z`}
        fill={`url(#perf-grad-${preset.id})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={preset.color}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
      />
    </svg>
  );
}

function OrbitParticles({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: color,
            left: "50%",
            top: "50%",
            filter: "blur(1px)",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            x: [0, Math.cos((i * Math.PI) / 3) * 120, Math.cos((i * Math.PI) / 3) * 200],
            y: [0, Math.sin((i * Math.PI) / 3) * 80, Math.sin((i * Math.PI) / 3) * 150],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function PulseRing({ color, active }: { color: string; active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      <motion.div
        className="absolute inset-0 rounded-2xl border"
        style={{ borderColor: color }}
        initial={{ opacity: 0.6, scale: 1 }}
        animate={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   STRATEGY PRESET CARD
   ────────────────────────────────────────────────────────── */

function PresetCard({
  preset,
  selected,
  onSelect,
}: {
  preset: StrategyPreset;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = preset.icon;

  return (
    <motion.div
      layout
      onClick={onSelect}
      className="relative cursor-pointer group"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <PulseRing color={preset.color} active={selected} />
      <motion.div
        className={`relative rounded-2xl border p-6 transition-all duration-500 overflow-hidden ${
          selected
            ? `bg-dark-200/90 ${preset.borderColor} ${preset.shadowColor}`
            : "bg-dark-200/60 border-white/5 hover:border-white/10"
        }`}
        layout
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${preset.gradient} opacity-0 transition-opacity duration-500 ${
            selected ? "opacity-100" : "group-hover:opacity-50"
          }`}
        />

        {selected && <OrbitParticles color={preset.color} />}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${preset.color}15`,
                border: `1px solid ${preset.color}30`,
              }}
              animate={selected ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="h-6 w-6" style={{ color: preset.color }} />
            </motion.div>
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <CheckCircle className="h-5 w-5" style={{ color: preset.color }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title & Tagline */}
          <h3 className="text-lg font-bold text-white mb-0.5">{preset.name}</h3>
          <p className="text-xs font-medium mb-3" style={{ color: preset.color }}>
            {preset.tagline}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-400 leading-relaxed mb-5">{preset.description}</p>

          {/* Mini chart */}
          <div className="h-16 mb-4 opacity-60 group-hover:opacity-80 transition-opacity">
            <PerformanceChart preset={preset} />
          </div>

          {/* Key metrics row */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white/[0.03] rounded-lg py-2 px-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Risk</p>
              <p className="text-sm font-semibold" style={{ color: preset.color }}>
                {preset.riskTolerance}
              </p>
            </div>
            <div className="bg-white/[0.03] rounded-lg py-2 px-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Frequency</p>
              <p className="text-sm font-semibold text-white">{preset.tradeFrequency}</p>
            </div>
            <div className="bg-white/[0.03] rounded-lg py-2 px-1">
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Leverage</p>
              <p className="text-sm font-semibold text-white">{preset.leverage_limit}x</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   DETAIL PANEL (expands when a preset is selected)
   ────────────────────────────────────────────────────────── */

function DetailPanel({
  preset,
  onClose,
  onCreate,
  creating,
  hasActiveSub,
}: {
  preset: StrategyPreset;
  onClose: () => void;
  onCreate: (name: string, capital: number) => void;
  creating: boolean;
  hasActiveSub: boolean;
}) {
  const [name, setName] = useState(`${preset.name} Strategy`);
  const [capital, setCapital] = useState(preset.default_capital);

  useEffect(() => {
    setName(`${preset.name} Strategy`);
    setCapital(preset.default_capital);
  }, [preset]);

  const Icon = preset.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl border border-white/10 bg-dark-200/90 backdrop-blur-xl overflow-hidden"
    >
      {/* Top accent bar */}
      <motion.div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${preset.color}, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      {/* Background glow */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-10"
        style={{ background: preset.color }}
      />

      <div className="relative z-10 p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <motion.div
              className="h-14 w-14 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${preset.color}15`,
                border: `1px solid ${preset.color}30`,
              }}
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Icon className="h-7 w-7" style={{ color: preset.color }} />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white">Deploy {preset.name} Strategy</h2>
              <p className="text-sm" style={{ color: preset.color }}>
                {preset.tagline} &middot; {preset.riskTolerance} Risk &middot; {preset.leverage_limit}x Leverage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Risk Profile & Parameters */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Gauge className="h-4 w-4" style={{ color: preset.color }} />
                Risk Profile
              </h3>
              <div className="space-y-3 bg-white/[0.02] rounded-xl p-4 border border-white/5">
                <RiskMeter level={preset.riskLevel} color={preset.color} label="Risk Exposure" />
                <RiskMeter level={preset.returnLevel} color={preset.color} label="Market Exposure" />
                <RiskMeter level={preset.volatilityLevel} color={preset.color} label="Volatility Tolerance" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Layers className="h-4 w-4" style={{ color: preset.color }} />
                Strategy Characteristics
              </h3>
              <div className="space-y-2">
                {preset.characteristics.map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-3 text-sm text-gray-300"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" style={{ color: preset.color }} />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4" style={{ color: preset.color }} />
                Execution Parameters
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Leverage", value: `${preset.leverage_limit}x`, icon: TrendingUp },
                  { label: "Max Positions", value: preset.max_positions.toString(), icon: Layers },
                  { label: "Max Drawdown", value: `${preset.max_drawdown_percent}%`, icon: AlertTriangle },
                  { label: "Trades/Day", value: preset.avg_trades_day, icon: BarChart3 },
                ].map((param, i) => (
                  <motion.div
                    key={param.label}
                    className="bg-white/[0.03] rounded-xl p-3 border border-white/5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <param.icon className="h-3 w-3 text-gray-500" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{param.label}</p>
                    </div>
                    <p className="text-base font-bold text-white">{param.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Chart + Configuration */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Eye className="h-4 w-4" style={{ color: preset.color }} />
                Risk &amp; Exposure Profile
              </h3>
              <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Risk Tolerance</p>
                    <p className="text-2xl font-bold" style={{ color: preset.color }}>
                      {preset.riskTolerance}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Trade Frequency</p>
                    <p className="text-2xl font-bold text-white">{preset.tradeFrequency}</p>
                  </div>
                </div>
                <div className="h-24">
                  <PerformanceChart preset={preset} />
                </div>
                <p className="text-[10px] text-gray-600 mt-2 text-center">
                  Past performance is not indicative of future results. All trading involves risk.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4" style={{ color: preset.color }} />
                Configure &amp; Deploy
              </h3>
              <div className="space-y-4 bg-white/[0.02] rounded-xl p-4 border border-white/5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Strategy Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">
                    Capital Allocation (USD)
                  </label>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                    min={100}
                    className="w-full bg-dark-50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 transition-colors"
                  />
                  <div className="flex gap-2 mt-2">
                    {[1000, 5000, 10000, 25000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCapital(amount)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          capital === amount
                            ? "text-black"
                            : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                        style={capital === amount ? { backgroundColor: preset.color } : undefined}
                      >
                        ${amount >= 1000 ? `${amount / 1000}K` : amount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-dark-300/50 rounded-xl p-3 border border-white/5">
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-500">Strategy Type</span>
                    <span className="text-white font-medium text-right">{preset.name}</span>
                    <span className="text-gray-500">Risk Profile</span>
                    <span className="text-white font-medium text-right capitalize">{preset.risk_profile}</span>
                    <span className="text-gray-500">Leverage</span>
                    <span className="text-white font-medium text-right">{preset.leverage_limit}x</span>
                    <span className="text-gray-500">Capital</span>
                    <span className="font-medium text-right" style={{ color: preset.color }}>
                      {formatCurrency(capital)}
                    </span>
                  </div>
                </div>

                {hasActiveSub ? (
                  <Button
                    onClick={() => onCreate(name, capital)}
                    loading={creating}
                    disabled={!name || capital < 100}
                    className="w-full group"
                    size="lg"
                  >
                    <Zap className="h-4 w-4" />
                    Deploy Strategy
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                ) : (
                  <Link href="/billing" className="block">
                    <Button variant="secondary" className="w-full" size="lg">
                      <CreditCard className="h-4 w-4" />
                      Subscribe to Deploy
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN PAGE
   ────────────────────────────────────────────────────────── */

export default function StrategiesPage() {
  const router = useRouter();
  const {
    strategies,
    loading,
    fetchStrategies,
    createStrategy,
    activateStrategy,
    pauseStrategy,
    deleteStrategy,
  } = useStrategies();
  const { subscription, fetchSubscription } = useBilling();
  const hasActiveSub =
    subscription?.status === "active" || subscription?.status === "expiring_soon";

  const [selectedPreset, setSelectedPreset] = useState<StrategyPreset | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchStrategies();
    fetchSubscription();
  }, [fetchStrategies, fetchSubscription]);

  const handleSelectPreset = useCallback(
    (preset: StrategyPreset) => {
      setSelectedPreset((prev) => (prev?.id === preset.id ? null : preset));
    },
    []
  );

  const handleCreate = async (name: string, capital: number) => {
    if (!selectedPreset) return;
    setCreating(true);
    try {
      await createStrategy({
        name,
        strategy_type: selectedPreset.id,
        risk_profile: selectedPreset.risk_profile,
        capital_allocation: capital,
        leverage_limit: selectedPreset.leverage_limit,
        max_positions: selectedPreset.max_positions,
        max_drawdown_percent: selectedPreset.max_drawdown_percent,
      });
      setSelectedPreset(null);
    } finally {
      setCreating(false);
    }
  };

  if (loading && strategies.length === 0) return <PageSpinner />;

  return (
    <PageTransition>
      <div className="space-y-10">
        {/* ── Section: Strategy Presets ────────────────── */}
        <section>
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="h-8 w-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center">
                <Target className="h-4 w-4 text-neon" />
              </div>
              <h1 className="text-2xl font-bold text-white">Deploy a Strategy</h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-sm text-gray-400 ml-11"
            >
              Select a predefined execution profile. Each strategy is calibrated for a specific
              risk-return profile and powered by our AI execution engine.
            </motion.p>
          </div>

          {/* Preset Cards */}
          <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
            {STRATEGY_PRESETS.map((preset, i) => (
              <motion.div
                key={preset.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <PresetCard
                  preset={preset}
                  selected={selectedPreset?.id === preset.id}
                  onSelect={() => handleSelectPreset(preset)}
                />
              </motion.div>
            ))}
          </div>

          {/* Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedPreset && (
              <motion.div
                key={selectedPreset.id}
                className="mt-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <DetailPanel
                  preset={selectedPreset}
                  onClose={() => setSelectedPreset(null)}
                  onCreate={handleCreate}
                  creating={creating}
                  hasActiveSub={hasActiveSub}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Section: Existing Strategies ─────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Layers className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">My Strategies</h2>
                <p className="text-xs text-gray-500">
                  {strategies.length} {strategies.length === 1 ? "strategy" : "strategies"} deployed
                </p>
              </div>
            </div>
          </div>

          {strategies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-200/60 border border-white/5 rounded-2xl p-12 text-center"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm mb-1">No strategies deployed yet</p>
              <p className="text-gray-600 text-xs">
                Select a preset above to deploy your first AI-powered strategy
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {strategies.map((strategy, i) => {
                const presetMatch = STRATEGY_PRESETS.find((p) => p.id === strategy.strategy_type);
                const color = presetMatch?.color || "#39FF14";
                const StrategyIcon = presetMatch?.icon || Zap;

                return (
                  <motion.div
                    key={strategy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div
                      className="relative rounded-2xl bg-dark-200/80 backdrop-blur-xl border border-white/5 p-5 hover:border-white/10 transition-all duration-300 cursor-pointer group"
                      onClick={() => router.push(`/strategies/${strategy.id}`)}
                    >
                      {/* Top color accent */}
                      <div
                        className="absolute top-0 left-6 right-6 h-px opacity-30"
                        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                      />

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: `${color}10`,
                              border: `1px solid ${color}20`,
                            }}
                          >
                            <StrategyIcon className="h-5 w-5" style={{ color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">
                              {strategy.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {capitalize(strategy.strategy_type)} &middot;{" "}
                              {capitalize(strategy.risk_profile)} Risk
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={strategy.is_active ? "success" : "default"}>
                            {strategy.is_active ? "Active" : "Paused"}
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center mb-4">
                        <div className="bg-white/[0.03] rounded-lg py-2">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Capital</p>
                          <p className="text-sm font-medium text-white">
                            {formatCurrency(strategy.capital_allocation)}
                          </p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg py-2">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Leverage</p>
                          <p className="text-sm font-medium text-white">{strategy.leverage_limit}x</p>
                        </div>
                        <div className="bg-white/[0.03] rounded-lg py-2">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Drawdown</p>
                          <p className="text-sm font-medium text-white">
                            {strategy.max_drawdown_percent}%
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {strategy.is_active ? (
                          <Button size="sm" variant="secondary" onClick={() => pauseStrategy(strategy.id)}>
                            <Pause className="h-3 w-3" /> Pause
                          </Button>
                        ) : (
                          <>
                            {hasActiveSub ? (
                              <Button size="sm" onClick={() => activateStrategy(strategy.id)}>
                                <Play className="h-3 w-3" /> Activate
                              </Button>
                            ) : (
                              <Link href="/billing">
                                <Button size="sm" variant="secondary">
                                  <CreditCard className="h-3 w-3" /> Upgrade
                                </Button>
                              </Link>
                            )}
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => deleteStrategy(strategy.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
