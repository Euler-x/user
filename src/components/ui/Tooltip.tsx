"use client";

import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: Placement;
  delay?: number;
  className?: string;
  maxWidth?: number;
}

const placementClasses: Record<Placement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowClasses: Record<Placement, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-dark-200 border-x-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-dark-200 border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-dark-200 border-y-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-dark-200 border-y-transparent border-l-transparent",
};

export default function Tooltip({
  children,
  content,
  placement = "top",
  delay = 300,
  className,
  maxWidth = 240,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 px-3 py-2 text-xs text-gray-300 rounded-lg",
              "bg-dark-200 border border-neon/20 shadow-neon-sm",
              "pointer-events-none whitespace-normal",
              placementClasses[placement],
              className
            )}
            style={{ maxWidth }}
          >
            {content}
            <span
              className={cn(
                "absolute w-0 h-0 border-[4px]",
                arrowClasses[placement]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
