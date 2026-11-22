import { NextResponse } from "next/server";
import { quizType } from "@/lib/quiz";
import { rpc } from "@/lib/supa";
import { stripe } from "@/lib/stripe";
import { absUrl, ROUTES, PRICE_EUR } from "@/lib/site";

/**
 * Saves a sign-up in Supabase (table `signups`, see supabase/schema.sql).
 * Uses the PUBLISHABLE key: the database only lets it ADD rows with consent (RLS insert-only policy),
 * never read, change or delete. Without SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY it only logs.
 * Nothing is emailed from here: you decide yourself when and how to contact people.
 */
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 10).map((x) => x.slice(0, 80)) : []);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "website" field.
  if (str(body.website)) return NextResponse.json({ ok: true });

  const quizAnswers = Array.isArray(body.quiz) ? body.quiz.slice(0, 5).map((a) => (typeof a === "number" ? a : null)) : [];
  const contactPref = body.contact_pref === "email" ? "email" : "whatsapp_email";
  // Friend discount: only if this e-mail belongs to the group (inviter or invited friend) and the date matches.
  let discount = 0, refGroup: string | null = null;
  const g = typeof body.ref_group === "string" && /^[0-9a-f-]{36}$/i.test(body.ref_group) ? body.ref_group : null;
  if (g && body.waitlist !== true) {
    const v = await rpc<{ ok: boolean; pct?: number; event_id?: string }>("referral_validate", { p_group: g, p_email: str(body.email, 160) });
    if (v?.ok && v.event_id === str(body.event_id, 20)) { discount = v.pct ?? 0; refGroup = g; }
  }
  const payNow = !!process.env.STRIPE_SECRET_KEY && body.waitlist !== true;
  const row = {
    id: crypto.randomUUID(),
    needs_payment: payNow,
    name: str(body.name, 80),
    email: str(body.email, 160).toLowerCase(),
    age: str(body.age, 20),
    language: str(body.language, 40),
    neighbourhood: str(body.neighbourhood, 60),
    personality: quizType(quizAnswers) ?? "",
    quiz: quizAnswers,
    phone: contactPref === "whatsapp_email" ? str(body.phone, 24).replace(/[^+0-9 ()-]/g, "") : "",
    contact_pref: contactPref,
    whatsapp_consent: contactPref === "whatsapp_email" && body.whatsapp_consent === true,
    field: str(body.field, 80),
    hoping: list(body.hoping),
    days: list(body.days),
    instagram: str(body.instagram, 60),
    site_lang: body.site_lang === "nl" ? "nl" : "en",
    event_id: str(body.event_id, 20),
    waitlist: body.waitlist === true,
    found_via: str(body.found_via, 40),
    table_wish: str(body.table_wish, 500),
    form_ease: str(body.form_ease, 40),
    consent: body.consent === true,
    newsletter: body.newsletter === true,
    photo_ok: body.photo_ok === true,
    discount_pct: discount || null,
    referral_group: refGroup,
  };

  if (!row.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email) || !row.consent || !row.personality
    || (row.contact_pref === "whatsapp_email" && (row.phone.replace(/\D/g, "").length < 8 || !row.whatsapp_consent))) {
    return NextResponse.json({ error: "missing fields" }, { status: 422 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("[signup] Supabase not configured yet, received:", { ...row, email: "***" });
    return NextResponse.json({ ok: true, stored: false });
  }

  const res = await fetch(`${url}/rest/v1/signups`, {
    method: "POST",
    // New-style keys (sb_...) go in the apikey header only; legacy JWT keys also as Bearer.
    headers: { apikey: key, ...(key.startsWith("sb_") ? {} : { Authorization: `Bearer ${key}` }), "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    console.error("[signup] Supabase error", res.status, await res.text());
    return NextResponse.json({ error: "could not save" }, { status: 502 });
  }
  if (!payNow) return NextResponse.json({ ok: true, stored: true });

  // Seat (not waitlist): send her to Stripe Checkout (iDEAL/Wero, cards, Apple Pay). The webhook marks the sign-up as paid.
  const l = row.site_lang === "nl" ? "nl" : "en";
  const home = absUrl(l, ROUTES.home[l]);
  try {
    const session = await stripe<{ url: string }>("checkout/sessions", {
      mode: "payment",
      // Only iDEAL/Wero and cards (cards include Apple Pay and Google Pay). No Klarna etc.
      payment_method_types: { 0: "ideal", 1: "card" },
      client_reference_id: row.id,
      customer_email: row.email,
      locale: l,
      line_items: { 0: { quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(Number(PRICE_EUR) * 100 * (100 - discount) / 100),
        product_data: { name: l === "nl" ? `Plek aan een tafel van zes (${row.event_id})` : `Seat at a Table of Six (${row.event_id})`,
          description: (l === "nl" ? "Inclusief je eerste koffie, host en vragenkaartjes" : "Includes your first coffee, a host and question cards") + (discount ? (l === "nl" ? ` · ${discount}% vriendinnenkorting` : ` · ${discount}% friends discount`) : "") } } } },
      metadata: { signup_id: row.id, event_id: row.event_id },
      payment_intent_data: { metadata: { signup_id: row.id, event_id: row.event_id } },
      success_url: `${home}?paid=1${refGroup ? `&g=${refGroup}` : ""}#join`,
      cancel_url: `${home}?cancelled=1#join`,
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
    });
    return NextResponse.json({ ok: true, stored: true, checkout_url: session.url });
  } catch (e) {
    console.error("[signup] Stripe error", e);
    return NextResponse.json({ error: "payment unavailable" }, { status: 502 });
  }
}
