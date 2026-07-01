import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Loader2,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  MailCheck,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import logo from "@/assets/logo.png";


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
    <img
      src={logo}
      alt="NafaIQ"
      width={36}
      height={36}
      className={className}
    />
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

  const pwChecks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One number", ok: /[0-9]/.test(password) },
    { label: "One special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const pwScore = pwChecks.filter((c) => c.ok).length;
  const strengthMeta = [
    { label: "Too weak", color: "var(--color-bear)" },
    { label: "Weak", color: "var(--color-bear)" },
    { label: "Fair", color: "var(--color-warning)" },
    { label: "Good", color: "var(--color-gold)" },
    { label: "Strong", color: "var(--color-primary)" },
  ][pwScore];

  return (
    <main className="relative flex min-h-screen w-full flex-col-reverse bg-background p-2 transition-all duration-500 selection:bg-primary/30 md:flex-row-reverse md:p-4">

      {/* Back to home — top left */}
      <Link
        to="/"
        className="group absolute left-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-surface/60 px-3.5 py-2 text-xs font-medium text-text-muted backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:text-text-primary md:left-6 md:top-6"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to home
      </Link>


      {/* ---------- Left column: form ---------- */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:px-8 md:py-10 lg:px-12">
        <AuthAmbientBackground />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2.5">
            <LogoIcon className="h-9 w-9 rounded-[8px] ring-1 ring-bull/30" />
            <span className="font-display text-2xl font-bold tracking-tight text-text-primary">
              Nafa<span className="text-primary">IQ</span>
            </span>
          </div>

          {/* Glass card */}
          <div className="rounded-[22px] border border-white/10 bg-surface/60 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-8">
            {confirmSent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MailCheck className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-display text-2xl font-bold tracking-tight text-text-primary">
                    Confirm your email
                  </h2>
                  <p className="text-sm text-text-muted">
                    We sent a confirmation link to{" "}
                    <span className="font-medium text-text-primary">{email}</span>. Click the link
                    to activate your NafaIQ account, then sign in.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setConfirmSent(false);
                    setMode("signin");
                  }}
                  className="flex h-[52px] w-full items-center justify-center rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
                >
                  Go to Sign In
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <h1 className="font-display text-[28px] font-bold leading-tight tracking-tight text-text-primary">
                    {isSignup ? "Create your account" : "Welcome back"}
                  </h1>
                  <p className="text-sm text-text-muted">
                    {isSignup
                      ? "Start your journey with intelligent PSX insights."
                      : "Sign in to your NafaIQ terminal."}
                  </p>
                </div>

                <GoogleButton onClick={handleGoogle} disabled={busy} />

                <div className="relative flex items-center">
                  <div className="flex-1 border-t border-border" />
                  <span className="px-3 text-xs font-medium text-text-muted">
                    Or continue with email
                  </span>
                  <div className="flex-1 border-t border-border" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignup && (
                    <div className="grid grid-cols-2 gap-3">
                      <FloatingInput
                        id="firstName"
                        label="First name"
                        type="text"
                        value={firstName}
                        onChange={setFirstName}
                        autoComplete="given-name"
                        icon={<User className="h-4 w-4" />}
                      />
                      <FloatingInput
                        id="lastName"
                        label="Last name"
                        type="text"
                        value={lastName}
                        onChange={setLastName}
                        autoComplete="family-name"
                        icon={<User className="h-4 w-4" />}
                      />
                    </div>
                  )}

                  <FloatingInput
                    id="email"
                    label="Email address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    autoComplete="email"
                    required
                    icon={<Mail className="h-4 w-4" />}
                  />

                  <div className="space-y-2.5">
                    <FloatingInput
                      id="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={setPassword}
                      required
                      minLength={8}
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      icon={<Lock className="h-4 w-4" />}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="text-text-muted transition-colors duration-200 hover:text-text-primary"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      }
                    />

                    {isSignup && password.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2.5 pt-0.5"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-1.5 flex-1 gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-full transition-colors duration-200"
                                style={{
                                  backgroundColor:
                                    i < pwScore
                                      ? strengthMeta.color
                                      : "var(--color-border)",
                                }}
                              />
                            ))}
                          </div>
                          <span
                            className="text-xs font-medium"
                            style={{ color: strengthMeta.color }}
                          >
                            {strengthMeta.label}
                          </span>
                        </div>
                        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                          {pwChecks.map((c) => (
                            <li
                              key={c.label}
                              className="flex items-center gap-1.5 text-xs transition-colors duration-200"
                              style={{
                                color: c.ok
                                  ? "var(--color-primary)"
                                  : "var(--color-text-muted)",
                              }}
                            >
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                                {c.ok ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <X className="h-3.5 w-3.5 opacity-50" />
                                )}
                              </span>
                              {c.label}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="group mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-info font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_color-mix(in_oklab,var(--color-primary)_60%,transparent)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
                  >
                    {busy ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        {isSignup ? "Create Account" : "Sign In"}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="space-y-3 pt-1 text-center">
                  <p className="text-sm text-text-muted">
                    {isSignup ? "Already have an account? " : "New to NafaIQ? "}
                    <button
                      onClick={() => setMode(isSignup ? "signin" : "signup")}
                      className="font-medium text-primary transition-colors duration-200 hover:underline"
                    >
                      {isSignup ? "Sign In" : "Create one"}
                    </button>
                  </p>
                  {isSignup && (
                    <p className="text-xs leading-relaxed text-text-muted/80">
                      By creating an account you agree to the{" "}
                      <a href="#" className="text-text-secondary hover:text-primary hover:underline">
                        Terms
                      </a>{" "}
                      &amp;{" "}
                      <a href="#" className="text-text-secondary hover:text-primary hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>



      <AuthVisualPanel />
    </main>
  );
}

/* ---------- Reusable components ---------- */

function AuthVisualPanel() {
  return (
    <aside className="relative hidden min-h-[calc(100vh-2rem)] w-[45%] flex-col justify-center overflow-hidden rounded-3xl border border-border bg-[#0a1410] px-8 py-12 shadow-2xl md:flex lg:w-[50%] lg:px-14">
      <img
        src="/hero-bg.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[70%_center]"
        style={{ filter: "saturate(1.35) brightness(1.12) contrast(1.05)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(6,12,10,0.82) 0%, rgba(8,14,12,0.5) 45%, rgba(10,20,15,0.25) 100%)",
        }}
      />



      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-xs space-y-8"
      >
        <motion.div variants={item} className="flex items-center gap-2.5">
          <LogoIcon className="h-9 w-9 rounded-[8px] ring-1 ring-bull/30" />
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

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function GoogleButton({ onClick, disabled }: { onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[52px] w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface/50 py-3.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-border-hover hover:bg-hover active:scale-[0.99] disabled:opacity-60"
    >
      <GoogleIcon className="h-5 w-5" />
      Continue with Google
    </button>
  );
}

function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  icon,
  trailing,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-200 group-focus-within:text-primary">
        {icon}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="peer h-14 w-full rounded-xl border border-border bg-surface/40 px-4 pl-10 pt-4 text-sm text-text-primary transition-all duration-200 focus:border-primary focus:bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary/25"
        style={trailing ? { paddingRight: "2.75rem" } : undefined}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-text-muted transition-all duration-200 peer-focus:top-3.5 peer-focus:text-[11px] peer-focus:font-medium peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-medium"
      >
        {label}
      </label>
      {trailing && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{trailing}</span>
      )}
    </div>
  );
}

function AuthAmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* teal gradient glows */}
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-info/10 blur-[120px]" />

      <svg className="absolute inset-0 h-full w-full opacity-[0.5]" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="loginGrid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M42 0H0V42" fill="none" stroke="var(--color-primary)" strokeOpacity="0.05" />
          </pattern>
          <linearGradient id="loginLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#loginGrid)" />
        {/* candlesticks */}
        <g opacity="0.14" transform="translate(40 60)">
          {[
            [0, 40, 60, 90],
            [26, 20, 80, 120],
            [52, 55, 45, 70],
            [78, 10, 90, 140],
            [104, 45, 55, 80],
          ].map(([x, y, body, wick], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <line x1="6" y1="0" x2="6" y2={wick} stroke="var(--color-primary)" strokeWidth="1.5" />
              <rect x="0" y={(wick - body) / 2} width="12" height={body} fill="var(--color-primary)" />
            </g>
          ))}
        </g>
        {/* neural nodes */}
        <g opacity="0.16">
          <line x1="82%" y1="16%" x2="92%" y2="30%" stroke="url(#loginLine)" strokeWidth="1" />
          <line x1="92%" y1="30%" x2="80%" y2="42%" stroke="url(#loginLine)" strokeWidth="1" />
          <line x1="80%" y1="42%" x2="94%" y2="54%" stroke="url(#loginLine)" strokeWidth="1" />
          {[
            ["82%", "16%"],
            ["92%", "30%"],
            ["80%", "42%"],
            ["94%", "54%"],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="var(--color-primary)" />
          ))}
        </g>
      </svg>
    </div>
  );
}

