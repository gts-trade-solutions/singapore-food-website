"use client";

import { motion, type Variants } from "framer-motion";
import type { BrandKey } from "@/lib/config";
import { brandForPath } from "@/lib/brand";
import { getProduct } from "@/data/products";
import { brands } from "@/data/brands";
import { LogoMark } from "@/components/ui/Logo";
import { BatikFlower } from "@/components/illustrations/Batik";
import { Steam } from "@/components/illustrations/Steam";
import { Chilli, Chip, Peanut, StickerBadge } from "@/components/illustrations/Snacks";

/**
 * What fills the page-transition wipe: a small branded "loading" scene for the
 * destination page (its name, tagline, a motif and a progress bar).
 * Children use the parent's variant names, so they appear only once the wipe has
 * fully covered the screen ("shown") and fade out before it wipes away ("leave").
 */

export const screenItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  leave: { opacity: 0, transition: { duration: 0.1 } },
};

const stagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
  leave: {},
};

const PAGE_NAMES: Record<string, string> = {
  "/": "Home",
  "/tok-bah": "Tok Bah",
  "/mak-chic": "Mak 'Chic' Keropok",
  "/shop": "The Shop",
  "/about": "About Us",
  "/contact": "Contact",
};

function destination(path: string): { title: string; brand: BrandKey } {
  const brand = brandForPath(path);
  const product = path.match(/^\/products\/([^/]+)/);
  if (product) return { title: getProduct(product[1])?.name ?? "Our kitchen", brand };
  return { title: PAGE_NAMES[path] ?? "RJS Foods", brand };
}

/** Indeterminate progress bar: one segment sliding across (transform only). */
function ProgressBar({ trackClass, barClass }: { trackClass: string; barClass: string }) {
  return (
    <motion.div variants={screenItem} className={`relative h-1 w-48 overflow-hidden rounded-full md:w-64 ${trackClass}`}>
      <motion.span
        className={`absolute inset-y-0 left-0 w-1/3 rounded-full ${barClass}`}
        animate={{ x: ["-110%", "320%"] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

function TokBahScene({ title, slow }: { title: string; slow: boolean }) {
  return (
    <>
      <div aria-hidden="true" className="bg-batik-dots absolute inset-0 opacity-50" />
      <motion.div variants={screenItem} aria-hidden="true" className="absolute -top-24 -left-24 h-80 w-80 text-tb-gold">
        <BatikFlower className="spin-slow h-full w-full opacity-20" />
      </motion.div>
      <motion.div variants={screenItem} aria-hidden="true" className="absolute -right-28 -bottom-28 h-96 w-96 text-tb-gold">
        <BatikFlower className="spin-slow h-full w-full opacity-15 [animation-direction:reverse]" />
      </motion.div>

      <motion.div variants={stagger} className="relative flex flex-col items-center px-6 text-center text-tb-ivory">
        {/* Steaming bowl */}
        <motion.div variants={screenItem} aria-hidden="true" className="relative mb-6 w-28 md:w-32">
          <Steam className="absolute -top-12 left-1/2 w-16 -translate-x-1/2 text-tb-gold" />
          <svg viewBox="0 0 120 60" className="w-full">
            <path d="M8 10 H112 A52 48 0 0 1 8 10Z" fill="#FAF7F0" />
            <path d="M18 14 H102 A42 30 0 0 1 18 14Z" fill="#5A2414" opacity=".9" />
            <path d="M2 10 H118" stroke="#B8893B" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </motion.div>
        <motion.p variants={screenItem} className="eyebrow !text-tb-gold-light">
          Tok Bah · Citarasa Nusantara
        </motion.p>
        <motion.p variants={screenItem} className="mt-3 font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-none italic">
          {title}
        </motion.p>
        <motion.p variants={screenItem} className="mt-3 font-serif text-lg text-tb-ivory/80 italic" lang="ms">
          {slow ? "Masih dimasak… still simmering" : brands["tok-bah"].taglines[0].ms}
        </motion.p>
        <motion.div variants={screenItem} aria-hidden="true" className="my-6 flex items-center gap-3 text-tb-gold">
          <span className="h-px w-12 bg-current" />
          <span className="h-2 w-2 rotate-45 border border-current" />
          <span className="h-px w-12 bg-current" />
        </motion.div>
        <ProgressBar trackClass="bg-tb-ivory/15" barClass="bg-tb-gold" />
      </motion.div>
    </>
  );
}

function MakChicScene({ title, slow }: { title: string; slow: boolean }) {
  const bits = [
    { Icon: Chilli, className: "w-9 md:w-11", delay: 0 },
    { Icon: Peanut, className: "w-7 md:w-8", delay: 0.12 },
    { Icon: Chip, className: "w-11 md:w-14", delay: 0.24 },
  ];
  return (
    <>
      <div aria-hidden="true" className="bg-halftone absolute inset-0 opacity-40" />
      <motion.div variants={screenItem} aria-hidden="true" className="absolute top-[10%] right-[8%] w-24 md:w-32">
        <StickerBadge className="w-full text-xs md:text-sm" center={"RANGUP\nSEDAP"} />
      </motion.div>

      <motion.div variants={stagger} className="relative flex flex-col items-center px-6 text-center text-white">
        {/* Snacks bouncing (spring-like keyframes, transform only) */}
        <motion.div variants={screenItem} aria-hidden="true" className="mb-6 flex items-end gap-4">
          {bits.map(({ Icon, className, delay }, i) => (
            <motion.div
              key={i}
              className={className}
              animate={{ y: [0, -22, 0, -6, 0], rotate: [0, i % 2 ? 14 : -14, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.15, delay, ease: "easeOut" }}
            >
              <Icon className="h-auto w-full drop-shadow-[2px_3px_0_rgb(74_31_18/0.4)]" />
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          variants={screenItem}
          className="inline-flex -rotate-2 rounded-full border-2 border-mc-cocoa bg-mc-cheese px-3 py-1 font-pop text-xs font-extrabold tracking-[0.2em] text-mc-cocoa uppercase"
        >
          Mak &apos;Chic&apos; Keropok
        </motion.p>
        <motion.p variants={screenItem} className="mt-4 font-script text-[clamp(2.75rem,7vw,5rem)] leading-none text-mc-cream">
          {title}
        </motion.p>
        <motion.p variants={screenItem} className="mt-3 font-pop text-base font-semibold text-white" lang="ms">
          {slow ? "Tengah goreng… frying a fresh batch" : brands["mak-chic"].taglines[0].ms}
        </motion.p>
        <div className="mt-6">
          <ProgressBar trackClass="bg-white/20" barClass="bg-mc-cheese" />
        </div>
      </motion.div>
    </>
  );
}

function RjsScene({ title, slow }: { title: string; slow: boolean }) {
  return (
    <>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-tb-teal via-tb-gold to-mc-red" />
      <motion.div variants={screenItem} aria-hidden="true" className="absolute -bottom-24 -left-24 h-80 w-80 text-tb-gold">
        <BatikFlower className="spin-slow h-full w-full opacity-10" />
      </motion.div>

      <motion.div variants={stagger} className="relative flex flex-col items-center px-6 text-center text-ivory">
        <motion.div variants={screenItem} aria-hidden="true" className="relative mb-6 grid h-28 w-28 place-items-center">
          {/* Turning dashed ring around the mark */}
          <svg viewBox="0 0 100 100" className="spin-slow absolute inset-0 h-full w-full text-tb-gold">
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 7" strokeLinecap="round" />
          </svg>
          <span className="grid h-20 w-20 place-items-center rounded-full bg-ivory">
            <LogoMark className="h-auto w-12" title="" />
          </span>
        </motion.div>
        <motion.p variants={screenItem} className="eyebrow !text-tb-gold-light">
          RJS Foods
        </motion.p>
        <motion.p variants={screenItem} className="mt-3 font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
          {title}
        </motion.p>
        <motion.p variants={screenItem} className="mt-3 text-sm text-ivory/75" lang="ms">
          {slow ? "Almost ready, plating up…" : "Tradisi · Rasa · Bersama — mmm...dapp!"}
        </motion.p>
        <div className="mt-6">
          <ProgressBar trackClass="bg-ivory/15" barClass="bg-gradient-to-r from-tb-teal via-tb-gold to-mc-red" />
        </div>
      </motion.div>
    </>
  );
}

export function TransitionScreen({ href, slow }: { href: string; slow: boolean }) {
  const path = href.split(/[?#]/)[0] || "/";
  const { title, brand } = destination(path);
  return (
    <div className="relative grid h-full w-full place-items-center overflow-hidden">
      {brand === "tokbah" ? (
        <TokBahScene title={title} slow={slow} />
      ) : brand === "makchic" ? (
        <MakChicScene title={title} slow={slow} />
      ) : (
        <RjsScene title={title} slow={slow} />
      )}
      <span className="sr-only" role="status">
        Loading {title}
      </span>
    </div>
  );
}
