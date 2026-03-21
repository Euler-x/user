"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Zap,
  LayoutDashboard,
  Brain,
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
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import useBilling from "@/hooks/useBilling";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  iconUrl?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const HL_LOGO = "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120519/hyprliquid_orr9vl.webp";
const BYBIT_LOGO = "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120520/bybit_obnhd8.webp";

const navGroups: NavGroup[] = [
  {
    title: "Trading",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Strategies", href: "/strategies", icon: Brain },
      { label: "HL Signals", href: "/signals?exchange=hyperliquid", icon: Zap, iconUrl: HL_LOGO },
      { label: "Bybit Signals", href: "/signals?exchange=bybit", icon: Zap, iconUrl: BYBIT_LOGO },
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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const { subscription, fetchSubscription } = useBilling();
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (isOpen) fetchSubscription();
  }, [isOpen, fetchSubscription]);

  const hasActiveSub = subscription?.status === "active" && subscription.plan;
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "U";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-dark-200 border-r border-white/5 z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-neon/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-neon" />
                  </div>
                  <span className="text-xl font-bold text-gradient">EulerX</span>
                </Link>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
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
                        const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");
                        const hrefPath = item.href.split("?")[0];
                        const isActive = item.href.includes("?")
                          ? fullPath === item.href
                          : pathname === hrefPath || pathname.startsWith(hrefPath + "/");
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
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
                            {item.iconUrl ? (
                              <img src={item.iconUrl} alt="" className="h-4 w-4 flex-shrink-0 rounded-sm" />
                            ) : (
                              <item.icon
                                className={cn(
                                  "h-4 w-4 flex-shrink-0 transition-colors",
                                  isActive ? "text-neon" : "text-gray-500 group-hover/item:text-gray-300"
                                )}
                              />
                            )}
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
                {!hasActiveSub && (
                  <Link
                    href="/billing"
                    onClick={onClose}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/10 hover:border-amber-500/25 transition-all duration-300"
                  >
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">Upgrade to Pro</p>
                      <p className="text-[10px] text-gray-500">Unlock all features</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-amber-400/40 group-hover:text-amber-400 transition-all flex-shrink-0" />
                  </Link>
                )}

                {user && !user.has_wallet && (
                  <button
                    onClick={() => {
                      onClose();
                      setShowWalletModal(true);
                    }}
                    className="group flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-neon/10 via-neon/5 to-transparent border border-neon/10 hover:border-neon/25 transition-all duration-300"
                  >
                    <div className="h-8 w-8 rounded-lg bg-neon/10 flex items-center justify-center flex-shrink-0">
                      <Wallet className="h-4 w-4 text-neon" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-semibold text-white">Connect Wallet</p>
                      <p className="text-[10px] text-gray-500">Enable trading</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-neon/40 group-hover:text-neon transition-all flex-shrink-0" />
                  </button>
                )}

                {/* Language */}
                <LanguageSwitcher compact />

                <div className="border-t border-white/5" />

                <button
                  onClick={() => {
                    onClose();
                    logout();
                    window.location.href = "/login";
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <ConnectWalletModal isOpen={showWalletModal} onClose={() => setShowWalletModal(false)} />
    </>
  );
}
