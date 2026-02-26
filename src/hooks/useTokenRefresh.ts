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
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
