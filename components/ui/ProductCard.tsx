"use client";

import { useRef } from "react";
import type { Product } from "@/data/products";
import { brands } from "@/data/brands";
import { formatPrice } from "@/lib/format";
import { useUI } from "@/lib/ui-store";
import { t } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/motion/Tilt";
import { TransitionLink } from "@/components/motion/PageTransition";
import { ProductImage } from "./ProductImage";
import { SpiceMeter } from "./SpiceMeter";
import { AddToCartButton } from "./AddToCartButton";

type Props = {
  product: Product;
  className?: string;
  /** Mak 'Chic' cards sit at a playful angle. */
  tilted?: boolean;
  priority?: boolean;
  index?: number;
  /** Rendered width hint for next/image; defaults to the 2/3/4-column grid. */
  sizes?: string;
};

/**
 * Product card: 3D tilt on hover, image lifts, price slides up.
 * The theme comes from the card's own data-brand so it can sit on any page.
 */
export function ProductCard({
  product,
  className,
  tilted,
  priority,
  index = 0,
  sizes = "(min-width: 1536px) 20vw, (min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw",
}: Props) {
  const brand = brands[product.brand];
  const imageRef = useRef<HTMLDivElement>(null);
  const setCursor = useUI((s) => s.setCursorLabel);
  const isSnack = product.brand === "mak-chic";
  const angle = tilted ? (index % 2 === 0 ? -1.5 : 1.5) : 0;

  return (
    <article
      data-brand={brand.key}
      className={cn("group relative h-full", className)}
      style={{ rotate: `${angle}deg` }}
      onPointerEnter={() => setCursor(t.product.view)}
      onPointerLeave={() => setCursor(null)}
    >
      <Tilt max={isSnack ? 12 : 7} className="h-full">
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-card bg-surface text-ink shadow-card transition-shadow duration-500 group-hover:shadow-lift",
            isSnack && "border-[3px] border-mc-cocoa",
          )}
        >
          <div
            className={cn("relative aspect-[4/5] overflow-hidden", isSnack ? "bg-halftone" : "bg-batik-dots")}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[15%] bottom-[6%] h-[10%] rounded-[50%] opacity-30 blur-xl transition-transform duration-700 ease-brand group-hover:scale-75"
              style={{ backgroundColor: product.accent }}
            />
            {/* Whole image always visible: tall pack shots fill the 4:5 frame, round labels sit centred in it. */}
            <div
              ref={imageRef}
              // pointer-events-none: the image is lifted in 3D for the tilt, so it would sit above
              // the card link and swallow clicks. Clicks pass through to the link instead.
              className={cn(
                "pointer-events-none absolute transition-transform duration-700 ease-brand group-hover:-translate-y-2 group-hover:scale-[1.05] [transform:translateZ(40px)]",
                isSnack ? "inset-[7%]" : "inset-0",
              )}
            >
              <ProductImage
                src={product.image.src}
                alt={product.image.alt}
                fill
                priority={priority}
                sizes={sizes}
                className="object-contain object-center drop-shadow-[0_16px_20px_rgb(0_0_0/0.16)]"
              />
            </div>
            <span
              className={cn(
                "pointer-events-none absolute top-2.5 left-2.5 rounded-full px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.12em] uppercase sm:top-3 sm:left-3 sm:text-[0.7rem]",
                isSnack ? "bg-mc-cheese text-mc-cocoa" : "bg-bg/90 text-accent-ink",
              )}
            >
              {brand.shortName}
            </span>
            {/* Quick add: always visible, sits above the stretched card link. */}
            <div className="absolute right-2.5 bottom-2.5 z-10 sm:right-3 sm:bottom-3">
              <AddToCartButton product={product} sourceRef={imageRef} bouncy={isSnack} variant="icon" className="shadow-card" />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4 md:gap-1.5">
            <h3 className="text-lg leading-tight sm:text-xl lg:text-2xl">
              <TransitionLink
                href={`/products/${product.slug}`}
                className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-offset-[-3px] focus-visible:after:outline-[var(--brand-focus)] focus-visible:after:rounded-card"
              >
                {product.name}
              </TransitionLink>
            </h3>
            <p className="line-clamp-1 text-xs text-muted sm:text-sm">{product.nameEn}</p>
            <div className="mt-auto flex items-end justify-between gap-2 pt-2">
              <SpiceMeter level={product.spiceLevel} showLabel={false} />
              <span className="relative block h-6 overflow-hidden text-right">
                <span className="block text-sm font-semibold transition-transform sm:text-base duration-500 ease-brand group-hover:-translate-y-full">
                  {formatPrice(product.priceSGD)}
                </span>
                <span aria-hidden="true" className="absolute inset-0 translate-y-full text-sm font-semibold whitespace-nowrap text-accent-ink sm:text-base transition-transform duration-500 ease-brand group-hover:translate-y-0">
                  {t.product.view} →
                </span>
              </span>
            </div>
          </div>
        </div>
      </Tilt>
    </article>
  );
}
