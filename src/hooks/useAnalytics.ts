import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { AnalyticsOverview, StrategyAnalytics, EquityCurvePoint } from "@/types";

export default function useAnalytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [strategyAnalytics, setStrategyAnalytics] = useState<StrategyAnalytics | null>(null);
  const [equityCurve, setEquityCurve] = useState<EquityCurvePoint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOverview = useCallback(async (days: number = 30) => {
    setLoading(true);
    try {
      const { data } = await api.get<AnalyticsOverview>(ENDPOINTS.ANALYTICS.OVERVIEW, {
        params: { days },
      });
      setOverview(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStrategyAnalytics = useCallback(async (id: string, days: number = 30) => {
    setLoading(true);
    try {
      const { data } = await api.get<StrategyAnalytics>(ENDPOINTS.ANALYTICS.STRATEGY(id), {
        params: { days },
      });
      setStrategyAnalytics(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEquityCurve = useCallback(
    async (params?: { days?: number; strategy_id?: string }) => {
      setLoading(true);
      try {
        const { data } = await api.get<EquityCurvePoint[]>(ENDPOINTS.ANALYTICS.EQUITY_CURVE, {
          params,
        });
        setEquityCurve(data);
        return data;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    overview,
    strategyAnalytics,
    equityCurve,
    loading,
    fetchOverview,
    fetchStrategyAnalytics,
    fetchEquityCurve,
  };
}
