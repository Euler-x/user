"use client";

import { useEffect } from "react";
import PageTransition from "@/components/PageTransition";
import Table from "@/components/ui/Table";
import StatusBadge from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import useTransactions from "@/hooks/useTransactions";
import usePagination from "@/hooks/usePagination";
import { formatCurrency, formatDateTime, capitalize } from "@/lib/utils";
import type { Transaction } from "@/types";

const columns = [
  {
    key: "category",
    header: "Category",
    render: (t: Transaction) => <Badge>{capitalize(t.category)}</Badge>,
  },
  {
    key: "amount",
    header: "Amount",
    render: (t: Transaction) => (
      <span className="font-medium text-white">
        {formatCurrency(t.amount)} <span className="text-gray-500 text-xs">{t.asset}</span>
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (t: Transaction) => <StatusBadge status={t.status} />,
  },
  {
    key: "description",
    header: "Description",
    render: (t: Transaction) => <span className="text-gray-400 text-sm">{t.description || "—"}</span>,
  },
  {
    key: "tx_hash",
    header: "Tx Hash",
    render: (t: Transaction) =>
      t.tx_hash ? (
        <span className="font-mono text-xs text-neon">{t.tx_hash.slice(0, 10)}...</span>
      ) : (
        <span className="text-gray-600">—</span>
      ),
  },
  {
    key: "created_at",
    header: "Date",
    render: (t: Transaction) => <span className="text-gray-500 text-xs">{formatDateTime(t.created_at)}</span>,
  },
];

export default function TransactionsPage() {
  const { transactions, totalPages, loading, fetchTransactions } = useTransactions();
  const { page, pageSize, setPage } = usePagination();

  useEffect(() => {
    fetchTransactions({ page, page_size: pageSize });
  }, [page, pageSize, fetchTransactions]);

  if (loading && transactions.length === 0) return <PageSpinner />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-gray-400 mt-1">All your financial transactions</p>
        </div>

        <Table
          columns={columns}
          data={transactions}
          emptyMessage="No transactions yet"
        />

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </PageTransition>
  );
}
