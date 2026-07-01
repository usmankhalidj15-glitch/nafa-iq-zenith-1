import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Loader2, Chrome, Eye, EyeOff, Check, ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";


export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign up — NafaIQ" },
      {
        name: "description",
        content:
          "Create your NafaIQ account to access your PSX terminal and personal finance dashboard.",
      },
    ],
  }),
  component: AuthPage,
});

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rounded square border */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Stylized "N" */}
      <path
        d="M9 22 V10.5 L16 22 V10.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Tall vertical bar */}
      <rect x="19.6" y="9.5" width="3.2" height="12.5" rx="1.6" fill="currentColor" />
    </svg>
  );
}

function AuthPage() {
  const { user, loading, signInWithPassword, signUpWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  const destination =
    redirect && redirect.startsWith("/") && redirect !== "/" && !redirect.startsWith("/auth")
      ? redirect
      : "/app";

  // Fallback: if a session already exists (or arrives via OAuth/email link), go in.
  useEffect(() => {
    if (!loading && user) navigate({ to: destination });
  }, [user, loading, navigate, destination]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const name = `${firstName} ${lastName}`.trim();
        if (name.length < 2) {
          toast.error("Please enter your name");
          return;
        }
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return;
        }
        const { error, needsConfirmation } = await signUpWithPassword(
          email.trim(),
          password,
          name,
        );
        if (error) return toast.error(error);
        if (needsConfirmation) {
          setConfirmSent(true);
          toast.success("Confirmation email sent — check your inbox.");
          return;
        }
        toast.success("Account created — welcome to NafaIQ!");
        navigate({ to: destination });
      } else {
        const { error } = await signInWithPassword(email.trim(), password);
        if (error) return toast.error(error);
        toast.success("Welcome back!");
        navigate({ to: destination });
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error);
      setBusy(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <main className="relative flex min-h-screen w-full flex-col-reverse bg-background p-2 transition-all duration-500 selection:bg-primary/30 md:flex-row md:p-4">
      {/* Back to home — top left */}
      <Link
        to="/"
        className="absolute left-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-md transition-colors hover:border-border-hover hover:text-text-primary"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to home
      </Link>

      {/* ---------- Left column: form ---------- */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-10 pt-20 sm:px-12 md:py-12 lg:px-16 lg:pb-6 lg:pt-16 xl:px-24">
        {confirmSent ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md space-y-6 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MailCheck className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-medium tracking-tight text-text-primary">
                Confirm your email
              </h2>
              <p className="text-sm text-text-muted">
                We sent a confirmation link to{" "}
                <span className="font-medium text-text-primary">{email}</span>. Click the link to
                activate your NafaIQ account, then sign in.
              </p>
            </div>
            <button
              onClick={() => {
                setConfirmSent(false);
                setMode("signin");
              }}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Go to Sign In
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-xl space-y-8 sm:space-y-10 lg:space-y-6"
          >
            <div className="flex items-center gap-2.5 lg:hidden">
              <LogoIcon className="h-8 w-8 text-primary" />
              <span className="font-display text-xl font-bold tracking-tight text-text-primary">
                Nafa<span className="text-primary">IQ</span>
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-3xl font-medium tracking-tight text-text-primary">
                {isSignup ? "Create New Profile" : "Welcome Back"}
              </h2>
              <p className="text-sm text-text-muted">
                {isSignup
                  ? "Input your basic details to begin the journey."
                  : "Sign in to your NafaIQ terminal."}
              </p>
            </div>

            <SocialButton
              icon={<Chrome className="h-5 w-5" />}
              label="Continue with Google"
              onClick={handleGoogle}
              disabled={busy}
            />

            <div className="relative flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="bg-background px-4 text-xs font-medium uppercase tracking-widest text-text-muted">
                Or
              </span>
              <div className="flex-1 border-t border-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="First Name"
                    placeholder="Ahmed"
                    type="text"
                    value={firstName}
                    onChange={setFirstName}
                    autoComplete="given-name"
                  />
                  <InputGroup
                    label="Last Name"
                    placeholder="Khan"
                    type="text"
                    value={lastName}
                    onChange={setLastName}
                    autoComplete="family-name"
                  />
                </div>
              )}

              <InputGroup
                label="Email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={setEmail}
                autoComplete="email"
                required
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    className="h-11 w-full rounded-xl border border-border bg-surface px-4 pr-11 text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isSignup && (
                  <p className="text-xs text-text-muted">Use at least 8 characters — avoid common passwords.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="mt-4 flex h-14 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isSignup ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-text-muted">
              {isSignup ? "Member of the team? " : "New to NafaIQ? "}
              <button
                onClick={() => setMode(isSignup ? "signin" : "signup")}
                className="font-medium text-primary hover:underline"
              >
                {isSignup ? "Log in" : "Sign up"}
              </button>
            </p>
          </motion.div>
        )}
      </div>


      <AuthVisualPanel />
    </main>
  );
}

/* ---------- Reusable components ---------- */

function AuthVisualPanel() {
  return (
    <aside className="relative hidden min-h-[calc(100vh-2rem)] w-[45%] flex-col justify-end overflow-hidden rounded-3xl border border-border bg-background px-6 pb-14 shadow-2xl md:flex lg:w-[52%] lg:px-12 lg:pb-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(145deg, var(--color-background) 0%, var(--color-sidebar) 38%, var(--color-background) 100%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 760 980"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Pakistan market intelligence background"
      >
        <defs>
          <radialGradient id="authGlow" cx="42%" cy="36%" r="70%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
            <stop offset="52%" stopColor="var(--color-primary)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-background)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="authWave" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="48%" stopColor="var(--color-primary)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-ai)" stopOpacity="0" />
          </linearGradient>
          <pattern id="authGrid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" fill="none" stroke="var(--color-primary)" strokeOpacity="0.08" />
          </pattern>
          <filter id="authSoftGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="760" height="980" fill="url(#authGlow)" />
        <rect y="360" width="760" height="620" fill="url(#authGrid)" opacity="0.95" />

        <g opacity="0.15" transform="translate(54 154)">
          <path d="M82 0a88 88 0 1 0 93 132A70 70 0 1 1 82 0Z" fill="var(--color-primary)" />
          <path d="m166 40 13 27 30 4-22 21 6 30-27-15-27 15 6-30-22-21 30-4Z" fill="var(--color-primary)" />
        </g>

        <MarketChart />
        <PakistanDottedMap />
        <DataWave />

        <g transform="translate(530 510)" opacity="0.72">
          <circle cx="70" cy="70" r="64" fill="none" stroke="var(--color-primary)" strokeOpacity="0.18" />
          <circle cx="70" cy="70" r="52" fill="none" stroke="var(--color-primary)" strokeOpacity="0.3" />
          <path d="M28 92h18V70h18v22h18V56h18v36h18" fill="var(--color-primary)" opacity="0.56" />
          <path d="m28 70 24-18 20 12 42-44" fill="none" stroke="var(--color-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
          <path d="m102 21 18-4-5 18" fill="none" stroke="var(--color-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="7" />
        </g>

        <g transform="translate(544 690)" opacity="0.72">
          <rect width="104" height="104" rx="24" fill="var(--color-surface)" stroke="var(--color-primary)" strokeOpacity="0.45" />
          <text x="52" y="67" textAnchor="middle" fontFamily="var(--font-display)" fontSize="42" fontWeight="700" fill="var(--color-primary)">AI</text>
        </g>

        <rect y="650" width="760" height="330" fill="var(--color-background)" opacity="0.56" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-xs space-y-8"
      >
        <motion.div variants={item} className="flex items-center gap-2.5">
          <LogoIcon className="h-9 w-9 text-primary" />
          <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
            Nafa<span className="text-primary">IQ</span>
          </span>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <h1 className="font-display whitespace-nowrap text-4xl font-medium tracking-tight text-text-primary">
            Join NafaIQ
          </h1>
          <p className="px-1 text-sm leading-relaxed text-text-secondary/80">
            Follow these 3 quick phases to activate your space.
          </p>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <StepItem number={1} text="Register your identity" active />
          <StepItem number={2} text="Configure your studio" />
          <StepItem number={3} text="Finalize your profile" />
        </motion.div>
      </motion.div>
    </aside>
  );
}

function MarketChart() {
  const candles = [
    [58, 660, 36, 78, 1],
    [92, 632, 28, 94, 1],
    [128, 606, 42, 118, 1],
    [164, 620, 34, 82, 0],
    [202, 584, 48, 146, 1],
    [244, 548, 36, 112, 1],
    [282, 520, 44, 170, 1],
    [322, 492, 36, 122, 0],
    [362, 456, 46, 160, 1],
    [404, 486, 34, 126, 0],
  ];

  return (
    <g opacity="0.62">
      <path
        d="M0 706 C78 686 124 602 202 628 C268 650 326 516 414 548"
        fill="none"
        stroke="var(--color-primary)"
        strokeOpacity="0.45"
        strokeWidth="2"
      />
      {candles.map(([x, y, body, wick, up], index) => (
        <g key={index} transform={`translate(${x} ${y})`} opacity={0.45 + index * 0.035}>
          <line x1="10" y1={-wick / 2} x2="10" y2={wick / 2} stroke="var(--color-primary)" strokeWidth="2" />
          <rect
            x="0"
            y={up ? -body / 2 : -body / 3}
            width="20"
            height={body}
            fill={up ? "var(--color-primary)" : "var(--color-surface-alt)"}
            stroke="var(--color-primary)"
            strokeOpacity="0.75"
          />
        </g>
      ))}
    </g>
  );
}

function PakistanDottedMap() {
  const dots = Array.from({ length: 168 }, (_, index) => {
    const row = Math.floor(index / 14);
    const col = index % 14;
    const taper = row < 3 ? 3 - row : row > 8 ? row - 8 : 0;
    return { x: 432 + col * 17 + taper * 9, y: 154 + row * 17, show: col > taper - 1 && col < 14 - Math.max(0, taper - 1) };
  });

  return (
    <g filter="url(#authSoftGlow)" opacity="0.84">
      <path
        d="M506 166c58-54 160-52 212-10 34 27 18 75 56 100-48 8-72 34-86 72-27-16-61-14-84 8-36-32-82-14-128-22 18-43-5-72 30-148Z"
        fill="none"
        stroke="var(--color-primary)"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      {dots.map((dot, index) =>
        dot.show ? (
          <circle key={index} cx={dot.x} cy={dot.y} r="1.6" fill="var(--color-primary)" opacity="0.72" />
        ) : null,
      )}
      <circle cx="628" cy="282" r="4" fill="var(--color-primary)" />
      <circle cx="628" cy="282" r="18" fill="none" stroke="var(--color-primary)" strokeOpacity="0.28" />
    </g>
  );
}

function DataWave() {
  const paths = Array.from({ length: 13 }, (_, index) => {
    const y = 788 + index * 11;
    const lift = index * 4;
    return `M-30 ${y} C90 ${730 - lift} 184 ${858 + lift} 310 ${786 - lift} S542 ${724 + lift} 790 ${786 - lift}`;
  });

  return (
    <g opacity="0.68">
      {paths.map((d, index) => (
        <path
          key={index}
          d={d}
          fill="none"
          stroke="url(#authWave)"
          strokeWidth={index === 5 ? 2.4 : 1}
          strokeOpacity={index === 5 ? 0.9 : 0.42}
        />
      ))}
      <path d="M-20 792 C124 756 212 842 334 782 S576 720 800 786" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeOpacity="0.72" />
    </g>
  );
}

function StepItem({ number, text, active }: { number: number; text: string; active?: boolean }) {
  return (
    <div
      className={
        "flex items-center gap-3 rounded-2xl px-4 py-3 " +
        (active
          ? "border border-primary bg-primary text-primary-foreground"
          : "border border-border bg-surface text-text-primary")
      }
    >
      <span
        className={
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold " +
          (active ? "bg-primary-foreground/15 text-primary-foreground" : "bg-white/10 text-text-muted")
        }
      >
        {active ? <Check className="h-4 w-4" /> : number}
      </span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function SocialButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface text-sm font-medium text-text-primary transition-colors hover:bg-hover disabled:opacity-60"
    >
      {icon}
      {label}
    </button>
  );
}

function InputGroup({
  label,
  placeholder,
  type,
  value,
  onChange,
  autoComplete,
  required,
}: {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-text-primary placeholder:text-text-muted/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );

}
