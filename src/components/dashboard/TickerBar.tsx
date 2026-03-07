"use client";

import { cn } from "@/lib/utils";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
}

interface TickerBarProps {
  items: TickerItem[];
}

function formatPrice(price: number): string {
  if (price >= 1000) return price.toFixed(2);
  if (price >= 1) return price.toFixed(4);
  return price.toFixed(6);
}

function TickerContent({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={`${item.symbol}-${i}`} className="inline-flex items-center gap-1.5 shrink-0">
          <span className="text-gray-400 font-medium">{item.symbol}</span>
          <span className="text-gray-300">${formatPrice(item.price)}</span>
          <span
            className={cn(
              "text-[10px] font-mono",
              item.change >= 0 ? "text-neon" : "text-red-400"
            )}
          >
            {item.change >= 0 ? "+" : ""}
            {item.change.toFixed(2)}%
          </span>
          {i < items.length - 1 && (
            <span className="text-gray-800 mx-2">|</span>
          )}
        </span>
      ))}
    </>
  );
}

export default function TickerBar({ items }: TickerBarProps) {
  if (!items.length) return null;

  return (
    <div className="overflow-hidden bg-dark-300/80 border border-white/5 rounded-xl py-2 px-1 mb-6 group">
      <div className="flex animate-ticker group-hover:[animation-play-state:paused] whitespace-nowrap text-[11px] gap-0">
        {/* Duplicate content for seamless loop */}
        <div className="flex items-center gap-0 shrink-0 pr-8">
          <TickerContent items={items} />
        </div>
        <div className="flex items-center gap-0 shrink-0 pr-8" aria-hidden>
          <TickerContent items={items} />
        </div>
      </div>
    </div>
  );
}
