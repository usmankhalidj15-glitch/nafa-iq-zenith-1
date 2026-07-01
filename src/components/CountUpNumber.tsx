import { useEffect, useState } from "react";
import * as CountUpModule from "react-countup";
import { cn } from "@/lib/utils";

// react-countup ships as CJS; depending on the bundler's interop the default
// export can arrive as the component OR as a namespace object. Unwrap safely.
const CountUp = (
  (CountUpModule as { default?: unknown }).default ?? CountUpModule
) as typeof import("react-countup").default;


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
 * Fill bar that animates its width from 0 -> `value`% on mount
 * with a 0.8s ease-out transition. Drop in as the inner fill of a track.
 */
export function AnimatedBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <div
      className={cn("h-full rounded-full transition-[width] duration-[800ms] ease-out", className)}
      style={{ width: `${w}%` }}
    />
  );
}

