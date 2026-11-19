import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as { r?: string; comment?: string; quote_ok?: boolean };
  if (!b.r || !/^[0-9a-f-]{36}$/i.test(b.r) || typeof b.comment !== "string" || !b.comment.trim()) return NextResponse.json({ ok: false }, { status: 422 });
  const ok = await rpc<boolean>("submit_review_text", { p_token: b.r, p_comment: b.comment.trim().slice(0, 600), p_quote_ok: b.quote_ok === true });
  return NextResponse.json({ ok: !!ok });
}
