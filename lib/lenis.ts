import type Lenis from "lenis";

/** Module-level handle so any component can reach the smooth-scroll instance. */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: "instant" });
}
