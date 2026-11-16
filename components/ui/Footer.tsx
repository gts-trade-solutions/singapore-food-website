import type { ReactNode } from "react";
import { siteConfig } from "@/lib/config";
import { isBrandComingSoon } from "@/data/products";
import { whatsappUrl } from "@/lib/whatsapp";
import { t } from "@/lib/i18n/dictionaries";
import { TransitionLink } from "@/components/motion/PageTransition";
import { WhatsAppIcon } from "./Button";
import { Logo } from "./Logo";
import { CertificationBadges } from "./CertificationBadges";

type Social = { label: string; href: string; icon: ReactNode; external: boolean };

const iconClass = "h-7 w-7";

/** Social and contact links, in their own brand colours. Profiles without a URL in siteConfig are skipped. */
const SOCIALS: Social[] = [
  {
    label: "Instagram",
    href: siteConfig.instagram,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="#E4405F" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="#E4405F" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: siteConfig.facebook,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
        <circle cx="12" cy="12" r="10.5" fill="#1877F2" />
        <path d="M13.4 22v-7.4h2.4l.4-2.9h-2.8V9.9c0-.8.3-1.4 1.4-1.4h1.5V5.9c-.3 0-1.2-.1-2.2-.1-2.1 0-3.6 1.3-3.6 3.7v2.2H8.1v2.9h2.4V22" fill="#fff" />
      </svg>
    ),
  },
  {
    label: "X",
    href: siteConfig.x,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#000" aria-hidden="true">
        <path d="M18.9 1.2h3.7l-8 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9Zm-1.3 19.5h2L6.5 3.2H4.3Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: siteConfig.linkedin,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="3" fill="#0A66C2" />
        <path d="M7.5 10.5v6.5M7.5 7.3v.1M11.2 17v-6.5M11.2 13.4c0-1.7 1-2.9 2.6-2.9 1.5 0 2.5 1 2.5 2.9V17" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: whatsappUrl("Hi RJS Foods!"),
    external: true,
    icon: <WhatsAppIcon className="h-7 w-7 text-[#25D366]" />,
  },
  {
    label: "Email",
    href: `mailto:${siteConfig.email}`,
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="var(--tb-steel-ink)" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="2" />
        <path d="m3 6.5 9 6.5 9-6.5" />
      </svg>
    ),
  },
].filter((s) => s.href);

const LINKS = [
  { href: "/shop", label: t.nav.shop },
  { href: "/tok-bah", label: "Tok Bah" },
  { href: "/mak-chic", label: "Mak 'Chic'" },
  { href: "/about", label: t.nav.about },
  { href: "/contact", label: t.nav.contact },
  { href: "/contact#wholesale", label: "Wholesale & stockists" },
];

/** Light footer: logo, about paragraph and social icons in one row, then a slim bar with links and legal details. */
export function Footer() {
  const year = new Date().getFullYear();
  const keropokSoon = isBrandComingSoon("mak-chic");
  return (
    <footer data-brand="rjs" className="relative overflow-hidden bg-tb-mist font-sans text-ink">
      {/* Split identity: Tok Bah brown into gold into chilli red along the top edge. */}
      <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-tb-brown via-tb-gold to-mc-red" />

      {/* Soft diagonal light bands on the right. */}
      <div aria-hidden="true" className="pointer-events-none absolute top-1.5 right-0 bottom-0 w-2/3 overflow-hidden">
        <span className="absolute -top-1/2 right-[22%] h-[220%] w-40 rotate-[38deg] bg-white/45" />
        <span className="absolute -top-1/2 right-[6%] h-[220%] w-24 rotate-[38deg] bg-white/35" />
        <span className="absolute -top-1/2 right-[40%] h-[220%] w-14 -rotate-[38deg] bg-white/30" />
      </div>

      <div className="container-page relative grid items-center gap-8 py-12 text-center md:py-14 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-14 lg:text-left">
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <TransitionLink href="/" aria-label="RJS Foods home" className="inline-block">
            <Logo className="h-20 md:h-24" />
          </TransitionLink>
          <CertificationBadges />
        </div>

        <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted md:text-justify md:text-[1.05rem] lg:mx-0">
          At RJS Foods, we cook the food we grew up with for the way people live in Singapore today. Our two brands come from
          the same kitchen: <span className="font-semibold text-ink">Tok Bah</span>, heritage ready-to-eat meals, cooking pastes
          and basmathi rice, slow-cooked the way our grandparents did, and{" "}
          <span className="font-semibold text-ink">Mak &apos;Chic&apos; Keropok</span>, crispy, cheesy, chilli-loud crackers with
          a cheeky twist{keropokSoon ? ", coming soon" : ""}. Order easily on WhatsApp and we deliver within Singapore.
        </p>

        <div className="flex flex-col items-center gap-3 lg:items-end">
          <ul className="flex flex-wrap justify-center gap-1" aria-label="RJS Foods on social media and contact">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-label={s.external ? `${s.label} (opens in a new tab)` : `${s.label}: ${siteConfig.email}`}
                  className="grid h-11 w-11 place-items-center rounded-full transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
          <a href={siteConfig.phoneHref} className="text-sm font-medium whitespace-nowrap text-ink hover:underline">
            {siteConfig.phone}
          </a>
        </div>
      </div>

      <div className="relative border-t border-line">
        <div className="container-page flex flex-col items-center gap-3 py-5 text-xs text-muted lg:flex-row lg:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <TransitionLink href={l.href} className="inline-flex min-h-8 items-center hover:text-ink hover:underline">
                    {l.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-center lg:text-right">
            © {year} {siteConfig.legalName} · UEN {siteConfig.uen} · Est. {siteConfig.incorporated.slice(0, 4)} ·{" "}
            <span lang="ms">Tradisi · Rasa · Bersama</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
