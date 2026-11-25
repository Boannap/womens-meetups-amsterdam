"use client";

import { useState } from "react";

/** Photos and videos go straight from her phone to private storage, in original quality (no compression on our side). */
const T = {
  nl: {
    t: "Deel je foto's en video's 📸", sub: "Heb je leuke foto's of filmpjes van de meetup? Zet ze hier neer, zoveel als je wilt. Alleen Boanna ziet ze.",
    hd: "Tip voor de beste kwaliteit: kies op je iPhone bovenin bij het kiezen op \"Opties\" de grootste of originele grootte. We bewaren alles precies zoals je het stuurt.",
    pick: "Kies foto's en video's", picked: (n: number) => `${n} bestand${n === 1 ? "" : "en"} gekozen`,
    limit: "Video's tot 50 MB per filmpje (ongeveer 30 tot 60 seconden). Langer? Stuur hem via WeTransfer naar hello@womensmeetupsinamsterdam.com.",
    consent: "Iedereen die erop staat, vindt het goed dat ik dit deel.",
    share: "Women's Meetups mag deze foto's en video's ook op Instagram of de website zetten.",
    send: "Versturen", sending: (a: number, b: number) => `Bezig met uploaden… ${a} van ${b}`, done: (n: number) => `Dankjewel! ${n} bestand${n === 1 ? "" : "en"} ontvangen 🤍`,
    skipped: (n: number) => `${n} bestand${n === 1 ? " was" : "en waren"} te groot of geen foto/video en ${n === 1 ? "is" : "zijn"} overgeslagen.`,
    more: "Nog meer delen", err: "Dat lukte niet. Probeer het nog eens, of mail ze naar hello@womensmeetupsinamsterdam.com.",
    early: "Je kunt foto's delen vanaf de dag van de meetup.", link: "Deze link werkt niet (meer). Gebruik de knop in je mail.", back: "Naar de website",
  },
  en: {
    t: "Share your photos & videos 📸", sub: "Got nice photos or clips from the meetup? Drop them here, as many as you like. Only Boanna can see them.",
    hd: "Tip for the best quality: on iPhone, tap \"Options\" at the top of the picker and choose the largest or original size. We keep everything exactly as you send it.",
    pick: "Choose photos and videos", picked: (n: number) => `${n} file${n === 1 ? "" : "s"} chosen`,
    limit: "Videos up to 50 MB each (about 30 to 60 seconds). Longer? Send it via WeTransfer to hello@womensmeetupsinamsterdam.com.",
    consent: "Everyone in them is fine with me sharing these.",
    share: "Women's Meetups may also post these photos and videos on Instagram or the website.",
    send: "Send", sending: (a: number, b: number) => `Uploading… ${a} of ${b}`, done: (n: number) => `Thank you! ${n} file${n === 1 ? "" : "s"} received 🤍`,
    skipped: (n: number) => `${n} file${n === 1 ? " was" : "s were"} too big or not a photo/video and ${n === 1 ? "was" : "were"} skipped.`,
    more: "Share more", err: "That didn't work. Please try again, or e-mail them to hello@womensmeetupsinamsterdam.com.",
    early: "You can share photos from the day of the meetup.", link: "This link doesn't work (anymore). Please use the button in your e-mail.", back: "To the website",
  },
};

type Slot = { path?: string; url?: string; error?: string };

function put(url: string, file: File, onProgress: (p: number) => void) {
  return new Promise<boolean>((resolve) => {
    const x = new XMLHttpRequest();
    x.open("PUT", url);
    x.setRequestHeader("x-upsert", "false");
    x.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(e.loaded / e.total); };
    x.onload = () => resolve(x.status >= 200 && x.status < 300);
    x.onerror = () => resolve(false);
    const fd = new FormData(); fd.append("cacheControl", "3600"); fd.append("", file);
    x.send(fd);
  });
}

export default function PhotoUpload({ lang, token, endpoint }: { lang: "nl" | "en"; token: string; endpoint: string }) {
  const t = T[lang];
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [share, setShare] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error" | "early" | "link">("idle");
  const [prog, setProg] = useState({ i: 0, n: 0, p: 0 });
  const [saved, setSaved] = useState(0);
  const [skipped, setSkipped] = useState(0);

  async function call(body: unknown) {
    const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);
    return { ok: !!r && r.ok, d: r ? await r.json().catch(() => ({})) : {} };
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!files.length || !consent) return;
    setState("sending"); setSkipped(0);
    let total = 0, skip = 0;
    for (let start = 0; start < files.length; start += 50) {
      const batch = files.slice(start, start + 50);
      const s = await call({ action: "sign", r: token, consent: true, files: batch.map((f) => ({ name: f.name, type: f.type, size: f.size })) });
      if (!s.ok) { setState(s.d?.error === "too early" ? "early" : s.d?.error === "link" ? "link" : "error"); return; }
      const slots: Slot[] = s.d.slots ?? [];
      const done: string[] = [];
      for (let k = 0; k < batch.length; k++) {
        const slot = slots[k];
        setProg({ i: start + k + 1, n: files.length, p: 0 });
        if (!slot?.url || !slot.path) { skip++; continue; }
        if (await put(slot.url, batch[k], (p) => setProg({ i: start + k + 1, n: files.length, p }))) done.push(slot.path); else skip++;
      }
      if (done.length) { const c = await call({ action: "done", r: token, share, paths: done }); total += c.d?.saved ?? 0; }
    }
    setSaved(total); setSkipped(skip); setFiles([]);
    setState(total > 0 ? "done" : "error");
  }

  return (
    <div style={{ background: "var(--paper)", borderRadius: 28, padding: "34px 30px", maxWidth: 560, width: "100%", border: "2px solid rgba(90,15,20,.1)" }}>
      <h1 className="display" style={{ fontSize: "2.2rem", color: "var(--wine)", marginBottom: 8 }}>{t.t}</h1>
      {state === "done" ? (
        <div style={{ display: "grid", gap: 14 }}>
          <p style={{ fontWeight: 700, color: "var(--wine)" }}>{t.done(saved)}</p>
          {skipped > 0 && <p style={{ color: "#8a6466" }}>{t.skipped(skipped)}</p>}
          <button className="btn" type="button" onClick={() => setState("idle")} style={{ justifySelf: "start" }}>{t.more}</button>
        </div>
      ) : (
        <form onSubmit={send} style={{ display: "grid", gap: 14 }}>
          <p>{t.sub}</p>
          <p style={{ fontSize: ".88rem", color: "#6b4245", background: "var(--cream)", borderRadius: 14, padding: "10px 14px" }}>{t.hd}</p>
          <label className="btn btn-wine" style={{ justifySelf: "start", cursor: "pointer" }}>
            {t.pick}
            <input type="file" accept="image/*,video/*" multiple hidden onChange={(e) => setFiles(Array.from(e.target.files ?? []))} />
          </label>
          <small style={{ color: "#8a6466" }}>{files.length ? t.picked(files.length) : t.limit}</small>
          {files.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
              {files.slice(0, 20).map((f, i) => f.type.startsWith("video")
                ? <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: "var(--wine)", color: "var(--pink)", display: "grid", placeItems: "center", fontSize: "1.4rem" }}>▶</div>
                : <img key={i} src={URL.createObjectURL(f)} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 10 }} />)}
            </div>
          )}
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: ".92rem" }}><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required /> {t.consent}</label>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: ".92rem" }}><input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} /> {t.share}</label>
          {state === "sending" && (
            <div>
              <div style={{ fontSize: ".9rem", marginBottom: 6 }}>{t.sending(prog.i, prog.n)}</div>
              <div style={{ background: "#ead9cc", borderRadius: 99, height: 8 }}><div style={{ background: "var(--wine)", borderRadius: 99, height: 8, width: `${Math.round(((prog.i - 1 + prog.p) / Math.max(1, prog.n)) * 100)}%` }} /></div>
            </div>
          )}
          <button className="btn btn-wine" type="submit" disabled={state === "sending" || !files.length || !consent} style={{ justifySelf: "start" }}>{t.send}</button>
          {state === "error" && <p style={{ color: "var(--tomato)" }}>{t.err}</p>}
          {state === "early" && <p style={{ color: "var(--tomato)" }}>{t.early}</p>}
          {state === "link" && <p style={{ color: "var(--tomato)" }}>{t.link}</p>}
        </form>
      )}
      <p style={{ marginTop: 22 }}><a href={lang === "nl" ? "https://womensmeetupsinamsterdam.nl" : "https://womensmeetupsinamsterdam.com"} style={{ color: "var(--tomato)" }}>{t.back}</a></p>
    </div>
  );
}
