"use client";

import { useState } from "react";
import {
  Shield,
  Activity,
  Ban,
  Lock,
  ExternalLink,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Wallet,
} from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useAuth from "@/hooks/useAuth";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { connectHyperliquidWallet, fetchMe } = useAuth();
  const [walletAddress, setWalletAddress] = useState("");
  const [agentKey, setAgentKey] = useState("");
  const [showAgentKey, setShowAgentKey] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(walletAddress);
  const isValidKey = agentKey.length >= 64;

  const handleConnect = async () => {
    if (!isValidAddress || !isValidKey) return;
    setWalletLoading(true);
    try {
      await connectHyperliquidWallet(walletAddress, agentKey);
      setWalletAddress("");
      setAgentKey("");
      await fetchMe();
      onClose();
    } catch {
      // Error toasted by interceptor
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Connect Hyperliquid Wallet" size="lg">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        <p className="text-sm text-gray-400">
          Connect your Hyperliquid wallet to enable automated trading via the ATE. EulerX is fully non-custodial — your funds always remain in your own wallet.
        </p>

        {/* Non-custodial guarantee */}
        <div className="bg-neon/5 border border-neon/10 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-neon flex items-center gap-2">
            <Wallet className="h-4 w-4" /> Non-Custodial Guarantee
          </p>
          <div className="grid gap-2">
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Your wallet, your funds.</span> All capital stays in your personal Hyperliquid wallet.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <Activity className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Trade-only access.</span> The Agent key can only open and close positions — no withdrawals.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <Lock className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Revoke anytime.</span> Disable the Agent key from Hyperliquid and EulerX loses all access instantly.</p>
            </div>
          </div>
        </div>

        {/* Step-by-step guide */}
        <div className="border border-white/5 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-white/[0.02] transition-colors"
          >
            <div>
              <p className="text-sm font-medium text-white">How to connect your wallet</p>
              <p className="text-xs text-gray-500 mt-0.5">Step-by-step guide</p>
            </div>
            {showGuide ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
          </button>

          {showGuide && (
            <div className="px-3 pb-3 space-y-3 border-t border-white/5 pt-3">
              <div className="flex gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">1</div>
                <p className="text-xs text-gray-400">
                  Go to <a href="https://app.hyperliquid.xyz" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline inline-flex items-center gap-0.5">app.hyperliquid.xyz <ExternalLink className="h-2.5 w-2.5" /></a> and connect your Ethereum wallet. Deposit USDC.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">2</div>
                <p className="text-xs text-gray-400">Copy your <span className="text-gray-300 font-mono">0x...</span> wallet address from the top of the Hyperliquid app.</p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">3</div>
                <p className="text-xs text-gray-400">
                  Go to <a href="https://app.hyperliquid.xyz/API" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline inline-flex items-center gap-0.5">API settings <ExternalLink className="h-2.5 w-2.5" /></a> and generate a new API private key.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">4</div>
                <p className="text-xs text-gray-400">Copy the key immediately (shown <span className="text-gray-300 font-medium">once</span>) and paste both fields below.</p>
              </div>

              <div className="bg-dark-300/50 border border-white/5 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-300 mb-2">Agent key permissions:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-neon/80"><CheckCircle className="h-3 w-3" /><span>Open positions</span></div>
                  <div className="flex items-center gap-1.5 text-xs text-red-400/80"><Ban className="h-3 w-3" /><span>Withdraw funds</span></div>
                  <div className="flex items-center gap-1.5 text-xs text-neon/80"><CheckCircle className="h-3 w-3" /><span>Close positions</span></div>
                  <div className="flex items-center gap-1.5 text-xs text-red-400/80"><Ban className="h-3 w-3" /><span>Transfer funds</span></div>
                  <div className="flex items-center gap-1.5 text-xs text-neon/80"><CheckCircle className="h-3 w-3" /><span>Place/cancel orders</span></div>
                  <div className="flex items-center gap-1.5 text-xs text-red-400/80"><Ban className="h-3 w-3" /><span>Send assets</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Connection form */}
        <div className="space-y-3">
          <Input
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="0x..."
            label="Hyperliquid Wallet Address"
          />
          {walletAddress && !isValidAddress && (
            <p className="text-xs text-red-400 -mt-2">Invalid address format. Must be 0x followed by 40 hex characters.</p>
          )}

          <div className="relative">
            <Input
              value={agentKey}
              onChange={(e) => setAgentKey(e.target.value)}
              placeholder="Your agent wallet private key"
              label="Agent/API Wallet Private Key"
              type={showAgentKey ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => setShowAgentKey(!showAgentKey)}
              className="absolute right-3 top-[34px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showAgentKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/10 rounded-lg p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>Your agent key is encrypted with AES-256 before storage. Agent wallets can only execute trades — they cannot withdraw or move funds.</span>
        </div>

        <Button
          className="w-full group"
          onClick={handleConnect}
          loading={walletLoading}
          disabled={!isValidAddress || !isValidKey}
        >
          <Shield className="h-4 w-4" />
          Connect Wallet
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Modal>
  );
}
