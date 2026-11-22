"use client";
import { useEffect, useState } from "react";
import type { MeetupEvent } from "./site";

/**
 * Live seat counts and open tables per date. Every date starts with ONE open table (6 seats);
 * Boanna opens more (max 4, the tables listed in events.json) from the dashboard. Full = waitlist.
 */
export type SeatData = { seats: Record<string, number>; open: Record<string, number> };
export function useSeats(): SeatData {
  const [data, setData] = useState<SeatData>({ seats: {}, open: {} });
  useEffect(() => {
    fetch("/api/seats").then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setData({ seats: d.seats ?? {}, open: d.open ?? {} })).catch(() => {});
  }, []);
  return data;
}
export const openTables = (e: MeetupEvent, d: SeatData) => Math.max(1, Math.min(e.tables.length, d.open[e.id] ?? 1));
export const capacity = (e: MeetupEvent, d: SeatData) => (e.soldOut ? e.tables.length : openTables(e, d)) * 6;
export const takenTotal = (e: MeetupEvent, d: SeatData) => Math.max(e.tables.reduce((n, tb) => n + tb.taken, 0), d.seats[e.id] ?? 0);
export const isEventFull = (e: MeetupEvent, d: SeatData) => !!e.soldOut || takenTotal(e, d) >= capacity(e, d);
