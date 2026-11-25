/**
 * "Add to calendar" for participants: Google, Outlook and Apple (.ics).
 * The text explains how it works, where the café is (or that it follows two days before) and how to reach us.
 */
import events from "./events.json";

type Lang = "nl" | "en";
type Ev = { id: string; date: string; end?: string; cafe?: string; address?: string; maps?: string };

const BASE = "https://womensmeetupsinamsterdam.nl";
export const evFor = (id: string) => (events as Ev[]).find((e) => e.id === id);

export function calText(ev: Ev, lang: Lang) {
  const nl = lang === "nl";
  const title = "Women's Meetups in Amsterdam ☕";
  const location = ev.cafe ? `${ev.cafe}${ev.address ? `, ${ev.address}` : ""}` : nl ? "Amsterdam (het café hoor je 2 dagen van tevoren)" : "Amsterdam (café shared 2 days before)";
  const site = nl ? BASE : "https://womensmeetupsinamsterdam.com";
  const details = nl
    ? [
        "Zes meiden aan één tafel in een gezellig Amsterdams café, gematcht op persoonlijkheid.",
        "",
        "Zo werkt het:",
        ev.cafe ? `📍 ${location}` : "📍 Het café en alle details krijg je 2 dagen van tevoren per mail.",
        ...(ev.maps ? [`Route: ${ev.maps}`] : []),
        "☕ Je eerste koffie krijg je van ons. Wat je verder bestelt, reken je zelf af.",
        "💬 Vraag bij binnenkomst naar de tafel van Women's Meetups, of zoek de gesprekskaartjes op tafel.",
        "🙋‍♀️ Een host heet iedereen welkom en zet het gesprek op gang.",
        "",
        "Kun je toch niet? Laat het zo snel mogelijk weten, dan gaat je plek naar de wachtlijst.",
        "",
        `Huisregels: ${BASE}/huisregels`,
        `Vragen? hello@womensmeetupsinamsterdam.com`,
        site,
      ]
    : [
        "Six girls at one table in a cosy Amsterdam café, matched on personality.",
        "",
        "How it works:",
        ev.cafe ? `📍 ${location}` : "📍 You'll get the café and all details by e-mail 2 days before.",
        ...(ev.maps ? [`Directions: ${ev.maps}`] : []),
        "☕ Your first coffee is on us. Anything else you order, you pay at the café.",
        "💬 Ask for the Women's Meetups table when you walk in, or look for the conversation cards.",
        "🙋‍♀️ A host welcomes everyone and gets the conversation going.",
        "",
        "Can't make it after all? Let us know as soon as you can, so your seat can go to the waitlist.",
        "",
        `Table guidelines: https://womensmeetupsinamsterdam.com/guidelines`,
        `Questions? hello@womensmeetupsinamsterdam.com`,
        site,
      ];
  const end = ev.end || new Date(new Date(ev.date).getTime() + 2 * 3600e3).toISOString();
  return { title, location, details: details.join("\n"), start: ev.date, end };
}

const utc = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function calLinks(eventId: string, lang: Lang) {
  const ev = evFor(eventId);
  if (!ev) return null;
  const t = calText(ev, lang);
  const q = (o: Record<string, string>) => Object.entries(o).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
  return {
    google: `https://calendar.google.com/calendar/render?${q({ action: "TEMPLATE", text: t.title, dates: `${utc(t.start)}/${utc(t.end)}`, details: t.details, location: t.location })}`,
    outlook: `https://outlook.live.com/calendar/0/action/compose?${q({ subject: t.title, startdt: new Date(t.start).toISOString(), enddt: new Date(t.end).toISOString(), body: t.details, location: t.location })}`,
    apple: `${BASE}/api/ics?e=${encodeURIComponent(eventId)}&l=${lang}`,
  };
}

export function icsFile(eventId: string, lang: Lang) {
  const ev = evFor(eventId);
  if (!ev) return null;
  const t = calText(ev, lang);
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const fold = (line: string) => { const out: string[] = []; let cur = "", bytes = 0; for (const ch of Array.from(line)) { const n = Buffer.byteLength(ch); if (bytes + n > 74) { out.push(cur); cur = " "; bytes = 1; } cur += ch; bytes += n; } out.push(cur); return out.join("\r\n"); };
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Women's Meetups in Amsterdam//Table of Six//NL", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:table-of-six-${ev.id}@womensmeetupsinamsterdam.com`,
    `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(t.start)}`, `DTEND:${utc(t.end)}`,
    `SUMMARY:${esc(t.title)}`, `LOCATION:${esc(t.location)}`, `DESCRIPTION:${esc(t.details)}`,
    `URL:${lang === "nl" ? BASE : "https://womensmeetupsinamsterdam.com"}`,
    "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", `DESCRIPTION:${esc(t.title)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
