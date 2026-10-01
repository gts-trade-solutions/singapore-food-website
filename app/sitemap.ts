import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/tok-bah", priority: 0.9, freq: "weekly" },
    { path: "/mak-chic", priority: 0.9, freq: "weekly" },
    { path: "/shop", priority: 0.9, freq: "weekly" },
    { path: "/about", priority: 0.6, freq: "monthly" },
    { path: "/contact", priority: 0.6, freq: "monthly" },
  ];

  return [
    ...pages.map((p) => ({
      url: `${siteConfig.url}${p.path}`,
      lastModified: now,
      changeFrequency: p.freq,
      priority: p.priority,
    })),
    ...products.map((p) => ({
      url: `${siteConfig.url}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [`${siteConfig.url}${p.image.src}`],
    })),
  ];
}
