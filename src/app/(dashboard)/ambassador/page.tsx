"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Trophy,
  Gift,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  Wallet,
  MapPin,
  BookOpen,
  CheckCircle,
  Circle,
  Star,
  Award,
  Calendar,
  BarChart2,
  Info,
  ArrowRight,
  ChevronRight,
  Medal,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { PageSpinner } from "@/components/ui/Spinner";
import useAmbassador from "@/hooks/useAmbassador";
import { formatCurrency, formatDate, capitalize, shortenAddress } from "@/lib/utils";
import type {
  AmbassadorRank,
  BonusType,
  PayoutStatus,
  ReferralResponse,
} from "@/types";

// ── Tab definition ────────────────────────────────────────────────────────────

type Tab = "referrals" | "commissions" | "bonuses" | "payouts" | "training" | "leaderboard";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "referrals", label: "Referrals", icon: Users },
  { key: "commissions", label: "Commissions", icon: DollarSign },
  { key: "bonuses", label: "Bonuses", icon: Gift },
  { key: "payouts", label: "Payouts", icon: Wallet },
  { key: "training", label: "Training", icon: BookOpen },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
];

// ── Tier config ───────────────────────────────────────────────────────────────

const TIER_INFO: Record<AmbassadorRank, { rate: number; req: string; color: string; bg: string; border: string }> = {
  scout:      { rate: 15, req: "Starting tier",                color: "text-gray-300",   bg: "bg-gray-500/10",   border: "border-gray-500/20" },
  guide:      { rate: 20, req: "5+ active referrals",          color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  strategist: { rate: 25, req: "15+ refs · 70% retention",     color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  master:     { rate: 30, req: "30+ refs · 80% retention",     color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
};

// ── Rank colour helpers ───────────────────────────────────────────────────────

function rankBadgeVariant(rank: AmbassadorRank): "default" | "info" | "warning" | "neon" {
  switch (rank) {
    case "guide":      return "info";
    case "strategist": return "warning";
    case "master":     return "neon";
    default:           return "default";
  }
}

function rankColor(rank: AmbassadorRank): string {
  return TIER_INFO[rank]?.color ?? "text-gray-300";
}

// ── Bonus type badge ──────────────────────────────────────────────────────────

function bonusTypeBadge(type: BonusType) {
  switch (type) {
    case "conversion":        return <Badge variant="info">Conversion</Badge>;
    case "retention":         return <Badge variant="success">Retention</Badge>;
    case "milestone":         return <Badge variant="warning">Milestone</Badge>;
    case "tier_promotion":    return <Badge variant="warning">Tier Promotion</Badge>;
    case "annual_recognition":return <Badge variant="neon">Annual Recognition</Badge>;
  }
}

// ── Payout status badge ───────────────────────────────────────────────────────

function payoutStatusBadge(status: PayoutStatus) {
  switch (status) {
    case "paid":       return <Badge variant="success">Paid</Badge>;
    case "processing": return <Badge variant="info">Processing</Badge>;
    case "failed":     return <Badge variant="danger">Failed</Badge>;
    default:           return <Badge variant="warning">Pending</Badge>;
  }
}

// ── Leaderboard medal ─────────────────────────────────────────────────────────

function positionDisplay(pos: number) {
  if (pos === 1) return <span className="text-yellow-400 font-bold text-lg">🥇</span>;
  if (pos === 2) return <span className="text-gray-300 font-bold text-lg">🥈</span>;
  if (pos === 3) return <span className="text-amber-600 font-bold text-lg">🥉</span>;
  return <span className="text-sm font-bold text-gray-500 w-8 text-center">#{pos}</span>;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function AmbassadorPage() {
  const {
    ambassador,
    leaderboard,
    referrals,
    commissions,
    bonuses,
    payouts,
    earningsSummary,
    territory,
    trainingModules,
    loading,
    fetchDashboard,
    fetchLeaderboard,
    fetchReferrals,
    fetchCommissions,
    fetchBonuses,
    fetchPayouts,
    fetchEarningsSummary,
    fetchTerritory,
    fetchTraining,
    generateReferral,
    updatePayoutAddress,
  } = useAmbassador();

  const [referral, setReferral] = useState<ReferralResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("referrals");
  const [payoutAddressInput, setPayoutAddressInput] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  // Pagination state
  const [commPage, setCommPage] = useState(1);
  const [commTotalPages, setCommTotalPages] = useState(1);
  const [bonusPage, setBonusPage] = useState(1);
  const [bonusTotalPages, setBonusTotalPages] = useState(1);
  const [payoutPage, setPayoutPage] = useState(1);
  const [payoutTotalPages, setPayoutTotalPages] = useState(1);

  useEffect(() => {
    fetchDashboard();
    fetchLeaderboard();
    fetchEarningsSummary();
    fetchReferrals();
    fetchTraining();
    fetchTerritory();
  }, [fetchDashboard, fetchLeaderboard, fetchEarningsSummary, fetchReferrals, fetchTraining, fetchTerritory]);

  useEffect(() => {
    fetchCommissions({ page: commPage }).then((data) => {
      if (data) setCommTotalPages(data.total_pages);
    });
  }, [commPage, fetchCommissions]);

  useEffect(() => {
    fetchBonuses({ page: bonusPage }).then((data) => {
      if (data) setBonusTotalPages(data.total_pages);
    });
  }, [bonusPage, fetchBonuses]);

  useEffect(() => {
    fetchPayouts({ page: payoutPage }).then((data) => {
      if (data) setPayoutTotalPages(data.total_pages);
    });
  }, [payoutPage, fetchPayouts]);

  useEffect(() => {
    if (ambassador?.payout_address) {
      setPayoutAddressInput(ambassador.payout_address);
    }
  }, [ambassador?.payout_address]);

  const handleGenerate = async () => {
    const data = await generateReferral();
    setReferral(data);
  };

  const referralLink = referral?.referral_link || (ambassador?.referral_code ? `https://eulerx.network/ref/${ambassador.referral_code}` : null);
  const referralCode = referral?.referral_code || ambassador?.referral_code;

  const handleCopy = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveAddress = async () => {
    if (!payoutAddressInput.trim()) return;
    setSavingAddress(true);
    try {
      await updatePayoutAddress(payoutAddressInput.trim());
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading && !ambassador && leaderboard.length === 0) return <PageSpinner />;

  const tp = earningsSummary?.tier_progress;
  const currentRank = tp?.current_rank ?? ambassador?.rank ?? "scout";
  const tierCfg = TIER_INFO[currentRank];

  // Tier progress bar calculation
  const tierProgressPct = tp && tp.required_active_referrals
    ? Math.min(100, Math.round((tp.active_referrals / tp.required_active_referrals) * 100))
    : 100;

  // Group training modules by tier
  const tierOrder: AmbassadorRank[] = ["scout", "guide", "strategist", "master"];
  const modulesByTier = tierOrder.map((tier) => ({
    tier,
    modules: trainingModules.filter((m) => m.tier === tier),
  }));

  const totalModules = trainingModules.length;
  const completedModules = trainingModules.filter((m) => m.completed).length;
  const trainingPct = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Ambassador Program</h1>
              {ambassador && (
                <Badge variant={rankBadgeVariant(currentRank)}>
                  {capitalize(currentRank)}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-400">
              Earn recurring commissions by referring users to EulerX
              {ambassador && (
                <span className="text-gray-600"> · Member since {formatDate(ambassador.created_at)}</span>
              )}
            </p>
          </div>
          {ambassador && (
            <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl ${tierCfg.bg} border ${tierCfg.border}`}>
              <Trophy className={`h-4 w-4 ${tierCfg.color}`} />
              <span className={`text-sm font-semibold ${tierCfg.color}`}>{tierCfg.rate}% Commission Rate</span>
            </div>
          )}
        </div>

        {/* ── Referral link + payout address ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Referral link */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white">Your Referral Link</p>
              {referralCode && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500">Code:</span>
                  <code className="text-xs font-mono text-neon bg-neon/5 px-2 py-0.5 rounded border border-neon/20">
                    {referralCode}
                  </code>
                  <button
                    onClick={handleCopyCode}
                    className="p-1 rounded hover:bg-white/5 transition-colors"
                    title="Copy code"
                  >
                    {copiedCode ? <Check className="h-3 w-3 text-neon" /> : <Copy className="h-3 w-3 text-gray-500" />}
                  </button>
                </div>
              )}
            </div>
            {referralLink ? (
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-neon bg-neon/5 px-3 py-2 rounded-lg border border-neon/20 font-mono truncate">
                  {referralLink}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
                  title="Copy link"
                >
                  {copied ? <Check className="h-4 w-4 text-neon" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 flex-1">
                  Generate a referral link to start earning commissions
                </p>
                <Button onClick={handleGenerate} size="sm">
                  Generate
                </Button>
              </div>
            )}
            {ambassador && (
              <p className="text-xs text-gray-600 mt-2">
                {ambassador.total_referrals} total referrals · {ambassador.team_size} team members
              </p>
            )}
          </Card>

          {/* Payout address */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-medium text-white">Payout Address</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={payoutAddressInput}
                onChange={(e) => setPayoutAddressInput(e.target.value)}
                placeholder="0x... wallet address for commission payouts"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon/50 transition-colors font-mono"
              />
              <Button
                size="sm"
                onClick={handleSaveAddress}
                disabled={savingAddress || !payoutAddressInput.trim()}
              >
                {savingAddress ? "Saving..." : "Save"}
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Admin will process payouts to this address. Keep it up to date.
            </p>
          </Card>
        </div>

        {/* ── Territory card (only if assigned) ── */}
        {territory && (
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neon/10 border border-neon/20">
                <MapPin className="h-4 w-4 text-neon" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{territory.name}</p>
                  <Badge variant="default">{capitalize(territory.territory_type)}</Badge>
                </div>
                {territory.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{territory.description}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Revenue share</p>
                <p className="text-lg font-bold text-neon">{territory.revenue_share_pct}%</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-gray-500">Ambassadors</p>
                <p className="text-lg font-bold text-white">{territory.ambassador_count}</p>
              </div>
            </div>
          </Card>
        )}

        {/* ── Stats row ── */}
        {earningsSummary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Current Tier",
                value: (
                  <Badge variant={rankBadgeVariant(earningsSummary.tier_progress.current_rank)}>
                    {capitalize(earningsSummary.tier_progress.current_rank)}
                  </Badge>
                ),
                sub: `${tierCfg.rate}% commission rate`,
                icon: Trophy,
                color: rankColor(currentRank),
              },
              {
                label: "Active Referrals",
                value: earningsSummary.active_referral_count,
                sub: `${(earningsSummary.retention_rate * 100).toFixed(0)}% retention rate`,
                icon: Users,
                color: "text-blue-400",
              },
              {
                label: "This Month",
                value: formatCurrency(earningsSummary.current_month_commission),
                sub: `${formatCurrency(earningsSummary.total_commission_pending)} pending`,
                icon: TrendingUp,
                color: "text-yellow-400",
              },
              {
                label: "Total Paid Out",
                value: formatCurrency(earningsSummary.total_commission_paid),
                sub: `Next payout: ${earningsSummary.next_payout_date}`,
                icon: Gift,
                color: "text-neon",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlowCard>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {stat.label}
                      </p>
                      <div className={`text-xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">{stat.sub}</p>
                    </div>
                    <stat.icon className={`h-5 w-5 ${stat.color} opacity-30 flex-shrink-0 ml-2`} />
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Tier progress + structure ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Tier progress bar */}
          {tp && (
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-white">Tier Progress</p>
                  {tp.next_rank ? (
                    <span className="text-xs text-gray-400">
                      Next: <span className={rankColor(tp.next_rank)}>{capitalize(tp.next_rank)}</span>
                      {" "}({TIER_INFO[tp.next_rank].rate}%)
                    </span>
                  ) : (
                    <Badge variant="neon">Maximum tier reached</Badge>
                  )}
                </div>

                {/* Tier stepper */}
                <div className="flex items-center gap-1 mb-4">
                  {tierOrder.map((tier, i) => {
                    const isActive = tier === currentRank;
                    const isPast = tierOrder.indexOf(tier) < tierOrder.indexOf(currentRank);
                    const cfg = TIER_INFO[tier];
                    return (
                      <div key={tier} className="flex items-center flex-1">
                        <div className={`flex-1 flex flex-col items-center gap-1`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            isActive ? `${cfg.bg} ${cfg.border} ${cfg.color}` :
                            isPast ? "bg-neon/20 border-neon/40 text-neon" :
                            "bg-white/5 border-white/10 text-gray-600"
                          }`}>
                            {isPast ? <Check className="h-3.5 w-3.5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                          </div>
                          <span className={`text-xs font-medium ${isActive ? cfg.color : isPast ? "text-gray-400" : "text-gray-600"}`}>
                            {capitalize(tier)}
                          </span>
                          <span className="text-xs text-gray-600">{cfg.rate}%</span>
                        </div>
                        {i < tierOrder.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 rounded ${isPast ? "bg-neon/40" : "bg-white/5"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>

                {tp.next_rank && tp.required_active_referrals ? (
                  <>
                    <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
                      <div
                        className="bg-neon h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${tierProgressPct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{tp.active_referrals} active referrals</span>
                      <span>
                        {tp.required_active_referrals - tp.active_referrals} more needed for{" "}
                        <span className={rankColor(tp.next_rank)}>{capitalize(tp.next_rank)}</span>
                        {tp.required_retention_pct && ` · ${tp.required_retention_pct}% retention required`}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-gray-500">
                    You have reached the <span className="text-yellow-400 font-medium">Master</span> tier — the highest level. Outstanding performance!
                  </p>
                )}
              </Card>
            </div>
          )}

          {/* Commission structure */}
          <Card>
            <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-gray-400" />
              Commission Structure
            </p>
            <div className="space-y-2">
              {tierOrder.map((tier) => {
                const cfg = TIER_INFO[tier];
                const isActive = tier === currentRank;
                return (
                  <div
                    key={tier}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border transition-all ${
                      isActive ? `${cfg.bg} ${cfg.border}` : "bg-white/[0.02] border-white/5"
                    }`}
                  >
                    <div>
                      <span className={`text-xs font-semibold ${isActive ? cfg.color : "text-gray-400"}`}>
                        {capitalize(tier)}
                        {isActive && <span className="ml-1.5 text-xs font-normal text-gray-500">(you)</span>}
                      </span>
                      <p className="text-xs text-gray-600 mt-0.5">{cfg.req}</p>
                    </div>
                    <span className={`text-sm font-bold ${isActive ? cfg.color : "text-gray-500"}`}>
                      {cfg.rate}%
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              Commission is calculated on referred users&apos; active subscription price each month.
            </p>
          </Card>
        </div>

        {/* ── Tabs ── */}
        <div className="border-b border-white/10">
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "text-neon border-neon"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div>

          {/* ── Referrals ── */}
          {activeTab === "referrals" && (
            <Card>
              {referrals.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium">{referrals.length}</span> referred users ·{" "}
                    <span className="text-neon font-medium">{referrals.filter((r) => r.is_subscribed).length} subscribed</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    Retention: {referrals.length > 0 ? Math.round((referrals.filter((r) => r.is_subscribed).length / referrals.length) * 100) : 0}%
                  </p>
                </div>
              )}
              {referrals.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No referrals yet"
                  description="Share your referral link to start earning recurring commissions when your referrals subscribe."
                  actionLabel="Copy Referral Link"
                  onAction={handleCopy}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Joined</th>
                        <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Tier</th>
                        <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Plan</th>
                        <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Price / mo</th>
                        <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {referrals.map((ref, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-2 text-gray-300">{formatDate(ref.joined_at)}</td>
                          <td className="py-3 px-2">
                            <Badge variant={rankBadgeVariant(ref.rank)}>{capitalize(ref.rank)}</Badge>
                          </td>
                          <td className="py-3 px-2 text-white">{ref.plan_name || <span className="text-gray-600">—</span>}</td>
                          <td className="py-3 px-2 text-right text-gray-300">
                            {ref.plan_price != null ? formatCurrency(ref.plan_price) : <span className="text-gray-600">—</span>}
                          </td>
                          <td className="py-3 px-2 text-right">
                            {ref.is_subscribed ? (
                              <Badge variant="success">Subscribed</Badge>
                            ) : (
                              <Badge variant="default">Inactive</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* ── Commissions ── */}
          {activeTab === "commissions" && (
            <Card>
              {commissions.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">Monthly commission records</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      Paid: <span className="text-neon font-medium">
                        {formatCurrency(commissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.commission_amount, 0))}
                      </span>
                    </span>
                    <span>
                      Pending: <span className="text-yellow-400 font-medium">
                        {formatCurrency(commissions.filter((c) => c.status !== "paid").reduce((s, c) => s + c.commission_amount, 0))}
                      </span>
                    </span>
                  </div>
                </div>
              )}
              {commissions.length === 0 ? (
                <EmptyState
                  icon={DollarSign}
                  title="No commissions yet"
                  description="Commissions are calculated monthly based on your active referrals' subscriptions."
                />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Month</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Active Refs</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Rate</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Amount</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Status</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Paid On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {commissions.map((c) => (
                          <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-2 text-gray-300 font-medium">
                              {new Date(c.year, c.month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </td>
                            <td className="py-3 px-2 text-right text-gray-300">{c.active_referral_count}</td>
                            <td className="py-3 px-2 text-right text-gray-300">
                              {c.commission_rate != null ? `${c.commission_rate}%` : <span className="text-gray-600">—</span>}
                            </td>
                            <td className="py-3 px-2 text-right font-semibold text-white">
                              {formatCurrency(c.commission_amount)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {c.status === "paid" ? (
                                <Badge variant="success">Paid</Badge>
                              ) : (
                                <Badge variant="warning">Pending</Badge>
                              )}
                            </td>
                            <td className="py-3 px-2 text-right text-gray-500 text-xs">
                              {c.paid_at ? formatDate(c.paid_at) : <span className="text-gray-700">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={commPage} totalPages={commTotalPages} onPageChange={setCommPage} />
                </>
              )}
            </Card>
          )}

          {/* ── Bonuses ── */}
          {activeTab === "bonuses" && (
            <Card>
              {bonuses.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">Special bonuses and rewards</p>
                  <p className="text-xs text-gray-500">
                    Total: <span className="text-neon font-medium">{formatCurrency(bonuses.reduce((s, b) => s + b.amount, 0))}</span>
                  </p>
                </div>
              )}
              {bonuses.length === 0 ? (
                <EmptyState
                  icon={Gift}
                  title="No bonuses yet"
                  description="Earn conversion, retention, milestone, and annual recognition bonuses as you grow your team."
                />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Type</th>
                          <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Description</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Period</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Amount</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Status</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Paid On</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bonuses.map((b) => (
                          <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3 px-2">{bonusTypeBadge(b.bonus_type)}</td>
                            <td className="py-3 px-2 text-gray-400 max-w-xs truncate">{b.description || <span className="text-gray-600">—</span>}</td>
                            <td className="py-3 px-2 text-right text-gray-300">{b.period || <span className="text-gray-600">—</span>}</td>
                            <td className="py-3 px-2 text-right font-semibold text-white">
                              {formatCurrency(b.amount)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {b.status === "paid" ? (
                                <Badge variant="success">Paid</Badge>
                              ) : (
                                <Badge variant="warning">Pending</Badge>
                              )}
                            </td>
                            <td className="py-3 px-2 text-right text-gray-500 text-xs">
                              {b.paid_at ? formatDate(b.paid_at) : <span className="text-gray-700">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination page={bonusPage} totalPages={bonusTotalPages} onPageChange={setBonusPage} />
                </>
              )}
            </Card>
          )}

          {/* ── Payouts ── */}
          {activeTab === "payouts" && (
            <div className="space-y-4">
              {/* Payout summary banner */}
              {earningsSummary && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Paid", value: formatCurrency(earningsSummary.total_commission_paid), color: "text-neon" },
                    { label: "Pending", value: formatCurrency(earningsSummary.total_commission_pending), color: "text-yellow-400" },
                    { label: "Next Payout", value: earningsSummary.next_payout_date, color: "text-blue-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-center">
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <Card>
                {payouts.length === 0 ? (
                  <EmptyState
                    icon={Wallet}
                    title="No payouts yet"
                    description="Once your pending commissions are processed by the admin team, they will appear here. Make sure your payout address is set."
                  />
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Date</th>
                            <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Amount</th>
                            <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Address</th>
                            <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Status</th>
                            <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {payouts.map((p) => (
                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-2 text-gray-300">
                                {p.paid_at ? formatDate(p.paid_at) : formatDate(p.created_at)}
                              </td>
                              <td className="py-3 px-2 text-right font-semibold text-white">
                                {formatCurrency(p.total_amount)}
                              </td>
                              <td className="py-3 px-2 text-gray-400 font-mono text-xs">
                                {p.payout_address ? shortenAddress(p.payout_address) : <span className="text-gray-600">—</span>}
                              </td>
                              <td className="py-3 px-2 text-right">{payoutStatusBadge(p.status)}</td>
                              <td className="py-3 px-2 text-gray-500 max-w-xs truncate text-xs">
                                {p.admin_notes || <span className="text-gray-700">—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Pagination page={payoutPage} totalPages={payoutTotalPages} onPageChange={setPayoutPage} />
                  </>
                )}
              </Card>
            </div>
          )}

          {/* ── Training ── */}
          {activeTab === "training" && (
            <div className="space-y-4">
              {/* Overall progress */}
              {totalModules > 0 && (
                <Card>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">Overall Training Progress</p>
                    <span className="text-xs text-gray-400">{completedModules} / {totalModules} completed</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 mb-1">
                    <div
                      className="bg-neon h-2 rounded-full transition-all duration-700"
                      style={{ width: `${trainingPct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{trainingPct}% complete</p>
                </Card>
              )}

              {/* Modules by tier */}
              <div className="space-y-4">
                {modulesByTier.map(({ tier, modules }) => {
                  if (modules.length === 0) return null;
                  const tierCompleted = modules.filter((m) => m.completed).length;
                  const tierTotal = modules.length;
                  const tierPct = tierTotal > 0 ? Math.round((tierCompleted / tierTotal) * 100) : 0;
                  const cfg = TIER_INFO[tier];
                  return (
                    <div key={tier}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className={`h-4 w-4 ${cfg.color}`} />
                          <h3 className={`text-sm font-semibold uppercase tracking-wide ${cfg.color}`}>
                            {capitalize(tier)} Tier
                          </h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 bg-white/5 rounded-full h-1">
                              <div
                                className={`h-1 rounded-full transition-all duration-500 ${
                                  tierPct === 100 ? "bg-neon" : `bg-current ${cfg.color}`
                                }`}
                                style={{ width: `${tierPct}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{tierCompleted}/{tierTotal}</span>
                          </div>
                          {tierPct === 100 && <Badge variant="success">Complete</Badge>}
                        </div>
                      </div>
                      <Card>
                        <div className="divide-y divide-white/5">
                          {modules.map((mod) => (
                            <div key={mod.key} className="flex items-center justify-between py-3.5">
                              <div className="flex items-center gap-3">
                                {mod.completed ? (
                                  <CheckCircle className="h-5 w-5 text-neon flex-shrink-0" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-700 flex-shrink-0" />
                                )}
                                <div>
                                  <p className={`text-sm font-medium ${mod.completed ? "text-white" : "text-gray-400"}`}>
                                    {mod.name}
                                  </p>
                                  {mod.completed && mod.completed_at ? (
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Completed {formatDate(mod.completed_at)}
                                    </p>
                                  ) : (
                                    <p className="text-xs text-gray-600 mt-0.5">Not yet completed</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                <span className="text-xs text-gray-600">{mod.duration_min} min</span>
                                {mod.completed && <Badge variant="success">Done</Badge>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  );
                })}
                {totalModules === 0 && (
                  <EmptyState
                    icon={BookOpen}
                    title="No training modules"
                    description="Training modules will appear here as they become available."
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Leaderboard ── */}
          {activeTab === "leaderboard" && (
            <div className="space-y-4">
              {/* Top 3 spotlight */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-3">
                  {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
                    if (!entry) return null;
                    const podiumOrder = [1, 0, 2];
                    const isCentre = i === 1;
                    return (
                      <motion.div
                        key={entry.user_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: podiumOrder[i] * 0.1 }}
                      >
                        <GlowCard className={isCentre ? "border-yellow-400/30" : ""}>
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="text-2xl">{positionDisplay(entry.rank_position)}</div>
                            <Badge variant={rankBadgeVariant(entry.ambassador_rank)}>
                              {capitalize(entry.ambassador_rank)}
                            </Badge>
                            <div>
                              <p className="text-sm font-bold text-white">{entry.total_referrals} referrals</p>
                              <p className="text-xs text-neon font-medium">{formatCurrency(entry.rewards_earned)}</p>
                            </div>
                          </div>
                        </GlowCard>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* Full list */}
              <Card>
                {leaderboard.length === 0 ? (
                  <EmptyState
                    icon={Trophy}
                    title="Leaderboard is empty"
                    description="Be the first ambassador to appear on the leaderboard."
                  />
                ) : (
                  <div className="divide-y divide-white/5">
                    {leaderboard.map((entry, i) => {
                      const isTop3 = entry.rank_position <= 3;
                      return (
                        <div
                          key={entry.user_id}
                          className={`flex items-center justify-between py-3.5 ${isTop3 ? "bg-white/[0.01]" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 flex justify-center">{positionDisplay(entry.rank_position)}</div>
                            <Badge variant={rankBadgeVariant(entry.ambassador_rank)}>
                              {capitalize(entry.ambassador_rank)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-6 text-right">
                            <div>
                              <p className="text-xs text-gray-500">Referrals</p>
                              <p className="text-sm font-semibold text-white">{entry.total_referrals}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Earned</p>
                              <p className="text-sm font-semibold text-neon">{formatCurrency(entry.rewards_earned)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
