import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Plus,
  Search,
  Check,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  Percent,
  Lightbulb,
} from "lucide-react";
import { EmojiIcon } from "@/components/icons";
import { Card } from "@/components/Card";
import { IncomeExpenseChart, Sparkline } from "@/components/charts";
import { fmtPKR } from "@/lib/data";
import { TRANSACTIONS, BUDGETS, BILLS, GOALS, INCOME_EXPENSE } from "@/lib/finance-data";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/use-lang";

export const Route = createFileRoute("/finance")({
  head: () => ({
    meta: [
      { title: "Finance — NafaIQ" },
      {
        name: "description",
        content: "Track income, expenses, budgets, bills and savings goals with AI guidance.",
      },
    ],
  }),
  component: Finance,
});

const TABS = ["Overview", "Transactions", "Budgets", "Bills", "Goals"] as const;
type Tab = (typeof TABS)[number];

const CAT_COLOR: Record<string, string> = {
  Utilities: "#3b82f6",
  Income: "#00d4aa",
  "Food & Dining": "#f59e0b",
  Transport: "#8b5cf6",
  Groceries: "#00d4aa",
  Subscriptions: "#e5484d",
  Shopping: "#8b5cf6",
  Savings: "#6b7280",
};

function Finance() {
  const { t: tr } = useLang();
  const [tab, setTab] = useState<Tab>("Overview");
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
          {tr("Personal Finance")}
        </h1>
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-surface/60 backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-bull" />
        </div>
      </div>
      <div className="scrollbar-none flex gap-1 overflow-x-auto rounded-[10px] border border-white/[0.06] bg-surface p-1">
        {TABS.map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              tab === tb
                ? "bg-primary/10 text-primary"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {tr(tb)}
          </button>
        ))}
      </div>

      {tab === "Overview" && <Overview />}
      {tab === "Transactions" && <Transactions />}
      {tab === "Budgets" && <Budgets />}
      {tab === "Bills" && <Bills />}
      {tab === "Goals" && <Goals />}

      {tab === "Transactions" && (
        <button className="safe-bottom fixed right-4 bottom-20 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-bull text-bull-foreground shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:brightness-110 lg:bottom-8">
          <Plus className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

/* ---------- count-up hook (animates a number when it scrolls into view) ---------- */
function useCountUp(target: number, decimals = 0, duration = 1200) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [val, setVal] = useState(reduce ? target : 0);

  useEffect(() => {
    if (reduce) {
      setVal(target);
      return;
    }
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduce]);

  const formatted =
    decimals > 0
      ? val.toLocaleString("en-PK", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(val).toLocaleString("en-PK");
  return { ref, formatted };
}

/* ---------- glass KPI card ---------- */
function KpiCard({
  index = 0,
  accent,
  children,
}: {
  index?: number;
  accent: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[14px] border border-white/[0.06] bg-surface p-6 transition-colors duration-200 hover:border-white/[0.12]"
    >
      {/* accent glow on hover */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
        style={{ background: accent }}
      />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

function KpiLabel({ children }: { children: React.ReactNode }) {
  const { t } = useLang();
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
      {typeof children === "string" ? t(children) : children}
    </div>
  );
}

function Overview() {
  const { t } = useLang();
  const income = useCountUp(47500);
  const expenses = useCountUp(18675);
  const savings = useCountUp(28825);
  const rate = useCountUp(60.7, 1);

  return (
    <div className="relative space-y-4">
      {/* ambient background glows */}
      <div className="pointer-events-none absolute -right-16 -top-10 h-64 w-64 rounded-full bg-ai/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-16 top-1/2 h-64 w-64 rounded-full bg-bull/5 blur-[100px]" />

      <div className="relative z-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {/* Monthly Income */}
        <KpiCard index={0} accent="rgba(0,212,170,0.5)">
          <div
            className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px]"
            style={{ background: "rgba(0,212,170,0.12)" }}
          >
            <ArrowUpRight className="h-5 w-5 text-bull" />
          </div>
          <KpiLabel>Monthly Income</KpiLabel>
          <div className="mt-1 font-mono text-lg font-semibold tracking-tight text-bull tabular-nums sm:text-xl">
            PKR <span ref={income.ref}>{income.formatted}</span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <span className="text-[10px] text-bull/80 sm:text-[11px]">
              +PKR 2,500 vs last month
            </span>
            <div className="w-14 shrink-0">
              <Sparkline data={[43000, 45000, 47500]} color="#00d4aa" />
            </div>
          </div>
        </KpiCard>

        {/* Total Expenses */}
        <KpiCard index={1} accent="rgba(229,72,77,0.45)">
          <div
            className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px]"
            style={{ background: "rgba(229,72,77,0.12)" }}
          >
            <ArrowDownRight className="h-5 w-5 text-bear" />
          </div>
          <KpiLabel>Total Expenses</KpiLabel>
          <div className="mt-1 font-mono text-lg font-semibold tracking-tight text-bear tabular-nums sm:text-xl">
            PKR <span ref={expenses.ref}>{expenses.formatted}</span>
          </div>
          <div className="mt-3 flex items-end justify-between gap-2">
            <span className="text-[10px] text-bear/90 sm:text-[11px]">-12% vs last month</span>
            <div className="w-14 shrink-0">
              <Sparkline data={[22000, 21200, 18675]} color="#e5484d" />
            </div>
          </div>
        </KpiCard>

        {/* Net Savings */}
        <KpiCard index={2} accent="rgba(139,92,246,0.45)">
          <div
            className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px]"
            style={{ background: "rgba(139,92,246,0.12)" }}
          >
            <PiggyBank className="h-5 w-5 text-ai" />
          </div>
          <KpiLabel>Net Savings</KpiLabel>
          <div className="kpi-value-neutral mt-1 font-mono text-lg font-semibold tracking-tight text-ai tabular-nums sm:text-xl">
            PKR <span ref={savings.ref}>{savings.formatted}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="text-[10px] text-text-muted sm:text-[11px]">{t("Saved this month")}</span>
            <span className="text-[10px] text-bull/80 sm:text-[11px]">+PKR 4,825</span>
          </div>
        </KpiCard>

        {/* Savings Rate */}
        <KpiCard index={3} accent="rgba(245,158,11,0.45)">
          <div
            className="mb-4 flex h-9 w-9 items-center justify-center rounded-[10px]"
            style={{ background: "rgba(245,158,11,0.12)" }}
          >
            <Percent className="h-5 w-5 text-warning" />
          </div>
          <KpiLabel>Savings Rate</KpiLabel>
          <div className="kpi-value-neutral mt-1 font-mono text-lg font-semibold tracking-tight text-warning tabular-nums sm:text-xl">
            <span ref={rate.ref}>{rate.formatted}</span>%
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-warning"
              initial={{ width: 0 }}
              whileInView={{ width: "60.7%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span
              className="rounded-full border border-warning/30 px-2 py-0.5 text-[10px] font-semibold text-warning"
              style={{ background: "rgba(245,158,11,0.1)" }}
            >
              Excellent
            </span>
            <span className="text-[10px] text-text-muted sm:text-[11px]">Goal: 65%</span>
          </div>
        </KpiCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 overflow-hidden rounded-3xl border border-white/10 bg-surface/60 p-5 backdrop-blur-xl sm:p-6"
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent" />
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary">
              {t("6-Month Overview")}
            </div>
            <div className="mt-0.5 text-[11px] text-text-muted">Jan 2026 — Jun 2026</div>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-text-secondary">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-bull" />
              {t("In")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-bear" />
              {t("Out")}
            </span>
          </div>
        </div>
        <div className="relative z-10 mt-4">
          <IncomeExpenseChart data={INCOME_EXPENSE} />
        </div>
        <div className="relative z-10 mt-3 text-center text-[11px] text-text-muted">
          6-month totals: Income PKR 2,85,000 · Expenses PKR 1,12,050 · Saved PKR 1,72,950
        </div>
      </motion.div>
    </div>
  );
}

function Transactions() {
  const { t: tr } = useLang();
  const grouped = TRANSACTIONS.reduce<Record<string, typeof TRANSACTIONS>>((acc, t) => {
    (acc[t.date] ??= []).push(t);
    return acc;
  }, {});
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-[6px] border border-border bg-surface px-3 py-2">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            placeholder={tr("Search transactions")}
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>
      </div>
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <div className="mb-1.5 text-xs font-semibold text-text-muted">{date}</div>
          <Card className="divide-y divide-border/50 p-0" hover={false}>
            {items.map((t, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm"
                  style={{ background: (CAT_COLOR[t.category] ?? "#6b7280") + "26" }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: CAT_COLOR[t.category] ?? "#6b7280" }}
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-text-primary">{t.merchant}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                    <span className="rounded-[4px] bg-elevated px-1.5 py-0.5">{tr(t.category)}</span>
                    {t.account}
                  </div>
                </div>
                <span
                  className={cn(
                    "font-mono text-sm font-medium tabular-nums",
                    t.amount >= 0 ? "text-bull" : "text-bear",
                  )}
                >
                  {t.amount >= 0 ? "+" : "-"}
                  {fmtPKR(Math.abs(t.amount))}
                </span>
              </div>
            ))}
          </Card>
        </div>
      ))}
    </div>
  );
}

function Budgets() {
  const { t } = useLang();
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const current = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const prev = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
  const shortMonth = (d: Date) => d.toLocaleString("en-US", { month: "short" });
  const longLabel = current.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4 text-sm text-text-secondary">
        <button onClick={() => setOffset((o) => o - 1)} className="hover:text-text-primary">
          ‹ {shortMonth(prev)}
        </button>
        <span className="font-semibold text-text-primary">{longLabel}</span>
        <button onClick={() => setOffset((o) => o + 1)} className="hover:text-text-primary">
          {shortMonth(next)} ›
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {BUDGETS.map((b) => {
          const pct = Math.round((b.spent / b.limit) * 100);
          const over = b.spent > b.limit;
          const color = over
            ? "bg-bear"
            : pct >= 90
              ? "bg-warning"
              : pct >= 80
                ? "bg-warning"
                : "bg-bull";
          return (
            <Card key={b.category}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">{t(b.category)}</span>
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums",
                    over ? "text-bear" : "text-text-secondary",
                  )}
                >
                  {fmtPKR(b.spent)} / {fmtPKR(b.limit)}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
                <div
                  className={cn("h-full rounded-full", color)}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              {b.tip && (
                <div className="mt-2 flex items-start gap-1.5 rounded-[6px] border-l-2 border-ai bg-ai-tint px-2.5 py-1.5 text-[11px] text-text-secondary">
                  <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-ai" strokeWidth={1.5} />
                  {t(b.tip)}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Bills() {
  const { t } = useLang();
  return (
    <div className="space-y-3">
      {BILLS.map((b) => (
        <Card key={b.name} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-sm font-bold text-text-secondary">
            {b.name[0]}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-text-primary">{t(b.name)}</div>
            <div className="text-[11px] text-text-muted">{t("Due")} {b.due}</div>
          </div>
          <span className="font-mono text-sm font-medium tabular-nums text-text-primary">
            {fmtPKR(b.amount)}
          </span>
          <span
            className={cn(
              "rounded-[4px] px-2 py-0.5 text-[10px] font-semibold",
              b.status === "DUE SOON"
                ? "bg-warning/20 text-warning"
                : "bg-elevated text-text-secondary",
            )}
          >
            {t(b.status)}
          </span>
          <button className="flex h-8 w-8 items-center justify-center rounded-full border border-bull text-bull hover:bg-bull/10">
            <Check className="h-4 w-4" />
          </button>
        </Card>
      ))}
      <button className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-dashed border-border py-3 text-sm font-medium text-text-secondary hover:border-bull hover:text-bull">
        <Plus className="h-4 w-4" />
        {t("Add Bill")}
      </button>
    </div>
  );
}

function Goals() {
  const { t } = useLang();
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {GOALS.map((g) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return (
          <Card key={g.name}>
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
              Target {fmtPKR(g.target)} · Saved {fmtPKR(g.saved)}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-elevated">
              <div
                className={cn("h-full rounded-full", g.color === "bull" ? "bg-bull" : "bg-warning")}
                style={{ width: `${pct}%` }}
              />
            </div>
            {g.date && (
              <div className="mt-2 text-[11px] text-text-muted">Target date: {g.date}</div>
            )}
            <div className="mt-2 rounded-[6px] border-l-2 border-ai bg-ai-tint px-2.5 py-1.5 text-[11px] text-text-secondary">
              <Sparkles className="mr-1 inline h-3 w-3 text-ai" />
              {g.ai}
            </div>
          </Card>
        );
      })}
      <button className="flex min-h-[120px] items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-border text-sm font-medium text-text-secondary hover:border-bull hover:text-bull">
        <Plus className="h-4 w-4" />
        Add Goal
      </button>
    </div>
  );
}
