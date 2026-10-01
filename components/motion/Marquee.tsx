"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useInView,
  useVelocity,
  wrap,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  /** Base speed in % of one copy per second. Negative scrolls right. */
  speed?: number;
  className?: string;
  /** How much scroll velocity accelerates the strip. */
  boost?: number;
};

/**
 * Infinite marquee that speeds up (and reverses) with scroll velocity.
 * Content is rendered four times for a seamless loop; copies 2–4 are aria-hidden.
 */
export function Marquee({ children, speed = 3, boost = 4, className }: MarqueeProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // No per-frame work while the strip is offscreen.
  const inView = useInView(ref, { margin: "100px" });
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1000, 0, 1000], [-boost, 0, boost], { clamp: false });
  const direction = useRef(1);
  // Four identical copies, so shifting by one copy (25%) loops seamlessly.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced || !inView) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    const move = direction.current * speed * (delta / 1000) * (1 + Math.abs(f));
    baseX.set(baseX.get() - move);
  });

  return (
    <div ref={ref} className={cn("overflow-hidden whitespace-nowrap", className)}>
      <motion.div className="flex w-max flex-nowrap will-change-transform" style={reduced ? undefined : { x }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0 ? true : undefined}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
