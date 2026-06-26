import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  Wallet,
  GraduationCap,
  Bell,
  LogOut,
  Menu,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TICKER_ITEMS } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, mobile: "Home" },
  { to: "/psx", label: "PSX Market", icon: TrendingUp, mobile: "PSX" },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase, mobile: "Portfolio" },
  { to: "/finance", label: "Finance", icon: Wallet, mobile: "Finance" },
  { to: "/learn", label: "Learn Hub", icon: GraduationCap },
  { to: "/alerts", label: "Alerts", icon: Bell },
] as const;

function Logo() {
  return (
    <Link to="/app" className="flex items-center gap-2">
      <img src={logo} alt="NafaIQ" width={28} height={28} className="rounded-[6px]" />
      <span className="font-display text-lg font-bold tracking-tight text-text-primary">
        Nafa<span className="text-gold">IQ</span>
      </span>
    </Link>
  );
}

function initial(name?: string | null, email?: string | null) {
  return (name?.trim()?.[0] || email?.trim()?.[0] || "U").toUpperCase();
}

function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const name = profile?.display_name || user?.email?.split("@")[0] || "User";
  async function handleSignOut() {
    await signOut();
    navigate({ to: "/auth" });
  }
  return (
    <aside className="glass-chrome fixed top-0 left-0 z-30 hidden h-screen w-[240px] flex-col border-r border-white/5 lg:flex">
      <div className="flex h-[52px] items-center border-b border-white/5 px-4">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((n) => {
          const active = path === n.to || path.startsWith(n.to + "/");
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "nav-active text-bull"
                  : "text-text-secondary hover:bg-white/5 hover:text-text-primary",
              )}
            >
              <n.icon className="h-[18px] w-[18px]" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-3 border-t border-white/5 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bull/20 font-semibold text-bull">
          {initial(profile?.display_name, user?.email)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-text-primary">{name}</div>
          <div className="text-xs text-text-muted">{profile?.plan ?? "Free"} plan</div>
        </div>
        <button onClick={handleSignOut} aria-label="Sign out" className="text-text-secondary transition-colors hover:text-bear">
          <LogOut className="h-[18px] w-[18px]" />
        </button>
      </div>
    </aside>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="flex w-max animate-[ticker_40s_linear_infinite] gap-6 whitespace-nowrap">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs">
            <span className="font-medium text-text-secondary">{it.label}</span>
            <span className="font-mono tabular-nums text-text-primary">{it.value}</span>
            <span className={cn("font-mono tabular-nums", it.pct >= 0 ? "text-bull" : "text-bear")}>
              {it.pct >= 0 ? "▲+" : "▼"}
              {it.pct.toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
  const { profile, user } = useAuth();
  return (
    <header className="glass-chrome sticky top-0 z-20 flex h-[52px] items-center gap-3 border-b border-white/5 px-3 lg:pl-6">
      <button onClick={onMenu} className="text-text-secondary lg:hidden" aria-label="Menu">
        <Menu className="h-5 w-5" />
      </button>
      <span className="hidden shrink-0 items-center gap-2 rounded-[4px] bg-bull/15 px-2 py-0.5 text-[10px] font-semibold text-bull sm:inline-flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bull" />
        PSX OPEN
      </span>
      <Ticker />
      <button className="relative shrink-0 text-text-secondary" aria-label="Notifications">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-bear text-[9px] font-bold text-white">
          3
        </span>
      </button>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bull/20 text-sm font-semibold text-bull">
        {initial(profile?.display_name, user?.email)}
      </div>
    </header>
  );
}

function BottomNav({ onMore }: { onMore: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const tabs = NAV.slice(0, 4);
  return (
    <nav className="glass-chrome safe-bottom fixed bottom-0 left-0 z-30 flex w-full items-stretch border-t border-white/5 lg:hidden">
      {tabs.map((t) => {
        const active = path === t.to || path.startsWith(t.to + "/");
        return (
          <Link
            key={t.to}
            to={t.to}
            className="flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 py-2"
          >
            <t.icon className={cn("h-5 w-5", active ? "text-bull" : "text-text-muted")} />
            {active && <span className="text-[10px] font-medium text-bull">{"mobile" in t ? t.mobile : t.label}</span>}
          </Link>
        );
      })}
      <button onClick={onMore} className="flex min-h-[64px] flex-1 flex-col items-center justify-center gap-1 py-2">
        <MoreHorizontal className="h-5 w-5 text-text-muted" />
      </button>
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  async function handleSignOut() {
    setDrawer(false);
    await signOut();
    navigate({ to: "/auth" });
  }
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* ambient depth — subtle brand glows behind everything */}
      <div className="ambient-glow -top-32 right-[-10%] h-[420px] w-[420px] bg-bull/[0.06]" />
      <div className="ambient-glow top-1/3 left-[-12%] h-[380px] w-[380px] bg-ai/[0.05]" />
      <Sidebar />
      <div className="relative lg:pl-[240px]">
        <Header onMenu={() => setDrawer(true)} />
        <main key={useRouterState({ select: (s) => s.location.pathname })} className="animate-[page-in_0.25s_ease-out] px-3 pt-4 pb-24 sm:px-5 lg:px-6 lg:pb-8">
          {children}
        </main>
      </div>
      <BottomNav onMore={() => setDrawer(true)} />

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setDrawer(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="glass-chrome safe-bottom absolute right-0 bottom-0 left-0 rounded-t-2xl border-t border-white/10 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">More</span>
              <button onClick={() => setDrawer(false)}>
                <X className="h-5 w-5 text-text-secondary" />
              </button>
            </div>
            {NAV.slice(4).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setDrawer(false)}
                className="flex items-center gap-3 rounded-[6px] px-3 py-3 text-sm text-text-primary hover:bg-hover"
              >
                <n.icon className="h-5 w-5 text-text-secondary" />
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-border px-3 pt-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bull/20 text-sm font-semibold text-bull">
                {initial(profile?.display_name, user?.email)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-text-primary">
                  {profile?.display_name || user?.email?.split("@")[0] || "User"}
                </div>
                <div className="text-xs text-text-muted">{profile?.plan ?? "Free"} plan</div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-sm font-medium text-bear hover:bg-hover"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
