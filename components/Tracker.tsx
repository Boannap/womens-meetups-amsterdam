"use client";

import { useEffect } from "react";

/**
 * Privacy-friendly analytics for Boanna's own dashboard.
 * No cookies, no IP, no third parties: a random id per browser tab (sessionStorage),
 * page views, scroll depth, time spent per section, clicks on buttons/links, form steps and the A/B test.
 * Everything is sent in small batches to /api/track.
 */
type Ev = { type: string; label?: string; value?: number; variant?: string };

let queue: Ev[] = [];
let ctx: Record<string, string> | null = null;

function sid() {
  try {
    let s = sessionStorage.getItem("wma-sid");
    if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("wma-sid", s); }
    return s;
  } catch { return "nosession"; }
}

function flush(beacon = false) {
  if (!queue.length || !ctx) return;
  const body = JSON.stringify({ ...ctx, events: queue.splice(0, 60) });
  if (beacon && navigator.sendBeacon) navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
  else fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
}

/** Call from anywhere (e.g. the join form) to record an event. */
export function track(type: string, label?: string, value?: number, variant?: string) {
  queue.push({ type, label, value, variant });
  if (queue.length >= 20) flush();
}

export default function Tracker() {
  useEffect(() => {
    if (navigator.webdriver || /bot|crawl|spider/i.test(navigator.userAgent)) return;
    if (/^\/(dashboard|review)/.test(location.pathname)) return;
    const w = window.innerWidth;
    let ref = "";
    try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : ""; } catch {}
    if (ref === location.hostname.replace(/^www\./, "")) ref = "";
    const q = new URLSearchParams(location.search);
    ctx = {
      sid: sid(), path: location.pathname,
      lang: (document.querySelector("[lang]:not(html)")?.getAttribute("lang") || document.documentElement.lang) === "nl" ? "nl" : "en",
      device: w < 700 ? "mobile" : w < 1100 ? "tablet" : "desktop",
      ref, utm: [q.get("utm_source"), q.get("utm_campaign")].filter(Boolean).join("/"),
    };
    track("view", location.pathname);
    const start = performance.now();

    // Scroll depth milestones
    const hit = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      const pct = h > 0 ? (scrollY / h) * 100 : 100;
      for (const m of [25, 50, 75, 100]) if (pct >= m - 1 && !hit.has(m)) { hit.add(m); track("scroll", String(m)); }
    };
    addEventListener("scroll", onScroll, { passive: true });

    // Time spent per section (only while at least 40% is visible)
    const seen = new Map<string, { since: number | null; total: number }>();
    const io = new IntersectionObserver((entries) => {
      const now = performance.now();
      for (const e of entries) {
        const id = (e.target as HTMLElement).id; const s = seen.get(id) ?? { since: null, total: 0 };
        if (e.isIntersecting && s.since === null) s.since = now;
        if (!e.isIntersecting && s.since !== null) { s.total += now - s.since; s.since = null; }
        seen.set(id, s);
      }
    }, { threshold: 0.4 });
    document.querySelectorAll("section[id], header[id], footer[id]").forEach((el) => io.observe(el));

    // Clicks on links and buttons
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a,button,summary,[data-track]") as HTMLElement | null;
      if (!el) return;
      const label = el.dataset.track || el.getAttribute("href") || (el.textContent || "").trim().slice(0, 40);
      track("click", label);
    };
    document.addEventListener("click", onClick, { capture: true });

    const timer = setInterval(() => flush(), 15000);
    const leave = () => {
      const now = performance.now();
      seen.forEach((s, id) => { const t = s.total + (s.since !== null ? now - s.since : 0); if (t > 800) track("section", id, t / 1000); s.total = 0; s.since = s.since !== null ? now : null; });
      track("time", location.pathname, (now - start) / 1000);
      flush(true);
    };
    const onVis = () => { if (document.visibilityState === "hidden") leave(); };
    document.addEventListener("visibilitychange", onVis);
    addEventListener("pagehide", leave);
    return () => {
      removeEventListener("scroll", onScroll); document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("visibilitychange", onVis); removeEventListener("pagehide", leave); clearInterval(timer); io.disconnect();
    };
  }, []);
  return null;
}
