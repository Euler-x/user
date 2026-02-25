import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import toast from "react-hot-toast";
import type { Plan, Subscription, Payment } from "@/types";

export default function useBilling() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Plan[]>(ENDPOINTS.BILLING.PLANS);
      setPlans(data);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubscription = useCallback(async () => {
    try {
      const { data } = await api.get<Subscription | null>(ENDPOINTS.BILLING.SUBSCRIPTION);
      setSubscription(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  const fetchCurrencies = useCallback(async () => {
    try {
      const { data } = await api.get<string[]>(ENDPOINTS.BILLING.CURRENCIES);
      setCurrencies(data);
      return data;
    } catch {
      return [];
    }
  }, []);

  const subscribe = useCallback(async (planId: string, payCurrency?: string) => {
    setLoading(true);
    try {
      const { data } = await api.post<Subscription>(ENDPOINTS.BILLING.SUBSCRIBE, {
        plan_id: planId,
        pay_currency: payCurrency || undefined,
      });
      setSubscription(data);

      if (data.invoice_url) {
        toast.success("Redirecting to payment...");
        window.open(data.invoice_url, "_blank");
      } else {
        toast.success("Subscription created! Complete payment to activate.");
      }

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    const { data } = await api.get<Payment[]>(ENDPOINTS.BILLING.PAYMENTS);
    setPayments(data);
    return data;
  }, []);

  return {
    plans,
    subscription,
    payments,
    currencies,
    loading,
    fetchPlans,
    fetchSubscription,
    fetchCurrencies,
    subscribe,
    fetchPayments,
  };
}
