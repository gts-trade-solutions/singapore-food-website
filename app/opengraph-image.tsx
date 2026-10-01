import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "RJS Foods: Tok Bah heritage meals and Mak 'Chic' Keropok snacks";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Tok Bah · Mak 'Chic' Keropok",
    title: "Nusantara flavours, two ways.",
    subtitle: "Heritage meals & crunchy snacks for Singapore homes",
  });
}
