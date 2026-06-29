import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, TrendingUp, Calendar, Wallet, Target } from "lucide-react";
import { Card } from "@/components/Card";
import { EmojiIcon } from "@/components/icons";
import { ALERTS, NOTIFS } from "@/lib/finance-data";
import { cn } from "@/lib/utils";
import { useLang } from "@/hooks/use-lang";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — NafaIQ" },
      {
        name: "description",
        content: "Manage stock price, bill, budget and goal alerts plus your notification history.",
      },
    ],
  }),
  component: Alerts,
});

const TYPES = [
  { label: "Stock Price", icon: TrendingUp },
  { label: "Bill Reminder", icon: Calendar },
  { label: "Budget", icon: Wallet },
  { label: "Goal Milestone", icon: Target },
];

function Alerts() {
  const { t } = useLang();
  const [alerts, setAlerts] = useState(ALERTS);
  const [type, setType] = useState("Stock Price");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{t("Alerts")}</h1>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">{t("Active Alerts")}</h3>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <Card key={i} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/[0.06] bg-elevated text-text-secondary">
                <EmojiIcon emoji={a.emoji} size={16} />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">{a.title}</div>
                <div className="text-[11px] text-text-muted">
                  {a.type} · {a.meta}
                </div>
              </div>
              <button
                onClick={() =>
                  setAlerts((p) => p.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))
                }
                className={cn(
                  "relative h-5 w-9 rounded-full transition",
                  a.on ? "bg-bull" : "bg-elevated",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
                    a.on ? "left-[18px]" : "left-0.5",
                  )}
                />
              </button>
              <button className="text-text-muted hover:text-bear">
                <Trash2 className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">{t("Add New Alert")}</h3>
        <Card>
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TYPES.map((ty) => (
              <button
                key={ty.label}
                onClick={() => setType(ty.label)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-[10px] border p-3 text-xs font-medium transition",
                  type === ty.label
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-white/[0.06] text-text-secondary hover:bg-white/[0.04]",
                )}
              >
                <ty.icon className="h-5 w-5" strokeWidth={1.75} />
                {t(ty.label)}
              </button>
            ))}
          </div>
          {type === "Stock Price" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <select className="rounded-[6px] border border-border bg-elevated px-3 py-2 text-sm text-text-primary">
                <option>HBL</option>
                <option>ENGRO</option>
                <option>LUCK</option>
                <option>OGDC</option>
              </select>
              <div className="flex gap-2">
                <select className="rounded-[6px] border border-border bg-elevated px-3 py-2 text-sm text-text-primary">
                  <option>Above</option>
                  <option>Below</option>
                </select>
                <input
                  placeholder="Price"
                  className="w-full rounded-[6px] border border-border bg-elevated px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-muted"
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <select className="rounded-[6px] border border-border bg-elevated px-3 py-2 text-sm text-text-primary">
                <option>SNGPL Gas</option>
                <option>PTCL Internet</option>
                <option>Apartment Rent</option>
              </select>
              <select className="rounded-[6px] border border-border bg-elevated px-3 py-2 text-sm text-text-primary">
                <option>1 day before</option>
                <option>3 days before</option>
                <option>7 days before</option>
              </select>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-secondary">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" defaultChecked className="accent-[#00d4aa]" />
              Push
            </label>
            <label className="flex items-center gap-1.5">
              <input type="checkbox" className="accent-[#00d4aa]" />
              Email
            </label>
          </div>
          <button className="mt-4 w-full rounded-[6px] bg-bull py-2 text-sm font-semibold text-bull-foreground hover:brightness-110">
            Create Alert
          </button>
        </Card>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-text-primary">Notification History</h3>
        <Card className="divide-y divide-border/50 p-0" hover={false}>
          {NOTIFS.map((n, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-white/[0.06] bg-elevated text-text-secondary">
                <EmojiIcon emoji={n.emoji} size={15} />
              </span>
              <div className="flex-1">
                <div className="text-sm text-text-primary">{n.msg}</div>
                <div className="text-[11px] text-text-muted">{n.time}</div>
              </div>
              {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-bull" />}
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
