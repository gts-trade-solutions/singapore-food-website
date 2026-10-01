"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type ParallaxProps = {
  children: ReactNode;
  /** Pixels of travel across the element's pass through the viewport. Negative moves up. */
  offset?: number;
  rotate?: number;
  className?: string;
};

/** Scroll-linked vertical drift (transform only). Static when reduced motion is on. */
export function Parallax({ children, offset = 80, rotate = 0, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  const r = useTransform(scrollYProgress, [0, 1], [-rotate, rotate]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y, rotate: r }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
