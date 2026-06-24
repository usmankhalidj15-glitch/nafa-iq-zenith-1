import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, StatCard } from "@/components/Card";
import { Change } from "@/components/Change";
import { SignalBadge } from "@/components/SignalBadge";
import { DonutChart, PortfolioAreaChart, Sparkline } from "@/components/charts";
import { STOCKS, WATCHLIST, generateOHLCV, fmtPKR } from "@/lib/data";
import { SPENDING, GOALS } from "@/lib/finance-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — NafaIQ" },
      { name: "description", content: "Your net worth, portfolio, spending and PSX signals at a glance." },
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

function Dashboard() {
  const { profile, user } = useAuth();
  const firstName = (profile?.display_name || user?.email?.split("@")[0] || "Investor").split(" ")[0];
  const [range, setRange] = useState<(typeof RANGES)[number]>("6M");
  const [showAI, setShowAI] = useState(true);
  const months = range === "1M" ? 2 : range === "3M" ? 3 : range === "1Y" ? 6 : 6;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Greeting */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            Asalam-o-Alaikum, {firstName}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Thursday, 19 June 2025 · KSE-100 is up <span className="text-bull">1.24%</span> today
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/psx"
            className="rounded-[6px] bg-bull px-4 py-2 text-sm font-semibold text-bull-foreground transition hover:brightness-110"
          >
            Explore PSX
          </Link>
          <Link
            to="/finance"
            className="rounded-[6px] border border-bull px-4 py-2 text-sm font-semibold text-bull transition hover:bg-bull/10"
          >
            Add Transaction
          </Link>
        </div>
      </div>

      {/* AI Insight banner */}
      {showAI && (
        <div className="rounded-[8px] border border-border border-l-4 border-l-ai bg-ai-tint p-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-start">
            <Sparkles className="h-5 w-5 shrink-0 text-ai" />
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-text-primary">Today's AI Insight</h2>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                You spent 15% more on dining this month. Redirecting PKR 5,000 to your Hajj Fund
                could bring your goal 3 months closer. Also, HBL in your portfolio is showing a
                Strong Buy signal — up 2.41% today with rising volume.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/psx" className="rounded-[6px] bg-bull px-3 py-1.5 text-xs font-semibold text-bull-foreground hover:brightness-110">
                See Detail
              </Link>
              <button onClick={() => setShowAI(false)} className="rounded-[6px] px-3 py-1.5 text-xs text-text-muted hover:text-text-primary">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Net Worth" value={fmtPKR(4280500)} sub="+PKR 56,000 (+1.32%) this month" subColor="text-bull" />
        <StatCard label="Monthly Spending" value={fmtPKR(112050)} sub="-12% vs May" subColor="text-bull" />
        <StatCard label="Portfolio Value" value={fmtPKR(858054)} sub="+12.73% YTD" subColor="text-bull" />
        <StatCard label="Today's PSX P/L" value="+PKR 17,480" sub="+1.42%" subColor="text-bull" />
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
                    range === r ? "bg-bull text-bull-foreground" : "text-text-secondary hover:bg-hover",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <PortfolioAreaChart data={portfolioSeries(months)} />
          <div className="mt-2 flex gap-4 text-xs text-text-muted">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-bull" />Portfolio</span>
            <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-text-secondary" />KSE-100</span>
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
                  <Sparkline data={spark} color={s.changePct >= 0 ? "#00d4aa" : "#ff4d4d"} />
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
        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-1 lg:grid lg:grid-cols-3">
          {GOALS.slice(0, 3).map((g) => {
            const pct = Math.round((g.saved / g.target) * 100);
            return (
              <Card key={g.name} className="w-[280px] shrink-0 lg:w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{g.emoji}</span>
                  <span className="font-semibold text-text-primary">{g.name}</span>
                  <span className="ml-auto font-mono text-sm font-bold tabular-nums text-bull">{pct}%</span>
                </div>
                <div className="mt-2 font-mono text-xs tabular-nums text-text-secondary">
                  {fmtPKR(g.saved)} / {fmtPKR(g.target)}
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
                  <div className={cn("h-full rounded-full", g.color === "bull" ? "bg-bull" : "bg-warning")} style={{ width: `${pct}%` }} />
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
