/**
 * Site-wide configuration and feature flags.
 * Values that change per environment come from NEXT_PUBLIC_* env variables (see .env.example).
 */

export const siteConfig = {
  name: "RJS Foods",
  legalName: "RJS Foods",
  /** Business registration (ACRA). */
  uen: "53530110C",
  incorporated: "2026-08-16",
  registeredActivity: "Wholesale of food, beverages and tobacco n.e.c. (including dried or canned)",
  // As registered with ACRA. Not shown publicly; the site displays `address` below.
  registeredLocation: "HDB Public Shelters, Singapore",
  description:
    "Home of Tok Bah ready-to-eat meals and Mak 'Chic' Keropok crackers. Nusantara flavours, made for Singapore homes.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rjsfoods.sg").replace(/\/$/, ""),
  locale: "en-SG",
  currency: "SGD",
  /** Business phone, as displayed. Also the WhatsApp number that receives orders. */
  phone: "+65 8011 4353",
  phoneHref: "tel:+6580114353",
  // Digits only, international format. NEXT_PUBLIC_WHATSAPP_NUMBER overrides it (e.g. for testing).
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6580114353").replace(/\D/g, ""),
  email: "hello@rjsfoods.sg", // TODO: real enquiries inbox
  instagram: "https://www.instagram.com/", // TODO: real Instagram profile URL
  // Optional social profiles: the footer shows an icon only for the ones filled in.
  facebook: "" as string, // TODO: Facebook page URL, if any
  x: "" as string, // TODO: X (Twitter) profile URL, if any
  linkedin: "" as string, // TODO: LinkedIn page URL, if any
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
