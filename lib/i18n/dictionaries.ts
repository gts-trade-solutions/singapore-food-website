/**
 * UI strings. English ships today; Malay is ready for a language toggle.
 * To add the toggle later: store the locale in a cookie or an /[locale] segment and
 * pass it to getDictionary(). Product copy lives in data/products.ts.
 */

export const locales = ["en", "ms"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const en = {
  nav: {
    home: "Home",
    tokBah: "Tok Bah",
    makChic: "Mak 'Chic'",
    shop: "Shop",
    about: "About",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
  },
  cart: {
    title: "Your basket",
    open: "Open basket",
    close: "Close basket",
    empty: "Your basket is empty.",
    emptyCta: "Browse the shop",
    add: "Add to basket",
    added: "Added",
    remove: "Remove",
    subtotal: "Subtotal",
    totalTbc: "Some prices are still to be confirmed. We'll confirm your total on WhatsApp.",
    checkout: "Order via WhatsApp",
    note: "Orders are confirmed on WhatsApp. No payment is taken on this site.",
    quantity: "Quantity",
    increase: "Increase quantity",
    decrease: "Decrease quantity",
  },
  product: {
    serving: "Serving suggestions",
    ingredients: "Ingredients",
    allergens: "Allergens",
    shelfLife: "Shelf life & storage",
    netWeight: "Net weight",
    spice: "Spice level",
    tbc: "To be confirmed. Details will be added soon.",
    related: "You might also like",
    view: "View",
  },
  common: {
    shopAll: "Shop all products",
    learnMore: "Learn more",
    whatsapp: "Chat on WhatsApp",
  },
};

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> };
export type Dictionary = DeepString<typeof en>;

const ms: Dictionary = {
  nav: {
    home: "Utama",
    tokBah: "Tok Bah",
    makChic: "Mak 'Chic'",
    shop: "Kedai",
    about: "Tentang Kami",
    contact: "Hubungi",
    menu: "Menu",
    close: "Tutup",
    skip: "Langkau ke kandungan",
  },
  cart: {
    title: "Bakul anda",
    open: "Buka bakul",
    close: "Tutup bakul",
    empty: "Bakul anda kosong.",
    emptyCta: "Lihat kedai",
    add: "Masuk bakul",
    added: "Ditambah",
    remove: "Buang",
    subtotal: "Jumlah kecil",
    totalTbc: "Sesetengah harga belum disahkan. Kami akan sahkan jumlah anda di WhatsApp.",
    checkout: "Pesan melalui WhatsApp",
    note: "Pesanan disahkan melalui WhatsApp. Tiada bayaran diambil di laman ini.",
    quantity: "Kuantiti",
    increase: "Tambah kuantiti",
    decrease: "Kurangkan kuantiti",
  },
  product: {
    serving: "Cadangan hidangan",
    ingredients: "Ramuan",
    allergens: "Alergen",
    shelfLife: "Jangka hayat & penyimpanan",
    netWeight: "Berat bersih",
    spice: "Tahap pedas",
    tbc: "Belum disahkan. Butiran akan dikemas kini.",
    related: "Anda mungkin juga suka",
    view: "Lihat",
  },
  common: {
    shopAll: "Lihat semua produk",
    learnMore: "Ketahui lagi",
    whatsapp: "Sembang di WhatsApp",
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, ms };

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Current UI dictionary. Swap for a context/cookie lookup when the toggle ships. */
export const t = getDictionary(defaultLocale);
