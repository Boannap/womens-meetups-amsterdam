"use client";

import { useState } from "react";

const T = {
  nl: {
    t: "Deel je foto's 📸", sub: "Heb je leuke foto's van de meetup? Zet ze hier neer. Alleen Boanna ziet ze.",
    pick: "Kies foto's", picked: (n: number) => `${n} foto${n === 1 ? "" : "'s"} gekozen`, max: "Maximaal 10 per keer.",
    consent: "Iedereen die op deze foto's staat, vindt het goed dat ik ze deel.",
    share: "Women's Meetups mag deze foto's ook op Instagram of de website zetten.",
    send: "Foto's versturen", sending: "Bezig met uploaden…", done: (n: number) => `Dankjewel! ${n} foto${n === 1 ? "" : "'s"} ontvangen 🤍`,
    more: "Nog meer foto's delen", err: "Dat lukte niet. Probeer het nog eens, of mail ze naar hello@womensmeetupsinamsterdam.com.",
    early: "Je kunt foto's delen vanaf de dag van de meetup.", link: "Deze link werkt niet (meer). Gebruik de knop in je mail.", back: "Naar de website",
  },
  en: {
    t: "Share your photos 📸", sub: "Got some nice photos from the meetup? Drop them here. Only Boanna can see them.",
    pick: "Choose photos", picked: (n: number) => `${n} photo${n === 1 ? "" : "s"} chosen`, max: "Up to 10 at a time.",
    consent: "Everyone in these photos is fine with me sharing them.",
    share: "Women's Meetups may also post these photos on Instagram or the website.",
    send: "Send photos", sending: "Uploading…", done: (n: number) => `Thank you! ${n} photo${n === 1 ? "" : "s"} received 🤍`,
    more: "Share more photos", err: "That didn't work. Please try again, or e-mail them to hello@womensmeetupsinamsterdam.com.",
    early: "You can share photos from the day of the meetup.", link: "This link doesn't work (anymore). Please use the button in your e-mail.", back: "To the website",
  },
};

export default function PhotoUpload({ lang, token, endpoint }: { lang: "nl" | "en"; token: string; endpoint: string }) {
  const t = T[lang];
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [share, setShare] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "early" | "link">("idle");
  const [saved, setSaved] = useState(0);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!files.length || !consent) return;
    setState("sending");
    const fd = new FormData();
    fd.append("r", token); fd.append("consent", "1"); fd.append("share", share ? "1" : "0");
    files.slice(0, 10).forEach((f) => fd.append("files", f));
    const r = await fetch(endpoint, { method: "POST", body: fd }).catch(() => null);
    const d = r ? await r.json().catch(() => ({})) : {};
    if (r && r.ok && d.ok) { setSaved(d.saved); setFiles([]); setState("done"); }
    else setState(d?.error === "too early" ? "early" : d?.error === "link" ? "link" : "error");
  }

  return (
    <div style={{ background: "var(--paper)", borderRadius: 28, padding: "34px 30px", maxWidth: 520, width: "100%", border: "2px solid rgba(90,15,20,.1)" }}>
      <h1 className="display" style={{ fontSize: "2.4rem", color: "var(--wine)", marginBottom: 8 }}>{t.t}</h1>
      {state === "done" ? (
        <div style={{ display: "grid", gap: 14 }}>
          <p style={{ fontWeight: 700, color: "var(--wine)" }}>{t.done(saved)}</p>
          <button className="btn" type="button" onClick={() => setState("idle")} style={{ justifySelf: "start" }}>{t.more}</button>
        </div>
      ) : (
        <form onSubmit={send} style={{ display: "grid", gap: 14 }}>
          <p>{t.sub}</p>
          <label className="btn btn-wine" style={{ justifySelf: "start", cursor: "pointer" }}>
            {t.pick}
            <input type="file" accept="image/*" multiple hidden onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 10))} />
          </label>
          <small style={{ color: "#8a6466" }}>{files.length ? t.picked(files.length) : t.max}</small>
          {files.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {files.map((f, i) => <img key={i} src={URL.createObjectURL(f)} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 10 }} />)}
            </div>
          )}
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: ".92rem" }}><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required /> {t.consent}</label>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: ".92rem" }}><input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} /> {t.share}</label>
          <button className="btn btn-wine" type="submit" disabled={state === "sending" || !files.length || !consent} style={{ justifySelf: "start" }}>{state === "sending" ? t.sending : t.send}</button>
          {state === "error" && <p style={{ color: "var(--tomato)" }}>{t.err}</p>}
          {state === "early" && <p style={{ color: "var(--tomato)" }}>{t.early}</p>}
          {state === "link" && <p style={{ color: "var(--tomato)" }}>{t.link}</p>}
        </form>
      )}
      <p style={{ marginTop: 22 }}><a href={lang === "nl" ? "https://womensmeetupsinamsterdam.nl" : "https://womensmeetupsinamsterdam.com"} style={{ color: "var(--tomato)" }}>{t.back}</a></p>
    </div>
  );
}
