import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import toast from "react-hot-toast";
import type { SupportTicket, TicketDetail, PaginatedResponse } from "@/types";

export default function useSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTickets = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedResponse<SupportTicket>>(ENDPOINTS.SUPPORT.TICKETS, { params });
      setTickets(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTicket = useCallback(async (id: string) => {
    const { data } = await api.get<TicketDetail>(ENDPOINTS.SUPPORT.GET_TICKET(id));
    return data;
  }, []);

  const createTicket = useCallback(async (payload: { subject: string; description: string; priority?: string }) => {
    const { data } = await api.post<SupportTicket>(ENDPOINTS.SUPPORT.TICKETS, payload);
    toast.success("Ticket created!");
    return data;
  }, []);

  const addMessage = useCallback(async (ticketId: string, message: string) => {
    const { data } = await api.post(ENDPOINTS.SUPPORT.ADD_MESSAGE(ticketId), { message });
    return data;
  }, []);

  return { tickets, total, totalPages, loading, fetchTickets, getTicket, createTicket, addMessage };
}
