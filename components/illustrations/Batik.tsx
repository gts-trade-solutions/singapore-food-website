"use client";

import { motion, useScroll, useSpring, type MotionValue } from "framer-motion";
import { usePathname } from "next/navigation";
import { brandForPath } from "@/lib/brand";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/** Long vertical batik vine: a wandering stem with leaves and blossoms. */
const STEM =
  "M40 0 C10 60 70 110 40 170 S10 280 40 340 S70 450 40 510 S10 620 40 680 S70 790 40 850 S10 960 40 1020";
const LEAVES = [
  "M40 170 c18 -6 30 -22 26 -40 c-16 4 -26 18 -26 40z",
  "M40 340 c-18 -6 -30 -22 -26 -40 c16 4 26 18 26 40z",
  "M40 510 c18 -6 30 -22 26 -40 c-16 4 -26 18 -26 40z",
  "M40 680 c-18 -6 -30 -22 -26 -40 c16 4 26 18 26 40z",
  "M40 850 c18 -6 30 -22 26 -40 c-16 4 -26 18 -26 40z",
];
const CURLS = [
  "M55 95 c14 -4 18 -18 8 -24 c-8 -4 -14 4 -8 10",
  "M25 255 c-14 -4 -18 -18 -8 -24 c8 -4 14 4 8 10",
  "M55 425 c14 -4 18 -18 8 -24 c-8 -4 -14 4 -8 10",
  "M25 595 c-14 -4 -18 -18 -8 -24 c8 -4 14 4 8 10",
  "M55 765 c14 -4 18 -18 8 -24 c-8 -4 -14 4 -8 10",
  "M25 935 c-14 -4 -18 -18 -8 -24 c8 -4 14 4 8 10",
];
const BLOOMS = [
  [64, 120],
  [16, 290],
  [64, 460],
  [16, 630],
  [64, 800],
  [16, 970],
];

function Bloom({ cx, cy, progress, at }: { cx: number; cy: number; progress: MotionValue<number>; at: number }) {
  return (
    <motion.g
      style={{ opacity: progress, scale: progress, transformOrigin: `${cx}px ${cy}px` }}
      data-at={at}
    >
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse
          key={r}
          cx={cx}
          cy={cy - 6}
          rx="3.2"
          ry="6"
          transform={`rotate(${r} ${cx} ${cy})`}
          fill="var(--tb-gold)"
          fillOpacity="0.55"
        />
      ))}
      <circle cx={cx} cy={cy} r="2.4" fill="var(--tb-teal)" />
    </motion.g>
  );
}

/** Static or self-drawing batik vine. Pass `progress` (0–1) to drive the drawing. */
export function BatikVine({
  progress,
  className,
}: {
  progress?: MotionValue<number>;
  className?: string;
}) {
  const style = progress ? { pathLength: progress } : undefined;
  return (
    <svg viewBox="0 0 80 1020" fill="none" className={className} aria-hidden="true" preserveAspectRatio="xMidYMin slice">
      <motion.path d={STEM} stroke="var(--tb-teal)" strokeOpacity="0.5" strokeWidth="1.4" style={style} />
      {LEAVES.map((d) => (
        <motion.path key={d} d={d} stroke="var(--tb-teal)" strokeOpacity="0.45" strokeWidth="1.1" style={style} />
      ))}
      {CURLS.map((d) => (
        <motion.path key={d} d={d} stroke="var(--tb-gold)" strokeWidth="1.1" style={style} />
      ))}
      {progress
        ? BLOOMS.map(([cx, cy], i) => <Bloom key={i} cx={cx} cy={cy} progress={progress} at={i} />)
        : BLOOMS.map(([cx, cy], i) => (
            <g key={i}>
              {[0, 72, 144, 216, 288].map((r) => (
                <ellipse
                  key={r}
                  cx={cx}
                  cy={cy - 6}
                  rx="3.2"
                  ry="6"
                  transform={`rotate(${r} ${cx} ${cy})`}
                  fill="var(--tb-gold)"
                  fillOpacity="0.55"
                />
              ))}
            </g>
          ))}
    </svg>
  );
}

/**
 * Batik vines along the page edges that draw themselves as you scroll.
 * Shown on RJS and Tok Bah pages at lg+; hidden on Mak 'Chic' (wrong mood) and mobile.
 */
export function ScrollVines() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  if (brandForPath(pathname) === "makchic") return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 z-0 hidden w-full 2xl:block">
      <BatikVine
        progress={reduced ? undefined : progress}
        className={cn("absolute top-0 left-1 h-full w-14 opacity-70 xl:left-3")}
      />
      <BatikVine
        progress={reduced ? undefined : progress}
        className={cn("absolute top-0 right-1 h-full w-14 -scale-x-100 opacity-70 xl:right-3")}
      />
    </div>
  );
}

/** Repeating batik flower used as a quiet background ornament. */
export function BatikFlower({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.2">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <path key={r} d="M60 60 C52 44 56 26 60 18 C64 26 68 44 60 60Z" transform={`rotate(${r} 60 60)`} />
        ))}
        <circle cx="60" cy="60" r="8" />
        <circle cx="60" cy="60" r="3" fill="currentColor" />
        <circle cx="60" cy="60" r="52" strokeDasharray="1 6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
