import { icsFile } from "@/lib/calendar";

/** Apple/Outlook calendar file for one meetup, always with the latest café details. */
export function GET(req: Request) {
  const u = new URL(req.url);
  const lang = u.searchParams.get("l") === "en" ? "en" : "nl";
  const ics = icsFile(u.searchParams.get("e") || "", lang);
  if (!ics) return new Response("Not found", { status: 404 });
  return new Response(ics, {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'attachment; filename="table-of-six.ics"', "Cache-Control": "no-store" },
  });
}
