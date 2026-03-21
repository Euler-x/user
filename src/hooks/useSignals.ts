import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { Signal, SignalDetail, PaginatedResponse } from "@/types";

export default function useSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchSignals = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedResponse<Signal>>(ENDPOINTS.SIGNALS.LIST, { params });
      setSignals(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLive = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { data } = await api.get<Signal[]>(ENDPOINTS.SIGNALS.LIVE, { params });
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedResponse<Signal>>(ENDPOINTS.SIGNALS.HISTORY, { params });
      setSignals(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSignal = useCallback(async (id: string) => {
    const { data } = await api.get<SignalDetail>(ENDPOINTS.SIGNALS.GET(id));
    return data;
  }, []);

  return { signals, total, totalPages, loading, fetchSignals, fetchLive, fetchHistory, getSignal };
}
