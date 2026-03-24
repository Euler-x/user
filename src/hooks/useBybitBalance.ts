import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { BybitBalance } from "@/types";

export default function useBybitBalance() {
  const [balance, setBalance] = useState<BybitBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get<BybitBalance>(ENDPOINTS.WALLET.BYBIT_BALANCE);
      setBalance(data);
      return data;
    } catch {
      setError(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { balance, loading, error, fetchBalance };
}
