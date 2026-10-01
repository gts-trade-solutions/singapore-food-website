"use client";

import { create } from "zustand";
import type { BrandKey } from "./config";

export interface Flyer {
  id: number;
  src: string;
  from: { x: number; y: number; width: number; height: number };
}

interface UIState {
  /** Brand previewed by hovering the home hero; overrides the route brand. */
  previewBrand: BrandKey | null;
  setPreviewBrand: (brand: BrandKey | null) => void;

  /** Page transition: colour of the wipe and the href we are heading to. */
  transition: { href: string; color: string } | null;
  startTransition: (href: string, color: string) => void;
  endTransition: () => void;

  /** Add-to-cart thumbnails flying to the cart icon. */
  flyers: Flyer[];
  launchFlyer: (src: string, from: Flyer["from"]) => void;
  landFlyer: (id: number) => void;

  /** Custom cursor label ("View", "Add"…); null = default dot. */
  cursorLabel: string | null;
  setCursorLabel: (label: string | null) => void;

  introDone: boolean;
  setIntroDone: () => void;
}

/** DOM id of the header cart button; flying thumbnails aim for it. */
export const CART_TARGET_ID = "cart-target";

let flyerId = 0;

export const useUI = create<UIState>()((set) => ({
  previewBrand: null,
  setPreviewBrand: (previewBrand) => set({ previewBrand }),

  transition: null,
  startTransition: (href, color) => set({ transition: { href, color } }),
  endTransition: () => set({ transition: null }),

  flyers: [],
  launchFlyer: (src, from) => set((s) => ({ flyers: [...s.flyers, { id: ++flyerId, src, from }] })),
  landFlyer: (id) => set((s) => ({ flyers: s.flyers.filter((f) => f.id !== id) })),

  cursorLabel: null,
  setCursorLabel: (cursorLabel) => set({ cursorLabel }),

  introDone: false,
  setIntroDone: () => set({ introDone: true }),
}));
