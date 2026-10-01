import { getProduct, products } from "@/data/products";
import { brands } from "@/data/brands";
import { renderOgImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "RJS Foods product";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return renderOgImage({ eyebrow: "RJS Foods", title: "Nusantara flavours" });
  return renderOgImage({
    eyebrow: brands[product.brand].name,
    title: product.name,
    subtitle: product.tagline,
    tone: product.brand === "mak-chic" ? "makchic" : "tokbah",
  });
}
