"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatusBadge from "@/components/ui/StatusBadge";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import useSupport from "@/hooks/useSupport";
import { formatDateTime, capitalize } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import type { TicketDetail } from "@/types";

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getTicket, addMessage } = useSupport();
  const user = useAuthStore((s) => s.user);
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadTicket = async () => {
    try {
      const data = await getTicket(id);
      setTicket(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTicket(); }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      await addMessage(id, message);
      setMessage("");
      await loadTicket();
    } finally {
      setSending(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!ticket) return <div className="text-center text-gray-500 py-20">Ticket not found</div>;

  const isClosed = ticket.status === "closed";

  return (
    <PageTransition>
      <div className="space-y-6 max-w-3xl">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Support
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{ticket.subject}</h1>
            <p className="text-sm text-gray-400 mt-1">{formatDateTime(ticket.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{capitalize(ticket.priority)}</Badge>
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <Card>
          <p className="text-sm text-gray-300 leading-relaxed">{ticket.description}</p>
        </Card>

        {/* Messages */}
        <div className="space-y-3">
          {ticket.messages.map((msg) => {
            const isMe = msg.user_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isMe ? "bg-neon/10 border border-neon/20" : "bg-dark-200 border border-white/5"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-400">{msg.is_admin ? "Support" : "You"}</span>
                    <span className="text-xs text-gray-600">{formatDateTime(msg.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-200">{msg.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply */}
        {!isClosed && (
          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-dark-200 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon/50"
            />
            <Button onClick={handleSend} loading={sending} disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
