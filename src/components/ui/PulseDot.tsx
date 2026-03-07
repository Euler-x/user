"use client";

import { cn } from "@/lib/utils";

type DotStatus = "live" | "paused" | "error" | "idle";

interface PulseDotProps {
  status: DotStatus;
  size?: "sm" | "md";
  className?: string;
}

const statusStyles: Record<DotStatus, string> = {
  live: "bg-neon shadow-[0_0_6px_theme(colors.neon)] animate-glow-pulse",
  paused: "bg-amber-400 animate-pulse-slow",
  error: "bg-red-400 animate-pulse",
  idle: "bg-gray-600",
};

const sizeStyles: Record<"sm" | "md", string> = {
  sm: "h-1.5 w-1.5",
  md: "h-2.5 w-2.5",
};

export default function PulseDot({ status, size = "sm", className }: PulseDotProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full shrink-0",
        statusStyles[status],
        sizeStyles[size],
        className
      )}
    />
  );
}
