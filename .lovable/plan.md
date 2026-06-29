## Goal
Make Urdu mode actually translate the entire authenticated app. Today large areas stay English because (a) several screens never call `t()`, (b) many JSX strings inside "translated" screens are hardcoded, and (c) data-driven labels (categories, goal text, chart legends, signals) are never passed through `t()`. The public landing page (`index.tsx`) stays English.

## Root causes (from the screenshots)
- **Savings Goals**: goal names (Honda City, Emergency Fund, Hajj Fund) and AI advice sentences come from `finance-data.ts` and are rendered raw — never translated.
- **Spending donut**: legend labels (Food, Transport, Utilities, Shopping, Other), "PKR total" tooltip/center, and tooltip text in `charts.tsx` are hardcoded; `charts.tsx` doesn't use `useLang`.
- **PSX**: "KSE All Share", the info tooltip paragraph, "LIVE", index names, timeframe buttons (All/1Y/6M/3M/1M/1W/1D), "Watchlist", "+ Add Stock", "STRONG BUY" etc. are hardcoded.
- Whole screens with **no** `t()`: `learn.tsx`, `learn.index.tsx`, `learn.lesson.$id.tsx`, `plans.tsx`, `stock.$ticker.tsx`, plus `charts.tsx` and `SignalBadge.tsx`.

## Plan

### 1. Expand the dictionary (`src/hooks/use-lang.ts`)
Add Urdu entries for every user-facing string surfaced across the app, grouped by section. This includes:
- Remaining static UI labels in app/portfolio/psx/finance/alerts/settings not yet present.
- **Learn** hub + lesson screens (titles, levels Beginner/Intermediate/Advanced, statuses Locked/Completed, durations suffix "min", buttons, descriptions).
- **Plans** screen (plan names, feature bullets, CTA, billing labels).
- **Stock detail** screen (section headings, stats, signal labels, buttons).
- **Charts**: legend category names, "PKR total", tooltip labels, axis/series names, timeframe codes.
- **Signals**: STRONG BUY / BUY / HOLD / SELL / STRONG SELL.
- **Data-driven enumerable labels**: spending categories (Food & Dining, Transport, Utilities, Shopping, Groceries, Subscriptions, Savings, Income, Other), sectors, account names, goal names, and the specific AI/goal advice sentences + transaction merchant names used in the dummy data (since data is fixed sample content, each distinct string gets an entry).
- PSX index names + the KSE All Share tooltip paragraph + "LIVE".

### 2. Route every rendered string through `t()`
For each app screen, wrap hardcoded JSX text and data-bound display strings with `t(...)`:
- `learn.tsx`, `learn.index.tsx`, `learn.lesson.$id.tsx` — add `useLang`, wrap all labels and map lesson data fields (title/level/status) through `t()`.
- `plans.tsx` — add `useLang`, wrap all plan copy.
- `stock.$ticker.tsx` — add `useLang`, wrap headings/labels/buttons.
- `charts.tsx` — add `useLang`, translate legend names, center "PKR total", and tooltip labels.
- `SignalBadge.tsx` — translate the signal text.
- `app.tsx`, `portfolio.tsx`, `psx.tsx`, `finance.tsx`, `alerts.tsx`, `settings.tsx` — audit and wrap any remaining hardcoded strings (timeframes, tooltips, watchlist, "LIVE", section captions, goal cards, transaction categories, etc.).

### 3. Translate data labels at the render boundary
Where components render values from `data.ts` / `finance-data.ts` (categories, sectors, signals, goal names, goal AI text, merchant names), apply `t(value)` at render time rather than mutating the data files. Unknown strings fall back to the original via the existing `translate()` fallback, so English data degrades gracefully.

### 4. Verify
- Typecheck.
- Toggle Urdu in Settings and spot-check Dashboard (goals + donut legend/tooltip), PSX (ticker tape, KSE cards, tooltip, timeframes, watchlist), Finance, Portfolio, Learn, Plans, Stock detail, Alerts — confirm no stray English UI labels remain (numbers/tickers like HBL, PKR figures intentionally stay).

## Notes / scope
- Landing page (`index.tsx`), `__root.tsx`, and raw stock tickers / numeric values are intentionally left as-is.
- Proper nouns that are normally kept in English (PSX, KSE-100, stock symbols) stay; only descriptive labels are translated.
- No backend or business-logic changes — this is presentation/i18n only.