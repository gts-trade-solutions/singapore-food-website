"use client";

import { useEffect, useState } from "react";
import { LOGO_PATHS } from "@/components/ui/Logo";
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
          <svg viewBox="0 0 64 64" className="h-24 w-24" fill="none">
            <path className="intro-stroke" pathLength={1} d={LOGO_PATHS.ring} stroke="#FAF7F0" strokeWidth="2" />
            <path
              className="intro-stroke"
              pathLength={1}
              d={LOGO_PATHS.bowl}
              stroke="#FAF7F0"
              strokeWidth="2"
              style={{ animationDelay: "0.25s" }}
            />
            <path
              className="intro-stroke"
              pathLength={1}
              d={LOGO_PATHS.rim}
              stroke="#B8893B"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ animationDelay: "0.45s" }}
            />
            {LOGO_PATHS.steam.map((d, i) => (
              <path
                key={d}
                className="intro-stroke"
                pathLength={1}
                d={d}
                stroke="#B8893B"
                strokeWidth="2.2"
                strokeLinecap="round"
                style={{ animationDelay: `${0.55 + i * 0.1}s` }}
              />
            ))}
          </svg>
          <p className="font-serif text-2xl tracking-[0.3em] text-ivory">RJS FOODS</p>
        </div>
      </div>
    </div>
  );
}
