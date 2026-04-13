"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword, loading } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  // Redirect if token is missing
  const [tokenMissing, setTokenMissing] = useState(false);
  useEffect(() => {
    if (!token) setTokenMissing(true);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword(token!, newPassword);
      router.replace("/login");
    } catch {
      // Error toast handled by API interceptor
    }
  };

  if (tokenMissing) {
    return (
      <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
        <p className="text-sm text-gray-400 mb-6">
          This reset link is missing or malformed. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-medium text-neon hover:underline"
        >
          Request a new link
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <img src="/logo_dark.png" alt="EulerX" className="h-10 w-auto" />
        </div>
        <h1 className="text-2xl font-bold text-white">Set New Password</h1>
        <p className="text-sm text-gray-400 mt-2">Choose a strong password for your account</p>
      </div>

      <div className="bg-dark-200/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="w-full bg-dark-50 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
                className="w-full bg-dark-50 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full group"
            loading={loading}
            disabled={!newPassword || !confirmPassword}
          >
            Reset Password
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-neon hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
