"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Rocket, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useAuthStore } from "@/stores/authStore";

export default function WelcomeBanner() {
  const dismissed = useOnboardingStore((s) => s.dismissed);
  const setDismissed = useOnboardingStore((s) => s.setDismissed);
  const user = useAuthStore((s) => s.user);

  // Only show for users created within the last 7 days
  const isNewUser = user?.created_at
    ? Date.now() - new Date(user.created_at).getTime() < 7 * 86_400_000
    : false;

  if (dismissed || !isNewUser) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl border border-neon/20 bg-gradient-to-r from-neon/[0.04] via-dark-200 to-cyan-500/[0.04] p-5 mb-6 overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-neon/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={setDismissed}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-neon/10 border border-neon/20 shrink-0">
            <Rocket className="h-5 w-5 text-neon" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-white mb-1">
              Welcome to EulerX
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xl mb-3">
              Your AI-powered trading engine is ready. Connect your wallet, create
              a strategy, and let our multi-model consensus system find
              high-probability setups for you.
            </p>
            <Link
              href="/strategies"
              className="inline-flex items-center gap-1.5 text-xs text-neon font-medium hover:underline"
            >
              Create your first strategy
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
