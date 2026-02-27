import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/authStore";
import { ENDPOINTS } from "./endpoints";
import type { ApiError, ValidationError } from "@/types";

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

    // ── Show error toasts ──────────────────────────────────────
    if (!error.response) {
      // No response: timeout or complete network failure
      if (error.code === "ECONNABORTED") {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error("Network error. Please check your connection.");
      }
    } else {
      const detail = error.response.data?.detail;
      if (typeof detail === "string" && detail) {
        toast.error(detail);
      } else if (Array.isArray(detail) && detail.length > 0) {
        // FastAPI 422 validation: detail is an array of {loc, msg, type}
        const messages = (detail as ValidationError[])
          .map((e) => e.msg)
          .filter(Boolean)
          .join("; ");
        toast.error(messages || "Validation error. Please check your input.");
      } else {
        // Fallback messages when there is no structured detail body
        const status = error.response.status;
        if (status === 429) {
          toast.error("Too many requests. Please slow down.");
        } else if (status >= 500) {
          toast.error("Server error. Please try again later.");
        }
        // 401 on auth endpoints: should always include a detail string from the backend
        // 403 plan-enforcement errors: always include a detail string
      }
    }

    return Promise.reject(error);
  }
);

export default api;
