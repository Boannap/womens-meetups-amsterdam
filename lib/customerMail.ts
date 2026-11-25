/**
 * Mails to participants. Boanna approved these as part of the website (25 Nov 2026):
 * confirmation after payment, waitlist confirmation, a reminder 1 week before, café details 2 days before, the morning itself, review the day after.
 * Every mail is sent once per person (tracked in signups.mail_*_at) and replies go to hello@.
 */
import events from "./events.json";
import { rpc } from "./supa";
import { mailConfirm, mailDetails, mailMorning, mailReminder, mailReview, mailWaitlist, type MailData } from "./emails";
import type { Lang } from "./site";

const FROM = "Boanna · Women's Meetups <hello@womensmeetupsinamsterdam.com>";
const INBOX = "hello@womensmeetupsinamsterdam.com";
type Kind = "confirm" | "waitlist" | "reminder" | "details" | "morning" | "review";
type Who = { id: string; name: string; email: string; site_lang?: string; contact_pref?: string; event_id: string; quiz?: (number | null)[] | null };
type Ev = { id: string; date: string; end?: string; cafe?: string; address?: string; maps?: string; tableLang?: string };

const evById = (id: string) => (events as Ev[]).find((e) => e.id === id);
const token = () => process.env.PAYMENT_WEBHOOK_TOKEN ?? "";

async function resend(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return false;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: INBOX, subject, html }),
  }).catch(() => null);
  if (!r || !r.ok) { console.error("[customerMail]", to, r?.status, r ? await r.text() : "network"); return false; }
  return true;
}

function build(kind: Kind, w: Who) {
  const ev = evById(w.event_id);
  if (!ev) return null;
  const lang: Lang = w.site_lang === "nl" ? "nl" : "en";
  const d: MailData = {
    name: w.name, date: ev.date, end: ev.end, cafe: ev.cafe, address: ev.address, mapsUrl: ev.maps, tableLang: ev.tableLang,
    token: w.id, whatsapp: w.contact_pref === "whatsapp_email", quiz: w.quiz,
  };
  if ((kind === "details" || kind === "morning") && !ev.cafe) return null; // no café known yet: never send half a mail
  return kind === "confirm" ? mailConfirm(lang, d) : kind === "waitlist" ? mailWaitlist(lang, d) : kind === "reminder" ? mailReminder(lang, d)
    : kind === "details" ? mailDetails(lang, d) : kind === "morning" ? mailMorning(lang, d) : mailReview(lang, d);
}

/** Send one kind of mail to everyone who is due for it (optionally for one date). Returns how many went out. */
export async function sendDue(kind: Kind, eventId?: string) {
  const list = (await rpc<Who[]>("mail_due", { p_token: token(), p_kind: kind, p_event: eventId ?? null })) ?? [];
  let sent = 0;
  for (const w of list) {
    const m = build(kind, w);
    if (!m) continue;
    if (await resend(w.email, m.subject, m.html)) {
      await rpc("mail_mark", { p_token: token(), p_id: w.id, p_kind: kind });
      sent++;
    }
  }
  return sent;
}

const todayAms = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Amsterdam" }).format(new Date());
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T12:00:00Z`) - Date.parse(`${a}T12:00:00Z`)) / 86400000);

/** Daily run: catch up confirmations, then the timed mails per date. Safe to call more than once a day. */
export async function runMailSchedule() {
  const out: Record<string, number> = {};
  out.confirm = await sendDue("confirm");
  out.waitlist = await sendDue("waitlist");
  const today = todayAms();
  const missingCafe: string[] = [];
  for (const ev of events as Ev[]) {
    const until = daysBetween(today, ev.id);
    if (until === 7 || until === 6) out[`reminder_${ev.id}`] = await sendDue("reminder", ev.id); // one week before (catch up a day late)
    if (until === 2 || until === 1) { // 2 days before (catch up the day after if the café came in late)
      if (!ev.cafe) missingCafe.push(ev.id); else out[`details_${ev.id}`] = await sendDue("details", ev.id);
    }
    if (until === 0 && ev.cafe) out[`morning_${ev.id}`] = await sendDue("morning", ev.id);
    if (until === -1) out[`review_${ev.id}`] = await sendDue("review", ev.id);
  }
  if (missingCafe.length && process.env.RESEND_API_KEY) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `Women's Meetups site <${INBOX}>`, to: [INBOX], subject: "Café nog invullen!",
        text: `Hoi Boanna!\n\nVoor ${missingCafe.join(", ")} staat nog geen café ingevuld, dus de deelnemers hebben nog geen mail met de locatie gekregen.\nStuur het café en adres door, dan gaat de mail meteen de deur uit.` }),
    }).catch(() => null);
  }
  return out;
}
