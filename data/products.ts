import type { BrandSlug } from "./brands";

/**
 * Product catalogue.
 *
 * Fields set to `null` are unconfirmed and marked `TODO`. The UI shows a polite
 * "to be confirmed" state for them, so the site never displays made-up facts.
 * Replace each `null` with the real value printed on the final label.
 *
 * Images live in /public/products. Drop the real label photo in with the same file
 * name (or change `image.src`). PNG/JPG/WebP are optimised automatically by next/image.
 */

export type ProductType = "meal" | "paste" | "rice" | "snack";
export type SpiceLevel = 0 | 1 | 2 | 3;
export type Flavour = "savoury" | "sweet" | "spicy" | "cheesy";

export interface Product {
  slug: string;
  brand: BrandSlug;
  type: ProductType;
  /** Name as printed on the pack (Malay). */
  name: string;
  /** English name. */
  nameEn: string;
  /** One-line hook used on cards. */
  tagline: string;
  description: string;
  servingSuggestions: string[];
  spiceLevel: SpiceLevel;
  flavours: Flavour[];
  image: { src: string; alt: string };
  /** Accent colour used for card glow, cursor and wipes. */
  accent: string;
  featured?: boolean;

  /** Price in SGD. `null` = not confirmed yet. */
  priceSGD: number | null;
  netWeight: string | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  shelfLife: string | null;
  storage: string | null;
  /** Stock status for the "In Stock" label. Omitted = in stock. Set to false to show "Out of stock". */
  inStock?: boolean;
}

export const productTypeLabels: Record<ProductType, string> = {
  meal: "Ready meals",
  paste: "Cooking pastes",
  rice: "Rice",
  snack: "Crackers",
};

export const spiceLabels: Record<SpiceLevel, string> = {
  0: "Not spicy",
  1: "Mild",
  2: "Medium",
  3: "Hot",
};

export const products: Product[] = [
  // ───────────────────────────── Tok Bah ─────────────────────────────
  {
    slug: "ayam-masak-kicap",
    brand: "tok-bah",
    type: "meal",
    name: "Ayam Masak Kicap",
    nameEn: "Chicken in Sweet Soy Sauce",
    tagline: "Tender chicken in a glossy, gently sweet soy gravy.",
    description:
      "A weeknight classic from every Malay kitchen. Chicken is simmered slowly in sweet soy sauce with onions and warm spices until the gravy turns rich and glossy. Heat it, spoon it over rice, and dinner tastes like someone cooked all afternoon.",
    servingSuggestions: [
      "Over warm basmathi rice with sliced cucumber",
      "Tucked into a soft roti or bread roll",
      "With fried egg and a little sambal on the side",
    ],
    spiceLevel: 1,
    flavours: ["sweet", "savoury"],
    image: { src: "/products/ayam-masak-kicap-label.webp", alt: "Tok Bah Ayam Masak Kicap (Chicken in Sweet Soy Sauce) pack front with a bowl of chicken in soy gravy" },
    accent: "#7A3E1D",
    featured: true,
    priceSGD: 7.90, // Sample price (SGD) — confirm before launch
    netWeight: "180g", // Sample weight — confirm against the final label
    ingredients: null, // TODO: full ingredient list from final label
    allergens: null, // TODO: e.g. ["Soy", "Wheat"]
    shelfLife: null, // TODO: e.g. "12 months unopened"
    storage: null, // TODO: storage instructions
  },
  {
    slug: "rendang-daging",
    brand: "tok-bah",
    type: "meal",
    name: "Rendang Daging",
    nameEn: "Beef Rendang",
    tagline: "Slow-cooked beef, dark, rich and deeply spiced.",
    description:
      "Our proudest pot. Beef is cooked low and slow with coconut, lemongrass, galangal and chilli until the sauce reduces and clings to every piece. Rendang is a dish of patience, and we have done the waiting for you.",
    servingSuggestions: [
      "With basmathi rice and a wedge of lime",
      "Alongside ketupat or lemang for Hari Raya",
      "Shredded into a toasted sandwich the next day",
    ],
    spiceLevel: 2,
    flavours: ["spicy", "savoury"],
    image: { src: "/products/rendang-daging-label.webp", alt: "Tok Bah Rendang Daging (Beef Rendang) pack front with a bowl of beef rendang" },
    accent: "#5A2414",
    featured: true,
    priceSGD: 9.90, // Sample price (SGD) — confirm before launch
    netWeight: "180g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO
    shelfLife: null, // TODO
    storage: null, // TODO
  },
  {
    slug: "pes-sambal-tumis",
    brand: "tok-bah",
    type: "paste",
    name: "Pes Sambal Tumis",
    nameEn: "Sambal Tumis Paste",
    tagline: "The base of a hundred dishes, already sautéed.",
    description:
      "Chilli, shallots and aromatics are sautéed patiently until the oil separates and the paste turns deep red. That is the hard part of sambal, done. Fry it with prawns, eggs, ikan bilis or vegetables for a proper sambal in minutes.",
    servingSuggestions: [
      "Sambal udang: fry with prawns and a squeeze of lime",
      "Nasi lemak: stir through fried ikan bilis and peanuts",
      "Sambal telur: toss with halved hard-boiled eggs",
    ],
    spiceLevel: 3,
    flavours: ["spicy", "savoury"],
    image: { src: "/products/pes-sambal-tumis-label.webp", alt: "Tok Bah Pes Sambal Tumis (Sambal Tumis Paste) pack front with a bowl of red sambal" },
    accent: "#A8261B",
    featured: true,
    priceSGD: 6.90, // Sample price (SGD) — confirm before launch
    netWeight: "250g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO
    shelfLife: null, // TODO
    storage: null, // TODO
  },
  {
    slug: "pes-rendang",
    brand: "tok-bah",
    type: "paste",
    name: "Pes Rendang",
    nameEn: "Rendang Paste",
    tagline: "Your own rendang, without the grinding.",
    description:
      "Every spice that rendang asks for, ground and cooked into one paste. Add your choice of beef, chicken or lamb with coconut milk, then let it simmer. Your kitchen will smell like a kenduri.",
    servingSuggestions: [
      "Rendang ayam: simmer with chicken and coconut milk",
      "Rendang daging: braise beef low and slow until dry",
      "Rub onto lamb shoulder before slow roasting",
    ],
    spiceLevel: 2,
    flavours: ["spicy", "savoury"],
    image: { src: "/products/pes-rendang-label.webp", alt: "Tok Bah Pes Rendang (Rendang Paste) pack front with a bowl of rendang paste" },
    accent: "#6B2E16",
    priceSGD: 7.50, // Sample price (SGD) — confirm before launch
    netWeight: "250g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO
    shelfLife: null, // TODO
    storage: null, // TODO
  },
  {
    slug: "nasi-putih-basmathi",
    brand: "tok-bah",
    type: "rice",
    name: "Nasi Putih Basmathi",
    nameEn: "Basmathi Rice",
    tagline: "Long, fluffy grains, ready when you are.",
    description:
      "Light, fragrant basmathi rice cooked so every grain stays separate. Made to sit next to our rendang and kicap, and just as good with anything else on your table.",
    servingSuggestions: [
      "With Tok Bah Rendang Daging or Ayam Masak Kicap",
      "As a quick base for nasi goreng",
      "With dhal, curry or grilled fish",
    ],
    spiceLevel: 0,
    flavours: ["savoury"],
    image: { src: "/products/nasi-putih-basmathi-label.webp", alt: "Tok Bah Nasi Putih Basmathi (Basmathi Rice) pack front with a bowl of white basmathi rice" },
    accent: "#B8893B",
    priceSGD: 3.90, // Sample price (SGD) — confirm before launch
    netWeight: "200g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO
    shelfLife: null, // TODO
    storage: null, // TODO
  },

  // ───────────────────────── Mak 'Chic' Keropok ─────────────────────────
  {
    slug: "rempeyek",
    brand: "mak-chic",
    type: "snack",
    name: "Rempeyek",
    nameEn: "Peanut Crackers",
    tagline: "Lacy, golden, packed with peanuts.",
    description:
      "Thin, crackly rempeyek studded with whole peanuts and fried until golden. It snaps loudly and tastes like kampung afternoons. Fair warning: one piece is never one piece.",
    servingSuggestions: [
      "Straight from the pack with teh tarik",
      "Crumbled over nasi lemak or pecal",
      "On the table at Hari Raya open house",
    ],
    spiceLevel: 0,
    flavours: ["savoury"],
    image: { src: "/products/rempeyek-label.webp", alt: "Mak 'Chic' Keropok Rempeyek round label: peanut crackers in a woven basket" },
    accent: "#C98A2B",
    featured: true,
    priceSGD: 5.90, // Sample price (SGD) — confirm before launch
    netWeight: "100g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO: likely includes peanuts
    shelfLife: null, // TODO
    storage: null, // TODO
  },
  {
    slug: "tempe-chips-cheesy-spicy",
    brand: "mak-chic",
    type: "snack",
    name: "Tempe Chips",
    nameEn: "Tempe Chips, Cheesy Spicy",
    tagline: "Crunchy tempe, cheese dust, chilli kick.",
    description:
      "Thin slices of tempe fried shatter-crisp, then tossed in cheese and chilli. Nutty, cheesy and a little bit fiery, all in one bite.",
    servingSuggestions: [
      "Movie-night bowl with friends",
      "Crushed over salad or fried rice for crunch",
      "With an ice-cold drink on a hot afternoon",
    ],
    spiceLevel: 2,
    flavours: ["cheesy", "spicy"],
    image: { src: "/products/tempe-chips-cheesy-spicy-label.webp", alt: "Mak 'Chic' Keropok Tempe Chips Cheesy Spicy round label: tempe chips with cheese and chilli" },
    accent: "#E0562B",
    featured: true,
    priceSGD: 6.50, // Sample price (SGD) — confirm before launch
    netWeight: "100g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO: likely includes soy and milk
    shelfLife: null, // TODO
    storage: null, // TODO
  },
  {
    slug: "tiub-cheese",
    brand: "mak-chic",
    type: "snack",
    name: "Tiub Cheese",
    nameEn: "Cheese Tubes",
    tagline: "Puffy, hollow, loaded with cheese.",
    description:
      "Light, airy tubes with a big cheese flavour. They crunch, then they melt. Kids love them. Adults pretend they are for the kids.",
    servingSuggestions: [
      "Lunchbox and school-bag snack",
      "Party bowls and birthday goodie bags",
      "Wear them on your fingers first (it is tradition)",
    ],
    spiceLevel: 0,
    flavours: ["cheesy"],
    image: { src: "/products/tiub-cheese-label.webp", alt: "Mak 'Chic' Keropok Tiub Cheese round label: cheese tubes in a woven basket" },
    accent: "#F5B325",
    priceSGD: 5.50, // Sample price (SGD) — confirm before launch
    netWeight: "100g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO
    shelfLife: null, // TODO
    storage: null, // TODO
  },
  {
    slug: "kerepek-ubi-cheese",
    brand: "mak-chic",
    type: "snack",
    name: "Kerepek Ubi Cheese",
    nameEn: "Cheese Cassava Chips",
    tagline: "Thick-cut cassava with a cheesy coat.",
    description:
      "Cassava sliced and fried until it crunches loud, then dusted generously with cheese. Heartier than a potato chip and far more satisfying.",
    servingSuggestions: [
      "Snack-table hero for gatherings",
      "Paired with a cold drink after work",
      "Packed for road trips across the Causeway",
    ],
    spiceLevel: 0,
    flavours: ["cheesy", "savoury"],
    image: { src: "/products/kerepek-ubi-cheese-label.webp", alt: "Mak 'Chic' Keropok Kerepek Ubi Cheese round label: cheesy cassava chips with cassava and cheese" },
    accent: "#E8A317",
    featured: true,
    priceSGD: 5.90, // Sample price (SGD) — confirm before launch
    netWeight: "100g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO
    shelfLife: null, // TODO
    storage: null, // TODO
  },
  {
    slug: "ratcha-thai-cheese-fish-skin",
    brand: "mak-chic",
    type: "snack",
    name: "Ratcha Thai Cheese Fish Skin",
    nameEn: "Thai-Style Cheese Fish Skin",
    tagline: "Crispy fish skin, Thai-style zing, cheese finish.",
    description:
      "Fish skin fried until it puffs and crackles, then seasoned with a tangy Thai-inspired blend and finished with cheese. Salty, zesty and dangerously moreish.",
    servingSuggestions: [
      "With a cold drink while watching the match",
      "Crumbled over congee or rice bowls",
      "On a snack board next to rempeyek",
    ],
    spiceLevel: 1,
    flavours: ["cheesy", "spicy", "savoury"],
    image: { src: "/products/ratcha-thai-cheese-fish-skin-label.webp", alt: "Mak 'Chic' Keropok Ratcha Thai Cheese Fish Skin round label: crispy fish skin with cheese and chilli" },
    accent: "#2E7D32",
    priceSGD: 8.90, // Sample price (SGD) — confirm before launch
    netWeight: "100g", // Sample weight — confirm against the final label
    ingredients: null, // TODO
    allergens: null, // TODO: likely includes fish and milk
    shelfLife: null, // TODO
    storage: null, // TODO
  },
];

export function isInStock(product: Product): boolean {
  return product.inStock !== false;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByBrand(brand: BrandSlug): Product[] {
  return products.filter((p) => p.brand === brand);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameBrand = products.filter((p) => p.brand === product.brand && p.slug !== product.slug);
  const sameType = sameBrand.filter((p) => p.type === product.type);
  const rest = sameBrand.filter((p) => p.type !== product.type);
  return [...sameType, ...rest].slice(0, limit);
}
