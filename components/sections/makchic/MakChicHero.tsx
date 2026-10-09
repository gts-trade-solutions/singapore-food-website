"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ComponentType } from "react";
import { getProduct } from "@/data/products";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { SplitText } from "@/components/motion/SplitText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { CertificationBadges } from "@/components/ui/CertificationBadges";
import { BrushStroke, CheeseWedge, Chilli, Chip, Peanut, StickerBadge } from "@/components/illustrations/Snacks";

type Bit = {
  Icon: ComponentType<{ className?: string }>;
  className: string;
  /** How far it falls (px) over the first screen of scroll. */
  fall: number;
  spin: number;
  stiffness: number;
};

const BITS: Bit[] = [
  { Icon: Chilli, className: "top-[18%] left-[6%] hidden md:block md:w-16", fall: 420, spin: 160, stiffness: 120 },
  { Icon: Peanut, className: "top-[12%] left-[44%] hidden md:block md:w-10", fall: 520, spin: -220, stiffness: 80 },
  { Icon: Chip, className: "top-[30%] right-[8%] hidden md:block md:w-20", fall: 360, spin: 120, stiffness: 160 },
  { Icon: CheeseWedge, className: "bottom-[24%] left-[10%] hidden w-20 md:block", fall: 300, spin: -90, stiffness: 100 },
  { Icon: Peanut, className: "top-[62%] right-[6%] w-6 md:right-[30%] md:w-9", fall: 480, spin: 300, stiffness: 60 },
  { Icon: Chilli, className: "top-[8%] right-[26%] hidden w-12 md:block", fall: 560, spin: -140, stiffness: 140 },
  { Icon: Chip, className: "bottom-[8%] left-[4%] w-12 md:bottom-[12%] md:left-[38%] md:w-16", fall: 260, spin: 200, stiffness: 90 },
];

/** A snack that drops in on load, then tumbles with springy physics as you scroll. */
function FallingBit({ bit, index, progress }: { bit: Bit; index: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const y = useSpring(useTransform(progress, [0, 1], [0, bit.fall]), { stiffness: bit.stiffness, damping: 9, mass: 0.8 });
  const rotate = useSpring(useTransform(progress, [0, 1], [0, bit.spin]), { stiffness: bit.stiffness, damping: 12 });
  const { Icon } = bit;
  return (
    <motion.div className={`absolute ${bit.className}`} style={{ y, rotate }}>
      <motion.div
        initial={{ y: -320, opacity: 0, rotate: -40 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 11, delay: 0.3 + index * 0.08 }}
      >
        <Icon className="h-auto w-full drop-shadow-[3px_4px_0_rgb(74_31_18/0.35)]" />
      </motion.div>
    </motion.div>
  );
}

const MOODS = [
  { label: "Cheesy", tone: "bg-mc-cheese text-mc-cocoa" },
  { label: "Spicy", tone: "bg-mc-red text-white" },
  { label: "Classic", tone: "bg-white text-mc-cocoa" },
];

export function MakChicHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const tempe = getProduct("tempe-chips-cheesy-spicy")!;
  const rempeyek = getProduct("rempeyek")!;
  const packY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -60]), { stiffness: 120, damping: 14 });

  return (
    <section
      ref={ref}
      aria-labelledby="mc-title"
      className="bg-halftone section-top relative overflow-hidden bg-mc-cream"
    >
      {!reduced && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {BITS.map((bit, i) => (
            <FallingBit key={i} bit={bit} index={i} progress={scrollYProgress} />
          ))}
        </div>
      )}

      <div className="container-page relative grid items-center gap-8 md:gap-10 lg:grid-cols-2">
        <div className="relative z-10">
          <p className="mb-5 inline-flex -rotate-2 rounded-full border-[3px] border-mc-cocoa bg-mc-cheese px-4 py-1.5 font-pop text-xs font-extrabold tracking-[0.2em] text-mc-cocoa uppercase shadow-card">
            Keropok · Crackers
          </p>
          <h1 id="mc-title" className="relative">
            <span className="sr-only">Mak &apos;Chic&apos; Keropok crackers: mmm...dapp!</span>
            <span aria-hidden="true" className="relative block">
              <SplitText
                as="span"
                by="line"
                immediate
                delay={0.15}
                text={"Mak 'Chic'"}
                className="block font-script text-[clamp(3.75rem,10vw,8.5rem)] leading-[0.9] text-mc-red-ink"
              />
              <span className="absolute -bottom-2 left-0 -z-10 h-6 w-[80%] md:h-8">
                <BrushStroke />
              </span>
            </span>
            <span aria-hidden="true" className="mt-4 block font-pop text-[clamp(1.75rem,4vw,3rem)] leading-tight font-extrabold text-mc-cocoa">
              mmm...dapp!
            </span>
          </h1>
          <p className="mt-4 max-w-md font-pop text-base text-mc-cocoa/90 md:text-lg">
            Crispy, cheesy, chilli-loud crackers. Kampung favourites with a cheeky twist, made to be passed around (or not).
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <MagneticButton>
              <ButtonLink href="#mc-products" size="lg" className="font-pop shadow-card">
                Grab a pack <ArrowIcon />
              </ButtonLink>
            </MagneticButton>
            <ButtonLink href="#flavour-picker" variant="ghost" size="lg" className="font-pop">
              Pick your flavour
            </ButtonLink>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Flavour moods">
            {MOODS.map((m) => (
              <li
                key={m.label}
                className={`inline-flex -rotate-1 items-center rounded-full border-2 border-mc-cocoa px-3 py-1 font-pop text-sm font-semibold ${m.tone}`}
              >
                {m.label}
              </li>
            ))}
          </ul>
          <CertificationBadges className="mt-6" />
        </div>

        <motion.div className="relative mx-auto w-full max-w-md lg:max-w-xl" style={reduced ? undefined : { y: packY }}>
          <div aria-hidden="true" className="absolute inset-[4%] rounded-full border-[3px] border-mc-cocoa bg-mc-cheese" />
          <motion.div
            data-reveal=""
            className="relative z-10 mx-auto w-[68%]"
            initial={{ rotate: -14, scale: 0.6, opacity: 0 }}
            animate={{ rotate: -6, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 10, delay: 0.2 }}
          >
            <ProductImage
              src={tempe.image.src}
              alt={tempe.image.alt}
              width={300}
              height={380}
              sizes="(min-width: 1024px) 18vw, 40vw"
              priority
              className="h-auto w-full drop-shadow-[8px_10px_0_rgb(74_31_18/0.6)]"
            />
          </motion.div>
          <motion.div
            data-reveal=""
            className="absolute right-0 bottom-[-4%] z-20 w-[42%]"
            initial={{ rotate: 30, x: 80, opacity: 0 }}
            animate={{ rotate: 10, x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 10, delay: 0.45 }}
          >
            <ProductImage
              src={rempeyek.image.src}
              alt={rempeyek.image.alt}
              width={300}
              height={380}
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="h-auto w-full drop-shadow-[6px_8px_0_rgb(74_31_18/0.6)]"
            />
          </motion.div>
          <StickerBadge className="absolute top-0 left-0 z-30 w-24 text-sm md:w-32" center={"100%\nRANGUP"} />
        </motion.div>
      </div>
    </section>
  );
}
