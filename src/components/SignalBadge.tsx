import { cn } from "@/lib/utils";
import type { Signal } from "@/lib/data";
import { useLang } from "@/hooks/use-lang";

const styles: Record<Signal, string> = {
  "STRONG BUY": "bg-bull text-bull-foreground font-bold",
  BUY: "border-[1.5px] border-bull text-bull bg-transparent",
  HOLD: "signal-hold border-[1.5px] border-text-secondary/60 text-text-primary bg-text-secondary/10",
  SELL: "border-[1.5px] border-warning text-warning bg-transparent",
  "STRONG SELL": "bg-bear text-white font-bold",
};

export function SignalBadge({ signal, className }: { signal: Signal; className?: string }) {
  const { t } = useLang();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-semibold tracking-wide whitespace-nowrap uppercase",
        styles[signal],
        className,
      )}
    >
      {t(signal)}
    </span>
  );
}
