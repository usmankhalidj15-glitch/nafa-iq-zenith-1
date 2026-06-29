## Problem

On the PSX Market chart, the toolbar buttons (candle/line type and MA20/MA50/MA200) highlight when clicked but the chart itself never changes. Two real bugs cause this:

1. **Candle vs. Line toggle does nothing.** The component tracks a `type` state (`"candle" | "line"`), but the render always shows `<CandlestickChart>` regardless of `type` (`src/routes/psx.tsx:253`). There is no line-chart variant, so switching type has zero effect on the chart.

2. **MA200 toggle does nothing visible.** The price series is generated with only 180 data points (`src/routes/psx.tsx:105`, and `tfDays` caps at 180). A 200-period moving average needs ≥200 points, so `sma(data, 200)` returns all-empty values and the MA200 line never appears. MA20/MA50 do work — but MA200 looks broken.

## Fix

### 1. Add a line-chart variant (`src/components/charts.tsx`)
- Add a new `PriceLineChart` export that renders the closing price as a single line (theme-aware teal, reusing the existing `useChartTheme`), with the same axes, grid, tooltip, and MA20/MA50/MA200 overlays the candlestick chart already supports (driven by the same `mas` prop).
- Keep `CandlestickChart` unchanged for dark theme parity; the line chart reuses the same color tokens.

### 2. Switch chart by type (`src/routes/psx.tsx`)
- Import `PriceLineChart`.
- Replace the single `<CandlestickChart .../>` render with a conditional: render `PriceLineChart` when `type === "line"`, otherwise `CandlestickChart`. Both receive the same `data`, `height`, and `mas` props.

### 3. Make MA200 produce a visible line (`src/routes/psx.tsx`)
- Increase the generated full series length from 180 to ~250 days so a 200-period average has enough data.
- Update `tfDays` so the longer ranges expose enough points for MA200 (e.g. `1Y` and `All` map to ~250). Shorter timeframes (1D–6M) stay as-is; on those, MA200 legitimately has little/no data, which is expected behavior on a short window.

## Result
- Clicking the candle icon shows candles; clicking the line icon shows a clean price line — both with the active MA overlays.
- MA20 / MA50 / MA200 each visibly add/remove their line (MA200 now has data on 1Y/All).
- No changes to the dark theme look or to any other screen.