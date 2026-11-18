"use client";

import { useState } from "react";
import type { Dict, Lang } from "@/lib/site";
import { quizType, type TypeKey } from "@/lib/quiz";

// €10 incl. 21% VAT: VAT = 10 - 10/1.21 = 1.74; service costs = Mollie iDEAL fee.
const PRICE = { total: "10.00", vat: "1.74", service: "0.32", seat: "7.94" };

export default function JoinForm({ t, lang }: { t: Dict; lang: Lang }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [answers, setAnswers] = useState<(number | null)[]>(() => t.quiz.map(() => null));
  const [contact, setContact] = useState<"whatsapp_email" | "email">("whatsapp_email");
  const type: TypeKey | null = quizType(answers);
  const typeInfo = type ? (t.types as Record<TypeKey, string[]>)[type] : null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    if (!type) { form.querySelector<HTMLInputElement>("#quiz input")?.focus(); return; }
    const fd = new FormData(form);
    const body = {
      name: fd.get("name"), email: fd.get("email"), age: fd.get("age"), language: fd.get("language"),
      neighbourhood: fd.get("neighbourhood"), personality: type, quiz: answers, field: fd.get("field"),
      phone: contact === "whatsapp_email" ? fd.get("phone") : "", contact_pref: contact,
      whatsapp_consent: contact === "whatsapp_email" && fd.get("wa_consent") === "on",
      hoping: fd.getAll("hoping"), days: fd.getAll("days"), instagram: fd.get("instagram"),
      consent: fd.get("consent") === "on", site_lang: lang,
      website: fd.get("website"), // honeypot, must stay empty
    };
    setState("sending");
    try {
      const res = await fetch("/api/signup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="join" style={{ display: "block" }}>
        <div className="ok"><h3>{t.j_ok_t}</h3><p>{t.j_ok_p}</p></div>
      </div>
    );
  }

  const pills = (name: string, arr: string[], type: "radio" | "checkbox") => (
    <div className="pills">
      {arr.map((o, i) => (
        <label key={o}>
          <input type={type} name={name} value={o} required={type === "radio" && i === 0} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );

  return (
    <form className="join" onSubmit={onSubmit} noValidate>
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
        {t.quiz.map(([q, opts], qi) => (
          <div className="quiz-q" key={q as string}>
            <p className="quiz-n">{qi + 1}/{t.quiz.length} · {q as string}</p>
            <div className="pills">
              {(opts as string[]).map((o, oi) => (
                <label key={o}>
                  <input type="radio" name={`q${qi}`} value={oi} checked={answers[qi] === oi}
                    onChange={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
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
      <div className="field full"><label className="l" htmlFor="fi">{t.j_insta}</label><input id="fi" name="instagram" type="text" placeholder="@" /></div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="vh" aria-hidden="true" />
      <div className="price-box">
        <h4>{t.pr_title}</h4>
        <div className="r"><span>{t.pr_seat}</span><span>€{PRICE.seat}</span></div>
        <div className="r"><span>{t.pr_service}</span><span>€{PRICE.service}</span></div>
        <div className="r"><span>{t.pr_vat}</span><span>€{PRICE.vat}</span></div>
        <div className="r t"><span>{t.pr_total}</span><span>€{PRICE.total}</span></div>
        <small>{t.pr_note}</small>
      </div>
      <label className="consent full field" style={{ flexDirection: "row" }}>
        <input type="checkbox" name="consent" required />
        <span>{t.j_consent}</span>
      </label>
      <div className="full field" style={{ alignItems: "flex-start" }}>
        <button className="btn btn-wine" type="submit" disabled={state === "sending"}>{state === "sending" ? "…" : t.j_submit}</button>
        {state === "error" && <p style={{ color: "var(--tomato)", marginTop: 8 }}>{t.j_error}</p>}
      </div>
    </form>
  );
}
