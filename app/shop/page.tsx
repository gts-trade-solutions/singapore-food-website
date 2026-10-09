import { Suspense } from "react";
import { products } from "@/data/products";
import { pageMetadata } from "@/lib/seo";
import { SplitText } from "@/components/motion/SplitText";
import { ShopBrowser } from "@/components/sections/shop/ShopBrowser";
import { ProductGrid } from "@/components/sections/ProductGrid";

export const metadata = pageMetadata({
  title: "Shop All Products",
  description:
    "Shop Tok Bah heritage meals, cooking pastes and rice, plus Mak 'Chic' Keropok crackers. Filter by brand, type and spice level, then order via WhatsApp in Singapore.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <div data-brand="rjs" className="pb-12 md:pb-16 lg:pb-20">
      <header className="container-page grid gap-4 pt-[calc(var(--header-h)+1.5rem)] pb-6 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-10 md:pt-[calc(var(--header-h)+2rem)] md:pb-8">
        <div>
          <p className="eyebrow mb-3">Kedai · Shop</p>
          <SplitText
            as="h1"
            by="line"
            immediate
            text={"Everything from\nour kitchen"}
            className="font-serif text-[clamp(2.75rem,5.5vw,5rem)] leading-[0.95] text-charcoal"
          />
        </div>
        <p className="max-w-xl text-base text-muted md:text-lg">
          Ten products, two personalities. Add what you like to your basket and send the order to us on WhatsApp. We&apos;ll confirm
          delivery details with you directly.
        </p>
      </header>
      {/* useSearchParams needs a Suspense boundary; the fallback is the full, unfiltered grid. */}
      <Suspense
        fallback={
          <div className="container-page">
            <ProductGrid products={products} layout="wide" />
          </div>
        }
      >
        <ShopBrowser products={products} />
      </Suspense>
    </div>
  );
}
