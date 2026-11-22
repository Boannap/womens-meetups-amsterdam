import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";

/** Taken seats and open tables per event (counts only, no personal data). Cached for a minute. */
export async function GET() {
  const data = await rpc<{ seats: Record<string, number>; open: Record<string, number> }>("public_seats", {});
  return NextResponse.json(data ?? { seats: {}, open: {} }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
