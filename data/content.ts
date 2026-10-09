/** Editorial content shared across pages. Replace placeholder testimonials with real customer quotes. */

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
  brand: "tok-bah" | "mak-chic";
}

// TODO: replace with real, attributable customer reviews before launch.
export const testimonials: Testimonial[] = [
  {
    quote:
      "The rendang tastes like my grandmother's. I keep two packs in the cupboard for days when I'm too tired to cook.",
    name: "Customer name",
    detail: "Tampines",
    brand: "tok-bah",
  },
  {
    quote: "The tempe chips did not survive the drive home. Ordering three next time.",
    name: "Customer name",
    detail: "Woodlands",
    brand: "mak-chic",
  },
  {
    quote:
      "Sambal tumis paste is a game changer. Sambal udang on a Tuesday night, in ten minutes.",
    name: "Customer name",
    detail: "Bedok",
    brand: "tok-bah",
  },
  {
    quote: "Rempeyek at our Raya open house disappeared before the rendang did.",
    name: "Customer name",
    detail: "Jurong West",
    brand: "mak-chic",
  },
];

export const howItWorks = [
  {
    key: "heat",
    title: "Heat",
    body: "Warm the pouch in hot water or empty it into a pan. A few minutes is all it takes.",
  },
  {
    key: "serve",
    title: "Serve",
    body: "Spoon it over basmathi rice, or open a pack of keropok on the side.",
  },
  {
    key: "share",
    title: "Share",
    body: "Call everyone to the table. Nusantara food was always meant to be eaten together.",
  },
] as const;

export const values = [
  {
    title: "Cooked the long way",
    body: "Rempah is sautéed until the oil splits and rendang reduces until it clings. We don't take shortcuts on the steps that matter.",
  },
  {
    title: "Recipes with roots",
    body: "Every recipe starts in a family kitchen and is tested until it tastes right to the people who grew up eating it.",
  },
  {
    title: "Made to be shared",
    body: "Food that brings people to one table, whether it's a weekday dinner or a Hari Raya open house.",
  },
  {
    title: "Honest labels",
    body: "Clear ingredients and allergen information on every pack, so you know exactly what you are serving.",
  },
];

// TODO: adjust steps to match the real production process.
export const kitchenTimeline = [
  {
    step: "01",
    title: "Source",
    body: "Fresh chillies, shallots, lemongrass and galangal, chosen for flavour first.",
  },
  {
    step: "02",
    title: "Grind & tumis",
    body: "Rempah is ground, then sautéed slowly until fragrant and deep in colour.",
  },
  {
    step: "03",
    title: "Slow cook",
    body: "Meals simmer for hours so the sauce reduces and the flavours settle in.",
  },
  {
    step: "04",
    title: "Fry & season",
    body: "Crackers are fried in small batches and tossed in seasoning while still warm.",
  },
  {
    step: "05",
    title: "Pack & seal",
    body: "Sealed to lock in flavour, then labelled with full ingredient and allergen details.",
  },
];

// TODO: replace with real numbers or remove.
export const stats = [
  { value: 10, suffix: "", label: "Products across two brands" },
  { value: 2, suffix: "", label: "Brands under one kitchen" },
  { value: 5, suffix: "", label: "Steps from rempah to pack" },
];

export const instagramPosts = [
  { id: "1", slug: "rendang-daging", caption: "Sunday rendang, no grinding required." },
  { id: "2", slug: "tempe-chips-cheesy-spicy", caption: "Snack o'clock is any o'clock." },
  { id: "3", slug: "pes-sambal-tumis", caption: "Sambal udang in ten minutes." },
  { id: "4", slug: "rempeyek", caption: "Crunch heard across the room." },
  { id: "5", slug: "ayam-masak-kicap", caption: "Weeknight kicap, weekend flavour." },
  { id: "6", slug: "kerepek-ubi-cheese", caption: "Cassava, but make it cheesy." },
];
