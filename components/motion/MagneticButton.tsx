"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePointerFine, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: ReactNode;
  /** 0–1, how strongly the element follows the pointer. */
  strength?: number;
  className?: string;
};

/**
 * Wrap any button or link to make it drift toward the cursor.
 * Only active on fine pointers with motion allowed.
 */
export function MagneticButton({ children, strength = 0.35, className }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.3 });
  const active = fine && !reduced;

  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={active ? { x: sx, y: sy } : undefined}
      onPointerMove={(e) => {
        if (!active || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
