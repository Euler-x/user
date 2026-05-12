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
export type AmbassadorRank =
  | "associate"
  | "bronze_leader"
  | "silver_leader"
  | "gold_leader"
  | "platinum_leader"
  | "diamond_leader"
  | "elite_diamond"
  | "black_diamond"
  | "crown_ambassador"
  | "grand_crown";
export type CommissionStatus = "pending" | "paid" | "cancelled";
export type BonusType =
  | "rank_advancement"
  | "performance_milestone"
  | "fast_start"
  | "loyalty_retention"
  | "leadership_pool"
  | "generational_override";
export type PayoutStatus = "pending" | "processing" | "paid" | "failed" | "cancelled";
export type TravelStatus = "qualifying" | "qualified" | "awarded" | "expired";
export type TerritoryType = "geographic" | "demographic" | "platform";
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
  bybit_configured: boolean;
  binance_configured: boolean;
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
  target_exchange: string;
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
  target_exchange?: string;
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
  target_exchange?: string;
}

// ── Signals ────────────────────────────────────────────────
export type Exchange = "hyperliquid" | "bybit" | "binance";

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
  exchange: Exchange;
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
  signal_id: string | null;
  bybit_signal_id: string | null;
  binance_signal_id: string | null;
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
  exchange_order_id: string | null;
  exchange: Exchange;
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

export interface CloseExecutionResponse {
  execution: Execution;
  message: string;
  already_closed_on_exchange: boolean;
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
  par_count: number;
  tav_count: number;
  total_referrals: number;
  rewards_earned: number;
  payout_address: string | null;
  rank_achieved_at: string | null;
  fast_start_claimed: number;
  created_at: string;
}

export interface LeaderboardEntry {
  rank_position: number;
  user_id: string;
  ambassador_rank: AmbassadorRank;
  total_referrals: number;
  tav_count: number;
  rewards_earned: number;
}

export interface ReferralResponse {
  referral_code: string;
  referral_link: string;
}

export interface ReferralItem {
  joined_at: string;
  plan_name: string | null;
  plan_price: number | null;
  is_subscribed: boolean;
  rank: AmbassadorRank;
  subscription_months: number;
}

export interface RankProgress {
  current_rank: AmbassadorRank;
  next_rank: AmbassadorRank | null;
  current_rank_label: string;
  next_rank_label: string | null;
  par_count: number;
  tav_count: number;
  par_required: number | null;
  tav_required: number | null;
  legs_required: number | null;
  leg_rank_required: string | null;
  qualifying_legs: number;
  current_depth: number;
  next_depth: number | null;
}

export interface EarningsSummary {
  total_commission_paid: number;
  total_commission_pending: number;
  current_month_commission: number;
  next_payout_date: string;
  active_referral_count: number;
  tav_count: number;
  rank_progress: RankProgress;
  fast_start_eligible: boolean;
  fast_start_period: number;
}

export interface AmbassadorCommission {
  id: string;
  month: number;
  year: number;
  active_referral_count: number;
  tav_count: number;
  commission_amount: number;
  level_breakdown: Record<string, number> | null;
  generational_override: number;
  status: CommissionStatus;
  paid_at: string | null;
  created_at: string;
}

export interface AmbassadorBonus {
  id: string;
  bonus_type: BonusType;
  amount: number;
  period: string | null;
  description: string | null;
  status: CommissionStatus;
  paid_at: string | null;
  created_at: string;
}

export interface AmbassadorPayout {
  id: string;
  total_amount: number;
  status: PayoutStatus;
  payout_address: string | null;
  admin_notes: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface TrainingModule {
  key: string;
  name: string;
  rank: AmbassadorRank;
  duration_min: number;
  completed: boolean;
  completed_at: string | null;
}

export interface TravelIncentive {
  id: string;
  destination: string;
  rank_required: AmbassadorRank;
  qualification_start: string;
  qualification_end: string | null;
  status: TravelStatus;
  awarded_at: string | null;
  admin_notes: string | null;
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
  trade_volume: number;
  avg_trade_pnl: number;
  best_trade: number;
  worst_trade: number;
  // Trade-based return % — always present regardless of portfolio snapshots
  pnl_on_volume_pct: number;
  // Portfolio snapshot-based returns
  portfolio_balance: number;
  starting_balance: number;
  ending_balance: number;
  period_return_pct: number;
  day_return_pct: number;
  week_return_pct: number;
  month_return_pct: number;
  has_portfolio_history: boolean;
  period_days: number;
  start_date?: string | null;
  end_date?: string | null;
  daily_performance?: DailyPerformance[];
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

export interface DailyPerformance {
  date: string;
  trade_volume: number;
  pnl: number;
  pnl_pct: number;
  cumulative_pnl: number;
  cumulative_pnl_pct: number;
  trades_count: number;
}

export interface SystemPerformance {
  period_days: number;
  total_trade_volume: number;
  total_pnl: number;
  total_return_pct: number;
  winning_days: number;
  losing_days: number;
  daily_performance: DailyPerformance[];
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
  exchange: Exchange;
  symbol: string;
  side: "long" | "short";
  size: number;
  entry_price: number;
  mark_price: number;
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

export interface BybitBalance {
  connected: boolean;
  testnet: boolean;
  account_equity: number;
  available_balance: number;
  unrealized_pnl: number;
  total_balance: number;
  open_positions: number;
  api_key_masked: string | null;
  last_synced: string | null;
}

export interface BinanceBalance {
  connected: boolean;
  testnet: boolean;
  account_equity: number;
  available_balance: number;
  unrealized_pnl: number;
  total_balance: number;
  open_positions: number;
  api_key_masked: string | null;
  last_synced: string | null;
}
