import { cn } from "@/lib/utils";

/** True when the caller already set absolute/fixed (a default `relative` would override it). */
const isPositioned = (className?: string) =>
  (className ?? "").split(" ").some((c) => c === "absolute" || c === "fixed");

const WISP = "M10 90 C-2 70 22 58 10 38 S18 10 10 0";

/**
 * Looping rising-steam wisps. Each wisp is its own HTML-level <svg> so the
 * transform/opacity animation (.steam-path in globals.css) runs on the compositor.
 */
export function Steam({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    // Only default to relative when the caller has not positioned it (relative would override absolute).
    <div className={cn("pointer-events-none aspect-[100/92]", !isPositioned(className) && "relative", className)} aria-hidden="true">
      {[
        { left: "10%", delay: "0s" },
        { left: "40%", delay: "1.2s" },
        { left: "70%", delay: "2.4s" },
      ].map((w) => (
        <svg
          key={w.left}
          viewBox="0 0 20 92"
          fill="none"
          className="steam-path absolute top-0 h-full w-[20%] overflow-visible"
          style={{ left: w.left, animationDelay: w.delay }}
        >
          <path d={WISP} stroke={color} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      ))}
    </div>
  );
}
