import Image, { type ImageProps } from "next/image";
import { isVector } from "@/lib/utils";

type ProductImageProps = Omit<ImageProps, "src" | "sizes"> & {
  src: string;
  /** Required so the browser always picks the right file size. */
  sizes: string;
};

/**
 * next/image wrapper: SVG files are served as-is, photos are optimised.
 * Give `fill` images a parent with a set aspect ratio so nothing collapses.
 */
export function ProductImage({ src, alt, ...rest }: ProductImageProps) {
  return <Image src={src} alt={alt} unoptimized={isVector(src)} {...rest} />;
}
