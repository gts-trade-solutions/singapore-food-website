import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "Tok Bah: Tradition, Taste, Together";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Tok Bah · Citarasa Nusantara",
    title: "Tradition. Taste. Together.",
    subtitle: "Heritage ready meals & cooking pastes",
    tone: "tokbah",
  });
}
