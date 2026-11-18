import { NextResponse } from "next/server";
import { quizType } from "@/lib/quiz";

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
  const row = {
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
  return NextResponse.json({ ok: true, stored: true });
}
