"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { Chip } from "@/components/illustrations/Snacks";

type Crumb = { id: number; x: number; y: number; r: number; size: number; color: string };

const COLORS = ["#F3D27A", "#E8A317", "#F5B325", "#D9372A", "#C98A2B"];
const WORDS = ["KRAK!", "RANGUP!", "CRUNCH!", "SEDAP!", "KRIUK!"];

let crumbId = 0;

/** Tap the giant chip: it squashes, crumbs burst out with spring physics, and the counter climbs. */
export function CrunchZone() {
  const reduced = usePrefersReducedMotion();
  const chip = useAnimationControls();
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);
  const [count, setCount] = useState(0);
  const [word, setWord] = useState<{ id: number; text: string } | null>(null);
  const timeouts = useRef<number[]>([]);

  const crunch = () => {
    setCount((c) => c + 1);
    setWord({ id: ++crumbId, text: WORDS[Math.floor(Math.random() * WORDS.length)] });
    if (reduced) return;

    chip.start({
      scaleX: [1, 1.18, 0.94, 1.03, 1],
      scaleY: [1, 0.8, 1.08, 0.98, 1],
      rotate: [0, -4, 3, 0],
      transition: { duration: 0.5 },
    });

    const burst: Crumb[] = Array.from({ length: 12 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 160;
      return {
        id: ++crumbId,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.7 - 40,
        r: Math.random() * 540 - 270,
        size: 10 + Math.random() * 18,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
    });
    setCrumbs((c) => [...c, ...burst].slice(-48));
    const t = window.setTimeout(() => setCrumbs((c) => c.filter((x) => !burst.includes(x))), 1100);
    timeouts.current.push(t);
  };

  return (
    <section aria-labelledby="crunch-title" className="relative overflow-hidden bg-mc-cream section-y">
      <div className="container-page grid items-center gap-8 md:grid-cols-2 md:gap-10">
        <div>
          <p className="mb-4 font-pop text-xs font-extrabold tracking-[0.25em] text-mc-red-ink uppercase">The crunch test</p>
          <h2 id="crunch-title" className="font-script text-[clamp(2.75rem,6vw,5rem)] leading-none text-mc-cocoa">
            Go on, give it a crunch.
          </h2>
          <p className="mt-4 max-w-md font-pop text-base text-mc-cocoa/85 md:text-lg">
            Every batch is fried small and seasoned while warm, so the crunch is loud and the flavour sticks. Tap the chip to
            hear it (well, almost).
          </p>
          <p className="mt-6 font-pop text-mc-cocoa">
            <span className="text-5xl font-extrabold tabular-nums">{count}</span>{" "}
            <span className="text-sm font-semibold tracking-widest uppercase">crunches and counting</span>
          </p>
        </div>

        <div className="relative grid min-h-[16rem] place-items-center md:min-h-[20rem]">
          <div aria-hidden="true" className="absolute h-60 w-60 rounded-full border-[3px] border-dashed border-mc-cocoa/30 md:h-80 md:w-80" />
          <motion.button
            type="button"
            onClick={crunch}
            animate={chip}
            whileHover={reduced ? undefined : { rotate: -3, scale: 1.04 }}
            className="relative z-10 w-48 rounded-full md:w-64"
            aria-label="Crunch the chip"
          >
            <Chip className="h-auto w-full drop-shadow-[8px_10px_0_rgb(74_31_18/0.5)]" />
          </motion.button>

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
            <AnimatePresence>
              {crumbs.map((c) => (
                <motion.span
                  key={c.id}
                  className="absolute rounded-[35%] border-2 border-mc-cocoa"
                  style={{ width: c.size, height: c.size * 0.8, backgroundColor: c.color }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 0.4 }}
                  animate={{ x: c.x, y: [0, c.y, c.y + 220], rotate: c.r, opacity: [1, 1, 0], scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 10,
                    // Keyframed values need explicit tweens (springs support two keyframes only).
                    y: { type: "tween", duration: 1, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] },
                    opacity: { type: "tween", duration: 1, times: [0, 0.7, 1] },
                  }}
                />
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {word && (
                <motion.span
                  key={word.id}
                  className="absolute -top-2 right-[10%] rotate-6 rounded-2xl border-[3px] border-mc-cocoa bg-mc-cheese px-4 py-2 font-pop text-2xl font-extrabold text-mc-cocoa shadow-card"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 6 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                >
                  {word.text}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <span className="sr-only" aria-live="polite">
            {count > 0 ? `${count} crunches` : ""}
          </span>
        </div>
      </div>
    </section>
  );
}
