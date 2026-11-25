"use client";

import { useEffect, useState } from "react";
import { INSTAGRAM } from "@/lib/site";

type Q = { quote: string; first_name: string; rating: number | null };

/** Real reviews only: guests who allowed quoting, approved by Boanna in the dashboard. Hidden until there is at least one. */
export default function Quotes({ kicker, title, ant }: { kicker: string; title: string; ant?: { kicker: string; title: string; by: string; quotes: string[] } }) {
  const [list, setList] = useState<Q[]>([]);
  useEffect(() => { fetch("/api/quotes").then((r) => r.json()).then((d) => Array.isArray(d) && setList(d)).catch(() => {}); }, []);
  const nl = ant?.by?.toLowerCase().includes("tafelgenote") ?? false;
  const anticipation = ant && ant.quotes.length ? (
    <section className="sec" id="looking-forward" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <span className="kicker">{ant.kicker}</span>
        <h2 className="title">{ant.title}</h2>
        <div className="quotes">
          {ant.quotes.map((q, i) => (
            <figure className="dm" key={i}>
              <div className="dm-top"><span className="dm-av" aria-hidden>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`/dm/a${i + 1}.jpg?v=2`} alt="" width={30} height={30} loading="lazy" /></span><div><b>{ant.by}</b><small>Instagram</small></div><svg className="dm-ig" viewBox="0 0 24 24" aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg></div>
              <blockquote className="dm-bubble">{q}</blockquote>
            </figure>
          ))}
        </div>
        <div className="ig-cta">
          <p><b>{nl ? "Alvast inspiratie opdoen? 📸" : "Want a sneak peek? 📸"}</b><br />{nl ? "Volg ons op Instagram voor de mooiste cafés, nieuwe datums en een kijkje achter de schermen. Zo blijf je als eerste op de hoogte!" : "Follow us on Instagram for the prettiest cafés, new dates and a look behind the scenes. That way you're always the first to know!"}</p>
          <a className="btn btn-wine" href={`https://www.instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener">{nl ? "Volg ons op Instagram" : "Follow us on Instagram"} ↗</a>
        </div>
      </div>
    </section>
  ) : null;
  if (!list.length) return anticipation;
  return (<>
    <section className="sec" id="reviews" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <span className="kicker">{kicker}</span>
        <h2 className="title">{title}</h2>
        <div className="quotes">
          {list.map((q, i) => (
            <figure className="quote reveal" key={i}>
              {q.rating ? <div className="stars" aria-label={`${q.rating}/5`}>{"♥".repeat(q.rating)}</div> : null}
              <blockquote>&ldquo;{q.quote}&rdquo;</blockquote>
              <figcaption>{q.first_name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
    {anticipation}
  </>);
}
