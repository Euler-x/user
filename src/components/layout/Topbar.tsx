"use client";

import { Menu } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { shortenAddress } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-30 bg-dark/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1" />

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3">
            {user.email_verified && (
              <Badge variant="success">Verified</Badge>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-200 border border-white/5">
              <div className="h-2 w-2 rounded-full bg-neon animate-glow-pulse" />
              <span className="text-sm text-gray-300 font-mono">
                {user.wallet_address_hash ? shortenAddress(user.wallet_address_hash, 6) : user.email}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
