import { NextResponse } from "next/server";

/**
 * Saves a sign-up in Supabase (table `signups`, see supabase/schema.sql).
 * Without SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY it only logs, so the site works before Supabase is set up.
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

  const row = {
    name: str(body.name, 80),
    email: str(body.email, 160).toLowerCase(),
    age: str(body.age, 20),
    language: str(body.language, 40),
    neighbourhood: str(body.neighbourhood, 60),
    personality: str(body.personality, 40),
    field: str(body.field, 80),
    hoping: list(body.hoping),
    days: list(body.days),
    instagram: str(body.instagram, 60),
    site_lang: body.site_lang === "nl" ? "nl" : "en",
    consent: body.consent === true,
  };

  if (!row.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email) || !row.consent) {
    return NextResponse.json({ error: "missing fields" }, { status: 422 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("[signup] Supabase not configured yet, received:", { ...row, email: "***" });
    return NextResponse.json({ ok: true, stored: false });
  }

  const res = await fetch(`${url}/rest/v1/signups`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    console.error("[signup] Supabase error", res.status, await res.text());
    return NextResponse.json({ error: "could not save" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, stored: true });
}
