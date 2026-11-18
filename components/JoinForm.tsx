"use client";

import { useState } from "react";
import type { Dict, Lang } from "@/lib/site";

// €10 incl. 21% VAT: VAT = 10 - 10/1.21 = 1.74; service costs = Mollie iDEAL fee.
const PRICE = { total: "10.00", vat: "1.74", service: "0.32", seat: "7.94" };
const TYPES = ["INFJ", "INFP", "ENFJ", "ENFP", "INTJ", "INTP", "ENTJ", "ENTP", "ISFJ", "ISFP", "ESFJ", "ESFP", "ISTJ", "ISTP", "ESTJ", "ESTP"];

export default function JoinForm({ t, lang }: { t: Dict; lang: Lang }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const fd = new FormData(form);
    const body = {
      name: fd.get("name"), email: fd.get("email"), age: fd.get("age"), language: fd.get("language"),
      neighbourhood: fd.get("neighbourhood"), personality: fd.get("personality"), field: fd.get("field"),
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
      <div className="field">
        <label className="l" htmlFor="ft">{t.j_type}</label>
        <select id="ft" name="personality" required defaultValue="">
          <option value="">{t.j_choose}</option>
          {TYPES.map((x) => <option key={x}>{x}</option>)}
          <option>{t.j_type_unknown}</option>
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
