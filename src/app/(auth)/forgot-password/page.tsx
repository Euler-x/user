"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Turnstile, { type TurnstileInstance } from "@/components/ui/Turnstile";
import useAuth from "@/hooks/useAuth";

export default function ForgotPasswordPage() {
  const { requestPasswordReset, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [cfToken, setCfToken] = useState("");

  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email, cfToken);
      setSent(true);
    } catch {
      // Reset widget so user gets a fresh token on retry
      turnstileRef.current?.reset();
      setCfToken("");
    }
  };

  const canSubmit = !loading && email;

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-10">
                <div className="flex justify-center mb-6">
                  <img src="/logo_dark.png" alt="EulerX" className="h-10 w-auto" />
                </div>
                <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
                <p className="text-sm text-gray-400 mt-2">
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>

              <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-300">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="w-full bg-dark-50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-colors"
                      />
                    </div>
                  </div>

                  <Turnstile
                    ref={turnstileRef}
                    onSuccess={setCfToken}
                    onExpire={() => setCfToken("")}
                    onError={() => setCfToken("")}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group"
                    loading={loading}
                    disabled={!canSubmit}
                  >
                    Send Reset Link
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Remembered it?{" "}
                  <Link href="/login" className="text-neon hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-neon/10 border border-neon/20 mb-6">
                  <CheckCircle2 className="h-8 w-8 text-neon" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Check your inbox</h2>
                <p className="text-sm text-gray-400 mb-1">We sent a reset link to</p>
                <p className="text-sm font-medium text-white mb-6 truncate">{email}</p>
                <p className="text-xs text-gray-500 mb-6">
                  The link expires in 30 minutes. Check your spam folder if you don&apos;t see it.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-neon hover:underline"
                >
                  Back to sign in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
