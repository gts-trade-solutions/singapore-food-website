import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { enquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { ContactForm } from "@/components/sections/contact/ContactForm";
import { ExternalButton, WhatsAppIcon } from "@/components/ui/Button";
import { BatikFlower } from "@/components/illustrations/Batik";
import { StickerBadge } from "@/components/illustrations/Snacks";

export const metadata = pageMetadata({
  title: "Contact, Wholesale & Stockists",
  description:
    "Get in touch with RJS Foods. Order or ask questions on WhatsApp, and enquire about wholesale pricing or stocking Tok Bah and Mak 'Chic' Keropok in Singapore.",
  path: "/contact",
});

const WHOLESALE_POINTS = [
  { title: "Retail & minimarts", body: "Shelf-ready packs from both brands with a mix that suits your customers." },
  { title: "Cafés & caterers", body: "Pastes and ready meals for consistent flavour on busy service days." },
  { title: "Corporate & festive gifting", body: "Hari Raya hampers and snack bundles for teams and clients." },
];

const QUICK = [
  { title: "Place an order", body: "Tell us what you'd like.", message: "Hi RJS Foods! I'd like to place an order." },
  { title: "Wholesale", body: "Trade pricing for your business.", message: enquiryMessage("wholesale") },
  { title: "Stock our brands", body: "Shops and minimarts.", message: enquiryMessage("stockist") },
  { title: "Events & gifting", body: "Raya hampers, parties, corporate.", message: "Hi RJS Foods! I'm planning an event / gifting order." },
];

// TODO: confirm the reply and delivery process.
const NEXT_STEPS = [
  "Send your message on WhatsApp or by email.",
  "We confirm items, total and a delivery slot.",
  "Your order arrives, ready to heat or snack.",
];

export default function ContactPage() {
  return (
    <div data-brand="rjs">
      <section aria-labelledby="contact-title" className="relative overflow-hidden section-top">
        <BatikFlower className="pointer-events-none absolute -top-20 -left-24 h-96 w-96 text-tb-gold opacity-10" />
        <div className="container-page relative grid gap-8 md:gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Hubungi kami · Contact</p>
            <SplitText
              as="h1"
              id="contact-title"
              by="line"
              immediate
              text={"Let's talk\nfood."}
              className="font-serif text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.95] text-charcoal"
            />
            <Reveal immediate delay={0.3}>
              <p className="mt-4 max-w-md text-base text-muted md:text-lg">
                The quickest way to reach us is WhatsApp. We usually reply within the day. {/* TODO: confirm reply time */}
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <MagneticButton>
                  <ExternalButton href={whatsappUrl(enquiryMessage("general"))} size="lg" className="!bg-[#1F7A4D] !text-white">
                    <WhatsAppIcon /> Chat on WhatsApp
                  </ExternalButton>
                </MagneticButton>
              </div>
              <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="eyebrow mb-1">Email</dt>
                  <dd>
                    <a href={`mailto:${siteConfig.email}`} className="text-base underline-offset-4 hover:underline">
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow mb-1">Based in</dt>
                  <dd className="text-base">{siteConfig.address}</dd>
                </div>
              </dl>
            </Reveal>

            {/* Quick enquiries: one tap opens WhatsApp with the right message. */}
            <Reveal immediate delay={0.4} className="mt-8">
              <h2 className="eyebrow mb-3">Quick enquiries</h2>
              <ul className="grid grid-cols-2 gap-3">
                {QUICK.map((q) => (
                  <li key={q.title}>
                    <a
                      href={whatsappUrl(q.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col gap-1 rounded-card border border-line bg-surface/70 p-4 transition-colors hover:border-charcoal/40"
                    >
                      <span className="font-serif text-xl leading-tight text-charcoal">{q.title}</span>
                      <span className="text-sm text-muted">{q.body}</span>
                      <span className="mt-auto pt-2 text-sm font-semibold text-[#1F7A4D]">Message us →</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal immediate delay={0.5} className="mt-8">
              <h2 className="eyebrow mb-3">What happens next</h2>
              <ol className="grid gap-3 sm:grid-cols-3">
                {NEXT_STEPS.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm text-muted sm:flex-col sm:gap-2">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tb-teal font-serif text-tb-ivory italic">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <Reveal immediate delay={0.15}>
            <div className="rounded-card border border-line bg-surface/60 p-5 md:p-8">
              <h2 className="mb-6 font-serif text-3xl text-charcoal">Send us a message</h2>
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section id="wholesale" aria-labelledby="wholesale-title" className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-tb-teal to-tb-forest section-y text-tb-ivory">
        <StickerBadge
          className="absolute -top-6 -right-6 hidden w-28 text-sm opacity-90 md:block lg:w-32"
          center={"STOCK\nUS!"}
          text="WHOLESALE · STOCKISTS · GIFTING · "
        />
        <div className="container-page relative">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:gap-10">
            <div>
              <p className="eyebrow mb-3 !text-tb-gold-light">Wholesale & stockists</p>
              <SplitText
                as="h2"
                id="wholesale-title"
                text="Put Tok Bah and Mak 'Chic' on your shelves."
                className="max-w-2xl font-serif text-[clamp(2.25rem,4.5vw,4rem)] leading-[1] italic"
              />
              <p className="mt-4 max-w-2xl text-base text-tb-ivory/85 md:text-lg">
                We work with shops, cafés, caterers and corporate buyers across Singapore. Tell us a little about your business and
                we&apos;ll send our trade price list.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ExternalButton href={whatsappUrl(enquiryMessage("wholesale"))} size="lg" className="!bg-tb-gold !text-tb-ink-deep">
                <WhatsAppIcon /> Wholesale enquiry
              </ExternalButton>
              <ExternalButton href={whatsappUrl(enquiryMessage("stockist"))} size="lg" variant="outline" className="!text-tb-ivory">
                Become a stockist
              </ExternalButton>
            </div>
          </div>
          <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 lg:gap-6">
            {WHOLESALE_POINTS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.1}>
                <div className="h-full border border-tb-gold/40 p-5 md:p-6">
                  <h3 className="font-serif text-2xl md:text-3xl">{p.title}</h3>
                  <p className="mt-2 text-tb-ivory/80">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          {/* TODO: list current stockists here once confirmed. */}
        </div>
      </section>
    </div>
  );
}
