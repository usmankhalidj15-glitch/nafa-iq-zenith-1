import {
  Area,
  AreaChart,
  Bar,
  ComposedChart,
  Line,
  LineChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { type Candle, fmtNum, sma } from "@/lib/data";

export function Sparkline({ data, color }: { data: number[]; color: string }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={d} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

const CandleShape = (props: any) => {
  const { x, width, y, height, payload } = props;
  if (y == null || height == null) return null;
  const { open, close, high, low } = payload;
  const up = close >= open;
  const color = up ? "#00d4aa" : "#e5484d";
  const span = high - low || 1;
  const ratio = height / span;
  const yOpen = y + (high - open) * ratio;
  const yClose = y + (high - close) * ratio;
  const bodyTop = Math.min(yOpen, yClose);
  const bodyH = Math.max(Math.abs(yClose - yOpen), 1);
  const cx = x + width / 2;
  return (
    <g>
      <line x1={cx} y1={y} x2={cx} y2={y + height} stroke={color} strokeWidth={1} />
      <rect x={x + width * 0.18} y={bodyTop} width={width * 0.64} height={bodyH} fill={color} rx={1} />
    </g>
  );
};

function OHLCTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload as Candle;
  if (!p) return null;
  const up = p.close >= p.open;
  const chg = p.close - p.open;
  return (
    <div className="rounded-[8px] border border-border-hover bg-elevated p-3 text-xs shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="mb-1 font-medium text-text-secondary">{p.date}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono tabular-nums text-text-primary">
        <span className="text-text-muted">O</span><span>{fmtNum(p.open)}</span>
        <span className="text-text-muted">H</span><span>{fmtNum(p.high)}</span>
        <span className="text-text-muted">L</span><span>{fmtNum(p.low)}</span>
        <span className="text-text-muted">C</span><span>{fmtNum(p.close)}</span>
        <span className="text-text-muted">Vol</span><span>{p.volume}M</span>
      </div>
      <div className={`mt-1 font-mono text-xs ${up ? "text-bull" : "text-bear"}`}>
        {up ? "+" : ""}{fmtNum(chg)} ({((chg / p.open) * 100).toFixed(2)}%)
      </div>
    </div>
  );
}

export function CandlestickChart({
  data,
  height = 480,
  mas = ["MA20", "MA50"],
}: {
  data: Candle[];
  height?: number;
  mas?: string[];
}) {
  const ma20 = sma(data, 20);
  const ma50 = sma(data, 50);
  const ma200 = sma(data, 200);
  const enriched = data.map((c, i) => ({
    ...c,
    range: [c.low, c.high] as [number, number],
    ma20: ma20[i],
    ma50: ma50[i],
    ma200: ma200[i],
  }));
  const maxVol = Math.max(...data.map((d) => d.volume));
  const lows = Math.min(...data.map((d) => d.low));
  const highs = Math.max(...data.map((d) => d.high));
  const pad = (highs - lows) * 0.08;

  return (
    <ResponsiveContainer width="100%" height={height >= 9999 ? "100%" : height}>
      <ComposedChart data={enriched} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#1a2535" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} minTickGap={48} axisLine={{ stroke: "#1a2535" }} tickLine={false} />
        <YAxis yAxisId="price" orientation="right" domain={[lows - pad, highs + pad]} tick={{ fill: "#64748b", fontSize: 10 }} width={56} axisLine={false} tickLine={false} tickFormatter={(v) => fmtNum(v, 0)} />
        <YAxis yAxisId="vol" domain={[0, maxVol * 5]} hide />
        <Tooltip content={<OHLCTooltip />} cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }} />
        <Bar yAxisId="vol" dataKey="volume" isAnimationActive={false}>
          {enriched.map((c, i) => (
            <Cell key={i} fill={c.close >= c.open ? "#00d4aa" : "#e5484d"} fillOpacity={0.35} />
          ))}
        </Bar>
        <Bar yAxisId="price" dataKey="range" shape={<CandleShape />} isAnimationActive={false} />
        {mas.includes("MA20") && <Line yAxisId="price" dataKey="ma20" stroke="#f59e0b" dot={false} strokeWidth={1.2} isAnimationActive={false} />}
        {mas.includes("MA50") && <Line yAxisId="price" dataKey="ma50" stroke="#3b82f6" dot={false} strokeWidth={1.2} isAnimationActive={false} />}
        {mas.includes("MA200") && <Line yAxisId="price" dataKey="ma200" stroke="#8b5cf6" dot={false} strokeWidth={1.2} isAnimationActive={false} />}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function PortfolioAreaChart({
  data,
  height = 300,
  showBenchmark = true,
}: {
  data: { label: string; value: number; benchmark: number }[];
  height?: number;
  showBenchmark?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="tealFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#1a2535" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#1a2535" }} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} width={56} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
        <Tooltip contentStyle={{ background: "#1a2332", border: "1px solid #2a3a50", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} />
        <Area type="monotone" dataKey="value" name="Portfolio" stroke="#00d4aa" strokeWidth={2} fill="url(#tealFill)" isAnimationActive={false} />
        {showBenchmark && (
          <Line type="monotone" dataKey="benchmark" name="KSE-100" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
}: {
  data: { name: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
}) {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={2} stroke="none" isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#1a2332", border: "1px solid #2a3a50", borderRadius: 8, fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-sm font-bold tabular-nums text-text-primary">{centerValue}</span>
          {centerLabel && <span className="text-[10px] text-text-muted">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

export function IncomeExpenseChart({
  data,
}: {
  data: { month: string; income: number; expense: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#1a2535" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#1a2535" }} tickLine={false} />
        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} width={48} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000).toFixed(0) + "k"} />
        <Tooltip contentStyle={{ background: "#1a2332", border: "1px solid #2a3a50", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#94a3b8" }} cursor={{ fill: "#1f2d40", fillOpacity: 0.4 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="income" name="Income" fill="#00d4aa" radius={[3, 3, 0, 0]} isAnimationActive={false} />
        <Bar dataKey="expense" name="Expense" fill="#e5484d" radius={[3, 3, 0, 0]} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
