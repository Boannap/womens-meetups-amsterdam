/**
 * Short notes to Boanna's own inbox only (hello@). Never to anyone else.
 */
import events from "./events.json";
import { quizTraits } from "./quiz";

const TYPES: Record<string, string> = { chatter: "Kletskous", connector: "Verbinder", explorer: "Ontdekker", listener: "Luisteraar" };
const LETTERS: Record<string, string> = { E: "Extravert", I: "Introvert", N: "Intuïtief", S: "Praktisch", F: "Gevoel", T: "Denker", P: "Spontaan", J: "Planner" };
const INBOX = "hello@womensmeetupsinamsterdam.com";
const SEATS = 6, MAX_TABLES = 4;
const TZ = "Europe/Amsterdam";

type Person = {
  name?: string; age?: string; personality?: string; language?: string; field?: string; discount_pct?: number | null;
  email?: string; phone?: string; contact_pref?: string; instagram?: string; hoping?: string[] | null; hobbies?: string;
  found_via?: string; table_wish?: string; newsletter?: boolean; quiz?: (number | null)[] | null;
  created_at?: string; paid_at?: string; amount_cents?: number | null;
};
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

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const dateNl = (id: string) => {
  const d = new Date(`${id}T12:00:00`);
  return isNaN(+d) ? id : new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "long", year: "numeric" }).format(d);
};
const meetupNl = (id: string) => {
  const e = (events as { id: string; date: string }[]).find((x) => x.id === id);
  if (!e) return dateNl(id);
  const d = new Date(e.date);
  return new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(d);
};
const whenNl = (iso?: string) =>
  new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(iso ? new Date(iso) : new Date());
const ordinal = (n: number) => (n === 1 ? "Eerste" : n === 2 ? "Tweede" : n === 3 ? "Derde" : `${n}e`);

function tableBars(paid: number) {
  const cells = [];
  for (let t = 0; t < MAX_TABLES; t++) {
    const n = Math.max(0, Math.min(SEATS, paid - t * SEATS));
    const dots = Array.from({ length: SEATS }, (_, i) =>
      `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;margin-right:3px;background:${i < n ? "#5A0F14" : "#F3D3DA"}"></span>`).join("");
    cells.push(`<td style="padding:6px 10px 6px 0;font:13px Arial,sans-serif;color:#5A0F14;white-space:nowrap">Tafel ${t + 1} <b>${n}/${SEATS}</b><br>${dots}</td>`);
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr>${cells.slice(0, 2).join("")}</tr><tr>${cells.slice(2).join("")}</tr></table>`;
}

export async function notifySignup(kind: "paid" | "waitlist" | "free", eventId: string, p: Person, tableFull?: { paid: number; open: number }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const evs = await summary();
  const ev = evs.find((e) => e.event_id === eventId);
  const paidNow = ev?.paid ?? (kind === "paid" ? 1 : 0);
  const name = p.name || "Iemand";
  const traits = Array.isArray(p.quiz) ? quizTraits(p.quiz) : null;
  const code = traits?.code ?? "";
  const typeTxt = [TYPES[p.personality ?? ""] ?? p.personality, code ? `${code} (${code.split("").map((c) => LETTERS[c] ?? c).join(" · ")})` : ""].filter(Boolean).join(" · ");
  const seat = kind === "paid" ? paidNow : 0;
  const table = seat ? Math.ceil(seat / SEATS) : 0;
  const seatInTable = seat ? ((seat - 1) % SEATS) + 1 : 0;
  const left = MAX_TABLES * SEATS - paidNow;

  const headline = kind === "paid"
    ? `${ordinal(seat)} aanmelding voor ${dateNl(eventId)}!`
    : kind === "waitlist" ? `${name} staat op de wachtlijst` : `Nieuwe aanmelding voor ${dateNl(eventId)}`;
  const sub = kind === "paid"
    ? `${name} zit aan tafel ${table}, stoel ${seatInTable}/${SEATS}`
    : kind === "waitlist" ? `Voor ${dateNl(eventId)}` : `${name} heeft zich aangemeld (nog niet betaald)`;

  const rows: [string, string][] = [
    ["Meetup", meetupNl(eventId)],
    [kind === "paid" ? "Betaald op" : "Aangemeld op", whenNl(kind === "paid" ? p.paid_at : p.created_at)],
    ...(kind === "paid" && p.amount_cents ? [["Bedrag", `€${(p.amount_cents / 100).toFixed(2).replace(".", ",")}${p.discount_pct ? ` (${p.discount_pct}% vriendinnenkorting)` : ""}`] as [string, string]] : []),
    ["Naam", `${name}${p.age ? `, ${p.age}` : ""}`],
    ["E-mail", p.email ?? ""],
    ["WhatsApp", p.contact_pref === "whatsapp_email" ? (p.phone ?? "") : ""],
    ["Instagram", p.instagram ? `@${p.instagram.replace(/^@/, "")}` : ""],
    ["Type", typeTxt],
    ["Taal", p.language ?? ""],
    ["Werk", p.field ?? ""],
    ["Hoopt op", (p.hoping ?? []).join(", ")],
    ["Hobby's", p.hobbies ?? ""],
    ["Tafelwens", p.table_wish ?? ""],
    ["Gevonden via", p.found_via ?? ""],
    ["Nieuwsbrief", p.newsletter ? "ja" : ""],
  ].filter(([, v]) => v) as [string, string][];

  const lines = [`Hoi Boanna!`, ``, headline, sub, ``, ...rows.map(([k, v]) => `${k}: ${v}`)];
  if (tableFull) lines.push(``, `Tafel ${tableFull.paid / SEATS} is nu vol!`);
  if (evs.length) {
    lines.push(``, `Stand per datum:`);
    for (const e of evs) lines.push(`• ${dateNl(e.event_id)}: ${e.paid} van ${MAX_TABLES * SEATS} plekken bezet, nog ${MAX_TABLES * SEATS - e.paid} vrij${e.waitlist ? `, ${e.waitlist} op de wachtlijst` : ""}`);
  }
  lines.push(``, `Dashboard: https://womensmeetupsinamsterdam.com/dashboard`);

  const detail = rows.map(([k, v]) =>
    `<tr><td style="padding:7px 14px 7px 0;font:13px Arial,sans-serif;color:#8a6466;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:7px 0;font:15px Arial,sans-serif;color:#2A1416;vertical-align:top">${esc(v)}</td></tr>`).join("");
  const stand = evs.map((e) => `
    <div style="background:#FCF8F1;border-radius:14px;padding:14px 16px;margin:0 0 10px">
      <div style="font:bold 15px Arial,sans-serif;color:#5A0F14;margin-bottom:6px">${esc(dateNl(e.event_id))}${e.event_id === eventId ? " ✨" : ""}</div>
      <div style="font:14px Arial,sans-serif;color:#4a2a2d;margin-bottom:8px">${e.paid} van ${MAX_TABLES * SEATS} plekken bezet · nog <b>${MAX_TABLES * SEATS - e.paid}</b> vrij${e.waitlist ? ` · ${e.waitlist} op de wachtlijst` : ""}</div>
      ${tableBars(e.paid)}
    </div>`).join("");
  const banner = tableFull ? `<div style="background:#F3A9B8;color:#5A0F14;border-radius:12px;padding:12px 16px;font:bold 15px Arial,sans-serif;margin:0 0 16px">🎉 Tafel ${tableFull.paid / SEATS} is nu vol!</div>` : "";

  const html = `<!doctype html><html><body style="margin:0;background:#F6EEE3">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6EEE3"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
<tr><td style="background:#5A0F14;border-radius:22px 22px 0 0;padding:26px 28px">
  <div style="font:bold 12px Arial,sans-serif;letter-spacing:3px;color:#F3A9B8">${kind === "paid" ? "NIEUWE PLEK GEBOEKT" : kind === "waitlist" ? "WACHTLIJST" : "NIEUWE AANMELDING"}</div>
  <div style="font:bold 28px Georgia,serif;color:#FCF8F1;margin-top:10px;line-height:1.15">${esc(headline)}</div>
  <div style="font:italic 18px Georgia,serif;color:#F3A9B8;margin-top:8px">${esc(sub)}</div>
</td></tr>
<tr><td style="background:#ffffff;padding:24px 28px">
  ${banner}
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${detail}</table>
</td></tr>
<tr><td style="background:#F9D9DF;padding:22px 28px">
  <div style="font:bold 12px Arial,sans-serif;letter-spacing:3px;color:#5A0F14;margin-bottom:12px">STAND PER DATUM</div>
  ${stand || `<div style="font:14px Arial,sans-serif;color:#4a2a2d">Nog geen aanmeldingen.</div>`}
</td></tr>
<tr><td style="background:#5A0F14;border-radius:0 0 22px 22px;padding:20px 28px" align="center">
  <a href="https://womensmeetupsinamsterdam.com/dashboard" style="display:inline-block;background:#F3A9B8;color:#5A0F14;border-radius:999px;padding:12px 26px;font:bold 15px Arial,sans-serif;text-decoration:none">Open je dashboard →</a>
  <div style="font:12px Arial,sans-serif;color:#F3A9B8;margin-top:14px">Alleen voor jou · women's meetups in Amsterdam</div>
</td></tr>
</table></td></tr></table></body></html>`;

  const subject = tableFull ? `🎉 Tafel vol: ${dateNl(eventId)}`
    : kind === "paid" ? `${ordinal(seat)} aanmelding: ${name} (tafel ${table}, ${seatInTable}/${SEATS}) · ${dateNl(eventId)}`
    : kind === "waitlist" ? `Wachtlijst: ${name} (${dateNl(eventId)})` : `Nieuwe aanmelding: ${name} (${dateNl(eventId)})`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `Women's Meetups site <${INBOX}>`, to: [INBOX], subject, text: lines.join("\n"), html }),
  }).catch((e) => console.error("[notify]", e));
}
