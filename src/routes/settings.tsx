import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Card } from "@/components/Card";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — NafaIQ" },
      {
        name: "description",
        content: "Manage your NafaIQ preferences, including app appearance and theme.",
      },
    ],
  }),
  component: Settings,
});

const THEME_OPTIONS: { value: Theme; label: string; desc: string; icon: typeof Moon }[] = [
  { value: "dark", label: "Dark", desc: "Default OLED-friendly terminal look", icon: Moon },
  { value: "light", label: "Light", desc: "Bright, high-contrast daytime view", icon: Sun },
];

function Settings() {
  const { theme, setTheme } = useTheme();
  const { profile, user } = useAuth();
  const name = profile?.display_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Personalise how NafaIQ looks and feels.
        </p>
      </div>

      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Monitor className="h-4 w-4 text-primary" strokeWidth={1.75} />
          <h2 className="text-sm font-semibold text-text-primary">Appearance</h2>
        </div>
        <p className="mb-4 text-[13px] text-text-secondary">
          Choose the theme for your dashboard. This applies to the app only — the public site
          stays dark.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {THEME_OPTIONS.map((opt) => {
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={cn(
                  "group relative flex items-start gap-3 rounded-[12px] border p-4 text-left transition",
                  active
                    ? "border-primary/60 bg-primary/10"
                    : "border-border bg-surface hover:border-border-hover",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    active ? "bg-primary/20 text-primary" : "bg-hover text-text-secondary",
                  )}
                >
                  <opt.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-text-primary">
                    {opt.label}
                    {active && <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-text-muted">{opt.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-text-primary">Account</h2>
        <dl className="space-y-2 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="text-text-muted">Name</dt>
            <dd className="font-medium text-text-primary">{name}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-text-muted">Email</dt>
            <dd className="font-medium text-text-primary">{user?.email ?? "—"}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-text-muted">Plan</dt>
            <dd className="font-medium text-text-primary">{profile?.plan ?? "Free"}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
