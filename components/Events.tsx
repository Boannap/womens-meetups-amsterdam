"use client";

import { useSeats, isEventFull, capacity, takenTotal } from "@/lib/useSeats";
import type { Dict, Lang, MeetupEvent } from "@/lib/site";

export default function Events({ lang, t, events }: { lang: Lang; t: Dict; events: MeetupEvent[] }) {
  const seats = useSeats();
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
