import type { Metadata } from "next";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { Steam } from "@/components/illustrations/Steam";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section data-brand="rjs" className="grid min-h-[80svh] place-items-center px-4 pt-[var(--header-h)] text-center">
      <div>
        <div className="relative mx-auto mb-8 w-40">
          <Steam className="absolute -top-16 left-1/2 w-20 -translate-x-1/2 text-tb-gold" />
          <svg viewBox="0 0 120 60" className="w-full" aria-hidden="true">
            <path d="M6 10 H114 A54 50 0 0 1 6 10Z" fill="var(--tb-teal)" />
            <path d="M2 10 H118" stroke="var(--tb-gold)" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <p className="eyebrow mb-3">404</p>
        <h1 className="font-serif text-5xl text-charcoal md:text-7xl">This plate is empty.</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">We couldn&apos;t find that page. Let&apos;s get you back to the good stuff.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/" size="lg">
            Back home <ArrowIcon />
          </ButtonLink>
          <ButtonLink href="/shop" size="lg" variant="outline">
            Browse the shop
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
