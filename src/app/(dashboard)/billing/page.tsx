"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CreditCard,
  Zap,
  X,
  Search,
  ExternalLink,
  ChevronDown,
  Loader2,
  Crown,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { PageSpinner } from "@/components/ui/Spinner";
import useBilling from "@/hooks/useBilling";
import { formatCurrency, formatDate, capitalize } from "@/lib/utils";
import type { Plan } from "@/types";

const CRYPTO_ICON_URL = "https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color";

// Popular currencies shown first in the picker
const POPULAR_CURRENCIES = [
  "btc", "eth", "usdterc20", "usdttrc20", "usdc", "sol", "bnbbsc", "xrp",
  "doge", "matic", "ltc", "trx", "avaxc", "ada", "shib", "dai", "usdtbsc",
  "usdcsol",
];

// Map NowPayments currency codes to icon file names and display labels
const CURRENCY_MAP: Record<string, { icon: string; label: string }> = {
  usdterc20: { icon: "usdt", label: "USDT (ERC20)" },
  usdttrc20: { icon: "usdt", label: "USDT (TRC20)" },
  usdtbsc: { icon: "usdt", label: "USDT (BSC)" },
  usdtmatic: { icon: "usdt", label: "USDT (Polygon)" },
  usdtarb: { icon: "usdt", label: "USDT (Arbitrum)" },
  usdtop: { icon: "usdt", label: "USDT (Optimism)" },
  usdtsol: { icon: "usdt", label: "USDT (Solana)" },
  usdtton: { icon: "usdt", label: "USDT (TON)" },
  usdcsol: { icon: "usdc", label: "USDC (Solana)" },
  usdcmatic: { icon: "usdc", label: "USDC (Polygon)" },
  usdcbsc: { icon: "usdc", label: "USDC (BSC)" },
  usdcarb: { icon: "usdc", label: "USDC (Arbitrum)" },
  usdcbase: { icon: "usdc", label: "USDC (Base)" },
  usdcop: { icon: "usdc", label: "USDC (Optimism)" },
  bnbbsc: { icon: "bnb", label: "BNB (BSC)" },
  avaxc: { icon: "avax", label: "AVAX (C-Chain)" },
  ethbase: { icon: "eth", label: "ETH (Base)" },
  etharb: { icon: "eth", label: "ETH (Arbitrum)" },
  ethbsc: { icon: "eth", label: "ETH (BSC)" },
  maticmainnet: { icon: "matic", label: "MATIC (Mainnet)" },
  shibbsc: { icon: "shib", label: "SHIB (BSC)" },
  daiarb: { icon: "dai", label: "DAI (Arbitrum)" },
};

function getCurrencyIcon(symbol: string): string {
  return CURRENCY_MAP[symbol.toLowerCase()]?.icon || symbol.toLowerCase();
}

function getCurrencyLabel(symbol: string): string {
  return CURRENCY_MAP[symbol.toLowerCase()]?.label || symbol.toUpperCase();
}

function CryptoIcon({ symbol, size = 24 }: { symbol: string; size?: number }) {
  const [errored, setErrored] = useState(false);
  const iconName = getCurrencyIcon(symbol);

  if (errored) {
    return (
      <div
        className="rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase flex-shrink-0"
        style={{ width: size, height: size }}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={`${CRYPTO_ICON_URL}/${iconName}.svg`}
      alt={symbol}
      width={size}
      height={size}
      className="rounded-full flex-shrink-0"
      onError={() => setErrored(true)}
    />
  );
}

interface CurrencyPickerProps {
  currencies: string[];
  selected: string;
  onSelect: (currency: string) => void;
}

function CurrencyPicker({ currencies, selected, onSelect }: CurrencyPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const sorted = useMemo(() => {
    const popular = POPULAR_CURRENCIES.filter((c) => currencies.includes(c));
    const rest = currencies.filter((c) => !POPULAR_CURRENCIES.includes(c)).sort();
    return [...popular, ...rest];
  }, [currencies]);

  const filtered = useMemo(() => {
    if (!search) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (c) => c.toLowerCase().includes(q) || getCurrencyLabel(c).toLowerCase().includes(q)
    );
  }, [sorted, search]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl bg-dark-200/80 border border-white/10 hover:border-neon/30 transition-colors text-left"
      >
        {selected ? (
          <>
            <CryptoIcon symbol={selected} size={20} />
            <span className="text-sm font-medium text-white flex-1">{getCurrencyLabel(selected)}</span>
          </>
        ) : (
          <span className="text-sm text-gray-500 flex-1">Select payment currency</span>
        )}
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 top-full left-0 right-0 mt-2 rounded-xl bg-dark-200 border border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="p-2 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search currency..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white/[0.03] border border-white/5 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-neon/30"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto scrollbar-none p-1">
              {filtered.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No currencies found</p>
              ) : (
                filtered.map((currency) => (
                  <button
                    key={currency}
                    type="button"
                    onClick={() => {
                      onSelect(currency);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left transition-colors ${
                      selected === currency
                        ? "bg-neon/10 text-neon"
                        : "text-gray-300 hover:bg-white/[0.03] hover:text-white"
                    }`}
                  >
                    <CryptoIcon symbol={currency} size={18} />
                    <span className="text-xs font-medium flex-1">{getCurrencyLabel(currency)}</span>
                    {selected === currency && <Check className="h-3.5 w-3.5 text-neon" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CheckoutModalProps {
  plan: Plan;
  currencies: string[];
  currenciesLoading: boolean;
  loading: boolean;
  onLoadCurrencies: () => void;
  onSubscribe: (planId: string, payCurrency?: string) => Promise<unknown>;
  onClose: () => void;
}

function CheckoutModal({ plan, currencies, currenciesLoading, loading, onLoadCurrencies, onSubscribe, onClose }: CheckoutModalProps) {
  const [payCurrency, setPayCurrency] = useState("");

  useEffect(() => {
    if (currencies.length === 0 && !currenciesLoading) {
      onLoadCurrencies();
    }
  }, [currencies.length, currenciesLoading, onLoadCurrencies]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-dark-200 border border-white/10 rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
            <div>
              <h3 className="text-lg font-bold text-white">Complete Payment</h3>
              <p className="text-xs text-gray-500 mt-0.5">Choose your preferred cryptocurrency</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Plan Summary */}
          <div className="px-6 py-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Plan</p>
                <p className="text-sm font-semibold text-white mt-0.5">{plan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Amount</p>
                <p className="text-lg font-bold text-neon mt-0.5">{formatCurrency(plan.price_usd)}</p>
                <p className="text-[10px] text-gray-500">/{plan.billing_cycle}</p>
              </div>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="px-6 py-4 space-y-3">
            <label className="block text-xs font-medium text-gray-400">Payment Currency</label>
            {currenciesLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-dark-200/80 border border-white/10">
                <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
                <span className="text-sm text-gray-500">Loading currencies...</span>
              </div>
            ) : currencies.length === 0 ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <span className="text-xs text-red-400">Failed to load currencies</span>
                <button
                  type="button"
                  onClick={onLoadCurrencies}
                  className="text-xs text-neon hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <CurrencyPicker currencies={currencies} selected={payCurrency} onSelect={setPayCurrency} />
            )}
            <p className="text-[10px] text-gray-600">
              You&apos;ll be redirected to NOWPayments to complete the transaction securely.
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 pb-5 pt-2 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              loading={loading}
              disabled={!payCurrency}
              onClick={async () => {
                await onSubscribe(plan.id, payCurrency);
                onClose();
              }}
            >
              Pay with {payCurrency ? getCurrencyLabel(payCurrency) : "Crypto"}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function BillingPage() {
  const {
    plans,
    subscription,
    payments,
    currencies,
    loading,
    currenciesLoading,
    fetchPlans,
    fetchSubscription,
    fetchCurrencies,
    fetchPayments,
    subscribe,
  } = useBilling();

  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
    fetchPayments();
    fetchCurrencies();
  }, [fetchPlans, fetchSubscription, fetchPayments, fetchCurrencies]);

  if (loading && plans.length === 0) return <PageSpinner />;

  const hasActiveSub = subscription?.status === "active";
  const hasPendingPayment = subscription?.status === "pending_payment";

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your subscription and payments</p>
        </div>

        {/* Payment Status Banner */}
        <AnimatePresence>
          {paymentStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-neon/20 bg-neon/5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-neon flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Payment submitted!</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Your payment is being confirmed. Your subscription will activate once the transaction is verified on-chain.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
          {paymentStatus === "cancelled" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-white">Payment cancelled</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Your payment was cancelled. You can try again anytime by selecting a plan below.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Subscription */}
        {subscription && (
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {hasActiveSub && (
                  <div className="h-10 w-10 rounded-xl bg-neon/10 flex items-center justify-center">
                    <Crown className="h-5 w-5 text-neon" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Current Plan</p>
                  <p className="text-xl font-bold text-white mt-0.5">
                    {subscription.plan?.name || "Unknown Plan"}
                  </p>
                  {subscription.expires_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      {hasActiveSub ? "Renews" : "Expires"} {formatDate(subscription.expires_at)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {hasPendingPayment && subscription.invoice_url && (
                  <a
                    href={subscription.invoice_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon/10 text-neon text-xs font-medium hover:bg-neon/20 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Complete Payment
                  </a>
                )}
                <StatusBadge status={subscription.status} />
              </div>
            </div>
          </Card>
        )}

        {/* Plans */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, i) => {
              const isCurrentPlan = subscription?.plan_id === plan.id && hasActiveSub;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlowCard className={isCurrentPlan ? "border-neon/30" : ""}>
                    {isCurrentPlan && (
                      <Badge variant="neon" className="mb-3">Current Plan</Badge>
                    )}
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <div className="mt-2 mb-4">
                      <span className="text-3xl font-bold text-neon">{formatCurrency(plan.price_usd)}</span>
                      <span className="text-sm text-gray-500">/{plan.billing_cycle}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-neon flex-shrink-0" />
                        {plan.max_strategies === 0 ? "Unlimited" : `Up to ${plan.max_strategies}`} strategies
                      </li>
                      <li className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-neon flex-shrink-0" />
                        {formatCurrency(plan.max_allocation)} max allocation
                      </li>
                      {plan.ate_access && (
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                          <Zap className="h-4 w-4 text-neon flex-shrink-0" />
                          ATE access
                        </li>
                      )}
                      {plan.trial_days > 0 && (
                        <li className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="h-4 w-4 text-neon flex-shrink-0" />
                          {plan.trial_days} day free trial
                        </li>
                      )}
                    </ul>
                    {isCurrentPlan ? (
                      <Button className="w-full" variant="secondary" disabled>
                        Current Plan
                      </Button>
                    ) : plan.trial_days > 0 && !hasActiveSub ? (
                      <div className="space-y-2">
                        <Button
                          className="w-full"
                          variant="primary"
                          disabled={loading}
                          onClick={() => subscribe(plan.id, undefined, true)}
                          loading={loading}
                        >
                          Start {plan.trial_days}-Day Free Trial
                        </Button>
                        <Button
                          className="w-full"
                          variant="secondary"
                          disabled={loading}
                          onClick={() => setCheckoutPlan(plan)}
                        >
                          Subscribe Now
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full"
                        variant="primary"
                        disabled={loading}
                        onClick={() => setCheckoutPlan(plan)}
                      >
                        Subscribe
                      </Button>
                    )}
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Payment History */}
        {payments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Payment History</h2>
            <Card>
              <div className="divide-y divide-white/5">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      {payment.crypto_currency ? (
                        <CryptoIcon symbol={payment.crypto_currency} size={20} />
                      ) : (
                        <CreditCard className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <p className="text-sm text-white">{formatCurrency(payment.amount_usd)}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.created_at)}
                          {payment.crypto_currency && (
                            <span className="ml-1.5 text-gray-600">
                              via {payment.crypto_currency.toUpperCase()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={payment.status} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutPlan && (
          <CheckoutModal
            plan={checkoutPlan}
            currencies={currencies}
            currenciesLoading={currenciesLoading}
            loading={loading}
            onLoadCurrencies={fetchCurrencies}
            onSubscribe={subscribe}
            onClose={() => setCheckoutPlan(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
