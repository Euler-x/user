"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Brain,
  Zap,
  Activity,
  ArrowLeftRight,
  BarChart3,
  ShieldCheck,
  CreditCard,
  Users,
  LifeBuoy,
  GraduationCap,
  Settings,
  LogOut,
  Crown,
  Sparkles,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import useBilling from "@/hooks/useBilling";
import ConnectWalletModal from "@/components/ConnectWalletModal";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Strategies", href: "/strategies", icon: Brain },
  { label: "Signals", href: "/signals", icon: Zap },
  { label: "Executions", href: "/executions", icon: Activity },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Transparency", href: "/transparency", icon: ShieldCheck },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Ambassador", href: "/ambassador", icon: Users },
  { label: "Support", href: "/support", icon: LifeBuoy },
  { label: "Learn", href: "/learn", icon: GraduationCap },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const { subscription, fetchSubscription } = useBilling();
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const hasActiveSub = subscription?.status === "active" && subscription.plan;

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-dark-200/50 backdrop-blur-xl border-r border-white/5 fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-neon/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-neon" />
            </div>
            <span className="text-xl font-bold text-gradient">EulerX</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-neon/10 text-neon border border-neon/20 shadow-neon-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-3 border-t border-white/5">
          {/* Plan Badge */}
          {hasActiveSub ? (
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-neon/5 border border-neon/10">
              <Crown className="h-4 w-4 text-neon flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neon truncate">{subscription.plan!.name} Plan</p>
                <p className="text-[10px] text-gray-500">Active</p>
              </div>
            </div>
          ) : (
            <Link
              href="/billing"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/25 transition-colors group"
            >
              <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-400">Upgrade to Pro</p>
                <p className="text-[10px] text-gray-500">Unlock all features</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-amber-400/50 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          )}

          {/* Connect Wallet */}
          {user && !user.has_wallet && (
            <button
              onClick={() => setShowWalletModal(true)}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl bg-neon/5 border border-neon/10 hover:border-neon/25 transition-colors group"
            >
              <Wallet className="h-4 w-4 text-neon flex-shrink-0" />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-neon">Connect Wallet</p>
                <p className="text-[10px] text-gray-500">Enable trading</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-neon/50 group-hover:text-neon group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          )}

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut className="h-4.5 w-4.5" />
            Log out
          </button>
        </div>
      </aside>

      <ConnectWalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </>
  );
}
