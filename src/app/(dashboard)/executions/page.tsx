"use client";

import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Activity, AlertCircle, CheckCircle2, X, Loader2, TriangleAlert } from "lucide-react";
import toast from "react-hot-toast";
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
  return e.exchange || "hyperliquid";
}

// ── Confirmation Dialog ────────────────────────────────────────────────────

interface CloseConfirmDialogProps {
  execution: Execution | null;
  onConfirm: () => void;
  onCancel: () => void;
  closing: boolean;
}

function CloseConfirmDialog({ execution, onConfirm, onCancel, closing }: CloseConfirmDialogProps) {
  if (!execution) return null;
  const ex = getExchange(execution);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />

      <div className="relative z-10 w-full max-w-sm bg-dark-200 border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <TriangleAlert className="h-4.5 w-4.5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Close Position</p>
              <p className="text-[11px] text-gray-500">This action cannot be undone</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Trade summary */}
        <div className="bg-dark-300/60 rounded-xl border border-white/5 p-3.5 mb-5 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Exchange</span>
            <span className="text-gray-200 font-medium uppercase">{ex === "bybit" ? "Bybit" : "HyperLiquid"}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Direction</span>
            <span className={execution.direction === "buy" ? "text-neon font-medium" : "text-red-400 font-medium"}>
              {execution.direction.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Entry Price</span>
            <span className="text-gray-200">{formatCurrency(execution.entry_price)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Quantity</span>
            <span className="text-gray-200">{execution.quantity.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Leverage</span>
            <span className="text-gray-200">{execution.leverage}x</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-5 leading-relaxed">
          A market order will be placed to close this position at the current market price.
          If the position was already closed on the exchange, the record will be synced instead.
        </p>

        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            disabled={closing}
            className="flex-1 py-2.5 text-sm text-gray-400 border border-white/10 rounded-xl hover:border-white/20 hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={closing}
            className="flex-1 py-2.5 text-sm font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {closing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Closing…
              </>
            ) : (
              "Close Position"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function ExecutionsPage() {
  const { executions, totalPages, loading, fetchExecutions, closeExecution } = useExecutions();
  const { page, pageSize, setPage } = usePagination();
  const [exchangeFilter, setExchangeFilter] = useState<Exchange | "all">("all");
  const [confirmTarget, setConfirmTarget] = useState<Execution | null>(null);
  const [closing, setClosing] = useState(false);

  const loadExecutions = useCallback(() => {
    const params: Record<string, unknown> = { page, page_size: pageSize };
    if (exchangeFilter !== "all") params.exchange = exchangeFilter;
    fetchExecutions(params);
  }, [page, pageSize, exchangeFilter, fetchExecutions]);

  useEffect(() => {
    loadExecutions();
  }, [loadExecutions]);

  const handleCloseConfirm = async () => {
    if (!confirmTarget) return;
    setClosing(true);
    try {
      const res = await closeExecution(confirmTarget.id);
      toast.success(res.message);
      setConfirmTarget(null);
    } catch {
      toast.error("Failed to close position. Please try again.");
    } finally {
      setClosing(false);
    }
  };

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
      render: (e: Execution) => e.exit_price ? formatCurrency(e.exit_price) : "—",
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
          <span className="text-gray-700 text-xs">—</span>
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (e: Execution) => {
        if (e.status !== "filled") return null;
        return (
          <button
            onClick={(ev) => { ev.stopPropagation(); setConfirmTarget(e); }}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-lg px-2 py-1 transition-colors"
          >
            <X className="h-3 w-3" />
            Close
          </button>
        );
      },
    },
  ];

  if (loading && executions.length === 0) return <PageSpinner />;

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

        {executions.length === 0 ? (
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
            data={executions}
            emptyMessage="No executions yet"
          />
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <CloseConfirmDialog
        execution={confirmTarget}
        onConfirm={handleCloseConfirm}
        onCancel={() => setConfirmTarget(null)}
        closing={closing}
      />
    </PageTransition>
  );
}
