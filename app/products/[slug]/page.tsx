import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getRelatedProducts, products } from "@/data/products";
import { brands } from "@/data/brands";
import { siteConfig } from "@/lib/config";
import { jsonLdString, productJsonLd } from "@/lib/seo";
import { t } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { DrawLine } from "@/components/motion/DrawLine";
import { Accordion } from "@/components/ui/Accordion";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { ProductPurchase } from "@/components/sections/product/ProductPurchase";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const brand = brands[product.brand];
  const title = `${product.name} (${product.nameEn}) by ${brand.name}`;
  const path = `/products/${product.slug}`;
  return {
    title,
    description: `${product.tagline} ${product.description.split(". ")[0]}.`,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: product.tagline,
      url: path,
      type: "website",
      siteName: siteConfig.name,
      locale: "en_SG",
    },
    twitter: { card: "summary_large_image", title, description: product.tagline },
  };
}

function Tbc() {
  return <p className="italic">{t.product.tbc}</p>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const brand = brands[product.brand];
  const isSnack = product.brand === "mak-chic";
  const related = getRelatedProducts(product);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: brand.name, item: `${siteConfig.url}${brand.href}` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${siteConfig.url}/products/${product.slug}` },
    ],
  };

  return (
    <div data-brand={brand.key} className={cn("bg-bg text-ink", isSnack && "font-pop")}>
      <div className="container-page pt-[calc(var(--header-h)+1.5rem)] pb-12 md:pb-16 lg:pb-20">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <TransitionLink href="/" className="hover:text-ink hover:underline">
                Home
              </TransitionLink>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <TransitionLink href={brand.href} className="hover:text-ink hover:underline">
                {brand.name}
              </TransitionLink>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <ProductPurchase product={product} />

        <div className="mt-10 grid gap-8 md:mt-12 md:gap-10 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <h2 className={cn("text-4xl md:text-5xl", isSnack ? "text-mc-cocoa" : "text-tb-teal")}>{t.product.serving}</h2>
            {!isSnack && <DrawLine className="mt-4 !max-w-[12rem]" />}
            <ul className="mt-6 space-y-3">
              {product.servingSuggestions.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold",
                      isSnack ? "border-2 border-mc-cocoa bg-mc-cheese text-mc-cocoa" : "bg-tb-teal font-serif text-base text-tb-ivory italic",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="pt-1.5 text-lg">{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="sr-only">Product details</h2>
            <Accordion
              defaultOpen="ingredients"
              items={[
                {
                  id: "ingredients",
                  title: t.product.ingredients,
                  content: product.ingredients ? <p>{product.ingredients.join(", ")}.</p> : <Tbc />,
                },
                {
                  id: "allergens",
                  title: t.product.allergens,
                  content: product.allergens ? (
                    <p>
                      Contains: <strong className="text-ink">{product.allergens.join(", ")}</strong>.
                    </p>
                  ) : (
                    <Tbc />
                  ),
                },
                {
                  id: "shelf",
                  title: t.product.shelfLife,
                  content:
                    product.shelfLife || product.storage ? (
                      <div className="space-y-2">
                        {product.shelfLife && <p>{product.shelfLife}</p>}
                        {product.storage && <p>{product.storage}</p>}
                      </div>
                    ) : (
                      <Tbc />
                    ),
                },
                {
                  id: "delivery",
                  title: "Ordering & delivery",
                  content: (
                    <p>
                      Add to your basket and tap &ldquo;{t.cart.checkout}&rdquo;. We&apos;ll reply on WhatsApp to confirm your order,
                      total and delivery slot within Singapore.
                    </p>
                  ),
                },
              ]}
            />
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className={cn("section-y", isSnack ? "bg-mc-cheese/30" : "bg-tb-aqua/60")}>
          <div className="container-page">
            <h2 id="related-title" className={cn("mb-8 text-4xl md:mb-10 md:text-5xl", isSnack ? "text-mc-cocoa" : "text-tb-teal")}>
              {t.product.related}
            </h2>
            <ProductGrid products={related} tilted={isSnack} fillerTitle={isSnack ? "Make it a meal" : "Pair it with keropok"}
              fillerBody="Mix both brands in one WhatsApp order."
              showcase={products.filter((p) => p.brand !== product.brand)}
            />
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(productJsonLd(product)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbs) }} />
    </div>
  );
}
