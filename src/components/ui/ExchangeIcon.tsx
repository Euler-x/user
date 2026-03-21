"use client";

import Image from "next/image";

const EXCHANGE_LOGOS: Record<string, string> = {
  hyperliquid:
    "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120519/hyprliquid_orr9vl.webp",
  bybit:
    "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120520/bybit_obnhd8.webp",
};

export const EXCHANGE_LABELS: Record<string, string> = {
  hyperliquid: "HyperLiquid",
  bybit: "Bybit",
};

interface ExchangeIconProps {
  exchange: string;
  size?: number;
  className?: string;
}

export default function ExchangeIcon({
  exchange,
  size = 20,
  className = "",
}: ExchangeIconProps) {
  const src = EXCHANGE_LOGOS[exchange];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={EXCHANGE_LABELS[exchange] || exchange}
      width={size}
      height={size}
      className={`rounded-sm ${className}`}
      unoptimized
    />
  );
}
