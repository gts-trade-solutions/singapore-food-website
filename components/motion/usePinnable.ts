"use client";

import { useEffect, useState } from "react";
import { loadGsap } from "@/lib/gsap";

type GsapModules = Awaited<ReturnType<typeof loadGsap>>;

/**
 * Returns GSAP once it is safe to pin: screen >= 1024px, motion allowed, and GSAP
 * actually loaded. Until then (and on phones/tablets, with reduced motion, or if the
 * chunk fails to load) it returns null and the section renders its static, fully
 * visible layout. Pinning never hides content before the animation exists.
 */
export function usePinnable(): GsapModules | null {
  const [mods, setMods] = useState<GsapModules | null>(null);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let alive = true;

    const update = () => {
      if (!wide.matches || reduced.matches) {
        setMods(null);
        return;
      }
      loadGsap()
        .then((m) => alive && wide.matches && !reduced.matches && setMods(m))
        .catch(() => alive && setMods(null));
    };
    update();
    wide.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      alive = false;
      wide.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return mods;
}
