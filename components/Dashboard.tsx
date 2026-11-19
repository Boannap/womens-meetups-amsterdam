"use client";

import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Data = any;

const SECTION_NAMES: Record<string, string> = {
  top: "Bovenaan (header)", why: "Waarom het anders is", meetups: "Komende tafels", experience: "De ervaring", how: "Hoe het werkt", join: "Aanmeldformulier",
  faq: "Vragen", "new-friends": "Vriendinnen maken", reviews: "Reviews", gallery: "Foto's",
};
const TYPE_NAMES: Record<string, string> = { chatter: "Kletskous", connector: "Verbinder", explorer: "Ontdekker", listener: "Luisteraar" };
const BEST_NAMES: Record<string, string> = { people: "De meiden", cards: "De kaartjes", cafe: "Het café", vibe: "De sfeer" };
const AGAIN_NAMES: Record<string, string> = { yes: "Zeker", maybe: "Misschien", no: "Nee" };
const MATCH_NAMES: Record<string, string> = { "3": "Helemaal", "2": "Best wel", "1": "Niet echt" };

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

function Bars({ data, names, unit = "" }: { data: any; names?: Record<string, string>; unit?: string }) {
  const rows: [string, number][] = (Array.isArray(data) ? data : Object.entries(data || {})).map((r: any) => [String(r[0]), Number(r[1])] as [string, number]).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map((r) => Number(r[1])));
  if (!rows.length) return <p className="db-empty">Nog geen data</p>;
  return (
    <div className="db-bars">
      {rows.map(([k, v]) => (
        <div className="db-bar" key={k}>
          <span className="db-bl">{names?.[k] ?? k}</span>
          <span className="db-track"><span style={{ width: `${(Number(v) / max) * 100}%` }} /></span>
          <b>{v}{unit}</b>
        </div>
      ))}
    </div>
  );
}

function Card({ title, hint, children, wide }: { title: string; hint?: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <section className={`db-card${wide ? " wide" : ""}`}>
      <h3>{title}</h3>
      {hint && <p className="db-hint">{hint}</p>}
      {children}
    </section>
  );
}

export default function Dashboard() {
  const [pw, setPw] = useState(""); const [days, setDays] = useState(30);
  const [data, setData] = useState<Data | null>(null); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  async function load(p = pw, d = days) {
    setBusy(true); setErr("");
    const r = await fetch("/api/dashboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: p, days: d }) }).catch(() => null);
    setBusy(false);
    if (!r || !r.ok) { setErr("Dat wachtwoord klopt niet."); setData(null); return; }
    setData(await r.json());
    try { sessionStorage.setItem("wma-db", p); } catch {}
  }
  useEffect(() => { try { const s = sessionStorage.getItem("wma-db"); if (s) { setPw(s); load(s, days); } } catch {} }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function approve(id: string, approved: boolean) {
    await fetch("/api/dashboard", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw, approve: { id, approved } }) });
    load();
  }

  if (!data) {
    return (
      <main className="db-login">
        <form onSubmit={(e) => { e.preventDefault(); load(); }}>
          <h1 className="display">Jouw dashboard ☕</h1>
          <p>Alleen voor Boanna.</p>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Wachtwoord" autoComplete="current-password" />
          <button className="btn btn-wine" disabled={busy}>{busy ? "…" : "Open dashboard"}</button>
          {err && <p style={{ color: "var(--tomato)" }}>{err}</p>}
        </form>
      </main>
    );
  }

  const f = data.funnel || {}; const s = data.signups || {}; const rv = data.reviews || {};
  const steps: [string, number][] = [["Bezoekers", f.visit], ["Zagen de tafels", f.saw_events], ["Begonnen formulier", f.form_start], ["Quiz af", f.quiz_done], ["Aangemeld", f.submitted]];
  const drops = steps.slice(1).map(([k, v], i) => [k, pct(v, steps[i][1])] as [string, number]);
  const worst = drops.filter(([, p]) => f.visit > 10).sort((a, b) => a[1] - b[1])[0];
  const sections = (data.sections || []).map((x: any) => [SECTION_NAMES[x.label] ?? x.label, Number(x.secs)] as [string, number]);
  const topSection = sections[0];
  const exp = (data.experiment || []) as { variant: string; visitors: number; submitted: number }[];
  const byDay = (data.by_day || []) as { d: string; v: number }[]; const maxDay = Math.max(1, ...byDay.map((x) => x.v));

  return (
    <main className="db">
      <header className="db-head">
        <div>
          <h1 className="display">Dashboard</h1>
          <p>Women&apos;s Meetups in Amsterdam · eigen statistieken, zonder cookies</p>
        </div>
        <div className="db-days">
          {[7, 30, 90].map((d) => <button key={d} aria-pressed={days === d} onClick={() => { setDays(d); load(pw, d); }}>{d} dagen</button>)}
        </div>
      </header>

      <div className="db-kpis">
        <div><small>Bezoekers</small><b>{data.visitors}</b></div>
        <div><small>Aanmeldingen</small><b>{s.total}</b><em>{s.waitlist} wachtlijst</em></div>
        <div><small>Conversie</small><b>{pct(f.submitted, f.visit)}%</b><em>bezoek → aanmelding</em></div>
        <div><small>Gem. tijd op site</small><b>{data.avg_time ? `${Math.floor(data.avg_time / 60)}:${String(data.avg_time % 60).padStart(2, "0")}` : "-"}</b><em>min</em></div>
        <div><small>Reviewscore</small><b>{rv.avg_rating ?? "-"}</b><em>{rv.count} reviews</em></div>
      </div>

      <div className="db-insights">
        <h3>Wat valt op</h3>
        <ul>
          {worst ? <li>De grootste afhaak zit bij <b>{worst[0].toLowerCase()}</b>: maar {worst[1]}% gaat door naar die stap.</li> : <li>Nog te weinig bezoekers voor conclusies. Na zo&apos;n 50 bezoekers zie je hier tips.</li>}
          {topSection && <li>Mensen blijven het langst hangen bij <b>{topSection[0]}</b> (gem. {topSection[1]} sec).</li>}
          {exp.length === 2 && <li>Knoptest: variant A {pct(exp.find((e) => e.variant === "A")?.submitted ?? 0, exp.find((e) => e.variant === "A")?.visitors ?? 0)}% vs variant B {pct(exp.find((e) => e.variant === "B")?.submitted ?? 0, exp.find((e) => e.variant === "B")?.visitors ?? 0)}% aanmeldingen.</li>}
          {s.found_via && Object.keys(s.found_via).length > 0 && <li>De meeste meiden vinden je via <b>{Object.entries(s.found_via as Record<string, number>).sort((a, b) => b[1] - a[1])[0][0]}</b>.</li>}
        </ul>
      </div>

      <div className="db-grid">
        <Card title="Bezoekers per dag" wide>
          {byDay.length ? (
            <div className="db-days-chart">
              {byDay.map((x) => <div key={x.d} title={`${x.d}: ${x.v}`}><span style={{ height: `${(x.v / maxDay) * 100}%` }} /><small>{x.d.slice(8, 10)}</small></div>)}
            </div>
          ) : <p className="db-empty">Nog geen bezoekers</p>}
        </Card>

        <Card title="Van bezoek naar aanmelding" hint="Waar haken mensen af?" wide>
          <div className="db-funnel">
            {steps.map(([k, v], i) => (
              <div key={k}><span className="db-bl">{k}</span><span className="db-track"><span style={{ width: `${pct(v, f.visit || 1)}%` }} /></span><b>{v}</b>{i > 0 && <em>{pct(v, steps[i - 1][1])}%</em>}</div>
            ))}
          </div>
        </Card>

        <Card title="Waar blijven ze hangen" hint="Gemiddelde seconden per sectie"><Bars data={sections} unit="s" /></Card>
        <Card title="Hoe ver scrollen ze" hint="Aantal bezoekers dat zover kwam"><Bars data={Object.fromEntries(Object.entries(data.scroll || {}).map(([k, v]) => [`${k}%`, v as number]))} /></Card>
        <Card title="Waar klikken ze op"><Bars data={(data.clicks || []).map((x: any) => [x.label, x.n])} /></Card>
        <Card title="Waar komen ze vandaan"><Bars data={(data.referrers || []).map((x: any) => [x.r, x.n])} /></Card>
        <Card title="Apparaat"><Bars data={data.by_device} names={{ mobile: "Telefoon", tablet: "Tablet", desktop: "Laptop" }} /></Card>
        <Card title="Taal van de site"><Bars data={data.by_lang} names={{ nl: "Nederlands (.nl)", en: "Engels (.com)" }} /></Card>
        <Card title="Knoptest bovenaan" hint={`A = "Ik doe mee", B = "Reserveer mijn stoel"`}>
          <Bars data={exp.map((e) => [`Variant ${e.variant} (${e.visitors} bez.)`, pct(e.submitted, e.visitors)])} unit="%" />
        </Card>

        <h2 className="db-sub">Wie komen er</h2>
        <Card title="Type (quiz)"><Bars data={s.by_type} names={TYPE_NAMES} /></Card>
        <Card title="Leeftijd"><Bars data={s.by_age} /></Card>
        <Card title="Buurt"><Bars data={s.by_hood} /></Card>
        <Card title="Werkveld"><Bars data={s.by_field} /></Card>
        <Card title="Taal aan tafel"><Bars data={s.by_language} /></Card>
        <Card title="Wat ze hopen"><Bars data={s.hoping} /></Card>
        <Card title="Hoe ze je vonden"><Bars data={s.found_via} /></Card>
        <Card title="Formulier makkelijk?"><Bars data={s.form_ease} /></Card>
        <Card title="Met wie ze aan tafel willen" wide>
          {(s.wishes || []).length ? <ul className="db-list">{s.wishes.map((w: string, i: number) => <li key={i}>&ldquo;{w}&rdquo;</li>)}</ul> : <p className="db-empty">Nog geen wensen</p>}
        </Card>

        <h2 className="db-sub">Reviews na de meetup</h2>
        <Card title="Score (1-5)"><Bars data={rv.rating} /></Card>
        <Card title="Klikte het met de tafel?"><Bars data={rv.match} names={MATCH_NAMES} /></Card>
        <Card title="Komen ze terug?"><Bars data={rv.again} names={AGAIN_NAMES} /></Card>
        <Card title="Het leukst"><Bars data={rv.best} names={BEST_NAMES} /></Card>
        <Card title="Zinnetjes" hint="Zet aan wat op de website mag (alleen als zij toestemming gaven)" wide>
          {(rv.comments || []).length ? (
            <ul className="db-list">
              {rv.comments.map((c: any) => (
                <li key={c.id}>
                  &ldquo;{c.comment}&rdquo; <small>{c.first_name}{c.rating ? ` · ${c.rating}/5` : ""}</small>
                  {c.quote_ok ? <button className="db-toggle" aria-pressed={c.approved} onClick={() => approve(c.id, !c.approved)}>{c.approved ? "Staat op de site ✓" : "Op de site zetten"}</button> : <small className="db-no"> (geen toestemming)</small>}
                </li>
              ))}
            </ul>
          ) : <p className="db-empty">Nog geen reviews</p>}
        </Card>
      </div>
    </main>
  );
}
