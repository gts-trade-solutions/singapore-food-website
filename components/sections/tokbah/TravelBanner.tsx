import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { DrawLine } from "@/components/motion/DrawLine";
import { ButtonLink, ArrowIcon } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";

const POSTER = {
  src: "/images/tok-bah-travel-poster.webp",
  width: 1024,
  height: 1536,
  alt:
    "Tok Bah poster, Citarasa Nusantara: the five Tok Bah packs (Nasi Putih Basmathi, Ayam Masak Kicap, Rendang Daging, " +
    "Pes Sambal Tumis and Pes Rendang) packed in a suitcase. Teman Perjalanan Anda, mudah dibawa ke mana sahaja: no fridge " +
    "needed before opening, easy to carry, can be stored at room temperature, easy and tasty meals.",
};

type Perk = { en: string; ms: string; icon: "fridge" | "case" | "leaf" | "dish" };

/** The four promises printed on the poster, in English with the Malay underneath. */
const PERKS: Perk[] = [
  { en: "No fridge needed before opening", ms: "Tak perlu peti sejuk sebelum dibuka", icon: "fridge" },
  { en: "Easy to carry", ms: "Mudah dibawa", icon: "case" },
  { en: "Can be stored at room temperature", ms: "Boleh disimpan pada suhu bilik", icon: "leaf" },
  { en: "Easy, tasty meals", ms: "Hidangan yang mudah dan lazat", icon: "dish" },
];

function PerkIcon({ name }: { name: Perk["icon"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" {...common}>
      {name === "fridge" && (
        <>
          <rect x="6.5" y="3" width="11" height="18" rx="1.5" />
          <path d="M6.5 10h11M9 6v2M9 13v3" />
          <path d="M4 20 20 4" />
        </>
      )}
      {name === "case" && (
        <>
          <rect x="6" y="7" width="12" height="13" rx="2" />
          <path d="M9.5 7V4.5h5V7M10 11v5M14 11v5M8.5 20v1.5M15.5 20v1.5" />
        </>
      )}
      {name === "leaf" && (
        <>
          <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14Z" />
          <path d="M5 19 13 11" />
        </>
      )}
      {name === "dish" && (
        <>
          <path d="M8 3v6a2 2 0 0 1-4 0V3M6 9v12" />
          <path d="M17 21V3c-2 1-3.5 3.5-3.5 7 0 2 1 3 3.5 3" />
        </>
      )}
    </svg>
  );
}

/**
 * "Teman Perjalanan Anda": the client's Tok Bah travel poster, framed in the Tok Bah gold-corner motif,
 * with its four promises written out beside it (readable at any size and by screen readers).
 * On phones the order is heading, poster, promises; on desktop the poster sits on the left.
 */
export function TravelBanner() {
  return (
    <section aria-labelledby="tb-travel-title" className="relative overflow-hidden bg-tb-mist section-y">
      <div className="container-page grid items-center gap-8 md:gap-10 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-x-16 lg:gap-y-8">
        <div className="lg:col-start-2 lg:self-end">
          <p className="eyebrow mb-4">Teman Perjalanan Anda</p>
          <SplitText
            as="h2"
            id="tb-travel-title"
            text="Your travel companion"
            className="text-[clamp(2.5rem,5vw,4.5rem)] leading-none text-tb-teal"
          />
          <DrawLine className="mt-5 !max-w-xs" />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted md:text-lg">
              <span lang="ms" className="font-serif text-xl text-tb-teal italic md:text-2xl">
                Rasa tradisi, di mana sahaja.
              </span>{" "}
              Traditional flavour wherever you are. Tok Bah packs slip into a suitcase or a work bag, ready when you are.
            </p>
          </Reveal>
        </div>

        <Reveal className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <figure className="relative mx-auto w-full max-w-md p-3 md:p-4 lg:max-w-[30rem]">
            {/* Gold frame with corner accents, as on the Tok Bah labels. */}
            <span aria-hidden="true" className="absolute inset-0 border border-tb-gold/60" />
            <span aria-hidden="true" className="absolute -top-1 -left-1 h-4 w-4 border-t-2 border-l-2 border-tb-gold" />
            <span aria-hidden="true" className="absolute -right-1 -bottom-1 h-4 w-4 border-r-2 border-b-2 border-tb-gold" />
            <a
              href={POSTER.src}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-card shadow-lift"
            >
              <ProductImage
                src={POSTER.src}
                alt={POSTER.alt}
                width={POSTER.width}
                height={POSTER.height}
                sizes="(min-width: 1024px) 30rem, (min-width: 768px) 28rem, 92vw"
                className="block h-auto w-full transition-transform duration-700 ease-brand group-hover:scale-[1.02]"
              />
              <span className="sr-only"> (opens the full-size poster in a new tab)</span>
            </a>
          </figure>
        </Reveal>

        <div className="lg:col-start-2 lg:self-start">
          <ul className="grid gap-3 sm:grid-cols-2">
            {PERKS.map((p, i) => (
              <Reveal as="li" key={p.en} delay={i * 0.08} className="flex items-start gap-3 rounded-card bg-tb-ivory p-4 shadow-card">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-tb-gold/60 text-tb-teal">
                  <PerkIcon name={p.icon} />
                </span>
                <span>
                  <span className="block leading-snug font-semibold text-ink">{p.en}</span>
                  <span lang="ms" className="mt-0.5 block text-sm text-muted italic">
                    {p.ms}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href="#tb-products" size="lg">
              Shop the range <ArrowIcon />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
