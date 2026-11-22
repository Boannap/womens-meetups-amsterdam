"use client";

import { useEffect, useRef, useState } from "react";
import { EVENTS, privacyPath, guidelinesPath, type Dict, type Lang } from "@/lib/site";
import { quizType, type TypeKey } from "@/lib/quiz";
import { useSeats, isEventFull } from "@/lib/useSeats";
import { track } from "./Tracker";

// €12.50 incl. 21% VAT: VAT = 12.50 - 12.50/1.21 = 2.17; service costs = Stripe iDEAL fee. First coffee included.
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
  // Back from Stripe: ?paid=1 shows the thank-you, ?cancelled=1 a short note above the form.
  // Friend discount: ?ref=<own link from the review mail>, ?vriendin=<group> for invited friends, &g=<group> after paying.
  const [ref, setRef] = useState<{ token: string; name: string } | null>(null);
  const [invite, setInvite] = useState<{ group: string; pct: number; event: string; from: string } | null>(null);
  const [shareGroup, setShareGroup] = useState<string | null>(null);
  const [refErr, setRefErr] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get("paid") === "1") { setState("ok"); if (q.get("g")) setShareGroup(q.get("g")); }
    if (q.get("cancelled") === "1") setCancelled(true);
    const tk = q.get("ref"), gr = q.get("vriendin");
    if (tk) fetch(`/api/referral?token=${encodeURIComponent(tk)}`).then((r) => r.json()).then((d) => { if (d?.ok) setRef({ token: tk, name: d.first_name || "" }); }).catch(() => {});
    if (gr) fetch(`/api/referral?group=${encodeURIComponent(gr)}`).then((r) => r.json()).then((d) => { if (d?.ok) { setInvite({ group: gr, pct: d.pct, event: d.event_id, from: d.from || "" }); setEventId(d.event_id); } }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [answers, setAnswers] = useState<(number | null)[]>(() => t.quiz.map(() => null));
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<"whatsapp_email" | "email">("whatsapp_email");
  const [fieldOther, setFieldOther] = useState(false);
  const [hopeOther, setHopeOther] = useState(false);
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
      personality: type, quiz: answers,
      field: fieldOther ? `${fd.get("field")}: ${fd.get("field_other") || ""}` : fd.get("field"),
      hobbies: fd.get("hobbies"),
      phone: contact === "whatsapp_email" ? fd.get("phone") : "", contact_pref: contact,
      whatsapp_consent: contact === "whatsapp_email" && fd.get("wa_consent") === "on",
      hoping: fd.getAll("hoping").map((h) => (hopeOther && h === t.j_hopes[t.j_hopes.length - 1] ? `${h}: ${fd.get("hope_other") || ""}` : h)), instagram: fd.get("instagram"),
      consent: fd.get("consent") === "on", newsletter: fd.get("newsletter") === "on", site_lang: lang,
      event_id: eventId, waitlist, found_via: fd.get("found_via"), table_wish: fd.get("table_wish"),
      website: fd.get("website"), // honeypot, must stay empty
    };
    setState("sending"); setRefErr("");
    track("form", "submit", undefined, waitlist ? "waitlist" : "seat");
    // Inviter with friends: first create the group, so her own ticket gets the discount too.
    let refGroup: string | null = invite?.group ?? null;
    const friends = [fd.get("friend1"), fd.get("friend2")].filter((x): x is string => typeof x === "string" && !!x.trim());
    if (ref && friends.length && !waitlist) {
      const r = await fetch("/api/referral", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: ref.token, event: eventId, emails: friends, together: fd.get("together") === "on" }) }).then((x) => x.json()).catch(() => null);
      if (!r?.ok) {
        const why: Record<string, [string, string]> = {
          not_new: ["Een van je vriendinnen staat al bij ons ingeschreven. De korting geldt alleen voor nieuwe meiden.", "One of your friends has already signed up with us. The discount is only for new girls."],
          self: ["Vul de e-mail van je vriendin in, niet je eigen.", "Fill in your friend's e-mail, not your own."],
          used: ["Je persoonlijke link is al gebruikt.", "Your personal link has already been used."],
          expired: ["Je persoonlijke link is verlopen.", "Your personal link has expired."],
        };
        setRefErr((why[r?.reason] ?? ["Dat lukte niet, check de e-mailadressen.", "That didn't work, check the e-mail addresses."])[lang === "nl" ? 0 : 1]);
        setState("idle"); return;
      }
      refGroup = r.group;
    }
    try {
      const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, ref_group: refGroup }) });
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
        <div className="ok"><h3>{waitlist ? t.j_ok_wait_t : t.j_ok_t}</h3><p>{waitlist ? t.j_ok_wait_p : t.j_ok_p}</p>
          {shareGroup && (() => {
            const link = `${window.location.origin}${window.location.pathname}?vriendin=${shareGroup}#join`;
            return <div className="share-friends" style={{ marginTop: 18 }}>
              <p><b>{lang === "nl" ? "Stuur deze link naar je vriendin(nen):" : "Send this link to your friend(s):"}</b><br />{lang === "nl" ? "Met deze link krijgen zij dezelfde korting, op welke datum ze ook kiezen. Ze vullen hun eigen quiz in." : "With this link they get the same discount, on whichever date they pick. They fill in their own quiz."}</p>
              <input readOnly value={link} onFocus={(e) => e.currentTarget.select()} style={{ width: "100%" }} />
              <button type="button" className="btn btn-wine" style={{ marginTop: 10 }} onClick={() => navigator.clipboard?.writeText(link)}>{lang === "nl" ? "Kopieer link" : "Copy link"}</button>
            </div>;
          })()}
        </div>
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
      {invite && <p className="full invite-banner" style={{ background: "var(--pink)", color: "var(--wine)", padding: "14px 18px", borderRadius: 16, fontWeight: 600 }}>
        {lang === "nl" ? `${invite.from || "Je vriendin"} heeft je uitgenodigd! Je krijgt ${invite.pct}% korting op je plek, op elke datum. Gebruik het e-mailadres dat zij heeft ingevuld.` : `${invite.from || "Your friend"} invited you! You get ${invite.pct}% off your seat, on any date. Use the e-mail address she filled in.`}
      </p>}
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
      <div className="field"><label className="l" htmlFor="fa">{t.j_age}</label><input id="fa" name="age" type="number" inputMode="numeric" min={18} max={99} placeholder={t.j_age_ph} required /></div>
      <fieldset className="field full"><legend>{t.j_lang}</legend>{pills("language", [t.j_lang_both, t.j_lang_nl, t.j_lang_en], "radio")}</fieldset>
      <div className="field full">
        <label className="l" htmlFor="ff">{t.j_field}</label>
        <select id="ff" name="field" required defaultValue="" onChange={(e) => setFieldOther(e.currentTarget.value === t.j_fields[t.j_fields.length - 1])}>
          <option value="">{t.j_choose}</option>
          {t.j_fields.map((x) => <option key={x}>{x}</option>)}
        </select>
        {fieldOther && <input name="field_other" type="text" maxLength={100} placeholder={t.j_field_other} required style={{ marginTop: 8 }} />}
      </div>
      <div className="field full"><label className="l" htmlFor="fhb">{t.j_hobbies}</label><textarea id="fhb" name="hobbies" rows={4} maxLength={1500} placeholder={t.j_hobbies_ph} required /></div>
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
      <fieldset className="field full"><legend>{t.j_hoping}</legend>
        <div className="pills">
          {t.j_hopes.map((o, i) => (
            <label key={o}><input type="checkbox" name="hoping" value={o} onChange={i === t.j_hopes.length - 1 ? (e) => setHopeOther(e.currentTarget.checked) : undefined} /><span>{o}</span></label>
          ))}
        </div>
        {hopeOther && <input name="hope_other" type="text" maxLength={200} placeholder={t.j_hope_other} style={{ marginTop: 8 }} />}
      </fieldset>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="vh" aria-hidden="true" />
      {!waitlist && <div className="price-box">
        <h4>{t.pr_title}</h4>
        <div className="r"><span>{t.pr_seat}</span><span>€{PRICE.seat}</span></div>
        <div className="r promo-row"><span>☕ {t.pr_coffee}</span><span>{t.pr_free}</span></div>
        <div className="r"><span>{t.pr_service}</span><span>€{PRICE.service}</span></div>
        <div className="r"><span>{t.pr_vat}</span><span>€{PRICE.vat}</span></div>
        <div className="r t"><span>{t.pr_total}</span><span>€{PRICE.total}</span></div>
        {(invite || ref) && <div className="r promo-row"><span>{lang === "nl" ? "Vriendinnenkorting" : "Friends discount"}</span><span>{invite ? `-${invite.pct}%` : (lang === "nl" ? "10% of 15%" : "10% or 15%")}</span></div>}
        <small>{t.pr_note}</small>
      </div>}
      {ref && !waitlist && <div className="full field friends-box" style={{ background: "#fff", border: "2px dashed var(--pink)", borderRadius: 16, padding: "16px 18px" }}>
        <b>{lang === "nl" ? `Hoi ${ref.name}! Tot 15% korting: vertel het aan 1 of 2 nieuwe vriendinnen 👯` : `Hi ${ref.name}! Up to 15% off: tell 1 or 2 new friends 👯`}</b>
        <small style={{ display: "block", margin: "4px 0 10px" }}>{lang === "nl" ? "Met 1 vriendin krijgen jullie allebei 10% korting, met 2 vriendinnen jullie alle drie 15%. Zij mogen zelf hun datum kiezen. Alleen voor meiden die nog nooit bij ons waren." : "With 1 friend you both get 10% off, with 2 friends all three of you get 15%. They can pick their own date. Only for girls who haven't joined us before."}</small>
        <input name="friend1" type="email" placeholder={lang === "nl" ? "E-mail vriendin 1" : "Friend 1 e-mail"} style={{ marginBottom: 8, width: "100%" }} />
        <input name="friend2" type="email" placeholder={lang === "nl" ? "E-mail vriendin 2 (mag leeg)" : "Friend 2 e-mail (optional)"} style={{ width: "100%" }} />
        <label style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}><input type="checkbox" name="together" defaultChecked /> <span>{lang === "nl" ? "Kiezen we dezelfde datum? Zet ons dan samen aan één tafel" : "If we pick the same date, put us together at one table"}</span></label>
        {refErr && <p style={{ color: "var(--tomato)", marginTop: 8 }}>{refErr}</p>}
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
      <div className="full field" style={{ alignItems: "flex-start" }}>
        <button className="btn btn-wine" type="submit" disabled={state === "sending"}>{state === "sending" ? "…" : waitlist ? t.j_submit_wait : t.j_submit}</button>
        {state === "error" && <p style={{ color: "var(--tomato)", marginTop: 8 }}>{t.j_error}</p>}
      </div>
    </form>
  );
}
