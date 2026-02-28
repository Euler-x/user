import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

// A lightweight non-httpOnly cookie used only so Next.js middleware can
// detect an active session without accessing localStorage.
const SESSION_COOKIE = "eulerx-session";

function setSessionCookie() {
  if (typeof document === "undefined") return;
  // 7-day expiry — matches the refresh-token lifetime so the cookie never
  // outlives the token and the middleware never grants access to a dead session.
  const expires = new Date(Date.now() + 7 * 86_400_000).toUTCString();
  document.cookie = `${SESSION_COOKIE}=1; path=/; expires=${expires}; SameSite=Lax`;
}

function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

interface AuthState {
  user: User | null;
  /** In-memory only — NOT written to localStorage. Lost on page refresh and
   *  silently restored by useTokenRefresh via the persisted refreshToken. */
  accessToken: string | null;
  /** Persisted so we can silently re-acquire an access token after page refresh. */
  refreshToken: string | null;
  /** NOT persisted — derived from having a valid in-memory accessToken.
   *  Always starts false on page load; becomes true after login or silent refresh. */
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) => {
        setSessionCookie();
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },
      // Also sets isAuthenticated: true — called after a successful silent
      // refresh so components waiting on isAuthenticated get re-rendered.
      setTokens: (accessToken, refreshToken) => {
        setSessionCookie();
        set({ accessToken, refreshToken, isAuthenticated: true });
      },
      setUser: (user) => set({ user }),
      logout: () => {
        clearSessionCookie();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "eulerx-auth",
      partialize: (state) => ({
        user: state.user,
        // accessToken: excluded — kept in memory only (reduces XSS exposure)
        refreshToken: state.refreshToken,
        // isAuthenticated: excluded — always re-derived on load via silent
        // refresh so a stale 'true' can never block the login redirect.
      }),
    }
  )
);

/**
 * Returns true once the Zustand persist middleware has finished rehydrating
 * from localStorage. Use this to avoid acting on the default (empty) store
 * state before persisted values are available.
 *
 * Safe to call during SSR — returns false until the client hydrates.
 */
export function useAuthHasHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(() =>
    typeof window !== "undefined" && useAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    // In case hydration completed before this effect ran
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() =>
      setHasHydrated(true)
    );
    return unsub;
  }, []);

  return hasHydrated;
}
