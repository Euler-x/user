"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Wallet,
  Eye,
  CheckCircle,
  XCircle,
  ArrowRight,
  Lock,
  Activity,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import { PageSpinner } from "@/components/ui/Spinner";
import { useAuthStore } from "@/stores/authStore";
import useTransparency from "@/hooks/useTransparency";
import { formatCurrency } from "@/lib/utils";

export default function TransparencyPage() {
  const user = useAuthStore((s) => s.user);
  const {
    reserves,
    positions,
    walletInfo,
    loading,
    fetchReserves,
    fetchPositions,
    fetchWalletInfo,
  } = useTransparency();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const hasWallet = user?.has_wallet;

  useEffect(() => {
    if (hasWallet) {
      fetchReserves();
      fetchPositions();
      fetchWalletInfo();
    }
  }, [hasWallet, fetchReserves, fetchPositions, fetchWalletInfo]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchReserves(), fetchPositions()]);
    setRefreshing(false);
  };

  if (loading && !reserves && hasWallet) return <PageSpinner />;

  // No wallet state
  if (!hasWallet) {
    return (
      <PageTransition>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-neon" />
              On-Chain Transparency
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-time on-chain verification and position visibility
            </p>
          </div>
          <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-12 text-center">
            <Wallet className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Connect your Hyperliquid wallet to view on-chain balances, live positions, and verify agent key permissions.
            </p>
            <Button onClick={() => setShowWalletModal(true)}>
              <Wallet className="h-4 w-4" />
              Connect Wallet
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <ConnectWalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-neon" />
              On-Chain Transparency
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Real-time on-chain verification and position visibility
            </p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRefresh}
            loading={refreshing}
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
        </div>

        {/* Proof of Reserves */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlowCard>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-neon" />
                Proof of Reserves
              </h2>
              {reserves && (
                <span className="text-[10px] text-gray-600 font-mono">
                  Verified {new Date(reserves.verification_timestamp).toLocaleString()}
                </span>
              )}
            </div>
            {reserves ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">On-Chain Balance</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(reserves.on_chain_balance)}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Allocated</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(reserves.total_allocated)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/[0.03] rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Surplus / Deficit</p>
                    <p className={`text-xl font-bold ${reserves.surplus_deficit >= 0 ? "text-neon" : "text-red-400"}`}>
                      {reserves.surplus_deficit >= 0 ? "+" : ""}{formatCurrency(reserves.surplus_deficit)}
                    </p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Margin Used</p>
                    <p className="text-xl font-bold text-yellow-400">{formatCurrency(reserves.margin_used)}</p>
                  </div>
                  <div className="bg-white/[0.03] rounded-xl p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Free Collateral</p>
                    <p className="text-xl font-bold text-gray-200">{formatCurrency(reserves.free_collateral)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading reserves data...</p>
            )}
          </GlowCard>
        </motion.div>

        {/* Live Positions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-neon" />
              Live Positions
            </h2>
            <span className="text-xs text-gray-600">{positions.length} open</span>
          </div>
          {positions.length === 0 ? (
            <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-gray-500">No open positions at the moment.</p>
            </div>
          ) : (
            <div className="bg-dark-200/80 border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Size</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Entry</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unrealized PnL</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Leverage</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Liq Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {positions.map((pos, i) => (
                      <motion.tr
                        key={pos.symbol}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-300">
                              {pos.symbol.slice(0, 2)}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-white">{pos.symbol}</span>
                              <span className={`text-xs ml-2 ${pos.size > 0 ? "text-neon" : "text-red-400"}`}>
                                {pos.size > 0 ? "LONG" : "SHORT"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono text-gray-200">
                          {Math.abs(pos.size).toFixed(4)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono text-gray-200">
                          {formatCurrency(pos.entry_price)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-sm font-medium ${pos.unrealized_pnl >= 0 ? "text-neon" : "text-red-400"}`}>
                            {pos.unrealized_pnl >= 0 ? "+" : ""}{formatCurrency(pos.unrealized_pnl)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 hidden sm:table-cell">
                          {pos.leverage.toFixed(1)}x
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 hidden md:table-cell">
                          {pos.liquidation_price ? formatCurrency(pos.liquidation_price) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 hidden lg:table-cell">
                          {formatCurrency(pos.margin_used)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Wallet Info & Agent Key Permissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Wallet Info */}
          <Card>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-neon" /> Wallet Verification
              </div>
            </CardTitle>
            <div className="mt-4 space-y-4">
              {walletInfo?.wallet_address && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Address</span>
                  <span className="text-sm font-mono text-gray-200">{walletInfo.wallet_address}</span>
                </div>
              )}
              {walletInfo?.explorer_link && (
                <a
                  href={walletInfo.explorer_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-neon hover:underline"
                >
                  View on Hyperliquid Explorer
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <a
                href={walletInfo?.smart_contract_audit_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300"
              >
                Security & Audit Documentation
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </Card>

          {/* Agent Key Permissions */}
          <Card>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-neon" /> Agent Key Permissions
              </div>
            </CardTitle>
            {walletInfo?.agent_permissions ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Wallet Type</span>
                  <Badge variant={walletInfo.agent_permissions.wallet_type === "connected" ? "success" : "info"}>
                    {walletInfo.agent_permissions.wallet_type}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { label: "Execute Trades", allowed: walletInfo.agent_permissions.can_trade },
                    { label: "Withdraw Funds", allowed: walletInfo.agent_permissions.can_withdraw },
                    { label: "Transfer Assets", allowed: walletInfo.agent_permissions.can_transfer },
                    { label: "Modify Agent", allowed: walletInfo.agent_permissions.can_modify_agent },
                  ].map((perm) => (
                    <div key={perm.label} className="flex items-center gap-2 text-xs">
                      {perm.allowed ? (
                        <CheckCircle className="h-3.5 w-3.5 text-neon" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-400" />
                      )}
                      <span className={perm.allowed ? "text-gray-300" : "text-gray-500"}>{perm.label}</span>
                    </div>
                  ))}
                </div>
                {walletInfo.agent_permissions.verified && (
                  <div className="flex items-center gap-1.5 text-xs text-neon mt-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Permissions verified</span>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {walletInfo.agent_permissions.description}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-4">Loading permissions...</p>
            )}
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
