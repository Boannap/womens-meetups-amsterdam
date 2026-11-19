import { NextResponse } from "next/server";
import { insert } from "@/lib/supa";

/** Partner request from a café. Saved in Supabase (insert-only), shown in the dashboard. Nothing is e-mailed. */
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (str(b.website)) return NextResponse.json({ ok: true });
  const row = {
    cafe: str(b.cafe, 120), contact: str(b.contact, 80), email: str(b.email, 160).toLowerCase(),
    phone: str(b.phone, 24).replace(/[^+0-9 ()-]/g, ""), neighbourhood: str(b.neighbourhood, 60), link: str(b.link, 160),
    package: str(b.package, 20), message: str(b.message, 1500), lang: b.lang === "en" ? "en" : "nl",
  };
  if (!row.cafe || !row.contact || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) return NextResponse.json({ error: "missing" }, { status: 400 });
  const ok = await insert("partner_requests", [row]);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "save failed" }, { status: 500 });
}
