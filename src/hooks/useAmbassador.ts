import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import toast from "react-hot-toast";
import type { Ambassador, LeaderboardEntry, ReferralResponse } from "@/types";

export default function useAmbassador() {
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [team, setTeam] = useState<Ambassador[]>([]);
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

  return { ambassador, leaderboard, team, loading, fetchDashboard, fetchLeaderboard, generateReferral, fetchTeam };
}
