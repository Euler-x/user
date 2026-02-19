"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, MessageCircle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import useSupport from "@/hooks/useSupport";
import usePagination from "@/hooks/usePagination";
import { formatDateTime, capitalize } from "@/lib/utils";

export default function SupportPage() {
  const router = useRouter();
  const { tickets, totalPages, loading, fetchTickets, createTicket } = useSupport();
  const { page, pageSize, setPage } = usePagination();
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ subject: "", description: "", priority: "medium" });

  useEffect(() => {
    fetchTickets({ page, page_size: pageSize });
  }, [page, pageSize, fetchTickets]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const ticket = await createTicket(form);
      setShowCreate(false);
      setForm({ subject: "", description: "", priority: "medium" });
      router.push(`/support/${ticket.id}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading && tickets.length === 0) return <PageSpinner />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Support</h1>
            <p className="text-sm text-gray-400 mt-1">Get help from our team</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="h-4 w-4" /> New Ticket
          </Button>
        </div>

        {tickets.length === 0 ? (
          <Card className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No support tickets yet</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Card
                key={ticket.id}
                hover
                onClick={() => router.push(`/support/${ticket.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{ticket.subject}</h3>
                    <p className="text-xs text-gray-500 mt-1">{formatDateTime(ticket.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge>{capitalize(ticket.priority)}</Badge>
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Support Ticket">
          <div className="space-y-4">
            <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Brief description of your issue" />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Provide details about your issue..."
                rows={4}
                className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate} loading={creating} disabled={!form.subject || !form.description}>Submit Ticket</Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}
