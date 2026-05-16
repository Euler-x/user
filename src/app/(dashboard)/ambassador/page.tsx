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
  BookOpen,
  CheckCircle,
  Circle,
  Star,
  Award,
  Calendar,
  BarChart2,
  Info,
  ArrowRight,
  Medal,
  HelpCircle,
  Zap,
  Target,
  Shield,
  Clock,
  ChevronDown,
  Share2,
  Layers,
  Plane,
  MapPin,
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
  TravelStatus,
} from "@/types";

// ── Tab definition ────────────────────────────────────────────────────────────

type Tab = "program" | "referrals" | "commissions" | "bonuses" | "payouts" | "travel" | "training" | "leaderboard";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "program",      label: "Program",     icon: Info },
  { key: "referrals",    label: "Referrals",   icon: Users },
  { key: "commissions",  label: "Commissions", icon: DollarSign },
  { key: "bonuses",      label: "Bonuses",     icon: Gift },
  { key: "payouts",      label: "Payouts",     icon: Wallet },
  { key: "travel",       label: "Travel",      icon: Plane },
  { key: "training",     label: "Training",    icon: BookOpen },
  { key: "leaderboard",  label: "Leaderboard", icon: Trophy },
];

// ── V2 Rank config ────────────────────────────────────────────────────────────

const RANK_INFO: Record<AmbassadorRank, { label: string; color: string; bg: string; border: string; maxDepth: number }> = {
  associate:        { label: "Associate",        color: "text-gray-400",    bg: "bg-gray-500/10",    border: "border-gray-500/20",   maxDepth: 1 },
  bronze_leader:    { label: "Bronze Leader",    color: "text-amber-600",   bg: "bg-amber-600/10",   border: "border-amber-600/20",  maxDepth: 2 },
  silver_leader:    { label: "Silver Leader",    color: "text-gray-300",    bg: "bg-gray-300/10",    border: "border-gray-300/20",   maxDepth: 3 },
  gold_leader:      { label: "Gold Leader",      color: "text-yellow-400",  bg: "bg-yellow-400/10",  border: "border-yellow-400/20", maxDepth: 4 },
  platinum_leader:  { label: "Platinum Leader",  color: "text-blue-300",    bg: "bg-blue-300/10",    border: "border-blue-300/20",   maxDepth: 5 },
  diamond_leader:   { label: "Diamond Leader",   color: "text-cyan-400",    bg: "bg-cyan-400/10",    border: "border-cyan-400/20",   maxDepth: 6 },
  elite_diamond:    { label: "Elite Diamond",    color: "text-purple-400",  bg: "bg-purple-400/10",  border: "border-purple-400/20", maxDepth: 7 },
  black_diamond:    { label: "Black Diamond",    color: "text-slate-300",   bg: "bg-slate-300/10",   border: "border-slate-300/20",  maxDepth: 8 },
  crown_ambassador: { label: "Crown Ambassador", color: "text-orange-400",  bg: "bg-orange-400/10",  border: "border-orange-400/20", maxDepth: 9 },
  grand_crown:      { label: "Grand Crown",      color: "text-neon",        bg: "bg-neon/10",        border: "border-neon/20",       maxDepth: 10 },
};

const RANK_ORDER: AmbassadorRank[] = [
  "associate", "bronze_leader", "silver_leader", "gold_leader", "platinum_leader",
  "diamond_leader", "elite_diamond", "black_diamond", "crown_ambassador", "grand_crown",
];

// ── Level commission rates ────────────────────────────────────────────────────

const LEVEL_RATES: Record<number, number> = {
  1: 25, 2: 8, 3: 5, 4: 4, 5: 3, 6: 3, 7: 2, 8: 2, 9: 2, 10: 2,
};

const SUBSCRIPTION_PRICE = 100;
const LOYALTY_BONUS_RATE = 10;

// ── Rank advancement bonuses ──────────────────────────────────────────────────

const RANK_ADVANCEMENT_BONUSES: Partial<Record<AmbassadorRank, string>> = {
  bronze_leader:    "$250",
  silver_leader:    "$750",
  gold_leader:      "$2,500",
  platinum_leader:  "$5,000",
  diamond_leader:   "$15,000",
  elite_diamond:    "$30,000",
  black_diamond:    "$75,000",
  crown_ambassador: "$150,000",
  grand_crown:      "$500,000",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function rankBadgeVariant(rank: AmbassadorRank): "default" | "info" | "warning" | "neon" | "success" {
  switch (rank) {
    case "bronze_leader":
    case "gold_leader":
    case "elite_diamond":    return "warning";
    case "silver_leader":
    case "platinum_leader":
    case "diamond_leader":
    case "black_diamond":    return "info";
    case "crown_ambassador":
    case "grand_crown":      return "neon";
    default:                 return "default";
  }
}

function rankLabel(rank: AmbassadorRank): string {
  return RANK_INFO[rank]?.label ?? capitalize(rank);
}

function rankColor(rank: AmbassadorRank): string {
  return RANK_INFO[rank]?.color ?? "text-gray-300";
}

function bonusTypeBadge(type: BonusType) {
  switch (type) {
    case "rank_advancement":       return <Badge variant="warning">Rank Advancement</Badge>;
    case "performance_milestone":  return <Badge variant="info">Performance Milestone</Badge>;
    case "fast_start":             return <Badge variant="neon">Fast Start</Badge>;
    case "loyalty_retention":      return <Badge variant="success">Loyalty Retention</Badge>;
    case "leadership_pool":        return <Badge variant="info">Leadership Pool</Badge>;
    case "generational_override":  return <Badge variant="warning">Generational Override</Badge>;
    default:                       return <Badge variant="default">{String(type)}</Badge>;
  }
}

function payoutStatusBadge(status: PayoutStatus) {
  switch (status) {
    case "paid":       return <Badge variant="success">Paid</Badge>;
    case "processing": return <Badge variant="info">Processing</Badge>;
    case "failed":     return <Badge variant="danger">Failed</Badge>;
    default:           return <Badge variant="warning">Pending</Badge>;
  }
}

function travelStatusBadge(status: TravelStatus) {
  switch (status) {
    case "awarded":    return <Badge variant="neon">Awarded</Badge>;
    case "qualified":  return <Badge variant="success">Qualified</Badge>;
    case "expired":    return <Badge variant="danger">Expired</Badge>;
    default:           return <Badge variant="warning">Qualifying</Badge>;
  }
}

function positionDisplay(pos: number) {
  if (pos === 1) return <span className="text-yellow-400 font-bold text-lg">🥇</span>;
  if (pos === 2) return <span className="text-gray-300 font-bold text-lg">🥈</span>;
  if (pos === 3) return <span className="text-amber-600 font-bold text-lg">🥉</span>;
  return <span className="text-sm font-bold text-gray-500 w-8 text-center">#{pos}</span>;
}

// ── FAQ data ──────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "How much can I realistically earn?",
    a: "At Associate, a single direct subscriber earns you $25/month (25% of $100). Higher ranks unlock deeper downline levels, and Diamond+ ambassadors also receive a share of the monthly 2% Leadership Revenue Pool.",
  },
  {
    q: "What is PAR vs TAV?",
    a: "PAR (Personal Active Referrals) counts your direct L1 referrals who have an active subscription. TAV (Team Active Volume) counts all active subscribers across your entire downline. Both are used to determine your rank qualification.",
  },
  {
    q: "When do I get paid?",
    a: "Commissions are calculated at the end of each month and paid on the 15th of the following month. Rank Advancement Bonuses and Fast Start Bonuses are credited when earned and paid in the next payout cycle.",
  },
  {
    q: "What is the Fast Start Bonus?",
    a: "If you recruit 5 active subscribers within your first 30 days, you earn $500. This repeats for your second and third 30-day periods — up to $1,500 total in your first 90 days.",
  },
  {
    q: "What is the Leadership Revenue Pool?",
    a: "2% of all global subscription revenue each month is split equally among all Diamond Leader and above ambassadors. For example, if total monthly subscription revenue is $500,000, the pool is $10,000 split among all Diamond+ ambassadors.",
  },
  {
    q: "How does the Generational Override work?",
    a: "Crown Ambassador and Grand Crown earn an additional 1% on all active subscribers in levels 11 and deeper within their downline, with no depth limit.",
  },
];

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
    travelIncentives,
    trainingModules,
    trainingStats,
    loading,
    fetchDashboard,
    fetchLeaderboard,
    fetchReferrals,
    fetchCommissions,
    fetchBonuses,
    fetchPayouts,
    fetchEarningsSummary,
    fetchTravel,
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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedComm, setExpandedComm] = useState<string | null>(null);

  // Pagination
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
    fetchTravel();
  }, [fetchDashboard, fetchLeaderboard, fetchEarningsSummary, fetchReferrals, fetchTraining, fetchTravel]);

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

  const referralLink = referral?.referral_link || (ambassador?.referral_code ? `https://eulerx.io/ref/${ambassador.referral_code}` : null);
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

  const rp = earningsSummary?.rank_progress;
  const currentRank: AmbassadorRank = rp?.current_rank ?? ambassador?.rank ?? "associate";
  const rankCfg = RANK_INFO[currentRank] ?? RANK_INFO.associate;

  // PAR/TAV progress percentages
  const parPct = rp?.par_required
    ? Math.min(100, Math.round(((rp.par_count) / rp.par_required) * 100))
    : 100;
  const tavPct = rp?.tav_required
    ? Math.min(100, Math.round(((rp.tav_count) / rp.tav_required) * 100))
    : 100;

  // Group training by rank
  const modulesByRank = RANK_ORDER.map((rank) => ({
    rank,
    modules: trainingModules.filter((m) => m.rank === rank),
  })).filter(({ modules }) => modules.length > 0);

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
                  {rankLabel(currentRank)}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-400">
              Multi-level compensation programme — earn on up to {rankCfg.maxDepth} level{rankCfg.maxDepth !== 1 ? "s" : ""} deep
              {ambassador && (
                <span className="text-gray-600"> · Member since {formatDate(ambassador.created_at)}</span>
              )}
            </p>
          </div>
          {ambassador && (
            <div className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl ${rankCfg.bg} border ${rankCfg.border}`}>
              <Layers className={`h-4 w-4 ${rankCfg.color}`} />
              <span className={`text-sm font-semibold ${rankCfg.color}`}>L1: 25% · L2: 8% · L3+: 2-5%</span>
            </div>
          )}
        </div>

        {/* ── Referral link + payout address ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                >
                  {copied ? <Check className="h-4 w-4 text-neon" /> : <Copy className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500 flex-1">Generate a referral link to start earning</p>
                <Button onClick={handleGenerate} size="sm">Generate</Button>
              </div>
            )}
            {ambassador && (
              <p className="text-xs text-gray-600 mt-2">
                {ambassador.total_referrals} total referrals · PAR: {ambassador.par_count} · TAV: {ambassador.tav_count}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
              <Share2 className="h-3 w-3 text-gray-600" />
              Share anywhere — it tracks automatically across all devices
            </p>
          </Card>

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
              <Button size="sm" onClick={handleSaveAddress} disabled={savingAddress || !payoutAddressInput.trim()}>
                {savingAddress ? "Saving..." : "Save"}
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Admin processes payouts to this address monthly on the 15th.
            </p>
          </Card>
        </div>

        {/* ── Stats row ── */}
        {earningsSummary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Current Rank",
                value: <Badge variant={rankBadgeVariant(currentRank)}>{rankLabel(currentRank)}</Badge>,
                sub: `Earns on ${rankCfg.maxDepth} level${rankCfg.maxDepth !== 1 ? "s" : ""} deep`,
                icon: Trophy,
                color: rankColor(currentRank),
              },
              {
                label: "PAR / TAV",
                value: `${earningsSummary.active_referral_count} / ${earningsSummary.tav_count}`,
                sub: "Active direct / total team subs",
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
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlowCard>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{stat.label}</p>
                      <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                      <p className="text-xs text-gray-600 mt-1 truncate">{stat.sub}</p>
                    </div>
                    <stat.icon className={`h-5 w-5 ${stat.color} opacity-30 flex-shrink-0 ml-2`} />
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Rank Progress ── */}
        {rp && rp.next_rank && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Rank Progress</p>
              <span className="text-xs text-gray-400">
                Next: <span className={rankColor(rp.next_rank)}>{rankLabel(rp.next_rank)}</span>
                {rp.next_depth && <span className="text-gray-600"> · earns on {rp.next_depth} levels</span>}
              </span>
            </div>
            <div className="space-y-3">
              {/* PAR progress */}
              {rp.par_required != null && (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>PAR (Direct active subs)</span>
                    <span className={rp.par_count >= rp.par_required ? "text-neon font-medium" : ""}>
                      {rp.par_count} / {rp.par_required}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className="bg-blue-400 h-1.5 rounded-full transition-all duration-700" style={{ width: `${parPct}%` }} />
                  </div>
                </div>
              )}
              {/* TAV progress */}
              {rp.tav_required != null && (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>TAV (Total team active subs)</span>
                    <span className={rp.tav_count >= rp.tav_required ? "text-neon font-medium" : ""}>
                      {rp.tav_count} / {rp.tav_required}
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-700" style={{ width: `${tavPct}%` }} />
                  </div>
                </div>
              )}
              {/* Qualifying legs */}
              {rp.legs_required != null && rp.legs_required > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Qualifying legs ({rp.leg_rank_required} or above)
                  </span>
                  <span className={rp.qualifying_legs >= rp.legs_required ? "text-neon font-medium" : "text-gray-400"}>
                    {rp.qualifying_legs} / {rp.legs_required}
                  </span>
                </div>
              )}
            </div>
            {/* Fast Start indicator */}
            {earningsSummary?.fast_start_eligible && (
              <div className="mt-3 px-3 py-2 rounded-lg bg-neon/5 border border-neon/20">
                <p className="text-xs text-neon flex items-center gap-1.5">
                  <Zap className="h-3 w-3" />
                  Fast Start active — get 5 direct subs in period {earningsSummary.fast_start_period} to earn $500 bonus!
                </p>
              </div>
            )}
          </Card>
        )}

        {/* ── Tabs ── */}
        <div className="border-b border-white/10">
          <div className="flex gap-1 overflow-x-auto pb-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.key ? "text-neon border-neon" : "text-gray-400 border-transparent hover:text-white"
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

          {/* ── Program ── */}
          {activeTab === "program" && (
            <div className="space-y-6">

              {/* How It Works */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-neon" />
                  How It Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { step: 1, icon: Share2, title: "Share Your Link", desc: "Share your unique referral link via social media, email, Discord, or any channel. Everyone who signs up using your link is permanently attributed to you." },
                    { step: 2, icon: Users, title: "Build Your Network", desc: "Your direct referrals can also become ambassadors and recruit their own teams — you earn commissions on their downline too, up to 10 levels deep." },
                    { step: 3, icon: DollarSign, title: "Earn Multi-Level", desc: "Earn 25% on L1, 8% on L2, 5% on L3 — all the way to L10. The higher your rank, the deeper you earn. Crown+ ambassadors earn 1% on unlimited depth." },
                  ].map((item) => (
                    <Card key={item.step}>
                      <div className="flex flex-col items-center text-center gap-3 py-2">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center">
                            <item.icon className="h-5 w-5 text-neon" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon text-black text-xs font-bold flex items-center justify-center">
                            {item.step}
                          </div>
                        </div>
                        <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Multi-level commission rates */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-400" />
                  Multi-Level Commission Rates
                </h2>
                <Card>
                  <p className="text-xs text-gray-500 mb-3">Subscription price is $100/month. Commission = price × level rate.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Level</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Rate</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Per Sub / mo</th>
                          <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Unlocked At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {([1,2,3,4,5,6,7,8,9,10] as const).map((lvl) => {
                          const rate = LEVEL_RATES[lvl];
                          const perSub = (SUBSCRIPTION_PRICE * rate) / 100;
                          const unlockRank: AmbassadorRank = (["associate","bronze_leader","silver_leader","gold_leader","platinum_leader","diamond_leader","elite_diamond","black_diamond","crown_ambassador","grand_crown"] as AmbassadorRank[])[lvl - 1];
                          const isCurrentOrBelow = RANK_ORDER.indexOf(currentRank) >= lvl - 1;
                          return (
                            <tr key={lvl} className={`hover:bg-white/[0.02] ${isCurrentOrBelow ? "bg-white/[0.01]" : ""}`}>
                              <td className="py-3 px-2 text-gray-300 font-medium">Level {lvl}</td>
                              <td className={`py-3 px-2 text-right font-bold ${isCurrentOrBelow ? "text-neon" : "text-gray-500"}`}>{rate}%</td>
                              <td className={`py-3 px-2 text-right ${isCurrentOrBelow ? "text-white" : "text-gray-600"}`}>
                                {isCurrentOrBelow ? `$${perSub.toFixed(2)}` : "—"}
                              </td>
                              <td className="py-3 px-2">
                                <Badge variant={rankBadgeVariant(unlockRank)}>{rankLabel(unlockRank)}</Badge>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="bg-orange-400/5 hover:bg-orange-400/10">
                          <td className="py-3 px-2 text-orange-400 font-medium">L11+</td>
                          <td className="py-3 px-2 text-right font-bold text-orange-400">1%</td>
                          <td className="py-3 px-2 text-right text-orange-400">${(SUBSCRIPTION_PRICE * 0.01).toFixed(2)}</td>
                          <td className="py-3 px-2">
                            <Badge variant="neon">Crown Ambassador</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* 10-rank system */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  10-Rank Progression
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {RANK_ORDER.map((rank) => {
                    const cfg = RANK_INFO[rank] ?? RANK_INFO.associate;
                    const isActive = rank === currentRank;
                    const bonus = RANK_ADVANCEMENT_BONUSES[rank];
                    return (
                      <div key={rank} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${isActive ? `${cfg.bg} ${cfg.border}` : "bg-white/[0.02] border-white/5"}`}>
                        <div className={`w-8 h-8 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0`}>
                          <Trophy className={`h-4 w-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                            {isActive && <Badge variant={rankBadgeVariant(rank)}>Current</Badge>}
                          </div>
                          <p className="text-xs text-gray-500">
                            Earns on {cfg.maxDepth} level{cfg.maxDepth !== 1 ? "s" : ""} deep
                            {bonus && <span className="text-gray-600"> · {bonus} advancement bonus</span>}
                          </p>
                        </div>
                        {bonus && (
                          <span className="text-xs font-bold text-neon flex-shrink-0">{bonus}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bonus structure */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-purple-400" />
                  Bonus Structure
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <p className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-neon" />
                      Fast Start Bonus
                    </p>
                    <p className="text-xs text-gray-500 mb-3">Recruit 5 active subscribers in a 30-day window</p>
                    <div className="space-y-2">
                      {[1, 2, 3].map((period) => (
                        <div key={period} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                          <span className="text-xs text-gray-300">Period {period} (days {(period - 1) * 30 + 1}–{period * 30})</span>
                          <span className="text-xs font-bold text-neon">$500</span>
                        </div>
                      ))}
                      <p className="text-xs text-gray-600 pt-1">Up to $1,500 total in first 90 days</p>
                    </div>
                  </Card>

                  <Card>
                    <p className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-400" />
                      Loyalty Retention Bonus
                    </p>
                    <p className="text-xs text-gray-500 mb-3">10% of plan price per L1 subscriber with 12+ months continuous</p>
                    <div className="px-3 py-3 rounded-lg bg-green-400/5 border border-green-400/20">
                      <p className="text-sm font-bold text-green-400">${((SUBSCRIPTION_PRICE * LOYALTY_BONUS_RATE) / 100).toFixed(2)} / subscriber / month</p>
                      <p className="text-xs text-gray-500 mt-1">e.g. 10 loyal subscribers = $100 extra/month</p>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Calculated monthly alongside regular commissions.</p>
                  </Card>

                  <Card>
                    <p className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      Performance Milestones
                    </p>
                    <p className="text-xs text-gray-500 mb-3">One-time bonuses for hitting key milestones</p>
                    <div className="space-y-2">
                      {[
                        { label: "5 active direct referrals", bonus: "$100" },
                        { label: "10 active direct referrals", bonus: "$250" },
                        { label: "25 active direct referrals", bonus: "$500" },
                        { label: "$5,000 total earnings", bonus: "$250" },
                        { label: "$25,000 total earnings", bonus: "$1,000" },
                      ].map((m) => (
                        <div key={m.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2">
                            <Medal className="h-3.5 w-3.5 text-yellow-400" />
                            <span className="text-xs text-gray-300">{m.label}</span>
                          </div>
                          <span className="text-xs font-bold text-neon">{m.bonus}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <p className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                      <Award className="h-4 w-4 text-cyan-400" />
                      Leadership Revenue Pool
                    </p>
                    <p className="text-xs text-gray-500 mb-3">Diamond Leader and above — 2% of global monthly revenue</p>
                    <div className="px-3 py-3 rounded-lg bg-cyan-400/5 border border-cyan-400/20 mb-2">
                      <p className="text-sm font-bold text-cyan-400">2% global revenue ÷ all Diamond+ ambassadors</p>
                      <p className="text-xs text-gray-500 mt-1">Paid monthly alongside regular commissions</p>
                    </div>
                    <p className="text-xs text-gray-600">Eligible ranks: Diamond Leader, Elite Diamond, Black Diamond, Crown Ambassador, Grand Crown</p>
                  </Card>
                </div>
              </div>

              {/* Travel Incentives */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Plane className="h-5 w-5 text-blue-400" />
                  Travel Incentives
                </h2>
                <Card>
                  <div className="space-y-2">
                    {[
                      { rank: "gold_leader" as AmbassadorRank, destination: "Rwanda & Tanzania", window: "3 months" },
                      { rank: "platinum_leader" as AmbassadorRank, destination: "Thailand", window: "3 months" },
                      { rank: "diamond_leader" as AmbassadorRank, destination: "Singapore", window: "3 months" },
                      { rank: "elite_diamond" as AmbassadorRank, destination: "Qatar", window: "3 months" },
                      { rank: "black_diamond" as AmbassadorRank, destination: "All 5 Destinations", window: "6 months" },
                      { rank: "crown_ambassador" as AmbassadorRank, destination: "All 5 + Partner", window: "6 months" },
                      { rank: "grand_crown" as AmbassadorRank, destination: "All 5 + Private Charter", window: "12 months" },
                    ].map((t) => {
                      const cfg = RANK_INFO[t.rank];
                      return (
                        <div key={t.rank} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                          <MapPin className={`h-4 w-4 ${cfg.color} flex-shrink-0`} />
                          <div className="flex-1">
                            <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                            <span className="text-xs text-gray-300 ml-2">{t.destination}</span>
                          </div>
                          <span className="text-xs text-gray-600">Hold rank {t.window}</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-gray-400" />
                  Frequently Asked Questions
                </h2>
                <Card>
                  <div className="divide-y divide-white/5">
                    {FAQ_ITEMS.map((item, i) => (
                      <div key={i}>
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="w-full flex items-center justify-between py-3.5 text-left hover:bg-white/[0.02] -mx-1 px-1 rounded transition-colors"
                        >
                          <span className="text-sm font-medium text-white pr-4">{item.q}</span>
                          <ChevronDown className={`h-4 w-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${expandedFaq === i ? "rotate-180" : ""}`} />
                        </button>
                        {expandedFaq === i && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                            <p className="text-xs text-gray-400 leading-relaxed pb-3.5 pl-1">{item.a}</p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Payout schedule */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-400" />
                  Payout Schedule
                </h2>
                <Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: Calendar, title: "Monthly Calculation", desc: "Commissions are calculated on the last business day of each month across all active downline subscriptions." },
                      { icon: DollarSign, title: "Paid on the 15th", desc: "All pending commissions and bonuses are paid out on the 15th of the following month." },
                      { icon: Target, title: "$50 Minimum", desc: "Balances below $50 roll over to the next month until the threshold is met." },
                      { icon: Gift, title: "Bonus Payments", desc: "Fast Start, Loyalty Retention, Performance Milestones, and Leadership Pool bonuses are included in the monthly payout." },
                      { icon: Wallet, title: "Wallet Payouts", desc: "All payouts are sent to your registered wallet address. Ensure it is current before the 15th." },
                      { icon: Shield, title: "30-Day Refund Window", desc: "If a referred customer refunds within 30 days, the commission for that customer is reversed. After 30 days it is permanent." },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex-shrink-0">
                          <item.icon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white mb-0.5">{item.title}</p>
                          <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ── Referrals ── */}
          {activeTab === "referrals" && (
            <Card>
              {referrals.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-400">
                    <span className="text-white font-medium">{referrals.length}</span> referred users ·{" "}
                    <span className="text-neon font-medium">{referrals.filter((r) => r.is_subscribed).length} subscribed</span>
                  </p>
                </div>
              )}
              {referrals.length === 0 ? (
                <EmptyState icon={Users} title="No referrals yet" description="Share your referral link to start earning." actionLabel="Copy Link" onAction={handleCopy} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Joined</th>
                        <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Rank</th>
                        <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Plan</th>
                        <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Price / mo</th>
                        <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Months</th>
                        <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {referrals.map((ref, i) => (
                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-2 text-gray-300">{formatDate(ref.joined_at)}</td>
                          <td className="py-3 px-2">
                            <Badge variant={rankBadgeVariant(ref.rank)}>{rankLabel(ref.rank)}</Badge>
                          </td>
                          <td className="py-3 px-2 text-white">{ref.plan_name || <span className="text-gray-600">—</span>}</td>
                          <td className="py-3 px-2 text-right text-gray-300">
                            {ref.plan_price != null ? formatCurrency(ref.plan_price) : <span className="text-gray-600">—</span>}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-400">{ref.subscription_months || "—"}</td>
                          <td className="py-3 px-2 text-right">
                            {ref.is_subscribed ? <Badge variant="success">Subscribed</Badge> : <Badge variant="default">Inactive</Badge>}
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
                  <p className="text-sm text-gray-400">Monthly multi-level commission records</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Paid: <span className="text-neon font-medium">{formatCurrency(commissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.commission_amount, 0))}</span></span>
                    <span>Pending: <span className="text-yellow-400 font-medium">{formatCurrency(commissions.filter((c) => c.status !== "paid").reduce((s, c) => s + c.commission_amount, 0))}</span></span>
                  </div>
                </div>
              )}
              {commissions.length === 0 ? (
                <EmptyState icon={DollarSign} title="No commissions yet" description="Commissions are calculated monthly from your active downline subscriptions." />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left py-3 px-2 text-xs text-gray-400 font-medium uppercase">Month</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">PAR</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">TAV</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Amount</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Status</th>
                          <th className="text-right py-3 px-2 text-xs text-gray-400 font-medium uppercase">Paid On</th>
                          <th className="py-3 px-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {commissions.map((c) => (
                          <>
                            <tr
                              key={c.id}
                              className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                              onClick={() => setExpandedComm(expandedComm === c.id ? null : c.id)}
                            >
                              <td className="py-3 px-2 text-gray-300 font-medium">
                                {new Date(c.year, c.month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                              </td>
                              <td className="py-3 px-2 text-right text-gray-300">{c.active_referral_count}</td>
                              <td className="py-3 px-2 text-right text-gray-300">{c.tav_count}</td>
                              <td className="py-3 px-2 text-right font-semibold text-white">{formatCurrency(c.commission_amount)}</td>
                              <td className="py-3 px-2 text-right">
                                {c.status === "paid" ? <Badge variant="success">Paid</Badge> : <Badge variant="warning">Pending</Badge>}
                              </td>
                              <td className="py-3 px-2 text-right text-gray-500 text-xs">
                                {c.paid_at ? formatDate(c.paid_at) : <span className="text-gray-700">—</span>}
                              </td>
                              <td className="py-3 px-2 text-right">
                                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${expandedComm === c.id ? "rotate-180" : ""}`} />
                              </td>
                            </tr>
                            {expandedComm === c.id && c.level_breakdown && (
                              <tr key={`${c.id}-breakdown`} className="bg-white/[0.01]">
                                <td colSpan={7} className="px-4 py-3">
                                  <p className="text-xs font-medium text-gray-400 mb-2">Level breakdown</p>
                                  <div className="flex flex-wrap gap-2">
                                    {Object.entries(c.level_breakdown).map(([lvl, amt]) => (
                                      <div key={lvl} className="px-2 py-1 rounded bg-white/5 border border-white/10">
                                        <span className="text-xs text-gray-500">{lvl === "generational" ? "Gen. Override" : `L${lvl}`}: </span>
                                        <span className="text-xs font-semibold text-white">{formatCurrency(amt)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
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
                  <p className="text-sm text-gray-400">All bonus records</p>
                  <p className="text-xs text-gray-500">Total: <span className="text-neon font-medium">{formatCurrency(bonuses.reduce((s, b) => s + b.amount, 0))}</span></p>
                </div>
              )}
              {bonuses.length === 0 ? (
                <EmptyState icon={Gift} title="No bonuses yet" description="Earn Fast Start, Loyalty Retention, Performance Milestone, and Rank Advancement bonuses as you grow." />
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
                            <td className="py-3 px-2 text-right font-semibold text-white">{formatCurrency(b.amount)}</td>
                            <td className="py-3 px-2 text-right">
                              {b.status === "paid" ? <Badge variant="success">Paid</Badge> : <Badge variant="warning">Pending</Badge>}
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
                  <EmptyState icon={Wallet} title="No payouts yet" description="Processed payouts will appear here. Ensure your payout address is set." />
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
                              <td className="py-3 px-2 text-gray-300">{p.paid_at ? formatDate(p.paid_at) : formatDate(p.created_at)}</td>
                              <td className="py-3 px-2 text-right font-semibold text-white">{formatCurrency(p.total_amount)}</td>
                              <td className="py-3 px-2 text-gray-400 font-mono text-xs">{p.payout_address ? shortenAddress(p.payout_address) : <span className="text-gray-600">—</span>}</td>
                              <td className="py-3 px-2 text-right">{payoutStatusBadge(p.status)}</td>
                              <td className="py-3 px-2 text-gray-500 max-w-xs truncate text-xs">{p.admin_notes || <span className="text-gray-700">—</span>}</td>
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

          {/* ── Travel ── */}
          {activeTab === "travel" && (
            <div className="space-y-4">
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20">
                    <Plane className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Your Travel Incentives</p>
                    <p className="text-xs text-gray-500">Achieve Gold Leader and above to qualify for all-expenses-paid travel</p>
                  </div>
                </div>

                {travelIncentives.length === 0 ? (
                  <EmptyState
                    icon={Plane}
                    title="No travel incentives yet"
                    description="Reach Gold Leader rank to start qualifying for travel incentives. Hold the rank for the required qualification window to be awarded."
                  />
                ) : (
                  <div className="space-y-3">
                    {travelIncentives.map((t) => {
                      const cfg = RANK_INFO[t.rank_required] ?? RANK_INFO.associate;
                      return (
                        <div key={t.id} className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${travelStatusBadge(t.status).props.variant === "neon" ? "bg-neon/5 border-neon/20" : "bg-white/[0.02] border-white/5"}`}>
                          <MapPin className={`h-5 w-5 ${cfg.color} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-semibold text-white">{t.destination}</p>
                              {travelStatusBadge(t.status)}
                            </div>
                            <p className="text-xs text-gray-500">
                              Required rank: <span className={cfg.color}>{cfg.label}</span>
                              {" · "}Qualified from {formatDate(t.qualification_start)}
                              {t.awarded_at && <span className="text-neon"> · Awarded {formatDate(t.awarded_at)}</span>}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ── Training ── */}
          {activeTab === "training" && (
            <div className="space-y-4">
              {trainingStats.total_count > 0 && (
                <Card>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">Overall Training Progress</p>
                    <span className="text-xs text-gray-400">{trainingStats.completed_count} / {trainingStats.total_count} completed</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 mb-1">
                    <div
                      className="bg-neon h-2 rounded-full transition-all duration-700"
                      style={{ width: `${trainingStats.total_count > 0 ? Math.round((trainingStats.completed_count / trainingStats.total_count) * 100) : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {trainingStats.total_count > 0 ? Math.round((trainingStats.completed_count / trainingStats.total_count) * 100) : 0}% complete
                  </p>
                </Card>
              )}

              <div className="space-y-4">
                {modulesByRank.map(({ rank, modules }) => {
                  const cfg = RANK_INFO[rank];
                  const done = modules.filter((m) => m.completed).length;
                  const total = modules.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <div key={rank}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className={`h-4 w-4 ${cfg.color}`} />
                          <h3 className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 bg-white/5 rounded-full h-1">
                              <div className={`h-1 rounded-full transition-all duration-500 ${pct === 100 ? "bg-neon" : "bg-current"} ${cfg.color}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{done}/{total}</span>
                          </div>
                          {pct === 100 && <Badge variant="success">Complete</Badge>}
                        </div>
                      </div>
                      <Card>
                        <div className="divide-y divide-white/5">
                          {modules.map((mod) => (
                            <div key={mod.key} className="flex items-center justify-between py-3.5">
                              <div className="flex items-center gap-3">
                                {mod.completed
                                  ? <CheckCircle className="h-5 w-5 text-neon flex-shrink-0" />
                                  : <Circle className="h-5 w-5 text-gray-700 flex-shrink-0" />
                                }
                                <div>
                                  <p className={`text-sm font-medium ${mod.completed ? "text-white" : "text-gray-400"}`}>{mod.name}</p>
                                  {mod.completed && mod.completed_at
                                    ? <p className="text-xs text-gray-500 mt-0.5">Completed {formatDate(mod.completed_at)}</p>
                                    : <p className="text-xs text-gray-600 mt-0.5">Not yet completed</p>
                                  }
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
                {trainingStats.total_count === 0 && (
                  <EmptyState icon={BookOpen} title="No training modules" description="Training modules will appear here as they become available." />
                )}
              </div>
            </div>
          )}

          {/* ── Leaderboard ── */}
          {activeTab === "leaderboard" && (
            <div className="space-y-4">
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-3">
                  {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
                    if (!entry) return null;
                    const podiumOrder = [1, 0, 2];
                    const isCentre = i === 1;
                    return (
                      <motion.div key={entry.user_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: podiumOrder[i] * 0.1 }}>
                        <GlowCard className={isCentre ? "border-yellow-400/30" : ""}>
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="text-2xl">{positionDisplay(entry.rank_position)}</div>
                            <Badge variant={rankBadgeVariant(entry.ambassador_rank)}>{rankLabel(entry.ambassador_rank)}</Badge>
                            <div>
                              <p className="text-sm font-bold text-white">{entry.total_referrals} referrals</p>
                              <p className="text-xs text-gray-500">TAV: {entry.tav_count}</p>
                              <p className="text-xs text-neon font-medium">{formatCurrency(entry.rewards_earned)}</p>
                            </div>
                          </div>
                        </GlowCard>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              <Card>
                {leaderboard.length === 0 ? (
                  <EmptyState icon={Trophy} title="Leaderboard is empty" description="Be the first ambassador to appear on the leaderboard." />
                ) : (
                  <div className="divide-y divide-white/5">
                    {leaderboard.map((entry) => (
                      <div key={entry.user_id} className={`flex items-center justify-between py-3.5 ${entry.rank_position <= 3 ? "bg-white/[0.01]" : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 flex justify-center">{positionDisplay(entry.rank_position)}</div>
                          <Badge variant={rankBadgeVariant(entry.ambassador_rank)}>{rankLabel(entry.ambassador_rank)}</Badge>
                        </div>
                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <p className="text-xs text-gray-500">Referrals</p>
                            <p className="text-sm font-semibold text-white">{entry.total_referrals}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">TAV</p>
                            <p className="text-sm font-semibold text-blue-400">{entry.tav_count}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Earned</p>
                            <p className="text-sm font-semibold text-neon">{formatCurrency(entry.rewards_earned)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
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
