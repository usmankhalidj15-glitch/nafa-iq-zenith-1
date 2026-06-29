import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, StatCard } from "@/components/Card";
import { Change } from "@/components/Change";
import { SignalBadge } from "@/components/SignalBadge";
import { EmojiIcon } from "@/components/icons";
import { DonutChart, PortfolioAreaChart, Sparkline } from "@/components/charts";
import { STOCKS, WATCHLIST, generateOHLCV, fmtPKR } from "@/lib/data";
import { SPENDING, GOALS } from "@/lib/finance-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Dashboard — NafaIQ" },
      {
        name: "description",
        content: "Your net worth, portfolio, spending and PSX signals at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const RANGES = ["1M", "3M", "6M", "1Y"] as const;

function portfolioSeries(months: number) {
  const base = 858054 / 1.1273;
  const out = [];
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].slice(6 - months);
  for (let i = 0; i < labels.length; i++) {
    const f = i / (labels.length - 1 || 1);
    out.push({
      label: labels[i],
      value: Math.round(base * (1 + 0.1273 * f + Math.sin(i) * 0.01)),
      benchmark: Math.round(base * (1 + 0.095 * f + Math.cos(i) * 0.008)),
    });
  }
  return out;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatToday() {
  const d = new Date();
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function Dashboard() {
  const { profile, user } = useAuth();
  const firstName = (profile?.display_name || user?.email?.split("@")[0] || "Investor").split(
    " ",
  )[0];
  const [range, setRange] = useState<(typeof RANGES)[number]>("6M");
  const [showAI, setShowAI] = useState(true);
  const months = range === "1M" ? 2 : range === "3M" ? 3 : range === "1Y" ? 6 : 6;
  console.log("Dashboard profile:", profile);
  console.log("Dashboard user:", user);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Greeting — compact hero */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-text-primary sm:text-2xl">
            Asalam-o-Alaikum, {firstName}
          </h1>
          <p className="mt-0.5 text-[13px] text-text-secondary">
            {formatToday()} · KSE-100 <span className="font-mono text-bull">+1.24%</span> today
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            to="/psx"
            className="rounded-lg bg-primary px-3.5 py-2 text-[13px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
          >
            Explore PSX
          </Link>
          <Link
            to="/finance"
            className="rounded-lg border border-white/[0.08] bg-surface px-3.5 py-2 text-[13px] font-semibold text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.16]"
          >
            Add Transaction
          </Link>
        </div>
      </div>

      {/* AI Insight — premium recommendation widget */}
      {showAI && (
        <div className="rounded-[14px] border border-white/[0.06] bg-surface p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-[18px] w-[18px] text-primary" strokeWidth={1.75} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-semibold text-text-primary">AI Recommendation</h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  92% confidence
                </span>
              </div>
              <p className="mt-1.5 text-[13px] font-medium text-text-primary">
                Redirect PKR 5,000 from dining to your Hajj Fund.
              </p>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                You spent 15% more on dining this month — reallocating brings your goal 3 months
                closer. HBL is also flashing a Strong Buy, up 2.41% on rising volume.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                to="/psx"
                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
              >
                View
              </Link>
              <button
                onClick={() => setShowAI(false)}
                className="rounded-lg px-3 py-1.5 text-xs text-text-muted transition hover:bg-white/[0.04] hover:text-text-primary"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metric cards — Net Worth primary, rest secondary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-6">
          <div className="text-[13px] font-medium text-text-secondary">Total Net Worth</div>
          <div className="mt-3 font-mono text-4xl font-bold tabular-nums text-text-primary">
            {fmtPKR(4280500)}
          </div>
          <div className="mt-2 font-mono text-sm tabular-nums text-bull">
            +PKR 56,000 (+1.32%) this month
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-6">
          <StatCard
            label="Portfolio Value"
            value={fmtPKR(858054)}
            sub="+12.73% YTD"
            subColor="text-bull"
          />
          <StatCard
            label="Monthly Spending"
            value={fmtPKR(112050)}
            sub="-12% vs May"
            subColor="text-bull"
          />
          <StatCard label="Today's PSX P/L" value="+17,480" sub="+1.42%" subColor="text-bull" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Portfolio Value</h3>
            <div className="flex gap-1">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-[6px] px-2.5 py-1 text-xs font-medium transition",
                    range === r
                      ? "bg-bull text-bull-foreground"
                      : "text-text-secondary hover:bg-hover",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <PortfolioAreaChart data={portfolioSeries(months)} />
          <div className="mt-2 flex gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-bull" />
              Portfolio
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-text-secondary" />
              KSE-100
            </span>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-text-primary">Spending Breakdown</h3>
          <DonutChart data={SPENDING} centerValue="112,050" centerLabel="PKR total" />
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
            {SPENDING.map((s) => (
              <span key={s.name} className="flex items-center gap-1.5 text-text-secondary">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.name} {s.value}%
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Watchlist strip */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Watchlist</h3>
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
          {WATCHLIST.map((tk) => {
            const s = STOCKS[tk];
            const spark = generateOHLCV(s.seed, s.start, s.price, 7).map((c) => c.close);
            return (
              <Link
                to="/psx"
                key={tk}
                className="w-[160px] shrink-0 rounded-[8px] border border-border bg-surface p-3 transition hover:border-border-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-text-primary">{tk}</span>
                  <Change pct={s.changePct} pill />
                </div>
                <div className="truncate text-[10px] text-text-muted">{s.name}</div>
                <div className="mt-1 font-mono text-lg font-bold tabular-nums text-text-primary">
                  {s.price.toLocaleString()}
                </div>
                <div className="my-1">
                  <Sparkline data={spark} color={s.changePct >= 0 ? "#00d4aa" : "#e5484d"} />
                </div>
                <SignalBadge signal={s.signal} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Savings goals */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Savings Goals</h3>
        <div className="scrollbar-none flex gap-4 overflow-x-auto py-3 lg:grid lg:grid-cols-3">
          {GOALS.slice(0, 3).map((g) => {
            const pct = Math.round((g.saved / g.target) * 100);
            return (
              <Card key={g.name} className="w-[280px] shrink-0 lg:w-auto">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-bull/20 bg-bull/[0.08] text-bull">
                    <EmojiIcon emoji={g.emoji} size={16} />
                  </span>
                  <span className="font-semibold text-text-primary">{g.name}</span>
                  <span className="ml-auto font-mono text-sm font-bold tabular-nums text-bull">
                    {pct}%
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs tabular-nums text-text-secondary">
                  {fmtPKR(g.saved)} / {fmtPKR(g.target)}
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      g.color === "bull" ? "bg-bull" : "bg-warning",
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-text-muted">{g.ai}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
