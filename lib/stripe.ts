import crypto from "node:crypto";

/** Tiny Stripe client without extra packages: form-encoded REST calls + webhook signature check. Needs STRIPE_SECRET_KEY. */
function encode(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v === undefined || v === null) return [];
    if (typeof v === "object") return encode(v as Record<string, unknown>, key);
    return [`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`];
  });
}

export async function stripe<T = Record<string, unknown>>(path: string, params: Record<string, unknown>): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY missing");
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: encode(params).join("&"),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `Stripe ${res.status}`);
  return data as T;
}

/** Checks the Stripe-Signature header (t=...,v1=...) against the raw body. Max 5 minutes old. */
export function verifyStripeSignature(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const t = Number(header.split(",").find((p) => p.startsWith("t="))?.slice(2));
  if (!t || Math.abs(Date.now() / 1000 - t) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${t}.${raw}`).digest("hex");
  return header.split(",").filter((p) => p.startsWith("v1=")).map((p) => p.slice(3))
    .some((s) => s.length === expected.length && crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected)));
}
