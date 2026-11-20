import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";

/** Daily (Vercel cron): deletes data past the retention terms in the privacy statement. Only removes old rows, so it is safe to call. */
export async function GET() {
  const r = await rpc<Record<string, number>>("cleanup_old_data", {});
  return NextResponse.json(r ?? { error: "failed" }, { headers: { "Cache-Control": "no-store" } });
}
