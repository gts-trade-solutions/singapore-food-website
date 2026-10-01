# RJS Foods website

Marketing and ordering site for **RJS Foods** and its two brands, **Tok Bah** (heritage meals and cooking pastes) and **Mak 'Chic' Keropok** (snacks). Customers browse, fill a basket and send the order to RJS Foods on WhatsApp. There is no payment or backend in this MVP.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, GSAP + ScrollTrigger (lazy-loaded), Lenis and Zustand.

---

## Quick start

Requires Node.js 18.18+ (20+ recommended).

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build (also runs ESLint and type checks) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript only |

### Deploying to Vercel

Import the repo in Vercel, add the environment variables below, and deploy. No extra configuration is needed.

---

## Environment variables

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes | `6591234567` | Number that receives orders and enquiries. Digits only, with country code, no `+`. If empty, WhatsApp opens without a recipient. |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | `https://www.rjsfoods.sg` | Canonical URLs, sitemap, Open Graph and JSON-LD. |
| `NEXT_PUBLIC_SHOW_CERTIFICATIONS` | No | `true` | Shows certification badges (e.g. halal). **Off by default**; turn on only once certificates are confirmed. Badge details live in `lib/config.ts`. |
| `NEWSLETTER_WEBHOOK_URL` | No | `https://hooks.zapier.com/...` | Server-only. Newsletter sign-ups are POSTed here as `{ email, source }`. Without it, the form tells people sign-ups open soon and offers WhatsApp updates instead. |

`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.

---

## Adding or editing a product

All product data lives in **`data/products.ts`**.

1. Add the label photo to `public/products/`, ideally a transparent PNG or WebP of about 900–1200 px wide, named after the slug (e.g. `public/products/sambal-ikan-bilis.webp`).
2. Add an entry to the `products` array:

```ts
{
  slug: "sambal-ikan-bilis",          // URL: /products/sambal-ikan-bilis
  brand: "tok-bah",                   // "tok-bah" | "mak-chic"
  type: "paste",                      // "meal" | "paste" | "rice" | "snack"
  name: "Sambal Ikan Bilis",          // name as printed on the pack
  nameEn: "Anchovy Sambal",
  tagline: "One line for product cards.",
  description: "Two or three sentences for the product page.",
  servingSuggestions: ["…", "…", "…"],
  spiceLevel: 2,                      // 0 not spicy … 3 hot (used by the Shop filter)
  flavours: ["spicy", "savoury"],     // drives the Mak 'Chic' flavour picker
  image: { src: "/products/sambal-ikan-bilis.webp", alt: "Tok Bah Sambal Ikan Bilis jar" },
  accent: "#A8261B",                  // glow colour behind the product
  featured: true,                     // show in the home carousel
  priceSGD: 8.9,                      // null = "Price TBC"
  netWeight: "200 g",
  ingredients: ["Chilli", "Anchovies", "…"],
  allergens: ["Fish"],
  shelfLife: "12 months unopened",
  storage: "Refrigerate after opening and use within 2 weeks.",
},
```

That's all. The product page, shop filters, sitemap, Open Graph image and JSON-LD are generated from this data.

### Placeholders (`TODO`)

Unconfirmed facts are `null` in the data and marked `// TODO`. The site shows them politely ("Price TBC", "To be confirmed"), so it never displays made-up values. Before launch:

- **Products:** `priceSGD`, `netWeight`, `ingredients`, `allergens`, `shelfLife`, `storage` for all 10 products, and check `spiceLevel` and `flavours`.
- **Images:** `public/products/*.webp` are **placeholder pack illustrations**. Replace them with the real label artwork using the same file names.
- **Copy:** the testimonials in `data/content.ts` are placeholders, so use real, attributable reviews. Also confirm the Tok Bah name story (`components/sections/tokbah/HeritageStory.tsx`), the About page story, the kitchen process steps and the stats.
- **Business details:** `legalName`, `email`, `instagram` and `address` in `lib/config.ts`, plus the reply-time line on `/contact`.

Search the codebase for `TODO` to find all of them.

While prices are `null`, the basket still works: the WhatsApp message lists the items and asks the shop to confirm the total.

---

## How ordering works

1. Customers add items to the basket. It's stored in `localStorage` (Zustand `persist`) and survives reloads.
2. **Order via WhatsApp** opens `wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>` with a prefilled message listing items, quantities, line totals and the total in SGD (see `lib/whatsapp.ts`).
3. The contact form also composes a WhatsApp message (or an email). Nothing is stored on the site.

---

## Project structure

```
app/                     Routes (App Router), metadata, sitemap.ts, robots.ts, OG images, /api/newsletter
components/
  ui/                    Header, Footer, CartDrawer, ProductCard, Button, Accordion, QuantitySelector…
  sections/              Page sections, grouped by page (home/, tokbah/, makchic/, shop/, product/, about/, contact/)
  motion/                Motion primitives & site-wide effects (see below)
  illustrations/         SVG art: batik vines/flowers, steam, chilli/peanut/cheese/chip, sticker badge
data/                    products.ts (catalogue), brands.ts, content.ts (testimonials, values, timeline)
lib/                     config & flags, cart/UI stores, WhatsApp helpers, SEO/JSON-LD, i18n, GSAP/Lenis loaders
styles/tokens.css        Design tokens (raw palette + semantic tokens per brand)
public/products/         Product images
```

## Design system

Theming is driven by a `data-brand` attribute: `rjs` (shared), `tokbah` or `makchic`. Each value remaps the semantic CSS variables in `styles/tokens.css` (background, surface, ink, primary, accent, display font, radii, shadows, easing). Tailwind exposes them as utilities such as `bg-bg`, `bg-surface`, `text-ink`, `bg-brand`, `text-accent-ink`, `font-display`, `rounded-card` and `shadow-card`.

- Pages set `data-brand` on their root, so the server render is already themed.
- `components/motion/BrandTheme.tsx` keeps `<html data-brand>` in sync with the route, or with the side hovered in the home hero.
- Raw brand colours are also available directly, e.g. `bg-tb-teal`, `text-tb-gold-ink`, `bg-mc-red`, `text-mc-cocoa`.
- Small text on dark or saturated backgrounds uses AA-safe variants: `tb-gold-ink` on ivory, `tb-gold-light` on teal, and white on chilli red.

## Motion

| Primitive | Use |
| --- | --- |
| `<Reveal>` | Fade and lift into view. `immediate` = CSS-only version for above-the-fold content |
| `<SplitText>` | Masked word or line reveal; `immediate` = CSS-only hero version |
| `<ImageReveal>` | Clip-path wipe with inner zoom |
| `<Parallax>` | Scroll-linked drift |
| `<MagneticButton>` | Pointer-following wrapper (desktop only) |
| `<Marquee>` | Infinite strip that speeds up and reverses with scroll velocity, and pauses offscreen |
| `<Tilt>` | 3D hover tilt with glare (desktop only) |
| `<Counter>`, `<DrawLine>` | Count-up numbers and gold ornamental dividers |

Site-wide effects: the CSS-only intro loader (first desktop visit per session), the brand-coloured page wipe (`TransitionLink` + `AnimatePresence`), Lenis smooth scrolling, the custom cursor, the fly-to-cart thumbnail and the self-drawing batik vines.

GSAP is only used for the pinned "Two brands, one kitchen" story and the Tok Bah "paste to plate" sequence. It is loaded on demand (`lib/gsap.ts`), and only on screens wide enough for pinning.

**Reduced motion** is fully respected. Framer Motion runs with `reducedMotion="user"`, CSS animations collapse, Lenis, the cursor and the intro are disabled, and the GSAP sections render as static stacked layouts.

## i18n

UI strings live in `lib/i18n/dictionaries.ts` with complete `en` and `ms` dictionaries. Today everything reads `t` (English). To add a Malay toggle, store the locale (cookie or an `/[locale]` route segment) and call `getDictionary(locale)`. Product copy stays in `data/products.ts`.

## Performance & quality notes

- Lighthouse on a local production build: **desktop 97–99** for performance and **100** for accessibility, best practices and SEO on every page tested.
- **Mobile** (simulated) measured about 75–85 locally. Observed LCP on the same runs was about 0.4–1.3s. Localhost loads are so fast that JS runs before first paint, which inflates the simulated numbers. Re-measure with PageSpeed Insights once the site is deployed.
- Above-the-fold animation is pure CSS, so content paints without waiting for JavaScript. GSAP, the cart drawer, cursor and vines load after hydration, and animations use only `transform` and `opacity` (plus `clip-path` for image wipes).
- Use **raster** product photos (WebP/PNG). Complex SVGs used as `<img>` are expensive to lay out and paint on phones.
