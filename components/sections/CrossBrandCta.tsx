import { brands, type BrandSlug } from "@/data/brands";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";

/** End-of-page nudge to the sibling brand, styled in that brand's colours. */
export function CrossBrandCta({ to }: { to: BrandSlug }) {
  const brand = brands[to];
  const isSnack = to === "mak-chic";
  return (
    <section
      data-brand={brand.key}
      aria-labelledby={`cta-${to}`}
      className={cn("relative overflow-hidden section-y", isSnack ? "bg-mc-red text-white" : "bg-tb-teal text-tb-ivory")}
    >
      <div aria-hidden="true" className={cn("absolute inset-0 opacity-40", isSnack ? "bg-halftone" : "bg-batik-dots")} />
      <div className="container-page relative flex flex-col items-center text-center">
        <p className={cn("eyebrow mb-5", isSnack ? "!text-white" : "!text-tb-gold-light")}>Also from our kitchen</p>
        <SplitText
          as="h2"
          id={`cta-${to}`}
          text={isSnack ? "Need something crunchy?" : "Hungry for something hearty?"}
          className={cn("max-w-3xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[1]", isSnack ? "font-script" : "font-serif italic")}
        />
        <p className="mt-4 max-w-lg text-base opacity-90 md:text-lg">{brand.summary}</p>
        <MagneticButton className="mt-8">
          <ButtonLink
            href={brand.href}
            size="lg"
            className={isSnack ? "!bg-mc-cheese font-pop !text-mc-cocoa" : "!bg-tb-gold !text-tb-ink-deep"}
          >
            Visit {brand.name} <ArrowIcon />
          </ButtonLink>
        </MagneticButton>
      </div>
    </section>
  );
}
