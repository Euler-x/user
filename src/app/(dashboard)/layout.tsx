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
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user && !user.email_verified) {
      router.replace("/verify-email");
    }
  }, [isAuthenticated, user, router]);

  // Show a neutral loading screen while the client hydrates or redirects,
  // preventing a flash of unprotected content.
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
