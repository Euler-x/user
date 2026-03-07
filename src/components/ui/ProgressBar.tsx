"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "bg-neon",
  height = 3,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn("w-full rounded-full bg-white/5 overflow-hidden", className)}
      style={{ height }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  );
}
