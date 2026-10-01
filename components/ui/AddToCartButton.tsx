"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type RefObject } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-store";
import { useUI } from "@/lib/ui-store";
import { t } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Props = {
  product: Product;
  quantity?: number;
  /** Element whose position the flying thumbnail starts from. */
  sourceRef?: RefObject<HTMLElement | null>;
  className?: string;
  size?: "md" | "lg";
  /** Squash-and-stretch press (Mak 'Chic'). */
  bouncy?: boolean;
  /** "icon" = compact round button for product cards (label stays available to screen readers). */
  variant?: "full" | "icon";
};

export function AddToCartButton({ product, quantity = 1, sourceRef, className, size = "md", bouncy, variant = "full" }: Props) {
  const icon = variant === "icon";
  const add = useCart((s) => s.add);
  const launchFlyer = useUI((s) => s.launchFlyer);
  const reduced = usePrefersReducedMotion();
  const [added, setAdded] = useState(false);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    add(product, quantity);
    if (!reduced) {
      const el = sourceRef?.current ?? e.currentTarget;
      const r = el.getBoundingClientRect();
      launchFlyer(product.image.src, { x: r.left, y: r.top, width: r.width, height: r.height });
    }
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={icon ? `${t.cart.add}: ${product.name}` : undefined}
      whileTap={
        reduced ? undefined : bouncy ? { scaleX: 1.12, scaleY: 0.86 } : { scale: 0.96 }
      }
      transition={bouncy ? { type: "spring", stiffness: 600, damping: 12 } : { duration: 0.15 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-button bg-brand font-semibold text-brand-ink",
        icon ? "h-11 w-11 rounded-full" : size === "lg" ? "min-h-13 px-8 text-base" : "min-h-11 px-5 text-sm",
        className,
      )}
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
          {added ? (
            <>
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                <path d="m4 10.5 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {!icon && t.cart.added}
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
              {!icon && t.cart.add}
            </>
          )}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">
        {added ? `${product.name} ${t.cart.added.toLowerCase()}` : ""}
      </span>
    </motion.button>
  );
}
