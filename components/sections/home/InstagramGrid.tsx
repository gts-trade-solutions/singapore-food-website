import { instagramPosts } from "@/data/content";
import { getProduct } from "@/data/products";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ProductImage } from "@/components/ui/ProductImage";
import { ExternalButton } from "@/components/ui/Button";

/** Instagram-style grid. TODO: swap tiles for real posts (or an Instagram feed integration). */
export function InstagramGrid() {
  return (
    <section aria-labelledby="ig-title" className="section-y relative z-10 bg-mc-cream">
      <div className="container-page">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:mb-10 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-3">@rjsfoods</p>
            <h2 id="ig-title" className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-none text-charcoal">
              From our table to yours
            </h2>
          </div>
          <ExternalButton href={siteConfig.instagram} variant="outline">
            Follow on Instagram
          </ExternalButton>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {instagramPosts.map((post, i) => {
            const product = getProduct(post.slug)!;
            const isSnack = product.brand === "mak-chic";
            return (
              <li key={post.id}>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block"
                  aria-label={`${post.caption} (opens Instagram)`}
                >
                  <ImageReveal direction={i % 2 ? "left" : "up"} delay={i * 0.06} className="rounded-2xl">
                    <div
                      className={cn(
                        "relative aspect-square",
                        isSnack ? "bg-halftone bg-mc-cheese" : "bg-batik-dots bg-tb-aqua",
                      )}
                    >
                      <ProductImage
                        src={product.image.src}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                        className="object-contain p-3 transition-transform duration-700 ease-brand group-hover:scale-110 group-hover:rotate-3"
                      />
                    </div>
                  </ImageReveal>
                  {/* Caption is always visible (no hover-only content). */}
                  <p className="mt-2 line-clamp-2 text-sm text-charcoal/80 group-hover:text-charcoal">{post.caption}</p>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
