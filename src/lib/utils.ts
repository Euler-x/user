import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number, currency = "USD"): string {
  const abs = Math.abs(amount);
  // For small prices (< $1), preserve precision — show enough decimals
  // so at least 4 significant digits are visible (up to 8 max)
  let maxDecimals = 2;
  if (abs > 0 && abs < 1) {
    const leadingZeros = Math.max(0, -Math.floor(Math.log10(abs)) - 1);
    maxDecimals = Math.max(6, Math.min(leadingZeros + 4, 8));
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatPnl(pnl: number | null | undefined): {
  text: string;
  color: string;
} {
  if (pnl == null) return { text: "—", color: "text-gray-400" };
  const prefix = pnl >= 0 ? "+" : "";
  return {
    text: `${prefix}${formatCurrency(pnl)}`,
    color: pnl >= 0 ? "text-neon" : "text-red-400",
  };
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
