/**
 * Lazy GSAP loader. GSAP + ScrollTrigger are only downloaded by the sections that
 * use them, after hydration, so they stay out of the initial bundle.
 *
 * On first load it also:
 * - drives ScrollTrigger from Lenis' scroll events so pinned sections stay in sync,
 * - refreshes trigger positions once web fonts and late images have loaded
 *   (both change section heights, which would otherwise leave pins misplaced).
 * Route changes call `refreshScrollTriggers()` from <ScrollTriggerSync>.
 */
import { getLenis } from "./lenis";

type GsapModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let promise: Promise<GsapModules> | null = null;
let loaded: GsapModules | null = null;
let refreshTimer = 0;

export function refreshScrollTriggers(delay = 120) {
  if (!loaded) return;
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => loaded?.ScrollTrigger.refresh(), delay);
}

function wireUp({ ScrollTrigger }: GsapModules) {
  const lenis = getLenis();
  lenis?.on("scroll", ScrollTrigger.update);

  document.fonts?.ready.then(() => refreshScrollTriggers(0));
  if (document.readyState !== "complete") {
    window.addEventListener("load", () => refreshScrollTriggers(0), { once: true });
  }
  // Images that finish after the triggers were measured (lazy images further down).
  document.addEventListener(
    "load",
    (e) => {
      if (e.target instanceof HTMLImageElement) refreshScrollTriggers(250);
    },
    true,
  );
}

export function loadGsap(): Promise<GsapModules> {
  if (!promise) {
    promise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      g.gsap.registerPlugin(st.ScrollTrigger);
      loaded = { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
      wireUp(loaded);
      return loaded;
    });
  }
  return promise;
}
