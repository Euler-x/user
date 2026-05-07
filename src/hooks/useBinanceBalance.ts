import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { BinanceBalance } from "@/types";

export default function useBinanceBalance() {
  const [balance, setBalance] = useState<BinanceBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get<BinanceBalance>(ENDPOINTS.WALLET.BINANCE_BALANCE);
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
