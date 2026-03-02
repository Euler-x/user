import { useEffect, useRef } from "react";
import { useAuthStore, useAuthHasHydrated } from "@/stores/authStore";
import { ENDPOINTS } from "@/services/endpoints";
import api, { isTokenExpiredOrMissing } from "@/services/api";

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

/**
 * Runs once after Zustand persist hydration completes. If the user has a
 * persisted refreshToken but no in-memory accessToken (e.g. after a hard page
 * refresh), silently exchanges the refresh token for a new access token so the
 * session is restored without requiring the user to log in again.
 *
 * IMPORTANT: Must wait for hydration — on first render, the Zustand store has
 * default values (refreshToken = null). Acting on those defaults would mark
 * the attempt as done and the real refresh would never fire.
 */
export function useTokenRefresh() {
  const { accessToken, refreshToken, setTokens, logout } = useAuthStore();
  const hasHydrated = useAuthHasHydrated();
  const attempted = useRef(false);

  useEffect(() => {
    // Don't act on default (pre-hydration) store values — refreshToken would
    // be null even though the user has a real token in localStorage.
    if (!hasHydrated) return;
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
            if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
              window.location.href = "/login";
            }
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);
}
