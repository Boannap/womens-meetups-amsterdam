import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";

export const revalidate = 600;
export async function GET() {
  const q = (await rpc<{ quote: string; first_name: string; rating: number | null }[]>("public_quotes", {})) ?? [];
  return NextResponse.json(q);
}
