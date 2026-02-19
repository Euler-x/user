"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Play, Pause, Save } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { PageSpinner } from "@/components/ui/Spinner";
import useStrategies from "@/hooks/useStrategies";
import { formatCurrency, formatDate, capitalize } from "@/lib/utils";
import type { Strategy, StrategyUpdate, RiskProfile } from "@/types";

export default function StrategyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getStrategy, updateStrategy, activateStrategy, pauseStrategy } = useStrategies();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<StrategyUpdate>({});

  useEffect(() => {
    getStrategy(id).then((s) => {
      setStrategy(s);
      setForm({
        name: s.name,
        risk_profile: s.risk_profile,
        leverage_limit: s.leverage_limit,
        max_positions: s.max_positions,
        capital_allocation: s.capital_allocation,
        max_drawdown_percent: s.max_drawdown_percent,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, getStrategy]);

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
  if (!strategy) return <div className="text-center text-gray-500 py-20">Strategy not found</div>;

  return (
    <PageTransition>
      <div className="space-y-6 max-w-3xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Strategies
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{strategy.name}</h1>
            <p className="text-sm text-gray-400 mt-1">
              {capitalize(strategy.strategy_type)} &middot; Created {formatDate(strategy.created_at)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={strategy.is_active ? "success" : "default"}>
              {strategy.is_active ? "Active" : "Paused"}
            </Badge>
            <Button variant="secondary" size="sm" onClick={handleToggle}>
              {strategy.is_active ? <><Pause className="h-3 w-3" /> Pause</> : <><Play className="h-3 w-3" /> Activate</>}
            </Button>
          </div>
        </div>

        <Card>
          <div className="space-y-4">
            <Input label="Name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Risk Profile</label>
              <select value={form.risk_profile || strategy.risk_profile} onChange={(e) => setForm({ ...form, risk_profile: e.target.value as RiskProfile })} className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Capital (USD)" type="number" value={form.capital_allocation ?? strategy.capital_allocation} onChange={(e) => setForm({ ...form, capital_allocation: Number(e.target.value) })} />
              <Input label="Leverage" type="number" value={form.leverage_limit ?? strategy.leverage_limit} onChange={(e) => setForm({ ...form, leverage_limit: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Max Positions" type="number" value={form.max_positions ?? strategy.max_positions} onChange={(e) => setForm({ ...form, max_positions: Number(e.target.value) })} />
              <Input label="Max Drawdown %" type="number" value={form.max_drawdown_percent ?? strategy.max_drawdown_percent} onChange={(e) => setForm({ ...form, max_drawdown_percent: Number(e.target.value) })} />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleSave} loading={saving}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageTransition>
  );
}
