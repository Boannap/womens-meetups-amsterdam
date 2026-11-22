import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";

/**
 * Stripe calls this after a checkout. We check the signature (STRIPE_WEBHOOK_SECRET) and then mark the sign-up as paid
 * through the database function mark_signup_paid (needs PAYMENT_WEBHOOK_TOKEN). Nothing is e-mailed from here.
 * Events: checkout.session.completed and checkout.session.async_payment_succeeded.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();
  if (!secret || !verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }
  const evt = JSON.parse(raw);
  const s = evt?.data?.object;
  const done = (evt.type === "checkout.session.completed" && s?.payment_status === "paid") || evt.type === "checkout.session.async_payment_succeeded";
  if (done && s?.client_reference_id) {
    const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/mark_signup_paid`, {
      method: "POST",
      headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({ p_id: s.client_reference_id, p_session: s.id, p_amount: s.amount_total ?? null, p_token: process.env.PAYMENT_WEBHOOK_TOKEN ?? "" }),
    });
    if (!r.ok) {
      console.error("[stripe-webhook] mark paid failed", r.status, await r.text());
      return NextResponse.json({ error: "db" }, { status: 500 });
    }
    const res = (await r.json().catch(() => null)) as { ok?: boolean; new?: boolean; event_id?: string; paid?: number; open_tables?: number } | null;
    // A table just filled up (6, 12, 18...): one short note to Boanna's own inbox, nobody else.
    if (res?.ok && res.new && res.paid && res.paid % 6 === 0) await notifyTableFull(res.event_id ?? "", res.paid, res.open_tables ?? 1);
  }
  return NextResponse.json({ received: true });
}

async function notifyTableFull(eventId: string, paid: number, open: number) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const full = paid >= open * 6;
  const text = [
    `Hoi Boanna!`,
    ``,
    `Er hebben nu ${paid} meiden betaald voor ${eventId}. Tafel ${paid / 6} is vol. 🎉`,
    full
      ? `Alle ${open} open tafel(s) zijn vol, dus nieuwe aanmeldingen komen nu op de wachtlijst.${open < 4 ? " Wil je een tafel erbij? Dat doe je in je dashboard bij \"Tafels per datum\" (maximaal 4)." : " Dit is het maximum van 4 tafels."}`
      : `Er staan nog plekken open aan de volgende tafel.`,
    ``,
    `Dashboard: https://womensmeetupsinamsterdam.com/dashboard`,
  ].join("\n");
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: "Women's Meetups site <hello@womensmeetupsinamsterdam.com>", to: ["hello@womensmeetupsinamsterdam.com"], subject: `Tafel vol: ${eventId} (${paid} meiden)`, text }),
  }).catch((e) => console.error("[notify]", e));
}
