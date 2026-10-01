"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { buildOrderMessage, cartTotals, whatsappUrl } from "@/lib/whatsapp";
import { getLenis } from "@/lib/lenis";
import { t } from "@/lib/i18n/dictionaries";
import { ProductImage } from "./ProductImage";
import { QuantitySelector } from "./QuantitySelector";
import { ButtonLink, WhatsAppIcon } from "./Button";

/** Slide-in basket. Checkout opens WhatsApp with a prefilled order message. */
export function CartDrawer() {
  const { lines, isOpen, close, setQuantity, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock background scroll, trap focus, close on Escape, restore focus on close.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      previous?.focus?.();
    };
  }, [isOpen, close]);

  if (!mounted) return null;
  const { pricedTotal, hasUnpriced, count } = cartTotals(lines);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            className="absolute inset-0 bg-charcoal/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bg text-ink shadow-lift outline-none"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="cart-title" className="text-3xl">
                {t.cart.title}
                {count > 0 && <span className="ml-2 align-middle font-sans text-sm text-muted">({count})</span>}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={t.cart.close}
                className="grid h-11 w-11 place-items-center rounded-full border border-line"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 4l12 12M16 4 4 16" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="font-display text-2xl">{t.cart.empty}</p>
                <ButtonLink href="/shop" onClick={close}>
                  {t.cart.emptyCta}
                </ButtonLink>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain px-6">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.slug}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4 py-5"
                      >
                        <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                          <ProductImage src={line.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <p className="font-semibold leading-snug">{line.name}</p>
                          <p className="text-xs text-muted">{line.brandName}</p>
                          <div className="mt-auto flex items-center justify-between gap-2">
                            <QuantitySelector
                              size="sm"
                              value={line.quantity}
                              min={0}
                              onChange={(q) => setQuantity(line.slug, q)}
                              label={`${t.cart.quantity}: ${line.name}`}
                            />
                            <span className="text-sm font-semibold">
                              {line.priceSGD == null ? formatPrice(null) : formatPrice(line.priceSGD * line.quantity)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(line.slug)}
                            className="self-start text-xs text-muted underline underline-offset-4 hover:text-ink"
                          >
                            {t.cart.remove}
                            <span className="sr-only"> {line.name}</span>
                          </button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="space-y-4 border-t border-line bg-surface px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted">{t.cart.subtotal}</span>
                    <span className="text-xl font-semibold">
                      {pricedTotal > 0 ? formatPrice(pricedTotal) : hasUnpriced ? "TBC" : formatPrice(0)}
                    </span>
                  </div>
                  {hasUnpriced && <p className="text-xs text-muted">{t.cart.totalTbc}</p>}
                  <a
                    href={whatsappUrl(buildOrderMessage(lines))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-13 w-full items-center justify-center gap-2 rounded-button bg-[#1F7A4D] px-6 font-semibold text-white transition-transform active:scale-[0.98]"
                  >
                    <WhatsAppIcon />
                    {t.cart.checkout}
                  </a>
                  <p className="text-center text-xs text-muted">{t.cart.note}</p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
