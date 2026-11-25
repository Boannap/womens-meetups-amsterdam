"use client";

import { useEffect, useState } from "react";
import { useSeats, isEventFull } from "@/lib/useSeats";
import type { Lang, MeetupEvent } from "@/lib/site";

/** Hero chip: the next date that still has seats, with a link down to the tables. */
export default function NextTable({ lang, events }: { lang: Lang; events: MeetupEvent[] }) {
  const seats = useSeats();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  if (now === null) return null;
  const next = events.find((e) => new Date(e.end).getTime() > now && !isEventFull(e, seats));
  if (!next) return null;
  const nl = lang === "nl";
  const d = new Intl.DateTimeFormat(nl ? "nl-NL" : "en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Amsterdam" }).format(new Date(next.date));
  const days = Math.max(0, Math.floor((new Date(next.date).getTime() - now) / 86400000));
  return (
    <a href="#meetups" className="next-chip" data-track="hero_next_table">
      <span className="dot" aria-hidden="true" />
      <span>{nl ? <>Eerstvolgende tafel: <b>{d}</b> · nog plekken<span className="nt-days"> · over {days} dagen</span></> : <>Next table: <b>{d}</b> · seats left<span className="nt-days"> · in {days} days</span></>}</span>
      <span aria-hidden="true">→</span>
    </a>
  );
}
