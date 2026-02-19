const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API}/auth/register`,
    LOGIN: `${API}/auth/login`,
    SIGN_MESSAGE: `${API}/auth/sign-message`,
    CONNECT: `${API}/auth/connect`,
    GENERATE: `${API}/auth/generate`,
    REFRESH: `${API}/auth/refresh`,
    ME: `${API}/auth/me`,
    EMAIL_SUBMIT: `${API}/auth/email/submit`,
    EMAIL_VERIFY: `${API}/auth/email/verify`,
  },

  // Strategies
  STRATEGIES: {
    LIST: `${API}/strategies`,
    CREATE: `${API}/strategies`,
    GET: (id: string) => `${API}/strategies/${id}`,
    UPDATE: (id: string) => `${API}/strategies/${id}`,
    DELETE: (id: string) => `${API}/strategies/${id}`,
    ACTIVATE: (id: string) => `${API}/strategies/${id}/activate`,
    PAUSE: (id: string) => `${API}/strategies/${id}/pause`,
  },

  // Signals
  SIGNALS: {
    LIST: `${API}/signals`,
    LIVE: `${API}/signals/live`,
    HISTORY: `${API}/signals/history`,
    GET: (id: string) => `${API}/signals/${id}`,
  },

  // Executions
  EXECUTIONS: {
    LIST: `${API}/executions`,
    GET: (id: string) => `${API}/executions/${id}`,
    VERIFY: (id: string) => `${API}/executions/${id}/verify`,
  },

  // Transactions
  TRANSACTIONS: {
    LIST: `${API}/transactions`,
  },

  // Billing
  BILLING: {
    PLANS: `${API}/billing/plans`,
    SUBSCRIBE: `${API}/billing/subscribe`,
    SUBSCRIPTION: `${API}/billing/subscription`,
    PAYMENTS: `${API}/billing/payments`,
  },

  // Ambassador
  AMBASSADOR: {
    DASHBOARD: `${API}/ambassador`,
    LEADERBOARD: `${API}/ambassador/leaderboard`,
    REFERRAL: `${API}/ambassador/referral`,
    TEAM: `${API}/ambassador/team`,
  },

  // Support
  SUPPORT: {
    TICKETS: `${API}/support/tickets`,
    GET_TICKET: (id: string) => `${API}/support/tickets/${id}`,
    ADD_MESSAGE: (id: string) => `${API}/support/tickets/${id}/messages`,
  },

  // Learning
  LEARNING: {
    CONTENT: `${API}/learning/content`,
    GET_CONTENT: (id: string) => `${API}/learning/content/${id}`,
  },

  // Telegram / Notifications
  TELEGRAM: {
    CONFIG: `${API}/telegram/config`,
    TEST: `${API}/telegram/test`,
    PREFERENCES: `${API}/telegram/notifications/preferences`,
  },
} as const;
