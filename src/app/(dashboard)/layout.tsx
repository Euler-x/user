"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileNav from "@/components/layout/MobileNav";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    // Only redirect to login when we definitively have no session:
    // no in-memory auth AND no refresh token to restore from.
    if (!isAuthenticated && !refreshToken) {
      router.replace("/login");
    } else if (isAuthenticated && user && !user.email_verified) {
      router.replace("/verify-email");
    }
  }, [isAuthenticated, refreshToken, user, router]);

  // Show a spinner while:
  //  - the silent refresh is in progress (refreshToken exists but isAuthenticated is still false), OR
  //  - we're waiting for email verification redirect
  if (!isAuthenticated || !user?.email_verified) {
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
