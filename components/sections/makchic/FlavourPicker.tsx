"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Flavour, Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ui/ProductCard";
import { Chilli, CheeseWedge, Peanut } from "@/components/illustrations/Snacks";

const FLAVOURS: { key: Flavour; label: string; ms: string; Icon: typeof Chilli; blurb: string }[] = [
  { key: "cheesy", label: "Cheesy", ms: "Berkeju", Icon: CheeseWedge, blurb: "For people who lick the cheese dust off their fingers." },
  { key: "spicy", label: "Spicy", ms: "Pedas", Icon: Chilli, blurb: "A little heat, a lot of crunch. Keep a drink nearby." },
  { key: "savoury", label: "Classic", ms: "Asli", Icon: Peanut, blurb: "The old-school favourites. Salty, nutty, perfect with teh." },
];

export function FlavourPicker({ products }: { products: Product[] }) {
  const [active, setActive] = useState<Flavour>("cheesy");
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const current = FLAVOURS.find((f) => f.key === active)!;
  const matches = products.filter((p) => p.flavours.includes(active));

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = FLAVOURS.findIndex((f) => f.key === active);
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % FLAVOURS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + FLAVOURS.length) % FLAVOURS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = FLAVOURS.length - 1;
    else return;
    e.preventDefault();
    setActive(FLAVOURS[next].key);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="flavour-picker" aria-labelledby="fp-title" className="relative scroll-mt-20 overflow-hidden bg-mc-red section-y text-white">
      <div aria-hidden="true" className="bg-halftone absolute inset-0 opacity-40" />
      <div className="container-page relative">
        <div className="mx-auto mb-8 md:mb-10 max-w-2xl text-center">
          <p className="mb-4 font-pop text-xs font-extrabold tracking-[0.25em] text-white uppercase">Flavour picker</p>
          <h2 id="fp-title" className="font-script text-[clamp(2.75rem,6vw,5.5rem)] leading-none text-mc-cream">
            What are you craving?
          </h2>
        </div>

        <div role="tablist" aria-label="Flavours" onKeyDown={onKeyDown} className="mx-auto flex max-w-xl flex-wrap justify-center gap-3">
          {FLAVOURS.map((f, i) => {
            const selected = f.key === active;
            return (
              <motion.button
                key={f.key}
                ref={(el) => {
                  tabsRef.current[i] = el;
                }}
                role="tab"
                id={`tab-${f.key}`}
                aria-selected={selected}
                aria-controls="flavour-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(f.key)}
                whileTap={{ scaleX: 1.12, scaleY: 0.88 }}
                whileHover={{ y: -3, rotate: i % 2 ? 2 : -2 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
                className={cn(
                  "relative flex min-h-13 items-center gap-3 rounded-full border-[3px] border-mc-cocoa px-5 font-pop text-base font-bold",
                  selected ? "text-mc-cocoa" : "bg-mc-cream/10 text-white",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="flavour-pill"
                    className="absolute inset-0 rounded-full bg-mc-cheese shadow-[4px_4px_0_var(--mc-cocoa)]"
                    transition={{ type: "spring", stiffness: 400, damping: 26 }}
                  />
                )}
                <f.Icon className="relative h-7 w-7" />
                <span className="relative">
                  {f.label} <span className="font-normal opacity-80" lang="ms">· {f.ms}</span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <div id="flavour-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={active}
              className="mb-6 text-center font-pop text-base text-white md:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {current.blurb}
            </motion.p>
          </AnimatePresence>
          {/* Centred wrapping row: 2-4 matches never leave a half-empty grid row. */}
          <motion.ul layout className="flex flex-wrap justify-center gap-4 lg:gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {matches.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout
                  className="w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-1.125rem)]"
                  initial={{ opacity: 0, scale: 0.8, rotate: -6, y: 24 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, rotate: 8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.06 }}
                >
                  <ProductCard product={p} index={i} tilted sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw" />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
