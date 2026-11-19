import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";
import { gsc } from "@/lib/gsc";

/** Password-protected stats. The password is checked inside the database (bcrypt), never stored in the site. */
export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { password?: string; days?: number; approve?: { id: string; approved: boolean } };
  if (!b.password) return NextResponse.json({ error: "wrong password" }, { status: 401 });
  if (b.approve) {
    const ok = await rpc<boolean>("dashboard_approve", { p_password: b.password, p_review: b.approve.id, p_approved: b.approve.approved });
    return NextResponse.json({ ok: !!ok });
  }
  const data = await rpc<Record<string, unknown>>("dashboard_stats", { p_password: b.password, p_days: Math.min(365, Math.max(1, Number(b.days) || 30)) });
  if (!data || data.error) return NextResponse.json({ error: "wrong password" }, { status: 401 });
  const days = Math.min(365, Math.max(1, Number(b.days) || 30));
  const [extra, google, partners] = await Promise.all([
    rpc<Record<string, unknown>>("dashboard_extra", { p_password: b.password, p_days: days }),
    gsc(days).catch(() => null),
    rpc<unknown[]>("dashboard_partners", { p_password: b.password }),
  ]);
  return NextResponse.json({ ...data, extra: extra ?? {}, google, partners: Array.isArray(partners) ? partners : [] }, { headers: { "Cache-Control": "no-store" } });
}
