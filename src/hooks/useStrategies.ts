import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import toast from "react-hot-toast";
import type { Strategy, StrategyCreate, StrategyUpdate } from "@/types";

export default function useStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStrategies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Strategy[]>(ENDPOINTS.STRATEGIES.LIST);
      setStrategies(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStrategy = useCallback(async (id: string) => {
    const { data } = await api.get<Strategy>(ENDPOINTS.STRATEGIES.GET(id));
    return data;
  }, []);

  const createStrategy = useCallback(async (payload: StrategyCreate) => {
    const { data } = await api.post<Strategy>(ENDPOINTS.STRATEGIES.CREATE, payload);
    toast.success("Strategy created!");
    setStrategies((prev) => [data, ...prev]);
    return data;
  }, []);

  const updateStrategy = useCallback(async (id: string, payload: StrategyUpdate) => {
    const { data } = await api.put<Strategy>(ENDPOINTS.STRATEGIES.UPDATE(id), payload);
    toast.success("Strategy updated!");
    setStrategies((prev) => prev.map((s) => (s.id === id ? data : s)));
    return data;
  }, []);

  const deleteStrategy = useCallback(async (id: string) => {
    await api.delete(ENDPOINTS.STRATEGIES.DELETE(id));
    toast.success("Strategy deleted!");
    setStrategies((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const activateStrategy = useCallback(async (id: string) => {
    const { data } = await api.post<Strategy>(ENDPOINTS.STRATEGIES.ACTIVATE(id));
    toast.success("Strategy activated!");
    setStrategies((prev) => prev.map((s) => (s.id === id ? data : s)));
    return data;
  }, []);

  const pauseStrategy = useCallback(async (id: string) => {
    const { data } = await api.post<Strategy>(ENDPOINTS.STRATEGIES.PAUSE(id));
    toast.success("Strategy paused!");
    setStrategies((prev) => prev.map((s) => (s.id === id ? data : s)));
    return data;
  }, []);

  return {
    strategies, loading, fetchStrategies, getStrategy,
    createStrategy, updateStrategy, deleteStrategy, activateStrategy, pauseStrategy,
  };
}
