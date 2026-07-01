import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Loader2, Chrome, Eye, EyeOff, Check, ArrowLeft, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import authBg from "@/assets/auth-bg.png.asset.json";

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


      {/* ---------- Right column: hero ---------- */}
      <div className="relative hidden min-h-[calc(100vh-2rem)] w-[45%] flex-col items-center justify-end overflow-hidden rounded-3xl border border-border px-6 pb-16 shadow-2xl md:flex lg:w-[52%] lg:px-12 lg:pb-32">
        {/* CSS-only ambient background */}
        <div
          className="absolute inset-0 bg-surface"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 15%, color-mix(in oklab, var(--color-primary) 18%, transparent), transparent 45%), radial-gradient(circle at 80% 85%, color-mix(in oklab, var(--color-primary) 12%, transparent), transparent 50%)",
          }}
        />

        {/* faint grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-text-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-text-primary) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* floating glow orbs */}
        <div className="absolute -left-16 top-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 top-2/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        {/* subtle bottom scrim so hero content reads clearly */}
        <div className="absolute inset-x-0 bottom-0 z-[5] h-1/3 bg-gradient-to-t from-background/70 via-background/20 to-transparent" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="z-10 w-full max-w-xs space-y-8"
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
      </div>
    </main>
  );
}

/* ---------- Reusable components ---------- */

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
