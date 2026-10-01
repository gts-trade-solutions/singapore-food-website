import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { DrawLine } from "@/components/motion/DrawLine";
import { Counter } from "@/components/motion/Counter";
import { BatikFlower } from "@/components/illustrations/Batik";

const PILLARS = [
  {
    title: "Rempah first",
    body: "Spices are ground and sautéed until fragrant and deep red. It is the step that makes or breaks a Malay dish, so we never rush it.",
  },
  {
    title: "Patience in the pot",
    body: "Rendang reduces until the sauce clings; kicap simmers until it turns glossy. Time is an ingredient, too.",
  },
  {
    title: "Ready when you are",
    body: "Sealed at its best, so a proper Nusantara meal is ten minutes away on a busy weeknight.",
  },
];

export function HeritageStory() {
  return (
    <section aria-labelledby="heritage-title" className="relative overflow-hidden bg-tb-teal section-y text-tb-ivory">
      <BatikFlower className="pointer-events-none absolute -bottom-32 -left-32 h-[30rem] w-[30rem] text-tb-gold opacity-10" />
      <div className="container-page relative grid items-center gap-8 md:gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-5 !text-tb-gold-light">Our heritage</p>
          <SplitText
            as="h2"
            id="heritage-title"
            text="Recipes passed down, never watered down."
            className="text-[clamp(2.5rem,5vw,4.75rem)] leading-[1] italic"
          />
          <DrawLine className="mt-5 !max-w-xs" />
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-tb-ivory/85 md:text-lg">
              {/* TODO: confirm the real story behind the Tok Bah name. */}
              Tok Bah is named for the grandparent at the heart of every kampung kitchen, the one who knew the recipe by smell and
              never wrote it down. We wrote it down, then cooked it again and again until it tasted right.
            </p>
          </Reveal>
          <dl className="mt-8 grid max-w-md grid-cols-2 gap-6">
            <div className="flex flex-col-reverse border-t border-tb-gold/40 pt-4">
              <dt className="text-sm text-tb-ivory/75">Ready meals & pastes</dt>
              <dd className="font-serif text-5xl text-tb-gold">
                <Counter value={4} />
              </dd>
            </div>
            <div className="flex flex-col-reverse border-t border-tb-gold/40 pt-4">
              <dt className="text-sm text-tb-ivory/75">Minutes to the table</dt>
              <dd className="font-serif text-5xl text-tb-gold">
                <Counter value={10} />
              </dd>
            </div>
          </dl>
        </div>

        <ol className="space-y-4">
          {PILLARS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.12}>
              <div className="relative grid grid-cols-[auto_1fr] gap-6 border border-tb-gold/30 bg-tb-ivory/5 p-5 md:p-7">
                <span className="font-serif text-5xl leading-none text-tb-gold italic">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-3xl">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-tb-ivory/80">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
