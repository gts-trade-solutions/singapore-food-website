import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { ProductImage } from "./ProductImage";

/**
 * Card picture for products with a dish photo: the served dish fills the (positioned) frame and the pack sits
 * in the bottom-left corner as a small pack shot, so the food and the box are both visible at a glance.
 * Renders nothing when the product has no `photo`.
 */
export function DishWithPack({
  product,
  sizes,
  priority,
  dimmed,
}: {
  product: Product;
  /** Rendered width hint for the dish photo. */
  sizes: string;
  priority?: boolean;
  /** Greyed out (coming soon). */
  dimmed?: boolean;
}) {
  if (!product.photo) return null;
  return (
    <>
      <ProductImage
        src={product.photo.src}
        alt={product.photo.alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", dimmed && "opacity-70 grayscale")}
      />
      <span className="pointer-events-none absolute bottom-[6%] left-[5%] block w-[25%] -rotate-3 overflow-hidden rounded-[3px] bg-white shadow-lift ring-2 ring-white">
        <ProductImage
          src={product.image.src}
          alt={`${product.name} pack`}
          width={880}
          height={1180}
          sizes="(min-width: 1024px) 7vw, 22vw"
          className={cn("block h-auto w-full", dimmed && "opacity-70 grayscale")}
        />
      </span>
    </>
  );
}
