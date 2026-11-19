"use client";

import { useEffect, useState } from "react";
import { track } from "./Tracker";

/** A/B test on the main button: variant A = current text, B = "save my seat" wording. Result shows in the dashboard. */
export default function HeroCta({ a, b }: { a: string; b: string }) {
  const [v, setV] = useState<"A" | "B" | null>(null);
  useEffect(() => {
    let x: "A" | "B";
    try { x = (localStorage.getItem("wma-ab-cta") as "A" | "B") || (Math.random() < 0.5 ? "A" : "B"); localStorage.setItem("wma-ab-cta", x); }
    catch { x = Math.random() < 0.5 ? "A" : "B"; }
    setV(x); track("exp", "hero_cta", undefined, x);
  }, []);
  return <a href="#join" className="btn btn-wine" data-track={`hero_cta_${v ?? "A"}`}>{v === "B" ? b : a}</a>;
}
