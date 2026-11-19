import { NextResponse } from "next/server";
import { baseUrl, absUrl, ROUTES, PRICE_EUR } from "@/lib/site";

/**
 * STEP 2 (later): Mollie payment for one seat.
 * POST { eventId, email, lang } -> { checkoutUrl }. The site then sends the visitor to Mollie (iDEAL / Wero, cards).
 * Needs MOLLIE_API_KEY. Start with a test_ key; nothing is charged in test mode.
 * Not wired into the form yet: first collect sign-ups, then switch on paying.
 */
export async function POST(req: Request) {
  const key = process.env.MOLLIE_API_KEY;
  if (!key) return NextResponse.json({ error: "Mollie not configured yet" }, { status: 501 });

  const { eventId, email, lang } = (await req.json().catch(() => ({}))) as { eventId?: string; email?: string; lang?: string };
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 422 });

  const l = lang === "nl" ? "nl" : "en";
  const home = absUrl(l, ROUTES.home[l]);
  const res = await fetch("https://api.mollie.com/v2/payments", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: { currency: "EUR", value: PRICE_EUR },
      description: `Table of Six ${eventId} · €12.50 incl. €2.17 VAT and €0.32 service costs, first coffee on us`,
      redirectUrl: `${home}?paid=1#join`,
      webhookUrl: `${baseUrl(l)}/api/mollie-webhook`,
      locale: lang === "nl" ? "nl_NL" : "en_GB",
      metadata: { eventId, email },
    }),
  });
  const data = await res.json();
  if (!res.ok) return NextResponse.json({ error: data?.detail ?? "Mollie error" }, { status: 502 });
  return NextResponse.json({ checkoutUrl: data._links?.checkout?.href, id: data.id });
}
