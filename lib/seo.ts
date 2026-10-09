import type { Metadata } from "next";
import { siteConfig } from "./config";
import type { Product } from "@/data/products";
import { brands } from "@/data/brands";

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: "en_SG",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: `${title} | ${siteConfig.name}`, description },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    identifier: { "@type": "PropertyValue", propertyID: "UEN", value: siteConfig.uen },
    foundingDate: siteConfig.incorporated,
    address: { "@type": "PostalAddress", addressCountry: "SG" },
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    email: siteConfig.email,
    areaServed: { "@type": "Country", name: "Singapore" },
    brand: Object.values(brands).map((b) => ({
      "@type": "Brand",
      name: b.name,
      url: `${siteConfig.url}${b.href}`,
    })),
    sameAs: [siteConfig.instagram],
  };
}

export function productJsonLd(product: Product) {
  const brand = brands[product.brand];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} (${product.nameEn})`,
    description: product.description,
    image: `${siteConfig.url}${product.image.src}`,
    sku: product.slug,
    url: `${siteConfig.url}/products/${product.slug}`,
    category: product.type,
    brand: { "@type": "Brand", name: brand.name },
    manufacturer: { "@type": "Organization", name: siteConfig.name },
    ...(product.netWeight ? { weight: product.netWeight } : {}),
    // Offers are only emitted once a real price exists.
    ...(product.priceSGD != null
      ? {
          offers: {
            "@type": "Offer",
            price: product.priceSGD.toFixed(2),
            priceCurrency: "SGD",
            availability: "https://schema.org/InStock",
            url: `${siteConfig.url}/products/${product.slug}`,
            areaServed: "SG",
          },
        }
      : {}),
  };
}

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
