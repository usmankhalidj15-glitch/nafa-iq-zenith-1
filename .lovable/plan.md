# UI/UX + Motion Polish Pass

Goal: raise perceived quality across the whole app using the UI/UX-pro-max design principles and the existing framer-motion system. Everything here is **additive polish** — no features, routes, data, or copy are removed, and the design tokens/brand stay as-is (dark-only, teal primary, gold accent).

## Guardrails
- No feature removal, no route changes, no backend/data changes.
- Reuse existing tokens in `src/styles.css` and existing helpers in `src/components/animations.tsx` (`Reveal`, `RevealGroup`, `Magnetic`, `CountUp`, `SPRING_*`, `EASE`, `fadeUp`). No new color values, no new fonts.
- Respect `useReducedMotion` on every new animation (the existing helpers already do).
- Keep changes presentational (className + motion props only).

## 1. AppShell / navigation
- Add an animated active-nav indicator using framer-motion `layoutId` (shared "pill" that slides between sidebar/mobile items) instead of a static highlight.
- Add smooth route-transition wrapper (`AnimatePresence` + subtle fade/translate) around the main content `Outlet` so screen changes feel intentional.
- Polish hover/press states on nav items and buttons (consistent `whileHover`/`whileTap` scale, spring easing).
- Sidebar collapse/expand: ensure width + label transitions are spring-eased and content doesn't jump.
- Mobile bottom nav: refine active-state motion and tap feedback.

## 2. Landing page (`/`)
- Audit spacing/hierarchy rhythm section-by-section (consistent vertical spacing scale, heading sizes, max-widths).
- Ensure every major section reveals on scroll via `Reveal`/`RevealGroup` with consistent stagger (fix any sections that pop in without motion).
- Strengthen hero: refined entrance sequence, keep existing particles/tilt/CTA, tighten CTA button micro-interactions (magnetic + press).
- Feature cards / pricing / FAQ: consistent hover lift, border-glow on hover using existing tokens, uniform corner radii.
- Verify counts use `CountUp`; make number reveals consistent.

## 3. App dashboard & core routes (`/app`, `/psx`, `/portfolio`, `/finance`)
- Consistent card entrance stagger on mount (KPI cards, tables, charts) via `RevealGroup`.
- Uniform hover elevation + focus-visible states across cards, list rows, and interactive controls.
- Ensure numeric/price values consistently use mono + tabular-nums and `Change`/`SignalBadge` styling is uniform.
- Light empty/loading state motion where trivially applicable (no new data logic).

## 4. Cross-app consistency (light-touch)
- Standardize interactive feedback: one shared hover/press spring, consistent focus rings using `--color-ring`.
- Consistent border/glass treatment on cards (align to the existing glass-card language in memory).
- Accessibility: focus-visible outlines, reduced-motion fallbacks, sufficient tap targets on mobile.

## Verification
- Typecheck/build passes.
- Screenshot landing, `/app`, `/psx` via headless browser (desktop + mobile viewport) to confirm layout intact and motion present.
- Manually confirm reduced-motion path renders static content.
- Confirm no route, feature, or copy was removed by diffing touched files.

## Technical notes
- Files likely touched: `src/components/AppShell.tsx`, `src/routes/index.tsx`, `src/routes/app.tsx`, `src/routes/psx.tsx`, `src/routes/portfolio.tsx`, `src/routes/finance.tsx`, and possibly small additions to `src/components/animations.tsx` (e.g. a reusable `NavIndicator`/`PageTransition` helper) and shared card components.
- New motion helpers, if any, go in `animations.tsx` to keep the motion language centralized.
- I'll work in the order: AppShell → landing → dashboard/core → consistency sweep, verifying build after each area.