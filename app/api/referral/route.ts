import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";

/**
 * Friend discount. GET ?token=<signup id> checks someone's personal link (from the review mail),
 * GET ?group=<id> shows a friend her invite (discount + date), POST {token, event, emails} starts a group.
 * The discount itself is only applied server-side in /api/signup.
 */
const uuid = (v: unknown) => (typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v) ? v : null);

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const token = uuid(q.get("token")), group = uuid(q.get("group"));
  if (token) return NextResponse.json((await rpc("referral_check", { p_token: token })) ?? { ok: false });
  if (group) return NextResponse.json((await rpc("referral_info", { p_group: group })) ?? { ok: false });
  return NextResponse.json({ ok: false }, { status: 400 });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { token?: string; event?: string; emails?: unknown; together?: boolean };
  const token = uuid(b.token);
  const emails = Array.isArray(b.emails) ? b.emails.filter((e): e is string => typeof e === "string" && !!e.trim()).slice(0, 2) : [];
  if (!token || !b.event || !emails.length) return NextResponse.json({ ok: false, reason: "count" }, { status: 422 });
  const r = await rpc<Record<string, unknown>>("referral_start", { p_token: token, p_event: String(b.event).slice(0, 20), p_emails: emails, p_together: b.together !== false });
  return NextResponse.json(r ?? { ok: false });
}
