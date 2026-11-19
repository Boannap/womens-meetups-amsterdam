import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";

/** One-tap answers from the review e-mail: /api/review?r=<signup id>&q=rating&v=5&l=nl */
const UUID = /^[0-9a-f-]{36}$/i;
export async function GET(req: Request) {
  const u = new URL(req.url);
  const r = u.searchParams.get("r") || "", q = u.searchParams.get("q") || "", v = u.searchParams.get("v") || "";
  const l = u.searchParams.get("l") === "en" ? "en" : "nl";
  let ok = false;
  if (UUID.test(r) && ["rating", "match", "again", "best"].includes(q) && v.length <= 10) ok = !!(await rpc<boolean>("submit_review", { p_token: r, p_q: q, p_v: v }));
  return NextResponse.redirect(new URL(`/review?r=${encodeURIComponent(r)}&l=${l}&saved=${ok ? 1 : 0}`, u.origin), 303);
}
