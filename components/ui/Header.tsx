"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { useCart } from "@/lib/cart-store";
import { CART_TARGET_ID } from "@/lib/ui-store";
import { t } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import { TransitionLink } from "@/components/motion/PageTransition";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Logo } from "./Logo";

const NAV = [
  { href: "/tok-bah", label: t.nav.tokBah },
  { href: "/mak-chic", label: t.nav.makChic },
  { href: "/shop", label: t.nav.shop },
  { href: "/about", label: t.nav.about },
  { href: "/contact", label: t.nav.contact },
];

function CartButton() {
  const lines = useCart((s) => s.lines);
  const bumpKey = useCart((s) => s.bumpKey);
  const open = useCart((s) => s.open);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? lines.reduce((n, l) => n + l.quantity, 0) : 0;

  return (
    <MagneticButton strength={0.3}>
      <button
        id={CART_TARGET_ID}
        type="button"
        onClick={open}
        aria-label={`${t.cart.open}${count ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
        className="relative grid h-11 w-11 place-items-center rounded-full bg-brand text-brand-ink"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" strokeLinejoin="round" />
          <path d="M9 10V6a3 3 0 0 1 6 0v4" strokeLinecap="round" />
        </svg>
        <AnimatePresence>
          {count > 0 && (
            <motion.span
              key={bumpKey}
              aria-hidden="true"
              className="absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.7rem] font-bold text-accent-ink"
              initial={{ scale: bumpKey ? 0.4 : 1 }}
              // Pop: grow past full size, then settle. Multi-keyframe animations must be tweens
              // (springs only support two keyframes), so the bounce comes from the overshoot keyframe.
              animate={{ scale: [null, 1.45, 0.92, 1] }}
              exit={{ scale: 0, transition: { duration: 0.15 } }}
              transition={{ type: "tween", duration: 0.5, times: [0, 0.4, 0.75, 1], ease: "easeOut" }}
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </MagneticButton>
  );
}

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 240 && y > prev && !menuOpen);
  });

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Over the dark home hero the header switches to light-on-dark.
  const overHero = pathname === "/" && !scrolled && !menuOpen;
  const heroVars = overHero
    ? ({
        "--brand-ink": "#FAF7F0",
        "--brand-primary": "#FAF7F0",
        "--brand-primary-ink": "#1E1C1A",
        "--brand-line": "rgb(250 247 240 / 0.4)",
        "--brand-focus": "#F5B325",
      } as CSSProperties)
    : undefined;

  return (
    <>
      <motion.header
        style={heroVars}
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Backdrop fades in on scroll (opacity only). */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 border-b border-line bg-bg/85 backdrop-blur-md transition-opacity duration-500",
            scrolled || menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div className="container-page relative flex h-[var(--header-h)] items-center justify-between gap-6">
          <TransitionLink href="/" className="relative z-10 text-ink" aria-label="RJS Foods home">
            <Logo variant={overHero ? "light" : "color"} />
          </TransitionLink>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative inline-flex min-h-11 items-center px-4 text-sm font-medium text-ink"
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-4 bottom-2 h-px origin-left bg-current transition-transform duration-500 ease-brand",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <CartButton />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t.nav.close : t.nav.menu}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span aria-hidden="true" className="relative block h-3 w-5">
                <motion.span
                  className="absolute top-0 left-0 h-0.5 w-5 bg-current"
                  animate={menuOpen ? { y: 5, rotate: 45 } : { y: 0, rotate: 0 }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 w-5 bg-current"
                  animate={menuOpen ? { y: -5, rotate: -45 } : { y: 0, rotate: 0 }}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-0 z-40 flex flex-col bg-bg px-6 pt-[calc(var(--header-h)+2rem)] pb-10 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col gap-2">
              {[{ href: "/", label: t.nav.home }, ...NAV].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TransitionLink
                    href={item.href}
                    className="block py-2 font-display text-5xl text-ink"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </TransitionLink>
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto text-sm text-muted">Tradisi · Rasa · Bersama &nbsp;/&nbsp; mmm...dapp!</p>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
