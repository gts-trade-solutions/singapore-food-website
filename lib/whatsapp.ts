import { siteConfig } from "./config";
import { formatPrice } from "./format";
import type { CartLine } from "./cart-store";

export function whatsappUrl(message: string): string {
  const text = encodeURIComponent(message);
  return siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;
}

export function cartTotals(lines: CartLine[]) {
  const pricedTotal = lines.reduce((sum, l) => sum + (l.priceSGD ?? 0) * l.quantity, 0);
  const hasUnpriced = lines.some((l) => l.priceSGD == null);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  return { pricedTotal, hasUnpriced, count };
}

export function buildOrderMessage(lines: CartLine[]): string {
  const { pricedTotal, hasUnpriced } = cartTotals(lines);
  const items = lines.map((l, i) => {
    const lineTotal = l.priceSGD == null ? "price TBC" : formatPrice(l.priceSGD * l.quantity);
    return `${i + 1}. ${l.name} (${l.brandName}) x ${l.quantity}: ${lineTotal}`;
  });

  const total = hasUnpriced
    ? pricedTotal > 0
      ? `Subtotal (priced items): ${formatPrice(pricedTotal)}. Please confirm the final total.`
      : "Please confirm the total."
    : `Total: ${formatPrice(pricedTotal)} (SGD)`;

  return [
    "Hi RJS Foods! I'd like to order:",
    "",
    ...items,
    "",
    total,
    "",
    "Name:",
    "Delivery address / postal code:",
    "Preferred delivery date:",
  ].join("\n");
}

export function enquiryMessage(topic: "general" | "wholesale" | "stockist" = "general"): string {
  const opening = {
    general: "Hi RJS Foods! I have a question.",
    wholesale: "Hi RJS Foods! I'm interested in wholesale pricing.",
    stockist: "Hi RJS Foods! I'd like to stock Tok Bah / Mak 'Chic' products.",
  }[topic];
  return opening;
}
