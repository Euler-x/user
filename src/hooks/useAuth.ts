import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import { useAuthStore } from "@/stores/authStore";
import toast from "react-hot-toast";
import type { AuthResponse, SignMessageResponse, User } from "@/types";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const { setAuth, setUser, logout, user } = useAuthStore();

  const register = useCallback(
    async (email: string, password: string, referralCode?: string) => {
      setLoading(true);
      try {
        const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, {
          email,
          password,
          referral_code: referralCode || undefined,
        });
        setAuth(data.user, data.access_token, data.refresh_token);
        toast.success("Account created! Check your email for a verification code.");
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setAuth]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      try {
        const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, {
          email,
          password,
        });
        setAuth(data.user, data.access_token, data.refresh_token);
        toast.success("Welcome back!");
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setAuth]
  );

  const getSignMessage = useCallback(async (walletAddress: string): Promise<string | null> => {
    try {
      const { data } = await api.get<SignMessageResponse>(ENDPOINTS.AUTH.SIGN_MESSAGE, {
        params: { wallet_address: walletAddress },
      });
      return data.message;
    } catch {
      return null;
    }
  }, []);

  const connectWallet = useCallback(
    async (walletAddress: string, message: string, signature: string) => {
      setLoading(true);
      try {
        const { data } = await api.post<AuthResponse>(ENDPOINTS.AUTH.CONNECT, {
          wallet_address: walletAddress,
          message,
          signature,
        });
        setAuth(data.user, data.access_token, data.refresh_token);
        toast.success("Wallet connected!");
        return data;
      } finally {
        setLoading(false);
      }
    },
    [setAuth]
  );

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get<User>(ENDPOINTS.AUTH.ME);
      setUser(data);
      return data;
    } catch {
      return null;
    }
  }, [setUser]);

  const submitEmail = useCallback(async (email: string) => {
    setLoading(true);
    try {
      const { data } = await api.post(ENDPOINTS.AUTH.EMAIL_SUBMIT, { email });
      toast.success(data.message);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (code: string) => {
    setLoading(true);
    try {
      const { data } = await api.post(ENDPOINTS.AUTH.EMAIL_VERIFY, { code });
      toast.success(data.message);
      await fetchMe();
      return data;
    } finally {
      setLoading(false);
    }
  }, [fetchMe]);

  return { loading, user, register, login, connectWallet, getSignMessage, fetchMe, submitEmail, verifyEmail, logout };
}
