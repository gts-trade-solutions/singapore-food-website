"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/lib/config";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/Button";

const TOPICS = [
  { value: "general", label: "General question" },
  { value: "order", label: "An existing order" },
  { value: "wholesale", label: "Wholesale pricing" },
  { value: "stockist", label: "Becoming a stockist" },
  { value: "events", label: "Events & catering" },
];

const field =
  "w-full rounded-xl border border-line bg-ivory px-4 py-3 text-ink placeholder:text-muted/70 focus-visible:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)]";

/**
 * No backend needed: the form composes a message and hands it to WhatsApp (default)
 * or the visitor's email app. Nothing is stored on this site.
 */
export function ContactForm({ defaultTopic = "general" }: { defaultTopic?: string }) {
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setError("Please fill in the required fields.");
      form.reportValidity();
      return;
    }
    setError(null);
    const data = new FormData(form);
    const topic = TOPICS.find((t) => t.value === data.get("topic"))?.label ?? "General question";
    const lines = [
      `Hi RJS Foods! (${topic})`,
      "",
      String(data.get("message") ?? ""),
      "",
      `Name: ${data.get("name")}`,
      data.get("company") ? `Business: ${data.get("company")}` : "",
      data.get("email") ? `Email: ${data.get("email")}` : "",
      data.get("phone") ? `Phone: ${data.get("phone")}` : "",
    ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "");
    const text = lines.join("\n");

    if (channel === "whatsapp") {
      window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
    } else {
      window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Enquiry: ${topic}`)}&body=${encodeURIComponent(text)}`;
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="c-name" className="mb-2 block text-sm font-semibold">
          Name <span aria-hidden="true">*</span>
        </label>
        <input id="c-name" name="name" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="c-company" className="mb-2 block text-sm font-semibold">
          Business name <span className="font-normal text-muted">(optional)</span>
        </label>
        <input id="c-company" name="company" autoComplete="organization" className={field} />
      </div>
      <div>
        <label htmlFor="c-email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <input id="c-email" name="email" type="email" autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="c-phone" className="mb-2 block text-sm font-semibold">
          Phone
        </label>
        <input id="c-phone" name="phone" type="tel" autoComplete="tel" placeholder="+65" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-topic" className="mb-2 block text-sm font-semibold">
          What&apos;s it about?
        </label>
        <select id="c-topic" name="topic" defaultValue={defaultTopic} className={field}>
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="mb-2 block text-sm font-semibold">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea id="c-message" name="message" required rows={5} className={field} />
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-sm font-semibold">Send it via</legend>
        <div className="flex flex-wrap gap-3">
          {(["whatsapp", "email"] as const).map((c) => (
            <label key={c} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-4 has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-bg has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-[var(--brand-focus)]">
              <input type="radio" name="channel" value={c} checked={channel === c} onChange={() => setChannel(c)} className="sr-only" />
              {c === "whatsapp" ? "WhatsApp" : "Email"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-button bg-brand px-8 font-semibold whitespace-nowrap text-brand-ink transition-transform active:scale-[0.97]"
        >
          {channel === "whatsapp" && <WhatsAppIcon />}
          {channel === "whatsapp" ? "Continue in WhatsApp" : "Open my email app"}
        </button>
        <p className="text-sm text-muted">Fields marked * are required. Nothing is stored on this website.</p>
      </div>
      <p role="alert" className="text-sm font-semibold text-mc-red-ink sm:col-span-2">
        {error}
      </p>
    </form>
  );
}
