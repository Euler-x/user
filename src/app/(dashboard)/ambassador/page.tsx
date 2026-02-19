"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Trophy, Gift, Copy, Check } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import useAmbassador from "@/hooks/useAmbassador";
import { formatCurrency, capitalize } from "@/lib/utils";
import type { ReferralResponse } from "@/types";

export default function AmbassadorPage() {
  const { ambassador, leaderboard, team, loading, fetchDashboard, fetchLeaderboard, fetchTeam, generateReferral } = useAmbassador();
  const [referral, setReferral] = useState<ReferralResponse | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchLeaderboard();
    fetchTeam();
  }, [fetchDashboard, fetchLeaderboard, fetchTeam]);

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

  if (loading && !ambassador && leaderboard.length === 0) return <PageSpinner />;

  const stats = ambassador
    ? [
        { label: "Rank", value: capitalize(ambassador.rank), icon: Trophy, color: "text-yellow-400" },
        { label: "Total Referrals", value: ambassador.total_referrals, icon: Users, color: "text-blue-400" },
        { label: "Team Size", value: ambassador.team_size, icon: Users, color: "text-neon" },
        { label: "Rewards Earned", value: formatCurrency(ambassador.rewards_earned), icon: Gift, color: "text-neon" },
      ]
    : [];

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Ambassador Program</h1>
          <p className="text-sm text-gray-400 mt-1">Refer friends and earn rewards</p>
        </div>

        {/* Referral Link */}
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-1">Your Referral Link</p>
              {ambassador?.referral_code || referral ? (
                <div className="flex items-center gap-2">
                  <code className="text-sm text-neon bg-neon/5 px-3 py-1.5 rounded-lg border border-neon/20 font-mono">
                    {referral?.referral_link || `https://eulerx.network/ref/${ambassador?.referral_code}`}
                  </code>
                  <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    {copied ? <Check className="h-4 w-4 text-neon" /> : <Copy className="h-4 w-4 text-gray-400" />}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Generate a referral link to start earning</p>
              )}
            </div>
            {!ambassador && !referral && (
              <Button onClick={handleGenerate}>Generate Link</Button>
            )}
          </div>
        </Card>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlowCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">{stat.label}</p>
                      <p className={`text-xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                    <stat.icon className={`h-5 w-5 ${stat.color} opacity-40`} />
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Leaderboard */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Leaderboard</h2>
          <Card>
            {leaderboard.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No ambassadors yet</p>
            ) : (
              <div className="divide-y divide-white/5">
                {leaderboard.slice(0, 10).map((entry) => (
                  <div key={entry.user_id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-500 w-8">#{entry.rank_position}</span>
                      <div>
                        <Badge>{capitalize(entry.ambassador_rank)}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{entry.total_referrals} referrals</p>
                      <p className="text-xs text-neon">{formatCurrency(entry.rewards_earned)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
