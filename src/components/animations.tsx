import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

/* ---------- spring presets ---------- */
export const SPRING = { stiffness: 200, damping: 25, mass: 0.6 } as const;
export const SOFT_SPRING = { stiffness: 120, damping: 22, mass: 0.8 } as const;

/* ---------- scroll-reveal variants ---------- */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

export const perspectiveCard: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 12, transformPerspective: 1000 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transformPerspective: 1000,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ---------- generic scroll reveal wrapper ---------- */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  amount = 0.2,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  amount?: number;
  as?: keyof typeof motion;
}) {
  const reduce = useReducedMotion();
  const Comp = (motion as any)[as] ?? motion.div;
  if (reduce) return <Comp className={className}>{children}</Comp>;
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}

/* ---------- parallax helper: maps scroll progress to a Y offset ---------- */
export function useParallax(distance = 80) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [distance, -distance]), SOFT_SPRING);
  return { ref, y, scrollYProgress };
}

/* ---------- magnetic button: element follows cursor within its bounds ---------- */
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    my.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }
  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y }}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

/* re-export for convenience */
export { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion };
export type { MotionValue };
