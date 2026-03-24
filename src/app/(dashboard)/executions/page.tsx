"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import Tooltip from "@/components/ui/Tooltip";
import EmptyState from "@/components/ui/EmptyState";
import ExchangeSwitcher from "@/components/ui/ExchangeSwitcher";
import useExecutions from "@/hooks/useExecutions";
import usePagination from "@/hooks/usePagination";
import { formatCurrency, formatDateTime, formatPnl } from "@/lib/utils";
import type { Execution, Exchange } from "@/types";

const EXPLORER_TX_URL: Record<string, string> = {
  hyperliquid: "https://app.hyperliquid.xyz/explorer/tx/",
  bybit: "https://www.bybit.com/trade/usdt/",
};

const HL_LOGO = "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120519/hyprliquid_orr9vl.webp";
const BB_LOGO = "https://res.cloudinary.com/dpwddkw5t/image/upload/v1774120520/bybit_obnhd8.webp";

function getExchange(e: Execution): string {
  return (e as Record<string, unknown>).exchange as string || "hyperliquid";
}

const columns = [
  {
    key: "exchange",
    header: "Exchange",
    render: (e: Execution) => {
      const ex = getExchange(e);
      return (
        <div className="flex items-center gap-1.5">
          <img src={ex === "bybit" ? BB_LOGO : HL_LOGO} alt={ex} className="h-3.5 w-3.5 rounded-sm" />
          <span className="text-[10px] font-medium text-gray-400 uppercase">{ex === "bybit" ? "Bybit" : "HL"}</span>
        </div>
      );
    },
  },
  {
    key: "direction",
    header: "Direction",
    headerTooltip: "Buy (long) or Sell (short) trade direction",
    render: (e: Execution) => (
      <span className={e.direction === "buy" ? "text-neon font-medium" : "text-red-400 font-medium"}>
        {e.direction.toUpperCase()}
      </span>
    ),
  },
  {
    key: "order_type",
    header: "Type",
    headerTooltip: "Order type: market or limit",
    render: (e: Execution) => <span className="uppercase text-gray-400">{e.order_type}</span>,
  },
  {
    key: "entry_price",
    header: "Entry",
    headerTooltip: "Price at which the position was opened",
    render: (e: Execution) => formatCurrency(e.entry_price),
  },
  {
    key: "exit_price",
    header: "Exit",
    headerTooltip: "Price at which the position was closed",
    render: (e: Execution) => e.exit_price ? formatCurrency(e.exit_price) : "\u2014",
  },
  {
    key: "quantity",
    header: "Qty",
    headerTooltip: "Number of units traded",
    render: (e: Execution) => e.quantity.toFixed(4),
  },
  {
    key: "leverage",
    header: "Lev",
    headerTooltip: "Leverage multiplier used for this trade",
    render: (e: Execution) => `${e.leverage}x`,
  },
  {
    key: "pnl",
    header: "PnL",
    headerTooltip: "Profit or loss from this trade in USD",
    render: (e: Execution) => {
      const { text, color } = formatPnl(e.pnl);
      return <span className={`font-medium ${color}`}>{text}</span>;
    },
  },
  {
    key: "status",
    header: "Result",
    headerTooltip: "Execution result",
    render: (e: Execution) => {
      if (e.status === "failed") {
        return (
          <Tooltip content={e.error_message || "Unknown error"}>
            <span className="inline-flex items-center gap-1.5 text-red-400 text-xs font-medium cursor-help">
              <AlertCircle className="h-3.5 w-3.5" />
              Failed
            </span>
          </Tooltip>
        );
      }
      if (e.status === "filled") {
        return (
          <span className="inline-flex items-center gap-1.5 text-neon text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Filled
          </span>
        );
      }
      return <StatusBadge status={e.status} />;
    },
  },
  {
    key: "created_at",
    header: "Date",
    render: (e: Execution) => <span className="text-gray-500 text-xs">{formatDateTime(e.created_at)}</span>,
  },
  {
    key: "explorer",
    header: "",
    render: (e: Execution) => {
      const ex = getExchange(e);
      return e.tx_hash ? (
        <a
          href={`${EXPLORER_TX_URL[ex] || EXPLORER_TX_URL.hyperliquid}${e.tx_hash}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(ev) => ev.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs text-neon/70 hover:text-neon transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Explorer</span>
        </a>
      ) : (
        <span className="text-gray-700 text-xs">\u2014</span>
      );
    },
  },
];

export default function ExecutionsPage() {
  const { executions, totalPages, loading, fetchExecutions } = useExecutions();
  const { page, pageSize, setPage } = usePagination();
  const [exchangeFilter, setExchangeFilter] = useState<Exchange | "all">("all");

  useEffect(() => {
    fetchExecutions({ page, page_size: pageSize });
  }, [page, pageSize, fetchExecutions]);

  if (loading && executions.length === 0) return <PageSpinner />;

  const filtered = exchangeFilter === "all"
    ? executions
    : executions.filter((e) => getExchange(e) === exchangeFilter);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Executions</h1>
            <p className="text-sm text-gray-400 mt-1">Your trade execution history</p>
          </div>
          <ExchangeSwitcher active={exchangeFilter} onChange={setExchangeFilter} />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No Executions Yet"
            description={exchangeFilter === "all"
              ? "Once your strategies generate trades, they'll appear here with full details."
              : `No executions on ${exchangeFilter === "bybit" ? "Bybit" : "HyperLiquid"} yet.`
            }
            actionLabel="View Strategies"
            actionHref="/strategies"
          />
        ) : (
          <Table
            columns={columns}
            data={filtered}
            emptyMessage="No executions yet"
          />
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </PageTransition>
  );
}
