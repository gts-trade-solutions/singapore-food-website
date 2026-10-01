"use client";

import { motion, type Variants } from "framer-motion";
import { howItWorks } from "@/data/content";
import { SplitText } from "@/components/motion/SplitText";
import { Steam } from "@/components/illustrations/Steam";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.2, delay: 0.2 + i * 0.15, ease: "easeInOut" }, opacity: { duration: 0.2 } },
  }),
};

function HeatIcon() {
  return (
    <div className="relative h-full w-full">
      <Steam className="absolute top-[14%] left-[32%] w-[36%] text-tb-gold" />
    <svg viewBox="0 0 120 120" fill="none" className="h-full w-full" aria-hidden="true">
      <motion.path variants={draw} custom={0} d="M24 58 H96 V84 a14 14 0 0 1 -14 14 H38 a14 14 0 0 1 -14 -14Z" stroke="currentColor" strokeWidth="3" />
      <motion.path variants={draw} custom={1} d="M18 58 H102" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <motion.path variants={draw} custom={2} d="M96 66 h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <motion.g
        className="text-mc-red"
        style={{ transformOrigin: "60px 112px" }}
        animate={{ scaleY: [1, 1.18, 0.92, 1.1, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M48 112 c0 -8 6 -8 6 -14 c4 4 6 8 6 14 M66 112 c0 -6 4 -8 4 -12 c4 4 4 8 4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
    </svg>
    </div>
  );
}

function ServeIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-full w-full" aria-hidden="true">
      <motion.path variants={draw} custom={0} d="M14 70 H106 a46 26 0 0 1 -92 0Z" stroke="currentColor" strokeWidth="3" />
      <motion.path variants={draw} custom={1} d="M30 62 c10 -16 50 -16 60 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <motion.g
        variants={{
          hidden: { y: -30, rotate: -30, opacity: 0 },
          visible: { y: 0, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 12, delay: 0.9 } },
        }}
        style={{ transformOrigin: "88px 30px" }}
        className="text-tb-gold"
      >
        <path d="M70 48 L100 18" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="66" cy="52" rx="10" ry="6" transform="rotate(-45 66 52)" fill="currentColor" />
      </motion.g>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 120 120" fill="none" className="h-full w-full" aria-hidden="true">
      <motion.circle variants={draw} custom={0} cx="60" cy="64" r="40" stroke="currentColor" strokeWidth="3" />
      {[
        [60, 44],
        [42, 76],
        [78, 76],
      ].map(([cx, cy], i) => (
        <motion.g
          key={i}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 260, damping: 14, delay: 0.6 + i * 0.15 } },
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <path d={`M${cx - 11} ${cy} h22 a11 8 0 0 1 -22 0Z`} fill={i === 0 ? "var(--tb-teal)" : i === 1 ? "var(--mc-red)" : "var(--tb-gold)"} />
        </motion.g>
      ))}
      <motion.path
        variants={draw}
        custom={3}
        d="M60 6 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1Z"
        stroke="var(--tb-gold)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = { heat: HeatIcon, serve: ServeIcon, share: ShareIcon };

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" data-brand="tokbah" className="relative z-10 overflow-hidden bg-tb-teal section-y text-tb-ivory">
      <div aria-hidden="true" className="bg-batik-dots absolute inset-0 opacity-40" />
      <div className="container-page relative">
        <div className="mx-auto mb-8 md:mb-10 max-w-2xl text-center">
          <p className="eyebrow mb-4 !text-tb-gold-light">How it works</p>
          <SplitText
            as="h2"
            id="how-title"
            text="Heat. Serve. Share."
            className="font-serif text-[clamp(2.75rem,6vw,5.5rem)] leading-none italic"
          />
          <p className="mt-4 text-base text-tb-ivory/80 md:text-lg">A home-cooked Nusantara meal in about ten minutes, with nobody stuck at the stove all day.</p>
        </div>

        <motion.ol
          className="relative grid gap-8 md:grid-cols-3 md:gap-6"
          data-reveal=""
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          transition={{ staggerChildren: 0.25 }}
        >
          {/* Connecting line draws across the steps on desktop. */}
          <svg aria-hidden="true" className="absolute top-[4.5rem] right-[16%] left-[16%] hidden h-2 md:block" preserveAspectRatio="none" viewBox="0 0 100 2">
            <motion.path
              d="M0 1 H100"
              stroke="var(--tb-gold)"
              strokeWidth="0.4"
              strokeDasharray="1 1.5"
              variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { duration: 1.6, ease: "easeInOut" } } }}
            />
          </svg>
          {howItWorks.map((step, i) => {
            const Icon = ICONS[step.key];
            return (
              <motion.li
                key={step.key}
                className="relative flex flex-col items-center text-center"
                variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
              >
                <div className="relative mb-5 grid h-32 w-32 place-items-center rounded-full border border-tb-gold/40 bg-tb-teal p-6 text-tb-ivory md:h-36 md:w-36">
                  <Icon />
                  <span className="absolute -top-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-tb-gold font-serif text-lg text-tb-teal">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-serif text-4xl">{step.title}</h3>
                <p className="mt-3 max-w-xs text-tb-ivory/80">{step.body}</p>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
