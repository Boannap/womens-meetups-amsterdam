"use client";

import { useState } from "react";
import { EMAIL, type Lang } from "@/lib/site";

const L = {
  nl: { name: "Je naam", email: "Je e-mail", topic: "Waar gaat het over?", opts: [["meetup", "Een vraag over een meetup"], ["aanmelding", "Een vraag over mijn boeking"], ["samenwerken", "Samenwerken (café, merk of pers)"], ["host", "Ik wil host worden"], ["idee", "Een idee of tip voor jullie"], ["anders", "Iets anders"]], msg: "Je bericht", send: "Verstuur", busy: "Even geduld…", ok: "Dankjewel! Je bericht is binnen. Je hoort binnen een paar dagen van me. ☕", err: "Dat ging mis. Mail ons gerust op", privacy: "We gebruiken je gegevens alleen om je bericht te beantwoorden.", news: "Ja, houd me op de hoogte van nieuwe tafels en events (nieuwsbrief). Afmelden kan altijd." },
  en: { name: "Your name", email: "Your e-mail", topic: "What's it about?", opts: [["meetup", "A question about a meetup"], ["aanmelding", "A question about my booking"], ["samenwerken", "Partnerships (café, brand or press)"], ["host", "I'd like to become a host"], ["idee", "An idea or tip for you"], ["anders", "Something else"]], msg: "Your message", send: "Send", busy: "One moment…", ok: "Thank you! Your message is in. You'll hear from me within a few days. ☕", err: "Something went wrong. Feel free to e-mail", privacy: "We only use your details to reply to your message.", news: "Yes, keep me posted about new tables and events (newsletter). Unsubscribe any time." },
} as const;

export default function ContactForm({ lang }: { lang: Lang }) {
  const t = L[lang];
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, newsletter: body.newsletter === "on", lang }) }).catch(() => null);
    setState(r && r.ok ? "ok" : "err");
  }
  if (state === "ok") return <p className="pt-ok">{t.ok}</p>;
  return (
    <form className="pt-form" onSubmit={submit} data-track="contact_form">
      <label>{t.name}<input name="name" required maxLength={80} autoComplete="name" /></label>
      <label>{t.email}<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
      <label className="full">{t.topic}
        <select name="topic" defaultValue="meetup">{t.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </label>
      <label className="full">{t.msg}<textarea name="message" rows={5} required maxLength={3000} /></label>
      <label className="full ct-news"><input type="checkbox" name="newsletter" /> <span>{t.news}</span></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <p className="full pt-privacy">{t.privacy}</p>
      <button className="btn btn-wine full" disabled={state === "busy"} data-track="contact_submit">{state === "busy" ? t.busy : t.send}</button>
      {state === "err" && <p className="full" style={{ color: "var(--tomato)" }}>{t.err} <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>}
    </form>
  );
}
