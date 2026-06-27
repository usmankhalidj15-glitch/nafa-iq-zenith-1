import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles, Plus, Star, Filter, CandlestickChart as CandleIcon, LineChart as LineIcon } from "lucide-react";
import { Card } from "@/components/Card";
import { Change } from "@/components/Change";
import { SignalBadge } from "@/components/SignalBadge";
import { CandlestickChart, Sparkline } from "@/components/charts";
import {
  INDICES,
  STOCKS,
  STOCK_LIST,
  SECTORS,
  generateOHLCV,
  fmtNum,
  type Signal,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/psx")({
  head: () => ({
    meta: [
      { title: "PSX Market — NafaIQ Trading Terminal" },
      { name: "description", content: "Live KSE-100 candlestick terminal, top movers, sector heatmap and AI stock screener." },
    ],
  }),
  component: PSX,
});

const SYMBOLS = ["KSE-100", ...Object.keys(STOCKS)];
const TIMEFRAMES = ["1D", "1W", "1M", "3M", "6M", "1Y", "All"] as const;
const INDICATORS = ["MA20", "MA50", "MA200"] as const;

function tfDays(tf: string) {
  return { "1D": 5, "1W": 14, "1M": 30, "3M": 90, "6M": 130, "1Y": 180, All: 180 }[tf] ?? 180;
}

function symbolMeta(sym: string) {
  if (sym === "KSE-100") return { seed: 1, start: 65000, end: 78542.1, vMin: 200, vMax: 800 };
  const s = STOCKS[sym];
  return { seed: s.seed, start: s.start, end: s.price, vMin: 100, vMax: 600 };
}

export default function PSX() {
  const [sym, setSym] = useState("KSE-100");
  const [tf, setTf] = useState<string>("6M");
  const [type, setType] = useState<"candle" | "line">("candle");
  const [mas, setMas] = useState<string[]>(["MA20", "MA50"]);
  const [moverTab, setMoverTab] = useState<"Gainers" | "Losers" | "Most Active">("Gainers");
  const [signalFilter, setSignalFilter] = useState<string>("All");

  const meta = symbolMeta(sym);
  const full = useMemo(
    () => generateOHLCV(meta.seed, meta.start, meta.end, 180, meta.vMin, meta.vMax),
    [sym],
  );
  const data = full.slice(-tfDays(tf));
  const last = data[data.length - 1];
  const first = data[0];
  const chg = last.close - first.open;
  const chgPct = (chg / first.open) * 100;

  const movers = useMemo(() => {
    const arr = [...STOCK_LIST];
    if (moverTab === "Gainers") return arr.filter((s) => s.changePct > 0).sort((a, b) => b.changePct - a.changePct).slice(0, 6);
    if (moverTab === "Losers") return arr.sort((a, b) => a.changePct - b.changePct).slice(0, 6);
    return arr.sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)).slice(0, 6);
  }, [moverTab]);

  const screened = STOCK_LIST.filter((s) => signalFilter === "All" || s.signal === signalFilter);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Index overview */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {INDICES.map((idx) => {
          const spark = generateOHLCV(idx.seed, idx.start, idx.end, 7).map((c) => c.close);
          return (
            <Card key={idx.name}>
              <div className="text-xs font-medium text-text-secondary">{idx.name}</div>
              <div className="mt-1 font-mono text-lg font-bold tabular-nums text-text-primary">{fmtNum(idx.value)}</div>
              <div className="flex items-center justify-between">
                <Change value={`+${fmtNum(idx.change)}`} pct={idx.changePct} />
              </div>
              <div className="mt-1"><Sparkline data={spark} color="#00d4aa" /></div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[65fr_35fr]">
        {/* Chart column */}
        <div className="space-y-4">
          <Card hover={false} className="bg-surface-alt p-3">
            {/* Toolbar */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <select
                value={sym}
                onChange={(e) => setSym(e.target.value)}
                className="rounded-[6px] border border-border bg-elevated px-2.5 py-1.5 text-sm font-medium text-text-primary"
              >
                {SYMBOLS.map((s) => (
                  <option key={s} value={s}>{s === "KSE-100" ? "KSE-100 Index" : `${s} · ${STOCKS[s].name}`}</option>
                ))}
              </select>
              <div className="flex gap-1">
                {TIMEFRAMES.map((t) => (
                  <button key={t} onClick={() => setTf(t)} className={cn("rounded-[6px] px-2 py-1 text-xs font-medium", tf === t ? "bg-bull text-bull-foreground" : "text-text-secondary hover:bg-hover")}>{t}</button>
                ))}
              </div>
              <div className="ml-auto flex gap-1">
                <button onClick={() => setType("candle")} className={cn("rounded-[6px] p-1.5", type === "candle" ? "bg-bull/15 text-bull" : "text-text-secondary hover:bg-hover")}><CandleIcon className="h-4 w-4" /></button>
                <button onClick={() => setType("line")} className={cn("rounded-[6px] p-1.5", type === "line" ? "bg-bull/15 text-bull" : "text-text-secondary hover:bg-hover")}><LineIcon className="h-4 w-4" /></button>
                {INDICATORS.map((m) => (
                  <button key={m} onClick={() => setMas((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]))} className={cn("rounded-[6px] px-2 py-1 text-[10px] font-medium", mas.includes(m) ? "bg-info/20 text-info" : "text-text-muted hover:bg-hover")}>{m}</button>
                ))}
              </div>
            </div>

            {/* Price overlay */}
            <div className="mb-2 flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-2xl font-bold tabular-nums text-text-primary">{fmtNum(last.close)}</span>
              <Change value={`${chg >= 0 ? "+" : ""}${fmtNum(chg)}`} pct={chgPct} />
              <span className="font-mono text-xs tabular-nums text-text-muted">
                O {fmtNum(first.open)} · H {fmtNum(Math.max(...data.map((d) => d.high)))} · L {fmtNum(Math.min(...data.map((d) => d.low)))} · Vol {last.volume}M
              </span>
            </div>

            <div className="h-[300px] lg:h-[480px]">
              <CandlestickChart data={data} height={9999} mas={mas} />
            </div>
          </Card>

          {/* AI signal bar */}
          <div className="rounded-[8px] border border-border border-l-4 border-l-ai bg-ai-tint p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex items-center gap-2 text-sm font-semibold text-ai"><Sparkles className="h-4 w-4" />AI Analysis</div>
              <p className="flex-1 text-xs leading-relaxed text-text-secondary">
                KSE-100 is trading above both MA20 and MA50 with strong volume confirmation. RSI at 58 — bullish momentum without being overbought. Banking and Tech sectors leading gains today.
              </p>
              <div className="text-right">
                <SignalBadge signal="STRONG BUY" />
                <div className="mt-1 text-xs font-medium text-bull">BULLISH · Confidence 72%</div>
              </div>
            </div>
            <p className="mt-2 text-[10px] italic text-text-muted">Based on technical indicators only. Not financial advice.</p>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-text-primary">Watchlist</h3>
              <button className="flex items-center gap-1 text-xs font-medium text-bull"><Plus className="h-3.5 w-3.5" />Add Stock</button>
            </div>
            <div className="space-y-1">
              {["HBL", "ENGRO", "LUCK", "OGDC"].map((tk) => {
                const s = STOCKS[tk];
                return (
                  <Link to="/psx/$ticker" params={{ ticker: tk }} key={tk} className="flex items-center gap-2 rounded-[6px] px-2 py-1.5 hover:bg-hover">
                    <Star className="h-3.5 w-3.5 text-bull" fill="#00d4aa" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-bull">{tk}</div>
                      <div className="text-[10px] text-text-muted">{s.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm tabular-nums text-text-primary">{fmtNum(s.price)}</div>
                      <Change pct={s.changePct} />
                    </div>
                    <SignalBadge signal={s.signal} />
                  </Link>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="mb-2 flex gap-1">
              {(["Gainers", "Losers", "Most Active"] as const).map((t) => (
                <button key={t} onClick={() => setMoverTab(t)} className={cn("rounded-[6px] px-2.5 py-1 text-xs font-medium", moverTab === t ? "bg-bull/15 text-bull" : "text-text-secondary hover:bg-hover")}>{t}</button>
              ))}
            </div>
            <table className="w-full text-xs">
              <tbody>
                {movers.map((s, i) => (
                  <tr key={s.ticker} className={cn(i % 2 ? "bg-surface-alt" : "bg-surface")}>
                    <td className="py-1.5 pl-2 text-text-muted">{i + 1}</td>
                    <td className="font-semibold text-text-primary">{s.ticker}</td>
                    <td className="text-right font-mono tabular-nums text-text-primary">{fmtNum(s.price)}</td>
                    <td className="px-2 text-right"><Change pct={s.changePct} /></td>
                    <td className="pr-2 text-right font-mono tabular-nums text-text-muted">{s.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <h3 className="mb-2 text-sm font-semibold text-text-primary">Sector Heatmap</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {SECTORS.map((s) => {
                const up = s.pct >= 0;
                const intensity = Math.min(Math.abs(s.pct) / 2.6, 1);
                const bg = up ? `rgba(0,212,170,${0.15 + intensity * 0.55})` : `rgba(229,72,77,${0.15 + intensity * 0.55})`;
                return (
                  <div key={s.name} className="rounded-[6px] p-2" style={{ background: bg }}>
                    <div className="text-[10px] text-text-primary/90">{s.name}</div>
                    <div className="font-mono text-sm font-bold tabular-nums text-text-primary">{up ? "+" : ""}{s.pct.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Screener */}
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Filter className="h-4 w-4 text-text-secondary" />
          <h3 className="text-sm font-semibold text-text-primary">Stock Screener</h3>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(["All", "STRONG BUY", "BUY", "HOLD", "SELL", "STRONG SELL"] as (string | Signal)[]).map((f) => (
            <button key={f} onClick={() => setSignalFilter(f)} className={cn("rounded-full px-3 py-1 text-xs font-medium", signalFilter === f ? "bg-bull text-bull-foreground" : "border border-border text-text-secondary hover:bg-hover")}>{f}</button>
          ))}
        </div>
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[640px] text-xs">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="py-2">Stock</th><th>Sector</th><th className="text-right">Price</th><th className="text-right">Change</th><th className="text-center">Signal</th><th className="text-right">RSI</th><th className="text-right">Volume</th><th className="pr-2 text-right">Mkt Cap</th>
              </tr>
            </thead>
            <tbody>
              {screened.map((s, i) => (
                <tr key={s.ticker} className={cn("cursor-pointer hover:bg-hover", i % 2 ? "bg-surface-alt" : "")}>
                  <td className="py-2"><Link to="/psx/$ticker" params={{ ticker: s.ticker }} className="font-semibold text-bull">{s.ticker}</Link></td>
                  <td className="text-text-secondary">{s.sector}</td>
                  <td className="text-right font-mono tabular-nums text-text-primary">{fmtNum(s.price)}</td>
                  <td className="text-right"><Change pct={s.changePct} /></td>
                  <td className="text-center"><SignalBadge signal={s.signal} /></td>
                  <td className="text-right font-mono tabular-nums">
                    <span className={cn(s.rsi > 70 ? "text-bear" : s.rsi < 30 ? "text-bull" : "text-text-secondary")} title={s.rsi > 70 ? "Overbought" : s.rsi < 30 ? "Oversold" : "Neutral"}>
                      {s.rsi}
                      {s.rsi > 70 ? " OB" : s.rsi < 30 ? " OS" : ""}
                    </span>
                  </td>
                  <td className="text-right font-mono tabular-nums text-text-secondary">{s.volume}</td>
                  <td className="pr-2 text-right font-mono tabular-nums text-text-secondary">{s.marketCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
