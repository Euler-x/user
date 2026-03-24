"use client";

import type { Exchange } from "@/types";

const HL_LOGO = "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120519/hyprliquid_orr9vl.webp";
const BB_LOGO = "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120520/bybit_obnhd8.webp";

interface ExchangeSwitcherProps {
  active: Exchange | "all";
  onChange: (exchange: Exchange | "all") => void;
  showAll?: boolean;
  size?: "sm" | "md";
}

const OPTIONS: { key: Exchange | "all"; label: string; logo?: string }[] = [
  { key: "all", label: "All" },
  { key: "hyperliquid", label: "HyperLiquid", logo: HL_LOGO },
  { key: "bybit", label: "Bybit", logo: BB_LOGO },
];

export default function ExchangeSwitcher({
  active,
  onChange,
  showAll = true,
  size = "md",
}: ExchangeSwitcherProps) {
  const items = showAll ? OPTIONS : OPTIONS.filter((o) => o.key !== "all");
  const isSmall = size === "sm";

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-white/[0.06] bg-dark-300/50 p-1">
      {items.map((opt) => {
        const isActive = active === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`flex items-center gap-1.5 rounded-md px-3 transition-all duration-200 ${
              isSmall ? "py-1 text-[10px]" : "py-1.5 text-[11px]"
            } font-medium tracking-wide ${
              isActive
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {opt.logo && (
              <img
                src={opt.logo}
                alt={opt.label}
                className={`rounded-sm ${isSmall ? "h-3 w-3" : "h-3.5 w-3.5"}`}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
