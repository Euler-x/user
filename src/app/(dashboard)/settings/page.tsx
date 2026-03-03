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
import { cn } from "@/lib/utils";

const TABS = [
  { key: "wallet", label: "Wallet", icon: Wallet },
  { key: "email", label: "Email", icon: Mail },
  { key: "telegram", label: "Telegram", icon: Send },
  { key: "notifications", label: "Notifications", icon: Bell },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function SettingsPage() {
  const { user, connectHyperliquidWallet, submitEmail, verifyEmail, fetchMe, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("wallet");
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

  const cleanHex = (s: string) => s.replace(/[^0-9a-fA-Fx]/g, "");
  const cleanAddress = cleanHex(walletAddress);
  const cleanKey = agentKey.replace(/[\s\u200B-\u200D\uFEFF\u00A0]/g, "");
  const isValidAddress = /^0x[0-9a-fA-F]{40}$/.test(cleanAddress);
  const isValidKey = cleanKey.length >= 40 && cleanKey.length <= 200;

  const handleConnectWallet = async () => {
    if (!isValidAddress || !isValidKey) return;
    setWalletLoading(true);
    try {
      await connectHyperliquidWallet(cleanAddress, cleanKey);
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
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your account preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-dark-200/80 border border-white/5 rounded-xl p-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center",
                activeTab === tab.key
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]"
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Wallet Tab */}
          {activeTab === "wallet" && (
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
                    Connect your Hyperliquid wallet to enable automated trading via the ATE (Automated Trading Engine). EulerX is fully non-custodial — your funds always remain in your own Hyperliquid wallet.
                  </p>

                  <div className="bg-neon/5 border border-neon/10 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-medium text-neon">Non-Custodial Guarantee</p>
                    <div className="grid gap-2">
                      <div className="flex items-start gap-2.5">
                        <Shield className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Your wallet, your funds.</span> All capital stays in your personal Hyperliquid wallet.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Activity className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Trade-only access.</span> The Agent/API key can only open and close positions. It cannot withdraw, transfer, or send funds.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Ban className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">No transaction capability.</span> Agent wallets are restricted by Hyperliquid at the protocol level.</p>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Lock className="h-4 w-4 text-neon/80 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400"><span className="text-gray-300 font-medium">Revoke anytime.</span> Disable the Agent key from your Hyperliquid account at any time.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/5 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowGuide(!showGuide)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">How to connect your Hyperliquid wallet</p>
                        <p className="text-xs text-gray-500 mt-0.5">Step-by-step guide</p>
                      </div>
                      {showGuide ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                    </button>

                    {showGuide && (
                      <div className="px-4 pb-4 space-y-4 border-t border-white/5 pt-4">
                        <div className="flex gap-3">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">1</div>
                          <div>
                            <p className="text-sm font-medium text-gray-200">Create a Hyperliquid wallet</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Go to <a href="https://app.hyperliquid.xyz" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline inline-flex items-center gap-0.5">app.hyperliquid.xyz <ExternalLink className="h-2.5 w-2.5" /></a> and connect with your Ethereum wallet. Deposit USDC to fund your account.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">2</div>
                          <div>
                            <p className="text-sm font-medium text-gray-200">Copy your wallet address</p>
                            <p className="text-xs text-gray-500 mt-1">Your <span className="text-gray-300 font-mono">0x...</span> address shown at the top of the Hyperliquid app.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">3</div>
                          <div>
                            <p className="text-sm font-medium text-gray-200">Generate an Agent/API wallet key</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Navigate to <a href="https://app.hyperliquid.xyz/API" target="_blank" rel="noopener noreferrer" className="text-neon hover:underline inline-flex items-center gap-0.5">app.hyperliquid.xyz/API <ExternalLink className="h-2.5 w-2.5" /></a> and generate a new API private key.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-neon/10 text-neon text-xs font-bold shrink-0">4</div>
                          <div>
                            <p className="text-sm font-medium text-gray-200">Save and paste the key below</p>
                            <p className="text-xs text-gray-500 mt-1">The key is shown <span className="text-gray-300 font-medium">once</span>. Copy it immediately.</p>
                          </div>
                        </div>

                        <div className="bg-dark-300/50 border border-white/5 rounded-lg p-3 mt-2">
                          <p className="text-xs font-medium text-gray-300 mb-2">What the Agent/API key can and cannot do:</p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs text-neon/80"><CheckCircle className="h-3 w-3" /><span>Open positions</span></div>
                            <div className="flex items-center gap-1.5 text-xs text-red-400/80"><Ban className="h-3 w-3" /><span>Withdraw funds</span></div>
                            <div className="flex items-center gap-1.5 text-xs text-neon/80"><CheckCircle className="h-3 w-3" /><span>Close positions</span></div>
                            <div className="flex items-center gap-1.5 text-xs text-red-400/80"><Ban className="h-3 w-3" /><span>Transfer funds</span></div>
                            <div className="flex items-center gap-1.5 text-xs text-neon/80"><CheckCircle className="h-3 w-3" /><span>Place/cancel orders</span></div>
                            <div className="flex items-center gap-1.5 text-xs text-red-400/80"><Ban className="h-3 w-3" /><span>Send assets</span></div>
                            <div className="flex items-center gap-1.5 text-xs text-neon/80"><CheckCircle className="h-3 w-3" /><span>Set leverage</span></div>
                            <div className="flex items-center gap-1.5 text-xs text-red-400/80"><Ban className="h-3 w-3" /><span>Approve other agents</span></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Input
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value.replace(/\s/g, ""))}
                      placeholder="0x..."
                      label="Hyperliquid Wallet Address"
                    />
                    {cleanAddress && !isValidAddress && (
                      <p className="text-xs text-red-400 -mt-2">Invalid address format. Must be 0x followed by 40 hex characters.</p>
                    )}
                    <div className="relative">
                      <Input
                        value={agentKey}
                        onChange={(e) => setAgentKey(e.target.value.replace(/\s/g, ""))}
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
                    <span>Your agent key is encrypted with AES-256 before storage. Agent wallets are restricted at the Hyperliquid protocol level and can only execute trades.</span>
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
          )}

          {/* Email Tab */}
          {activeTab === "email" && (
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
          )}

          {/* Telegram Tab */}
          {activeTab === "telegram" && (
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
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && prefs && (
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

          {activeTab === "notifications" && !prefs && (
            <Card>
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">Loading notification preferences...</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
