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
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import useBilling from "@/hooks/useBilling";
import ConnectWalletModal from "@/components/ConnectWalletModal";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Trading",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Strategies", href: "/strategies", icon: Brain },
      { label: "Signals", href: "/signals", icon: Zap },
      { label: "Executions", href: "/executions", icon: Activity },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
      { label: "Transparency", href: "/transparency", icon: ShieldCheck },
      { label: "Billing", href: "/billing", icon: CreditCard },
    ],
  },
  {
    title: "More",
    items: [
      { label: "Ambassador", href: "/ambassador", icon: Users },
      { label: "Learn", href: "/learn", icon: GraduationCap },
      { label: "Support", href: "/support", icon: LifeBuoy },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
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
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "U";

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-dark-200/50 backdrop-blur-xl border-r border-white/5 fixed left-0 top-0 z-40">
        {/* Logo */}
        <div className="px-6 pt-6 pb-4">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-xl bg-neon/20 flex items-center justify-center group-hover:shadow-neon-sm transition-shadow duration-300">
              <Zap className="h-5 w-5 text-neon" />
            </div>
            <span className="text-xl font-bold text-gradient">EulerX</span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="mx-4 mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-neon/30 to-cyan-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">
                {user?.email || "User"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {hasActiveSub ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-neon">
                    <Crown className="h-2.5 w-2.5" />
                    {subscription.plan!.name}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-500">Free plan</span>
                )}
                {user?.has_wallet && (
                  <span className="h-1.5 w-1.5 rounded-full bg-neon animate-glow-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto scrollbar-none space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group/item flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 relative",
                        isActive
                          ? "bg-neon/10 text-neon"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-neon shadow-neon-sm" />
                      )}
                      <item.icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-colors",
                          isActive ? "text-neon" : "text-gray-500 group-hover/item:text-gray-300"
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-2">
          {/* Upgrade CTA */}
          {!hasActiveSub && (
            <Link
              href="/billing"
              className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/10 hover:border-amber-500/25 transition-all duration-300"
            >
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">Upgrade to Pro</p>
                <p className="text-[10px] text-gray-500">Unlock all features</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-amber-400/40 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          )}

          {/* Connect Wallet */}
          {user && !user.has_wallet && (
            <button
              onClick={() => setShowWalletModal(true)}
              className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-neon/10 via-neon/5 to-transparent border border-neon/10 hover:border-neon/25 transition-all duration-300"
            >
              <div className="h-8 w-8 rounded-lg bg-neon/10 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-4 w-4 text-neon" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-white">Connect Wallet</p>
                <p className="text-[10px] text-gray-500">Enable trading</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-neon/40 group-hover:text-neon group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </button>
          )}

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <ConnectWalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </>
  );
}
