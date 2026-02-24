"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate, useInView, useScroll, useSpring } from "framer-motion";
import {
  Zap, Brain, Shield, BarChart3, ArrowRight, Wallet, Activity, Eye,
  TrendingUp, CheckCircle, Award, BookOpen, Lock, Timer, FileText,
  Cpu, Globe, Layers, ChevronRight, ArrowUpRight, Users, Target,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import useMarketData from "@/hooks/useMarketData";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DATA
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const architectureLayers = [
  { icon: Wallet, title: "Wallet Authorization Layer", desc: "Secure wallet-signed authentication for every execution command.", color: "#39FF14" },
  { icon: Brain, title: "AI Execution Engine", desc: "Multi-model probabilistic analysis powering every trading decision.", color: "#06B6D4" },
  { icon: TrendingUp, title: "Hyperliquid Trading Rail", desc: "Direct interface with decentralized liquidity venues.", color: "#8B5CF6" },
  { icon: Eye, title: "On-Chain Verification", desc: "Every trade auditable via blockchain transaction hashes.", color: "#F59E0B" },
  { icon: BarChart3, title: "Performance Analytics", desc: "Real-time PnL, drawdown, and exposure tracking.", color: "#39FF14" },
];

const strategyMethods = [
  { icon: Brain, title: "Statistical Inference", desc: "Probabilistic frameworks for market regime detection and signal generation.", color: "#06B6D4" },
  { icon: Activity, title: "Volatility Analytics", desc: "Adaptive models responding to shifting volatility regimes in real-time.", color: "#8B5CF6" },
  { icon: Timer, title: "Execution Timing", desc: "Precision entry and exit calibrated to liquidity depth and spread conditions.", color: "#F59E0B" },
  { icon: Shield, title: "Capital Constraints", desc: "Hard limits on drawdown, leverage, and position sizing enforced algorithmically.", color: "#39FF14" },
];

const pricingTiers = [
  {
    name: "ATE Core",
    price: 100,
    desc: "Foundational execution environment for disciplined participants entering AI-driven deployment.",
    features: ["3 Active Strategies", "Basic Analytics", "Email Notifications", "Standard Execution"],
    featured: false,
    color: "#06B6D4",
  },
  {
    name: "ATE Pro",
    price: 250,
    desc: "Advanced strategy frameworks and enhanced analytics for active capital allocators.",
    features: ["10 Active Strategies", "Advanced Analytics", "Telegram Alerts", "Priority Execution", "ATE Full Access"],
    featured: true,
    color: "#39FF14",
  },
  {
    name: "ATE Prime",
    price: 500,
    desc: "Institutional-grade execution models with priority engine allocation and extended strategy scope.",
    features: ["Unlimited Strategies", "Institutional Analytics", "All Channels", "Dedicated Execution", "ATE Full Access", "Priority Support"],
    featured: false,
    color: "#8B5CF6",
  },
];

const stats = [
  { label: "Execution Uptime", value: 99.9, suffix: "%", decimals: 1 },
  { label: "Assets Supported", value: 50, suffix: "+", decimals: 0 },
  { label: "Avg Execution", value: 12, suffix: "ms", decimals: 0 },
  { label: "On-Chain Verified", value: 100, suffix: "%", decimals: 0 },
];

const securityPrinciples = [
  { icon: Lock, title: "Wallet-Signed Auth", desc: "Every action cryptographically authorized by wallet owner.", color: "#39FF14" },
  { icon: Shield, title: "Non-Custodial", desc: "Funds never leave your wallet. Zero counterparty risk.", color: "#06B6D4" },
  { icon: Lock, title: "Encrypted Transport", desc: "JWT-based sessions with TLS 1.3 encrypted transport.", color: "#8B5CF6" },
  { icon: Timer, title: "Rate-Limited", desc: "Throttled API access to prevent abuse and overexposure.", color: "#F59E0B" },
  { icon: FileText, title: "Full Audit Trail", desc: "Every execution cycle logged and verifiable.", color: "#39FF14" },
  { icon: Eye, title: "Open Verification", desc: "Transaction hashes for independent on-chain confirmation.", color: "#06B6D4" },
];

const fallbackTickerItems = [
  { pair: "BTC/USD", price: "$67,432", change: "+2.41%" },
  { pair: "ETH/USD", price: "$3,891", change: "+1.87%" },
  { pair: "SOL/USD", price: "$178.24", change: "+4.12%" },
  { pair: "AVAX/USD", price: "$42.18", change: "-0.53%" },
  { pair: "ARB/USD", price: "$1.82", change: "+3.27%" },
  { pair: "OP/USD", price: "$3.14", change: "+1.95%" },
  { pair: "LINK/USD", price: "$18.67", change: "+2.08%" },
  { pair: "DOT/USD", price: "$8.43", change: "+0.76%" },
];

const footerLinks = [
  { label: "Documentation", href: "/learn" },
  { label: "Terms of Use", href: "#" },
  { label: "Risk Disclosure", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Acceptable Use Policy", href: "#" },
  { label: "Support", href: "/support" },
];

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ANIMATED BACKGROUND COMPONENTS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary green orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(57, 255, 20, 0.12) 0%, transparent 70%)",
          left: "20%",
          top: "-20%",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Cyan orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
          right: "10%",
          top: "10%",
        }}
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 60, -40, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Purple orb */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
          left: "50%",
          bottom: "-10%",
        }}
        animate={{
          x: [0, 70, -40, 0],
          y: [0, -50, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function HeroGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`h-${i}`}
          className="absolute w-full h-px"
          style={{
            top: `${12 + i * 12}%`,
            background: "linear-gradient(90deg, transparent, rgba(57, 255, 20, 0.06), transparent)",
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 + i * 0.08, ease: "easeOut" }}
        />
      ))}
      {/* Vertical lines */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`v-${i}`}
          className="absolute h-full w-px"
          style={{
            left: `${8 + i * 8}%`,
            background: "linear-gradient(180deg, transparent, rgba(57, 255, 20, 0.04), transparent)",
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 + i * 0.06, ease: "easeOut" }}
        />
      ))}
      {/* Intersection dots */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-neon/30"
          style={{
            left: `${20 + i * 16}%`,
            top: `${24 + (i % 3) * 24}%`,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
          transition={{ duration: 3, delay: i * 0.6, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function HeroChart() {
  const chartPath =
    "M0,350 C60,345 100,340 150,280 C200,220 220,310 280,300 C340,290 360,200 400,180 C440,160 470,230 520,200 C570,170 600,130 660,140 C720,150 740,100 800,80 C860,60 890,130 940,100 C990,70 1040,50 1100,60 C1160,70 1180,30 1200,20";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 w-full h-[60%] opacity-25"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(57, 255, 20, 0.15)" />
            <stop offset="100%" stopColor="rgba(57, 255, 20, 0)" />
          </linearGradient>
          <linearGradient id="heroStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.5)" />
            <stop offset="50%" stopColor="rgba(57, 255, 20, 0.6)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.4)" />
          </linearGradient>
          <filter id="chartGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d={`${chartPath} L1200,400 L0,400 Z`}
          fill="url(#heroFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        />
        <motion.path
          d={chartPath}
          stroke="url(#heroStroke)"
          strokeWidth="2.5"
          filter="url(#chartGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.circle
          cx="1200"
          cy="20"
          r="5"
          fill="#39FF14"
          filter="url(#chartGlow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1], scale: [0, 1.5, 1] }}
          transition={{ duration: 0.5, delay: 3 }}
        />
      </svg>
    </div>
  );
}

function FloatingOrbs() {
  const orbs = [
    { size: 4, x: "15%", y: "20%", color: "#39FF14", delay: 0 },
    { size: 3, x: "80%", y: "30%", color: "#06B6D4", delay: 0.5 },
    { size: 5, x: "60%", y: "70%", color: "#8B5CF6", delay: 1 },
    { size: 3, x: "25%", y: "65%", color: "#39FF14", delay: 1.5 },
    { size: 4, x: "90%", y: "55%", color: "#F59E0B", delay: 2 },
    { size: 2, x: "45%", y: "15%", color: "#06B6D4", delay: 0.8 },
    { size: 3, x: "70%", y: "85%", color: "#39FF14", delay: 1.2 },
    { size: 2, x: "5%", y: "45%", color: "#8B5CF6", delay: 0.3 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            backgroundColor: orb.color,
            boxShadow: `0 0 ${orb.size * 4}px ${orb.color}40`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 6 + i * 0.5,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function DataTicker({ liveTokens }: { liveTokens?: { symbol: string; midPrice: number; change24h: number }[] }) {
  const tickerItems = liveTokens && liveTokens.length > 0
    ? liveTokens.slice(0, 30).map((t) => ({
        pair: `${t.symbol}/USD`,
        price: t.midPrice >= 1000
          ? `$${t.midPrice.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
          : t.midPrice >= 1
            ? `$${t.midPrice.toFixed(2)}`
            : `$${t.midPrice.toFixed(4)}`,
        change: `${t.change24h >= 0 ? "+" : ""}${t.change24h.toFixed(2)}%`,
      }))
    : fallbackTickerItems;

  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="overflow-hidden border-y border-white/[0.04] bg-dark-200/40 backdrop-blur-sm">
      <div className="animate-ticker flex gap-10 whitespace-nowrap py-3.5 px-4">
        {doubled.map((item, i) => {
          const isPositive = item.change.startsWith("+");
          return (
            <span key={i} className="text-xs font-mono flex items-center gap-2.5">
              <span className="text-gray-500 font-medium">{item.pair}</span>
              <span className="text-gray-300">{item.price}</span>
              <span className={isPositive ? "text-neon" : "text-red-400"}>
                {item.change}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CandlestickBackground() {
  const candles = [
    { x: 60, open: 220, close: 150, high: 130, low: 240, green: true },
    { x: 120, open: 170, close: 200, high: 140, low: 220, green: false },
    { x: 180, open: 190, close: 130, high: 110, low: 210, green: true },
    { x: 240, open: 140, close: 180, high: 120, low: 200, green: false },
    { x: 300, open: 170, close: 120, high: 100, low: 190, green: true },
    { x: 360, open: 130, close: 160, high: 110, low: 180, green: false },
    { x: 420, open: 150, close: 100, high: 80, low: 170, green: true },
    { x: 480, open: 110, close: 140, high: 90, low: 160, green: false },
    { x: 540, open: 130, close: 90, high: 70, low: 150, green: true },
    { x: 600, open: 100, close: 80, high: 60, low: 120, green: true },
    { x: 660, open: 85, close: 110, high: 60, low: 130, green: false },
    { x: 720, open: 105, close: 70, high: 50, low: 120, green: true },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center">
      <svg className="w-full max-w-3xl h-[50%] opacity-[0.07]" viewBox="0 0 780 300" fill="none">
        {candles.map((c, i) => {
          const bodyTop = Math.min(c.open, c.close);
          const bodyHeight = Math.abs(c.close - c.open);
          const color = c.green ? "rgba(57, 255, 20, 0.9)" : "rgba(239, 68, 68, 0.7)";
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={color} strokeWidth="1.5" />
              <rect
                x={c.x - 12}
                y={bodyTop}
                width="24"
                height={Math.max(bodyHeight, 3)}
                fill={c.green ? color : "transparent"}
                stroke={color}
                strokeWidth="1.5"
                rx="2"
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   UTILITY COMPONENTS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function AnimatedCounter({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 2, ease: [0.16, 1, 0.3, 1] });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [inView, value, mv, rounded]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

function SectionDivider({ color = "neon" }: { color?: string }) {
  const colorMap: Record<string, string> = {
    neon: "rgba(57, 255, 20, 0.3)",
    cyan: "rgba(6, 182, 212, 0.3)",
    purple: "rgba(139, 92, 246, 0.3)",
    multi: "rgba(57, 255, 20, 0.3)",
  };
  const c = colorMap[color] || colorMap.neon;

  return (
    <div className="relative h-px w-full">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)` }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: c.replace("0.3", "0.8") }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function SectionBadge({ children, color = "#39FF14" }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
      style={{
        backgroundColor: `${color}10`,
        border: `1px solid ${color}25`,
      }}
    >
      <motion.div
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>
        {children}
      </span>
    </div>
  );
}

function GlassCard({
  children,
  className = "",
  hoverColor,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  hoverColor?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl bg-dark-200/60 backdrop-blur-xl border border-white/[0.06] p-6 transition-all duration-500 hover:border-white/[0.12] group ${className}`}
      style={
        hoverColor
          ? ({ "--hover-color": hoverColor } as React.CSSProperties)
          : undefined
      }
    >
      {hoverColor && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${hoverColor}10, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LANDING PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function LandingPage() {
  const { tokens } = useMarketData();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 w-full z-50 bg-dark/70 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-neon" />
              <div className="absolute inset-0 rounded-xl bg-neon/20 animate-glow-pulse" />
            </div>
            <span className="text-xl font-bold text-gradient">EulerX</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Architecture", href: "#architecture" },
              { label: "Engine", href: "#ate" },
              { label: "Pricing", href: "#pricing" },
              { label: "Security", href: "#security" },
              { label: "Learn", href: "#learn" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-500 hover:text-white transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <Link href="/register">
            <Button size="sm">
              Access ATE
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-12 px-6 min-h-screen flex items-center">
        <AuroraBackground />
        <HeroGrid />
        <HeroChart />
        <FloatingOrbs />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <SectionBadge>Live Infrastructure</SectionBadge>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] mb-8 tracking-tight">
                <span className="text-white">AI-Powered</span>
                <br />
                <span className="text-gradient-multi">Execution</span>
                <br />
                <span className="text-white">Infrastructure</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
            >
              Non-custodial automated trading infrastructure for capital-aligned participants.
              Deploy algorithmic execution strategies directly from your wallet &mdash; fully
              verifiable on-chain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-12"
            >
              {[
                { label: "Non-Custodial", color: "#39FF14" },
                { label: "On-Chain Verified", color: "#06B6D4" },
                { label: "AI Execution", color: "#8B5CF6" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                  style={{
                    backgroundColor: `${badge.color}12`,
                    border: `1px solid ${badge.color}30`,
                    color: badge.color,
                  }}
                >
                  {badge.label}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link href="/register">
                <Button size="lg" className="group text-base px-8">
                  Start Trading
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#architecture">
                <Button variant="secondary" size="lg" className="text-base">
                  Explore Architecture
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Ticker ─── */}
      <DataTicker liveTokens={tokens} />

      {/* ─── Stats Bar ─── */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-extrabold text-gradient mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Positioning ─── */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle diagonal lines */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-[200%] origin-top"
              style={{
                left: `${20 + i * 20}%`,
                background: `linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.04), transparent)`,
                transform: `rotate(${15 + i * 5}deg)`,
              }}
              animate={{ y: ["-50%", "0%"] }}
              transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionBadge color="#06B6D4">Philosophy</SectionBadge>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 leading-tight">
              Built for Capital
              <br />
              <span className="text-gradient-cyan">Discipline</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                EulerX is engineered for participants who value structure, transparency,
                and risk-managed execution over speculative noise.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  "This is not a brokerage.",
                  "This is not a custodial fund.",
                  "This is not speculative automation.",
                ].map((line, i) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="text-gray-600 line-through decoration-gray-700/50 text-lg"
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-3xl md:text-4xl font-bold text-gradient mb-4">
                  EulerX is infrastructure.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <GlassCard hoverColor="#06B6D4">
                <div className="space-y-6">
                  {[
                    { icon: Cpu, label: "AI-Driven Execution", desc: "Multi-model analysis on decentralized trading rails" },
                    { icon: Eye, label: "Real-Time Verification", desc: "Every trade auditable via blockchain records" },
                    { icon: Shield, label: "Capital Sovereignty", desc: "Funds never leave user-controlled wallets" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">{item.label}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider color="cyan" />

      {/* ─── Architecture ─── */}
      <section id="architecture" className="py-28 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
              right: "-10%",
              top: "20%",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge color="#8B5CF6">Architecture</SectionBadge>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-5">
                Non-Custodial <span className="text-gradient-purple">by Design</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Capital remains within user-controlled wallets at all times.
                Five interconnected layers power every execution.
              </p>
            </motion.div>
          </div>

          {/* Architecture layers as connected pipeline */}
          <div className="max-w-3xl mx-auto">
            {architectureLayers.map((layer, i) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <GlassCard hoverColor={layer.color} className="mb-1">
                  <div className="flex items-center gap-5">
                    <div
                      className="flex-shrink-0 h-14 w-14 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${layer.color}10`,
                        border: `1px solid ${layer.color}25`,
                      }}
                    >
                      <layer.icon className="h-6 w-6" style={{ color: layer.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base">{layer.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{layer.desc}</p>
                    </div>
                    <span className="hidden sm:block text-xs font-mono px-3 py-1 rounded-lg" style={{ backgroundColor: `${layer.color}08`, color: `${layer.color}90` }}>
                      L{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </GlassCard>
                {i < architectureLayers.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <motion.div
                      className="w-px h-5"
                      style={{ background: `linear-gradient(180deg, ${layer.color}40, ${architectureLayers[i + 1].color}40)` }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center text-gray-600 mt-14 text-xs uppercase tracking-[0.2em]"
          >
            Transparency is structural &mdash; not cosmetic
          </motion.p>
        </div>
      </section>

      <SectionDivider color="purple" />

      {/* ─── ATE Engine ─── */}
      <section id="ate" className="py-28 px-6 relative overflow-hidden">
        <CandlestickBackground />
        <FloatingOrbs />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge color="#F59E0B">Execution Engine</SectionBadge>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-5">
                Automated Trading <span className="text-amber-400">Engine</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Probabilistic and liquidity-aware strategies calibrated for
                digital asset volatility environments.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-16">
            {strategyMethods.map((method, i) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <GlassCard hoverColor={method.color} className="h-full">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${method.color}10`,
                        border: `1px solid ${method.color}25`,
                      }}
                    >
                      <method.icon className="h-6 w-6" style={{ color: method.color }} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold mb-1.5">{method.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{method.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Execution badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xs text-gray-600 uppercase tracking-[0.2em] mb-5">
              Every execution is
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: "Strategy-tagged", color: "#39FF14" },
                { label: "Time-stamped", color: "#06B6D4" },
                { label: "Blockchain-verifiable", color: "#8B5CF6" },
                { label: "Performance-logged", color: "#F59E0B" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${item.color}10`,
                    border: `1px solid ${item.color}20`,
                    color: item.color,
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(57, 255, 20, 0.05) 0%, transparent 70%)",
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge>Access Tiers</SectionBadge>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-5">
                Access <span className="text-gradient">Calibrated</span> to Scale
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-lg">
                Choose the execution environment that matches your trading requirements.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative"
              >
                {tier.featured && (
                  <div
                    className="absolute -top-px -left-px -right-px -bottom-px rounded-2xl pointer-events-none"
                    style={{
                      background: `linear-gradient(135deg, ${tier.color}30, transparent 50%, ${tier.color}15)`,
                      padding: "1px",
                    }}
                  />
                )}
                <div
                  className={`relative h-full rounded-2xl p-6 lg:p-8 flex flex-col ${
                    tier.featured
                      ? "bg-dark-200/90 border border-neon/20"
                      : "bg-dark-200/60 border border-white/[0.06]"
                  }`}
                >
                  {/* Glow */}
                  {tier.featured && (
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-20"
                      style={{ background: tier.color }}
                    />
                  )}

                  <div className="relative z-10 flex flex-col h-full">
                    {tier.featured && (
                      <div
                        className="self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
                        style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
                      >
                        Most Popular
                      </div>
                    )}

                    <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-5xl font-extrabold" style={{ color: tier.color }}>
                        ${tier.price}
                      </span>
                      <span className="text-gray-600 text-sm">/ month</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">{tier.desc}</p>

                    <div className="space-y-3 mb-8 flex-1">
                      {tier.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2.5">
                          <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: tier.color }} />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/register" className="block">
                      <Button
                        variant={tier.featured ? "primary" : "secondary"}
                        className="w-full group"
                        size="lg"
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider color="cyan" />

      {/* ─── Security ─── */}
      <section id="security" className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"
              style={{ left: `${15 + i * 18}%`, height: "100%" }}
              animate={{ y: ["-100%", "100%"], opacity: [0, 0.4, 0] }}
              transition={{ duration: 4 + i, delay: i * 0.6, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <SectionBadge color="#06B6D4">Security</SectionBadge>
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-5">
                Capital <span className="text-gradient-cyan">Sovereignty</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                EulerX does not hold, pool, or manage user funds.
                Users retain full wallet control at all times.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {securityPrinciples.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <GlassCard hoverColor={item.color} className="h-full">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `${item.color}10`,
                      border: `1px solid ${item.color}20`,
                    }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-lg text-gray-400 mt-14"
          >
            Capital remains where it belongs &mdash;{" "}
            <span className="text-cyan-400 font-semibold">with the owner.</span>
          </motion.p>
        </div>
      </section>

      <SectionDivider color="purple" />

      {/* ─── Verifiable Execution ─── */}
      <section className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionBadge color="#8B5CF6">Transparency</SectionBadge>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Every Trade is <span className="text-gradient-purple">Verifiable</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Every deployment cycle produces auditable records. EulerX does not obscure
                execution &mdash; it exposes it. Trust is earned through verifiability.
              </p>

              <div className="space-y-3">
                {[
                  "Strategy classification & risk tags",
                  "Execution timestamps & duration",
                  "Asset exposure & position sizing",
                  "Blockchain transaction hashes",
                  "Independent confirmation links",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Mock execution record card */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-purple-500/5 blur-xl" />
                <div className="relative rounded-2xl bg-dark-200/80 border border-purple-500/10 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-neon animate-pulse" />
                      <span className="text-xs text-gray-400 font-mono">EXECUTION RECORD</span>
                    </div>
                    <span className="text-[10px] text-gray-600 font-mono">TX-0x8f3a...c2d1</span>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: "Strategy", value: "Moderate — Balanced Growth", color: "#39FF14" },
                      { label: "Direction", value: "LONG — ETH/USDC", color: "#06B6D4" },
                      { label: "Entry", value: "$3,891.55", color: "#fff" },
                      { label: "Leverage", value: "3.0x", color: "#F59E0B" },
                      { label: "Status", value: "Verified On-Chain", color: "#39FF14" },
                    ].map((row, i) => (
                      <motion.div
                        key={row.label}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        className="flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0"
                      >
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{row.label}</span>
                        <span className="text-sm font-mono font-medium" style={{ color: row.color }}>
                          {row.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">Feb 20, 2026 — 14:32:18 UTC</span>
                    <div className="flex items-center gap-1.5 text-purple-400">
                      <ArrowUpRight className="h-3 w-3" />
                      <span className="text-[10px] font-medium">View on Explorer</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ─── Ambassador + Learning (side by side) ─── */}
      <section id="learn" className="py-28 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ambassador */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard hoverColor="#F59E0B" className="h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Award className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Ambassador Program</h3>
                    <p className="text-xs text-gray-500">Ecosystem Leadership</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Recognized contributors who expand the ecosystem responsibly
                  through structured referral and governance pathways.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Subscription discounts",
                    "Early strategy previews",
                    "Governance participation",
                    "Private execution insights",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <CheckCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/ambassador">
                  <Button variant="secondary" className="group">
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>

            {/* Learning */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <GlassCard hoverColor="#8B5CF6" className="h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Research Hub</h3>
                    <p className="text-xs text-gray-500">Market Intelligence</p>
                  </div>
                </div>

                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  Structured educational materials covering market microstructure,
                  risk-adjusted AI execution, and non-custodial frameworks.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Market microstructure",
                    "Risk-adjusted AI execution",
                    "Decentralized liquidity dynamics",
                    "Non-custodial trading frameworks",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5">
                      <BookOpen className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                <Link href="/learn">
                  <Button variant="secondary" className="group">
                    Explore Resources
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider color="multi" />

      {/* ─── Final CTA ─── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <AuroraBackground />
        <FloatingOrbs />

        {/* Background chart */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
          <svg className="absolute bottom-0 w-full h-[50%]" viewBox="0 0 1200 300" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="ctaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(57, 255, 20, 0.15)" />
                <stop offset="100%" stopColor="rgba(57, 255, 20, 0)" />
              </linearGradient>
              <linearGradient id="ctaStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                <stop offset="50%" stopColor="rgba(57, 255, 20, 0.5)" />
                <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,250 C100,240 200,200 300,180 C400,160 450,210 550,170 C650,130 700,160 800,120 C900,80 950,100 1050,60 C1150,20 1200,40 1200,30 L1200,300 L0,300 Z"
              fill="url(#ctaFill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            <motion.path
              d="M0,250 C100,240 200,200 300,180 C400,160 450,210 550,170 C650,130 700,160 800,120 C900,80 950,100 1050,60 C1150,20 1200,40 1200,30"
              stroke="url(#ctaStroke)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <SectionBadge>Get Started</SectionBadge>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-tight">
              Deploy Structured
              <br />
              <span className="text-gradient-multi">AI Execution</span>
            </h2>
            <p className="text-lg text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto">
              Access non-custodial automated trading infrastructure designed for transparency,
              discipline, and structured market participation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="group text-base px-10">
                  Activate ATE
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="secondary" size="lg" className="text-base">
                  Review Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/[0.04] py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-neon" />
                </div>
                <span className="text-xl font-bold text-gradient">EulerX</span>
              </div>
              <p className="text-xs text-gray-600 max-w-sm leading-relaxed">
                Non-custodial AI execution infrastructure within decentralized trading environments.
                All trading involves risk. Past performance is not indicative of future results.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-gray-300 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-700">
              &copy; {new Date().getFullYear()} EulerX &mdash; Digital Asset Execution Infrastructure
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-neon animate-glow-pulse" />
                <span className="text-xs text-gray-600">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
