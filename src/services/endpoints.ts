const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Derive WebSocket URL from API URL
const WS_BASE = API.replace(/^http/, "ws").replace(/\/api\/v1$/, "/api/v1");

export const ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: `${API}/auth/register`,
    LOGIN: `${API}/auth/login`,
    CONNECT: `${API}/auth/connect`,
    GENERATE: `${API}/auth/generate`,
    REFRESH: `${API}/auth/refresh`,
    ME: `${API}/auth/me`,
    EMAIL_SUBMIT: `${API}/auth/email/submit`,
    EMAIL_VERIFY: `${API}/auth/email/verify`,
    FORGOT_PASSWORD: `${API}/auth/forgot-password`,
    RESET_PASSWORD: `${API}/auth/reset-password`,
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
    CURRENCIES: `${API}/billing/currencies`,
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

  // Analytics
  ANALYTICS: {
    OVERVIEW: `${API}/analytics/overview`,
    STRATEGY: (id: string) => `${API}/analytics/strategy/${id}`,
    EQUITY_CURVE: `${API}/analytics/equity-curve`,
  },

  // Transparency
  TRANSPARENCY: {
    PROOF_OF_RESERVES: `${API}/transparency/proof-of-reserves`,
    POSITIONS: `${API}/transparency/positions`,
    WALLET_INFO: `${API}/transparency/wallet-info`,
  },

  // Market Data
  MARKET: {
    WS: `${WS_BASE}/market/ws`,
    TOP_GAINERS: `${API}/market/top-gainers`,
    ALL: `${API}/market/all`,
  },
} as const;
