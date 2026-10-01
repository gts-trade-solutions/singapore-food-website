"use client";

import { useRef, useState } from "react";
import { productTypeLabels, spiceLabels, type Product } from "@/data/products";
import { brands } from "@/data/brands";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/whatsapp";
import { t } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { Tilt } from "@/components/motion/Tilt";
import { ProductImage } from "@/components/ui/ProductImage";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { AddToCartButton } from "@/components/ui/AddToCartButton";
import { SpiceMeter } from "@/components/ui/SpiceMeter";
import { WhatsAppIcon } from "@/components/ui/Button";
import { Steam } from "@/components/illustrations/Steam";
import { StickerBadge } from "@/components/illustrations/Snacks";

/** Top of the product page: big tilting image + buy box. */
export function ProductPurchase({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const imageRef = useRef<HTMLDivElement>(null);
  const brand = brands[product.brand];
  const isSnack = product.brand === "mak-chic";

  return (
    <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <Tilt max={isSnack ? 14 : 8} className="mx-auto w-full max-w-xl">
          <div
            className={cn(
              "relative aspect-square overflow-hidden rounded-card",
              isSnack ? "bg-halftone border-[3px] border-mc-cocoa bg-mc-cheese shadow-card" : "bg-batik-dots bg-tb-aqua",
            )}
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-[20%] bottom-[10%] h-[12%] rounded-[50%] opacity-40 blur-2xl"
              style={{ backgroundColor: product.accent }}
            />
            {!isSnack && product.type !== "paste" && <Steam className="absolute top-[4%] left-1/2 w-24 -translate-x-1/2 text-tb-teal/40" />}
            <div ref={imageRef} className="absolute inset-[10%] [transform:translateZ(60px)]">
              <ProductImage
                src={product.image.src}
                alt={product.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-contain drop-shadow-[0_30px_30px_rgb(0_0_0/0.25)]"
              />
            </div>
            {isSnack && <StickerBadge className="absolute top-4 right-4 w-24 text-xs md:w-28" center={"RANGUP\nSEDAP"} />}
          </div>
        </Tilt>
      </div>

      <div>
        <p className={cn("mb-3", isSnack ? "font-pop text-xs font-extrabold tracking-[0.2em] text-mc-red-ink uppercase" : "eyebrow")}>
          {brand.name}
        </p>
        <h1 className={cn("leading-[0.95]", isSnack ? "text-[clamp(2.75rem,5vw,4.5rem)] text-mc-cocoa" : "text-[clamp(2.75rem,5vw,5rem)] text-tb-teal")}>
          {product.name}
        </h1>
        <p className="mt-2 text-lg text-muted md:text-xl">{product.nameEn}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <p className="text-3xl font-semibold">{formatPrice(product.priceSGD)}</p>
          <span className="h-6 w-px bg-line" aria-hidden="true" />
          <div className="text-sm">
            <span className="sr-only">{t.product.spice}: </span>
            <SpiceMeter level={product.spiceLevel} />
          </div>
        </div>

        <p className="mt-5 max-w-xl text-base leading-relaxed md:text-lg">{product.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <QuantitySelector value={qty} onChange={setQty} />
          <AddToCartButton product={product} quantity={qty} sourceRef={imageRef} size="lg" bouncy={isSnack} className="flex-1 sm:flex-none" />
        </div>
        <a
          href={whatsappUrl(`Hi RJS Foods! I have a question about ${product.name} (${brand.name}).`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
        >
          <WhatsAppIcon className="h-4 w-4 text-[#1F7A4D]" />
          Questions? Ask us on WhatsApp
        </a>

        {/* Key facts at a glance; unconfirmed values read "TBC" (see data/products.ts). */}
        <dl className="mt-6 grid grid-cols-2 gap-3">
          {[
            { k: "Type", v: productTypeLabels[product.type].replace(/s$/, "") },
            { k: t.product.spice, v: spiceLabels[product.spiceLevel] },
            { k: t.product.netWeight, v: product.netWeight ?? "TBC" },
            { k: "Ordering", v: "Confirmed on WhatsApp" },
          ].map((f) => (
            <div key={f.k} className={cn("rounded-xl p-3 md:p-4", isSnack ? "border-2 border-mc-cocoa/20 bg-white/60" : "bg-tb-aqua/60")}>
              <dt className="text-xs tracking-[0.12em] text-muted uppercase">{f.k}</dt>
              <dd className="mt-1 font-semibold">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
