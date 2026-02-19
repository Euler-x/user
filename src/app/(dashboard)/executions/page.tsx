"use client";

import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import Pagination from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import useExecutions from "@/hooks/useExecutions";
import usePagination from "@/hooks/usePagination";
import { formatCurrency, formatDateTime, formatPnl } from "@/lib/utils";
import type { Execution } from "@/types";

const columns = [
  {
    key: "direction",
    header: "Direction",
    render: (e: Execution) => (
      <span className={e.direction === "buy" ? "text-neon font-medium" : "text-red-400 font-medium"}>
        {e.direction.toUpperCase()}
      </span>
    ),
  },
  {
    key: "order_type",
    header: "Type",
    render: (e: Execution) => <span className="uppercase text-gray-400">{e.order_type}</span>,
  },
  {
    key: "entry_price",
    header: "Entry",
    render: (e: Execution) => formatCurrency(e.entry_price),
  },
  {
    key: "exit_price",
    header: "Exit",
    render: (e: Execution) => e.exit_price ? formatCurrency(e.exit_price) : "—",
  },
  {
    key: "quantity",
    header: "Qty",
    render: (e: Execution) => e.quantity.toFixed(4),
  },
  {
    key: "leverage",
    header: "Lev",
    render: (e: Execution) => `${e.leverage}x`,
  },
  {
    key: "pnl",
    header: "PnL",
    render: (e: Execution) => {
      const { text, color } = formatPnl(e.pnl);
      return <span className={`font-medium ${color}`}>{text}</span>;
    },
  },
  {
    key: "status",
    header: "Status",
    render: (e: Execution) => <StatusBadge status={e.status} />,
  },
  {
    key: "created_at",
    header: "Date",
    render: (e: Execution) => <span className="text-gray-500 text-xs">{formatDateTime(e.created_at)}</span>,
  },
];

export default function ExecutionsPage() {
  const { executions, totalPages, loading, fetchExecutions } = useExecutions();
  const { page, pageSize, setPage } = usePagination();

  useEffect(() => {
    fetchExecutions({ page, page_size: pageSize });
  }, [page, pageSize, fetchExecutions]);

  if (loading && executions.length === 0) return <PageSpinner />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Executions</h1>
          <p className="text-sm text-gray-400 mt-1">Your trade execution history</p>
        </div>

        <Table
          columns={columns}
          data={executions}
          emptyMessage="No executions yet"
        />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </PageTransition>
  );
}
