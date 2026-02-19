"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  Shield,
  BarChart3,
  ArrowRight,
  Wallet,
  Activity,
  Eye,
  TrendingUp,
  CheckCircle,
  Award,
  BookOpen,
  Lock,
  Timer,
  FileText,
} from "lucide-react";
import Button from "@/components/ui/Button";
import GlowCard from "@/components/ui/GlowCard";
import Badge from "@/components/ui/Badge";

/* ── data ─────────────────────────────────────────── */

const architectureLayers = [
  { icon: Wallet, title: "Wallet Authorization Layer", desc: "Secure wallet-signed authentication for every execution command." },
  { icon: Brain, title: "AI Execution Engine", desc: "Multi-model probabilistic analysis powering every trading decision." },
  { icon: TrendingUp, title: "Hyperliquid Trading Rail", desc: "Direct interface with decentralized liquidity venues." },
  { icon: Eye, title: "On-Chain Verification", desc: "Every trade auditable via blockchain transaction hashes." },
  { icon: BarChart3, title: "Performance Analytics", desc: "Real-time PnL, drawdown, and exposure tracking." },
];

const strategyMethods = [
  { icon: Brain, title: "Statistical Inference Modeling", desc: "Probabilistic frameworks for market regime detection." },
  { icon: Activity, title: "Volatility Clustering Analytics", desc: "Adaptive models that respond to shifting volatility regimes." },
  { icon: Timer, title: "Execution Timing Optimization", desc: "Precision entry and exit calibrated to liquidity conditions." },
  { icon: Shield, title: "Capital Exposure Constraints", desc: "Hard limits on drawdown, leverage, and position sizing." },
];

const pricingTiers = [
  {
    name: "ATE Core",
    price: 100,
    desc: "Foundational execution environments for disciplined participants entering structured AI deployment.",
    featured: false,
  },
  {
    name: "ATE Pro",
    price: 250,
    desc: "Advanced strategy frameworks and enhanced analytics for active capital allocators.",
    featured: true,
  },
  {
    name: "ATE Prime",
    price: 500,
    desc: "Institutional-grade execution models with priority engine allocation and extended strategy scope.",
    featured: false,
  },
];

const verificationItems = [
  "Strategy classification",
  "Execution timestamps",
  "Asset exposure",
  "Blockchain transaction hashes",
  "Confirmation links",
];

const securityPrinciples = [
  { icon: Lock, title: "Wallet-Signed Authorization", desc: "Every action cryptographically authorized by wallet owner." },
  { icon: Shield, title: "No Custody Layer", desc: "Funds never leave your wallet. Zero counterparty risk." },
  { icon: Lock, title: "Encrypted Authentication", desc: "JWT-based sessions with encrypted transport." },
  { icon: Timer, title: "Rate-Limited Execution", desc: "Throttled API access to prevent abuse and overexposure." },
  { icon: FileText, title: "Transparent Transaction Logging", desc: "Full audit trail of every execution cycle." },
];

const audienceProfiles = [
  "High-net-worth digital asset traders",
  "Quantitative market participants",
  "Capital allocators exploring AI execution",
  "Web3-native liquidity operators",
  "Infrastructure-aligned strategists",
];

const ambassadorBenefits = [
  "Subscription discounts",
  "Early strategy previews",
  "Governance participation (future phase)",
  "Private execution insights",
];

const learningTopics = [
  "Market microstructure in digital assets",
  "Risk-adjusted AI execution principles",
  "Decentralized liquidity dynamics",
  "Non-custodial trading frameworks",
];

const footerLinks = [
  { label: "Documentation", href: "/learn" },
  { label: "Terms of Use", href: "#" },
  { label: "Risk Disclosure", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Acceptable Use Policy", href: "#" },
  { label: "Support", href: "/support" },
];

const tickerItems = [
  "BTC/USD $67,432.18 +2.41%",
  "ETH/USD $3,891.55 +1.87%",
  "SOL/USD $178.24 +4.12%",
  "AVAX/USD $42.18 -0.53%",
  "ARB/USD $1.82 +3.27%",
  "OP/USD $3.14 +1.95%",
  "LINK/USD $18.67 +2.08%",
  "MATIC/USD $0.92 -1.14%",
  "DOT/USD $8.43 +0.76%",
  "NEAR/USD $7.91 +5.32%",
];

/* ── animation helpers ────────────────────────────── */

const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } };
const fadeInView = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

/* ── animated background components ───────────────── */

const chartPath = "M0,350 C60,345 100,340 150,280 C200,220 220,310 280,300 C340,290 360,200 400,180 C440,160 470,230 520,200 C570,170 600,130 660,140 C720,150 740,100 800,80 C860,60 890,130 940,100 C990,70 1040,50 1100,60 C1160,70 1180,30 1200,20";
const chartAreaPath = chartPath + " L1200,400 L0,400 Z";

function HeroChart() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 w-full h-[70%] opacity-30"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="heroChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(57, 255, 20, 0.2)" />
            <stop offset="100%" stopColor="rgba(57, 255, 20, 0)" />
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
          d={chartAreaPath}
          fill="url(#heroChartFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
        <motion.path
          d={chartPath}
          stroke="rgba(57, 255, 20, 0.5)"
          strokeWidth="2"
          filter="url(#chartGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        {/* Animated price dot at end of line */}
        <motion.circle
          cx="1200"
          cy="20"
          r="4"
          fill="#39FF14"
          filter="url(#chartGlow)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1], scale: [0, 1.2, 1] }}
          transition={{ duration: 0.5, delay: 3 }}
        />
      </svg>
    </div>
  );
}

function FloatingParticles({ count = 12 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    x: (i * 37 + 13) % 95 + 2,
    y: (i * 53 + 7) % 90 + 5,
    size: (i % 3) + 1.5,
    duration: 6 + (i % 5) * 2,
    delay: (i * 0.7) % 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-neon"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [-15, 15, -15],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function DataTicker() {
  const doubled = [...tickerItems, ...tickerItems];
  return (
    <div className="overflow-hidden border-t border-b border-white/5 bg-dark/60 backdrop-blur-sm">
      <div className="animate-ticker flex gap-12 whitespace-nowrap py-3 px-4">
        {doubled.map((item, i) => {
          const isPositive = item.includes("+");
          return (
            <span key={i} className="text-xs font-mono flex items-center gap-2">
              <span className="text-gray-500">{item.split(" ")[0]}</span>
              <span className="text-gray-400">{item.split(" ")[1]}</span>
              <span className={isPositive ? "text-neon" : "text-red-400"}>{item.split(" ")[2]}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function CandlestickChart() {
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
      <svg
        className="w-full max-w-3xl h-[50%] opacity-10"
        viewBox="0 0 780 300"
        fill="none"
      >
        {candles.map((c, i) => {
          const bodyTop = Math.min(c.open, c.close);
          const bodyHeight = Math.abs(c.close - c.open);
          const color = c.green ? "rgba(57, 255, 20, 0.8)" : "rgba(239, 68, 68, 0.6)";
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {/* Wick */}
              <line
                x1={c.x}
                y1={c.high}
                x2={c.x}
                y2={c.low}
                stroke={color}
                strokeWidth="1.5"
              />
              {/* Body */}
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

function GridPulse() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(57, 255, 20, 0.08) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function DataStreamLines() {
  const lines = Array.from({ length: 6 }, (_, i) => ({
    x: 15 + i * 16,
    delay: i * 0.8,
    duration: 3 + (i % 3),
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      {lines.map((l, i) => (
        <motion.div
          key={i}
          className="absolute w-px bg-gradient-to-b from-transparent via-neon to-transparent"
          style={{ left: `${l.x}%`, height: "100%" }}
          animate={{
            y: ["-100%", "100%"],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function MiniSparklines() {
  const sparklines = [
    { path: "M0,20 L10,18 L20,22 L30,15 L40,12 L50,16 L60,8 L70,10 L80,5", x: "10%", y: "15%", delay: 0 },
    { path: "M0,10 L10,14 L20,8 L30,12 L40,18 L50,14 L60,20 L70,16 L80,22", x: "75%", y: "25%", delay: 1 },
    { path: "M0,15 L10,10 L20,18 L30,8 L40,14 L50,6 L60,12 L70,4 L80,8", x: "85%", y: "60%", delay: 2 },
    { path: "M0,22 L10,16 L20,20 L30,12 L40,18 L50,10 L60,14 L70,6 L80,10", x: "5%", y: "70%", delay: 0.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparklines.map((s, i) => (
        <motion.svg
          key={i}
          className="absolute opacity-20"
          style={{ left: s.x, top: s.y }}
          width="80"
          height="30"
          viewBox="0 0 80 25"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: s.delay, duration: 1 }}
        >
          <motion.path
            d={s.path}
            stroke="#39FF14"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: s.delay, ease: "easeInOut" }}
          />
        </motion.svg>
      ))}
    </div>
  );
}

/* ── section heading component ────────────────────── */

function SectionHeading({ badge, title, subtitle }: { badge?: string; title: string; subtitle?: string }) {
  return (
    <motion.div {...fadeInView} transition={{ duration: 0.6 }} className="text-center mb-16 relative z-10">
      {badge && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon/10 border border-neon/20 mb-6">
          <div className="h-1.5 w-1.5 rounded-full bg-neon animate-glow-pulse" />
          <span className="text-xs font-medium text-neon uppercase tracking-wider">{badge}</span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

/* ── page ──────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ───── Navbar ───── */}
      <nav className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-neon/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-neon" />
            </div>
            <span className="text-xl font-bold text-gradient">EulerX</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#architecture" className="text-sm text-gray-400 hover:text-white transition-colors">Architecture</a>
            <a href="#ate" className="text-sm text-gray-400 hover:text-white transition-colors">ATE</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</a>
            <a href="#learn" className="text-sm text-gray-400 hover:text-white transition-colors">Learn</a>
          </div>
          <Link href="/register">
            <Button size="sm">Access ATE</Button>
          </Link>
        </div>
      </nav>

      {/* ───── Hero ───── */}
      <section className="relative pt-32 pb-8 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
        <HeroChart />
        <FloatingParticles count={14} />
        <MiniSparklines />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon/10 border border-neon/20 mb-8">
              <div className="h-1.5 w-1.5 rounded-full bg-neon animate-glow-pulse" />
              <span className="text-xs font-medium text-neon uppercase tracking-wider">Institutional-Grade Infrastructure</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Institutional-Grade AI</span>
              <br />
              <span className="text-gradient">Execution Infrastructure</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Non-custodial automated trading infrastructure designed for capital-aligned participants
              operating within decentralized markets. Deploy algorithmic execution strategies directly
              from your wallet.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <Badge variant="neon">Full Custody</Badge>
              <Badge variant="neon">On-Chain Verified</Badge>
              <Badge variant="neon">Algorithmic Execution</Badge>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-16"
          >
            <Link href="/register">
              <Button size="lg" className="group">
                Access ATE
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#architecture">
              <Button variant="secondary" size="lg">
                View Architecture
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ───── Ticker ───── */}
      <DataTicker />

      {/* ───── Positioning Statement ───── */}
      <section className="py-24 px-6 relative">
        <DataStreamLines />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div {...fadeInView} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              Built for Capital Discipline
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-3xl">
              EulerX is engineered for participants who value structure, transparency,
              and risk-managed execution.
            </p>
          </motion.div>

          <motion.div
            {...fadeInView}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-3 mb-10"
          >
            <p className="text-gray-600 line-through decoration-gray-700">This is not a brokerage.</p>
            <p className="text-gray-600 line-through decoration-gray-700">This is not a custodial fund.</p>
            <p className="text-gray-600 line-through decoration-gray-700">This is not speculative automation.</p>
          </motion.div>

          <motion.div {...fadeInView} transition={{ delay: 0.4, duration: 0.6 }}>
            <p className="text-2xl md:text-3xl font-bold text-neon mb-6">
              EulerX is infrastructure.
            </p>
            <p className="text-gray-400 leading-relaxed max-w-3xl">
              AI-driven execution layered on decentralized trading rails with real-time verification
              and capital sovereignty. Designed for participants who understand capital preservation
              before capital appreciation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───── Architecture ───── */}
      <section id="architecture" className="py-24 px-6 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
        <GridPulse />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeading
            badge="Architecture"
            title="Non-Custodial by Design"
            subtitle="EulerX operates on a wallet-authorized execution model. Capital remains within user-controlled wallets at all times."
          />

          <div className="max-w-2xl mx-auto space-y-4">
            {architectureLayers.map((layer, i) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <GlowCard>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-neon/10 flex items-center justify-center">
                      <layer.icon className="h-6 w-6 text-neon" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold">{layer.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{layer.desc}</p>
                    </div>
                    <span className="hidden sm:block text-xs text-gray-600 font-mono">LAYER {String(i + 1).padStart(2, "0")}</span>
                  </div>
                </GlowCard>
                {i < architectureLayers.length - 1 && (
                  <div className="flex justify-center py-1">
                    <motion.div
                      className="w-px h-4 bg-neon/30"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 + 0.3, duration: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeInView}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-center text-gray-500 mt-12 text-sm tracking-wide uppercase"
          >
            Transparency is structural, not cosmetic.
          </motion.p>
        </div>
      </section>

      {/* ───── ATE ───── */}
      <section id="ate" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
        <CandlestickChart />
        <FloatingParticles count={8} />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeading
            badge="Execution Engine"
            title="Automated Trading Engine"
            subtitle="The ATE executes probabilistic and liquidity-aware strategies calibrated for digital asset volatility environments."
          />

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {strategyMethods.map((method, i) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <GlowCard className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-neon/10 flex items-center justify-center">
                      <method.icon className="h-5 w-5 text-neon" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{method.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{method.desc}</p>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeInView} transition={{ duration: 0.5 }} className="text-center">
            <p className="text-sm text-gray-500 mb-4 uppercase tracking-wide">Every execution is</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {["Strategy-tagged", "Time-stamped", "Blockchain-verifiable", "Performance-logged"].map((label) => (
                <Badge key={label} variant="success">{label}</Badge>
              ))}
            </div>
            <p className="text-gray-500 mt-8 text-sm tracking-wide uppercase">
              Structured execution for structured capital.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ───── Pricing ───── */}
      <section id="pricing" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
        <GridPulse />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeading
            badge="Access Tiers"
            title="Access Tiers"
            subtitle="Access calibrated to capital scale."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
              >
                <GlowCard
                  className={`h-full flex flex-col ${tier.featured ? "!border-neon/30 shadow-neon-sm" : ""}`}
                  glowColor={tier.featured ? "rgba(57, 255, 20, 0.25)" : undefined}
                >
                  {tier.featured && (
                    <Badge variant="neon" className="self-start mb-4">Most Popular</Badge>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold text-gradient">${tier.price}</span>
                    <span className="text-gray-500 text-sm">/ month</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-6">{tier.desc}</p>
                  <Link href="/register" className="block">
                    <Button
                      variant={tier.featured ? "primary" : "secondary"}
                      className="w-full group"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Execution Transparency ───── */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeading
            badge="Transparency"
            title="Verifiable Execution"
            subtitle="Every deployment cycle produces auditable records."
          />

          <motion.div {...fadeInView} transition={{ duration: 0.5 }} className="max-w-lg mx-auto">
            <GlowCard>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">Users can monitor</p>
              <div className="space-y-3">
                {verificationItems.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-neon flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </GlowCard>
          </motion.div>

          <motion.div {...fadeInView} transition={{ delay: 0.3, duration: 0.5 }} className="text-center mt-12 space-y-2">
            <p className="text-gray-500">EulerX does not obscure execution. <span className="text-white">It exposes it.</span></p>
            <p className="text-sm text-gray-600 uppercase tracking-wide">Trust is earned through verifiability.</p>
          </motion.div>
        </div>
      </section>

      {/* ───── Security & Capital Control ───── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
        <DataStreamLines />

        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeading
            badge="Security"
            title="Capital Sovereignty"
            subtitle="EulerX does not hold, pool, or manage user funds. Users retain full wallet control."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {securityPrinciples.map((principle, i) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <GlowCard className="h-full">
                  <principle.icon className="h-5 w-5 text-neon mb-3" />
                  <h3 className="text-white font-semibold text-sm mb-1">{principle.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{principle.desc}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>

          <motion.p
            {...fadeInView}
            transition={{ duration: 0.5 }}
            className="text-center text-lg text-gray-400"
          >
            Capital remains where it belongs &mdash; <span className="text-neon font-semibold">with the owner.</span>
          </motion.p>
        </div>
      </section>

      {/* ───── Who It's For ───── */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />

        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeading
            badge="Audience"
            title="Engineered for Professionals"
          />

          <motion.div
            {...fadeInView}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {audienceProfiles.map((profile) => (
              <div
                key={profile}
                className="px-5 py-2.5 rounded-full bg-dark-200/80 border border-white/5 text-sm text-gray-300 hover:border-neon/20 hover:text-white transition-colors"
              >
                {profile}
              </div>
            ))}
          </motion.div>

          <motion.p
            {...fadeInView}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center text-gray-600 mt-8 text-sm uppercase tracking-wide"
          >
            Capital-aligned execution environments.
          </motion.p>
        </div>
      </section>

      {/* ───── Ecosystem Leadership ───── */}
      <section className="py-24 px-6 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInView} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 mb-6">
                <Award className="h-3.5 w-3.5 text-neon" />
                <span className="text-xs font-medium text-neon uppercase tracking-wider">Ambassador Program</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Ecosystem Leadership</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                EulerX recognizes contributors who expand the ecosystem responsibly.
              </p>
              <Link href="/ambassador">
                <Button variant="secondary" className="group">
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <motion.div {...fadeInView} transition={{ delay: 0.2, duration: 0.6 }}>
              <GlowCard>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">Ambassador Benefits</p>
                <div className="space-y-3">
                  {ambassadorBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-neon flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-4 uppercase tracking-wide">Participation over promotion.</p>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Learning Hub ───── */}
      <section id="learn" className="py-24 px-6 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInView} transition={{ delay: 0.1, duration: 0.6 }}>
              <GlowCard>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">Topics Covered</p>
                <div className="space-y-3">
                  {learningTopics.map((topic) => (
                    <div key={topic} className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-neon flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{topic}</span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>

            <motion.div {...fadeInView} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon/10 border border-neon/20 mb-6">
                <BookOpen className="h-3.5 w-3.5 text-neon" />
                <span className="text-xs font-medium text-neon uppercase tracking-wider">Research</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Research & Market Intelligence</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Access structured educational materials covering market microstructure,
                risk-adjusted AI execution, and non-custodial trading frameworks.
              </p>
              <p className="text-neon font-medium mb-6">Informed capital behaves differently.</p>
              <Link href="/learn">
                <Button variant="secondary" className="group">
                  Explore Resources
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───── Final CTA ───── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[150px] pointer-events-none" />
        <FloatingParticles count={10} />

        {/* Mini chart behind CTA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="absolute bottom-0 w-full h-[50%]" viewBox="0 0 1200 300" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="ctaChartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(57, 255, 20, 0.15)" />
                <stop offset="100%" stopColor="rgba(57, 255, 20, 0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0,250 C100,240 200,200 300,180 C400,160 450,210 550,170 C650,130 700,160 800,120 C900,80 950,100 1050,60 C1150,20 1200,40 1200,30 L1200,300 L0,300 Z"
              fill="url(#ctaChartFill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            />
            <motion.path
              d="M0,250 C100,240 200,200 300,180 C400,160 450,210 550,170 C650,130 700,160 800,120 C900,80 950,100 1050,60 C1150,20 1200,40 1200,30"
              stroke="rgba(57, 255, 20, 0.4)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div {...fadeInView} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Deploy Structured AI Execution
            </h2>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Access non-custodial automated trading infrastructure designed for transparency,
              discipline, and long-term market participation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="group">
                  Activate ATE
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button variant="secondary" size="lg">
                  Review Documentation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-neon/20 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-neon" />
                </div>
                <span className="text-lg font-bold text-gradient">EulerX</span>
              </div>
              <p className="text-xs text-gray-600 max-w-sm">
                Non-custodial AI execution infrastructure within decentralized trading environments.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-600">&copy; {new Date().getFullYear()} EulerX &mdash; Digital Asset Execution Infrastructure</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neon animate-glow-pulse" />
              <span className="text-xs text-gray-600">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
