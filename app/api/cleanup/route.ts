import { NextResponse } from "next/server";
import { rpc } from "@/lib/supa";
import { runMailSchedule } from "@/lib/customerMail";
import { notifySignup } from "@/lib/notify";

/** Daily cron: deletes data past the retention terms, then sends the participant mails that are due (each only once). Safe to call. */
export async function GET() {
  const r = await rpc<Record<string, number>>("cleanup_old_data", {});
  // Re-send Boanna's own signup note (to hello@ only) for signups flagged notify_again.
  const again = await rpc<{ event_id: string; seat: number; person: Parameters<typeof notifySignup>[2] }[]>("notify_again_list", { p_token: process.env.PAYMENT_WEBHOOK_TOKEN ?? "" }).catch(() => null);
  for (const a of Array.isArray(again) ? again : []) await notifySignup("paid", a.event_id, a.person, undefined, a.seat).catch((e) => console.error("[notify again]", e));
  const mails = await runMailSchedule().catch((e) => { console.error("[mails]", e); return { error: 1 }; });
  return NextResponse.json({ cleanup: r ?? { error: "failed" }, mails }, { headers: { "Cache-Control": "no-store" } });
}
