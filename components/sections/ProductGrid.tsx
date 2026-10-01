"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/PageTransition";
import { WhatsAppIcon } from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";

export type GridLayout = "standard" | "wide";

/** 2 cols mobile, 3 tablet, 4 desktop; "wide" adds 5 cols above 1536px (shop). */
export const gridClasses: Record<GridLayout, string> = {
  standard: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6",
  wide: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 2xl:grid-cols-5",
};

export const gridSizes: Record<GridLayout, string> = {
  standard: "(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw",
  wide: "(min-width: 1536px) 18vw, (min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw",
};

/** Live column count matching `gridClasses` (null until mounted). */
export function useGridColumns(layout: GridLayout): number | null {
  const [cols, setCols] = useState<number | null>(null);
  useEffect(() => {
    const qs = [
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(min-width: 1536px)"),
    ];
    const update = () => {
      let c = 2;
      if (qs[0].matches) c = 3;
      if (qs[1].matches) c = 4;
      if (qs[2].matches && layout === "wide") c = 5;
      setCols(c);
    };
    update();
    qs.forEach((q) => q.addEventListener("change", update));
    return () => qs.forEach((q) => q.removeEventListener("change", update));
  }, [layout]);
  return cols;
}

/** Columns needed to complete the last row (0 when the row is already full). */
export function fillerSpan(count: number, cols: number | null): number {
  if (!cols || count === 0) return 0;
  return (cols - (count % cols)) % cols;
}

/**
 * Closes an incomplete last row so no grid ends in a band of empty cells.
 * Spans exactly the leftover columns. When it is wide (2+ columns) it pictures a few
 * `showcase` products, so the tile is content (a cross-sell), not a blank block.
 */
export function GridFiller({
  span,
  title = "Can't decide?",
  body = "Tell us what you like and we'll put together a mix for you.",
  showcase = [],
  children,
  className,
}: {
  span: number;
  title?: string;
  body?: string;
  showcase?: Product[];
  children?: ReactNode;
  className?: string;
}) {
  if (span <= 0) return null;
  const wide = span > 1;
  const pictured = showcase.slice(0, span >= 3 ? 3 : 2);

  return (
    <li
      style={{ gridColumn: `span ${span} / span ${span}` }}
      className={cn(
        "relative grid overflow-hidden rounded-card bg-charcoal text-ivory",
        wide && pictured.length > 0 ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" : "",
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 120 120" className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 text-tb-gold opacity-15">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <path key={r} d="M60 60 C52 44 56 26 60 18 C64 26 68 44 60 60Z" transform={`rotate(${r} 60 60)`} fill="none" stroke="currentColor" />
        ))}
      </svg>

      <div className="relative flex flex-col justify-center gap-4 p-5 md:p-6 lg:p-8">
        <div>
          <p className="eyebrow !text-tb-gold-light">RJS Foods</p>
          <p className="mt-2 font-serif text-2xl leading-tight md:text-3xl">{title}</p>
          <p className="mt-2 max-w-sm text-sm text-ivory/80">{body}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {children ?? (
            <>
              <a
                href={whatsappUrl("Hi RJS Foods! Can you recommend a mix of products for me?")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1F7A4D] px-4 text-sm font-semibold text-white"
              >
                <WhatsAppIcon className="h-4 w-4" /> Ask us
              </a>
              <TransitionLink href="/shop" className="inline-flex min-h-11 items-center rounded-full border border-ivory/40 px-4 text-sm font-semibold">
                Shop all
              </TransitionLink>
            </>
          )}
        </div>
      </div>

      {wide && pictured.length > 0 && (
        <ul className="relative hidden grid-cols-3 items-end gap-2 bg-ivory/5 px-4 pt-6 md:grid" style={{ gridTemplateColumns: `repeat(${pictured.length}, minmax(0, 1fr))` }}>
          {pictured.map((p, i) => (
            <li key={p.slug} className={cn("relative", i % 2 === 1 ? "-translate-y-3" : "translate-y-2")}>
              <TransitionLink href={`/products/${p.slug}`} className="group/fill block">
                <ProductImage
                  src={p.image.src}
                  alt={p.image.alt}
                  width={300}
                  height={380}
                  sizes="(min-width: 1024px) 12vw, 20vw"
                  className="h-auto w-full drop-shadow-xl transition-transform duration-500 ease-brand group-hover/fill:-translate-y-2"
                />
                <span className="sr-only">{p.name}</span>
              </TransitionLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function ProductGrid({
  products,
  tilted,
  className,
  layout = "standard",
  filler = true,
  fillerTitle,
  fillerBody,
  showcase,
}: {
  products: Product[];
  tilted?: boolean;
  className?: string;
  layout?: GridLayout;
  /** Complete an unfinished last row with a call-to-action tile. */
  filler?: boolean;
  fillerTitle?: string;
  fillerBody?: string;
  /** Products pictured in the filler tile (e.g. the sibling brand, as a cross-sell). */
  showcase?: Product[];
}) {
  const cols = useGridColumns(layout);
  if (products.length === 0) return null;
  const span = filler ? fillerSpan(products.length, cols) : 0;

  return (
    <ul className={cn(gridClasses[layout], className)}>
      {products.map((product, i) => (
        <Reveal as="li" key={product.slug} delay={(i % 4) * 0.06}>
          <ProductCard product={product} index={i} tilted={tilted} priority={i < 2} sizes={gridSizes[layout]} />
        </Reveal>
      ))}
      <GridFiller span={span} title={fillerTitle} body={fillerBody} showcase={showcase} />
    </ul>
  );
}
