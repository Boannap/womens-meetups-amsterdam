import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";
import { runMailSchedule } from "@/lib/customerMail";

/** Daily cron: deletes data past the retention terms, then sends the participant mails that are due (each only once). Safe to call. */
export async function GET() {
  const r = await rpc<Record<string, number>>("cleanup_old_data", {});
  const mails = await runMailSchedule().catch((e) => { console.error("[mails]", e); return { error: 1 }; });
  return NextResponse.json({ cleanup: r ?? { error: "failed" }, mails }, { headers: { "Cache-Control": "no-store" } });
}
