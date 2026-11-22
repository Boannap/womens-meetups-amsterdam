"use client";

import { useSeats, isEventFull, capacity, takenTotal, openTables } from "@/lib/useSeats";
import { useState } from "react";
import type { Dict, Lang, MeetupEvent, TableLang } from "@/lib/site";

type Filter = "all" | TableLang;

export default function Events({ lang, t, events }: { lang: Lang; t: Dict; events: MeetupEvent[] }) {
  const seats = useSeats();
  const [filter, setFilter] = useState<Filter>("all");
  const locale = lang === "nl" ? "nl-NL" : "en-GB";
  const fmt = (d: string, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale, { timeZone: "Europe/Amsterdam", ...o }).format(new Date(d));
  const langName = (l: TableLang) => (l === "nl" ? t.ev_lang_nl : l === "en" ? t.ev_lang_en : t.ev_lang_mix);

  const list = events
    .filter((e) => new Date(e.end) > new Date())
    .filter((e) => filter === "all" || (e.soldOut ? e.tables : e.tables.slice(0, openTables(e, seats))).some((tb) => tb.lang === filter));

  const chips: [Filter, string][] = [["all", t.f_all], ["nl", t.f_nl], ["en", t.f_en], ["mix", t.f_mix]];

  return (
    <>
      <div className="filters" role="group" aria-label="Language filter" style={{ marginBottom: 24 }}>
        {chips.map(([f, label]) => (
          <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{label}</button>
        ))}
      </div>
      <div className="events">
        {list.length === 0 && <p className="empty">{t.ev_none}</p>}
        {list.map((e) => {
          // Only the open tables are shown; real sign-ups fill the seats table by table.
          let rest = takenTotal(e, seats);
          const shown = (e.soldOut ? e.tables : e.tables.slice(0, openTables(e, seats))).map((tb) => { const n = Math.min(6, Math.max(tb.taken, rest)); rest -= n; return { ...tb, taken: n }; });
          const tables = shown.filter((tb) => filter === "all" || tb.lang === filter);
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
                  <span>☕ {tables.length} {t.ev_tables}</span>
                </div>
                <div className="tables">
                  {tables.map((tb, i) => (
                    <div className="tbl" key={i}>
                      <small>{langName(tb.lang)}</small>
                      <div className="seats" aria-label={`${tb.taken}/6`}>
                        {Array.from({ length: 6 }, (_, s) => <span key={s} className={`seat ${s < tb.taken ? "on" : ""}`} />)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ev-r">
                {left > 0 ? <span className="left">{left} {t.ev_spots}</span> : <span className="left soldout">{t.ev_soldout}</span>}
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
