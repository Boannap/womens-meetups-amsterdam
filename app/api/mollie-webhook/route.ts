import { NextResponse } from "next/server";
import { mollie } from "@/lib/mollie";

/**
 * Mollie calls this with only a payment id when a payment changes status. We never trust the body:
 * we look the payment up at Mollie ourselves, and if it is paid we mark the sign-up as paid through the
 * database function mark_signup_paid (needs PAYMENT_WEBHOOK_TOKEN). Nothing is e-mailed from here.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const id = form?.get("id");
  if (typeof id !== "string" || !process.env.MOLLIE_API_KEY) return new NextResponse("ok");

  const p = await mollie<{ id: string; status: string; amount?: { value: string }; metadata?: { signup_id?: string } }>(`payments/${encodeURIComponent(id)}`).catch(() => null);
  if (p?.status === "paid" && p.metadata?.signup_id) {
    const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/mark_signup_paid`, {
      method: "POST",
      headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({ p_id: p.metadata.signup_id, p_session: p.id, p_amount: Math.round(Number(p.amount?.value ?? 0) * 100), p_token: process.env.PAYMENT_WEBHOOK_TOKEN ?? "" }),
    });
    if (!r.ok) {
      console.error("[mollie-webhook] mark paid failed", r.status, await r.text());
      return new NextResponse("retry", { status: 500 });
    }
  }
  return new NextResponse("ok");
}
