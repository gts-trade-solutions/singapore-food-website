"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct, type Product } from "@/data/products";
import { brands } from "@/data/brands";

export interface CartLine {
  slug: string;
  name: string;
  brandName: string;
  image: string;
  priceSGD: number | null;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  /** Increments on every add so the cart icon can bounce. */
  bumpKey: number;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const MAX_QTY = 99;

/**
 * Saved baskets can outlive catalogue changes (new images, prices, names).
 * On load, refresh every line from the current catalogue and drop products
 * that no longer exist, so the drawer and WhatsApp order never show stale data.
 */
function refreshLines(lines: CartLine[]): CartLine[] {
  return lines.flatMap((line) => {
    const product = getProduct(line.slug);
    if (!product) return [];
    return [
      {
        ...line,
        name: product.name,
        brandName: brands[product.brand].name,
        image: product.image.src,
        priceSGD: product.priceSGD,
      },
    ];
  });
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      bumpKey: 0,
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.slug === product.slug);
          const lines = existing
            ? state.lines.map((l) =>
                l.slug === product.slug
                  ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity), priceSGD: product.priceSGD }
                  : l,
              )
            : [
                ...state.lines,
                {
                  slug: product.slug,
                  name: product.name,
                  brandName: brands[product.brand].name,
                  image: product.image.src,
                  priceSGD: product.priceSGD,
                  quantity: Math.min(MAX_QTY, quantity),
                },
              ];
          return { lines, bumpKey: state.bumpKey + 1 };
        }),
      setQuantity: (slug, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.slug !== slug)
              : state.lines.map((l) => (l.slug === slug ? { ...l, quantity: Math.min(MAX_QTY, quantity) } : l)),
        })),
      remove: (slug) => set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
    }),
    {
      name: "rjs-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
      merge: (persisted, current) => {
        const saved = (persisted as Partial<CartState> | undefined)?.lines ?? [];
        return { ...current, lines: refreshLines(saved) };
      },
    },
  ),
);
