"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle, Send, Trash2, Bell, Wallet, ArrowRight, Shield, ExternalLink, Eye, EyeOff, AlertTriangle, Lock, ChevronDown, ChevronUp, Activity, Ban } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { NotificationPreferences } from "@/types";

export default function SettingsPage() {
  const { user, connectHyperliquidWallet, submitEmail, verifyEmail, fetchMe, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showVerify, setShowVerify] = useState(false);

  // Hyperliquid wallet
  const [walletAddress, setWalletAddress] = useState("");
  const [agentKey, setAgentKey] = useState("");
  const [showAgentKey, setShowAgentKey] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Telegram
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [telegramLoading, setTelegramLoading] = useState(false);

  // Notification Prefs
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);

  useEffect(() => {
    api.get<NotificationPreferences>(ENDPOINTS.TELEGRAM.PREFERENCES)
      .then(({ data }) => setPrefs(data))
      .catch(() => {});
  }, []);

  const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(walletAddress);
  const isValidKey = agentKey.length >= 64;

  const handleConnectWallet = async () => {
    if (!isValidAddress || !isValidKey) return;
    setWalletLoading(true);
    try {
      await connectHyperliquidWallet(walletAddress, agentKey);
      setWalletAddress("");
      setAgentKey("");
      await fetchMe();
    } catch {
      // Error toasted by interceptor
    } finally {
      setWalletLoading(false);
    }
  };

  const handleSubmitEmail = async () => {
    await submitEmail(email);
    setShowVerify(true);
  };

  const handleVerifyEmail = async () => {
    await verifyEmail(code);
    setShowVerify(false);
    setCode("");
  };

  const handleSaveTelegram = async () => {
    setTelegramLoading(true);
    try {
      await api.put(ENDPOINTS.TELEGRAM.CONFIG, { bot_token: botToken, chat_id: chatId });
      toast.success("Telegram connected!");
      setBotToken("");
      setChatId("");
      await fetchMe();
    } finally {
      setTelegramLoading(false);
    }
  };

  const handleRemoveTelegram = async () => {
    await api.delete(ENDPOINTS.TELEGRAM.CONFIG);
    toast.success("Telegram removed");
    await fetchMe();
  };

  const handleTestTelegram = async () => {
    const { data } = await api.post(ENDPOINTS.TELEGRAM.TEST);
    if (data.success) toast.success(data.message);
    else toast.error(data.message);
  };

  const handleSavePrefs = async () => {
    if (!prefs) return;
    await api.put(ENDPOINTS.TELEGRAM.PREFERENCES, prefs);
    toast.success("Preferences saved!");
  };

  const togglePref = (key: keyof NotificationPreferences) => {
    if (!prefs) return;
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  const prefCategories = [
    { label: "Trades", email: "trades_email" as const, telegram: "trades_telegram" as const },
    { label: "Signals", email: "signals_email" as const, telegram: "signals_telegram" as const },
    { label: "Billing", email: "billing_email" as const, telegram: "billing_telegram" as const },
    { label: "Support", email: "support_email" as const, telegram: "support_telegram" as const },
    { label: "Referrals", email: "referrals_email" as const, telegram: "referrals_telegram" as const },
  ];

  return (
    <PageTransition>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your account preferences</p>
        </div>

        {/* Hyperliquid Wallet Connection */}
        <Card>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-neon" /> Hyperliquid Wallet
            </div>
          </CardTitle>
          {user?.has_wallet ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-neon" />
                <span className="text-sm text-gray-300 font-mono">{user.wallet_address_hash?.slice(0, 12)}...{user.wallet_address_hash?.slice(-8)}</span>
                <Badge variant="success">Connected</Badge>
              </div>

              {/* Security assurances when connected */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3 text-neon/60" />
                  <span>Agent wallet connected — trade-only access, no withdrawal capability</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="h-3 w-3 text-neon/60" />
                  <span>Your funds remain in your Hyperliquid wallet at all times</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Ban className="h-3 w-3 text-neon/60" />
                  <span>EulerX cannot transfer, withdraw, or move your funds</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              <p className="text-sm text-gray-400">
                Connect your Hyperliquid wallet to enable automated trading via the ATE (Automated Trading Engine). EulerX is fully non-custodial — your funds always remain in your own Hyperliquid wallet. We never hold, transfer, or have withdrawal access to your capital.
              </p>

              {/* Non-custodial guarantee */}
              <div className="bg-neon/5 border border-neon/10 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-neon">Non-Custodial Guarantee</p>
                <div className="grid gap-2">
                  <div className="flex items-start gap-2.5">
                    <Shield className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Your wallet, your funds.</span> EulerX never holds any of your assets. All capital stays in your personal Hyperliquid wallet.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Activity className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Trade-only access.</span> The Agent/API key can only open and close positions. It cannot withdraw, transfer, or send funds anywhere.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Ban className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">No transaction capability.</span> Agent wallets are restricted by Hyperliquid at the protocol level — they physically cannot perform deposits, withdrawals, or any fund transfers.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Lock className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Revoke anytime.</span> You can disable the Agent key from your Hyperliquid account at any time and EulerX will immediately lose all access.</p>
                  </div>
                </div>
              </div>

              {/* Step-by-step guide — collapsible */}
              <div className="border border-white/5 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">How to connect your Hyperliquid wallet</p>
                    <p className="text-xs text-gray-500 mt-0.5">Step-by-step guide from creating a wallet to connecting it here</p>
                  </div>
                  {showGuide ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                </button>

                {showGuide && (
                  <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                    {/* Step 1 */}
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">1</div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">Create a Hyperliquid wallet</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Go to <a href="https://app.hyperliquid.xyz" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline inline-flex items-center gap-0.5">app.hyperliquid.xyz <ExternalLink className="h-2.5 w-2.5" /></a> and connect with your Ethereum wallet (MetaMask, Rabby, etc.). This becomes your Hyperliquid trading wallet. Deposit USDC to fund your account for trading.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">2</div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">Copy your wallet address</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Your wallet address is the <span className="text-gray-300 font-mono">0x...</span> address shown at the top of the Hyperliquid app. This is your public address — it&apos;s safe to share and is used to identify your account on the exchange.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">3</div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">Generate an Agent/API wallet key</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Navigate to <a href="https://app.hyperliquid.xyz/API" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline inline-flex items-center gap-0.5">app.hyperliquid.xyz/API <ExternalLink className="h-2.5 w-2.5" /></a> and click <span className="text-gray-300">&quot;Generate and authorize new API private key&quot;</span>. You may optionally name it (e.g. &quot;EulerX&quot;). Your wallet will ask you to sign a confirmation.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-3">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">4</div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">Save and paste the key below</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Hyperliquid will show the API private key <span className="text-gray-300 font-medium">once</span>. Copy it immediately and save it somewhere secure. Then paste your wallet address and the API key into the fields below to connect.
                        </p>
                      </div>
                    </div>

                    {/* What this key can and cannot do */}
                    <div className="bg-dark-300/50 border border-white/5 rounded-lg p-3 mt-2">
                      <p className="text-xs font-medium text-gray-300 mb-2">What the Agent/API key can and cannot do:</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-neon/80">
                          <CheckCircle className="h-3 w-3" />
                          <span>Open positions</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-red-400/80">
                          <Ban className="h-3 w-3" />
                          <span>Withdraw funds</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neon/80">
                          <CheckCircle className="h-3 w-3" />
                          <span>Close positions</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-red-400/80">
                          <Ban className="h-3 w-3" />
                          <span>Transfer funds</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neon/80">
                          <CheckCircle className="h-3 w-3" />
                          <span>Place/cancel orders</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-red-400/80">
                          <Ban className="h-3 w-3" />
                          <span>Send assets</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neon/80">
                          <CheckCircle className="h-3 w-3" />
                          <span>Set leverage</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-red-400/80">
                          <Ban className="h-3 w-3" />
                          <span>Approve other agents</span>
                        </div>
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
                <span>Your agent key is encrypted with AES-256 before storage. Agent wallets are restricted at the Hyperliquid protocol level and can only execute trades — they cannot withdraw, transfer, or move any funds from your account.</span>
              </div>

              <Button
                className="group"
                onClick={handleConnectWallet}
                loading={walletLoading}
                disabled={!isValidAddress || !isValidKey}
              >
                <Shield className="h-4 w-4" />
                Connect Hyperliquid Wallet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </Card>

        {/* Email */}
        <Card>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-neon" /> Email Verification
            </div>
          </CardTitle>
          {user?.email_verified ? (
            <div className="flex items-center gap-2 mt-4">
              <CheckCircle className="h-4 w-4 text-neon" />
              <span className="text-sm text-gray-300">{user.email}</span>
              <Badge variant="success">Verified</Badge>
            </div>
          ) : showVerify ? (
            <div className="flex gap-3 mt-4">
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" className="flex-1" />
              <Button onClick={handleVerifyEmail} loading={authLoading}>Verify</Button>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" type="email" className="flex-1" />
              <Button onClick={handleSubmitEmail} loading={authLoading} disabled={!email}>
                <Send className="h-4 w-4" /> Send Code
              </Button>
            </div>
          )}
        </Card>

        {/* Telegram */}
        <Card>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-neon" /> Telegram Notifications
            </div>
          </CardTitle>
          {user?.telegram_configured ? (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={handleTestTelegram}>Test</Button>
                <Button size="sm" variant="danger" onClick={handleRemoveTelegram}>
                  <Trash2 className="h-3 w-3" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              <Input value={botToken} onChange={(e) => setBotToken(e.target.value)} placeholder="Bot token from @BotFather" label="Bot Token" />
              <Input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="Your chat ID" label="Chat ID" />
              <Button onClick={handleSaveTelegram} loading={telegramLoading} disabled={!botToken || !chatId}>
                Connect Telegram
              </Button>
            </div>
          )}
        </Card>

        {/* Notification Preferences */}
        {prefs && (
          <Card>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-neon" /> Notification Preferences
              </div>
            </CardTitle>
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 uppercase px-1">
                <span>Category</span>
                <span className="text-center">Email</span>
                <span className="text-center">Telegram</span>
              </div>
              {prefCategories.map((cat) => (
                <div key={cat.label} className="grid grid-cols-3 gap-4 items-center px-1">
                  <span className="text-sm text-gray-300">{cat.label}</span>
                  <div className="text-center">
                    <button
                      onClick={() => togglePref(cat.email)}
                      className={`h-5 w-10 rounded-full transition-colors ${prefs[cat.email] ? "bg-neon" : "bg-dark-50"}`}
                    >
                      <div className={`h-4 w-4 rounded-full bg-white transition-transform ${prefs[cat.email] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={() => togglePref(cat.telegram)}
                      className={`h-5 w-10 rounded-full transition-colors ${prefs[cat.telegram] ? "bg-neon" : "bg-dark-50"}`}
                    >
                      <div className={`h-4 w-4 rounded-full bg-white transition-transform ${prefs[cat.telegram] ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <Button size="sm" onClick={handleSavePrefs}>Save Preferences</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}
