"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/site";

const L = {
  nl: {
    cafe: "Naam van je café", contact: "Jouw naam", email: "E-mail", phone: "Telefoon (mag leeg)", hood: "Buurt", link: "Website of Instagram",
    pkg: "Waar denk je aan?", opts: [["proeftafel", "Proeftafel (eenmalig)"], ["maand1", "1x per maand"], ["maand2", "2x per maand"], ["weet-niet", "Weet ik nog niet"]],
    msg: "Vertel iets over je café (sfeer, rustige momenten, hoeveel plek)", send: "Verstuur", busy: "Even geduld…",
    ok: "Dankjewel! Je aanvraag is binnen. Ik mail je binnen een paar dagen. ☕", err: "Dat ging mis. Mail ons gerust op hello@womensmeetupsinamsterdam.nl",
    privacy: "We gebruiken je gegevens alleen om contact met je op te nemen over een samenwerking.",
  },
  en: {
    cafe: "Café name", contact: "Your name", email: "E-mail", phone: "Phone (optional)", hood: "Neighbourhood", link: "Website or Instagram",
    pkg: "What are you thinking of?", opts: [["proeftafel", "Taster table (one time)"], ["maand1", "Once a month"], ["maand2", "Twice a month"], ["weet-niet", "Not sure yet"]],
    msg: "Tell us about your café (vibe, quiet times, how much space)", send: "Send", busy: "One moment…",
    ok: "Thank you! Your request is in. I'll e-mail you within a few days. ☕", err: "Something went wrong. Feel free to e-mail hello@womensmeetupsinamsterdam.com",
    privacy: "We only use your details to get in touch about working together.",
  },
} as const;

export default function PartnerForm({ lang }: { lang: Lang }) {
  const t = L[lang];
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [pkg, setPkg] = useState("weet-niet");
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("pakket");
    if (p && t.opts.some(([v]) => v === p)) setPkg(p);
    const onHash = () => { const q = new URLSearchParams(window.location.search).get("pakket"); if (q) setPkg(q); };
    window.addEventListener("popstate", onHash);
    return () => window.removeEventListener("popstate", onHash);
  }, [t.opts]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const r = await fetch("/api/partner", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, lang }) }).catch(() => null);
    setState(r && r.ok ? "ok" : "err");
  }

  if (state === "ok") return <p className="pt-ok">{t.ok}</p>;
  return (
    <form className="pt-form" onSubmit={submit} data-track="partner_form">
      <label>{t.cafe}<input name="cafe" required maxLength={120} /></label>
      <label>{t.contact}<input name="contact" required maxLength={80} autoComplete="name" /></label>
      <label>{t.email}<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
      <label>{t.phone}<input name="phone" type="tel" maxLength={24} autoComplete="tel" /></label>
      <label>{t.hood}<input name="neighbourhood" maxLength={60} /></label>
      <label>{t.link}<input name="link" maxLength={160} placeholder="instagram.com/…" /></label>
      <label className="full">{t.pkg}
        <select name="package" value={pkg} onChange={(e) => setPkg(e.target.value)}>
          {t.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <label className="full">{t.msg}<textarea name="message" rows={4} maxLength={1500} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <p className="full pt-privacy">{t.privacy}</p>
      <button className="btn btn-wine full" disabled={state === "busy"} data-track="partner_submit">{state === "busy" ? t.busy : t.send}</button>
      {state === "err" && <p className="full" style={{ color: "var(--tomato)" }}>{t.err}</p>}
    </form>
  );
}
