import { NextResponse } from "next/server";
import { insert } from "@/lib/supa";

/** Contact form. Saved in Supabase (insert-only), shown in the dashboard. Nothing is e-mailed. */
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (str(b.website)) return NextResponse.json({ ok: true });
  const row = { name: str(b.name, 80), email: str(b.email, 160).toLowerCase(), topic: str(b.topic, 20), message: str(b.message, 3000), lang: b.lang === "en" ? "en" : "nl" };
  if (!row.name || !row.message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) return NextResponse.json({ error: "missing" }, { status: 400 });
  const ok = await insert("contact_messages", [row]);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "save failed" }, { status: 500 });
}
