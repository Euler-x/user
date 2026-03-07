"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  TrendingUp,
  BarChart3,
  Settings,
  CreditCard,
  Check,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotificationStore,
  type NotificationType,
} from "@/stores/notificationStore";

const typeIcons: Record<NotificationType, React.ReactNode> = {
  trade: <TrendingUp className="h-3.5 w-3.5 text-neon" />,
  signal: <BarChart3 className="h-3.5 w-3.5 text-cyan-400" />,
  system: <Settings className="h-3.5 w-3.5 text-gray-400" />,
  billing: <CreditCard className="h-3.5 w-3.5 text-purple-400" />,
};

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markRead, markAllRead, clearAll } =
    useNotificationStore();

  // Close on outside click
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, handleClickOutside]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-[420px] rounded-xl bg-dark-200 border border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <h3 className="text-sm font-medium text-white">Notifications</h3>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="p-1 rounded text-gray-500 hover:text-neon hover:bg-white/5 transition-colors"
                    title="Mark all read"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-1 rounded text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-600">
                  <Bell className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-xs">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markRead(n.id);
                      if (n.href) window.location.href = n.href;
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 px-4 py-3 text-left",
                      "hover:bg-white/[0.03] transition-colors border-b border-white/[0.03]",
                      !n.read && "bg-neon/[0.02]"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">{typeIcons[n.type]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-gray-200 truncate">
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-neon shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-1">
                        {timeAgo(n.timestamp)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
