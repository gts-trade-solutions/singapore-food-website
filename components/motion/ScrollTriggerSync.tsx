"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { refreshScrollTriggers } from "@/lib/gsap";

/** Re-measures ScrollTrigger pins after every route change (no-op until GSAP has loaded). */
export function ScrollTriggerSync() {
  const pathname = usePathname();
  useEffect(() => {
    refreshScrollTriggers(300);
  }, [pathname]);
  return null;
}
