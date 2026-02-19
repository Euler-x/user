"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle, Send, Trash2, Bell, Wallet, ArrowRight } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PageTransition from "@/components/PageTransition";
import Card, { CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import useWalletAuth from "@/hooks/useWalletAuth";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { NotificationPreferences } from "@/types";

export default function SettingsPage() {
  const { user, submitEmail, verifyEmail, fetchMe, loading: authLoading } = useAuth();
  const { isConnected, authenticate, loading: walletLoading } = useWalletAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showVerify, setShowVerify] = useState(false);

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

        {/* Wallet Connection */}
        <Card>
          <CardTitle>
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-neon" /> Wallet Connection
            </div>
          </CardTitle>
          {user?.has_wallet ? (
            <div className="flex items-center gap-2 mt-4">
              <CheckCircle className="h-4 w-4 text-neon" />
              <span className="text-sm text-gray-300 font-mono">{user.wallet_address_hash?.slice(0, 12)}...{user.wallet_address_hash?.slice(-8)}</span>
              <Badge variant="success">Connected</Badge>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-400">Connect an Ethereum wallet to enable on-chain trading and verification.</p>
              <ConnectButton.Custom>
                {({ openConnectModal, account, mounted }) => {
                  const ready = mounted;
                  const connected = ready && account;
                  return (
                    <>
                      {!connected ? (
                        <Button onClick={openConnectModal}>
                          <Wallet className="h-4 w-4" />
                          Connect Wallet
                        </Button>
                      ) : (
                        <Button
                          className="group"
                          onClick={async () => {
                            await authenticate();
                            await fetchMe();
                          }}
                          loading={walletLoading}
                        >
                          Link Wallet
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      )}
                    </>
                  );
                }}
              </ConnectButton.Custom>
              {isConnected && !user?.has_wallet && (
                <p className="text-xs text-gray-500">Wallet detected. Click &quot;Link Wallet&quot; to sign and connect it to your account.</p>
              )}
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
