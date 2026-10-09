import type { BrandKey } from "@/lib/config";

export type BrandSlug = "tok-bah" | "mak-chic";

export interface Brand {
  slug: BrandSlug;
  key: Exclude<BrandKey, "rjs">;
  name: string;
  shortName: string;
  /** Product category this brand covers (shown on product rows, filters and brand pages). */
  category: string;
  href: string;
  taglines: { ms: string; en: string }[];
  summary: string;
  /** Solid colour for page wipes, chips and cursor accents. */
  color: string;
  colorInk: string;
}

export const brands: Record<BrandSlug, Brand> = {
  "tok-bah": {
    slug: "tok-bah",
    key: "tokbah",
    name: "Tok Bah",
    shortName: "Tok Bah",
    category: "Ready-to-Eat Meals",
    href: "/tok-bah",
    taglines: [
      { ms: "Tradisi · Rasa · Bersama", en: "Tradition · Taste · Together" },
      { ms: "Citarasa Nusantara", en: "Taste of the Archipelago" },
    ],
    summary:
      "Heritage ready-to-eat meals and cooking pastes, cooked the slow way and packed for the way you live now.",
    color: "#0F3D3E",
    colorInk: "#FAF7F0",
  },
  "mak-chic": {
    slug: "mak-chic",
    key: "makchic",
    name: "Mak 'Chic' Keropok",
    shortName: "Mak 'Chic'",
    category: "Crackers",
    href: "/mak-chic",
    // First tagline is the brand line; "Rangup · Sedap" matches the round labels.
    taglines: [
      { ms: "mmm...dapp!", en: "mmm...dapp!" },
      { ms: "Rangup · Sedap", en: "Crispy · Delicious" },
    ],
    summary:
      "Loud, crunchy, impossible-to-share crackers. Kampung favourites with a cheeky twist. mmm...dapp!",
    color: "#D9372A",
    colorInk: "#FFFFFF",
  },
};

export const brandList = Object.values(brands);

export function brandKeyForSlug(slug: BrandSlug): Exclude<BrandKey, "rjs"> {
  return brands[slug].key;
}
