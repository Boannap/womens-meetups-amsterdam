"use client";

import { useEffect, useState } from "react";
import { useSeats, isEventFull, capacity, takenTotal } from "@/lib/useSeats";
import type { Dict, Lang, MeetupEvent } from "@/lib/site";

export default function Events({ lang, t, events }: { lang: Lang; t: Dict; events: MeetupEvent[] }) {
  const seats = useSeats();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const nl = lang === "nl";
  const countdown = (iso: string) => {
    if (now === null) return null;
    let s = Math.max(0, Math.floor((new Date(iso).getTime() - now) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400; const h = Math.floor(s / 3600); s -= h * 3600; const m = Math.floor(s / 60); s -= m * 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return <span className="cd" aria-label={nl ? `Nog ${d} dagen` : `${d} days to go`}>⏳ {nl ? "nog " : ""}<b>{d}</b>{nl ? "d" : "d"} <b>{pad(h)}</b>{nl ? "u" : "h"} <b>{pad(m)}</b>m <b>{pad(s)}</b>s{nl ? "" : " to go"}</span>;
  };
  const locale = lang === "nl" ? "nl-NL" : "en-GB";
  const fmt = (d: string, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { timeZone: "Europe/Amsterdam", ...o }).format(new Date(d));

  const list = events
    .filter((e) => new Date(e.end) > new Date());

  return (
    <>
      <div className="events">
        {list.length === 0 && <p className="empty">{t.ev_none}</p>}
        {list.map((e) => {
          const left = isEventFull(e, seats) ? 0 : Math.max(0, capacity(e, seats) - takenTotal(e, seats));
          return (
            <article className="ev" key={e.id}>
              <div className="ev-date scallop">
                <div className="d">{fmt(e.date, { day: "numeric" })}</div>
                <div className="m">{fmt(e.date, { month: "short" })}</div>
              </div>
              <div>
                <h3>{e.title[lang]}</h3>
                <div className="meta">
                  <span>🕑 <time dateTime={e.date}>{fmt(e.date, { weekday: "long" })} {fmt(e.date, { hour: "2-digit", minute: "2-digit" })}</time> - {fmt(e.end, { hour: "2-digit", minute: "2-digit" })}</span>
                  <span>📍 {e.areas} · {t.ev_cafe}</span>
                </div>
              </div>
              <div className="ev-r">
                {left > 0 && countdown(e.date)}
                {left > 0 ? <span className="left">{lang === "nl" ? "Plekken beschikbaar" : "Seats available"}</span> : <span className="left soldout">{t.ev_soldout}</span>}
                <span className="price">{t.ev_price}</span>
                <a className="btn btn-wine" href="#join" onClick={() => window.dispatchEvent(new CustomEvent("wma:pick-event", { detail: e.id }))}>{left > 0 ? t.ev_reserve : t.ev_full}</a>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
