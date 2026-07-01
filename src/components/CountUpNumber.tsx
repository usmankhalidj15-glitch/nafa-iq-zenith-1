import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

/**
 * Smooth count-up for financial figures.
 * Counts from 0 -> value on mount over ~1.5s with an ease-out curve.
 */
export function CountUpNumber({
  value,
  decimals = 0,
  prefix,
  suffix,
  className,
  duration = 1.5,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  return (
    <CountUp
      start={0}
      end={value}
      duration={duration}
      decimals={decimals}
      separator=","
      prefix={prefix}
      suffix={suffix}
      className={className}
      // easeOutCubic — smooth, decelerating finish
      easingFn={(t, b, c, d) => c * (1 - Math.pow(1 - t / d, 3)) + b}
    />
  );
}

/**
 * Progress / score bar that fills from 0 -> `value`% on mount
 * with a 0.8s ease-out transition.
 */
export function AnimatedBar({
  value,
  className,
  trackClassName,
}: {
  value: number;
  className?: string;
  trackClassName?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <div className={cn("h-full rounded-full", className)}>
      <div
        className={cn("h-full rounded-full transition-[width] duration-[800ms] ease-out", trackClassName)}
        style={{ width: `${w}%` }}
      />
    </div>
  );
}
