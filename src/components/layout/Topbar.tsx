"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { shortenAddress } from "@/lib/utils";
import NotificationCenter from "@/components/layout/NotificationCenter";
import Tooltip from "@/components/ui/Tooltip";

interface TopbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/strategies": "Strategies",
  "/signals": "Signals",
  "/executions": "Executions",
  "/transactions": "Transactions",
  "/analytics": "Analytics",
  "/transparency": "Transparency",
  "/billing": "Billing",
  "/ambassador": "Ambassador",
  "/support": "Support",
  "/learn": "Learn",
  "/settings": "Settings",
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();

  const pageTitle = Object.entries(pageTitles).find(
    ([path]) => pathname === path || pathname.startsWith(path + "/")
  )?.[1];

  return (
    <header className="sticky top-0 z-30 bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-14 px-4 lg:px-8">
        {/* Left: Mobile menu + Page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          {pageTitle && (
            <h2 className="hidden lg:block text-sm font-medium text-gray-400">
              {pageTitle}
            </h2>
          )}
        </div>

        {/* Right: Actions + User */}
        {user && (
          <div className="flex items-center gap-2">
            <Tooltip content="Notifications" placement="bottom">
              <NotificationCenter />
            </Tooltip>

            <div className="h-5 w-px bg-white/5" />

            <div className="flex items-center gap-2.5 pl-2">
              {user.has_wallet && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-neon animate-glow-pulse" />
                  <span className="text-xs text-gray-400 font-mono">
                    {user.wallet_address_hash ? shortenAddress(user.wallet_address_hash, 4) : "Connected"}
                  </span>
                </div>
              )}
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-neon/30 to-cyan-500/30 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white">
                  {user.email ? user.email.slice(0, 2).toUpperCase() : "U"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
