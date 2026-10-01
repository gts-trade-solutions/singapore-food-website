"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { createElement } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Vertical travel in px (capped at 24). */
  y?: number;
  as?: "div" | "section" | "li" | "article" | "p";
  /**
   * Above-the-fold mode: a CSS animation that runs on first paint without waiting
   * for hydration (and waits for the intro curtains via --intro-delay).
   */
  immediate?: boolean;
};

/** True when in-view triggers can work; otherwise content renders visible straight away. */
export const canObserve = typeof window === "undefined" || "IntersectionObserver" in window;

/**
 * Fades and lifts children into view once, when 15% is visible.
 * Fallbacks: without JS a <noscript> rule shows every [data-reveal]; without
 * IntersectionObserver or with reduced motion the content renders static and visible.
 */
export function Reveal({ delay = 0, y = 24, as = "div", immediate, children, className, style, ...rest }: RevealProps) {
  const reduced = usePrefersReducedMotion();

  if (immediate || reduced || !canObserve) {
    return createElement(
      as,
      {
        className: cn(immediate && !reduced && "rise-in", className),
        style: immediate ? { ...(style as React.CSSProperties), animationDelay: `calc(var(--intro-delay) + ${delay}s)` } : style,
        id: rest.id,
      },
      children as React.ReactNode,
    );
  }

  const Component = motion[as] as typeof motion.div;
  return (
    <Component
      data-reveal=""
      className={className}
      style={style}
      initial={{ opacity: 0, y: Math.min(y, 24) }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
