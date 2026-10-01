"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** True on devices with a precise pointer (mouse/trackpad) that can hover. */
export function usePointerFine(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/**
 * Reduced-motion preference. Always false on the server AND on the first client render,
 * so hydration matches; switches to the real value right after mount. (CSS and
 * <MotionConfig reducedMotion="user"> already calm everything during that first frame.)
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
