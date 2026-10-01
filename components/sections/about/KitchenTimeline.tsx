"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { kitchenTimeline } from "@/data/content";
import { Reveal } from "@/components/motion/Reveal";

/** Vertical process timeline; the spine fills as you scroll through it. */
export function KitchenTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className="absolute top-6 bottom-6 left-6 w-px bg-line" />
      <motion.span
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-6 w-px origin-top bg-gradient-to-b from-tb-teal via-tb-gold to-mc-red"
        style={{ scaleY }}
      />
      {kitchenTimeline.map((item, i) => (
        <li key={item.step} className="relative grid grid-cols-[3rem_1fr] gap-4 pb-6 last:pb-0 md:gap-5">
          <span
            aria-hidden="true"
            className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-tb-gold bg-ivory font-serif text-lg text-tb-teal italic"
          >
            {item.step}
          </span>
          <Reveal delay={i * 0.04} className="rounded-card bg-[#F2EDE3] p-4 md:p-5">
            <h3 className="font-serif text-2xl text-charcoal md:text-3xl">{item.title}</h3>
            <p className="mt-1 leading-relaxed text-muted">{item.body}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
