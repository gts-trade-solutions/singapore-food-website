import { useId } from "react";
import { cn } from "@/lib/utils";

export const LOGO_PATHS = {
  ring: "M32 4 a28 28 0 1 1 0 56 a28 28 0 1 1 0 -56",
  bowl: "M13 33 H51 A19 19 0 0 1 13 33 Z",
  rim: "M10 33 H54",
  steam: ["M25 25 c-3 -4 3 -6 0 -10", "M32 23 c-3 -4 3 -6 0 -10", "M39 25 c-3 -4 3 -6 0 -10"],
};

/**
 * RJS Foods mark: a bowl with rising steam inside a ring, teal fading to chilli red.
 * Pass `title=""` when the mark is decorative (it is then hidden from screen readers).
 */
export function LogoMark({ className, title = "RJS Foods" }: { className?: string; title?: string }) {
  // The mark appears several times per page (header, footer, hero…): each needs its own
  // gradient id, otherwise duplicate ids break the gradient when the first copy is hidden.
  const gradientId = `rjs-split-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
  return (
    <svg viewBox="0 0 64 64" className={cn("h-9 w-9", className)} fill="none" {...a11y}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.35" stopColor="#0F3D3E" />
          <stop offset="0.65" stopColor="#D9372A" />
        </linearGradient>
      </defs>
      <path d={LOGO_PATHS.ring} stroke={`url(#${gradientId})`} strokeWidth="3" />
      <path d={LOGO_PATHS.bowl} fill={`url(#${gradientId})`} />
      <path d={LOGO_PATHS.rim} stroke="#B8893B" strokeWidth="2.5" strokeLinecap="round" />
      {LOGO_PATHS.steam.map((d) => (
        <path key={d} d={d} stroke="#B8893B" strokeWidth="2.2" strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="font-serif text-[1.45rem] leading-none font-semibold tracking-tight">
        RJS <span className="font-normal italic">Foods</span>
      </span>
    </span>
  );
}
