"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";
import { brandColors, brandForPath } from "@/lib/brand";
import { useUI } from "@/lib/ui-store";
import { scrollToTop } from "@/lib/lenis";
import { TransitionScreen } from "./TransitionScreen";

const EASE = [0.76, 0, 0.24, 1] as const;
/** If the client router has not arrived by then, fall back to a normal page load. */
const NAV_TIMEOUT_MS = 8000;
/** Show a loading mark on the wipe when the next page takes longer than this. */
const SLOW_MS = 700;

/**
 * The wipe covers the screen first ("shown" waits for it, then reveals the scene) and on
 * the way out the scene fades before the wipe leaves, so text is never squashed by scaleY.
 */
const wipe: Variants = {
  hidden: { scaleY: 0, transformOrigin: "50% 100%" },
  shown: { scaleY: 1, transformOrigin: "50% 100%", transition: { duration: 0.6, ease: EASE, when: "beforeChildren" } },
  leave: { scaleY: 0, transformOrigin: "50% 0%", transition: { duration: 0.5, ease: EASE, when: "afterChildren" } },
};

const pathOf = (href: string) => href.split(/[?#]/)[0] || "/";

/**
 * Brand-coloured wipe between pages.
 * 1. <TransitionLink> prefetches on intent and starts the transition with the destination brand colour.
 * 2. The overlay wipes up to cover the screen, then the router navigates.
 * 3. The overlay stays (with a loading mark if slow) until the new pathname renders, then wipes away.
 * 4. If client navigation stalls or fails, it falls back to a full page load, so a click always lands.
 */
export function PageTransitionOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const transition = useUI((s) => s.transition);
  const endTransition = useUI((s) => s.endTransition);
  const pushed = useRef(false);
  const [slow, setSlow] = useState(false);

  // Arrived: the pathname now matches the destination.
  useEffect(() => {
    if (!transition || !pushed.current) return;
    if (pathname !== pathOf(transition.href)) return;
    pushed.current = false;
    setSlow(false);
    scrollToTop();
    // Let the new page paint one frame before revealing it.
    requestAnimationFrame(() => endTransition());
  }, [pathname, transition, endTransition]);

  // Navigate as soon as the wipe has covered the screen (0.6s), independent of the scene's own fade-in.
  useEffect(() => {
    if (!transition) return;
    const id = window.setTimeout(() => {
      if (pushed.current) return;
      pushed.current = true;
      router.push(transition.href);
    }, 600);
    return () => window.clearTimeout(id);
  }, [transition, router]);

  // Slow-network indicator and hard fallback, measured from the start of the transition.
  useEffect(() => {
    if (!transition) return;
    const slowId = window.setTimeout(() => setSlow(true), 600 + SLOW_MS);
    const failId = window.setTimeout(() => {
      // Navigation never completed: do a normal page load instead of stranding the visitor.
      window.location.assign(transition.href);
    }, NAV_TIMEOUT_MS);
    return () => {
      window.clearTimeout(slowId);
      window.clearTimeout(failId);
      setSlow(false);
    };
  }, [transition]);

  return (
    <AnimatePresence>
      {transition && (
        <motion.div
          key="wipe"
          className="pointer-events-auto fixed inset-0 z-[90]"
          style={{ backgroundColor: transition.color }}
          variants={wipe}
          initial="hidden"
          animate="shown"
          exit="leave"
        >
          <TransitionScreen href={transition.href} slow={slow} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type TransitionLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & { children: ReactNode };

/** Drop-in replacement for next/link that plays the brand wipe on internal navigation. */
export function TransitionLink({ href, onClick, onMouseEnter, onFocus, onTouchStart, children, ...rest }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const startTransition = useUI((s) => s.startTransition);
  const busy = useUI((s) => s.transition !== null);
  const url = typeof href === "string" ? href : (href.pathname ?? "/");
  const internal = url.startsWith("/") && rest.target !== "_blank";

  // Warm the route on intent so it is usually ready before the wipe finishes.
  const prefetch = () => {
    if (internal) router.prefetch(pathOf(url));
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    const targetPath = pathOf(url);
    // Same page, hash links, external links, modified clicks and reduced motion use plain <Link>.
    if (!internal || reduced || modified || targetPath === pathname) return;
    e.preventDefault();
    // A transition is already running (about a second): ignore double clicks rather than racing it.
    if (busy) return;
    prefetch();
    startTransition(url, brandColors[brandForPath(targetPath)]);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      onMouseEnter={(e) => {
        onMouseEnter?.(e);
        prefetch();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        prefetch();
      }}
      onTouchStart={(e) => {
        onTouchStart?.(e);
        prefetch();
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
