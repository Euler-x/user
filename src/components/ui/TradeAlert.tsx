"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notificationStore";

interface TradeAlertData {
  id: string;
  direction: "buy" | "sell";
  symbol: string;
  entryPrice: string;
  message: string;
}

export default function TradeAlertContainer() {
  const [alerts, setAlerts] = useState<TradeAlertData[]>([]);
  const notifications = useNotificationStore((s) => s.notifications);

  // Watch for new trade notifications
  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[0];
    if (latest.type !== "trade" || latest.read) return;

    // Only show if less than 10 seconds old
    if (Date.now() - latest.timestamp > 10_000) return;

    const isBuy = latest.title.toLowerCase().includes("buy");
    const alert: TradeAlertData = {
      id: latest.id,
      direction: isBuy ? "buy" : "sell",
      symbol: latest.title.split(" ").pop() || "",
      entryPrice: "",
      message: latest.message,
    };

    setAlerts((prev) => {
      if (prev.some((a) => a.id === alert.id)) return prev;
      return [alert, ...prev].slice(0, 3);
    });

    // Auto-dismiss after 5s
    const timer = setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications]);

  const dismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "pointer-events-auto w-80 rounded-xl border p-3",
              "bg-dark-200/95 backdrop-blur-md shadow-2xl",
              alert.direction === "buy"
                ? "border-neon/30 shadow-neon-sm"
                : "border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
            )}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={cn(
                  "p-1.5 rounded-lg shrink-0",
                  alert.direction === "buy" ? "bg-neon/10" : "bg-red-500/10"
                )}
              >
                {alert.direction === "buy" ? (
                  <ArrowUpRight className="h-4 w-4 text-neon" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white">
                    {alert.direction === "buy" ? "Buy" : "Sell"} {alert.symbol}
                  </p>
                  <button
                    onClick={() => dismiss(alert.id)}
                    className="p-0.5 rounded text-gray-600 hover:text-gray-300 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                  {alert.message}
                </p>
              </div>
            </div>
            {/* Progress bar for auto-dismiss */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: "linear" }}
              className={cn(
                "h-0.5 mt-2 rounded-full origin-left",
                alert.direction === "buy" ? "bg-neon/40" : "bg-red-500/40"
              )}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
