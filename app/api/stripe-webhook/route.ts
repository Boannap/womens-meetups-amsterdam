import { NextResponse } from "next/server";
import { verifyStripeSignature } from "@/lib/stripe";
import { notifySignup } from "@/lib/notify";

/**
 * Stripe calls this after a checkout. We check the signature (STRIPE_WEBHOOK_SECRET) and then mark the sign-up as paid
 * through the database function mark_signup_paid (needs PAYMENT_WEBHOOK_TOKEN). Only Boanna's own inbox gets a short note.
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
    const res = (await r.json().catch(() => null)) as { ok?: boolean; new?: boolean; event_id?: string; paid?: number; open_tables?: number; person?: Parameters<typeof notifySignup>[2] } | null;
    // A table just filled up (6, 12, 18...): one short note to Boanna's own inbox, nobody else.
    // Every new payment: one note to Boanna's own inbox (with a "table full" line at 6, 12, 18...). Nobody else gets mail from here.
    if (res?.ok && res.new) await notifySignup("paid", res.event_id ?? "", res.person ?? {}, res.paid && res.paid % 6 === 0 ? { paid: res.paid, open: res.open_tables ?? 1 } : undefined);
  }
  return NextResponse.json({ received: true });
}
