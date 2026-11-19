"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import type { Dict } from "@/lib/site";

export default function Deck({ t }: { t: Dict }) {
  const [i, setI] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const qs = t.questions;
  const n = i % qs.length;

  const next = () => {
    setI((v) => v + 1);
    if (top.current) gsap.fromTo(top.current, { rotate: -14, x: -60, opacity: 0 }, { rotate: -2, x: 0, opacity: 1, duration: 0.55, ease: "back.out(1.7)" });
  };

  return (
    <div className="wrap qgrid">
      <div>
        <span className="kicker" style={{ color: "var(--peach)" }}>{t.c_kicker}</span>
        <h2 className="title">{t.c_title}</h2>
        <p className="lead" style={{ margin: "16px 0 26px" }}>{t.c_text}</p>
        <button className="btn btn-pink" data-track="cards" onClick={next}>{t.c_btn}</button>
      </div>
      <div
        className="deck" id="deck" data-track="cards" role="button" tabIndex={0} aria-live="polite" onClick={next}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } }}
      >
        <div className="qcard scallop" />
        <div className="qcard scallop" />
        <div className="qcard scallop top" ref={top}>
          <span className="lbl">{t.c_label} {String(n + 1).padStart(2, "0")} / {String(qs.length).padStart(2, "0")}</span>
          <p className="q">{qs[n]}</p>
          <span className="brand">women&apos;s meetups ♥ Table of Six</span>
        </div>
      </div>
    </div>
  );
}
