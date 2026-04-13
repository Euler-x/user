"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

export default function VerifyEmailPage() {
  const { verifyEmail, submitEmail, loading, user } = useAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();
  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.email_verified) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyEmail(code);
      router.replace("/dashboard");
    } catch {
      // Error toast handled by API interceptor
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    setResending(true);
    try {
      await submitEmail(user.email);
    } finally {
      setResending(false);
    }
  };

  if (!isAuthenticated || user?.email_verified) return null;

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
          <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          <p className="text-sm text-gray-400 mt-2">
            We sent a 6-digit verification code to{" "}
            <span className="text-white font-medium">{user?.email}</span>
          </p>
        </div>

        <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                className="w-full bg-dark-50 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-mono text-white tracking-[0.5em] placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-colors"
              />
            </div>

            <Button type="submit" size="lg" className="w-full group" loading={loading} disabled={code.length !== 6}>
              Verify Email
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-neon hover:underline disabled:opacity-50"
              >
                {resending ? "Sending..." : "Resend code"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
