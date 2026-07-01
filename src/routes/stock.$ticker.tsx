import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Circle } from "lucide-react";
import { Card } from "@/components/Card";
import { Change } from "@/components/Change";
import { SignalBadge } from "@/components/SignalBadge";
import { CandlestickChart } from "@/components/charts";
import { CountUpNumber } from "@/components/CountUpNumber";
import { Typewriter } from "@/components/Typewriter";
import { STOCKS, generateOHLCV, fmtNum } from "@/lib/data";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/use-lang";

export const Route = createFileRoute("/stock/$ticker")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.ticker} — NafaIQ` },
      {
        name: "description",
        content: `${params.ticker} price chart, AI technical analysis and signal breakdown on NafaIQ.`,
      },
    ],
  }),
  component: StockDetail,
});

const SIGNAL_ROWS = [
  { ind: "RSI (14)", value: "61.2", reading: "Neutral-Bullish", sig: "BUY" },
  { ind: "MA20 vs Price", value: "Above", reading: "Price > MA20", sig: "BUY" },
  { ind: "MA50 vs Price", value: "Above", reading: "Price > MA50", sig: "BUY" },
  { ind: "MACD", value: "+2.34", reading: "Bullish cross", sig: "BUY" },
  { ind: "Volume Trend", value: "+34%", reading: "Rising", sig: "BUY" },
  { ind: "Bollinger Band", value: "Mid-upper", reading: "Room to grow", sig: "HOLD" },
] as const;

const NEWS = [
  {
    source: "Business Recorder",
    headline: "Banking sector rallies as policy rate held steady",
    time: "2h ago",
    sentiment: "Positive",
  },
  {
    source: "Dawn Business",
    headline: "Foreign inflows lift PSX to fresh highs",
    time: "5h ago",
    sentiment: "Positive",
  },
  {
    source: "The News",
    headline: "Analysts eye resistance near key levels",
    time: "1d ago",
    sentiment: "Neutral",
  },
];

function StockDetail() {
  const { ticker } = useParams({ from: "/stock/$ticker" });
  const { t } = useLang();
  const s = STOCKS[ticker] ?? STOCKS.HBL;
  const data = generateOHLCV(s.seed, s.start, s.price, 180, 100, 600);
  const chg = +(s.price * (s.changePct / 100)).toFixed(2);

  const stats: [string, string][] = [
    ["Market Cap", `PKR ${s.marketCap}`],
    ["P/E Ratio", "8.4"],
    ["EPS", "PKR 16.97"],
    ["52W High", "158.20"],
    ["52W Low", "98.50"],
    ["Avg Volume", s.volume],
    ["Dividend Yield", "4.2%"],
    ["Book Value", "PKR 118.40"],
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        to="/psx"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> {t("Back to Market")}
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {s.ticker} · {s.name}
          </h1>
          <p className="text-sm text-text-secondary">{t(s.sector)} {t("Sector")}</p>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold tabular-nums text-text-primary">
              <CountUpNumber value={s.price} decimals={2} />
            </span>
            <Change value={`${chg >= 0 ? "+" : ""}${fmtNum(chg)}`} pct={s.changePct} />
          </div>
        </div>
        <div className="text-right">
          <SignalBadge signal={s.signal} className="text-xs" />
          <div className="mt-1 text-xs text-text-muted">{t("Confidence 5/6 indicators")}</div>
        </div>
      </div>

      <Card hover={false} className="bg-surface-alt">
        <div className="h-[300px] lg:h-[440px]">
          <CandlestickChart data={data} height={9999} mas={["MA20", "MA50"]} />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([l, v]) => (
          <Card key={l}>
            <div className="text-xs text-text-muted">{t(l)}</div>
            <div className="mt-1 font-mono text-sm font-bold tabular-nums text-text-primary">
              {v}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Sparkles className="h-4 w-4 text-ai" />
          {t("AI Technical Analysis")}
        </h3>
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full min-w-[480px] text-xs">
            <thead>
              <tr className="border-b border-border text-left text-text-muted">
                <th className="py-2">{t("Indicator")}</th>
                <th>{t("Value")}</th>
                <th>{t("Reading")}</th>
                <th className="text-right">{t("Signal")}</th>
              </tr>
            </thead>
            <tbody>
              {SIGNAL_ROWS.map((r) => (
                <tr key={r.ind} className="border-b border-border/50">
                  <td className="py-2 text-text-primary">{t(r.ind)}</td>
                  <td className="font-mono tabular-nums text-text-secondary">{t(r.value)}</td>
                  <td className="text-text-secondary">{t(r.reading)}</td>
                  <td className="text-right">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 font-semibold",
                        r.sig === "BUY" ? "text-bull" : "text-text-secondary",
                      )}
                    >
                      <Circle
                        className={cn(
                          "h-2 w-2",
                          r.sig === "BUY"
                            ? "fill-bull text-bull"
                            : "fill-text-muted text-text-muted",
                        )}
                      />{" "}
                      {t(r.sig)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-[6px] bg-bull/10 px-3 py-2 text-sm font-semibold text-bull">
          {t("Overall: STRONG BUY · 5 of 6 indicators bullish")}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          <Typewriter
            id={`stock-ai-${s.ticker}`}
            text={`${s.ticker} ${t(
              "is showing strong bullish momentum. Price has broken above MA50 with significantly above-average volume — a classic confirmation signal. RSI at 61 leaves room before overbought territory. The only caution is Bollinger Band position suggesting the move may slow near 148–150. Consider a stop-loss at the MA20 level (~136).",
            )}`}
          />
        </p>
        <p className="mt-2 text-[11px] italic text-text-muted">
          {t("This is AI-generated technical analysis only. Not financial advice.")}
        </p>
      </Card>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">{t("Recent News")}</h3>
        <div className="space-y-2">
          {NEWS.map((n) => (
            <div
              key={n.headline}
              className="flex items-center gap-3 rounded-[6px] border border-border bg-surface-alt p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-elevated text-xs font-bold text-text-secondary">
                {n.source[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm text-text-primary">{t(n.headline)}</div>
                <div className="text-[11px] text-text-muted">
                  {n.source} · {t(n.time)}
                </div>
              </div>
              <span
                className={cn(
                  "rounded-[4px] px-2 py-0.5 text-[10px] font-medium",
                  n.sentiment === "Positive"
                    ? "bg-bull/15 text-bull"
                    : "bg-neutral/20 text-text-secondary",
                )}
              >
                {t(n.sentiment)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <button className="rounded-[10px] border border-white/[0.08] bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.16]">
          {t("Add to Watchlist")}
        </button>
        <button className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110">
          {t("Add to Portfolio")}
        </button>
        <button className="rounded-[10px] border border-white/[0.08] bg-surface px-4 py-2 text-sm font-semibold text-text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.16]">
          {t("Set Price Alert")}
        </button>
      </div>
    </div>
  );
}
