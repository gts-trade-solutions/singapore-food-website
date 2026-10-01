import { getProductsByBrand } from "@/data/products";
import { pageMetadata } from "@/lib/seo";
import { TokBahHero } from "@/components/sections/tokbah/TokBahHero";
import { HeritageStory } from "@/components/sections/tokbah/HeritageStory";
import { PasteToPlate } from "@/components/sections/tokbah/PasteToPlate";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { CrossBrandCta } from "@/components/sections/CrossBrandCta";
import { SplitText } from "@/components/motion/SplitText";
import { DrawLine } from "@/components/motion/DrawLine";
import { Marquee } from "@/components/motion/Marquee";

export const metadata = pageMetadata({
  title: "Tok Bah: Heritage Malay Meals & Cooking Pastes",
  description:
    "Tok Bah ready-to-eat Rendang Daging and Ayam Masak Kicap, Sambal Tumis and Rendang cooking pastes, and Basmathi rice. Citarasa Nusantara, delivered in Singapore.",
  path: "/tok-bah",
});

export default function TokBahPage() {
  const products = getProductsByBrand("tok-bah");
  return (
    <div data-brand="tokbah" className="bg-bg text-ink">
      <TokBahHero />

      <div className="border-y border-tb-gold/30 bg-tb-ivory py-5" aria-hidden="true">
        <Marquee speed={1.5}>
          {["Tradisi · Rasa · Bersama", "Citarasa Nusantara", "Tradition · Taste · Together", "Taste of the Archipelago"].map((t) => (
            <span key={t} className="flex items-center px-8 font-serif text-3xl text-tb-teal italic md:text-4xl">
              {t}
              <span className="ml-16 text-tb-gold">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <HeritageStory />

      <section id="tb-products" aria-labelledby="tb-products-title" className="scroll-mt-24 section-y">
        <div className="container-page">
          <div className="mx-auto mb-8 md:mb-10 max-w-2xl text-center">
            <p className="eyebrow mb-4">The range</p>
            <SplitText
              as="h2"
              id="tb-products-title"
              text="Meals, pastes & rice"
              className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-tb-teal"
            />
            <DrawLine className="mx-auto mt-6" />
          </div>
          <ProductGrid
            products={products}
            fillerTitle="Pair it with keropok"
            fillerBody="Rendang on the table, Mak 'Chic' on the side. Add a pack of crunch to your order."
            showcase={getProductsByBrand("mak-chic")}
          />
        </div>
      </section>

      <PasteToPlate />
      <CrossBrandCta to="mak-chic" />
    </div>
  );
}
