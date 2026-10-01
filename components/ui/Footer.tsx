import { siteConfig } from "@/lib/config";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { t } from "@/lib/i18n/dictionaries";
import { TransitionLink } from "@/components/motion/PageTransition";
import { BatikFlower } from "@/components/illustrations/Batik";
import { Logo } from "./Logo";
import { CertificationBadges } from "./CertificationBadges";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-brand="rjs" className="relative overflow-hidden bg-charcoal text-ivory">
      {/* Split identity: teal fading into chilli red along the top edge. */}
      <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-tb-teal via-tb-gold to-mc-red" />
      <BatikFlower className="pointer-events-none absolute -right-24 -bottom-24 h-96 w-96 text-tb-gold opacity-10" />

      <div className="container-page relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div className="space-y-5">
          <Logo className="text-ivory" />
          <p className="max-w-sm text-sm leading-relaxed text-ivory/75">{siteConfig.description}</p>
          <CertificationBadges className="[--brand-accent:var(--tb-gold)] [--brand-accent-ink:var(--tb-gold)]" />
        </div>

        {(["tok-bah", "mak-chic"] as const).map((slug) => (
          <div key={slug}>
            <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-tb-gold uppercase">
              {brands[slug].name}
            </h2>
            <ul className="space-y-2 text-sm">
              {products
                .filter((p) => p.brand === slug)
                .map((p) => (
                  <li key={p.slug}>
                    <TransitionLink href={`/products/${p.slug}`} className="text-ivory/80 hover:text-ivory hover:underline">
                      {p.name}
                    </TransitionLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.2em] text-tb-gold uppercase">RJS Foods</h2>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/shop", label: t.nav.shop },
              { href: "/about", label: t.nav.about },
              { href: "/contact", label: t.nav.contact },
              { href: "/contact#wholesale", label: "Wholesale & stockists" },
            ].map((l) => (
              <li key={l.href}>
                <TransitionLink href={l.href} className="text-ivory/80 hover:text-ivory hover:underline">
                  {l.label}
                </TransitionLink>
              </li>
            ))}
            <li>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="text-ivory/80 hover:text-ivory hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="text-ivory/80 hover:text-ivory hover:underline">
                {siteConfig.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page relative flex flex-col gap-2 border-t border-ivory/15 py-6 text-xs text-ivory/60 md:flex-row md:justify-between">
        <p>
          © {year} {siteConfig.legalName}. Nusantara flavours for Singapore homes.
        </p>
        <p lang="ms">Tradisi · Rasa · Bersama — Rangup · Sedap</p>
      </div>
    </footer>
  );
}
