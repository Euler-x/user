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
  const [currenciesLoading, setCurrenciesLoading] = useState(false);

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
    setCurrenciesLoading(true);
    try {
      const { data } = await api.get<string[]>(ENDPOINTS.BILLING.CURRENCIES);
      setCurrencies(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      console.error("Failed to fetch currencies:", err);
      toast.error("Failed to load payment currencies. Please try again.");
      return [];
    } finally {
      setCurrenciesLoading(false);
    }
  }, []);

  const subscribe = useCallback(async (planId: string, payCurrency?: string, useTrial?: boolean) => {
    setLoading(true);
    try {
      const { data } = await api.post<Subscription>(ENDPOINTS.BILLING.SUBSCRIBE, {
        plan_id: planId,
        pay_currency: payCurrency || undefined,
        use_trial: useTrial || false,
      });
      setSubscription(data);

      if (data.invoice_url) {
        toast.success("Redirecting to payment...");
        window.open(data.invoice_url, "_blank");
      } else if (useTrial) {
        toast.success("Free trial activated! Enjoy your plan.");
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
    currenciesLoading,
    fetchPlans,
    fetchSubscription,
    fetchCurrencies,
    subscribe,
    fetchPayments,
  };
}
