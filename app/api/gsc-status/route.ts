import { NextResponse } from "next/server";
import { gsc } from "@/lib/gsc";

/** Alleen: werkt de Google-koppeling? Geen cijfers. */
export async function GET() {
  const g = await gsc(28).catch(() => null);
  return NextResponse.json({ connected: !!g?.connected }, { headers: { "Cache-Control": "no-store" } });
}
