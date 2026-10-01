import { siteConfig } from "./config";

const currency = new Intl.NumberFormat(siteConfig.locale, {
  style: "currency",
  currency: siteConfig.currency,
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: 2,
});

/** Formats as "S$12.90". Unpriced items (TODO in data) render as "Price TBC". */
export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "Price TBC";
  return `S${currency.format(value)}`.replace("SS$", "S$");
}
