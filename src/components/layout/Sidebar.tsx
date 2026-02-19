"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Brain,
  Zap,
  Activity,
  ArrowLeftRight,
  CreditCard,
  Users,
  LifeBuoy,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Strategies", href: "/strategies", icon: Brain },
  { label: "Signals", href: "/signals", icon: Zap },
  { label: "Executions", href: "/executions", icon: Activity },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Ambassador", href: "/ambassador", icon: Users },
  { label: "Support", href: "/support", icon: LifeBuoy },
  { label: "Learn", href: "/learn", icon: GraduationCap },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);

  return (
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

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
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
  );
}
