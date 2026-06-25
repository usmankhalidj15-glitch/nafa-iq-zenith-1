import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Download,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Bot,
  Check,
  Star,
  Twitter,
  Linkedin,
  Github,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { TICKER_ITEMS } from "@/lib/data";
import { cn } from "@/lib/utils";

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

const STORE_TOAST =
  "Coming soon to app stores! Use the Web App for now — it installs to your home screen just like a native app.";

/* ---------- scroll reveal hook ---------- */
function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("is-visible"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>(delay);
  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}

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
      <path d="M48 27.3c-3 3.2-4.8 8.2-4.8 14.7v428c0 6.5 1.8 11.5 4.8 14.7l1.4 1.4L289 261.7v-5.5L49.4 25.9 48 27.3z" fill="#00d4aa" />
      <path d="M368.8 341.6l-79.8-79.9v-5.5l79.9-79.9 1.8 1L465 232c27 15.3 27 40.4 0 55.8l-94.4 53.6-1.8.2z" fill="#f59e0b" />
      <path d="M370.6 340.6L289 259 48 500c8.9 9.4 23.6 10.6 40.1 1.2l282.5-160.6z" fill="#ff4d4d" />
      <path d="M370.6 181.4L88.1 20.8C71.6 11.4 56.9 12.6 48 22l241 241 81.6-81.6z" fill="#00efc0" />
    </svg>
  );
}

function StoreButtons({ center = false }: { center?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:flex-wrap", center && "sm:justify-center")}>
      <button
        onClick={() => toast(STORE_TOAST)}
        className="group relative flex items-center gap-3 rounded-[12px] border border-white/20 bg-black px-5 py-2.5 text-left transition hover:border-white/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      >
        <AppleGlyph />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] tracking-wide text-white/70">Download on the</span>
          <span className="text-lg font-semibold text-white">App Store</span>
        </span>
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-elevated px-2 py-0.5 text-[10px] text-text-secondary opacity-0 transition group-hover:opacity-100">
          Coming soon
        </span>
      </button>
      <button
        onClick={() => toast(STORE_TOAST)}
        className="group relative flex items-center gap-3 rounded-[12px] border border-white/20 bg-black px-5 py-2.5 text-left transition hover:border-white/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
      >
        <GooglePlayGlyph />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] tracking-wide text-white/70">Get it on</span>
          <span className="text-lg font-semibold text-white">Google Play</span>
        </span>
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-elevated px-2 py-0.5 text-[10px] text-text-secondary opacity-0 transition group-hover:opacity-100">
          Coming soon
        </span>
      </button>
      <Link
        to="/app"
        className="flex items-center gap-3 rounded-[12px] bg-gradient-to-br from-[#00d4aa] to-[#00a88a] px-6 py-3 text-left text-bull-foreground shadow-[0_8px_30px_rgba(0,212,170,0.3)] transition hover:-translate-y-px hover:shadow-[0_12px_40px_rgba(0,212,170,0.45)]"
      >
        <Download className="h-7 w-7 shrink-0" />
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] text-white/80">Install as</span>
          <span className="text-lg font-semibold">Web App — Free</span>
        </span>
      </Link>
    </div>
  );
}

function TickerStrip() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-10 overflow-hidden border-y border-border bg-surface py-3">
      <div className="flex w-max animate-[ticker_40s_linear_infinite] gap-8 whitespace-nowrap px-4">
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

/* ---------- 3D phone ---------- */
function PhoneMockup() {
  return (
    <div className="group/phone relative mx-auto w-[260px] [perspective:1200px] sm:w-[280px]">
      {/* KSE-100 floating card */}
      <div
        className="absolute -top-8 -left-10 z-20 rounded-[12px] border border-bull/25 bg-surface/85 px-3.5 py-2.5 backdrop-blur-md"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "floatCard1 4s ease-in-out infinite alternate",
        }}
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
      </div>

      {/* Real Wealth floating card */}
      <div
        className="absolute -bottom-8 -right-8 z-20 rounded-[12px] border border-warning/30 bg-surface/85 px-3.5 py-2.5 backdrop-blur-md"
        style={{
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "floatCard2 5s ease-in-out infinite alternate",
        }}
      >
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-warning">
          <ShieldCheck className="h-3 w-3" /> Real Wealth
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-mono text-sm font-bold text-text-primary">$15,395</span>
          <span className="text-[9px] text-text-muted">USD value</span>
        </div>
      </div>

      {/* phone frame */}
      <div
        className="relative transition-transform duration-700 [transform-style:preserve-3d] [transform:perspective(1200px)_rotateY(-18deg)_rotateX(4deg)] group-hover/phone:[transform:perspective(1200px)_rotateY(-8deg)_rotateX(2deg)]"
      >
        {/* glow behind */}
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
                <span className="text-xs font-bold text-bull">NafaIQ</span>
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
                    <div key={i} className="flex-1 rounded-t-sm bg-bull/70" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    emoji: "📊",
    chipBg: "rgba(0,212,170,0.15)",
    title: "PSX Trading Terminal",
    desc: "Candlestick charts, heatmaps, top movers, AI signals — the first Bloomberg-grade PSX terminal on your phone.",
  },
  {
    emoji: "🛡️",
    chipBg: "rgba(245,158,11,0.15)",
    title: "Haqeeqi Daulat™ Engine",
    desc: "See your REAL wealth after PKR devaluation. Pakistan's first devaluation-adjusted portfolio intelligence.",
    badge: "World First",
  },
  {
    emoji: "🤖",
    chipBg: "rgba(139,92,246,0.15)",
    title: "AI Financial Advisor",
    desc: "Personalized insights, AI-generated portfolio reports, and a 24/7 finance tutor — powered by Claude AI.",
  },
  {
    emoji: "🕋",
    chipBg: "rgba(16,185,129,0.15)",
    title: "Built for Muslim Investors",
    desc: "Halal stock screening, Zakat calculator, Islamic savings goals — finance aligned with your values.",
  },
  {
    emoji: "💼",
    chipBg: "rgba(59,130,246,0.15)",
    title: "Complete Finance Manager",
    desc: "Track income, expenses, budgets, bills, and goals — all in one place, in Pakistani Rupees.",
  },
  {
    emoji: "📚",
    chipBg: "rgba(249,115,22,0.15)",
    title: "Financial Education",
    desc: "Beginner to advanced courses in Urdu and English. Earn XP. Build real investing knowledge.",
  },
] as const;

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

/* ---------- counters (mount-triggered) ---------- */
function useCountUp(target: number, decimals = 0, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return Number(val.toFixed(decimals));
}

function StatsStrip() {
  const users = useCountUp(12000);
  const tracked = useCountUp(2.4, 1);
  const rating = useCountUp(4.8, 1);
  const stats = [
    [`${Math.round(users).toLocaleString()}+`, "Active Users"],
    [`PKR ${tracked.toFixed(1)}B+`, "Tracked"],
    [`${rating.toFixed(1)}★`, "Average Rating"],
  ];
  return (
    <div className="grid grid-cols-1 divide-y divide-white/[0.08] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {stats.map(([v, l]) => (
        <div key={l} className="px-4 py-4 text-center">
          <div className="font-mono text-3xl font-bold tabular-nums text-text-primary sm:text-[40px]">
            {v}
          </div>
          <div className="mt-1 text-sm text-text-secondary">{l}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- nav ---------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.06] bg-background/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img src={logo} alt="NafaIQ" width={26} height={26} className="rounded-[6px]" />
          <span className="text-lg font-bold tracking-tight text-bull">NafaIQ</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <a href="#features" className="hidden text-sm text-text-secondary transition hover:text-text-primary sm:inline">
            Features
          </a>
          <a href="#download" className="hidden text-sm text-text-secondary transition hover:text-text-primary sm:inline">
            Download
          </a>
          <Link
            to="/app"
            className="inline-flex items-center gap-1 rounded-[6px] bg-bull px-4 py-2 text-sm font-semibold text-bull-foreground transition hover:bg-[#00efc0] hover:shadow-[0_0_20px_rgba(0,212,170,0.3)]"
          >
            Enter App <ArrowRight className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

const SCATTERED_TICKERS = [
  { text: "HBL", x: "4%", y: "12%", size: 11, opacity: 0.12 },
  { text: "+2.41%", x: "14%", y: "28%", size: 10, opacity: 0.09 },
  { text: "ENGRO", x: "22%", y: "8%", size: 12, opacity: 0.1 },
  { text: "312.45", x: "32%", y: "22%", size: 10, opacity: 0.07 },
  { text: "LUCK", x: "44%", y: "15%", size: 11, opacity: 0.08 },
  { text: "-0.45%", x: "55%", y: "32%", size: 10, opacity: 0.09 },
  { text: "KSE-100", x: "64%", y: "9%", size: 13, opacity: 0.11 },
  { text: "78,542", x: "74%", y: "25%", size: 10, opacity: 0.08 },
  { text: "OGDC", x: "84%", y: "14%", size: 11, opacity: 0.1 },
  { text: "+1.24%", x: "91%", y: "35%", size: 10, opacity: 0.09 },
  { text: "FFC", x: "8%", y: "48%", size: 11, opacity: 0.07 },
  { text: "168.70", x: "18%", y: "62%", size: 10, opacity: 0.08 },
  { text: "+1.08%", x: "28%", y: "45%", size: 10, opacity: 0.06 },
  { text: "UBL", x: "38%", y: "58%", size: 12, opacity: 0.09 },
  { text: "198.20", x: "50%", y: "70%", size: 10, opacity: 0.07 },
  { text: "MCB", x: "60%", y: "52%", size: 11, opacity: 0.08 },
  { text: "-0.38%", x: "70%", y: "68%", size: 10, opacity: 0.06 },
  { text: "PSO", x: "80%", y: "55%", size: 11, opacity: 0.09 },
  { text: "251.30", x: "88%", y: "72%", size: 10, opacity: 0.07 },
  { text: "KSE-30", x: "6%", y: "78%", size: 12, opacity: 0.08 },
  { text: "24,180", x: "16%", y: "85%", size: 10, opacity: 0.06 },
  { text: "DGKC", x: "35%", y: "82%", size: 11, opacity: 0.07 },
  { text: "+0.95%", x: "48%", y: "88%", size: 10, opacity: 0.06 },
  { text: "POL", x: "62%", y: "80%", size: 11, opacity: 0.08 },
  { text: "412.80", x: "72%", y: "90%", size: 10, opacity: 0.05 },
  { text: "LOTCHEM", x: "82%", y: "83%", size: 11, opacity: 0.07 },
  { text: "+0.62%", x: "92%", y: "78%", size: 10, opacity: 0.06 },
  { text: "145.30", x: "42%", y: "38%", size: 10, opacity: 0.07 },
] as const;

function ScatteredTickers() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-50 md:opacity-100"
      style={{ animation: "tickerBreath 8s ease-in-out infinite" }}
    >
      {SCATTERED_TICKERS.map((t, i) => (
        <span
          key={i}
          className="absolute select-none whitespace-nowrap font-mono text-white"
          style={{
            left: t.x,
            top: t.y,
            fontSize: t.size,
            opacity: t.opacity,
            letterSpacing: "0.05em",
          }}
        >
          {t.text}
        </span>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-bull">
      {children}
    </span>
  );
}

function Landing() {
  return (
    <div className="dot-grid min-h-screen scroll-smooth bg-background text-text-primary">
      <Nav />

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,45,45,0.95) 0%, #0A0E1A 60%)",
        }}
      >
        <ScatteredTickers />
        {/* gradient orbs */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <span
            className="absolute"
            style={{
              width: 600,
              height: 600,
              top: -100,
              left: -100,
              background: "radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)",
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

        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-12 px-6 pt-28 pb-16 lg:grid-cols-5 lg:pt-36 lg:pb-24">
          <div className="lg:col-span-3">
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
              🇵🇰 Built for the Pakistani Investor
            </span>
            <h1 className="mt-6 text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-5xl lg:text-[68px]">
              PSX. Finance. AI.
              <br />
              <span
                className="text-bull"
                style={{ textShadow: "0 0 60px rgba(0,212,170,0.3)" }}
              >
                One Terminal.
              </span>
            </h1>
            <p className="mt-5 max-w-[480px] text-base text-text-secondary sm:text-lg">
              Track markets, manage money, and get AI insights — built around Pakistan's financial
              reality.
            </p>
            <div className="mt-8">
              <StoreButtons />
            </div>
            <p className="mt-4 text-xs text-text-muted">
              ✓ No account required to explore&nbsp;&nbsp; ✓ Works on iOS, Android &amp; Desktop
            </p>
          </div>
          <div className="lg:col-span-2">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <TickerStrip />

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-[1200px] px-6 py-[60px] lg:py-[100px]">
        <Reveal className="text-center">
          <SectionLabel>Everything you need</SectionLabel>
          <h2 className="mt-3 text-[28px] font-bold leading-[1.2] sm:text-[40px]">
            One App. Complete Financial Intelligence.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div
                className={cn(
                  "group relative h-full rounded-[16px] border border-white/[0.07] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-bull/30 hover:shadow-[0_8px_40px_rgba(0,212,170,0.08),0_0_0_1px_rgba(0,212,170,0.1)]",
                  "badge" in f && f.badge && "spin-border",
                )}
                style={{ background: "rgba(17,24,39,0.6)" }}
              >
                {"badge" in f && f.badge && (
                  <span
                    className="absolute right-4 top-4 rounded-full text-[10px] font-semibold text-warning"
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
                  className="flex h-12 w-12 items-center justify-center rounded-[12px] text-xl"
                  style={{ background: f.chipBg }}
                >
                  {f.emoji}
                </div>
                <h3 className="mt-4 text-base font-semibold text-text-primary">{f.title}</h3>
                <p className="mt-2 text-sm leading-[1.6] text-text-secondary">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

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
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-warning">
              World-first feature
            </span>
            <h2 className="mt-3 text-[28px] font-bold leading-[1.2] sm:text-[40px]">
              The Truth About
              <br />
              <span className="text-warning">Your PKR Gains</span>
            </h2>
            <p className="mt-5 max-w-[520px] text-text-secondary">
              Most Pakistani investors don't realize their PSX gains are partly an illusion. When PKR
              devalues 16% in a year, a 12% PSX gain means you're actually poorer in real terms.
              NafaIQ is the first app in the world to show you the complete picture.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Devaluation-adjusted portfolio returns in USD, AED, SAR",
                "Your Devaluation Shield Score with actionable recommendations",
                '"What if" comparison: PSX vs USD cash vs Gold',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              to="/app"
              className="mt-8 inline-flex items-center gap-1.5 rounded-[6px] border border-warning px-5 py-2.5 text-sm font-semibold text-warning transition hover:bg-warning/10"
            >
              See Haqeeqi Daulat <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal delay={120} className="flex justify-center lg:justify-end">
            <div className="group/card relative [perspective:800px]">
              {/* glow */}
              <span
                className="absolute -bottom-10 left-1/2 -z-10 h-1/2 w-3/4 -translate-x-1/2 rounded-full"
                style={{
                  background: "radial-gradient(ellipse, rgba(245,158,11,0.25), transparent 70%)",
                  filter: "blur(40px)",
                }}
              />
              <div
                className="w-full max-w-[340px] rounded-[16px] border border-white/10 p-6 transition-transform duration-500 [transform-style:preserve-3d] [transform:perspective(800px)_rotateY(-12deg)_rotateX(6deg)] group-hover/card:[transform:perspective(800px)_rotateY(-4deg)_rotateX(2deg)]"
                style={{
                  background: "rgba(17,24,39,0.9)",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(245,158,11,0.08)",
                }}
              >
                <div className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  Haqeeqi Daulat™ — حقیقی دولت
                </div>
                <div className="mt-1 text-sm font-semibold text-text-primary">
                  Your Real Wealth Breakdown
                </div>

                <div className="mt-5">
                  <div className="text-[11px] text-text-muted">PSX Shows You</div>
                  <div className="mt-1 font-mono text-[32px] font-bold leading-none text-bull">
                    +12.73%
                  </div>
                  <div className="mt-1 text-[11px] text-text-secondary">PKR 858,054 portfolio</div>
                </div>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1" style={{ background: "rgba(245,158,11,0.3)" }} />
                  <Zap className="h-4 w-4 text-warning" />
                  <span className="h-px flex-1" style={{ background: "rgba(245,158,11,0.3)" }} />
                </div>

                <div>
                  <div className="text-[11px] text-text-muted">Real USD Return</div>
                  <div className="mt-1 font-mono text-[32px] font-bold leading-none text-bear">
                    -3.2%
                  </div>
                  <div className="mt-1 text-[11px] text-text-secondary">After 16.2% PKR decay</div>
                </div>

                <div
                  className="mt-5 rounded-[8px] p-2.5 text-[12px] text-warning"
                  style={{ background: "rgba(245,158,11,0.08)" }}
                >
                  ⚠️ PKR 1,02,722 eroded by devaluation this year
                </div>
              </div>
            </div>
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
            <Reveal key={t.initials} delay={i * 80}>
              <div
                className="relative h-full overflow-hidden rounded-[16px] border border-white/[0.07] p-6 backdrop-blur-md"
                style={{ background: "rgba(17,24,39,0.6)" }}
              >
                <span className="pointer-events-none absolute left-3 top-0 select-none font-serif text-[80px] leading-none text-white opacity-[0.08]">
                  &ldquo;
                </span>
                <div className="relative flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-full font-semibold", t.color)}>
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
                <p className="relative mt-3 text-sm leading-relaxed text-text-secondary">"{t.quote}"</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16">
          <div className="rounded-[16px] border border-white/[0.07] bg-surface/40 py-2">
            <StatsStrip />
          </div>
        </Reveal>
      </section>

      {/* DOWNLOAD CTA */}
      <section id="download" className="border-y border-border bg-[#0D1421]">
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
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-text-secondary">
              <span>🍎 iOS 14+</span>
              <span>🤖 Android 8+</span>
              <span>💻 All Browsers</span>
              <span>📲 Installable PWA</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-[#070B14]">
        <span
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, #00d4aa, transparent)" }}
        />
        <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="NafaIQ" width={26} height={26} className="rounded-[6px]" />
              <span className="text-lg font-bold tracking-tight text-bull">NafaIQ</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-text-secondary">
              Pakistan's Financial Intelligence Terminal
            </p>
            <div className="mt-4 flex gap-3">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-text-secondary transition hover:border-bull hover:bg-bull/10 hover:text-bull"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">App</div>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li><Link to="/app" className="transition hover:text-bull">Dashboard</Link></li>
              <li><Link to="/psx" className="transition hover:text-bull">PSX Market</Link></li>
              <li><Link to="/portfolio" className="transition hover:text-bull">Portfolio</Link></li>
              <li><Link to="/finance" className="transition hover:text-bull">Finance</Link></li>
              <li><Link to="/learn" className="transition hover:text-bull">Learn Hub</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-text-primary">Company</div>
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="transition hover:text-bull">About</a></li>
              <li><a href="#" className="transition hover:text-bull">Privacy Policy</a></li>
              <li><a href="#" className="transition hover:text-bull">Terms</a></li>
              <li><a href="#" className="transition hover:text-bull">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-6 py-5 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              © 2026 NafaIQ. Made in Pakistan 🇵🇰
              <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[11px] text-text-secondary">
                v1.0 · Beta
              </span>
            </span>
            <span>Made with ❤️ for Pakistani investors</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
