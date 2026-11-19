/**
 * Branded e-mails for Women's Meetups in Amsterdam.
 * Plain tables + inline styles so they look right in Gmail, Apple Mail and Outlook.
 * Nothing is sent from here: these functions only build the HTML. Sending happens via Resend,
 * and only for the moments Boanna approved (after payment, 2 days before, the morning itself, the day after).
 */
import type { Lang } from "./site";

export const MAIL_BASE = "https://womensmeetupsinamsterdam.nl";
const C = { wine: "#5A0F14", pink: "#F3A9B8", cream: "#F6EEE3", paper: "#FCF8F1", ink: "#3A1A1C", tomato: "#E4472F", soft: "#7a5a5c" };
const font = "font-family:Georgia,'Times New Roman',serif";
const sans = "font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

export type MailData = {
  name: string;
  date: string; // ISO start
  end?: string;
  cafe?: string;
  address?: string;
  mapsUrl?: string;
  tableLang?: string;
  token?: string; // signup id, used for review links
  whatsapp?: boolean;
};

/** Signature block, also used as the Gmail signature for hello@. */
export function signature(lang: Lang = "nl") {
  const role = lang === "nl" ? "Founder &amp; host" : "Founder &amp; host";
  return `<table cellpadding="0" cellspacing="0" role="presentation" style="margin-top:8px">
<tr><td style="vertical-align:middle;padding-right:16px"><img src="${MAIL_BASE}/mail/logo.png" width="72" height="72" alt="Women's Meetups in Amsterdam" style="display:block;border-radius:50%"></td>
<td style="vertical-align:middle">
<img src="${MAIL_BASE}/mail/handtekening.png" width="150" height="50" alt="Boanna" style="display:block;margin:0 0 2px -4px">
<div style="${sans};font-size:13px;color:${C.soft}">${role} · Women's Meetups in Amsterdam</div>
<div style="${sans};font-size:13px;margin-top:4px"><a href="${MAIL_BASE}" style="color:${C.tomato};text-decoration:none">womensmeetupsinamsterdam.nl</a> · <a href="https://www.instagram.com/womensmeetupsinamsterdam" style="color:${C.tomato};text-decoration:none">@womensmeetupsinamsterdam</a></div>
</td></tr></table>`;
}

/** Personal greeting: the first name she typed in the form, neatly capitalised ("sanne de vries" -> "Sanne"). */
export const firstName = (n: string) => { const w = (n || "").trim().split(/\s+/)[0] || ""; return w ? w[0].toLocaleUpperCase("nl") + w.slice(1) : ""; };

const fmt = (iso: string, lang: Lang, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-GB", { timeZone: "Europe/Amsterdam", ...o }).format(new Date(iso));
const day = (iso: string, lang: Lang) => fmt(iso, lang, { weekday: "long", day: "numeric", month: "long" });
const time = (iso: string, lang: Lang) => fmt(iso, lang, { hour: "2-digit", minute: "2-digit" });

function layout(lang: Lang, preheader: string, body: string) {
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light"></head>
<body style="margin:0;background:${C.cream}">
<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${C.cream}"><tr><td align="center" style="padding:28px 14px">
<table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%">
<tr><td align="center" style="padding-bottom:18px"><img src="${MAIL_BASE}/mail/logo.png" width="84" height="84" alt="Women's Meetups in Amsterdam" style="display:block;border-radius:50%"></td></tr>
<tr><td style="background:${C.paper};border-radius:22px;padding:34px 32px;${sans};font-size:16px;line-height:1.6;color:${C.ink}">
${body}
<div style="height:1px;background:#ead9cc;margin:28px 0 18px"></div>
${signature(lang)}
</td></tr>
<tr><td align="center" style="${sans};font-size:12px;color:${C.soft};padding:18px 10px">${lang === "nl" ? "Je krijgt deze mail omdat je je hebt aangemeld voor een Table of Six." : "You're getting this e-mail because you signed up for a Table of Six."}</td></tr>
</table></td></tr></table></body></html>`;
}

const h1 = (t: string) => `<h1 style="${font};font-size:30px;line-height:1.1;color:${C.wine};margin:0 0 16px">${t}</h1>`;
const p = (t: string) => `<p style="margin:0 0 14px">${t}</p>`;
const btn = (href: string, t: string) => `<a href="${href}" style="display:inline-block;background:${C.wine};color:${C.pink};${sans};font-weight:700;font-size:16px;text-decoration:none;padding:13px 26px;border-radius:999px">${t}</a>`;
const card = (rows: [string, string][]) => `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${C.cream};border-radius:16px;margin:6px 0 18px"><tr><td style="padding:18px 20px">${rows.map(([k, v]) => `<div style="margin:4px 0"><span style="display:inline-block;width:26px">${k}</span>${v}</div>`).join("")}</td></tr></table>`;
const promo = (lang: Lang) => `<div style="display:inline-block;background:${C.pink};color:${C.wine};border:2px dashed rgba(90,15,20,.35);border-radius:6px;padding:8px 16px;${sans};font-size:14px;font-weight:700;margin:2px 0 16px">☕ ${lang === "nl" ? "First editions: je eerste koffie is van ons" : "First editions: your first coffee is on us"}</div>`;

/** 1. Right after payment + sign-up (text approved by Boanna, 18 Nov). */
export function mailConfirm(lang: Lang, d: MailData) {
  const nl = lang === "nl";
  const subject = nl ? "Je stoel staat klaar ☕" : "Your seat is saved ☕";
  const body = nl
    ? h1(`Hoi ${firstName(d.name)},`) + p("Wat leuk dat je erbij wilt zijn! Je aanmelding is binnen.") + card([["📅", `<b>${day(d.date, lang)}</b>, ${time(d.date, lang)}`], ["📍", "Het café verklappen we twee dagen van tevoren"]]) +
      p("<b>Dit gebeurt er nu:</b>") + `<ul style="margin:0 0 14px;padding-left:20px"><li>We zoeken vijf meiden die bij jou passen en zetten jullie samen aan één tafel.</li><li>Twee dagen van tevoren krijg je een mail${d.whatsapp ? " en een WhatsAppje" : ""} met het café en de tijd.</li><li>Een host heet iedereen welkom en brengt het gesprek op gang met de vragenkaartjes, dus niemand hoeft de stilte te vullen.</li></ul>` +
      promo(lang) + p("Vragen? Beantwoord gewoon deze mail.") + p("Tot snel aan tafel,")
    : h1(`Hi ${firstName(d.name)},`) + p("So happy you want to join! We've got your sign-up.") + card([["📅", `<b>${day(d.date, lang)}</b>, ${time(d.date, lang)}`], ["📍", "We'll reveal the café two days before"]]) +
      p("<b>Here's what happens next:</b>") + `<ul style="margin:0 0 14px;padding-left:20px"><li>We match you with five girls you'll click with, all at one table.</li><li>Two days before, you'll get an e-mail${d.whatsapp ? " and a WhatsApp" : ""} with the café and the time.</li><li>A host welcomes everyone and gets the conversation going with the question cards, so nobody has to fill the silence.</li></ul>` +
      promo(lang) + p("Questions? Just reply to this e-mail.") + p("See you at the table,");
  return { subject, html: layout(lang, nl ? "Je aanmelding is binnen. Dit gebeurt er nu." : "We've got your sign-up. Here's what happens next.", body) };
}

/** 2. Two days before: the café is revealed. */
export function mailDetails(lang: Lang, d: MailData) {
  const nl = lang === "nl";
  const subject = nl ? `Je tafel staat klaar: ${d.cafe} 📍` : `Your table is ready: ${d.cafe} 📍`;
  const rows: [string, string][] = [
    ["📅", `<b>${day(d.date, lang)}</b>`],
    ["🕑", `${time(d.date, lang)}${d.end ? ` - ${time(d.end, lang)}` : ""}`],
    ["📍", `<b>${d.cafe}</b><br>${d.address}`],
    ["💬", nl ? `Tafel in het ${d.tableLang}` : `Table in ${d.tableLang}`],
  ];
  const body = nl
    ? h1(`Nog twee nachtjes slapen, ${firstName(d.name)}!`) + p("Je tafel is gematcht en we hebben een gezellig plekje voor jullie gevonden. Hier zijn de details:") + card(rows) +
      `<p style="margin:0 0 20px">${btn(d.mapsUrl || "#", "Route in Google Maps →")}</p>` +
      p("<b>Goed om te weten</b>") + `<ul style="margin:0 0 14px;padding-left:20px"><li>Vraag bij binnenkomst naar de tafel van <b>Women's Meetups</b>, of zoek de gesprekskaartjes op tafel.</li><li>Je eerste koffie is van ons. Wat je verder bestelt, reken je zelf af.</li><li>Kun je toch niet? Laat het ons vandaag nog weten, dan geven we je plek aan iemand van de wachtlijst.</li></ul>` +
      p("We hebben er zin in!")
    : h1(`Two more sleeps, ${firstName(d.name)}!`) + p("Your table is matched and we found a cosy spot for you. Here are the details:") + card(rows) +
      `<p style="margin:0 0 20px">${btn(d.mapsUrl || "#", "Directions in Google Maps →")}</p>` +
      p("<b>Good to know</b>") + `<ul style="margin:0 0 14px;padding-left:20px"><li>Ask for the <b>Women's Meetups</b> table when you walk in, or look for the conversation cards.</li><li>Your first coffee is on us. Anything else you order, you pay at the café.</li><li>Can't make it after all? Let us know today, so we can give your seat to someone on the waitlist.</li></ul>` +
      p("We can't wait!");
  return { subject, html: layout(lang, nl ? `${d.cafe}, ${time(d.date, lang)}. Alles wat je moet weten.` : `${d.cafe}, ${time(d.date, lang)}. Everything you need to know.`, body) };
}

/** 3. The morning itself, around 09:00. */
export function mailMorning(lang: Lang, d: MailData) {
  const nl = lang === "nl";
  const subject = nl ? "Vandaag is het zover ☀️" : "Today's the day ☀️";
  const body = nl
    ? h1(`Goedemorgen ${firstName(d.name)}! ☀️`) + p(`Vanmiddag om <b>${time(d.date, lang)}</b> zit je met vijf nieuwe meiden aan tafel bij <b>${d.cafe}</b>.`) + card([["📍", `${d.cafe}, ${d.address}`], ["☕", "Je eerste koffie is van ons"]]) +
      `<p style="margin:0 0 20px">${btn(d.mapsUrl || "#", "Route →")}</p>` + p("Kom gewoon zoals je bent. Wij nemen de vragen mee, jij jezelf.") + p("Tot straks,")
    : h1(`Good morning ${firstName(d.name)}! ☀️`) + p(`This afternoon at <b>${time(d.date, lang)}</b> you'll sit down with five new girls at <b>${d.cafe}</b>.`) + card([["📍", `${d.cafe}, ${d.address}`], ["☕", "Your first coffee is on us"]]) +
      `<p style="margin:0 0 20px">${btn(d.mapsUrl || "#", "Directions →")}</p>` + p("Just come as you are. We bring the questions, you bring yourself.") + p("See you soon,");
  return { subject, html: layout(lang, nl ? `Vanmiddag ${time(d.date, lang)} bij ${d.cafe}.` : `This afternoon ${time(d.date, lang)} at ${d.cafe}.`, body) };
}

/** 4. The day after: one-tap review poll inside the e-mail. Every option is a link that saves the answer. */
export function mailReview(lang: Lang, d: MailData) {
  const nl = lang === "nl";
  const u = (q: string, v: string | number) => `${MAIL_BASE}/api/review?r=${encodeURIComponent(d.token || "")}&q=${q}&v=${v}&l=${lang}`;
  const chip = (href: string, t: string) => `<a href="${href}" style="display:inline-block;margin:0 6px 8px 0;background:#fff;border:2px solid #e3d3c6;border-radius:999px;padding:8px 14px;color:${C.wine};${sans};font-size:15px;font-weight:600;text-decoration:none">${t}</a>`;
  const hearts = [1, 2, 3, 4, 5].map((n) => `<a href="${u("rating", n)}" style="display:inline-block;width:48px;height:48px;line-height:48px;text-align:center;margin:0 4px 6px 0;border-radius:50%;background:${C.cream};color:${C.wine};font-size:20px;font-weight:700;text-decoration:none;${sans}">${n}</a>`).join("");
  const q = (t: string) => `<p style="margin:18px 0 8px;font-weight:700;color:${C.wine}">${t}</p>`;
  const body = nl
    ? h1(`Dankjewel voor gisteren, ${firstName(d.name)} 🤍`) + p("Wat was het fijn om jullie aan tafel te hebben. Heb je 20 seconden? Tik gewoon je antwoord aan, dat is alles.") +
      q("Hoe was je meetup? (1 = mwah, 5 = top)") + `<div>${hearts}</div>` +
      q("Klikte het met je tafel?") + chip(u("match", 3), "😍 Helemaal") + chip(u("match", 2), "🙂 Best wel") + chip(u("match", 1), "😕 Niet echt") +
      q("Kom je nog een keer?") + chip(u("again", "yes"), "Zeker weten") + chip(u("again", "maybe"), "Misschien") + chip(u("again", "no"), "Nee") +
      q("Wat vond je het leukst?") + chip(u("best", "people"), "De meiden") + chip(u("best", "cards"), "De kaartjes") + chip(u("best", "cafe"), "Het café") + chip(u("best", "vibe"), "De sfeer") +
      p("<b>Nog iets kwijt?</b> Klik gewoon op beantwoorden en typ je zinnetje. Ik lees alles zelf.") +
      `<p style="margin:0 0 14px;font-size:13px;color:#8a6f6f">Mag je zinnetje op de website? <a href="${MAIL_BASE}/review?r=${encodeURIComponent(d.token || "")}&l=${lang}" style="color:#8a6f6f">Schrijf het dan hier</a>.</p>` +
      p("Volgende tafel? Je bent altijd welkom.") + p("Liefs,")
    : h1(`Thank you for yesterday, ${firstName(d.name)} 🤍`) + p("It was so lovely having you at the table. Got 20 seconds? Just tap your answer, that's it.") +
      q("How was your meetup? (1 = meh, 5 = loved it)") + `<div>${hearts}</div>` +
      q("Did you click with your table?") + chip(u("match", 3), "😍 Totally") + chip(u("match", 2), "🙂 Kind of") + chip(u("match", 1), "😕 Not really") +
      q("Would you come again?") + chip(u("again", "yes"), "Definitely") + chip(u("again", "maybe"), "Maybe") + chip(u("again", "no"), "No") +
      q("What did you love most?") + chip(u("best", "people"), "The girls") + chip(u("best", "cards"), "The cards") + chip(u("best", "cafe"), "The café") + chip(u("best", "vibe"), "The vibe") +
      p("<b>Anything else?</b> Just hit reply and type your sentence. I read every one myself.") +
      `<p style="margin:0 0 14px;font-size:13px;color:#8a6f6f">Okay to share it on the website? <a href="${MAIL_BASE}/review?r=${encodeURIComponent(d.token || "")}&l=${lang}" style="color:#8a6f6f">Write it here instead</a>.</p>` +
      p("Next table? You're always welcome.") + p("Love,");
  return { subject: nl ? "Hoe was het? (20 seconden) 🤍" : "How was it? (20 seconds) 🤍", html: layout(lang, nl ? "Tik je antwoord aan, meer hoeft niet." : "Just tap your answer, that's all.", body) };
}
