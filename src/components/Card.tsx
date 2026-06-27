import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  hover = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn("glass-card rounded-[14px] p-6", hover && "glass-card-hover", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  subColor = "text-text-secondary",
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
}) {
  return (
    <Card>
      <div className="text-xs font-medium text-text-secondary">{label}</div>
      <div className="mt-2 font-mono text-xl font-bold tabular-nums text-text-primary md:text-2xl">
        {value}
      </div>
      {sub && <div className={cn("mt-1 font-mono text-xs tabular-nums", subColor)}>{sub}</div>}
    </Card>
  );
}
