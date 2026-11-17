import { NextResponse } from "next/server";

/**
 * Mollie calls this when a payment changes status. We look the payment up at Mollie (never trust the body)
 * and store it in the `payments` table. Mollie expects a 200 response.
 */
export async function POST(req: Request) {
  const key = process.env.MOLLIE_API_KEY;
  const form = await req.formData().catch(() => null);
  const id = form?.get("id");
  if (!key || typeof id !== "string") return new NextResponse("ok");

  const res = await fetch(`https://api.mollie.com/v2/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) return new NextResponse("ok");
  const p = await res.json();

  const url = process.env.SUPABASE_URL;
  const sk = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && sk) {
    await fetch(`${url}/rest/v1/payments?on_conflict=mollie_id`, {
      method: "POST",
      headers: { apikey: sk, Authorization: `Bearer ${sk}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ mollie_id: p.id, status: p.status, amount: p.amount?.value, event_id: p.metadata?.eventId, email: p.metadata?.email }),
    });
  }
  return new NextResponse("ok");
}
