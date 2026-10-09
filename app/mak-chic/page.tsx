import { getProductsByBrand } from "@/data/products";
import { pageMetadata } from "@/lib/seo";
import { MakChicHero } from "@/components/sections/makchic/MakChicHero";
import { FlavourPicker } from "@/components/sections/makchic/FlavourPicker";
import { CrunchZone } from "@/components/sections/makchic/CrunchZone";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { CrossBrandCta } from "@/components/sections/CrossBrandCta";
import { Marquee } from "@/components/motion/Marquee";
import { StickerBadge } from "@/components/illustrations/Snacks";

export const metadata = pageMetadata({
  title: "Mak 'Chic' Keropok: Crispy Malay Crackers",
  description:
    "Rempeyek, Cheesy Spicy Tempe Chips, Tiub Cheese, Kerepek Ubi Cheese and Ratcha Thai Cheese Fish Skin. Rangup, sedap keropok delivered in Singapore.",
  path: "/mak-chic",
});

export default function MakChicPage() {
  const products = getProductsByBrand("mak-chic");
  return (
    <div data-brand="makchic" className="bg-bg font-pop text-ink">
      <MakChicHero />

      <div aria-hidden="true" className="overflow-hidden py-4">
        <div className="-mx-[4%] -rotate-2 border-y-[3px] border-mc-cocoa bg-mc-cheese py-4">
        <Marquee speed={4} boost={6}>
          {["RANGUP", "SEDAP", "CRISPY", "DELICIOUS", "CHEESY", "PEDAS"].map((w) => (
            <span key={w} className="flex items-center gap-8 px-6 text-3xl font-extrabold text-mc-cocoa md:text-4xl">
              {w}
              <span className="font-script text-mc-red-ink">✺</span>
            </span>
          ))}
        </Marquee>
        </div>
      </div>

      <section id="mc-products" aria-labelledby="mc-products-title" className="relative scroll-mt-20 section-y">
        <div className="container-page">
          <div className="mb-8 md:mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-xs font-extrabold tracking-[0.25em] text-mc-red-ink uppercase">The whole gang</p>
              <h2 id="mc-products-title" className="text-[clamp(2.75rem,6vw,5rem)] leading-none text-mc-cocoa">
                Five ways to crunch
              </h2>
            </div>
            <StickerBadge className="w-28 shrink-0 text-sm md:w-32" center={"5\nFLAVOURS"} text="MAK 'CHIC' · KEROPOK · RANGUP · SEDAP · " />
          </div>
          <ProductGrid
            products={products}
            tilted
            fillerTitle="Make it a meal"
            fillerBody="Keropok tastes even better next to Tok Bah rendang and rice. Mix both brands in one order."
            showcase={getProductsByBrand("tok-bah")}
          />
        </div>
      </section>

      <FlavourPicker products={products} />
      <CrunchZone />
      <CrossBrandCta to="tok-bah" />
    </div>
  );
}
