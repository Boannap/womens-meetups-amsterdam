import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";

/** Paid seats per event (counts only, no personal data). Cached for a minute. */
export async function GET() {
  const data = await rpc<Record<string, number>>("public_seats", {});
  return NextResponse.json(data ?? {}, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
