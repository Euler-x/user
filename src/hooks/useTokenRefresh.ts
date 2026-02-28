import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { ENDPOINTS } from "@/services/endpoints";
import api, { isTokenExpiredOrMissing } from "@/services/api";

/**
 * Runs once on mount. If the user has a persisted refreshToken but no
 * in-memory accessToken (e.g. after a hard page refresh), silently exchanges
 * the refresh token for a new access token so the session is restored without
 * requiring the user to log in again.
 */
export function useTokenRefresh() {
  const { accessToken, refreshToken, setTokens, logout } = useAuthStore();
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    if (refreshToken && isTokenExpiredOrMissing(accessToken)) {
      api
        .post(ENDPOINTS.AUTH.REFRESH, { refresh_token: refreshToken })
        .then(({ data }) => {
          setTokens(data.access_token, data.refresh_token);
        })
        .catch(() => {
          // Refresh token is invalid or expired — clear stale session data
          logout();
          // Force a hard redirect so the middleware cookie is gone and
          // Next.js cannot bounce the user back to a protected route.
          if (typeof window !== "undefined") {
            const { pathname } = window.location;
            const PROTECTED_PREFIXES = [
              "/dashboard",
              "/strategies",
              "/signals",
              "/executions",
              "/transactions",
              "/billing",
              "/ambassador",
              "/analytics",
              "/transparency",
              "/settings",
              "/support",
              "/learn",
            ];
            if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
              window.location.href = "/login";
            }
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
