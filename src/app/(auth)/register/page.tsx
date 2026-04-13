"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus, Gift, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

function RegisterForm() {
  const { register, loading } = useAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") || "");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.email_verified) {
        router.replace("/dashboard");
      } else {
        router.replace("/verify-email");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await register(email, password, referralCode || undefined);
    } catch {
      // Error toast handled by API interceptor
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img src="/logo_dark.png" alt="EulerX" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <p className="text-sm text-gray-400 mt-2">Start trading with AI-powered automation</p>
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

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full bg-dark-50 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  minLength={8}
                  className="w-full bg-dark-50 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">
                Referral Code <span className="text-gray-600">(optional)</span>
              </label>
              <div className="relative">
                <Gift className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Enter referral code"
                  className="w-full bg-dark-50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-colors"
                />
              </div>
            </div>

            {/* Legal acceptance */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-white/20 bg-dark-50 text-neon focus:ring-neon/30 accent-emerald-500 shrink-0"
                />
                <span className="text-xs text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/legal/terms" target="_blank" className="text-neon hover:underline">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link href="/legal/privacy" target="_blank" className="text-neon hover:underline">
                    Privacy Policy
                  </Link>
                  ,{" "}
                  <Link href="/legal/risk-disclosure" target="_blank" className="text-neon hover:underline">
                    Risk Disclosure
                  </Link>
                  , and{" "}
                  <Link href="/legal/gdpr" target="_blank" className="text-neon hover:underline">
                    GDPR Data Processing Agreement
                  </Link>
                  .
                </span>
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <Button type="submit" size="lg" className="w-full" loading={loading} disabled={!email || !password || !confirmPassword || !acceptedTerms}>
              <UserPlus className="h-4 w-4" />
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-neon hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        {/* Legal links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-6">
          <Link href="/legal/terms" target="_blank" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
            Terms
          </Link>
          <Link href="/legal/privacy" target="_blank" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
            Privacy
          </Link>
          <Link href="/legal/risk-disclosure" target="_blank" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
            Risk Disclosure
          </Link>
          <Link href="/legal/gdpr" target="_blank" className="text-[11px] text-gray-600 hover:text-gray-400 transition-colors">
            GDPR
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
