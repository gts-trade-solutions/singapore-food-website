import { Marquee } from "@/components/motion/Marquee";
import { cn } from "@/lib/utils";

const ITEMS = [
  { text: "Tradisi · Rasa · Bersama", lang: "ms", brand: "tb" },
  { text: "Rangup · Sedap", lang: "ms", brand: "mc" },
  { text: "Taste of the Archipelago", lang: "en", brand: "tb" },
  { text: "mmm...dapp!", lang: "ms", brand: "mc" },
  { text: "Citarasa Nusantara", lang: "ms", brand: "tb" },
  { text: "Tradition · Taste · Together", lang: "en", brand: "tb" },
] as const;

/** Tagline strip that accelerates with scroll velocity. */
export function TaglineMarquee({ className }: { className?: string }) {
  return (
    <section aria-label="Our taglines" className={cn("relative z-10 border-y border-charcoal/10 bg-ivory py-5 md:py-7", className)}>
      <Marquee speed={2.5}>
        {ITEMS.map((item) => (
          <span key={item.text} lang={item.lang} className="flex items-center">
            <span
              className={cn(
                "px-6 text-4xl whitespace-nowrap md:px-10 md:text-6xl",
                item.brand === "tb" ? "font-serif text-tb-teal italic" : "font-script text-mc-red-ink",
              )}
            >
              {item.text}
            </span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-tb-gold md:h-7 md:w-7" aria-hidden="true">
              <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
