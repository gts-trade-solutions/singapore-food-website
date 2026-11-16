"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button, WhatsAppIcon } from "@/components/ui/Button";
import { SplitText } from "@/components/motion/SplitText";
import { Chilli, Peanut } from "@/components/illustrations/Snacks";
import { BatikFlower } from "@/components/illustrations/Batik";

type Status = "idle" | "loading" | "success" | "unavailable" | "error";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus("success");
      else if (res.status === 503) setStatus("unavailable");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section aria-labelledby="newsletter-title" className="relative z-10 overflow-hidden bg-gradient-to-r from-tb-teal to-mc-red section-y text-ivory">
      <BatikFlower className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 text-tb-gold opacity-20" />
      <Chilli className="pointer-events-none absolute top-10 right-[8%] hidden w-14 rotate-12 md:block" />
      <Peanut className="pointer-events-none absolute right-[18%] bottom-10 hidden w-10 -rotate-12 md:block" />
      <div className="container-page relative mx-auto max-w-3xl text-center">
        <p className="eyebrow mb-4 !text-white">Jom join · Stay in the loop</p>
        <SplitText
          as="h2"
          id="newsletter-title"
          text="New flavours, first."
          className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-none italic"
        />
        <p className="mx-auto mt-5 max-w-lg text-ivory/85">
          Launches, Hari Raya bundles and the occasional family recipe. No spam, just good food.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.p
              key="ok"
              role="status"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 font-serif text-3xl italic"
            >
              Terima kasih! You&apos;re on the list.
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-13 flex-1 rounded-full border-2 border-ivory/40 bg-ivory/10 px-6 text-ivory placeholder:text-ivory/60 focus-visible:border-ivory focus-visible:outline-none"
              />
              <Button type="submit" size="lg" className="!bg-ivory !text-charcoal" disabled={status === "loading"}>
                {status === "loading" ? "Joining…" : "Join"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div aria-live="polite" className="mt-4 min-h-6 text-sm">
          {status === "unavailable" && (
            <p>
              Email sign-ups open soon.{" "}
              <a
                className="inline-flex items-center gap-1 font-semibold underline underline-offset-4"
                href={whatsappUrl("Hi RJS Foods! Please let me know about new launches.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-4 w-4" /> Get updates on WhatsApp
              </a>
            </p>
          )}
          {status === "error" && <p>Something went wrong. Please try again in a moment.</p>}
        </div>
      </div>
    </section>
  );
}
