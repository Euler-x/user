"use client";

import { useEffect, useRef, useCallback } from "react";

export interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: "Navigation" | "Actions" | "General";
}

const SEQUENCE_TIMEOUT = 500;

function isInputFocused(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if ((el as HTMLElement).isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const bufferRef = useRef<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isInputFocused()) return;

      // Build key string
      const parts: string[] = [];
      if (e.ctrlKey || e.metaKey) parts.push("Ctrl");
      if (e.altKey) parts.push("Alt");
      if (e.shiftKey && e.key !== "?") parts.push("Shift");

      const key = e.key === " " ? "Space" : e.key;
      parts.push(key.length === 1 ? key.toLowerCase() : key);
      const keyStr = parts.join("+");

      // Check single-key shortcuts first
      for (const sc of shortcuts) {
        if (sc.key === keyStr || sc.key === e.key) {
          e.preventDefault();
          sc.action();
          bufferRef.current = [];
          return;
        }
      }

      // Sequence buffer (e.g., "g d")
      if (timerRef.current) clearTimeout(timerRef.current);
      bufferRef.current.push(key.toLowerCase());

      const sequence = bufferRef.current.join(" ");
      for (const sc of shortcuts) {
        if (sc.key === sequence) {
          e.preventDefault();
          sc.action();
          bufferRef.current = [];
          return;
        }
      }

      // Clear buffer after timeout
      timerRef.current = setTimeout(() => {
        bufferRef.current = [];
      }, SEQUENCE_TIMEOUT);
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
