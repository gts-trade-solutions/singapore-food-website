import { pageMetadata } from "@/lib/seo";
import { values, stats } from "@/data/content";
import { getProduct } from "@/data/products";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { DrawLine } from "@/components/motion/DrawLine";
import { Counter } from "@/components/motion/Counter";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { KitchenTimeline } from "@/components/sections/about/KitchenTimeline";
import { ProductImage } from "@/components/ui/ProductImage";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { BatikFlower } from "@/components/illustrations/Batik";
import { StickerBadge } from "@/components/illustrations/Snacks";
import { TransitionLink } from "@/components/motion/PageTransition";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "RJS Foods is the home of Tok Bah and Mak 'Chic' Keropok: heritage Nusantara meals and crunchy snacks, cooked with patience and made to be shared.",
  path: "/about",
});

export default function AboutPage() {
  const rendang = getProduct("rendang-daging")!;
  const rempeyek = getProduct("rempeyek")!;
  const sambal = getProduct("pes-sambal-tumis")!;
  const tempe = getProduct("tempe-chips-cheesy-spicy")!;

  return (
    <div data-brand="rjs">
      {/* TODO: replace the story copy below with RJS Foods' real founding story. */}
      <section aria-labelledby="about-title" className="section-top relative overflow-hidden">
        <BatikFlower className="pointer-events-none absolute -top-24 -right-24 h-[26rem] w-[26rem] text-tb-gold opacity-10" />
        <div className="container-page relative">
          <div className="grid items-end gap-4 md:grid-cols-[1.3fr_1fr] md:gap-10">
            <div>
              <p className="eyebrow mb-3">Tentang kami · About us</p>
              <SplitText
                as="h1"
                id="about-title"
                by="line"
                immediate
                stagger={0.12}
                text={"A family kitchen\nwith two personalities."}
                className="font-serif text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.95] text-charcoal"
              />
            </div>
            <Reveal immediate delay={0.4}>
              <p className="text-base leading-relaxed text-muted md:text-lg">
                RJS Foods cooks the food we grew up with, for the way people live in Singapore today. Our two brands come from the
                same kitchen but they have very different personalities. Tok Bah is calm and soulful. Mak &apos;Chic&apos; is loud
                and crunchy. Both are made with care.
              </p>
            </Reveal>
          </div>

          {/* The two brands, as full cards directly under the intro (no separate padded band). */}
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 lg:gap-6">
            <ImageReveal className="rounded-card">
              <div
                data-brand="tokbah"
                className="bg-batik-dots relative grid aspect-[4/3] grid-cols-[1fr_44%] bg-tb-teal p-5 text-tb-ivory sm:p-7"
              >
                <div className="relative z-10 flex flex-col">
                  <p className="eyebrow !text-tb-gold-light">Tok Bah</p>
                  <p className="mt-2 font-serif text-3xl leading-tight italic sm:text-4xl lg:text-5xl">Tradition, taste, together.</p>
                  <p className="mt-auto hidden text-sm text-tb-ivory/80 sm:block">2 ready meals · 2 cooking pastes · basmathi rice</p>
                  <TransitionLink href="/tok-bah" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-tb-gold-light underline-offset-4 hover:underline">
                    Explore Tok Bah →
                  </TransitionLink>
                </div>
                <Parallax offset={16} className="relative self-end">
                  <ProductImage src={rendang.image.src} alt="" width={300} height={380} sizes="(min-width: 768px) 20vw, 40vw" className="h-auto w-full drop-shadow-2xl" />
                </Parallax>
              </div>
            </ImageReveal>
            <ImageReveal className="rounded-card" delay={0.15}>
              <div
                data-brand="makchic"
                className="bg-halftone relative grid aspect-[4/3] grid-cols-[1fr_44%] bg-mc-red p-5 text-white sm:p-7"
              >
                <div className="relative z-10 flex flex-col">
                  <p className="font-pop text-xs font-extrabold tracking-[0.2em] text-white uppercase">Mak &apos;Chic&apos; Keropok</p>
                  <p className="mt-2 font-script text-4xl leading-tight sm:text-5xl lg:text-6xl">Rangup. Sedap.</p>
                  <p className="mt-auto hidden font-pop text-sm text-white sm:block">5 snacks · cheesy, spicy &amp; classic</p>
                  <TransitionLink href="/mak-chic" className="mt-3 inline-flex items-center gap-1 font-pop text-sm font-semibold text-white underline-offset-4 hover:underline">
                    Explore Mak &apos;Chic&apos; →
                  </TransitionLink>
                </div>
                <StickerBadge className="absolute top-4 right-4 z-20 w-16 text-[0.55rem] sm:w-20 sm:text-xs" center={"RANGUP\nSEDAP"} />
                <Parallax offset={16} rotate={4} className="relative self-end">
                  <ProductImage src={rempeyek.image.src} alt="" width={300} height={380} sizes="(min-width: 768px) 20vw, 40vw" className="h-auto w-full drop-shadow-2xl" />
                </Parallax>
              </div>
            </ImageReveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="section-y bg-tb-aqua/60">
        <div className="container-page">
          <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
            <p className="eyebrow mb-3">What we stand for</p>
            <SplitText as="h2" id="values-title" text="Our values" className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-charcoal" />
            <DrawLine className="mx-auto mt-4" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.08}>
                <div className="h-full rounded-card border border-line bg-ivory p-5 md:p-6">
                  <span className="font-serif text-4xl text-tb-gold-ink italic">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 font-serif text-2xl text-charcoal">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Two columns: intro + visual on the left, the process on the right (no narrow centred column). */}
      <section aria-labelledby="process-title" className="section-y">
        <div className="container-page grid gap-8 md:gap-10 lg:grid-cols-2 lg:items-start">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <p className="eyebrow mb-3">In the kitchen</p>
            <SplitText as="h2" id="process-title" text="From rempah to pack" className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-charcoal" />
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted md:text-lg">
              Five steps, the same for every batch. The slow parts stay slow, because that is where the flavour comes from.
            </p>
            <ImageReveal className="mt-6 rounded-card">
              <div className="bg-batik-dots relative grid aspect-[16/9] grid-cols-3 items-end gap-2 bg-tb-aqua px-[6%] pt-[6%]">
                {[sambal, rendang, tempe].map((p, i) => (
                  <ProductImage
                    key={p.slug}
                    src={p.image.src}
                    alt=""
                    width={300}
                    height={380}
                    sizes="(min-width: 1024px) 14vw, 30vw"
                    className={i === 1 ? "h-auto w-full drop-shadow-xl" : "h-auto w-full translate-y-[8%] drop-shadow-xl"}
                  />
                ))}
              </div>
            </ImageReveal>
          </div>
          <KitchenTimeline />
        </div>
      </section>

      {/* Numbers and the closing call to action share one band. */}
      <section aria-label="RJS Foods in numbers" className="section-y bg-charcoal text-ivory">
        <div className="container-page grid items-center gap-8 md:gap-10 lg:grid-cols-[1.4fr_1fr]">
          <dl className="grid grid-cols-3 gap-4 text-center lg:text-left">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1 border-t border-ivory/15 pt-4">
                <dt className="text-xs text-ivory/75 sm:text-sm">{s.label}</dt>
                <dd className="font-serif text-5xl text-tb-gold md:text-7xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.5rem)] leading-none">Pull up a chair.</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <ButtonLink href="/shop" size="lg" className="!bg-tb-gold !text-tb-ink-deep">
                Shop the range <ArrowIcon />
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="outline" className="!text-ivory">
                Get in touch
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
