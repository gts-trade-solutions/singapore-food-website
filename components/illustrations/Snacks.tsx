import { cn } from "@/lib/utils";

/** True when the caller already set absolute/fixed (a default `relative` would override it). */
const isPositioned = (className?: string) =>
  (className ?? "").split(" ").some((c) => c === "absolute" || c === "fixed");

type P = { className?: string };

export function Chilli({ className }: P) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden="true">
      <path d="M40 22 C70 30 64 80 40 112 C30 96 22 70 26 46 C28 32 32 24 40 22Z" fill="#D9372A" stroke="#4A1F12" strokeWidth="3.5" />
      <path d="M34 38 C32 56 34 74 40 90" stroke="#fff" strokeOpacity=".45" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M40 24 C38 14 44 6 54 4" stroke="#2E7D32" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M30 26 C36 18 46 18 52 26 C46 30 36 30 30 26Z" fill="#2E7D32" stroke="#4A1F12" strokeWidth="3" />
    </svg>
  );
}

export function Peanut({ className }: P) {
  return (
    <svg viewBox="0 0 70 110" className={className} aria-hidden="true">
      <path
        d="M35 6 C54 6 60 24 52 40 C48 48 48 58 52 66 C62 84 52 104 35 104 C18 104 8 84 18 66 C22 58 22 48 18 40 C10 24 16 6 35 6Z"
        fill="#D9A15A"
        stroke="#4A1F12"
        strokeWidth="3.5"
      />
      {[
        [26, 24],
        [42, 30],
        [30, 80],
        [44, 86],
        [36, 54],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" fill="#9C5A2B" />
      ))}
    </svg>
  );
}

export function CheeseWedge({ className }: P) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <path d="M8 70 L100 20 L112 70 Z" fill="#F5B325" stroke="#4A1F12" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M8 70 H112 V88 H8 Z" fill="#E8A317" stroke="#4A1F12" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="60" cy="56" r="7" fill="#C98A2B" />
      <circle cx="88" cy="46" r="5" fill="#C98A2B" />
      <circle cx="36" cy="80" r="5" fill="#C98A2B" />
    </svg>
  );
}

export function Chip({ className }: P) {
  return (
    <svg viewBox="0 0 110 90" className={className} aria-hidden="true">
      <path
        d="M10 46 C12 20 40 6 62 8 C90 10 104 30 100 52 C96 76 70 86 48 82 C24 78 8 66 10 46Z"
        fill="#F3D27A"
        stroke="#4A1F12"
        strokeWidth="3.5"
      />
      <path d="M28 40 C44 30 64 30 82 40" stroke="#E8A317" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="58" r="4" fill="#D9372A" />
      <circle cx="70" cy="62" r="3.5" fill="#F5B325" />
    </svg>
  );
}

/** Thick brush-stroke underline / highlight. */
export function BrushStroke({ className, color = "var(--mc-cheese)" }: P & { color?: string }) {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" className={cn("h-full w-full", className)} aria-hidden="true">
      <path
        d="M4 24 C60 8 140 12 200 14 C270 16 340 6 396 16 C380 26 330 32 270 30 C200 28 120 36 60 34 C30 33 10 30 4 24Z"
        fill={color}
      />
    </svg>
  );
}

/** Circular sticker badge with text running around the edge. Spins slowly. */
export function StickerBadge({
  text = "RANGUP · SEDAP · CRISPY · DELICIOUS · ",
  center = "100%\nRANGUP",
  className,
  spin = true,
}: P & { text?: string; center?: string; spin?: boolean }) {
  const id = `badge-${text.length}-${center.length}`;
  return (
    <div
      className={cn("grid aspect-square place-items-center", !isPositioned(className) && "relative", className)}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className={cn("absolute inset-0 h-full w-full", spin && "spin-slow")}>
        <defs>
          <path id={id} d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
        </defs>
        <circle cx="100" cy="100" r="96" fill="var(--mc-cheese)" stroke="var(--mc-cocoa)" strokeWidth="4" />
        <circle cx="100" cy="100" r="58" fill="var(--mc-red)" stroke="var(--mc-cocoa)" strokeWidth="4" />
        <text fontFamily="var(--font-poppins), sans-serif" fontWeight="800" fontSize="17" letterSpacing="3" fill="var(--mc-cocoa)">
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="relative text-center font-pop text-[0.8em] leading-tight font-extrabold whitespace-pre text-white">
        {center}
      </span>
    </div>
  );
}
