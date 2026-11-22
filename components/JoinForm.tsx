"use client";

import { useEffect, useRef, useState } from "react";
import { EVENTS, privacyPath, guidelinesPath, type Dict, type Lang } from "@/lib/site";
import { quizType, type TypeKey } from "@/lib/quiz";
import { useSeats, isEventFull } from "@/lib/useSeats";
import { track } from "./Tracker";

// €12.50 incl. 21% VAT: VAT = 12.50 - 12.50/1.21 = 2.17; service costs = Mollie iDEAL fee. First coffee included.
const PRICE = { total: "12.50", vat: "2.17", service: "0.32", seat: "10.01" };

function linkify(text: string, lang: Lang) {
  const links: [string, string][] = lang === "nl"
    ? [["voorwaarden", `${privacyPath("nl")}#cancellation`], ["privacyverklaring", `${privacyPath("nl")}#top`], ["huisregels", guidelinesPath("nl")]]
    : [["terms", `${privacyPath("en")}#cancellation`], ["privacy policy", `${privacyPath("en")}#top`], ["table guidelines", guidelinesPath("en")]];
  let parts: (string | React.ReactElement)[] = [text];
  for (const [word, url] of links) {
    parts = parts.flatMap((p) => (typeof p === "string" && p.includes(word) ? [p.split(word)[0], <a key={word} href={url} target="_blank" rel="noopener">{word}</a>, p.split(word).slice(1).join(word)] : [p]));
  }
  return parts;
}

export default function JoinForm({ t, lang }: { t: Dict; lang: Lang }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [cancelled, setCancelled] = useState(false);
  // Back from Mollie: ?paid=1 shows the thank-you, ?cancelled=1 a short note above the form.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("paid") === "1") setState("ok");
    if (q.get("cancelled") === "1") setCancelled(true);
  }, []);
  const [answers, setAnswers] = useState<(number | null)[]>(() => t.quiz.map(() => null));
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<"whatsapp_email" | "email">("whatsapp_email");
  const type: TypeKey | null = quizType(answers);
  const [started, setStarted] = useState(false);
  const touched = useRef(new Set<string>());
  useEffect(() => { if (type) track("form", "quiz_done", undefined, type); }, [type]);
  const upcoming = EVENTS.filter((e) => new Date(e.end) > new Date());
  const seats = useSeats();
  const isFull = (id: string) => { const e = upcoming.find((x) => x.id === id); return !!e && isEventFull(e, seats); };
  const [eventId, setEventId] = useState<string>(() => (upcoming.find((e) => !isFull(e.id)) ?? upcoming[0])?.id ?? "");
  const waitlist = isFull(eventId);
  useEffect(() => {
    const pick = (ev: Event) => setEventId((ev as CustomEvent<string>).detail);
    window.addEventListener("wma:pick-event", pick);
    return () => window.removeEventListener("wma:pick-event", pick);
  }, []);
  const fmtDate = (d: string) => new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-GB", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short" }).format(new Date(d));
  const typeInfo = type ? (t.types as Record<TypeKey, string[]>)[type] : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!type) { setStep(Math.max(0, answers.findIndex((x) => x === null))); form.querySelector("#quiz")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    const fd = new FormData(form);
    const body = {
      name: fd.get("name"), email: fd.get("email"), age: fd.get("age"), language: fd.get("language"),
      neighbourhood: fd.get("neighbourhood"), personality: type, quiz: answers, field: fd.get("field"),
      phone: contact === "whatsapp_email" ? fd.get("phone") : "", contact_pref: contact,
      whatsapp_consent: contact === "whatsapp_email" && fd.get("wa_consent") === "on",
      hoping: fd.getAll("hoping"), days: fd.getAll("days"), instagram: fd.get("instagram"),
      consent: fd.get("consent") === "on", newsletter: fd.get("newsletter") === "on", photo_ok: fd.get("photo_ok") === "on", site_lang: lang,
      event_id: eventId, waitlist, found_via: fd.get("found_via"), table_wish: fd.get("table_wish"),
      website: fd.get("website"), // honeypot, must stay empty
    };
    setState("sending");
    track("form", "submit", undefined, waitlist ? "waitlist" : "seat");
    try {
      const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = res.ok ? await res.json().catch(() => ({})) : null;
      if (data?.checkout_url) { window.location.href = data.checkout_url; return; }
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="join" style={{ display: "block" }}>
        <div className="ok"><h3>{waitlist ? t.j_ok_wait_t : t.j_ok_t}</h3><p>{waitlist ? t.j_ok_wait_p : t.j_ok_p}</p></div>
      </div>
    );
  }

  const pills = (name: string, arr: string[], type: "radio" | "checkbox", req = true) => (
    <div className="pills">
      {arr.map((o, i) => (
        <label key={o}>
          <input type={type} name={name} value={o} required={req && type === "radio" && i === 0} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );

  return (
    <form className="join" onSubmit={onSubmit} noValidate onFocus={(e) => { if (!started) { setStarted(true); track("form", "start"); } const n = (e.target as unknown as HTMLInputElement).name?.replace(/^q\d$/, "quiz"); if (n && !touched.current.has(n)) { touched.current.add(n); track("form", `field:${n}`); } }}>
      {upcoming.length > 0 && (
        <fieldset className="field full"><legend>{t.j_event}</legend>
          <div className="pills">
            {upcoming.map((e) => (
              <label key={e.id}><input type="radio" name="event" value={e.id} checked={eventId === e.id} onChange={() => setEventId(e.id)} />
                <span>{fmtDate(e.date)}{isFull(e.id) ? ` · ${t.j_event_wait}` : ""}</span></label>
            ))}
          </div>
        </fieldset>
      )}
      <div className="field"><label className="l" htmlFor="fn">{t.j_name}</label><input id="fn" name="name" type="text" autoComplete="given-name" required /></div>
      <div className="field"><label className="l" htmlFor="fe">{t.j_email}</label><input id="fe" name="email" type="email" autoComplete="email" required /></div>
      <fieldset className="field full"><legend>{t.j_age}</legend>{pills("age", t.ages, "radio")}</fieldset>
      <fieldset className="field full"><legend>{t.j_lang}</legend>{pills("language", [t.j_lang_nl, t.j_lang_en, t.j_lang_both], "radio")}</fieldset>
      <div className="field">
        <label className="l" htmlFor="fh">{t.j_hood}</label>
        <select id="fh" name="neighbourhood" required defaultValue="">
          <option value="">{t.j_choose}</option>
          {t.hoods.map((h) => <option key={h}>{h}</option>)}
          <option>{t.j_other}</option>
        </select>
      </div>
      <div className="field full">
        <label className="l" htmlFor="ff">{t.j_field}</label>
        <select id="ff" name="field" required defaultValue="">
          <option value="">{t.j_choose}</option>
          {t.j_fields.map((x) => <option key={x}>{x}</option>)}
        </select>
      </div>
      <fieldset className="field full"><legend>{t.j_hoping}</legend>{pills("hoping", t.j_hopes, "checkbox")}</fieldset>
      <fieldset className="field full"><legend>{t.j_days}</legend>{pills("days", t.j_dayopts, "checkbox")}</fieldset>
      <fieldset className="field full quiz" id="quiz">
        <legend><span className="kicker">{t.q_kicker}</span> {t.q_title}</legend>
        <p className="quiz-intro">{t.q_intro}</p>
        {(() => {
          const qi = Math.min(step, t.quiz.length - 1);
          const [q, opts] = t.quiz[qi];
          const done = answers.every((a) => a !== null);
          if (done && step >= t.quiz.length) return null;
          return (
            <div className="quiz-q quiz-step" key={qi}>
              <div className="quiz-nav">
                <button type="button" className="quiz-back" onClick={() => setStep((s) => Math.max(0, Math.min(s, t.quiz.length - 1) - 1))} disabled={qi === 0} aria-label={lang === "nl" ? "Vorige vraag" : "Previous question"}>←</button>
                <p className="quiz-n">{qi + 1}/{t.quiz.length} · {q as string}</p>
              </div>
              <div className="quiz-bar"><span style={{ width: `${(answers.filter((a) => a !== null).length / t.quiz.length) * 100}%` }} /></div>
              <div className="pills">
                {(opts as string[]).map((o, oi) => (
                  <label key={o}>
                    <input type="radio" name={`q${qi}`} value={oi} checked={answers[qi] === oi}
                      onChange={() => { setAnswers((a) => a.map((v, i) => (i === qi ? oi : v))); setTimeout(() => setStep(qi + 1), 260); }} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })()}
        {answers.every((a) => a !== null) && step >= t.quiz.length && (
          <button type="button" className="quiz-redo" onClick={() => setStep(t.quiz.length - 1)}>← {lang === "nl" ? "Antwoord aanpassen" : "Change an answer"}</button>
        )}
        <div className={`quiz-result${typeInfo ? " on" : ""}`} aria-live="polite">
          {typeInfo ? (<><small>{t.q_result}</small><b>{typeInfo[0]}</b><span>{typeInfo[1]}</span></>) : <span>☕ {answers.filter((a) => a !== null).length}/{t.quiz.length}</span>}
        </div>
      </fieldset>
      <fieldset className="field full"><legend>{t.j_contact}</legend>
        <div className="pills">
          {(["whatsapp_email", "email"] as const).map((v, i) => (
            <label key={v}><input type="radio" name="contact" value={v} checked={contact === v} onChange={() => setContact(v)} /><span>{t.j_contact_opts[i]}</span></label>
          ))}
        </div>
        <small className="hint">{t.j_contact_note}</small>
      </fieldset>
      {contact === "whatsapp_email" && (
        <>
          <div className="field full"><label className="l" htmlFor="fp">{t.j_phone}</label><input id="fp" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+31 6 12345678" pattern="[+0-9 ()-]{8,20}" required /></div>
          <label className="consent full field" style={{ flexDirection: "row" }}>
            <input type="checkbox" name="wa_consent" required />
            <span>{t.j_wa_consent}</span>
          </label>
        </>
      )}
      <div className="field full"><label className="l" htmlFor="fw">{t.j_wish}</label><textarea id="fw" name="table_wish" rows={3} maxLength={500} placeholder={t.j_wish_ph} /></div>
      <fieldset className="field full"><legend>{t.j_found}</legend>{pills("found_via", t.j_found_opts, "radio", false)}</fieldset>
      <div className="field full"><label className="l" htmlFor="fi">{t.j_insta}</label><input id="fi" name="instagram" type="text" placeholder="@" /></div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="vh" aria-hidden="true" />
      {!waitlist && <div className="price-box">
        <h4>{t.pr_title}</h4>
        <div className="r"><span>{t.pr_seat}</span><span>€{PRICE.seat}</span></div>
        <div className="r promo-row"><span>☕ {t.pr_coffee}</span><span>{t.pr_free}</span></div>
        <div className="r"><span>{t.pr_service}</span><span>€{PRICE.service}</span></div>
        <div className="r"><span>{t.pr_vat}</span><span>€{PRICE.vat}</span></div>
        <div className="r t"><span>{t.pr_total}</span><span>€{PRICE.total}</span></div>
        <small>{t.pr_note}</small>
      </div>}
      {cancelled && <p className="full" style={{ color: "var(--tomato)" }}>{lang === "nl" ? "Je betaling is niet afgerond, dus je plek is nog niet vast. Probeer het gerust opnieuw." : "Your payment wasn\u2019t completed, so your seat isn\u2019t booked yet. Feel free to try again."}</p>}
      <label className="consent full field" style={{ flexDirection: "row" }}>
        <input type="checkbox" name="consent" required />
        <span>{linkify(t.j_consent, lang)}</span>
      </label>
      <label className="consent full field" style={{ flexDirection: "row" }}>
        <input type="checkbox" name="newsletter" />
        <span>{t.j_news}</span>
      </label>
      <label className="consent full field" style={{ flexDirection: "row" }}>
        <input type="checkbox" name="photo_ok" />
        <span>{t.j_photo}</span>
      </label>
      <div className="full field" style={{ alignItems: "flex-start" }}>
        <button className="btn btn-wine" type="submit" disabled={state === "sending"}>{state === "sending" ? "…" : waitlist ? t.j_submit_wait : t.j_submit}</button>
        {state === "error" && <p style={{ color: "var(--tomato)", marginTop: 8 }}>{t.j_error}</p>}
      </div>
    </form>
  );
}
