"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Mail,
  Wallet,
  CreditCard,
  BarChart3,
  TrendingUp,
  Check,
  X,
  type LucideIcon,
} from "lucide-react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import ProgressBar from "@/components/ui/ProgressBar";

interface SetupStep {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
  completed: boolean;
}

interface GettingStartedCardProps {
  emailVerified: boolean;
  hasWallet: boolean;
  isSubscribed: boolean;
  strategyCount: number;
  executionCount: number;
}

export default function GettingStartedCard({
  emailVerified,
  hasWallet,
  isSubscribed,
  strategyCount,
  executionCount,
}: GettingStartedCardProps) {
  const dismissed = useOnboardingStore((s) => s.dismissed);
  const setDismissed = useOnboardingStore((s) => s.setDismissed);

  const steps: SetupStep[] = useMemo(
    () => [
      {
        id: "email",
        label: "Verify Email",
        description: "Confirm your email address",
        icon: Mail,
        href: "/settings",
        completed: emailVerified,
      },
      {
        id: "wallet",
        label: "Connect Wallet",
        description: "Link your HyperLiquid wallet",
        icon: Wallet,
        href: "/settings",
        completed: hasWallet,
      },
      {
        id: "subscribe",
        label: "Subscribe to a Plan",
        description: "Unlock AI-powered trading",
        icon: CreditCard,
        href: "/billing",
        completed: isSubscribed,
      },
      {
        id: "strategy",
        label: "Create a Strategy",
        description: "Set up your trading parameters",
        icon: BarChart3,
        href: "/strategies",
        completed: strategyCount > 0,
      },
      {
        id: "trade",
        label: "First Trade",
        description: "Execute your first automated trade",
        icon: TrendingUp,
        href: "/executions",
        completed: executionCount > 0,
      },
    ],
    [emailVerified, hasWallet, isSubscribed, strategyCount, executionCount]
  );

  const completedCount = steps.filter((s) => s.completed).length;
  const allComplete = completedCount === steps.length;

  if (dismissed || allComplete) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0 }}
        className="rounded-2xl border border-white/10 bg-dark-200/80 p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-white">Getting Started</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              {completedCount} of {steps.length} complete
            </p>
          </div>
          <button
            onClick={setDismissed}
            className="p-1 rounded text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors"
            title="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <ProgressBar
          value={completedCount}
          max={steps.length}
          className="mb-4"
        />

        <div className="space-y-1">
          {steps.map((step, i) => (
            <Link
              key={step.id}
              href={step.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors group"
            >
              <div
                className={
                  step.completed
                    ? "p-1.5 rounded-lg bg-neon/10"
                    : "p-1.5 rounded-lg bg-white/5"
                }
              >
                {step.completed ? (
                  <Check className="h-3.5 w-3.5 text-neon" />
                ) : (
                  <step.icon className="h-3.5 w-3.5 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={
                    step.completed
                      ? "text-xs text-gray-500 line-through"
                      : "text-xs text-gray-300 group-hover:text-white transition-colors"
                  }
                >
                  {step.label}
                </p>
                {!step.completed && (
                  <p className="text-[10px] text-gray-600">{step.description}</p>
                )}
              </div>
              <span className="text-[10px] text-gray-700 font-mono">
                {i + 1}/{steps.length}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
