import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

// A lightweight non-httpOnly cookie used only so Next.js middleware can
// detect an active session without accessing localStorage.
const SESSION_COOKIE = "eulerx-session";

function setSessionCookie() {
  if (typeof document === "undefined") return;
  // 30-day expiry, SameSite=Lax (matches refresh-token lifetime)
  const expires = new Date(Date.now() + 30 * 86_400_000).toUTCString();
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
      setTokens: (accessToken, refreshToken) => {
        setSessionCookie();
        set({ accessToken, refreshToken });
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
        // accessToken intentionally excluded — kept in memory only to reduce
        // XSS exposure. refreshToken is persisted to enable silent re-auth.
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
