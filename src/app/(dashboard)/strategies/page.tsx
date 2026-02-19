"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Play, Pause, Trash2, CreditCard } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { PageSpinner } from "@/components/ui/Spinner";
import useStrategies from "@/hooks/useStrategies";
import useBilling from "@/hooks/useBilling";
import { formatCurrency, capitalize } from "@/lib/utils";
import type { StrategyCreate, StrategyType, RiskProfile } from "@/types";

export default function StrategiesPage() {
  const router = useRouter();
  const { strategies, loading, fetchStrategies, createStrategy, activateStrategy, pauseStrategy, deleteStrategy } = useStrategies();
  const { subscription, fetchSubscription } = useBilling();
  const hasActiveSub = subscription?.status === "active" || subscription?.status === "expiring_soon";
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<StrategyCreate>({
    name: "",
    strategy_type: "moderate",
    risk_profile: "medium",
    capital_allocation: 1000,
    leverage_limit: 1,
    max_positions: 5,
    max_drawdown_percent: 10,
  });

  useEffect(() => { fetchStrategies(); fetchSubscription(); }, [fetchStrategies, fetchSubscription]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await createStrategy(form);
      setShowCreate(false);
      setForm({ name: "", strategy_type: "moderate", risk_profile: "medium", capital_allocation: 1000, leverage_limit: 1, max_positions: 5, max_drawdown_percent: 10 });
    } finally {
      setCreating(false);
    }
  };

  if (loading && strategies.length === 0) return <PageSpinner />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Strategies</h1>
            <p className="text-sm text-gray-400 mt-1">{strategies.length} strategies configured</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New Strategy
          </Button>
        </div>

        {strategies.length === 0 ? (
          <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-12 text-center">
            <p className="text-gray-500 mb-4">No strategies yet. Create your first one to start trading.</p>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4" /> Create Strategy
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {strategies.map((strategy, i) => (
              <motion.div
                key={strategy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlowCard className="cursor-pointer" onClick={() => router.push(`/strategies/${strategy.id}`)}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{strategy.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{capitalize(strategy.strategy_type)} &middot; {capitalize(strategy.risk_profile)} Risk</p>
                    </div>
                    <Badge variant={strategy.is_active ? "success" : "default"}>
                      {strategy.is_active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Capital</p>
                      <p className="text-sm font-medium text-white">{formatCurrency(strategy.capital_allocation)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Leverage</p>
                      <p className="text-sm font-medium text-white">{strategy.leverage_limit}x</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Max Drawdown</p>
                      <p className="text-sm font-medium text-white">{strategy.max_drawdown_percent}%</p>
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
                              <CreditCard className="h-3 w-3" /> Upgrade to Activate
                            </Button>
                          </Link>
                        )}
                        <Button size="sm" variant="danger" onClick={() => deleteStrategy(strategy.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Strategy" size="lg">
          <div className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Trading Strategy" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Type</label>
                <select value={form.strategy_type} onChange={(e) => setForm({ ...form, strategy_type: e.target.value as StrategyType })} className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50">
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Risk Profile</label>
                <select value={form.risk_profile} onChange={(e) => setForm({ ...form, risk_profile: e.target.value as RiskProfile })} className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Capital Allocation (USD)" type="number" value={form.capital_allocation} onChange={(e) => setForm({ ...form, capital_allocation: Number(e.target.value) })} />
              <Input label="Leverage Limit" type="number" value={form.leverage_limit} onChange={(e) => setForm({ ...form, leverage_limit: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Max Positions" type="number" value={form.max_positions} onChange={(e) => setForm({ ...form, max_positions: Number(e.target.value) })} />
              <Input label="Max Drawdown %" type="number" value={form.max_drawdown_percent} onChange={(e) => setForm({ ...form, max_drawdown_percent: Number(e.target.value) })} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} loading={creating} disabled={!form.name}>Create Strategy</Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
