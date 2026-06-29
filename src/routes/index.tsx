import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Download,
  ArrowRight,
  ShieldCheck,
  Check,
  Star,
  Twitter,
  Linkedin,
  Github,
  Zap,
  Apple,
  Smartphone,
  Globe,
  MonitorSmartphone,
  Menu,
  Moon,
  X,
  Search,
  CandlestickChart,
  Bot,
  Wallet,
  GraduationCap,
  LineChart,
  Brain,
  Lightbulb,
  Lock,
  BadgeDollarSign,
  UserCheck,
  AlertTriangle,
  ChevronDown,
  Mail,
  type LucideIcon,
} from "lucide-react";

import { toast } from "sonner";
import { CrescentIcon, PkBadge } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import logo from "@/assets/logo.png";
import { TICKER_ITEMS, STOCKS } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Reveal,
  RevealItem,
  RevealGroup,
  fadeUp,
  staggerParent,
  perspectiveCard,
  Magnetic,
  SPRING,
  SPRING_UI,
  SPRING_SOFT,
  CountUp,
} from "@/components/animations";

import { Tilt3D } from "@/components/Tilt3D";
import { Particles } from "@/components/Particles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NafaIQ — PSX, Finance & AI in One Terminal" },
      {
        name: "description",
        content:
          "Track markets, manage money, and get AI insights — built around Pakistan's financial reality. Install free as a web app on iOS, Android & desktop.",
      },
      { property: "og:title", content: "NafaIQ — PSX, Finance & AI in One Terminal" },
      {
        property: "og:description",
        content:
          "Track markets, manage money, and get AI insights — built around Pakistan's financial reality.",
      },
    ],
  }),
  component: Landing,
});

/* ---------- store / download buttons ---------- */
function AppleGlyph() {
  return (
    <svg viewBox="0 0 384 512" height={28} className="shrink-0 fill-white" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM255.8 84.4c30.6-36.3 27.8-69.4 26.9-81.3-26.9 1.6-58 18.4-75.7 39.1-19.5 22.2-31 49.7-28.5 80.5 29.1 2.2 55.6-12.7 77.3-38.3z" />
    </svg>
  );
}

function GooglePlayGlyph() {
  return (
    <svg viewBox="0 0 512 512" height={28} className="shrink-0" aria-hidden>
      <path
        d="M48 27.3c-3 3.2-4.8 8.2-4.8 14.7v428c0 6.5 1.8 11.5 4.8 14.7l1.4 1.4L289 261.7v-5.5L49.4 25.9 48 27.3z"
        fill="#00d4aa"
      />
      <path
        d="M368.8 341.6l-79.8-79.9v-5.5l79.9-79.9 1.8 1L465 232c27 15.3 27 40.4 0 55.8l-94.4 53.6-1.8.2z"
        fill="#f59e0b"
      />
      <path
        d="M370.6 340.6L289 259 48 500c8.9 9.4 23.6 10.6 40.1 1.2l282.5-160.6z"
        fill="#ff4d4d"
      />
      <path
        d="M370.6 181.4L88.1 20.8C71.6 11.4 56.9 12.6 48 22l241 241 81.6-81.6z"
        fill="#00efc0"
      />
    </svg>
  );
}

function StoreButtons({ center = false }: { center?: boolean }) {
  const [email, setEmail] = useState("");
  function notify(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're on the list — we'll email you when the native app launches.");
    setEmail("");
  }
  return (
    <div className={cn("flex flex-col gap-5", center && "items-center")}>
      {/* PRIMARY — single dominant action */}
      <Magnetic strength={0.45} className={cn(center && "self-center")}>
        <motion.div whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }} transition={SPRING_UI}>
          <Link
            to="/app"
            className="inline-flex w-auto items-center gap-2 rounded-[12px] bg-gradient-to-br from-[#00d4aa] to-[#00a88a] px-5 py-2.5 text-bull-foreground shadow-[0_6px_24px_rgba(0,212,170,0.3)] transition hover:shadow-[0_10px_36px_rgba(0,212,170,0.5)]"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span className="text-sm font-semibold">Install as Web App — Free</span>
          </Link>
        </motion.div>
      </Magnetic>

      {/* SECONDARY — coming-soon stores, visually de-emphasized */}
      <div className={cn("flex flex-col items-start gap-2.5", center && "items-center")}>
        <div className={cn("flex flex-wrap gap-2", center && "justify-center")}>
          <div className="flex items-center gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-left opacity-55 grayscale">
            <AppleGlyph />
            <span className="flex flex-col leading-tight">
              <span className="text-[9px] uppercase tracking-wide text-white/50">Coming soon</span>
              <span className="text-xs font-medium text-white/80">App Store</span>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-left opacity-55 grayscale">
            <GooglePlayGlyph />
            <span className="flex flex-col leading-tight">
              <span className="text-[9px] uppercase tracking-wide text-white/50">Coming soon</span>
              <span className="text-xs font-medium text-white/80">Google Play</span>
            </span>
          </div>
        </div>

        {/* TERTIARY — quiet email capture for native launch */}
        <form onSubmit={notify} className={cn("w-full max-w-xs", center && "mx-auto")}>
          <div className="flex gap-1.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email me at launch"
              aria-label="Email for native app launch notification"
              className="h-8 flex-1 rounded-[8px] border border-white/[0.08] bg-transparent px-2.5 font-mono text-xs text-text-secondary outline-none transition-colors placeholder:text-text-muted focus:border-white/20"
            />
            <button
              type="submit"
              className="h-8 shrink-0 rounded-[8px] border border-white/[0.08] px-3 text-xs font-medium text-text-secondary transition hover:border-white/20 hover:text-text-primary"
            >
              Notify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- seamless scrolling ticker ---------- */
function TickerStrip() {
  // duplicate once so translateX(-50%) restarts at an invisible seam
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative z-10 overflow-hidden border-y border-border bg-surface py-3">
      {/* edge fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent" />
      <div className="flex w-max animate-[ticker_40s_linear_infinite] gap-8 whitespace-nowrap px-4 will-change-transform">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-2 text-sm">
            <span className="font-medium text-text-secondary">{it.label}</span>
            <span className="font-mono tabular-nums text-text-primary">{it.value}</span>
            <span className={cn("font-mono tabular-nums", it.pct >= 0 ? "text-bull" : "text-bear")}>
              {it.pct >= 0 ? "▲+" : "▼"}
              {it.pct.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- 3D phone with mouse tilt + float ---------- */
function PhoneMockup({ startDelay = 0 }: { startDelay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-26, -8]), SPRING);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [-2, 10]), SPRING);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function reset() {
    px.set(0);
    py.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="group/phone relative mx-auto w-[260px] [perspective:1200px] sm:w-[280px]"
    >
      {/* KSE-100 floating card — staggered entrance + float loop */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SOFT, delay: startDelay + 0.15 }}
        className="absolute -top-8 -left-10 z-20"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[12px] border border-bull/25 bg-surface/85 px-3.5 py-2.5 backdrop-blur-md"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bull" />
            <span className="text-[9px] font-bold tracking-widest text-bull">LIVE</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px]">
            <span className="font-bold text-text-primary">KSE-100</span>
            <span className="font-mono text-text-primary">78,542</span>
            <span className="font-mono text-bull">+1.24% ▲</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Real Wealth floating card — staggered entrance + float loop */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SOFT, delay: startDelay + 0.3 }}
        className="absolute -bottom-8 -right-8 z-20"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 9, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          className="rounded-[12px] border border-bull/30 bg-surface/85 px-3.5 py-2.5 backdrop-blur-md"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-bull">
            <ShieldCheck className="h-3 w-3" /> Real Wealth
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-sm font-bold text-text-primary">$15,395</span>
            <span className="text-[9px] text-text-muted">USD value</span>
          </div>
        </motion.div>
      </motion.div>

      {/* phone frame — entrance fade-and-rise */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_SOFT, delay: startDelay }}
        style={{ rotateY: ry, rotateX: rx, transformStyle: "preserve-3d" }}
        className="relative will-change-transform"
      >
        <span
          className="absolute -bottom-8 left-[10%] -z-10 h-1/2 w-4/5 rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(0,212,170,0.25), transparent 70%)",
            filter: "blur(30px)",
          }}
        />
        <div
          className="rounded-[44px] border border-white/12 p-0"
          style={{
            background: "linear-gradient(145deg, #1a1f35 0%, #0d1121 100%)",
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.05), 0 30px 60px rgba(0,0,0,0.6), 0 0 80px rgba(0,212,170,0.15), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        >
          <div className="m-2 overflow-hidden rounded-[36px] bg-[#070B14]">
            <div className="space-y-2.5 p-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-text-primary">
                  Nafa<span className="text-primary">IQ</span>
                </span>
                <span className="h-5 w-5 rounded-full bg-bull/20" />
              </div>
              <div className="rounded-[8px] border border-l-2 border-l-ai border-border bg-ai-tint p-2">
                <div className="text-[8px] font-semibold text-text-primary">Today's AI Insight</div>
                <div className="mt-1 h-1 w-full rounded bg-elevated" />
                <div className="mt-1 h-1 w-2/3 rounded bg-elevated" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Net Worth", "4.28M"],
                  ["Portfolio", "858K"],
                ].map(([l, v]) => (
                  <div key={l} className="rounded-[8px] border border-border bg-surface p-2">
                    <div className="text-[7px] text-text-muted">{l}</div>
                    <div className="font-mono text-sm font-bold text-bull">{v}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-[8px] border border-border bg-surface p-2">
                <div className="text-[8px] text-text-muted">KSE-100</div>
                <div className="font-mono text-base font-bold text-text-primary">78,542.10</div>
                <div className="mt-1.5 flex h-12 items-end gap-1">
                  {[40, 55, 35, 70, 50, 80, 65, 90, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-bull/70"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const FEATURES: {
  Icon: LucideIcon | typeof CrescentIcon;
  iconColor: string;
  chipBg: string;
  title: string;
  desc: string;
  badge?: string;
}[] = [
  {
    Icon: CandlestickChart,
    iconColor: "text-bull",
    chipBg: "rgba(0,212,170,0.15)",
    title: "PSX Trading Terminal",
    desc: "Candlestick charts, heatmaps, top movers, AI signals — the first Bloomberg-grade PSX terminal on your phone.",
  },
  {
    Icon: ShieldCheck,
    iconColor: "text-warning",
    chipBg: "rgba(245,158,11,0.15)",
    title: "Haqeeqi Daulat™ Engine",
    desc: "See your REAL wealth after PKR devaluation. Pakistan's first devaluation-adjusted portfolio intelligence.",
    badge: "World First",
  },
  {
    Icon: Bot,
    iconColor: "text-ai",
    chipBg: "rgba(59,130,246,0.15)",
    title: "AI Financial Advisor",
    desc: "Personalized insights, AI-generated portfolio reports, and a 24/7 finance tutor — powered by Claude AI.",
  },
  {
    Icon: Moon,
    iconColor: "text-bull",
    chipBg: "rgba(16,185,129,0.15)",
    title: "Built for Muslim Investors",
    desc: "Halal stock screening, Zakat calculator, Islamic savings goals — finance aligned with your values.",
  },
  {
    Icon: Wallet,
    iconColor: "text-ai",
    chipBg: "rgba(59,130,246,0.15)",
    title: "Complete Finance Manager",
    desc: "Track income, expenses, budgets, bills, and goals — all in one place, in Pakistani Rupees.",
  },
  {
    Icon: GraduationCap,
    iconColor: "text-warning",
    chipBg: "rgba(249,115,22,0.15)",
    title: "Financial Education",
    desc: "Beginner to advanced courses in Urdu and English. Earn XP. Build real investing knowledge.",
  },
];

const TESTIMONIALS = [
  {
    initials: "AK",
    color: "bg-bull/20 text-bull",
    name: "Ahmed Khan, Karachi",
    role: "PSX investor since 2018",
    quote:
      "Finally an app that shows me my REAL returns, not just the nominal PSX number. The Haqeeqi Daulat feature opened my eyes.",
  },
  {
    initials: "SF",
    color: "bg-ai/20 text-ai",
    name: "Sara Farooq, Lahore",
    role: "New to investing",
    quote:
      "The Learn Hub and AI tutor helped me understand PSX from scratch. The Urdu glossary is brilliant.",
  },
  {
    initials: "MR",
    color: "bg-warning/20 text-warning",
    name: "Muhammad Raza, Islamabad",
    role: "Finance professional",
    quote:
      "The sector heatmap and AI signals are at a level I've only seen on Bloomberg Terminal. Remarkable for a Pakistani app.",
  },
] as const;

function StatsStrip() {
  const stats = [
    ["Public Beta", "Live now — free to use"],
    ["Real-Time", "PSX & KSE-100 data"],
    ["Halal-Ready", "Shariah screening built in"],
  ];
  return (
    <div className="grid grid-cols-1 divide-y divide-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {stats.map(([v, l]) => (
        <div key={l} className="px-4 py-4 text-center">
          <div className="font-display text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {v}
          </div>
          <div className="mx-auto mt-2 h-0.5 w-8 rounded-full bg-gold/70" />
          <div className="mt-2 text-sm text-text-secondary">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- trust / recognition strip (honest, no fabricated logos) ---------- */
const TRUST_MARKERS: { Icon: LucideIcon; label: string; sub: string }[] = [
  { Icon: LineChart, label: "Live PSX & KSE-100", sub: "Real market data" },
  {
    Icon: CrescentIcon as unknown as LucideIcon,
    label: "Shariah Screening",
    sub: "Halal by design",
  },
  { Icon: Lock, label: "Encrypted", sub: "In transit & at rest" },
  { Icon: UserCheck, label: "No Account Needed", sub: "Explore free first" },
];

function TrustStrip() {
  return (
    <section className="border-b border-border bg-surface/40">
      <div className="mx-auto max-w-[1200px] px-6 py-6">
        <Reveal className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
            Built on real foundations
          </p>
        </Reveal>
        <RevealGroup amount={0.4} className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {TRUST_MARKERS.map((m) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              className="flex items-center justify-center gap-3 rounded-[12px] border border-white/[0.06] bg-white/[0.02] px-4 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-bull/10 text-bull">
                <m.Icon size={18} strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-text-primary">
                  {m.label}
                </span>
                <span className="block truncate text-xs text-text-muted">{m.sub}</span>
              </span>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

const NAV_LINKS = [
  { label: "Features", href: "#features", to: undefined },
  { label: "About", href: "#about", to: undefined },
  { label: "Pricing", href: undefined, to: "/plans" },
  { label: "Contact", href: "#contact", to: undefined },
] as const;

function usePsxOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const check = () => {
      // PSX trades Mon–Fri, ~09:30–15:30 PKT (UTC+5)
      const now = new Date();
      const pkt = new Date(now.getTime() + (now.getTimezoneOffset() + 300) * 60000);
      const day = pkt.getDay();
      const mins = pkt.getHours() * 60 + pkt.getMinutes();
      setOpen(day >= 1 && day <= 5 && mins >= 570 && mins <= 930);
    };
    check();
    const id = setInterval(check, 60000);
    return () => clearInterval(id);
  }, []);
  return open;
}

function StatusPill() {
  const open = usePsxOpen();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        open ? "border-bull/25 bg-bull/10 text-bull" : "border-bear/25 bg-bear/10 text-bear",
      )}
    >
      <span className={cn("relative flex h-1.5 w-1.5")}>
        {open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-bull opacity-75" />
        )}
        <span
          className={cn(
            "relative inline-flex h-1.5 w-1.5 rounded-full",
            open ? "bg-bull" : "bg-bear",
          )}
        />
      </span>
      PSX {open ? "Open" : "Closed"}
    </span>
  );
}

function NavSearch() {
  const [active, setActive] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setActive(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const term = q.trim().toUpperCase();
  const matches = term
    ? Object.values(STOCKS)
        .filter((s) => s.ticker.includes(term) || s.name.toUpperCase().includes(term))
        .slice(0, 5)
    : [];
  function go(ticker: string) {
    setActive(false);
    setQ("");
    navigate({ to: "/stock/$ticker", params: { ticker } });
  }
  return (
    <div ref={ref} className="relative shrink-0">
      {active ? (
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && matches[0]) go(matches[0].ticker);
            if (e.key === "Escape") setActive(false);
          }}
          placeholder="Search ticker…"
          aria-label="Search stock ticker"
          className="h-8 w-44 rounded-full border border-white/[0.12] bg-surface px-3 text-[13px] text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-bull"
        />
      ) : (
        <button
          onClick={() => setActive(true)}
          aria-label="Search stocks"
          className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary"
        >
          <Search className="h-4 w-4" />
        </button>
      )}
      {active && matches.length > 0 && (
        <div className="absolute right-0 top-10 z-50 w-60 overflow-hidden rounded-[12px] border border-white/[0.1] bg-background/95 shadow-2xl backdrop-blur-xl">
          {matches.map((s) => (
            <button
              key={s.ticker}
              onClick={() => go(s.ticker)}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.05]"
            >
              <span className="min-w-0">
                <span className="text-[13px] font-semibold text-text-primary">{s.ticker}</span>
                <span className="block truncate text-[11px] text-text-muted">{s.name}</span>
              </span>
              <span className="shrink-0 text-right">
                <span className="block font-mono text-[13px] tabular-nums text-text-primary">
                  {s.price.toLocaleString()}
                </span>
                <span
                  className={cn(
                    "block font-mono text-[11px] tabular-nums",
                    s.changePct >= 0 ? "text-bull" : "text-bear",
                  )}
                >
                  {s.changePct >= 0 ? "+" : ""}
                  {s.changePct.toFixed(2)}%
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LangToggle({ className }: { className?: string }) {
  const [lang, setLang] = useState<"EN" | "UR">("EN");
  return (
    <button
      onClick={() => setLang((l) => (l === "EN" ? "UR" : "EN"))}
      aria-label="Toggle language"
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[12px] font-medium leading-none text-text-secondary transition-colors hover:text-text-primary",
        className,
      )}
    >
      <span className={cn(lang === "EN" && "text-text-primary")}>EN</span>
      <span className="mx-1 text-text-muted">/</span>
      <span
        className={cn(
          "inline-block pe-1 font-urdu leading-none",
          lang === "UR" && "text-text-primary",
        )}
      >
        اردو
      </span>
    </button>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 25);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 sm:pt-4">
      <div
        className={cn(
          "flex h-14 items-center gap-3 rounded-full border px-3 transition-all duration-300 sm:gap-4 sm:px-4",
          scrolled
            ? "w-full max-w-[760px] border-white/[0.08] bg-[#060d1f] shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150"
            : "w-full max-w-[1120px] border-white/[0.05] bg-[#060d1f]/40 backdrop-blur-md",
        )}
      >
        {/* logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src={logo}
            alt="NafaIQ"
            width={26}
            height={26}
            className="rounded-[7px] ring-1 ring-bull/30"
          />
          <span className="font-display text-lg font-bold tracking-tight text-text-primary">
            Nafa<span className="text-primary">IQ</span>
          </span>
        </Link>

        {/* primary links — pill-segmented center group */}
        <nav className="mx-auto hidden items-center gap-0.5 rounded-full border border-white/[0.06] bg-white/[0.03] p-1 md:flex">
          {NAV_LINKS.map((l) =>
            l.to ? (
              <Link
                key={l.label}
                to={l.to}
                className="rounded-full px-2.5 py-1.5 text-sm font-medium whitespace-nowrap text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href}
                className="rounded-full px-2.5 py-1.5 text-sm font-medium whitespace-nowrap text-text-secondary transition-colors hover:bg-white/[0.06] hover:text-text-primary"
              >
                {l.label}
              </a>
            ),
          )}
        </nav>

        {/* utility cluster — right */}
        <div className="ml-auto flex items-center gap-2.5 sm:gap-3 md:ml-0">
          <div className="hidden items-center gap-3 lg:flex">
            <StatusPill />
            <NavSearch />
            <LangToggle />
          </div>
          <Link
            to="/auth"
            className="hidden whitespace-nowrap pl-1 text-[13px] font-normal text-text-secondary transition-colors hover:text-text-primary md:inline lg:border-l lg:border-white/[0.08] lg:pl-3"
          >
            Log In
          </Link>

          {/* Enter App — dominant CTA, always visible */}
          <Magnetic strength={0.4}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING_UI}
            >
              <Link
                to="/app"
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-bull px-4 py-2 text-sm font-semibold text-bull-foreground shadow-[0_0_20px_rgba(0,212,170,0.25)] transition hover:bg-[#00efc0] hover:shadow-[0_0_28px_rgba(0,212,170,0.5)]"
              >
                Get Started <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </motion.div>
          </Magnetic>

          {/* hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-text-primary md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* mobile full-screen drawer */}
      {open && (
        <div className="fixed inset-0 top-0 z-40 flex flex-col bg-[#060d1f]/98 px-6 pb-8 pt-24 backdrop-blur-xl md:hidden">
          <div className="mb-6">
            <NavSearch />
          </div>
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((l) =>
              l.to ? (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-[12px] px-4 py-4 text-lg font-medium whitespace-nowrap text-text-primary transition hover:bg-white/[0.05]"
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[12px] px-4 py-4 text-lg font-medium whitespace-nowrap text-text-primary transition hover:bg-white/[0.05]"
                >
                  {l.label}
                </a>
              ),
            )}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="rounded-[12px] px-4 py-4 text-lg font-medium whitespace-nowrap text-text-secondary transition hover:bg-white/[0.05]"
            >
              Log In
            </Link>
            <div className="flex items-center justify-between px-4 py-3">
              <StatusPill />
              <LangToggle className="px-0 text-base" />
            </div>
          </nav>
          <Link
            to="/app"
            onClick={() => setOpen(false)}
            className="mt-auto flex items-center justify-center gap-1 rounded-full bg-bull px-4 py-4 text-base font-semibold text-bull-foreground transition hover:bg-[#00efc0]"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </header>
  );
}

const SCATTERED_TICKERS = [
  { text: "HBL", x: "4%", y: "12%", size: 11, opacity: 0.12, depth: 0.3 },
  { text: "+2.41%", x: "14%", y: "28%", size: 10, opacity: 0.09, depth: 0.6 },
  { text: "ENGRO", x: "22%", y: "8%", size: 12, opacity: 0.1, depth: 0.2 },
  { text: "312.45", x: "32%", y: "22%", size: 10, opacity: 0.07, depth: 0.7 },
  { text: "LUCK", x: "44%", y: "15%", size: 11, opacity: 0.08, depth: 0.4 },
  { text: "-0.45%", x: "55%", y: "32%", size: 10, opacity: 0.09, depth: 0.5 },
  { text: "KSE-100", x: "64%", y: "9%", size: 13, opacity: 0.11, depth: 0.25 },
  { text: "78,542", x: "74%", y: "25%", size: 10, opacity: 0.08, depth: 0.65 },
  { text: "OGDC", x: "84%", y: "14%", size: 11, opacity: 0.1, depth: 0.35 },
  { text: "+1.24%", x: "91%", y: "35%", size: 10, opacity: 0.09, depth: 0.55 },
  { text: "FFC", x: "8%", y: "48%", size: 11, opacity: 0.07, depth: 0.45 },
  { text: "168.70", x: "18%", y: "62%", size: 10, opacity: 0.08, depth: 0.7 },
  { text: "+1.08%", x: "28%", y: "45%", size: 10, opacity: 0.06, depth: 0.5 },
  { text: "UBL", x: "38%", y: "58%", size: 12, opacity: 0.09, depth: 0.3 },
  { text: "198.20", x: "50%", y: "70%", size: 10, opacity: 0.07, depth: 0.6 },
  { text: "MCB", x: "60%", y: "52%", size: 11, opacity: 0.08, depth: 0.4 },
  { text: "-0.38%", x: "70%", y: "68%", size: 10, opacity: 0.06, depth: 0.65 },
  { text: "PSO", x: "80%", y: "55%", size: 11, opacity: 0.09, depth: 0.35 },
  { text: "251.30", x: "88%", y: "72%", size: 10, opacity: 0.07, depth: 0.6 },
  { text: "KSE-30", x: "6%", y: "78%", size: 12, opacity: 0.08, depth: 0.3 },
  { text: "24,180", x: "16%", y: "85%", size: 10, opacity: 0.06, depth: 0.7 },
  { text: "DGKC", x: "35%", y: "82%", size: 11, opacity: 0.07, depth: 0.4 },
  { text: "+0.95%", x: "48%", y: "88%", size: 10, opacity: 0.06, depth: 0.55 },
  { text: "POL", x: "62%", y: "80%", size: 11, opacity: 0.08, depth: 0.35 },
  { text: "412.80", x: "72%", y: "90%", size: 10, opacity: 0.05, depth: 0.7 },
  { text: "LOTCHEM", x: "82%", y: "83%", size: 11, opacity: 0.07, depth: 0.45 },
  { text: "+0.62%", x: "92%", y: "78%", size: 10, opacity: 0.06, depth: 0.55 },
  { text: "145.30", x: "42%", y: "38%", size: 10, opacity: 0.07, depth: 0.5 },
] as const;

function ScatteredTickers({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {SCATTERED_TICKERS.map((t, i) => (
        <ScatteredTicker key={i} t={t} progress={progress} />
      ))}
    </div>
  );
}

function ScatteredTicker({
  t,
  progress,
}: {
  t: (typeof SCATTERED_TICKERS)[number];
  progress: MotionValue<number>;
}) {
  const y = useTransform(progress, [0, 1], [0, -180 * t.depth]);
  const opacity = useTransform(progress, [0, 0.5, 1], [t.opacity, t.opacity * 1.6, 0]);
  return (
    <motion.span
      className="absolute select-none whitespace-nowrap font-mono text-white will-change-transform"
      style={{
        left: t.x,
        top: t.y,
        fontSize: t.size,
        letterSpacing: "0.05em",
        y,
        opacity,
      }}
    >
      {t.text}
    </motion.span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bull">
      {children}
    </span>
  );
}

/* ---------- scroll to discover cue ---------- */
function ScrollCue({ reduce }: { reduce: boolean }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (hidden) return;
    const onScroll = () => {
      if (window.scrollY > 50) setHidden(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden]);
  if (reduce) return null;
  return (
    <div
      className="pointer-events-none absolute bottom-6 left-1/2 z-[2] -translate-x-1/2 transition-opacity duration-300"
      style={{ opacity: hidden ? 0 : 1 }}
      aria-hidden
    >
      <motion.span
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-text-secondary"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5" strokeWidth={1.75} />
      </motion.span>
    </div>
  );
}

/* ---------- hero with mouse-following glows + scroll parallax ---------- */
function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // parallax: gradient shifts as user scrolls (0.3x)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // mouse following glows with spring physics
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const g1x = useSpring(useTransform(mx, [0, 1], ["10%", "60%"]), SPRING);
  const g1y = useSpring(useTransform(my, [0, 1], ["0%", "40%"]), SPRING);
  const g2x = useSpring(useTransform(mx, [0, 1], ["70%", "30%"]), SPRING);
  const g2y = useSpring(useTransform(my, [0, 1], ["50%", "10%"]), SPRING);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <section ref={ref} onMouseMove={onMove} className="relative overflow-hidden">
      {/* parallax base gradient */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          y: reduce ? 0 : bgY,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(8,55,55,0.92) 0%, #0F1528 60%)",
        }}
      />

      {/* mouse-following glows */}
      <motion.span
        className="pointer-events-none absolute z-0 h-[480px] w-[480px] rounded-full"
        style={{
          left: g1x,
          top: g1y,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, rgba(0,212,170,0.18) 0%, transparent 70%)",
        }}
      />
      <motion.span
        className="pointer-events-none absolute z-0 h-[420px] w-[420px] rounded-full"
        style={{
          left: g2x,
          top: g2y,
          x: "-50%",
          y: "-50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.14) 0%, transparent 70%)",
        }}
      />

      <ScatteredTickers progress={scrollYProgress} />
      <Particles count={26} />

      {/* depth orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <span
          className="absolute"
          style={{
            width: 600,
            height: 600,
            top: -100,
            left: -100,
            background: "radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)",
            animation: "float1 8s ease-in-out infinite alternate",
          }}
        />
        <span
          className="absolute"
          style={{
            width: 500,
            height: 500,
            top: 200,
            right: -50,
            background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
            animation: "float2 10s ease-in-out infinite alternate",
          }}
        />
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: 400,
            height: 400,
            bottom: -80,
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            animation: "float3 12s ease-in-out infinite alternate",
          }}
        />
      </div>

      <motion.div
        style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : contentOpacity }}
        className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 px-6 pt-28 pb-16 lg:grid-cols-5 lg:pt-36 lg:pb-24"
      >
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="lg:col-span-3"
        >
          <Reveal as="span">
            <span
              className="inline-flex items-center gap-2 rounded-full text-bull"
              style={{
                border: "1px solid rgba(0,212,170,0.3)",
                background: "rgba(0,212,170,0.06)",
                padding: "6px 16px",
                fontSize: 12,
                letterSpacing: "0.08em",
              }}
            >
              <PkBadge /> Built for the Pakistani Investor
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display mt-6 text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[68px]">
              PSX. Finance. AI.
              <br />
              <span className="text-bull" style={{ textShadow: "0 0 60px rgba(0,212,170,0.3)" }}>
                One Terminal.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[480px] text-base text-text-secondary sm:text-lg">
              Track markets, manage money, and get AI insights — built around Pakistan's financial
              reality.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-8">
              <StoreButtons />
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-bull" strokeWidth={1.5} /> No account required to
                explore
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-bull" strokeWidth={1.5} /> Works on iOS, Android
                &amp; Desktop
              </span>
            </p>
          </Reveal>
        </motion.div>
        <div className="lg:col-span-2">
          <PhoneMockup startDelay={0.35} />
        </div>
      </motion.div>

      {/* scroll to discover cue — fades out once user scrolls */}
      <ScrollCue reduce={!!reduce} />

      {/* bottom fade mask */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-[200px]"
        style={{ background: "linear-gradient(to bottom, transparent, #0F1528)" }}
      />
    </section>
  );
}

/* ---------- Haqeeqi Daulat 3D flip card ---------- */
function FlipCard() {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="group/card relative h-[360px] w-full max-w-[340px] [perspective:1400px]"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((f) => !f)}
    >
      <span
        className="absolute -bottom-10 left-1/2 -z-10 h-1/2 w-3/4 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(245,158,11,0.25), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped && !reduce ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : SPRING_UI}
      >
        {/* FRONT — PSX return */}
        <div
          className="absolute inset-0 rounded-[16px] border border-white/10 p-6 [backface-visibility:hidden]"
          style={{
            background: "rgba(17,24,39,0.92)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,212,170,0.08)",
          }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            Haqeeqi Daulat™ — حقیقی دولت
          </div>
          <div className="mt-1 text-sm font-semibold text-text-primary">
            Your Real Wealth Breakdown
          </div>
          <div className="mt-8">
            <div className="text-[11px] text-text-muted">PSX Shows You</div>
            <div className="mt-1 font-mono text-[44px] font-bold leading-none text-bull">
              +12.73%
            </div>
            <div className="mt-2 text-[11px] text-text-secondary">PKR 858,054 portfolio</div>
          </div>
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: "rgba(245,158,11,0.3)" }} />
            <Zap className="h-4 w-4 text-warning" />
            <span className="h-px flex-1" style={{ background: "rgba(245,158,11,0.3)" }} />
          </div>
          <div className="text-[11px] text-text-muted">
            Hover to reveal your <span className="text-warning">real</span> USD return →
          </div>
        </div>

        {/* BACK — USD return */}
        <div
          className="absolute inset-0 rounded-[16px] border border-warning/30 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            background: "rgba(26,17,11,0.95)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(245,158,11,0.12)",
          }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-widest text-warning">
            The Reality — After PKR Decay
          </div>
          <div className="mt-8">
            <div className="text-[11px] text-text-muted">Real USD Return</div>
            <div className="mt-1 font-mono text-[44px] font-bold leading-none text-bear">-3.2%</div>
            <div className="mt-2 text-[11px] text-text-secondary">After 16.2% PKR devaluation</div>
          </div>
          <div
            className="mt-8 rounded-[8px] p-3 text-[12px] text-warning"
            style={{ background: "rgba(245,158,11,0.1)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.5} /> PKR 1,02,722 eroded by
              devaluation this year
            </span>
          </div>
          <div className="mt-4 text-[11px] text-text-muted">Tap to flip back</div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- How NafaIQ Works — 3 steps ---------- */
const STEPS: { step: string; title: string; desc: string }[] = [
  {
    step: "01",
    title: "Track",
    desc: "Connect your portfolio or explore live PSX data instantly, no account required.",
  },
  {
    step: "02",
    title: "Understand",
    desc: "See your real wealth, AI insights, and devaluation-adjusted returns in plain language.",
  },
  {
    step: "03",
    title: "Decide",
    desc: "Act on personalized recommendations for investing, saving, and Zakat — all in one place.",
  },
];

function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-[60px] lg:py-[100px]">
      <Reveal className="text-center">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-3 text-[28px] font-bold leading-[1.2] sm:text-[40px]">
          From data to decision in three steps
        </h2>
      </Reveal>
      <div className="relative mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <RevealItem key={s.step} delay={i * 0.1}>
            <div className="relative h-full rounded-[16px] border border-white/[0.07] bg-[rgba(17,24,39,0.6)] p-7 backdrop-blur-md">
              <span className="absolute right-5 top-4 font-mono text-3xl font-bold tabular-nums text-white/[0.06]">
                {s.step}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-bull/10 text-bull">
                <span className="font-mono text-lg font-bold">{s.step}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text-primary">{s.title}</h3>
              <p className="mt-2 text-sm leading-[1.6] text-text-secondary">{s.desc}</p>
            </div>
          </RevealItem>
        ))}
      </div>
    </section>
  );
}

/* ---------- FAQ accordion ---------- */
const FAQS: { Icon: LucideIcon; q: string; a: string }[] = [
  {
    Icon: Lock,
    q: "Is my financial data secure?",
    a: "Your data is encrypted in transit and at rest. NafaIQ never sells your information, and your portfolio details stay private to your account.",
  },
  {
    Icon: CrescentIcon as unknown as LucideIcon,
    q: "Is NafaIQ Shariah compliant?",
    a: "Yes. NafaIQ includes built-in halal stock screening, a Zakat calculator, and Islamic savings goals so you can invest in line with your values.",
  },
  {
    Icon: BadgeDollarSign,
    q: "How much does it cost?",
    a: "The core terminal is free forever — no credit card required. Premium plans add advanced AI reports and deeper analytics. See the Plans page for details.",
  },
  {
    Icon: UserCheck,
    q: "Do I need an account to start?",
    a: "No. You can explore markets, charts, and the Haqeeqi Daulat demo without signing up. Create a free account only when you want to save your portfolio.",
  },
];

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-[60px] lg:py-[100px]">
      <Reveal className="text-center">
        <SectionLabel>Questions</SectionLabel>
        <h2 className="mt-3 text-[28px] font-bold leading-[1.2] sm:text-[40px]">
          Everything you might be wondering
        </h2>
      </Reveal>
      <Reveal className="mt-10">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="mb-3 overflow-hidden rounded-[14px] border border-white/[0.07] bg-[rgba(17,24,39,0.5)] px-5 backdrop-blur-md"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="flex items-center gap-3 text-left text-base font-semibold text-text-primary">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-bull/10 text-bull">
                    <f.Icon size={16} strokeWidth={1.75} />
                  </span>
                  {f.q}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-11 text-sm leading-relaxed text-text-secondary">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}

function Landing() {
  return (
    <div className="dot-grid relative isolate min-h-screen bg-background text-text-primary">
      {/* Ambient drifting background — behind all content, decorative only */}
      <div className="ambient-bg pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />

      <Nav />

      <Hero />

      {/* TICKER */}
      <TickerStrip />

      {/* TRUST STRIP */}
      <TrustStrip />

      {/* FEATURES */}
      <section
        id="features"
        className="gradient-mesh mx-auto max-w-[1200px] px-6 py-[60px] lg:py-[100px]"
      >
        <Reveal className="text-center">
          <SectionLabel>Everything you need</SectionLabel>
          <h2 className="mt-3 text-[28px] font-bold leading-[1.2] sm:text-[40px]">
            One App. Complete Financial Intelligence.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.Icon;
            return (
              <RevealItem key={f.title} delay={i * 0.08} className="[perspective:1000px]">
                <Tilt3D max={10} className="h-full">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={SPRING_UI}
                    className={cn(
                      "group relative h-full rounded-[16px] border border-white/[0.07] p-7 backdrop-blur-md transition-shadow duration-[250ms] hover:border-bull/30 hover:shadow-[0_24px_60px_rgba(0,212,170,0.18),0_0_0_1px_rgba(0,212,170,0.18)]",
                      f.badge && "spin-border",
                    )}
                    style={{ background: "rgba(17,24,39,0.6)" }}
                  >
                    {f.badge && (
                      <span
                        className="badge-shimmer absolute right-4 top-4 overflow-hidden rounded-full text-[10px] font-semibold text-warning"
                        style={{
                          background: "rgba(245,158,11,0.15)",
                          border: "1px solid rgba(245,158,11,0.3)",
                          padding: "2px 8px",
                        }}
                      >
                        {f.badge}
                      </span>
                    )}
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-[12px]",
                        f.iconColor,
                      )}
                      style={{ background: f.chipBg, transform: "translateZ(40px)" }}
                    >
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-text-primary">{f.title}</h3>
                    <p className="mt-2 text-sm leading-[1.6] text-text-secondary">{f.desc}</p>
                  </motion.div>
                </Tilt3D>
              </RevealItem>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* HAQEEQI DAULAT SPOTLIGHT */}
      <section className="relative overflow-hidden border-y border-border bg-surface-alt">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-1/2"
          style={{
            background:
              "radial-gradient(60% 80% at 0% 50%, rgba(245,158,11,0.12), rgba(245,158,11,0) 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-[60px] lg:grid-cols-2 lg:py-[100px]">
          <Reveal>
            <span
              className="badge-shimmer inline-block overflow-hidden rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] text-bull"
              style={{
                background: "rgba(0,212,170,0.15)",
                border: "1px solid rgba(0,212,170,0.3)",
                padding: "3px 10px",
              }}
            >
              World-first feature
            </span>
            <h2 className="mt-3 text-[28px] font-bold leading-[1.2] sm:text-[40px]">
              The Truth About
              <br />
              <span className="text-bull" style={{ textShadow: "0 0 60px rgba(0,212,170,0.3)" }}>
                Your PKR Gains
              </span>
            </h2>
            <p className="mt-5 max-w-[520px] text-text-secondary">
              Most Pakistani investors don't realize their PSX gains are partly an illusion. When
              PKR devalues 16% in a year, a 12% PSX gain means you're actually poorer in real terms.
              NafaIQ is the first app in the world to show you the complete picture.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Devaluation-adjusted portfolio returns in USD, AED, SAR",
                "Your Devaluation Shield Score with actionable recommendations",
                '"What if" comparison: PSX vs USD cash vs Gold',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-bull" />
                  {t}
                </li>
              ))}
            </ul>
            <Magnetic strength={0.35}>
              <Link
                to="/app"
                className="mt-8 inline-flex items-center gap-1.5 rounded-[6px] bg-gradient-to-br from-[#00d4aa] to-[#00a88a] px-5 py-2.5 text-sm font-semibold text-bull-foreground shadow-[0_6px_24px_rgba(0,212,170,0.3)] transition hover:shadow-[0_10px_36px_rgba(0,212,170,0.5)]"
              >
                See Haqeeqi Daulat <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.12} className="flex justify-center lg:justify-end">
            <FlipCard />
          </Reveal>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="mx-auto max-w-[1200px] px-6 py-[60px] lg:py-[100px]">
        <Reveal>
          <h2 className="text-center text-[28px] font-bold leading-[1.2] sm:text-[40px]">
            Trusted by Pakistani Investors
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <RevealItem key={t.initials} delay={i * 0.1} className="[perspective:1000px]">
              <Tilt3D max={8} scale={1.03} className="h-full">
                <div
                  className="relative h-full overflow-hidden rounded-[16px] border border-white/[0.07] p-6 backdrop-blur-md"
                  style={{ background: "rgba(17,24,39,0.6)" }}
                >
                  <span className="pointer-events-none absolute left-3 top-0 select-none font-serif text-[80px] leading-none text-white opacity-[0.08]">
                    &ldquo;
                  </span>
                  <div className="relative flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full font-semibold",
                        t.color,
                      )}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{t.name}</div>
                      <div className="text-xs text-text-muted">{t.role}</div>
                    </div>
                  </div>
                  <div className="relative mt-3 flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="relative mt-3 text-sm leading-relaxed text-text-secondary">
                    "{t.quote}"
                  </p>
                </div>
              </Tilt3D>
            </RevealItem>
          ))}
        </div>
        <Reveal className="mt-16">
          <div className="rounded-[16px] border border-white/[0.07] bg-surface/40 py-2">
            <StatsStrip />
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* DOWNLOAD CTA */}
      <section id="download" className="gradient-mesh border-y border-border bg-[#0D1421]">
        <div className="mx-auto max-w-3xl px-6 py-[60px] text-center lg:py-[100px]">
          <Reveal>
            <h2 className="text-[28px] font-bold leading-[1.2] sm:text-[40px]">
              Start Managing Your Wealth Today
            </h2>
            <p className="mt-3 text-text-secondary">
              Free forever. No credit card. No account required to explore.
            </p>
            <div className="mt-8">
              <StoreButtons center />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              {[
                { icon: Apple, label: "iOS 14+" },
                { icon: Smartphone, label: "Android 8+" },
                { icon: Globe, label: "All Browsers" },
                { icon: MonitorSmartphone, label: "Installable PWA" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-text-secondary"
                >
                  <Icon className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.75} />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ABOUT + CONTACT */}
      <section
        id="about"
        className="mx-auto max-w-[1200px] scroll-mt-24 px-6 py-[60px] lg:py-[100px]"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionLabel>About NafaIQ</SectionLabel>
            <h2 className="mt-3 text-[28px] font-bold leading-[1.2] sm:text-[40px]">
              Built for Pakistan's financial reality.
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-secondary">
              NafaIQ brings live Pakistan Stock Exchange data, personal finance, and AI insight into
              a single terminal — designed around the realities of investing, saving, and growing
              wealth in Pakistan. We help everyday investors see their true, devaluation-adjusted
              picture and make confident, values-aligned decisions.
            </p>
          </Reveal>

          <div id="contact" className="scroll-mt-24">
            <Reveal delay={0.1}>
              <SectionLabel>Get in touch</SectionLabel>
              <h2 className="mt-3 text-[28px] font-bold leading-[1.2] sm:text-[40px]">
                We'd love to hear from you.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-text-secondary">
                Questions, feedback, or partnership ideas? Reach out and our team will get back to
                you.
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <a
                  href="mailto:hello@nafaiq.com"
                  className="inline-flex items-center gap-2 font-medium text-bull transition hover:text-[#00efc0]"
                >
                  <Mail className="h-4 w-4" /> hello@nafaiq.com
                </a>
                <p className="text-text-secondary">Karachi, Pakistan</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#070B14]">
        <span className="shimmer-line absolute inset-x-0 top-0 h-px" />
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="NafaIQ" width={26} height={26} className="rounded-[6px]" />
              <span className="font-display text-lg font-bold tracking-tight text-text-primary">
                Nafa<span className="text-primary">IQ</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-text-secondary">
              Pakistan's Financial Intelligence Terminal
            </p>
            <div className="mt-4 flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.18, rotate: 6 }}
                  whileTap={{ scale: 0.92 }}
                  transition={SPRING_UI}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-text-secondary transition hover:border-bull hover:bg-bull/10 hover:text-bull hover:shadow-[0_0_18px_rgba(0,212,170,0.35)]"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">App</div>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <Link to="/app" className="transition hover:text-bull">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/psx" className="transition hover:text-bull">
                  PSX Market
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="transition hover:text-bull">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/finance" className="transition hover:text-bull">
                  Finance
                </Link>
              </li>
              <li>
                <Link to="/learn" className="transition hover:text-bull">
                  Learn Hub
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#about" className="transition hover:text-bull">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-bull">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-bull">
                  Terms
                </a>
              </li>
              <li>
                <a href="#contact" className="transition hover:text-bull">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-5 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              © 2026 NafaIQ · Built in Pakistan <PkBadge />
              <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-text-secondary">
                v1.0 · Beta
              </span>
            </span>
            <span>Pakistan's Financial Intelligence Terminal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
