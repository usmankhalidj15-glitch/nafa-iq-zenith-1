import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Loader2, X, Pencil, Trash2, Plus, ShieldAlert, ArrowRight, AlertTriangle } from "lucide-react";
import { Card, StatCard } from "@/components/Card";
import { Change } from "@/components/Change";
import { SignalBadge } from "@/components/SignalBadge";
import { DonutChart, PortfolioAreaChart } from "@/components/charts";
import { HOLDINGS, fmtPKR, fmtNum } from "@/lib/data";
import { cn } from "@/lib/utils";
import { EmojiIcon } from "@/components/icons";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — NafaIQ" },
      { name: "description", content: "Track holdings, performance vs KSE-100, allocation and AI portfolio reports." },
    ],
  }),
  component: Portfolio,
});

const RANGES = ["1M", "3M", "6M", "1Y"] as const;

function series(n: number) {
  const base = 761190;
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].slice(6 - n).map((label, i, a) => {
    const f = i / (a.length - 1 || 1);
    return { label, value: Math.round(base * (1 + 0.1273 * f)), benchmark: Math.round(base * (1 + 0.095 * f)) };
  });
}

const SECTOR_ALLOC = [
  { name: "Banking", value: 20, color: "#00d4aa" },
  { name: "Fertilizer", value: 28, color: "#3b82f6" },
  { name: "Oil & Gas", value: 34, color: "#f59e0b" },
  { name: "Cement", value: 18, color: "#8b5cf6" },
];
const STOCK_ALLOC = [
  { name: "HBL", value: 20, color: "#00d4aa" },
  { name: "ENGRO", value: 13, color: "#3b82f6" },
  { name: "OGDC", value: 34, color: "#f59e0b" },
  { name: "LUCK", value: 18, color: "#8b5cf6" },
  { name: "FFC", value: 15, color: "#6b7280" },
];

function HaqeeqiDaulat() {
  return (
    <Card hover={false} className="relative overflow-hidden border-gold/20">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-gold" strokeWidth={1.75} />
            <h3 className="font-display text-sm font-bold text-text-primary">
              Haqeeqi Daulat™ — Your REAL Returns
            </h3>
          </div>
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold text-gold">
            After 16.2% PKR devaluation
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[10px] border border-white/[0.06] bg-surface-alt p-4">
            <div className="font-mono text-xl font-bold tabular-nums text-bull">+12.73%</div>
            <div className="mt-1 text-[11px] text-text-muted">Nominal PKR Gain</div>
            <div className="mt-2 font-mono text-xs tabular-nums text-text-secondary">+PKR 96,864</div>
          </div>
          <div className="rounded-[10px] border border-white/[0.06] bg-surface-alt p-4">
            <div className="font-mono text-xl font-bold tabular-nums text-bear">-16.2%</div>
            <div className="mt-1 text-[11px] text-text-muted">PKR Devaluation</div>
            <div className="mt-2 font-mono text-xs tabular-nums text-text-secondary">-PKR 102,722 eroded</div>
          </div>
          <div className="rounded-[10px] border border-white/[0.06] bg-surface-alt p-4">
            <div className="font-mono text-xl font-bold tabular-nums text-bear">-3.2%</div>
            <div className="mt-1 text-[11px] text-text-muted">Real USD Return</div>
            <div className="mt-2 font-mono text-xs tabular-nums text-text-secondary">$-180 in real terms</div>
          </div>
        </div>

        <div className="mt-3 rounded-[10px] border border-white/[0.06] bg-surface-alt p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                Devaluation Shield Score
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold tabular-nums text-gold">38</span>
                <span className="font-mono text-sm text-text-muted">/ 100</span>
                <span className="rounded-full border border-gold/35 bg-gold/[0.12] px-2 py-0.5 text-[10px] font-semibold text-gold">
                  Moderate risk
                </span>
              </div>
              <p className="mt-1.5 max-w-md text-[11px] text-text-secondary">
                34% of portfolio in Oil &amp; Gas provides partial hedge against rupee weakness.
              </p>
            </div>
            <button className="flex items-center gap-1.5 rounded-[8px] bg-gold px-3.5 py-2 text-sm font-semibold text-background transition hover:brightness-110">
              Improve Score <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-gold" style={{ width: "38%" }} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function Portfolio() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("6M");
  const [reportState, setReportState] = useState<"idle" | "loading" | "open">("idle");
  const n = range === "1M" ? 2 : range === "3M" ? 3 : 6;

  function generate() {
    setReportState("loading");
    setTimeout(() => setReportState("open"), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Portfolio</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Portfolio Value" value={fmtPKR(858054)} sub="Total Invested PKR 761,190" />
        <StatCard label="Total Invested" value={fmtPKR(761190)} />
        <StatCard label="Total Gain" value="+PKR 96,864" sub="+12.73%" subColor="text-bull" />
        <StatCard label="Today's P/L" value="+PKR 17,480" sub="+1.42%" subColor="text-bull" />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Performance vs KSE-100</h3>
            <span className="text-xs text-bull">Outperforming benchmark by +3.2%</span>
          </div>
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button key={r} onClick={() => setRange(r)} className={cn("rounded-[6px] px-2.5 py-1 text-xs font-medium", range === r ? "bg-bull text-bull-foreground" : "text-text-secondary hover:bg-hover")}>{r}</button>
            ))}
          </div>
        </div>
        <PortfolioAreaChart data={series(n)} height={280} />
      </Card>

      <HaqeeqiDaulat />



      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Allocation by Sector</h3>
          <DonutChart data={SECTOR_ALLOC} centerValue="4 sectors" />
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {SECTOR_ALLOC.map((s) => (<span key={s.name} className="flex items-center gap-1.5 text-text-secondary"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name} {s.value}%</span>))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-semibold text-text-primary">Allocation by Stock</h3>
          <DonutChart data={STOCK_ALLOC} centerValue="5 stocks" />
          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
            {STOCK_ALLOC.map((s) => (<span key={s.name} className="flex items-center gap-1.5 text-text-secondary"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name} {s.value}%</span>))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Holdings</h3>
        {HOLDINGS.some((h) => h.signal === "SELL" || h.signal === "STRONG SELL") && (
          <div className="mb-3 flex items-center gap-2 rounded-[8px] border border-bear/30 bg-bear/10 px-3 py-2 text-xs text-bear">
            <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            <span>
              {HOLDINGS.filter((h) => h.signal === "SELL" || h.signal === "STRONG SELL").map((h) => h.ticker).join(", ")} — AI signals suggest reviewing these positions.
            </span>
          </div>
        )}
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[760px] text-xs">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="py-2">Stock</th><th>Sector</th><th className="text-right">Shares</th><th className="text-right">Avg Cost</th><th className="text-right">Current</th><th className="text-right">Mkt Value</th><th className="text-right">Gain/Loss</th><th className="text-center">Signal</th><th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {HOLDINGS.map((h) => {
                const mv = h.shares * h.current;
                const gain = h.shares * (h.current - h.avgCost);
                const gainPct = ((h.current - h.avgCost) / h.avgCost) * 100;
                const isSell = h.signal === "SELL" || h.signal === "STRONG SELL";
                return (
                  <tr key={h.ticker} className={cn("border-b border-border/50", isSell && "border-l-2 border-l-bear bg-bear/[0.04]")}>

                    <td className="py-2 font-semibold text-bull">{h.ticker}</td>
                    <td className="text-text-secondary">{h.sector}</td>
                    <td className="text-right font-mono tabular-nums text-text-primary">{h.shares.toLocaleString()}</td>
                    <td className="text-right font-mono tabular-nums text-text-secondary">{fmtNum(h.avgCost)}</td>
                    <td className="text-right font-mono tabular-nums text-text-primary">{fmtNum(h.current)}</td>
                    <td className="text-right font-mono tabular-nums text-text-primary">{fmtPKR(mv)}</td>
                    <td className="text-right font-mono tabular-nums"><span className={gain >= 0 ? "text-bull" : "text-bear"}>{gain >= 0 ? "+" : ""}{fmtPKR(gain)} ({gainPct >= 0 ? "+" : ""}{gainPct.toFixed(1)}%)</span></td>
                    <td className="text-center"><SignalBadge signal={h.signal} /></td>
                    <td className="text-right"><div className="flex justify-end gap-2 text-text-muted"><Pencil className="h-3.5 w-3.5 hover:text-text-primary" /><Trash2 className="h-3.5 w-3.5 hover:text-bear" /></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-bull py-2 text-sm font-semibold text-bull-foreground hover:brightness-110"><Plus className="h-4 w-4" />Add Holding</button>
      </Card>

      {/* AI report */}
      <div className="rounded-[8px] border border-border border-l-4 border-l-ai bg-ai-tint p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Sparkles className="h-5 w-5 shrink-0 text-ai" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text-primary">AI Portfolio Report</h3>
            <p className="text-sm text-text-secondary">Get a plain-English analysis — diversification score, risk assessment, top opportunities, and suggested rebalancing.</p>
          </div>
          <button onClick={generate} disabled={reportState === "loading"} className="flex items-center gap-2 rounded-[6px] bg-ai px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-70">
            {reportState === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" />Analyzing…</> : "Generate Report"}
          </button>
        </div>
      </div>

      {reportState === "open" && <ReportModal onClose={() => setReportState("idle")} />}
    </div>
  );
}

function ReportModal({ onClose }: { onClose: () => void }) {
  const sections = [
    { icon: "📊", title: "Diversification Analysis", body: "Your portfolio is moderately diversified across 4 sectors. However, Oil & Gas represents 34% of your holdings which increases sector concentration risk. Consider adding a Tech or FMCG stock to balance exposure." },
    { icon: "⚠️", title: "Risk Assessment", body: "Medium risk profile. FFC is showing a SELL signal with RSI at 38 — consider reviewing this position. LUCK (HOLD) is underperforming vs sector avg." },
    { icon: "💡", title: "Opportunities", body: "HBL and UBL in the Banking sector are both showing Strong Buy signals. Your existing HBL position is +20.4% — consider whether to take partial profits." },
    { icon: "🎯", title: "Suggested Actions", body: "1. Review FFC position (SELL signal active)\n2. Consider reducing Oil & Gas concentration below 25%\n3. HBL approaching resistance at 150 — set a price alert" },
  ];
  const score = 74;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div className="safe-bottom relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-[16px] border border-border bg-surface p-5 sm:rounded-[12px]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">Your Portfolio Report — June 2025</h3>
          <button onClick={onClose}><X className="h-5 w-5 text-text-secondary" /></button>
        </div>
        <div className="mb-4 flex items-center justify-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full" style={{ background: `conic-gradient(#00d4aa ${score * 3.6}deg, #1a2332 0deg)` }}>
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-surface">
              <span className="font-mono text-2xl font-bold tabular-nums text-bull">{score}</span>
              <span className="text-[10px] text-text-muted">Health Score</span>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {sections.map((s) => (
            <div key={s.title} className="rounded-[8px] border border-border bg-surface-alt p-3">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-text-primary"><EmojiIcon emoji={s.icon} size={15} className="text-text-secondary" /> {s.title}</div>
              <p className="mt-1 whitespace-pre-line text-xs leading-relaxed text-text-secondary">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-[10px] bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110">Export as PDF</button>
          <button onClick={onClose} className="flex-1 rounded-[10px] border border-white/[0.08] bg-surface py-2 text-sm font-semibold text-text-primary transition-colors hover:border-white/[0.16]">Close</button>

        </div>
      </div>
    </div>
  );
}
