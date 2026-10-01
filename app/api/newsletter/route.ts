import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter sign-up.
 * Set NEWSLETTER_WEBHOOK_URL (server-only) to forward sign-ups as JSON `{ email, source }`
 * to your provider (a Zapier/Make webhook, Mailchimp via a small function, etc.).
 * Without it, the endpoint answers 503 and the form points people to WhatsApp instead,
 * so nobody is told they subscribed when they did not.
 */
export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ error: "Newsletter not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "rjsfoods.sg" }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter webhook failed", error);
    return NextResponse.json({ error: "Could not sign up right now." }, { status: 502 });
  }
}
