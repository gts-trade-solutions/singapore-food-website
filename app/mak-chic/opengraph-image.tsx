import { renderOgImage, ogSize } from "@/lib/og";

export const alt = "Mak 'Chic' Keropok: Rangup, Sedap";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({
    eyebrow: "Mak 'Chic' Keropok",
    title: "mmm...dapp!",
    subtitle: "Crispy, cheesy, chilli-loud crackers",
    tone: "makchic",
  });
}
