import { getProduct } from "@/data/products";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { DrawLine } from "@/components/motion/DrawLine";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { CertificationBadges } from "@/components/ui/CertificationBadges";
import { Steam } from "@/components/illustrations/Steam";
import { BatikFlower } from "@/components/illustrations/Batik";

/** Ornamental frame: thin gold border with corner flourishes. */
function OrnamentFrame({ children }: { children: React.ReactNode }) {
  const corner = "absolute h-5 w-5 border-tb-gold";
  return (
    <div className="relative inline-block px-6 py-3">
      <span aria-hidden="true" className="absolute inset-0 border border-tb-gold/60" />
      <span aria-hidden="true" className={`${corner} -top-1.5 -left-1.5 border-t-2 border-l-2`} />
      <span aria-hidden="true" className={`${corner} -top-1.5 -right-1.5 border-t-2 border-r-2`} />
      <span aria-hidden="true" className={`${corner} -bottom-1.5 -left-1.5 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${corner} -right-1.5 -bottom-1.5 border-r-2 border-b-2`} />
      {children}
    </div>
  );
}

const RANGE = [
  { count: 2, label: "Ready meals" },
  { count: 2, label: "Cooking pastes" },
  { count: 1, label: "Basmathi rice" },
];

export function TokBahHero() {
  const rendang = getProduct("rendang-daging")!;
  const sambal = getProduct("pes-sambal-tumis")!;
  return (
    <section aria-labelledby="tb-title" className="relative overflow-hidden bg-tb-ivory section-top">
      <div aria-hidden="true" className="bg-batik-dots absolute inset-0 opacity-60" />
      <BatikFlower className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] text-tb-gold opacity-15" />

      <div className="container-page relative grid items-center gap-8 md:gap-10 lg:grid-cols-2">
        <div>
          <Reveal immediate>
            <OrnamentFrame>
              <span className="eyebrow" lang="ms">
                Citarasa Nusantara
              </span>
            </OrnamentFrame>
          </Reveal>
          <SplitText
            as="h1"
            id="tb-title"
            by="line"
            immediate
            delay={0.25}
            stagger={0.14}
            text={"Tok Bah.\nTradition, taste,\ntogether."}
            className="mt-5 text-[clamp(2.75rem,5.5vw,5.5rem)] leading-[0.95] text-tb-teal"
          />
          <DrawLine className="mt-5 !max-w-xs" />
          <Reveal immediate delay={0.5}>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted md:text-lg">
              Heritage ready-to-eat meals and cooking pastes, cooked the slow way and packed for the way you live now. Taste of the
              Archipelago, from our family&apos;s kitchen to yours.
            </p>
          </Reveal>
          <Reveal immediate delay={0.65} className="mt-6 flex flex-wrap items-center gap-3">
            <MagneticButton>
              <ButtonLink href="#tb-products" size="lg">
                Explore the range <ArrowIcon />
              </ButtonLink>
            </MagneticButton>
            <ButtonLink href="#paste-to-plate" variant="ghost" size="lg">
              From paste to plate
            </ButtonLink>
          </Reveal>
          <Reveal immediate delay={0.75}>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="The Tok Bah range">
              {RANGE.map((r) => (
                <li key={r.label} className="inline-flex items-center gap-2 rounded-full border border-tb-gold/40 bg-tb-aqua/60 px-3 py-1.5 text-sm text-tb-teal">
                  <span className="font-serif text-lg leading-none text-tb-gold-ink italic">{r.count}</span> {r.label}
                </li>
              ))}
            </ul>
          </Reveal>
          <CertificationBadges className="mt-6" />
        </div>

        <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:aspect-[20/21] lg:max-w-none">
          <div aria-hidden="true" className="absolute inset-[2%] rounded-t-full border border-tb-gold/50" />
          <ImageReveal immediate className="absolute inset-[5%] rounded-t-full bg-tb-aqua" delay={0.2}>
            <div className="relative h-full w-full">
              <div className="absolute inset-x-[8%] top-[16%] bottom-[2%]">
                <Steam className="absolute -top-16 left-1/2 w-24 -translate-x-1/2 text-tb-teal/40" />
                <ProductImage
                  src={rendang.image.src}
                  alt={rendang.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 80vw"
                  className="object-contain drop-shadow-[0_30px_30px_rgb(15_61_62/0.3)]"
                />
              </div>
            </div>
          </ImageReveal>
          <Parallax offset={24} rotate={4} className="absolute bottom-0 left-0 w-[34%]">
            <ProductImage
              src={sambal.image.src}
              alt={sambal.image.alt}
              width={300}
              height={380}
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="h-auto w-full drop-shadow-[0_25px_25px_rgb(15_61_62/0.3)]"
            />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
