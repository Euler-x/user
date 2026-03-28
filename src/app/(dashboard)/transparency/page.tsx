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
import usePositionsStream from "@/hooks/usePositionsStream";
import useBybitBalance from "@/hooks/useBybitBalance";
import ExchangeSwitcher from "@/components/ui/ExchangeSwitcher";
import { formatCurrency } from "@/lib/utils";
import type { Exchange, LivePosition } from "@/types";

const HL_LOGO = "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120519/hyprliquid_orr9vl.webp";
const BB_LOGO = "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120520/bybit_obnhd8.webp";

export default function TransparencyPage() {
  const user = useAuthStore((s) => s.user);
  const {
    reserves,
    walletInfo,
    loading,
    fetchReserves,
    fetchWalletInfo,
  } = useTransparency();
  const {
    positions: livePositions,
    hlPositions,
    bybitPositions,
    connected: wsConnected,
    lastUpdate,
    hlCount,
    bybitCount,
  } = usePositionsStream();
  const {
    balance: bybitBalance,
    loading: bybitLoading,
    fetchBalance: fetchBybitBalance,
  } = useBybitBalance();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [posExchange, setPosExchange] = useState<Exchange | "all">("all");

  const hasWallet = user?.has_wallet;
  const hasBybit = user?.bybit_configured;

  useEffect(() => {
    if (hasWallet) {
      fetchReserves();
      fetchWalletInfo();
    }
    if (hasBybit) {
      fetchBybitBalance();
    }
  }, [hasWallet, hasBybit, fetchReserves, fetchWalletInfo, fetchBybitBalance]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const promises = [];
    if (hasWallet) promises.push(fetchReserves());
    if (hasBybit) promises.push(fetchBybitBalance());
    await Promise.allSettled(promises);
    setRefreshing(false);
  };

  const displayPositions: LivePosition[] =
    posExchange === "all" ? livePositions :
    posExchange === "hyperliquid" ? hlPositions : bybitPositions;

  if ((loading || bybitLoading) && !reserves && !bybitBalance && (hasWallet || hasBybit)) return <PageSpinner />;

  // No exchange connected
  if (!hasWallet && !hasBybit) {
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

        {/* Bybit Account Overview */}
        {hasBybit && bybitBalance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <GlowCard>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <img src={BB_LOGO} alt="Bybit" className="h-5 w-5 rounded-sm" />
                  Bybit Account
                </h2>
                <Badge variant={bybitBalance.testnet ? "warning" : "success"}>
                  {bybitBalance.testnet ? "Testnet" : "Mainnet"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Equity</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(bybitBalance.account_equity)}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Available Balance</p>
                  <p className="text-2xl font-bold text-neon">{formatCurrency(bybitBalance.available_balance)}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Unrealized PnL</p>
                  <p className={`text-2xl font-bold ${(bybitBalance.unrealized_pnl ?? 0) >= 0 ? "text-neon" : "text-red-400"}`}>
                    {(bybitBalance.unrealized_pnl ?? 0) >= 0 ? "+" : ""}{formatCurrency(bybitBalance.unrealized_pnl ?? 0)}
                  </p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        )}

        {/* Live Positions (WebSocket Stream) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-neon" />
                Live Positions
              </h2>
              <div className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${wsConnected ? "bg-neon animate-pulse" : "bg-red-400"}`} />
                <span className="text-[10px] text-gray-600">{wsConnected ? "Live" : "Connecting..."}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdate && (
                <span className="text-[9px] text-gray-700 font-mono">
                  {new Date(lastUpdate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              )}
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                {hlCount > 0 && <span className="flex items-center gap-1"><img src={HL_LOGO} alt="HL" className="h-3 w-3 rounded-sm" />{hlCount}</span>}
                {bybitCount > 0 && <span className="flex items-center gap-1"><img src={BB_LOGO} alt="BB" className="h-3 w-3 rounded-sm" />{bybitCount}</span>}
                <span>{livePositions.length} total</span>
              </div>
              {(hasWallet && hasBybit) && (
                <ExchangeSwitcher active={posExchange} onChange={setPosExchange} size="sm" />
              )}
            </div>
          </div>
          {displayPositions.length === 0 ? (
            <div className="bg-dark-200/80 border border-white/5 rounded-2xl p-8 text-center">
              <p className="text-gray-500">
                {wsConnected ? "No open positions at the moment." : "Connecting to live stream..."}
              </p>
            </div>
          ) : (
            <div className="bg-dark-200/80 border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exchange</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Size</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Entry</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Mark</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unrealized PnL</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Leverage</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Liq Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {displayPositions.map((pos, i) => (
                      <motion.tr
                        key={`${pos.exchange}-${pos.symbol}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <img
                            src={pos.exchange === "bybit" ? BB_LOGO : HL_LOGO}
                            alt={pos.exchange}
                            className="h-5 w-5 rounded-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="text-sm font-medium text-white">{pos.symbol}</span>
                              <span className={`text-xs ml-2 font-medium ${pos.side === "long" ? "text-neon" : "text-red-400"}`}>
                                {pos.side.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono text-gray-200">
                          {pos.size.toFixed(4)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono text-gray-200">
                          {formatCurrency(pos.entry_price)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono text-gray-300">
                          {pos.mark_price > 0 ? formatCurrency(pos.mark_price) : "\u2014"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`text-sm font-medium ${pos.unrealized_pnl >= 0 ? "text-neon" : "text-red-400"}`}>
                            {pos.unrealized_pnl >= 0 ? "+" : ""}{formatCurrency(pos.unrealized_pnl)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 hidden sm:table-cell">
                          {pos.leverage > 0 ? `${pos.leverage.toFixed(1)}x` : "\u2014"}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 hidden md:table-cell">
                          {pos.liquidation_price ? formatCurrency(pos.liquidation_price) : "\u2014"}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-400 hidden lg:table-cell">
                          {pos.margin_used > 0 ? formatCurrency(pos.margin_used) : "\u2014"}
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
              {walletInfo?.smart_contract_audit_link ? (
              <a
                href={walletInfo.smart_contract_audit_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300"
              >
                Security & Audit Documentation
                <ExternalLink className="h-3 w-3" />
              </a>
              ) : (
              <span className="flex items-center gap-2 text-sm text-gray-600">
                Security & Audit Documentation (pending)
              </span>
              )}
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
