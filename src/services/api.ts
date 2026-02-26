import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/authStore";
import { ENDPOINTS } from "./endpoints";
import type { ApiError } from "@/types";

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ── JWT helpers ────────────────────────────────────────────
/** Returns true if the token is missing, malformed, or expires within 30 s. */
export function isTokenExpiredOrMissing(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // 30-second buffer guards against clock skew
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now() + 30_000;
  } catch {
    return true;
  }
}

// ── Request interceptor: attach access token ───────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 + refresh ─────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
}

async function attemptTokenRefresh(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) throw new Error("No refresh token");

  // Use the api instance so base config (timeout, content-type) is inherited.
  // The response interceptor won't recurse because /auth/refresh is excluded
  // from retry logic via the isAuthEndpoint check below.
  const { data } = await api.post(ENDPOINTS.AUTH.REFRESH, {
    refresh_token: refreshToken,
  });

  useAuthStore.getState().setTokens(data.access_token, data.refresh_token);
  return data.access_token as string;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Don't retry auth endpoints
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/refresh") ||
      originalRequest?.url?.includes("/auth/connect") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await attemptTokenRefresh();
        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        toast.error("Session expired. Please log in again.");
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Show error toasts for non-401 errors
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (typeof detail === "string") {
        toast.error(detail);
      }
    } else if (error.message === "Network Error") {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
