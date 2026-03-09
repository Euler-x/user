// ── Enums ──────────────────────────────────────────────────
export type WalletType = "connected" | "generated";
export type StrategyType = "conservative" | "moderate" | "aggressive" | "custom";
export type RiskProfile = "low" | "medium" | "high";
export type StrategyTimeframe = "scalping" | "intraday" | "swing" | "position";
export type SignalDirection = "buy" | "sell" | "hold";
export type SignalStatus = "new" | "executing" | "filled" | "expired" | "cancelled";
export type OrderType = "market" | "limit";
export type ExecutionStatus = "pending" | "filled" | "partially_filled" | "closed" | "cancelled" | "failed";
export type TransactionCategory = "deposit" | "execution" | "subscription" | "reward";
export type TransactionStatus = "pending" | "confirmed" | "failed";
export type SubscriptionStatus = "inactive" | "pending_payment" | "active" | "expiring_soon" | "expired" | "cancelled";
export type PaymentStatus = "waiting" | "confirming" | "confirmed" | "sending" | "partially_paid" | "finished" | "failed" | "refunded" | "expired";
export type PlanStatus = "active" | "inactive" | "archived";
export type BillingCycle = "monthly" | "quarterly" | "yearly";
export type AmbassadorRank = "bronze" | "silver" | "gold" | "platinum" | "diamond";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type ContentCategory = "crypto_basics" | "ai_trading" | "risk_management" | "automated_trading" | "platform_guide";
export type ContentType = "video" | "article" | "pdf";

// ── Auth ───────────────────────────────────────────────────
export interface User {
  id: string;
  wallet_address_hash: string | null;
  wallet_type: WalletType | null;
  is_admin: boolean;
  is_active: boolean;
  is_subscribed: boolean;
  email: string | null;
  email_verified: boolean;
  has_wallet: boolean;
  telegram_configured: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface WalletGenerateResponse {
  wallet_address: string;
  private_key: string;
  auth: AuthResponse;
}

// ── Strategies ─────────────────────────────────────────────
export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  strategy_type: StrategyType;
  risk_profile: RiskProfile;
  leverage_limit: number;
  max_positions: number;
  allocation_pct: number;
  max_drawdown_percent: number;
  is_active: boolean;
  daily_loss_cap_percent: number | null;
  target_volatility: number | null;
  expected_volatility: number | null;
  timeframe: StrategyTimeframe | null;
  target_return_min: number | null;
  target_return_max: number | null;
  paused_reason: string | null;
  paused_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StrategyCreate {
  name: string;
  strategy_type: StrategyType;
  risk_profile: RiskProfile;
  leverage_limit?: number;
  max_positions?: number;
  allocation_pct: number;
  max_drawdown_percent?: number;
  daily_loss_cap_percent?: number;
  target_volatility?: number;
  expected_volatility?: number;
  timeframe?: StrategyTimeframe;
  target_return_min?: number;
  target_return_max?: number;
}

export interface StrategyUpdate {
  name?: string;
  risk_profile?: RiskProfile;
  leverage_limit?: number;
  max_positions?: number;
  allocation_pct?: number;
  max_drawdown_percent?: number;
  daily_loss_cap_percent?: number;
  target_volatility?: number;
  expected_volatility?: number;
  timeframe?: StrategyTimeframe;
  target_return_min?: number;
  target_return_max?: number;
}

// ── Signals ────────────────────────────────────────────────
export interface Signal {
  id: string;
  strategy_id: string | null;
  symbol: string;
  direction: SignalDirection;
  confidence: number;
  entry_price: number;
  stop_loss: number | null;
  take_profit: number | null;
  risk_reward_ratio: number | null;
  indicators: Record<string, unknown> | null;
  status: SignalStatus;
  expires_at: string | null;
  created_at: string;
}

export interface SignalDetail extends Signal {
  model_responses: Record<string, unknown> | null;
  executions: Execution[];
}

// ── Executions ─────────────────────────────────────────────
export interface Execution {
  id: string;
  signal_id: string;
  user_id: string;
  strategy_id: string;
  order_type: OrderType;
  direction: SignalDirection;
  entry_price: number;
  exit_price: number | null;
  quantity: number;
  leverage: number;
  pnl: number | null;
  tx_hash: string | null;
  error_message: string | null;
  status: ExecutionStatus;
  executed_at: string | null;
  created_at: string;
}

export interface ExecutionVerify {
  execution_id: string;
  tx_hash: string | null;
  verified: boolean;
  verification_link: string | null;
}

// ── Transactions ───────────────────────────────────────────
export interface Transaction {
  id: string;
  user_id: string;
  category: TransactionCategory;
  amount: number;
  asset: string;
  status: TransactionStatus;
  verification_link: string | null;
  tx_hash: string | null;
  description: string | null;
  created_at: string;
}

// ── Billing ────────────────────────────────────────────────
export interface Plan {
  id: string;
  name: string;
  price_usd: number;
  billing_cycle: BillingCycle;
  features: Record<string, unknown>;
  max_strategies: number;
  max_allocation: number;
  ate_access: boolean;
  trial_days: number;
  status: PlanStatus;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  started_at: string | null;
  expires_at: string | null;
  grace_until: string | null;
  nowpayments_invoice_id: string | null;
  invoice_url: string | null;
  plan: Plan | null;
  created_at: string;
}

export interface Payment {
  id: string;
  subscription_id: string;
  amount_usd: number;
  amount_crypto: number | null;
  crypto_currency: string | null;
  nowpayments_payment_id: string | null;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
}

// ── Ambassador ─────────────────────────────────────────────
export interface Ambassador {
  id: string;
  user_id: string;
  rank: AmbassadorRank;
  referral_code: string;
  team_size: number;
  total_referrals: number;
  rewards_earned: number;
  created_at: string;
}

export interface LeaderboardEntry {
  rank_position: number;
  user_id: string;
  ambassador_rank: AmbassadorRank;
  total_referrals: number;
  rewards_earned: number;
}

export interface ReferralResponse {
  referral_code: string;
  referral_link: string;
}

// ── Support ────────────────────────────────────────────────
export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export interface TicketDetail extends SupportTicket {
  messages: SupportMessage[];
}

// ── Learning ───────────────────────────────────────────────
export interface LearningContent {
  id: string;
  title: string;
  description: string | null;
  category: ContentCategory;
  file_path: string | null;
  content_type: ContentType;
  content_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

// ── Notifications ──────────────────────────────────────────
export interface NotificationPreferences {
  trades_email: boolean;
  trades_telegram: boolean;
  signals_email: boolean;
  signals_telegram: boolean;
  billing_email: boolean;
  billing_telegram: boolean;
  support_email: boolean;
  support_telegram: boolean;
  referrals_email: boolean;
  referrals_telegram: boolean;
}

// ── Market Data ───────────────────────────────────────────
export interface MarketToken {
  symbol: string;
  midPrice: number;
  markPx: number;
  prevDayPx: number;
  change24h: number;
  funding: string;
  openInterest: string;
  dayNtlVlm: string;
  szDecimals: number;
  maxLeverage: number;
}

// ── Common ─────────────────────────────────────────────────
export interface PaginatedResponse<T = unknown> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface MessageResponse {
  message: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiError {
  detail: string | ValidationError[];
  request_id?: string;
}

// ── Analytics ─────────────────────────────────────────────
export interface AnalyticsOverview {
  total_trades: number;
  win_rate: number;
  profit_factor: number;
  sharpe_ratio: number;
  max_drawdown: number;
  total_pnl: number;
  avg_trade_pnl: number;
  best_trade: number;
  worst_trade: number;
  period_days: number;
}

export interface StrategyAnalytics extends AnalyticsOverview {
  strategy_id: string;
  strategy_name: string;
}

export interface EquityCurvePoint {
  timestamp: string;
  cumulative_pnl: number;
  trade_pnl: number;
}

// ── Transparency ──────────────────────────────────────────
export interface ProofOfReserves {
  on_chain_balance: number;
  total_allocated: number;
  margin_used: number;
  free_collateral: number;
  surplus_deficit: number;
  verification_timestamp: string;
}

export interface LivePosition {
  symbol: string;
  size: number;
  entry_price: number;
  unrealized_pnl: number;
  leverage: number;
  liquidation_price: number | null;
  margin_used: number;
  position_value: number;
}

export interface AgentKeyPermissions {
  wallet_type: string;
  can_trade: boolean;
  can_withdraw: boolean;
  can_transfer: boolean;
  can_modify_agent: boolean;
  description: string;
  verified: boolean;
}

export interface WalletInfo {
  wallet_address: string | null;
  explorer_link: string | null;
  agent_permissions: AgentKeyPermissions | null;
  smart_contract_audit_link: string;
}

// ── Wallet Balance ──────────────────────────────────────
export interface WalletBalance {
  has_wallet: boolean;
  account_equity: number;
  available_balance: number;
  margin_used: number;
  unrealized_pnl: number;
  spot_balance: number;
  total_balance: number;
  open_positions: number;
  wallet_address_masked: string | null;
  last_synced: string | null;
}
