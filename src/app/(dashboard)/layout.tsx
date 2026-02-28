"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileNav from "@/components/layout/MobileNav";
import { useAuthStore, useAuthHasHydrated } from "@/stores/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const hasHydrated = useAuthHasHydrated();

  useEffect(() => {
    // Wait until Zustand has rehydrated from localStorage before making any
    // redirect decisions. Without this guard, the first render sees the default
    // state (refreshToken = null) and fires a premature redirect to /login,
    // which the middleware bounces back to /dashboard — leaving the user stuck.
    if (!hasHydrated) return;

    if (!isAuthenticated && !refreshToken) {
      // Use a hard navigation so the cleared cookie is respected by the
      // middleware. A soft router.replace can be bounced back if the
      // eulerx-session cookie is still present (e.g. after 7-day expiry race).
      window.location.href = "/login";
    } else if (isAuthenticated && user && !user.email_verified) {
      router.replace("/verify-email");
    }
  }, [hasHydrated, isAuthenticated, refreshToken, user, router]);

  // Show a spinner while:
  //  - Zustand is still rehydrating from localStorage, OR
  //  - the silent refresh is in progress (refreshToken exists but isAuthenticated is still false), OR
  //  - we're waiting for email verification redirect
  if (!hasHydrated || !isAuthenticated || !user?.email_verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-neon/30 border-t-neon animate-spin" />
          <p className="text-sm text-gray-600">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
