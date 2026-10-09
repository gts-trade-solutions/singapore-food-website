import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "RJS Foods: Tok Bah heritage meals and Mak 'Chic' Keropok crackers";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Tok Bah · Mak 'Chic' Keropok",
    title: "Nusantara flavours, two ways.",
    subtitle: "Ready-to-eat meals & crunchy crackers for Singapore homes",
  });
}
