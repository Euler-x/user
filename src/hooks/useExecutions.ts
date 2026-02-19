import { useState, useCallback } from "react";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { Execution, ExecutionVerify, PaginatedResponse } from "@/types";

export default function useExecutions() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchExecutions = useCallback(async (params?: Record<string, unknown>) => {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedResponse<Execution>>(ENDPOINTS.EXECUTIONS.LIST, { params });
      setExecutions(data.items);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExecution = useCallback(async (id: string) => {
    const { data } = await api.get<Execution>(ENDPOINTS.EXECUTIONS.GET(id));
    return data;
  }, []);

  const verifyExecution = useCallback(async (id: string) => {
    const { data } = await api.get<ExecutionVerify>(ENDPOINTS.EXECUTIONS.VERIFY(id));
    return data;
  }, []);

  return { executions, total, totalPages, loading, fetchExecutions, getExecution, verifyExecution };
}
