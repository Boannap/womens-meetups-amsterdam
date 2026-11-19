"use client";
import { useEffect, useState } from "react";
import type { MeetupEvent } from "./site";

/** Live seat counts from sign-ups, so an event switches to waitlist by itself when it's full. */
export function useSeats() {
  const [seats, setSeats] = useState<Record<string, number>>({});
  useEffect(() => { fetch("/api/seats").then((r) => (r.ok ? r.json() : {})).then(setSeats).catch(() => {}); }, []);
  return seats;
}
export const capacity = (e: MeetupEvent) => e.tables.length * 6;
export const takenTotal = (e: MeetupEvent, seats: Record<string, number>) => Math.max(e.tables.reduce((n, tb) => n + tb.taken, 0), seats[e.id] ?? 0);
export const isEventFull = (e: MeetupEvent, seats: Record<string, number>) => !!e.soldOut || takenTotal(e, seats) >= capacity(e);
