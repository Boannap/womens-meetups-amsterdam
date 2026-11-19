import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";

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
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
