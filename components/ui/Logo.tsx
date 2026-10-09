import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The RJS Foods logo, redrawn as clean vector strokes from the supplied artwork:
 * tall condensed R·J·S, an underline, and "Foods" set vertically on the right.
 * Stroke-based, so the intro loader can draw it in (see IntroLoader).
 */
export const LOGO_VIEWBOX = "90 70 770 590";
export const LOGO_PATHS = {
  letters: [
    // R
    "M166 588 V92 H224 Q296 92 296 170 V258 Q296 334 224 334 H166 M246 334 Q290 344 290 410 V588",
    // J
    "M462 84 V516 Q462 590 400 590 Q340 590 340 516 V438",
    // S
    "M646 214 V156 Q646 92 584 92 Q520 92 520 156 V226 Q520 280 578 304 L596 312 Q646 336 646 396 V516 Q646 590 584 590 Q520 590 520 516 V444",
  ],
  underline: "M104 636 H700",
  letterStroke: 20,
  underlineStroke: 10,
};

/** Text for "Foods", set vertically beside the letters. */
export function LogoFoods({ fill }: { fill: string }) {
  return (
    <text
      transform="translate(834 642) rotate(-90)"
      fontFamily="var(--font-poppins), Poppins, 'Arial Narrow', sans-serif"
      fontSize="118"
      fontWeight="500"
      textLength="238"
      lengthAdjust="spacingAndGlyphs"
      fill={fill}
    >
      Foods
    </text>
  );
}

type Variant = "color" | "light" | "current";

const TONES: Record<Variant, { underline: string; foods: string }> = {
  // Brand split: teal → chilli red letters, antique gold accents (light backgrounds).
  color: { underline: "#B8893B", foods: "#8A6424" },
  // Ivory letters with gold accents (dark teal / charcoal / red backgrounds).
  light: { underline: "#B8893B", foods: "#D9B06A" },
  // Follows the surrounding text colour.
  current: { underline: "currentColor", foods: "currentColor" },
};

/**
 * RJS Foods logo. `variant="color"` on light backgrounds, `"light"` on dark ones.
 * Pass `title=""` when it is decorative (hidden from screen readers).
 */
export function LogoMark({
  className,
  title = "RJS Foods",
  variant = "color",
  weight = "regular",
}: {
  className?: string;
  title?: string;
  variant?: Variant;
  /** "regular" keeps the slightly heavier strokes that stay crisp at small sizes; "fine" matches the original artwork. */
  weight?: "regular" | "fine";
}) {
  // Each copy needs its own gradient id (the logo appears several times per page).
  const gradientId = `rjs-split-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
  const tone = TONES[variant];
  const strokeW = weight === "fine" ? LOGO_PATHS.letterStroke : 30;
  const underlineW = weight === "fine" ? LOGO_PATHS.underlineStroke : 14;
  const letterStroke = variant === "color" ? `url(#${gradientId})` : variant === "light" ? "#FAF7F0" : "currentColor";

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className ?? "h-10 w-auto"} fill="none" {...a11y}>
      {variant === "color" && (
        <defs>
          <linearGradient id={gradientId} x1="160" y1="0" x2="660" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0.3" stopColor="#0F3D3E" />
            <stop offset="0.75" stopColor="#D9372A" />
          </linearGradient>
        </defs>
      )}
      <g stroke={letterStroke} strokeWidth={strokeW} strokeLinejoin="round">
        {LOGO_PATHS.letters.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path d={LOGO_PATHS.underline} stroke={tone.underline} strokeWidth={underlineW} />
      <LogoFoods fill={tone.foods} />
    </svg>
  );
}

/** Header / footer logo. */
export function Logo({ className, variant = "color" }: { className?: string; variant?: Variant }) {
  return <LogoMark className={cn("h-12 w-auto md:h-14", className)} variant={variant} />;
}
