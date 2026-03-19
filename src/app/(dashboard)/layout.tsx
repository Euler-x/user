"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import MobileNav from "@/components/layout/MobileNav";
import Footer from "@/components/layout/Footer";
import ShortcutsModal from "@/components/ui/ShortcutsModal";
import CommandPalette from "@/components/ui/CommandPalette";
import { useKeyboardShortcuts, type Shortcut } from "@/hooks/useKeyboardShortcuts";
import { useAuthStore, useAuthHasHydrated } from "@/stores/authStore";

/** Max time (ms) to wait for the silent refresh before forcing a redirect. */
const REFRESH_TIMEOUT_MS = 10_000;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const hasHydrated = useAuthHasHydrated();
  const redirecting = useRef(false);

  const openShortcuts = useCallback(() => setShortcutsOpen(true), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closeAll = useCallback(() => {
    setShortcutsOpen(false);
    setPaletteOpen(false);
  }, []);

  const shortcuts: Shortcut[] = useMemo(
    () => [
      { key: "?", description: "Show keyboard shortcuts", action: openShortcuts, category: "General" },
      { key: "Ctrl+k", description: "Open command palette", action: openPalette, category: "General" },
      { key: "Escape", description: "Close dialogs", action: closeAll, category: "General" },
      { key: "g d", description: "Go to Dashboard", action: () => router.push("/dashboard"), category: "Navigation" },
      { key: "g s", description: "Go to Strategies", action: () => router.push("/strategies"), category: "Navigation" },
      { key: "g x", description: "Go to Executions", action: () => router.push("/executions"), category: "Navigation" },
      { key: "g a", description: "Go to Analytics", action: () => router.push("/analytics"), category: "Navigation" },
      { key: "g b", description: "Go to Billing", action: () => router.push("/billing"), category: "Navigation" },
      { key: "g t", description: "Go to Transactions", action: () => router.push("/transactions"), category: "Navigation" },
    ],
    [router, openShortcuts, openPalette, closeAll]
  );

  useKeyboardShortcuts(shortcuts);

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
      if (!redirecting.current) {
        redirecting.current = true;
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    } else if (isAuthenticated && user && !user.email_verified) {
      router.replace("/verify-email");
    }
  }, [hasHydrated, isAuthenticated, refreshToken, user, router]);

  // Safety net: if the silent refresh hasn't completed within 10 seconds
  // after hydration (e.g. API hangs, network drops, or an unhandled edge
  // case), force-clear everything and redirect to /login. This guarantees
  // the user is never stuck on a spinner indefinitely.
  useEffect(() => {
    if (!hasHydrated || isAuthenticated) return;

    const timer = setTimeout(() => {
      // Re-check live store state (not the stale closure value)
      if (!useAuthStore.getState().isAuthenticated) {
        redirecting.current = true;
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }, REFRESH_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [hasHydrated, isAuthenticated]);

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
        <Footer />
      </div>
      <ShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        shortcuts={shortcuts}
      />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </div>
  );
}
