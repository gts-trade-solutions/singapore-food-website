"use client";

import { motion, type Variants } from "framer-motion";
import { createElement, type CSSProperties, type ElementType } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { canObserve } from "./Reveal";

type SplitTextProps = {
  /** Plain text. Use "\n" to force line breaks. */
  text: string;
  as?: ElementType;
  className?: string;
  /** Split by word (default) or by line ("\n"-separated). */
  by?: "word" | "line";
  delay?: number;
  stagger?: number;
  /**
   * Above-the-fold mode: animates with pure CSS on first paint (no hydration wait,
   * better LCP) and holds until the intro curtains open via --intro-delay.
   */
  immediate?: boolean;
  /** Extra class for each masked unit. */
  unitClassName?: string;
  id?: string;
};

const container: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const unit: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } },
};

// motion.create must not run during render (it would remount every time), so cache per tag.
const motionTags = new Map<ElementType, typeof motion.div>();
function getMotionTag(tag: ElementType) {
  let component = motionTags.get(tag);
  if (!component) {
    component = motion.create(tag as Parameters<typeof motion.create>[0]) as unknown as typeof motion.div;
    motionTags.set(tag, component);
  }
  return component;
}

function splitUnits(text: string, by: "word" | "line") {
  return text.split("\n").map((line) => (by === "line" ? [line] : line.split(" ")));
}

/**
 * Masked text reveal. Screen readers get the full sentence via aria-label;
 * the animated fragments are aria-hidden.
 */
export function SplitText({
  text,
  as = "h2",
  className,
  by = "word",
  delay = 0,
  stagger = 0.06,
  immediate = false,
  unitClassName,
  id,
}: SplitTextProps) {
  const reduced = usePrefersReducedMotion();
  const lines = splitUnits(text, by);
  const label = text.replace(/\n/g, " ");

  if (immediate) {
    let index = 0;
    return createElement(
      as,
      { id, className, "aria-label": label },
      lines.map((units, li) => (
        <span key={li} className="block" aria-hidden="true">
          {units.map((u, ui) => {
            const style: CSSProperties = {
              animationDelay: `calc(var(--intro-delay) + ${(delay + index++ * stagger).toFixed(2)}s)`,
            };
            return (
              <span key={ui} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span className={cn("line-up", unitClassName)} style={style}>
                  {u}
                  {ui < units.length - 1 ? " " : ""}
                </span>
              </span>
            );
          })}
        </span>
      )),
    );
  }

  if (reduced || !canObserve) {
    return createElement(
      as,
      { className, id },
      lines.map((units, i) => (
        <span key={i} className="block">
          {units.join(" ")}
        </span>
      )),
    );
  }

  const MotionTag = getMotionTag(as);
  return (
    <MotionTag
      id={id}
      data-reveal=""
      className={className}
      aria-label={label}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={container}
      custom={{ stagger, delay }}
    >
      {lines.map((units, li) => (
        <span key={li} className="block" aria-hidden="true">
          {units.map((u, ui) => (
            <span key={ui} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span className={cn("inline-block will-change-transform", unitClassName)} variants={unit}>
                {u}
                {ui < units.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}
