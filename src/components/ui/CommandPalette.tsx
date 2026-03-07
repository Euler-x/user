"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  BarChart3,
  Activity,
  TrendingUp,
  FileText,
  CreditCard,
  Users,
  BookOpen,
  HelpCircle,
  Settings,
  Shield,
  Plus,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  action?: () => void;
  category: string;
  keywords: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMANDS: CommandItem[] = [
  // Navigation
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", category: "Navigation", keywords: ["home", "main"] },
  { id: "strategies", label: "Strategies", icon: BarChart3, href: "/strategies", category: "Navigation", keywords: ["strategy", "trading"] },
  { id: "signals", label: "Signals", icon: Zap, href: "/signals", category: "Navigation", keywords: ["signal", "alert"] },
  { id: "executions", label: "Executions", icon: TrendingUp, href: "/executions", category: "Navigation", keywords: ["trade", "order", "execution"] },
  { id: "transactions", label: "Transactions", icon: FileText, href: "/transactions", category: "Navigation", keywords: ["transaction", "history"] },
  { id: "analytics", label: "Analytics", icon: Activity, href: "/analytics", category: "Navigation", keywords: ["performance", "stats", "metrics"] },
  { id: "billing", label: "Billing", icon: CreditCard, href: "/billing", category: "Navigation", keywords: ["plan", "subscribe", "payment"] },
  { id: "ambassador", label: "Ambassador", icon: Users, href: "/ambassador", category: "Navigation", keywords: ["referral", "invite"] },
  { id: "transparency", label: "Transparency", icon: Shield, href: "/transparency", category: "Navigation", keywords: ["proof", "reserve"] },
  { id: "learn", label: "Learning Hub", icon: BookOpen, href: "/learn", category: "Navigation", keywords: ["learn", "education", "guide"] },
  { id: "support", label: "Support", icon: HelpCircle, href: "/support", category: "Navigation", keywords: ["help", "ticket"] },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings", category: "Navigation", keywords: ["config", "wallet", "email", "telegram"] },
  // Actions
  { id: "new-strategy", label: "Create Strategy", icon: Plus, href: "/strategies", category: "Actions", keywords: ["new", "create", "add"] },
  { id: "view-analytics", label: "View Performance", icon: Activity, href: "/analytics", category: "Actions", keywords: ["performance", "pnl"] },
];

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const cmd of filtered) {
      const group = map.get(cmd.category) || [];
      group.push(cmd);
      map.set(cmd.category, group);
    }
    return map;
  }, [filtered]);

  const flatList = useMemo(() => filtered, [filtered]);

  const executeCommand = useCallback(
    (cmd: CommandItem) => {
      onClose();
      setQuery("");
      if (cmd.href) router.push(cmd.href);
      else if (cmd.action) cmd.action();
    },
    [onClose, router]
  );

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (flatList[selectedIndex]) executeCommand(flatList[selectedIndex]);
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, flatList, selectedIndex, executeCommand, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl rounded-2xl bg-dark-200 border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search className="h-4 w-4 text-gray-500 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 outline-none"
                />
                <kbd className="px-1.5 py-0.5 rounded bg-dark-300 border border-white/10 text-[10px] font-mono text-gray-500">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-72 overflow-y-auto py-2"
              >
                {flatList.length === 0 ? (
                  <p className="text-center text-xs text-gray-600 py-8">
                    No commands found
                  </p>
                ) : (
                  Array.from(grouped.entries()).map(([category, items]) => (
                    <div key={category}>
                      <p className="px-4 py-1.5 text-[10px] font-medium text-gray-600 uppercase tracking-wider">
                        {category}
                      </p>
                      {items.map((cmd) => {
                        const globalIndex = flatList.indexOf(cmd);
                        return (
                          <button
                            key={cmd.id}
                            data-index={globalIndex}
                            onClick={() => executeCommand(cmd)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                              globalIndex === selectedIndex
                                ? "bg-neon/[0.06] text-white"
                                : "text-gray-400 hover:bg-white/[0.02]"
                            )}
                          >
                            <cmd.icon className="h-4 w-4 shrink-0" />
                            <span className="text-sm">{cmd.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/5">
                <div className="flex items-center gap-3 text-[10px] text-gray-600">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-dark-300 border border-white/10 font-mono">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-dark-300 border border-white/10 font-mono">↵</kbd>
                    Select
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
