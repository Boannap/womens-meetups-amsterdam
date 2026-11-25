"use client";

import { useEffect, useRef, useState } from "react";
import { EVENTS, privacyPath, guidelinesPath, type Dict, type Lang } from "@/lib/site";
import PhoneInput from "./PhoneInput";
import { quizType, quizTraits, type TypeKey } from "@/lib/quiz";
import { useSeats, isEventFull } from "@/lib/useSeats";
import { track } from "./Tracker";

// €12.50 incl. 21% VAT: VAT = 12.50 - 12.50/1.21 = 2.17; service costs = Stripe iDEAL fee. First coffee included.
const PAGES = 5;
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
    if (q.get("paid") === "1") { setState("ok"); setPaidBack(true); if (q.get("g")) setShareGroup(q.get("g")); }
    if (q.get("cancelled") === "1") setCancelled(true);
    const tk = q.get("ref"), gr = q.get("vriendin");
    if (tk) fetch(`/api/referral?token=${encodeURIComponent(tk)}`).then((r) => r.json()).then((d) => { if (d?.ok) setRef({ token: tk, name: d.first_name || "" }); }).catch(() => {});
    if (gr) fetch(`/api/referral?group=${encodeURIComponent(gr)}`).then((r) => r.json()).then((d) => { if (d?.ok) { setInvite({ group: gr, pct: d.pct, event: d.event_id, from: d.from || "" }); setEventId(d.event_id); } }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [answers, setAnswers] = useState<(number | null)[]>(() => t.quiz.map(() => null));
  const [step, setStep] = useState(0);
  // The form is split into small pages with a progress bar, so it never feels long.
  const [page, setPage] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [fieldOther, setFieldOther] = useState(false);
  const [hopeOther, setHopeOther] = useState(false);
  const [foundOther, setFoundOther] = useState(false);
  const [paidBack, setPaidBack] = useState(false);
  const type: TypeKey | null = quizType(answers);
  const traits = quizTraits(answers);
  const [started, setStarted] = useState(false);
  const touched = useRef(new Set<string>());
  useEffect(() => { if (type) track("form", "quiz_done", undefined, type); }, [type]);
  // The browser's own autofill (Bo… → Boanna) fills name, e-mail and phone. We no longer keep our own copy on the device.
  useEffect(() => { try { localStorage.removeItem("wma-me"); } catch {} }, []);
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
    if (page < PAGES - 1) { next(); return; }
    if (!form.checkValidity()) { const bad = form.querySelector<HTMLElement>(":invalid"); const pg = bad?.closest<HTMLElement>("[data-page]")?.dataset.page; if (pg) setPage(Number(pg)); setTimeout(() => form.reportValidity(), 50); return; }
    if (!type) { setStep(Math.max(0, answers.findIndex((x) => x === null))); form.querySelector("#quiz")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    const fd = new FormData(form);
    const body = {
      name: fd.get("name"), email: fd.get("email"), age: fd.get("age"), language: fd.get("language"),
      personality: type, quiz: answers,
      field: fieldOther ? `${fd.get("field")}: ${fd.get("field_other") || ""}` : fd.get("field"),
      hobbies: fd.get("hobbies"),
      phone: fd.get("phone") || "", contact_pref: fd.get("phone") ? "whatsapp_email" : "email",
      whatsapp_consent: !!fd.get("phone"),
      hoping: fd.getAll("hoping").map((h) => (hopeOther && h === t.j_hopes[t.j_hopes.length - 1] ? `${h}: ${fd.get("hope_other") || ""}` : h)), instagram: fd.get("instagram") ? `@${String(fd.get("instagram")).replace(/^@+/, "")}` : "",
      consent: fd.get("consent") === "on", newsletter: fd.get("newsletter") === "on", site_lang: lang,
      event_id: eventId, waitlist, found_via: foundOther ? `${fd.get("found_via")}: ${fd.get("found_other") || ""}` : fd.get("found_via"), table_wish: fd.get("table_wish"),
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
        {paidBack ? (
          <div className="ok ok-paid">
            <svg className="mug" viewBox="0 0 200 200" aria-hidden="true">
              <g className="steam" fill="none" stroke="#F3A9B8" strokeWidth="7" strokeLinecap="round">
                <path d="M78 70c-10-12 10-20 0-34" /><path d="M100 64c-10-12 10-20 0-34" /><path d="M122 70c-10-12 10-20 0-34" />
              </g>
              <g className="cup">
                <path d="M50 88h100l-10 62a20 20 0 0 1-20 16H80a20 20 0 0 1-20-16z" fill="#5A0F14" />
                <path d="M146 100c22-4 30 26 4 34" fill="none" stroke="#5A0F14" strokeWidth="9" strokeLinecap="round" />
                <path d="M84 118c6 8 26 8 32 0" fill="none" stroke="#F3A9B8" strokeWidth="5" strokeLinecap="round" />
                <circle cx="82" cy="108" r="4" fill="#F3A9B8" /><circle cx="118" cy="108" r="4" fill="#F3A9B8" />
              </g>
              <ellipse cx="100" cy="176" rx="62" ry="8" fill="#E4472F" opacity=".25" />
            </svg>
            <h3>{lang === "nl" ? "Je hebt een plek aan tafel!" : "You've got a seat at the table!"}</h3>
            <ol className="ok-steps">
              <li><b>💌 {lang === "nl" ? "Zodra je gematcht bent" : "Once you're matched"}</b><span>{lang === "nl" ? "krijg je een mailtje van ons." : "you'll get an e-mail from us."}</span></li>
              <li><b>📍 {lang === "nl" ? "2 dagen van tevoren" : "2 days before"}</b><span>{lang === "nl" ? "sturen we je het café en de voornamen van je tafelgenoten." : "we send you the café and your tablemates' first names."}</span></li>
              <li><b>☕ {lang === "nl" ? "Op de dag zelf" : "On the day"}</b><span>{lang === "nl" ? "schuif je gewoon aan. Wij zorgen voor de rest!" : "just show up. We'll take care of the rest!"}</span></li>
            </ol>
            <p className="ok-small">{lang === "nl" ? "Je betaalbewijs staat in je mail. Check ook even je spammap." : "Your receipt is in your inbox. Check your spam folder too."}</p>
          </div>
        ) : <div className="ok"><h3>{waitlist ? t.j_ok_wait_t : t.j_ok_t}</h3><p>{waitlist ? t.j_ok_wait_p : t.j_ok_p}</p></div>}
        <div>
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

  const nl = lang === "nl";
  const PAGE_NAMES = nl ? ["Jouw meetup", "Over jou", "Snelle quiz", "Contact", "Afronden"] : ["Your meetup", "About you", "Quick quiz", "Contact", "Finish"];
  function next() {
    const box = formRef.current?.querySelector<HTMLElement>(`[data-page="${page}"]`);
    if (box) {
      const bad = Array.from(box.querySelectorAll<HTMLInputElement>("input,select,textarea")).find((el) => !el.checkValidity());
      if (bad) { bad.reportValidity(); return; }
    }
    if (page === 2 && !type) { setStep(Math.max(0, answers.findIndex((x) => x === null))); return; }
    track("form", `page:${page + 2}`);
    setPage((n) => Math.min(PAGES - 1, n + 1));
    toTop();
  }
  // After a page change the form height changes: jump straight back to the top of the form (instant, so it can't overshoot).
  const toTop = () => requestAnimationFrame(() => requestAnimationFrame(() => {
    const f = formRef.current; if (!f) return;
    const y = f.getBoundingClientRect().top + window.scrollY - 110;
    if (Math.abs(window.scrollY - y) > 40) window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
  }));
  const back = () => { setPage((n) => Math.max(0, n - 1)); toTop(); };
  const nav = (last = false) => (
    <div className="full field fnav">
      {page > 0 && <button type="button" className="btn btn-ghost fback" onClick={back}>← {nl ? "Terug" : "Back"}</button>}
      {!last && <button type="button" className="btn btn-wine" onClick={next} disabled={page === 2 && !type}>{page === 2 && !type ? (nl ? `Nog ${answers.filter((a) => a === null).length} vraagjes` : `${answers.filter((a) => a === null).length} questions to go`) : (nl ? "Volgende →" : "Next →")}</button>}
    </div>
  );
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
    <form className="join" ref={formRef} autoComplete="on" onSubmit={onSubmit} noValidate onFocus={(e) => { if (!started) { setStarted(true); track("form", "start"); } const n = (e.target as unknown as HTMLInputElement).name?.replace(/^q\d$/, "quiz"); if (n && !touched.current.has(n)) { touched.current.add(n); track("form", `field:${n}`); } }}>
      {invite && <p className="full invite-banner" style={{ background: "var(--pink)", color: "var(--wine)", padding: "14px 18px", borderRadius: 16, fontWeight: 600 }}>
        {lang === "nl" ? `${invite.from || "Je vriendin"} heeft je uitgenodigd! Je krijgt ${invite.pct}% korting op je plek, op elke datum. Gebruik het e-mailadres dat zij heeft ingevuld.` : `${invite.from || "Your friend"} invited you! You get ${invite.pct}% off your seat, on any date. Use the e-mail address she filled in.`}
      </p>}
      <div className="full fprog" aria-live="polite">
        <div className="fprog-top"><b>{nl ? `Stap ${page + 1} van ${PAGES}` : `Step ${page + 1} of ${PAGES}`}</b><span>{PAGE_NAMES[page]}</span></div>
        <div className="fprog-bar"><span style={{ width: `${((page + 1) / PAGES) * 100}%` }} /></div>
        <ol className="fprog-dots">{PAGE_NAMES.map((n, i) => <li key={n} className={i < page ? "done" : i === page ? "on" : ""}>{i < page ? "✓" : i + 1}</li>)}</ol>
      </div>
      <div className="fstep" data-page="0" hidden={page !== 0}>
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
      {nav()}
      </div>
      <div className="fstep" data-page="1" hidden={page !== 1}>
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
      {nav()}
      </div>
      <div className="fstep" data-page="2" hidden={page !== 2}>
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
                      onChange={() => { setAnswers((a) => a.map((v, i) => (i === qi ? oi : v))); setTimeout(() => setStep(qi + 1), 110); }} />
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
          {typeInfo && traits ? (() => {
            const L = t.q_letters as Record<string, string>;
            const cols = ["#F2A7B8", "#E8503C", "#9DB48A", "#F6D58E"];
            const w = traits.code.split("").map((ch, k) => ({ ch, k, s: Math.max(traits.pct[k], 100 - traits.pct[k]) }));
            const tot = w.reduce((a, b) => a + b.s, 0);
            let acc = 0;
            const grad = w.map((x) => { const a = (acc / tot) * 360; acc += x.s; return `${cols[x.k]} ${a}deg ${(acc / tot) * 360}deg`; }).join(",");
            return (<div className="vibe">
              <div className="vibe-ring" style={{ background: `conic-gradient(${grad})` }}><span>{traits.code}</span></div>
              <div className="vibe-txt">
                <small>{t.q_result}</small><b className="vibe-name">{w.map((x) => L[x.ch]).join(" · ")}</b><span>{typeInfo[1]}</span>
                <ul className="vibe-legend">{w.map((x) => <li key={x.k}><i style={{ background: cols[x.k] }} />{x.ch} · {L[x.ch]} <em>{x.s}%</em></li>)}</ul>
                <p className="vibe-soft">{t.q_soft}</p>
              </div>
            </div>);
          })() : <span>☕ {answers.filter((a) => a !== null).length}/{t.quiz.length}</span>}
        </div>
      </fieldset>
      {nav()}
      </div>
      <div className="fstep" data-page="3" hidden={page !== 3}>
      <PhoneInput lang={lang} label={t.j_phone} />
      <small className="hint" style={{ marginTop: -6, gridColumn: "1 / -1" }}>{t.j_contact_note}</small>
      <div className="field full"><label className="l" htmlFor="fw">{t.j_wish}</label><textarea id="fw" name="table_wish" rows={3} maxLength={500} placeholder={t.j_wish_ph} /></div>
      <fieldset className="field full"><legend>{t.j_found}</legend><div onChange={(e) => { const el = e.target as HTMLInputElement; if (el.name === "found_via") setFoundOther(el.value === t.j_found_opts[t.j_found_opts.length - 1]); }}>{pills("found_via", t.j_found_opts, "radio", false)}</div>
        {foundOther && <input name="found_other" type="text" maxLength={120} placeholder={lang === "nl" ? "Vertel, hoe dan?" : "Tell us, how?"} style={{ marginTop: 8 }} />}</fieldset>
      <div className="field full"><label className="l" htmlFor="fi">{t.j_insta}</label><div className="at-input"><span aria-hidden="true">@</span><input id="fi" name="instagram" type="text" placeholder={lang === "nl" ? "jouwnaam" : "yourname"} autoComplete="off" autoCapitalize="none" spellCheck={false} onInput={(e) => { const el = e.currentTarget; if (el.value.startsWith("@")) el.value = el.value.replace(/^@+/, ""); }} /></div></div>
      <fieldset className="field full"><legend>{t.j_hoping}</legend>
        <div className="pills">
          {t.j_hopes.map((o, i) => (
            <label key={o}><input type="checkbox" name="hoping" value={o} onChange={i === t.j_hopes.length - 1 ? (e) => setHopeOther(e.currentTarget.checked) : undefined} /><span>{o}</span></label>
          ))}
        </div>
        {hopeOther && <input name="hope_other" type="text" maxLength={200} placeholder={t.j_hope_other} style={{ marginTop: 8 }} />}
      </fieldset>
      {nav()}
      </div>
      <div className="fstep" data-page="4" hidden={page !== 4}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="vh" aria-hidden="true" />
      {!waitlist && <div className="price-box">
        <h4>{t.pr_title}</h4>
        <div className="r"><span>{t.pr_seat}</span><span>€{PRICE.seat}</span></div>
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
      {waitlist ? (
        <label className="consent full field" style={{ flexDirection: "row" }}>
          <input type="checkbox" name="newsletter" />
          <span>{t.j_news}</span>
        </label>
      ) : null}
      <label className="consent full field" style={{ flexDirection: "row" }}>
        <input type="checkbox" name="consent" required />
        <span>{linkify(t.j_consent, lang)}</span>
      </label>
      <div className="full field" style={{ alignItems: "flex-start" }}>
        <button className="btn btn-wine" type="submit" disabled={state === "sending"}>{state === "sending" ? "…" : waitlist ? t.j_submit_wait : t.j_submit}</button>
        {state === "error" && <p style={{ color: "var(--tomato)", marginTop: 8 }}>{t.j_error}</p>}
        {!waitlist && <small className="hint" style={{ marginTop: 8 }}>{lang === "nl" ? "Je krijgt af en toe een mailtje over nieuwe meetups. Afmelden kan altijd, met één klik." : "We'll occasionally e-mail you about new meetups. Unsubscribe anytime, in one click."}</small>}
      </div>
      {nav(true)}
      </div>
    </form>
  );
}
