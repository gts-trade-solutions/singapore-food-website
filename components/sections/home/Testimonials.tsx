import { testimonials } from "@/data/content";
import { brands } from "@/data/brands";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="relative z-10 bg-ivory section-y">
      <div className="container-page">
        <div className="mb-8 md:mb-10 max-w-2xl">
          <p className="eyebrow mb-4">Kata mereka · What people say</p>
          <SplitText
            as="h2"
            id="testimonials-title"
            text="Cleaned plates, empty packets."
            className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] text-charcoal"
          />
        </div>
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item, i) => {
            const isSnack = item.brand === "mak-chic";
            return (
              <Reveal as="li" key={i} delay={i * 0.08} className="h-full">
                <figure
                  data-brand={brands[item.brand].key}
                  className={cn(
                    "flex h-full flex-col justify-between gap-8 rounded-card p-7",
                    isSnack ? "border-[3px] border-mc-cocoa bg-mc-cream text-mc-cocoa shadow-card" : "bg-tb-aqua text-tb-teal",
                  )}
                >
                  <svg viewBox="0 0 32 24" className={cn("h-6 w-8", isSnack ? "text-mc-red" : "text-tb-gold")} aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M0 24V14C0 6 4 1 12 0l1 4c-4 1-6 4-6 8h6v12H0Zm19 0V14c0-8 4-13 12-14l1 4c-4 1-6 4-6 8h6v12H19Z"
                    />
                  </svg>
                  <blockquote className={cn("text-lg leading-relaxed", isSnack ? "font-pop" : "font-serif text-xl")}>
                    <p>{item.quote}</p>
                  </blockquote>
                  <figcaption className="text-sm">
                    <span className="font-semibold">{item.name}</span>
                    <span className="opacity-75"> · {item.detail}</span>
                    <span className="mt-1 block text-xs tracking-[0.15em] uppercase opacity-75">{brands[item.brand].name}</span>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
