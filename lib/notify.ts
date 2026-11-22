/**
 * Short notes to Boanna's own inbox only (hello@). Never to anyone else.
 */
const TYPES: Record<string, string> = { chatter: "Kletskous", connector: "Verbinder", explorer: "Ontdekker", listener: "Luisteraar" };
const INBOX = "hello@womensmeetupsinamsterdam.com";

type Person = { name?: string; age?: string; personality?: string; language?: string; field?: string; discount_pct?: number | null };
type Ev = { event_id: string; paid: number; waitlist: number; unpaid: number; open_tables: number };

async function summary(): Promise<Ev[]> {
  const today = new Date().toISOString().slice(0, 10);
  const r = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/signup_summary`, {
    method: "POST",
    headers: { apikey: process.env.SUPABASE_PUBLISHABLE_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({ p_token: process.env.PAYMENT_WEBHOOK_TOKEN ?? "", p_today: today }),
  }).catch(() => null);
  const d = r && r.ok ? await r.json().catch(() => null) : null;
  return d?.ok ? (d.events as Ev[]) : [];
}

const dateNl = (id: string) => {
  const d = new Date(`${id}T12:00:00`);
  return isNaN(+d) ? id : new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(d);
};

export async function notifySignup(kind: "paid" | "waitlist" | "free", eventId: string, p: Person, tableFull?: { paid: number; open: number }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const evs = await summary();
  const what = kind === "paid" ? "heeft betaald en heeft een plek 💳" : kind === "waitlist" ? "staat op de wachtlijst ⏳" : "heeft zich aangemeld";
  const lines = [
    `Hoi Boanna!`,
    ``,
    `${p.name || "Iemand"}${p.age ? ` (${p.age})` : ""} ${what} voor ${dateNl(eventId)}.`,
    `Type: ${TYPES[p.personality ?? ""] ?? (p.personality || "?")} · Taal: ${p.language || "?"}${p.field ? ` · ${p.field}` : ""}${p.discount_pct ? ` · ${p.discount_pct}% vriendinnenkorting` : ""}`,
  ];
  if (tableFull) {
    const full = tableFull.paid >= tableFull.open * 6;
    lines.push(``, `🎉 Tafel ${tableFull.paid / 6} is nu vol!`,
      full ? `Alle ${tableFull.open} open tafel(s) zijn vol, nieuwe aanmeldingen gaan naar de wachtlijst.${tableFull.open < 4 ? " Een tafel erbij openen doe je in je dashboard bij \"Tafels per datum\" (max. 4)." : ""}` : `Er zijn nog plekken aan de volgende tafel.`);
  }
  if (evs.length) {
    lines.push(``, `Stand van de aanmeldingen:`);
    for (const e of evs) lines.push(`• ${dateNl(e.event_id)}: ${e.paid} betaald (van ${e.open_tables * 6} plekken), ${e.waitlist} op de wachtlijst${e.unpaid ? `, ${e.unpaid} nog niet betaald` : ""}`);
  }
  lines.push(``, `Dashboard: https://womensmeetupsinamsterdam.com/dashboard`);
  const subject = tableFull ? `🎉 Tafel vol: ${dateNl(eventId)}` : kind === "waitlist" ? `Wachtlijst: ${p.name || "nieuwe aanmelding"} (${dateNl(eventId)})` : `Nieuwe aanmelding: ${p.name || ""} (${dateNl(eventId)})`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `Women's Meetups site <${INBOX}>`, to: [INBOX], subject, text: lines.join("\n") }),
  }).catch((e) => console.error("[notify]", e));
}
