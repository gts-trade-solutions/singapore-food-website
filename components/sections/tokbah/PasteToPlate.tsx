"use client";

import { useEffect, useRef } from "react";
import { usePinnable } from "@/components/motion/usePinnable";
import { getProduct } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { DrawLine } from "@/components/motion/DrawLine";
import { Steam } from "@/components/illustrations/Steam";

const STEPS = [
  { title: "Open the paste", body: "Every spice rendang asks for, already ground and sautéed. Spoon out one pack of Pes Rendang." },
  { title: "Into the pan", body: "Warm a little oil and fry the paste until it smells like a kenduri kitchen." },
  { title: "Add & simmer", body: "Add beef or chicken and coconut milk. Let it bubble low and slow while the sauce thickens." },
  { title: "Plate it up", body: "Rich, dark, clinging rendang. Serve with basmathi rice and let everyone dig in." },
];

/* ───────────────────────── Illustrations ───────────────────────── */

function Wok() {
  return (
    <svg viewBox="0 0 300 140" className="h-full w-full" aria-hidden="true">
      <path d="M10 40 H290 C280 110 220 135 150 135 C80 135 20 110 10 40Z" fill="#1d2b2b" />
      <path d="M22 44 H278 C268 100 216 124 150 124 C84 124 32 100 22 44Z" fill="#2e3f3f" />
      <path d="M290 46 h6 a6 6 0 0 1 0 12 h-14" stroke="#1d2b2b" strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M10 46 h-6 a6 6 0 0 0 0 12 h14" stroke="#1d2b2b" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Plate() {
  return (
    <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true">
      <ellipse cx="160" cy="110" rx="156" ry="62" fill="#FAF7F0" stroke="#B8893B" strokeWidth="3" />
      <ellipse cx="160" cy="106" rx="118" ry="44" fill="#E3F1F1" />
      {/* rice mound */}
      <path d="M70 108 C76 70 150 66 156 108 Z" fill="#fffdf6" stroke="#efe7d4" strokeWidth="2" />
      {/* rendang */}
      <path d="M150 112 C160 80 250 76 254 112 C230 128 170 128 150 112Z" fill="#5A2414" />
      {[
        [180, 100],
        [205, 94],
        [228, 102],
        [198, 112],
      ].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx="14" ry="8" fill="#3a170b" />
      ))}
      <circle cx="190" cy="92" r="3" fill="#2E7D32" />
      <circle cx="226" cy="96" r="3" fill="#D9372A" />
    </svg>
  );
}

/* ───────────────────────── Section ───────────────────────── */

export function PasteToPlate() {
  const sectionRef = useRef<HTMLElement>(null);
  const gsapMods = usePinnable();
  const enhanced = gsapMods !== null;
  const paste = getProduct("pes-rendang")!;

  useEffect(() => {
    if (!gsapMods || !sectionRef.current) return;
    const { gsap } = gsapMods;
    {
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(sectionRef.current);
        const steps = q("[data-step]");

        gsap.set(steps.slice(1), { autoAlpha: 0, y: 24 });
        gsap.set(q("[data-wok]"), { autoAlpha: 0, y: 80 });
        gsap.set(q("[data-blob]"), { autoAlpha: 0, scale: 0.6 });
        gsap.set(q("[data-beef]"), { autoAlpha: 0, y: -120 });
        gsap.set(q("[data-milk]"), { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 0%" });
        gsap.set(q("[data-wok-steam]"), { autoAlpha: 0 });
        gsap.set(q("[data-plate]"), { autoAlpha: 0, scale: 0.6, rotate: -20 });
        gsap.set(q("[data-plate-steam]"), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=100%", // one screen of scroll; no long pin-spacer
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const stepSwap = (from: number, to: number, at: number) => {
          tl.to(steps[from], { autoAlpha: 0, y: -24, duration: 0.6 }, at).to(steps[to], { autoAlpha: 1, y: 0, duration: 0.6 }, at + 0.3);
          tl.to(q(`[data-dot="${to}"]`), { scale: 1.6, opacity: 1, duration: 0.4 }, at + 0.3);
        };

        // 1 → 2: jar tilts over the wok, paste drops in.
        tl.to(q("[data-wok]"), { autoAlpha: 1, y: 0 }, 0.2)
          .to(q("[data-jar]"), { x: "18%", y: "-18%", rotate: 118, scale: 0.75 }, 0.2)
          .to(q("[data-blob]"), { autoAlpha: 1, yPercent: 600, scale: 1, ease: "power2.in" }, 0.9)
          .to(q("[data-wok-steam]"), { autoAlpha: 1, duration: 0.5 }, 1.3);
        stepSwap(0, 1, 0.4);

        // 2 → 3: jar exits, beef and coconut milk go in, wok shakes.
        tl.to(q("[data-jar]"), { autoAlpha: 0, x: "60%", y: "-40%", duration: 0.6 }, 1.8)
          .to(q("[data-beef]"), { autoAlpha: 1, y: 0, stagger: 0.1, ease: "bounce.out" }, 2)
          .to(q("[data-milk]"), { autoAlpha: 1, scaleY: 1, duration: 0.5 }, 2.1)
          .to(q("[data-milk]"), { autoAlpha: 0, duration: 0.4 }, 2.7)
          .to(q("[data-wok]"), { rotate: 3, yoyo: true, repeat: 5, duration: 0.12, ease: "sine.inOut" }, 2.4);
        stepSwap(1, 2, 2);

        // 3 → 4: wok slides away, the plate spins in with steam.
        tl.to(q("[data-wok-group]"), { autoAlpha: 0, y: 60, scale: 0.9 }, 3.4)
          .to(q("[data-plate]"), { autoAlpha: 1, scale: 1, rotate: 0, ease: "back.out(1.4)" }, 3.6)
          .to(q("[data-plate-steam]"), { autoAlpha: 1, duration: 0.5 }, 4.2);
        stepSwap(2, 3, 3.5);
        tl.to({}, { duration: 0.6 });
      }, sectionRef);
      return () => ctx.revert();
    }
  }, [gsapMods]);

  return (
    <section
      id="paste-to-plate"
      ref={sectionRef}
      aria-labelledby="ptp-title"
      className={cn("relative overflow-hidden bg-tb-aqua", enhanced ? "h-[100svh] pt-[var(--header-h)]" : "section-y")}
    >
      <div aria-hidden="true" className="bg-batik-dots absolute inset-0 opacity-50" />
      <div className={cn("container-page relative grid", enhanced ? "h-full grid-cols-2 items-center gap-12" : "gap-8 md:gap-10")}>
        {/* Copy */}
        <div>
          <p className="eyebrow mb-4">From paste to plate</p>
          <h2 id="ptp-title" className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-tb-teal">
            Rendang, the easy way
          </h2>
          <DrawLine className="mt-6 !max-w-[14rem]" />
          <ol className={cn("relative", enhanced ? "mt-10 h-44" : "mt-8 grid grid-cols-2 gap-4 md:mt-10 lg:grid-cols-4 lg:gap-6")}>
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                data-step
                className={cn(enhanced ? "absolute inset-0" : "flex flex-col-reverse justify-end gap-4 rounded-card bg-tb-ivory p-4 shadow-card md:p-5")}
                style={enhanced && i > 0 ? { visibility: "hidden" } : undefined}
              >
                <div>
                  <p className="font-serif text-lg text-tb-gold-ink italic md:text-xl">Step {i + 1}</p>
                  <h3 className={cn("mt-1 text-tb-teal", enhanced ? "text-4xl" : "text-2xl md:text-3xl")}>{step.title}</h3>
                  <p className={cn("mt-2 max-w-md leading-relaxed text-muted", enhanced ? "text-lg" : "text-sm md:text-base")}>{step.body}</p>
                </div>
                {!enhanced && (
                  <div aria-hidden="true" className="relative mx-auto aspect-[4/3] w-full max-w-48">
                    {i === 0 && <ProductImage src={paste.image.src} alt="" fill sizes="(min-width: 1024px) 12rem, 40vw" className="object-contain" />}
                    {i === 1 && (
                      <div className="absolute inset-x-0 bottom-0 h-20">
                        <Wok />
                        <span className="absolute top-3 left-1/2 h-6 w-20 -translate-x-1/2 rounded-full bg-[#8a2f17]" />
                      </div>
                    )}
                    {i === 2 && (
                      <div className="absolute inset-x-0 bottom-0 h-20">
                        <Steam className="absolute -top-14 left-1/2 w-20 -translate-x-1/2 text-tb-teal/40" />
                        <Wok />
                        <span className="absolute top-2 left-1/2 h-7 w-28 -translate-x-1/2 rounded-full bg-[#5A2414]" />
                      </div>
                    )}
                    {i === 3 && <Plate />}
                  </div>
                )}
              </li>
            ))}
          </ol>
          {enhanced && (
            <div aria-hidden="true" className="mt-10 flex gap-3">
              {STEPS.map((_, i) => (
                <span key={i} data-dot={i} className={cn("h-2 w-2 rounded-full bg-tb-gold", i === 0 ? "scale-150" : "opacity-30")} />
              ))}
            </div>
          )}
        </div>

        {/* Animated scene */}
        {enhanced && (
          <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[min(38rem,72svh)]">
            <div className="absolute inset-[4%] rounded-full border border-tb-gold/40" />
            <div className="absolute inset-[10%] rounded-full bg-tb-ivory" />

            <div data-wok-group className="absolute inset-x-[14%] bottom-[18%] h-[30%]">
              <div data-wok-steam className="absolute -top-[70%] left-1/2 w-[40%] -translate-x-1/2 text-tb-teal/40">
                <Steam />
              </div>
              <div data-wok className="absolute inset-0">
                <Wok />
                <span data-blob className="absolute -top-full left-[30%] h-[18%] w-[40%] rounded-full bg-[#8a2f17]" />
                {[
                  [-30, 0],
                  [-6, -6],
                  [18, 2],
                ].map(([x, y], k) => (
                  <span
                    key={k}
                    data-beef
                    className="absolute top-[8%] left-1/2 h-[16%] w-[14%] rounded-[40%] bg-[#4a1d10]"
                    style={{ marginLeft: `${x}%`, marginTop: `${y}%` }}
                  />
                ))}
                <span data-milk className="absolute -top-[110%] left-[56%] h-[110%] w-[5%] rounded-full bg-white/90" />
              </div>
            </div>

            <div data-jar className="absolute top-[12%] left-[30%] w-[40%]">
              <ProductImage src={paste.image.src} alt="" width={300} height={380} sizes="(min-width: 1024px) 15vw, 30vw" className="h-auto w-full drop-shadow-xl" />
            </div>

            <div data-plate className="absolute inset-x-[10%] top-[30%] h-[44%]">
              <div data-plate-steam className="absolute -top-[30%] left-1/2 w-[30%] -translate-x-1/2 text-tb-teal/40">
                <Steam />
              </div>
              <Plate />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
