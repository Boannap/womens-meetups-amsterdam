import { NextResponse } from "next/server";
import { insert } from "@/lib/supa";

/** Receives batched, cookie-free page events from components/Tracker.tsx and stores them in site_events. */
const TYPES = new Set(["view", "scroll", "section", "click", "time", "form", "exp"]);
const s = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : null);

export async function POST(req: Request) {
  let body: { sid?: unknown; path?: unknown; lang?: unknown; device?: unknown; ref?: unknown; utm?: unknown; events?: unknown };
  try { body = JSON.parse(await req.text()); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const base = {
    sid: s(body.sid, 40), path: s(body.path, 120), lang: body.lang === "nl" ? "nl" : "en",
    device: ["mobile", "tablet", "desktop"].includes(body.device as string) ? body.device : null,
    ref: s(body.ref, 120), utm: s(body.utm, 120),
  };
  const evs = Array.isArray(body.events) ? body.events.slice(0, 60) : [];
  const rows = evs
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object" && TYPES.has((e as Record<string, unknown>).type as string))
    .map((e) => ({ ...base, type: e.type, label: s(e.label, 80), value: typeof e.value === "number" && isFinite(e.value) ? Math.round(e.value * 10) / 10 : null, variant: s(e.variant, 20) }));
  await insert("site_events", rows);
  return NextResponse.json({ ok: true });
}
