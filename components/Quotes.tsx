"use client";

import { useEffect, useState } from "react";

type Q = { quote: string; first_name: string; rating: number | null };

/** Real reviews only: guests who allowed quoting, approved by Boanna in the dashboard. Hidden until there is at least one. */
export default function Quotes({ kicker, title }: { kicker: string; title: string }) {
  const [list, setList] = useState<Q[]>([]);
  useEffect(() => { fetch("/api/quotes").then((r) => r.json()).then((d) => Array.isArray(d) && setList(d)).catch(() => {}); }, []);
  if (!list.length) return null;
  return (
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
  );
}
