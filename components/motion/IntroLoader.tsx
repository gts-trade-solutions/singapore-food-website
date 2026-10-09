"use client";

import { useEffect, useState } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX, LogoFoods } from "@/components/ui/Logo";
import { useUI } from "@/lib/ui-store";
import { INTRO_SESSION_KEY } from "@/lib/intro";

/**
 * First-visit intro: the logo mark draws itself in, then two curtains part
 * (teal up, red down) to reveal the page. It is pure CSS (see globals.css), so it
 * plays from the first paint without waiting for JavaScript; this component only
 * remembers that it has played and removes it afterwards.
 * Skipped on return visits, on phones and for reduced motion (lib/intro.ts).
 */
export function IntroLoader() {
  const setIntroDone = useUI((s) => s.setIntroDone);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    if (root.classList.contains("intro-skip")) {
      setMounted(false);
      setIntroDone();
      return;
    }
    const done = window.setTimeout(() => {
      setMounted(false);
      setIntroDone();
    }, 2200);
    // Later hero reveals (client navigations) no longer need to wait for the curtains.
    const settle = window.setTimeout(() => root.classList.add("intro-skip"), 4000);
    return () => {
      window.clearTimeout(done);
      window.clearTimeout(settle);
    };
  }, [setIntroDone]);

  if (!mounted) return null;

  return (
    <div aria-hidden="true" className="intro-loader pointer-events-none fixed inset-0 z-[100]">
      <div className="intro-curtain-top absolute inset-x-0 top-0 h-1/2 bg-tb-teal" />
      <div className="intro-curtain-bottom absolute inset-x-0 bottom-0 h-1/2 bg-mc-red" />
      <div className="intro-mark absolute inset-0 grid place-items-center">
        <div className="flex flex-col items-center gap-5">
          {/* The RJS logo writes itself: R, J, S, then the underline, then "Foods" fades in. */}
          <svg viewBox={LOGO_VIEWBOX} className="h-28 w-auto md:h-36" fill="none">
            {LOGO_PATHS.letters.map((d, i) => (
              <path
                key={d}
                className="intro-stroke"
                pathLength={1}
                d={d}
                stroke="#FAF7F0"
                strokeWidth={LOGO_PATHS.letterStroke}
                strokeLinejoin="round"
                style={{ animationDelay: `${i * 0.18}s` }}
              />
            ))}
            <path
              className="intro-stroke"
              pathLength={1}
              d={LOGO_PATHS.underline}
              stroke="#B8893B"
              strokeWidth={LOGO_PATHS.underlineStroke}
              style={{ animationDelay: "0.6s" }}
            />
            <g className="rise-in" style={{ animationDelay: "0.75s" }}>
              <LogoFoods fill="#D9B06A" />
            </g>
          </svg>
          <p className="text-xs font-semibold tracking-[0.3em] text-ivory/80 uppercase" lang="ms">
            Tradisi · Rasa · Bersama
          </p>
        </div>
      </div>
    </div>
  );
}
