"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { canObserve } from "./Reveal";

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
  /** Above-the-fold mode: pure CSS wipe on first paint (no hydration wait). */
  immediate?: boolean;
};

const hidden = {
  up: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/**
 * Observe the parent, not the clipped element: Chrome's IntersectionObserver applies the
 * target's own clip-path, so a fully clipped element never reports as visible.
 */
function useParentInView<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const target = ref.current?.parentElement;
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

/** Clip-path wipe with a slight inner zoom-out. Falls back to a fade for reduced motion. */
export function ImageReveal({ children, className, direction = "up", delay = 0, immediate }: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useParentInView(ref);

  if (immediate) {
    return (
      <div className={cn("clip-up overflow-hidden", className)} style={{ animationDelay: `calc(var(--intro-delay) + ${delay}s)` }}>
        <div className="h-full w-full">{children}</div>
      </div>
    );
  }

  if (reduced || !canObserve) {
    return (
      <div ref={ref} className={cn("overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      data-reveal=""
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: hidden[direction] }}
      animate={{ clipPath: inView ? "inset(0% 0% 0% 0%)" : hidden[direction] }}
      transition={{ duration: 1.2, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="h-full w-full"
        data-reveal=""
        initial={{ scale: 1.12 }}
        animate={{ scale: inView ? 1 : 1.12 }}
        transition={{ duration: 1.6, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
