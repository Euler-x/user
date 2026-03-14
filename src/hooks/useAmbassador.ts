import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import toast from "react-hot-toast";
import type {
  Ambassador,
  AmbassadorBonus,
  AmbassadorCommission,
  AmbassadorPayout,
  AmbassadorTerritory,
  EarningsSummary,
  LeaderboardEntry,
  PaginatedResponse,
  ReferralItem,
  ReferralResponse,
  TrainingModule,
} from "@/types";

export default function useAmbassador() {
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [team, setTeam] = useState<Ambassador[]>([]);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [commissions, setCommissions] = useState<AmbassadorCommission[]>([]);
  const [bonuses, setBonuses] = useState<AmbassadorBonus[]>([]);
  const [payouts, setPayouts] = useState<AmbassadorPayout[]>([]);
  const [earningsSummary, setEarningsSummary] = useState<EarningsSummary | null>(null);
  const [territory, setTerritory] = useState<AmbassadorTerritory | null>(null);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Ambassador | null>(ENDPOINTS.AMBASSADOR.DASHBOARD);
      setAmbassador(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLeaderboard = useCallback(async (limit = 20) => {
    const { data } = await api.get<LeaderboardEntry[]>(ENDPOINTS.AMBASSADOR.LEADERBOARD, { params: { limit } });
    setLeaderboard(data);
    return data;
  }, []);

  const generateReferral = useCallback(async () => {
    const { data } = await api.post<ReferralResponse>(ENDPOINTS.AMBASSADOR.REFERRAL);
    toast.success("Referral link generated!");
    return data;
  }, []);

  const fetchTeam = useCallback(async () => {
    const { data } = await api.get<Ambassador[]>(ENDPOINTS.AMBASSADOR.TEAM);
    setTeam(data);
    return data;
  }, []);

  const fetchReferrals = useCallback(async () => {
    const { data } = await api.get<ReferralItem[]>(ENDPOINTS.AMBASSADOR.REFERRALS);
    setReferrals(data);
    return data;
  }, []);

  const fetchCommissions = useCallback(async (params?: { page?: number; page_size?: number }) => {
    const { data } = await api.get<PaginatedResponse<AmbassadorCommission>>(
      ENDPOINTS.AMBASSADOR.COMMISSIONS,
      { params }
    );
    setCommissions(data.items);
    return data;
  }, []);

  const fetchBonuses = useCallback(async (params?: { page?: number; page_size?: number }) => {
    const { data } = await api.get<PaginatedResponse<AmbassadorBonus>>(
      ENDPOINTS.AMBASSADOR.BONUSES,
      { params }
    );
    setBonuses(data.items);
    return data;
  }, []);

  const fetchPayouts = useCallback(async (params?: { page?: number; page_size?: number }) => {
    const { data } = await api.get<PaginatedResponse<AmbassadorPayout>>(
      ENDPOINTS.AMBASSADOR.PAYOUTS,
      { params }
    );
    setPayouts(data.items);
    return data;
  }, []);

  const fetchEarningsSummary = useCallback(async () => {
    const { data } = await api.get<EarningsSummary>(ENDPOINTS.AMBASSADOR.EARNINGS_SUMMARY);
    setEarningsSummary(data);
    return data;
  }, []);

  const fetchTerritory = useCallback(async () => {
    const { data } = await api.get<AmbassadorTerritory | null>(ENDPOINTS.AMBASSADOR.TERRITORY);
    setTerritory(data);
    return data;
  }, []);

  const fetchTraining = useCallback(async () => {
    const { data } = await api.get<{ modules: TrainingModule[] }>(ENDPOINTS.AMBASSADOR.TRAINING);
    setTrainingModules(data.modules);
    return data.modules;
  }, []);

  const updatePayoutAddress = useCallback(async (address: string) => {
    await api.patch(ENDPOINTS.AMBASSADOR.PAYOUT_ADDRESS, { payout_address: address });
    setAmbassador((prev) => (prev ? { ...prev, payout_address: address } : prev));
    toast.success("Payout address updated!");
  }, []);

  return {
    ambassador,
    leaderboard,
    team,
    referrals,
    commissions,
    bonuses,
    payouts,
    earningsSummary,
    territory,
    trainingModules,
    loading,
    fetchDashboard,
    fetchLeaderboard,
    generateReferral,
    fetchTeam,
    fetchReferrals,
    fetchCommissions,
    fetchBonuses,
    fetchPayouts,
    fetchEarningsSummary,
    fetchTerritory,
    fetchTraining,
    updatePayoutAddress,
  };
}
