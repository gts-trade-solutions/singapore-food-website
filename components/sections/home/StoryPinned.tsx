"use client";

import { useEffect, useRef } from "react";
import { usePinnable } from "@/components/motion/usePinnable";
import { Reveal } from "@/components/motion/Reveal";
import { getProduct } from "@/data/products";
import { stats } from "@/data/content";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { Counter } from "@/components/motion/Counter";
import { Steam } from "@/components/illustrations/Steam";
import { BatikFlower } from "@/components/illustrations/Batik";
import { StickerBadge } from "@/components/illustrations/Snacks";
import { TransitionLink } from "@/components/motion/PageTransition";

const PANELS = [
  {
    key: "kitchen",
    eyebrow: "Our story",
    title: "Two brands,\none kitchen.",
    body: "RJS Foods began with a simple idea: the food we grew up with deserves a place on today's table. One kitchen, two very different moods.",
    points: ["Tok Bah meals & pastes", "Mak 'Chic' keropok", "Made for Singapore homes"],
    link: { href: "/about", label: "Read our story" },
  },
  {
    key: "tokbah",
    eyebrow: "Tok Bah",
    title: "The slow,\nsoulful side.",
    body: "Rendang that takes its time. Sambal sautéed until the oil splits. Tok Bah is the calm, heritage half of our kitchen: meals and pastes that taste like a family recipe.",
    points: ["Rendang Daging", "Ayam Masak Kicap", "Pes Sambal Tumis", "Pes Rendang"],
    link: { href: "/tok-bah", label: "Explore Tok Bah" },
  },
  {
    key: "makchic",
    eyebrow: "Mak 'Chic' Keropok",
    title: "The loud,\ncrunchy side.",
    body: "Rempeyek, tempe chips and cheesy cassava, fried in small batches and seasoned while warm. Mak 'Chic' is the half of the kitchen that never sits still.",
    points: ["Rempeyek", "Tempe Chips", "Tiub Cheese", "Kerepek Ubi Cheese"],
    link: { href: "/mak-chic", label: "Explore Mak 'Chic'" },
  },
  {
    key: "together",
    eyebrow: "Together",
    title: "Made for\none table.",
    body: "Rendang in the middle, keropok on the side, everyone reaching across. That's the table we cook for.",
    points: ["Rendang + rempeyek", "Kicap + tempe chips", "Both brands, one order"],
    link: { href: "/shop", label: "Shop both brands" },
  },
] as const;

const CHIP_TONE: Record<(typeof PANELS)[number]["key"], string> = {
  kitchen: "border-charcoal/15 bg-ivory text-charcoal",
  tokbah: "border-tb-gold/50 bg-tb-ivory text-tb-teal",
  makchic: "border-mc-cocoa bg-mc-cheese font-pop text-mc-cocoa",
  together: "border-charcoal/15 bg-ivory text-charcoal",
};

function PanelExtras({ panel }: { panel: (typeof PANELS)[number] }) {
  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${panel.eyebrow} highlights`}>
        {panel.points.map((pt) => (
          <li key={pt} className={cn("rounded-full border px-3 py-1.5 text-sm", CHIP_TONE[panel.key])}>
            {pt}
          </li>
        ))}
      </ul>
      <TransitionLink
        href={panel.link.href}
        className={cn(
          "mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline",
          panel.key === "makchic" ? "font-pop text-mc-red-ink" : "text-tb-teal",
        )}
      >
        {panel.link.label} →
      </TransitionLink>
    </>
  );
}

/**
 * "Two brands, one kitchen". At >= 1024px with motion allowed, GSAP (lazy-loaded) pins
 * the section for one screen of scroll and steps through four chapters. Everywhere else,
 * and until GSAP has loaded, the chapters render as a fully visible two-column card grid.
 */
export function StoryPinned() {
  const sectionRef = useRef<HTMLElement>(null);
  const gsapMods = usePinnable();
  const enhanced = gsapMods !== null;

  useEffect(() => {
    if (!gsapMods || !sectionRef.current) return;
    const { gsap } = gsapMods;
    const root = sectionRef.current;
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      const visuals = gsap.utils.toArray<HTMLElement>("[data-visual]");
      const layers = gsap.utils.toArray<HTMLElement>("[data-layer]");
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");

      gsap.set(panels.slice(1), { autoAlpha: 0, y: 24 });
      gsap.set(visuals.slice(1), { autoAlpha: 0, scale: 0.9, rotate: -6 });
      gsap.set(layers, { autoAlpha: 0 });
      gsap.set(chapters.slice(1), { opacity: 0.35 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 1 },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=100%", // one screen of scroll for all four chapters, no long pin-spacer
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 1; i < panels.length; i++) {
        const at = i - 1 + 0.3;
        // Short overlap: the next chapter starts arriving while the last one leaves, so the frame is never blank.
        tl.to(panels[i - 1], { autoAlpha: 0, y: -24, duration: 0.35 }, at)
          .to(panels[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.25)
          .to(visuals[i - 1], { autoAlpha: 0, scale: 0.92, rotate: 6, duration: 0.4 }, at)
          .to(visuals[i], { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.45 }, at + 0.15);
        tl.to(chapters[i - 1], { opacity: 0.35, duration: 0.3 }, at).to(chapters[i], { opacity: 1, duration: 0.3 }, at + 0.25);
        if (layers[i - 1]) tl.to(layers[i - 1], { autoAlpha: 1 }, at);
        if (layers[i - 2]) tl.to(layers[i - 2], { autoAlpha: 0 }, at);
      }
      tl.fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: panels.length - 0.7 }, 0);
    }, root);

    return () => ctx.revert();
  }, [gsapMods]);

  const rendang = getProduct("rendang-daging")!;
  const kicap = getProduct("ayam-masak-kicap")!;
  const sambal = getProduct("pes-sambal-tumis")!;
  const rempeyek = getProduct("rempeyek")!;
  const tempe = getProduct("tempe-chips-cheesy-spicy")!;
  const ubi = getProduct("kerepek-ubi-cheese")!;

  const pack = (p: typeof rendang, cls: string) => (
    <ProductImage
      key={p.slug}
      src={p.image.src}
      alt=""
      width={300}
      height={380}
      sizes="(min-width: 1024px) 14vw, 25vw"
      className={cn("h-auto drop-shadow-xl", cls)}
    />
  );

  // Each visual fills its square frame: a full-size backdrop disc with three packs across it.
  const visuals = [
    <div key="kitchen" className="relative grid h-full w-full place-items-center">
      <div className="relative aspect-square w-[94%] rounded-full bg-gradient-to-r from-tb-teal from-50% to-mc-red to-50% shadow-lift">
        <BatikFlower className="absolute inset-[10%] text-tb-gold opacity-40" />
      </div>
      <div className="absolute inset-x-[6%] flex items-center justify-between">
        {pack(rendang, "w-[40%] -rotate-6")}
        {pack(tempe, "w-[40%] rotate-6")}
      </div>
    </div>,
    <div key="tokbah" className="relative grid h-full w-full place-items-center">
      <div className="absolute aspect-square w-[98%] rounded-full border border-tb-gold/60" />
      <div className="bg-batik-dots absolute aspect-square w-[90%] rounded-full bg-tb-ivory shadow-card" />
      <Steam className="absolute top-[6%] w-[18%] text-tb-teal/40" />
      <div className="relative flex w-[96%] items-end justify-center gap-[1%] pt-[8%]">
        {pack(kicap, "w-[33%] -rotate-6 translate-y-[4%]")}
        {pack(rendang, "z-10 w-[40%]")}
        {pack(sambal, "w-[33%] rotate-6 translate-y-[4%]")}
      </div>
    </div>,
    <div key="makchic" className="relative grid h-full w-full place-items-center">
      <div className="bg-halftone absolute aspect-square w-[94%] rounded-full border-[3px] border-mc-cocoa bg-mc-cheese" />
      <div className="relative flex w-[96%] items-end justify-center gap-[1%]">
        {pack(rempeyek, "w-[33%] -rotate-8 translate-y-[4%]")}
        {pack(tempe, "z-10 w-[40%]")}
        {pack(ubi, "w-[33%] rotate-8 translate-y-[4%]")}
      </div>
      <div className="absolute top-[3%] right-[3%] w-[22%]">
        <StickerBadge className="w-full text-sm" center={"RANGUP\nSEDAP"} />
      </div>
    </div>,
    <div key="together" className="relative flex h-full w-full flex-col items-center justify-center gap-[4%]">
      <div className="flex w-[90%] items-end justify-center gap-[2%]">
        {[sambal, rendang, tempe, rempeyek].map((p, i) => pack(p, cn("w-1/4", i % 2 ? "-rotate-3" : "rotate-3")))}
      </div>
      <dl className="grid w-[94%] grid-cols-3 gap-2 text-center sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse rounded-card border border-line bg-bg/90 p-2 sm:p-3 lg:p-5">
            <dt className="mt-1 text-[0.65rem] leading-tight text-muted sm:text-xs">{s.label}</dt>
            <dd className="font-serif text-4xl text-tb-teal lg:text-6xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </div>,
  ];

  const cardTone: Record<(typeof PANELS)[number]["key"], string> = {
    kitchen: "bg-ivory",
    tokbah: "bg-tb-aqua",
    makchic: "bg-mc-cream",
    together: "bg-gradient-to-br from-tb-aqua to-mc-cream",
  };

  if (!enhanced) {
    return (
      <section ref={sectionRef} aria-labelledby="story-title" className="section-y relative z-10 bg-[#F2EDE3]">
        <div className="container-page">
          <h2 id="story-title" className="sr-only">
            Two brands, one kitchen
          </h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:gap-6">
            {PANELS.map((panel, i) => (
              <Reveal as="li" key={panel.key} delay={(i % 2) * 0.08} className={cn("overflow-hidden rounded-card", cardTone[panel.key])}>
                <div aria-hidden="true" className="relative aspect-[16/10] overflow-hidden">
                  <div className="mx-auto aspect-square h-full">{visuals[i]}</div>
                </div>
                <div className="p-5 md:p-6">
                  <p className="eyebrow mb-2">{panel.eyebrow}</p>
                  <h3
                    className={cn(
                      "text-3xl leading-[0.95] whitespace-pre-line md:text-4xl",
                      panel.key === "makchic" ? "font-script text-mc-red-ink" : "font-serif text-ink",
                    )}
                  >
                    {panel.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted">{panel.body}</p>
                  <PanelExtras panel={panel} />
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  // Pinned frame: exactly one viewport tall while pinned (this is the pin, not a spacer).
  // Copy column and visual column split the width; the visual fills its column height.
  return (
    <section ref={sectionRef} aria-labelledby="story-title" className="relative z-10 h-[100svh] overflow-hidden bg-[#F2EDE3]">
      {/* Colour wash layers crossfade between chapters (opacity only). */}
      <div aria-hidden="true" className="absolute inset-0">
        <div data-layer className="absolute inset-0 bg-tb-aqua opacity-0" />
        <div data-layer className="absolute inset-0 bg-mc-cream opacity-0" />
        <div data-layer className="absolute inset-0 bg-gradient-to-r from-tb-aqua to-mc-cream opacity-0" />
      </div>

      <div className="container-page relative grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-10 pt-[calc(var(--header-h)+1rem)] pb-8 xl:gap-16">
        <div>
          <h2 id="story-title" className="sr-only">
            Two brands, one kitchen
          </h2>

          {/* Chapter rail: where you are in the story. */}
          <ol aria-hidden="true" className="mb-8 grid grid-cols-4 gap-2 xl:mb-10">
            {PANELS.map((panel, i) => (
              <li key={panel.key} data-chapter className="border-t-2 border-charcoal pt-2"
                style={i > 0 ? { opacity: 0.35 } : undefined}>
                <span className="block font-serif text-lg text-tb-gold-ink italic">{String(i + 1).padStart(2, "0")}</span>
                <span className="block truncate text-xs font-semibold tracking-[0.12em] text-muted uppercase">{panel.eyebrow.replace(" Keropok", "")}</span>
              </li>
            ))}
          </ol>

          {/* All chapters share one grid cell, so the block is as tall as the longest chapter. */}
          <div className="grid">
            {PANELS.map((panel, i) => (
              <div key={panel.key} data-panel className="[grid-area:1/1]" style={i > 0 ? { visibility: "hidden" } : undefined}>
                <p className="eyebrow mb-3">{panel.eyebrow}</p>
                <p
                  className={cn(
                    "text-[clamp(3rem,5.2vw,6rem)] leading-[0.95] whitespace-pre-line text-ink",
                    panel.key === "makchic" ? "font-script text-mc-red-ink" : "font-serif",
                  )}
                >
                  {panel.title}
                </p>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted xl:text-xl">{panel.body}</p>
                <PanelExtras panel={panel} />
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="relative ml-auto aspect-square h-[min(78svh,100%)] max-h-full max-w-full">
          {visuals.map((v, i) => (
            <div key={i} data-visual className="absolute inset-0" style={i > 0 ? { visibility: "hidden" } : undefined}>
              {v}
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-line">
        <div data-progress className="h-full origin-left scale-x-0 bg-gradient-to-r from-tb-teal via-tb-gold to-mc-red" />
      </div>
    </section>
  );
}
