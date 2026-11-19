"use client";

import { useState } from "react";

const T = {
  nl: { t: "Dankjewel! 🤍", saved: "Je antwoord is opgeslagen. Tik in de mail gerust nog meer aan.", q: "Nog iets kwijt? Eén zinnetje is genoeg.", ph: "Wat maakte het leuk, of wat kan beter?", ok: "Mijn tekst mag (met alleen mijn voornaam) op de website.", send: "Versturen", done: "Top, ontvangen! Tot de volgende tafel ☕", err: "Dat lukte niet, probeer het nog eens.", back: "Naar de website" },
  en: { t: "Thank you! 🤍", saved: "Your answer is saved. Feel free to tap more answers in the e-mail.", q: "Anything else? One sentence is plenty.", ph: "What made it great, or what could be better?", ok: "My words may appear on the website (first name only).", send: "Send", done: "Got it, thank you! See you at the next table ☕", err: "That didn't work, please try again.", back: "To the website" },
};

export default function ReviewForm({ lang, token, saved }: { lang: "nl" | "en"; token: string; saved: boolean }) {
  const t = T[lang];
  const [text, setText] = useState(""); const [ok, setOk] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  async function send(e: React.FormEvent) {
    e.preventDefault(); if (!text.trim()) return;
    setState("sending");
    const r = await fetch("/api/review-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ r: token, comment: text, quote_ok: ok }) }).catch(() => null);
    setState(r && r.ok ? "done" : "error");
  }
  return (
    <div style={{ background: "var(--paper)", borderRadius: 28, padding: "34px 30px", maxWidth: 520, width: "100%", border: "2px solid rgba(90,15,20,.1)" }}>
      <h1 className="display" style={{ fontSize: "2.4rem", color: "var(--wine)", marginBottom: 8 }}>{t.t}</h1>
      {saved && <p style={{ marginBottom: 18 }}>{t.saved}</p>}
      {state === "done" ? <p style={{ fontWeight: 700, color: "var(--wine)" }}>{t.done}</p> : (
        <form onSubmit={send} style={{ display: "grid", gap: 12 }}>
          <label className="l" htmlFor="rv">{t.q}</label>
          <textarea id="rv" rows={4} maxLength={600} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.ph} />
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: ".92rem" }}><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /> {t.ok}</label>
          <button className="btn btn-wine" type="submit" disabled={state === "sending"} style={{ justifySelf: "start" }}>{state === "sending" ? "…" : t.send}</button>
          {state === "error" && <p style={{ color: "var(--tomato)" }}>{t.err}</p>}
        </form>
      )}
      <p style={{ marginTop: 22 }}><a href={lang === "nl" ? "https://womensmeetupsinamsterdam.nl" : "https://womensmeetupsinamsterdam.com"}>{t.back} →</a></p>
    </div>
  );
}
