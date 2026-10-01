import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Lobster, Poppins } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { introSkipScript } from "@/lib/intro";
import { jsonLdString, organizationJsonLd } from "@/lib/seo";
import { t } from "@/lib/i18n/dictionaries";
import { Providers } from "@/components/motion/Providers";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { BrandTheme } from "@/components/motion/BrandTheme";
import { IntroLoader } from "@/components/motion/IntroLoader";
import { PageTransitionOverlay } from "@/components/motion/PageTransition";
import { DeferredChrome } from "@/components/motion/DeferredChrome";
import { ScrollTriggerSync } from "@/components/motion/ScrollTriggerSync";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Brand-specific display fonts are not preloaded so they never compete with the CSS/LCP.
const lobster = Lobster({ subsets: ["latin"], weight: "400", variable: "--font-lobster", display: "swap", preload: false });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "RJS Foods | Tok Bah & Mak 'Chic' Keropok",
    template: "%s | RJS Foods",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Nusantara food Singapore",
    "Malay food Singapore",
    "beef rendang",
    "ayam masak kicap",
    "sambal tumis paste",
    "rendang paste",
    "keropok",
    "rempeyek",
    "Tok Bah",
    "Mak Chic Keropok",
  ],
  openGraph: {
    siteName: siteConfig.name,
    locale: "en_SG",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [{ color: "#FAF7F0" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-SG"
      data-brand="rjs"
      suppressHydrationWarning
      className={`${cormorant.variable} ${inter.variable} ${lobster.variable} ${poppins.variable}`}
    >
      <body className="min-h-dvh overflow-x-clip">
        <script dangerouslySetInnerHTML={{ __html: introSkipScript }} />
        <noscript>
          <style>{`.intro-loader{display:none}[data-reveal],[data-reveal] *{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only-focusable fixed top-3 left-3 z-[110] rounded-md bg-ink px-4 py-3 text-sm font-semibold text-bg"
        >
          {t.nav.skip}
        </a>
        <Providers>
          <SmoothScroll />
          <BrandTheme />
          <IntroLoader />
          <Header />
          <main id="main" className="relative">
            {children}
          </main>
          <Footer />
          <PageTransitionOverlay />
          <ScrollTriggerSync />
          <DeferredChrome />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
