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
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
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

const TABS: { key: Tab; label: string }[] = [
  { key: "referrals", label: "Referrals" },
  { key: "commissions", label: "Commissions" },
  { key: "bonuses", label: "Bonuses" },
  { key: "payouts", label: "Payouts" },
  { key: "training", label: "Training" },
  { key: "leaderboard", label: "Leaderboard" },
];

// ── Rank colour helpers ───────────────────────────────────────────────────────

function rankBadgeVariant(rank: AmbassadorRank): "default" | "info" | "warning" | "neon" {
  switch (rank) {
    case "guide":
      return "info";
    case "strategist":
      return "warning";
    case "master":
      return "neon";
    default:
      return "default";
  }
}

function rankColor(rank: AmbassadorRank): string {
  switch (rank) {
    case "guide":
      return "text-blue-400";
    case "strategist":
      return "text-purple-400";
    case "master":
      return "text-yellow-400";
    default:
      return "text-gray-300";
  }
}

// ── Bonus type badge ──────────────────────────────────────────────────────────

function bonusTypeBadge(type: BonusType) {
  switch (type) {
    case "conversion":
      return <Badge variant="info">Conversion</Badge>;
    case "retention":
      return <Badge variant="success">Retention</Badge>;
    case "milestone":
      return <Badge variant="warning">Milestone</Badge>;
    case "tier_promotion":
      return <Badge variant="warning">Tier Promotion</Badge>;
    case "annual_recognition":
      return <Badge variant="neon">Annual Recognition</Badge>;
  }
}

// ── Payout status badge ───────────────────────────────────────────────────────

function payoutStatusBadge(status: PayoutStatus) {
  switch (status) {
    case "paid":
      return <Badge variant="success">Paid</Badge>;
    case "processing":
      return <Badge variant="info">Processing</Badge>;
    case "failed":
      return <Badge variant="danger">Failed</Badge>;
    default:
      return <Badge variant="warning">Pending</Badge>;
  }
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
    trainingModules,
    loading,
    fetchDashboard,
    fetchLeaderboard,
    fetchReferrals,
    fetchCommissions,
    fetchBonuses,
    fetchPayouts,
    fetchEarningsSummary,
    fetchTraining,
    generateReferral,
    updatePayoutAddress,
  } = useAmbassador();

  const [referral, setReferral] = useState<ReferralResponse | null>(null);
  const [copied, setCopied] = useState(false);
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
  }, [fetchDashboard, fetchLeaderboard, fetchEarningsSummary, fetchReferrals, fetchTraining]);

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

  // Sync payout address input with ambassador data
  useEffect(() => {
    if (ambassador?.payout_address) {
      setPayoutAddressInput(ambassador.payout_address);
    }
  }, [ambassador?.payout_address]);

  const handleGenerate = async () => {
    const data = await generateReferral();
    setReferral(data);
  };

  const handleCopy = () => {
    const link = referral?.referral_link || `https://eulerx.network/ref/${ambassador?.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Ambassador Program</h1>
          <p className="text-sm text-gray-400 mt-1">
            Earn recurring commissions by referring users
          </p>
        </div>

        {/* Referral link + payout address */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Referral link */}
          <Card>
            <p className="text-sm font-medium text-white mb-3">Your Referral Link</p>
            {ambassador?.referral_code || referral ? (
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm text-neon bg-neon/5 px-3 py-1.5 rounded-lg border border-neon/20 font-mono truncate">
                  {referral?.referral_link || `https://eulerx.network/ref/${ambassador?.referral_code}`}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors flex-shrink-0"
                >
                  {copied ? <Check className="h-4 w-4 text-neon" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 flex-1">
                  Generate a referral link to start earning
                </p>
                <Button onClick={handleGenerate} size="sm">
                  Generate Link
                </Button>
              </div>
            )}
          </Card>

          {/* Payout address */}
          <Card>
            <p className="text-sm font-medium text-white mb-3">Payout Address</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={payoutAddressInput}
                onChange={(e) => setPayoutAddressInput(e.target.value)}
                placeholder="0x... wallet address for payouts"
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
          </Card>
        </div>

        {/* Stats row */}
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
                icon: Trophy,
                color: rankColor(earningsSummary.tier_progress.current_rank),
              },
              {
                label: "Active Referrals",
                value: earningsSummary.active_referral_count,
                icon: Users,
                color: "text-blue-400",
              },
              {
                label: "Pending Earnings",
                value: formatCurrency(earningsSummary.total_commission_pending),
                icon: DollarSign,
                color: "text-yellow-400",
              },
              {
                label: "Total Paid Out",
                value: formatCurrency(earningsSummary.total_commission_paid),
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <div className={`text-xl font-bold mt-1 ${stat.color}`}>
                        {stat.value}
                      </div>
                    </div>
                    <stat.icon className={`h-5 w-5 ${stat.color} opacity-40`} />
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tier progress */}
        {tp && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-white">Tier Progress</p>
              {tp.next_rank ? (
                <span className="text-xs text-gray-400">
                  Next: <span className={rankColor(tp.next_rank)}>{capitalize(tp.next_rank)}</span>
                </span>
              ) : (
                <Badge variant="neon">Maximum tier reached</Badge>
              )}
            </div>

            {tp.next_rank && tp.required_active_referrals ? (
              <>
                <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                  <div
                    className="bg-neon h-2 rounded-full transition-all duration-500"
                    style={{ width: `${tierProgressPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {tp.active_referrals} / {tp.required_active_referrals} active referrals needed for{" "}
                  <span className={rankColor(tp.next_rank)}>{capitalize(tp.next_rank)}</span>
                  {tp.required_retention_pct && (
                    <> and {tp.required_retention_pct}% retention rate</>
                  )}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-400">
                You have reached the highest tier. Outstanding performance!
              </p>
            )}
          </Card>
        )}

        {/* Tabs */}
        <div className="border-b border-white/10">
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "text-neon border-neon"
                    : "text-gray-400 border-transparent hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div>
          {/* ── Referrals ── */}
          {activeTab === "referrals" && (
            <Card>
              {referrals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No referrals yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Joined</th>
                        <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Plan</th>
                        <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Price</th>
                        <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {referrals.map((ref, i) => (
                        <tr key={i} className="hover:bg-white/2 transition-colors">
                          <td className="py-3 px-2 text-gray-300">{formatDate(ref.joined_at)}</td>
                          <td className="py-3 px-2 text-white">{ref.plan_name || "—"}</td>
                          <td className="py-3 px-2 text-right text-gray-300">
                            {ref.plan_price != null ? formatCurrency(ref.plan_price) : "—"}
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
              {commissions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No commissions yet</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Month / Year</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Active Refs</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Rate</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Amount</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {commissions.map((c) => (
                          <tr key={c.id} className="hover:bg-white/2 transition-colors">
                            <td className="py-3 px-2 text-gray-300">
                              {new Date(c.year, c.month - 1).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </td>
                            <td className="py-3 px-2 text-right text-gray-300">{c.active_referral_count}</td>
                            <td className="py-3 px-2 text-right text-gray-300">
                              {c.commission_rate != null ? `${c.commission_rate}%` : "—"}
                            </td>
                            <td className="py-3 px-2 text-right text-white font-medium">
                              {formatCurrency(c.commission_amount)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {c.status === "paid" ? (
                                <Badge variant="success">Paid</Badge>
                              ) : (
                                <Badge variant="warning">Pending</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    page={commPage}
                    totalPages={commTotalPages}
                    onPageChange={setCommPage}
                  />
                </>
              )}
            </Card>
          )}

          {/* ── Bonuses ── */}
          {activeTab === "bonuses" && (
            <Card>
              {bonuses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bonuses yet</p>
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bonuses.map((b) => (
                          <tr key={b.id} className="hover:bg-white/2 transition-colors">
                            <td className="py-3 px-2">{bonusTypeBadge(b.bonus_type)}</td>
                            <td className="py-3 px-2 text-gray-400 max-w-xs truncate">{b.description || "—"}</td>
                            <td className="py-3 px-2 text-right text-gray-300">{b.period || "—"}</td>
                            <td className="py-3 px-2 text-right text-white font-medium">
                              {formatCurrency(b.amount)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {b.status === "paid" ? (
                                <Badge variant="success">Paid</Badge>
                              ) : (
                                <Badge variant="warning">Pending</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    page={bonusPage}
                    totalPages={bonusTotalPages}
                    onPageChange={setBonusPage}
                  />
                </>
              )}
            </Card>
          )}

          {/* ── Payouts ── */}
          {activeTab === "payouts" && (
            <Card>
              {payouts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No payouts yet</p>
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
                          <tr key={p.id} className="hover:bg-white/2 transition-colors">
                            <td className="py-3 px-2 text-gray-300">
                              {p.paid_at ? formatDate(p.paid_at) : formatDate(p.created_at)}
                            </td>
                            <td className="py-3 px-2 text-right text-white font-medium">
                              {formatCurrency(p.total_amount)}
                            </td>
                            <td className="py-3 px-2 text-gray-400 font-mono text-xs">
                              {p.payout_address ? shortenAddress(p.payout_address) : "—"}
                            </td>
                            <td className="py-3 px-2 text-right">
                              {payoutStatusBadge(p.status)}
                            </td>
                            <td className="py-3 px-2 text-gray-500 max-w-xs truncate text-xs">
                              {p.admin_notes || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    page={payoutPage}
                    totalPages={payoutTotalPages}
                    onPageChange={setPayoutPage}
                  />
                </>
              )}
            </Card>
          )}

          {/* ── Training ── */}
          {activeTab === "training" && (
            <div className="space-y-6">
              {modulesByTier.map(({ tier, modules }) => (
                <div key={tier}>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className={`h-4 w-4 ${rankColor(tier)}`} />
                    <h3 className={`text-sm font-semibold uppercase tracking-wide ${rankColor(tier)}`}>
                      {capitalize(tier)} Tier
                    </h3>
                  </div>
                  <Card>
                    {modules.length === 0 ? (
                      <p className="text-gray-500 text-sm py-2">No modules for this tier</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {modules.map((mod) => (
                          <div key={mod.key} className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                              {mod.completed ? (
                                <CheckCircle className="h-5 w-5 text-neon flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-600 flex-shrink-0" />
                              )}
                              <div>
                                <p className={`text-sm font-medium ${mod.completed ? "text-white" : "text-gray-400"}`}>
                                  {mod.name}
                                </p>
                                {mod.completed && mod.completed_at && (
                                  <p className="text-xs text-gray-500">
                                    Completed {formatDate(mod.completed_at)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
                              {mod.duration_min} min
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          )}

          {/* ── Leaderboard ── */}
          {activeTab === "leaderboard" && (
            <Card>
              {leaderboard.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No ambassadors yet</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {leaderboard.map((entry) => (
                    <div key={entry.user_id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-500 w-8">
                          #{entry.rank_position}
                        </span>
                        <div>
                          <Badge variant={rankBadgeVariant(entry.ambassador_rank)}>
                            {capitalize(entry.ambassador_rank)}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {entry.total_referrals} referrals
                        </p>
                        <p className="text-xs text-neon">
                          {formatCurrency(entry.rewards_earned)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
