import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { ProofOfReserves, LivePosition, WalletInfo } from "@/types";

export default function useTransparency() {
  const [reserves, setReserves] = useState<ProofOfReserves | null>(null);
  const [positions, setPositions] = useState<LivePosition[]>([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReserves = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<ProofOfReserves>(ENDPOINTS.TRANSPARENCY.PROOF_OF_RESERVES);
      setReserves(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPositions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<LivePosition[]>(ENDPOINTS.TRANSPARENCY.POSITIONS);
      setPositions(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWalletInfo = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<WalletInfo>(ENDPOINTS.TRANSPARENCY.WALLET_INFO);
      setWalletInfo(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reserves,
    positions,
    walletInfo,
    loading,
    fetchReserves,
    fetchPositions,
    fetchWalletInfo,
  };
}
