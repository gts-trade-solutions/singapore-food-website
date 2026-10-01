"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { usePointerFine, usePrefersReducedMotion } from "@/lib/hooks";
import { useUI } from "@/lib/ui-store";

/**
 * Follower cursor for desktop. The native cursor stays visible (accessibility);
 * this ring trails it and grows into a labelled disc over products.
 */
export function Cursor() {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const label = useUI((s) => s.cursorLabel);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!fine || reduced) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[95]"
      style={{ x: sx, y: sy }}
      animate={{ opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="-mt-11 -ml-11 grid h-22 w-22 place-items-center rounded-full border border-ink/40 bg-brand text-brand-ink"
        initial={{ scale: 0.16 }}
        animate={label ? { scale: 1, opacity: 1 } : { scale: 0.16, opacity: 0.55 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ willChange: "transform" }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="text-xs font-semibold tracking-widest uppercase"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
