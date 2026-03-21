import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { Signal, SignalDetail, PaginatedResponse, Exchange } from "@/types";

function getEndpoints(exchange: Exchange) {
  return exchange === "bybit" ? ENDPOINTS.BYBIT_SIGNALS : ENDPOINTS.SIGNALS;
}

export default function useSignals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchSignals = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const exchange = (params?.exchange as Exchange) || "hyperliquid";
      const ep = getEndpoints(exchange);
      const { exchange: _ex, ...queryParams } = params || {};
      const { data } = await api.get<PaginatedResponse<Signal>>(ep.LIST, { params: queryParams });
      // Tag each signal with the exchange
      setSignals(data.items.map((s) => ({ ...s, exchange: s.exchange || exchange })));
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
      const exchange = (params?.exchange as Exchange) || "hyperliquid";
      const ep = getEndpoints(exchange);
      const { data } = await api.get<Signal[]>(ep.LIVE);
      return data.map((s) => ({ ...s, exchange: s.exchange || exchange }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const exchange = (params?.exchange as Exchange) || "hyperliquid";
      const ep = getEndpoints(exchange);
      const { exchange: _ex, ...queryParams } = params || {};
      const { data } = await api.get<PaginatedResponse<Signal>>(ep.HISTORY, { params: queryParams });
      setSignals(data.items.map((s) => ({ ...s, exchange: s.exchange || exchange })));
      setTotal(data.total);
      setTotalPages(data.total_pages);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSignal = useCallback(async (id: string, exchange: Exchange = "hyperliquid") => {
    const ep = getEndpoints(exchange);
    const { data } = await api.get<SignalDetail>(ep.GET(id));
    return data;
  }, []);

  return { signals, total, totalPages, loading, fetchSignals, fetchLive, fetchHistory, getSignal };
}
