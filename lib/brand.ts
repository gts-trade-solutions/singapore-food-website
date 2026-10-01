import type { BrandKey } from "./config";
import { brands } from "@/data/brands";
import { getProduct } from "@/data/products";

export const brandColors: Record<BrandKey, string> = {
  rjs: "#1E1C1A",
  tokbah: brands["tok-bah"].color,
  makchic: brands["mak-chic"].color,
};

/** Works out which theme a route belongs to. */
export function brandForPath(pathname: string): BrandKey {
  if (pathname.startsWith("/tok-bah")) return "tokbah";
  if (pathname.startsWith("/mak-chic")) return "makchic";
  const productMatch = pathname.match(/^\/products\/([^/]+)/);
  if (productMatch) {
    const product = getProduct(productMatch[1]);
    if (product) return brands[product.brand].key;
  }
  return "rjs";
}
