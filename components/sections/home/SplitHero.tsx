"use client";

import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useState, type CSSProperties, type ReactNode } from "react";
import { getProduct } from "@/data/products";
import { useUI } from "@/lib/ui-store";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { SplitText } from "@/components/motion/SplitText";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/utils";
import { Steam } from "@/components/illustrations/Steam";
import { BatikFlower } from "@/components/illustrations/Batik";
import { Chilli, Peanut, Chip } from "@/components/illustrations/Snacks";
import { LogoMark } from "@/components/ui/Logo";

type Side = "left" | "right" | null;

/** An element that drifts with the mouse; `depth` scales the travel. */
function Float({
  mx,
  my,
  depth,
  rotate = 0,
  className,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  rotate?: number;
  className?: string;
  children: ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth * 40);
  const y = useTransform(my, (v) => v * depth * 30);
  const r = useTransform(mx, (v) => rotate + v * depth * 6);
  return (
    <motion.div className={cn("absolute will-change-transform", className)} style={{ x, y, rotate: r }}>
      {children}
    </motion.div>
  );
}

export function SplitHero() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduced = usePrefersReducedMotion();
  const setPreviewBrand = useUI((s) => s.setPreviewBrand);
  const [active, setActive] = useState<Side>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 });

  const hover = (side: Side) => {
    if (!isDesktop) return;
    setActive(side);
    setPreviewBrand(side === "left" ? "tokbah" : side === "right" ? "makchic" : null);
  };

  // Left layer is revealed up to `split` percent of the width.
  const split = active === "left" ? 62 : active === "right" ? 38 : 50;
  const rendang = getProduct("rendang-daging")!;
  const kicap = getProduct("ayam-masak-kicap")!;
  const tempe = getProduct("tempe-chips-cheesy-spicy")!;
  const ubi = getProduct("kerepek-ubi-cheese")!;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col overflow-hidden md:min-h-[85vh]"
      onPointerMove={(e) => {
        if (reduced || !isDesktop) return;
        rawX.set(e.clientX / window.innerWidth - 0.5);
        rawY.set(e.clientY / window.innerHeight - 0.5);
      }}
      onPointerLeave={() => hover(null)}
    >
      <h1 id="hero-title" className="sr-only">
        RJS Foods: Tok Bah heritage meals and Mak &apos;Chic&apos; Keropok snacks, Nusantara flavours for Singapore
      </h1>

      {/* Stage: stacked, content-height panels on mobile; overlapping split layers from md. */}
      <div className="relative flex flex-col md:min-h-[540px] md:flex-1">
        {/* ───────── Mak 'Chic' (right / bottom) ───────── */}
        <div
          data-brand="makchic"
          className="relative order-2 bg-mc-red text-white md:absolute md:inset-0"
          onPointerEnter={() => hover("right")}
        >
          <div aria-hidden="true" className="bg-halftone absolute inset-0 opacity-40" />
          <motion.div
            className="relative px-4 pt-10 pb-10 sm:px-6 md:ml-auto md:flex md:h-full md:w-1/2 md:flex-col md:justify-center md:px-10 md:pt-[var(--header-h)] md:pb-8 lg:px-16"
            animate={isDesktop ? { x: active === "left" ? "18%" : "0%", opacity: active === "left" ? 0.35 : 1 } : undefined}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative z-10 max-w-md md:ml-auto md:text-right">
              <p className="mb-3 font-pop text-xs font-bold tracking-[0.25em] text-white uppercase">Mak &apos;Chic&apos; Keropok</p>
              <SplitText
                as="h2"
                by="line"
                immediate
                delay={0.15}
                stagger={0.12}
                text={"Rangup.\nSedap.\nHabis."}
                className="font-script text-[clamp(3.25rem,6.5vw,6.5rem)] leading-[0.9] text-mc-cream"
              />
              <p className="mt-4 max-w-[62%] font-pop text-base text-white sm:max-w-sm md:ml-auto">
                Crispy, cheesy, chilli-loud snacks. Kampung favourites with a cheeky twist.
              </p>
              <div className="mt-6 flex md:justify-end">
                <MagneticButton>
                  <ButtonLink href="/mak-chic" size="lg" className="!rounded-full !bg-mc-cheese font-pop !text-mc-cocoa">
                    Get crunching <ArrowIcon />
                  </ButtonLink>
                </MagneticButton>
              </div>
            </div>
          </motion.div>

          {/* Floating snacks */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 md:left-1/2">
            <Float mx={mx} my={my} depth={1.2} rotate={8} className="top-[4.5rem] right-4 w-[30vw] max-w-[200px] sm:right-8 md:top-[16%] md:right-auto md:left-[6%] md:w-[14vw]">
              <div className="float-y">
                <ProductImage src={tempe.image.src} alt="" width={300} height={380} sizes="(min-width: 768px) 14vw, 30vw" className="h-auto w-full drop-shadow-[0_30px_30px_rgb(0_0_0/0.35)]" />
              </div>
            </Float>
            <Float mx={mx} my={my} depth={0.7} rotate={-10} className="hidden w-[10vw] max-w-[170px] md:bottom-[8%] md:left-[3%] md:block">
              <div className="float-y [animation-delay:-2s]">
                <ProductImage src={ubi.image.src} alt="" width={300} height={380} sizes="10vw" className="h-auto w-full drop-shadow-[0_30px_30px_rgb(0_0_0/0.35)]" />
              </div>
            </Float>
            {/* Decorations sit in the free area between the packs and the copy, never over text. */}
            <Float mx={mx} my={my} depth={2} rotate={24} className="hidden w-14 md:right-[44%] md:bottom-[4%] md:block">
              <Chilli />
            </Float>
            <Float mx={mx} my={my} depth={1.6} rotate={-20} className="hidden w-10 md:top-[22%] md:left-[34%] md:block">
              <Peanut />
            </Float>
            <Float mx={mx} my={my} depth={2.4} rotate={-30} className="top-[46%] left-[26%] hidden w-14 md:block">
              <Chip />
            </Float>
          </div>
        </div>

        {/* ───────── Tok Bah (left / top) ───────── */}
        {/* Clip-path is driven by a CSS variable so the server render is already split 50/50. */}
        <div
          data-brand="tokbah"
          className="relative order-1 bg-tb-teal text-tb-ivory md:absolute md:inset-0 md:z-10 md:[clip-path:inset(0_calc(100%-var(--split))_0_0)] md:transition-[clip-path] md:duration-1000 md:ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none"
          style={{ "--split": `${split}%` } as CSSProperties}
          onPointerEnter={() => hover("left")}
        >
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,#1F4D36_0%,transparent_60%)] opacity-80" />
          <BatikFlower className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 text-tb-gold opacity-15" />
          <BatikFlower className="pointer-events-none absolute bottom-10 left-[36%] hidden h-40 w-40 text-tb-gold opacity-10 md:block" />

          <motion.div
            className="relative px-4 pt-[calc(var(--header-h)+1.5rem)] pb-10 sm:px-6 md:flex md:h-full md:w-1/2 md:flex-col md:justify-center md:px-10 md:pt-[var(--header-h)] md:pb-8 lg:px-16"
            animate={isDesktop ? { x: active === "right" ? "-18%" : "0%", opacity: active === "right" ? 0.35 : 1 } : undefined}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative z-10 max-w-md">
              <p className="eyebrow mb-3 !text-tb-gold-light">
                Tok Bah<span className="hidden sm:inline md:hidden lg:inline"> · Citarasa Nusantara</span>
              </p>
              <SplitText
                as="h2"
                by="line"
                immediate
                delay={0}
                stagger={0.12}
                text={"Tradisi.\nRasa.\nBersama."}
                className="font-serif text-[clamp(3.25rem,6.5vw,6.5rem)] leading-[0.92] font-medium italic"
              />
              <p className="mt-4 max-w-[62%] text-base text-tb-ivory/85 sm:max-w-sm">
                Heritage meals and cooking pastes, slow-cooked the way our grandparents did.
              </p>
              <div className="mt-6">
                <MagneticButton>
                  <ButtonLink href="/tok-bah" size="lg" className="!bg-tb-gold !text-tb-ink-deep">
                    Discover Tok Bah <ArrowIcon />
                  </ButtonLink>
                </MagneticButton>
              </div>
            </div>
          </motion.div>

          {/* Floating bowls */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 md:right-1/2">
            <Float mx={mx} my={my} depth={1} rotate={-6} className="top-[calc(var(--header-h)+3.5rem)] right-4 w-[30vw] max-w-[200px] sm:right-8 md:top-[18%] md:right-[3%] md:w-[13vw] lg:right-[4%] lg:w-[14vw]">
              <div className="float-y">
                <Steam className="absolute -top-12 left-1/2 w-16 -translate-x-1/2 text-tb-ivory/70 md:-top-14 md:w-20" />
                <ProductImage src={rendang.image.src} alt="" width={300} height={380} priority sizes="(min-width: 768px) 14vw, 30vw" className="h-auto w-full drop-shadow-[0_30px_30px_rgb(0_0_0/0.35)]" />
              </div>
            </Float>
            <Float mx={mx} my={my} depth={0.6} rotate={5} className="right-[20%] bottom-[8%] hidden w-[9vw] max-w-[150px] md:block">
              <div className="float-y [animation-delay:-3s]">
                <ProductImage src={kicap.image.src} alt="" width={300} height={380} sizes="9vw" className="h-auto w-full drop-shadow-[0_30px_30px_rgb(0_0_0/0.35)]" />
              </div>
            </Float>
          </div>
        </div>

        {/* Seam badge rides the split line (transform only). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[calc(50%+var(--header-h)/2)] left-1/2 z-20 hidden transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] md:block"
          style={{ transform: `translateX(${split - 50}vw)` }}
        >
          <div className="grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ivory shadow-lift">
            <LogoMark className="h-12 w-12" />
          </div>
        </div>
      </div>

      <TrustRow />
    </section>
  );
}

// TODO: confirm each point is accurate for the business before launch.
const TRUST_POINTS = [
  { label: "Family recipes, slow-cooked", icon: "M4 13h16v1a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-1ZM2 13h20M9 9c-1-1.5 1-2.5 0-4M13 9c-1-1.5 1-2.5 0-4" },
  { label: "Ready in about 10 minutes", icon: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" },
  { label: "Order easily on WhatsApp", icon: "M4 5h16v11H8l-4 4V5ZM8 10h8M8 13h5" },
  { label: "Delivered within Singapore", icon: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" },
];

/** Row of trust points closing the hero; part of the first screen at 1280x720. */
function TrustRow() {
  return (
    <div className="relative z-20 border-b border-charcoal/10 bg-ivory">
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-3 py-4 md:grid-cols-4 md:py-5">
        {TRUST_POINTS.map((t) => (
          <li key={t.label} className="flex items-center gap-3 text-sm font-medium text-charcoal">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tb-aqua text-tb-teal">
              <svg
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={t.icon} />
              </svg>
            </span>
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
