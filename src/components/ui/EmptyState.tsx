"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-4">
        <Icon className="h-8 w-8 text-gray-700" />
      </div>
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      <p className="text-xs text-gray-600 max-w-xs mb-5">{description}</p>
      {actionLabel &&
        (actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neon/10 text-neon text-xs font-medium border border-neon/20 hover:bg-neon/20 transition-colors"
          >
            {actionLabel}
          </Link>
        ) : onAction ? (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neon/10 text-neon text-xs font-medium border border-neon/20 hover:bg-neon/20 transition-colors"
          >
            {actionLabel}
          </button>
        ) : null)}
    </motion.div>
  );
}
