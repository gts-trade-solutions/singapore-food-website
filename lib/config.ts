/**
 * Site-wide configuration and feature flags.
 * Values that change per environment come from NEXT_PUBLIC_* env variables (see .env.example).
 */

export const siteConfig = {
  name: "RJS Foods",
  legalName: "RJS Foods", // TODO: registered company name (e.g. "RJS Foods Pte. Ltd.")
  description:
    "Home of Tok Bah heritage meals and pastes and Mak 'Chic' Keropok snacks. Nusantara flavours, made for Singapore homes.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rjsfoods.sg").replace(/\/$/, ""),
  locale: "en-SG",
  currency: "SGD",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
  email: "hello@rjsfoods.sg", // TODO: real enquiries inbox
  instagram: "https://www.instagram.com/", // TODO: real Instagram profile URL
  address: "Singapore", // TODO: business address for stockist/wholesale enquiries

  /**
   * Certification badges (halal etc.) stay hidden until the certificates are confirmed.
   * Turn on with NEXT_PUBLIC_SHOW_CERTIFICATIONS=true.
   */
  showCertifications: process.env.NEXT_PUBLIC_SHOW_CERTIFICATIONS === "true",
  certifications: [
    // TODO: confirm certifying body and certificate numbers before enabling.
    { id: "halal", label: "Halal", detail: "Certified halal" },
  ],
} as const;

export type BrandKey = "rjs" | "tokbah" | "makchic";
