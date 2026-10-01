"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { t } from "@/lib/i18n/dictionaries";

/**
 * Draggable carousel built on native horizontal scrolling (touch, trackpad and keyboard
 * focus all just work) with mouse drag-to-scroll and arrow buttons layered on top.
 */
export function FeaturedCarousel({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : 320;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
  };

  const onPointerDown = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || !trackRef.current) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    if (!drag.current || !trackRef.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5 && !drag.current.moved) {
      drag.current.moved = true;
      setDragging(true);
      trackRef.current.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) trackRef.current.scrollLeft = drag.current.left - dx;
  };
  const endDrag = () => {
    drag.current = null;
    // Keep `dragging` for one tick so the click that ends a drag doesn't open a card.
    window.setTimeout(() => setDragging(false), 0);
  };

  return (
    <section aria-labelledby="featured-title" className="relative z-10 overflow-hidden bg-mc-cream section-y">
      <div className="container-page mb-8 md:mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-4">Featured</p>
          <SplitText
            as="h2"
            text="Favourites from both kitchens"
            className="max-w-xl font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] text-charcoal"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous products"
            className="grid h-12 w-12 place-items-center rounded-full border border-charcoal/20 transition-transform hover:-translate-x-0.5"
          >
            <ArrowIcon className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next products"
            className="grid h-12 w-12 place-items-center rounded-full border border-charcoal/20 transition-transform hover:translate-x-0.5"
          >
            <ArrowIcon className="h-5 w-5" />
          </button>
          <ButtonLink href="/shop" variant="outline" className="ml-2 hidden sm:inline-flex">
            {t.common.shopAll}
          </ButtonLink>
        </div>
      </div>

      <ul
        ref={trackRef}
        aria-label="Featured products"
        data-lenis-prevent-wheel=""
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (dragging) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className={`flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 scroll-px-4 pt-2 pb-4 md:scroll-px-8 [scrollbar-width:none] md:px-8 xl:px-14 [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing snap-none select-none" : "cursor-grab"
        }`}
      >
        {products.map((product, i) => (
          <li key={product.slug} className="w-[62vw] shrink-0 snap-start sm:w-[280px] lg:w-[300px]">
            <ProductCard product={product} index={i} tilted={product.brand === "mak-chic"} sizes="(min-width: 640px) 300px, 62vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
