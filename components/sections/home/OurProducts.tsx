"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type RefObject } from "react";
import { brands, type BrandSlug } from "@/data/brands";
import { getProductsByBrand, isInStock, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useUI } from "@/lib/ui-store";
import { useCart } from "@/lib/cart-store";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { t } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { Tilt } from "@/components/motion/Tilt";
import { TransitionLink } from "@/components/motion/PageTransition";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";

const ROWS: { brand: BrandSlug; line: string }[] = [
  { brand: "tok-bah", line: "Authentic flavours, ready for your table" },
  { brand: "mak-chic", line: "Crispy snacks for every occasion" },
];

/** Typographic brand marks, drawn with each brand's own tokens (no new style). */
function BrandMark({ brand }: { brand: BrandSlug }) {
  if (brand === "tok-bah") {
    const corner = "absolute h-3 w-3 border-tb-gold";
    return (
      <span className="relative inline-flex flex-col items-start px-4 py-2">
        <span aria-hidden="true" className="absolute inset-0 border border-tb-gold/60" />
        <span aria-hidden="true" className={`${corner} -top-1 -left-1 border-t-2 border-l-2`} />
        <span aria-hidden="true" className={`${corner} -right-1 -bottom-1 border-r-2 border-b-2`} />
        <span className="font-serif text-2xl leading-none font-semibold tracking-[0.12em] text-tb-teal uppercase md:text-3xl">Tok Bah</span>
        <span className="mt-1 text-[0.6rem] font-semibold tracking-[0.3em] text-tb-gold-ink uppercase">Citarasa Nusantara</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-script text-3xl leading-none text-mc-red-ink md:text-4xl">Mak &apos;Chic&apos;</span>
      <span className="-rotate-3 rounded-full border-2 border-mc-cocoa bg-mc-cheese px-2.5 py-0.5 font-pop text-[0.65rem] font-extrabold tracking-[0.2em] text-mc-cocoa uppercase">
        Keropok
      </span>
    </span>
  );
}

/**
 * "Add to Cart" for this section. Same behaviour and look as the site's AddToCartButton
 * (existing cart store, fly-to-cart thumbnail, basket badge bounce, squash on Mak 'Chic'),
 * with the label this section asks for.
 */
function AddToCartControl({
  product,
  sourceRef,
  bouncy,
}: {
  product: Product;
  sourceRef: RefObject<HTMLElement | null>;
  bouncy: boolean;
}) {
  const add = useCart((s) => s.add);
  const launchFlyer = useUI((s) => s.launchFlyer);
  const reduced = usePrefersReducedMotion();
  const [added, setAdded] = useState(false);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    add(product, 1);
    if (!reduced) {
      const r = (sourceRef.current ?? e.currentTarget).getBoundingClientRect();
      launchFlyer(product.image.src, { x: r.left, y: r.top, width: r.width, height: r.height });
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduced ? undefined : bouncy ? { scaleX: 1.12, scaleY: 0.86 } : { scale: 0.96 }}
      transition={bouncy ? { type: "spring", stiffness: 600, damping: 12 } : { duration: 0.15 }}
      className="relative z-10 inline-flex min-h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-button bg-brand px-2 text-xs font-semibold whitespace-nowrap text-brand-ink sm:px-3 sm:text-sm"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={added ? "added" : "add"}
          className="inline-flex items-center gap-2"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {added ? <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M12 5v14M5 12h14" strokeLinecap="round" />}
          </svg>
          {added ? "Added" : "Add to Cart"}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {added ? `${product.name} added to cart` : ""}
      </span>
    </motion.button>
  );
}

/**
 * Shop card: same structure, tokens and hover behaviour as the site's ProductCard
 * (tilt, image lift, stretched link, fly-to-cart), plus weight, stock and a full
 * Add button as this section requires.
 */
function ShopCard({ product, index }: { product: Product; index: number }) {
  const brand = brands[product.brand];
  const isSnack = product.brand === "mak-chic";
  const inStock = isInStock(product);
  const imageRef = useRef<HTMLDivElement>(null);
  const setCursor = useUI((s) => s.setCursorLabel);

  return (
    <article
      data-brand={brand.key}
      className="group relative h-full"
      style={isSnack ? { rotate: `${index % 2 === 0 ? -1 : 1}deg` } : undefined}
      onPointerEnter={() => setCursor(t.product.view)}
      onPointerLeave={() => setCursor(null)}
    >
      <Tilt max={isSnack ? 10 : 6} className="h-full">
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-card bg-bg text-ink shadow-card transition-shadow duration-500 group-hover:shadow-lift",
            isSnack && "border-[3px] border-mc-cocoa",
          )}
        >
          {/* Fixed 4:5 frame so every card is the same height; image is contained, never cropped. */}
          <div
            className={cn(
              "relative aspect-[4/5] overflow-hidden",
              isSnack ? "bg-halftone bg-mc-cream" : "bg-batik-dots bg-tb-ivory",
            )}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[18%] bottom-[6%] h-[10%] rounded-[50%] opacity-30 blur-xl"
              style={{ backgroundColor: product.accent }}
            />
            <div
              ref={imageRef}
              // pointer-events-none: the lifted (3D) image would otherwise swallow clicks meant for the card link.
              className="pointer-events-none absolute inset-[6%] transition-transform duration-700 ease-brand group-hover:-translate-y-2 group-hover:scale-[1.04] [transform:translateZ(30px)]"
            >
              <ProductImage
                src={product.image.src}
                alt={product.image.alt}
                fill
                sizes="(min-width: 1536px) 15vw, (min-width: 1024px) 18vw, (min-width: 768px) 30vw, 46vw"
                className="object-contain object-center drop-shadow-[0_14px_18px_rgb(0_0_0/0.16)]"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
            <h4 className="line-clamp-2 min-h-[2.4em] font-display text-lg leading-tight lg:text-xl">
              <TransitionLink
                href={`/products/${product.slug}`}
                className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-card focus-visible:after:outline-3 focus-visible:after:outline-offset-[-3px] focus-visible:after:outline-[var(--brand-focus)]"
              >
                {product.name}
              </TransitionLink>
            </h4>
            <p className="line-clamp-1 text-xs text-muted">{product.nameEn}</p>

            <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
              <span className="text-muted">{product.netWeight ?? "TBC"}</span>
              {inStock ? (
                <span className="inline-flex items-center gap-1 font-semibold text-[#1F7A4D]">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#1F7A4D]" />
                  In Stock
                </span>
              ) : (
                <span className="font-semibold text-muted">Out of stock</span>
              )}
            </div>

            <p className="mt-auto pt-1 text-lg font-semibold">{formatPrice(product.priceSGD)}</p>

            {inStock ? (
              <AddToCartControl product={product} sourceRef={imageRef} bouncy={isSnack} />
            ) : (
              <button
                type="button"
                disabled
                className="relative z-10 min-h-11 w-full rounded-button border border-line text-sm font-semibold text-muted"
              >
                Out of stock
              </button>
            )}
          </div>
        </div>
      </Tilt>
    </article>
  );
}

/**
 * "Our Products": all ten products, one row per brand, directly under the hero.
 * 2 columns on mobile, 3 on tablet, 5 on desktop. No carousel, nothing hidden.
 */
export function OurProducts() {
  return (
    <section aria-labelledby="products-title" className="section-y relative z-10 bg-ivory">
      <div className="container-page">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
          <div>
            <p className="eyebrow mb-2">Kedai · Shop</p>
            <SplitText
              as="h2"
              id="products-title"
              text="Our Products"
              className="font-serif text-[clamp(2.25rem,4.5vw,4rem)] leading-none text-charcoal"
            />
          </div>
          <ButtonLink href="/shop" variant="outline" className="self-start sm:self-auto">
            View All Products <ArrowIcon />
          </ButtonLink>
        </div>

        <div className="space-y-6 md:space-y-8">
          {ROWS.map(({ brand, line }) => {
            const items = getProductsByBrand(brand);
            if (items.length === 0) return null;
            const isSnack = brand === "mak-chic";
            return (
              <section
                key={brand}
                data-brand={brands[brand].key}
                aria-labelledby={`row-${brand}`}
                className={cn(
                  "rounded-card p-4 md:p-6",
                  isSnack ? "bg-halftone bg-mc-cheese/25" : "bg-batik-dots bg-tb-aqua/60",
                )}
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:mb-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <h3 id={`row-${brand}`}>
                      <span className="sr-only">{brands[brand].name}</span>
                      <span aria-hidden="true">
                        <BrandMark brand={brand} />
                      </span>
                    </h3>
                    <p className={cn("text-sm text-muted md:text-base", isSnack && "font-pop")}>{line}</p>
                  </div>
                  <TransitionLink
                    href={brands[brand].href}
                    className={cn(
                      "inline-flex min-h-11 items-center text-sm font-semibold underline-offset-4 hover:underline",
                      isSnack ? "font-pop text-mc-red-ink" : "text-tb-teal",
                    )}
                  >
                    Explore {brands[brand].shortName} →
                  </TransitionLink>
                </div>

                <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-5">
                  {items.map((product, i) => (
                    <Reveal as="li" key={product.slug} delay={(i % 5) * 0.06}>
                      <ShopCard product={product} index={i} />
                    </Reveal>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
