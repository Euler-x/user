"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Zap } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import GlowCard from "@/components/ui/GlowCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatusBadge from "@/components/ui/StatusBadge";
import { PageSpinner } from "@/components/ui/Spinner";
import useBilling from "@/hooks/useBilling";
import { formatCurrency, formatDate, capitalize } from "@/lib/utils";

export default function BillingPage() {
  const { plans, subscription, payments, loading, fetchPlans, fetchSubscription, fetchPayments, subscribe } = useBilling();

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
    fetchPayments();
  }, [fetchPlans, fetchSubscription, fetchPayments]);

  if (loading && plans.length === 0) return <PageSpinner />;

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your subscription and payments</p>
        </div>

        {/* Current Subscription */}
        {subscription && (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">Current Plan</p>
                <p className="text-xl font-bold text-white mt-1">
                  {subscription.plan?.name || "Unknown Plan"}
                </p>
                {subscription.expires_at && (
                  <p className="text-sm text-gray-400 mt-1">
                    Expires {formatDate(subscription.expires_at)}
                  </p>
                )}
              </div>
              <StatusBadge status={subscription.status} />
            </div>
          </Card>
        )}

        {/* Plans */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan, i) => {
              const isCurrentPlan = subscription?.plan_id === plan.id && subscription.status === "active";
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
                        Up to {plan.max_strategies} strategies
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
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "secondary" : "primary"}
                      disabled={isCurrentPlan}
                      onClick={() => subscribe(plan.id)}
                    >
                      {isCurrentPlan ? "Current Plan" : "Subscribe"}
                    </Button>
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
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-white">{formatCurrency(payment.amount_usd)}</p>
                        <p className="text-xs text-gray-500">{formatDate(payment.created_at)}</p>
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
    </PageTransition>
  );
}
