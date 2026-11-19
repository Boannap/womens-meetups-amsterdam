import Link from "next/link";
import { homePath, partnerPath, absUrl, pubPath, type Lang } from "@/lib/site";
import { LANDINGS, LANDING_ROUTES, type LandingKey } from "@/lib/landings";
import Header from "./Header";
import Footer from "./Footer";
import JsonLd from "./JsonLd";

export default function LandingPage({ lang, page }: { lang: Lang; page: LandingKey }) {
  const t = LANDINGS[page][lang];
  const home = homePath(lang);
  const other: Lang = lang === "nl" ? "en" : "nl";
  const alt = absUrl(other, LANDING_ROUTES[page][other]);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  const more = (Object.keys(LANDINGS) as LandingKey[]).filter((k) => k !== page);
  return (
    <div lang={lang}>
      <Header lang={lang} alt={alt} />
      <main className="landing">
        <section className="sec">
          <div className="wrap ld-wrap">
            <span className="kicker">{t.kicker}</span>
            <h1 className="pt-h1">{t.h1}</h1>
            <p className="pt-intro">{t.intro}</p>
            <a href={`${home === "/" ? "" : home}/#meetups`} className="btn btn-wine">{t.cta} →</a>
          </div>
        </section>
        <section className="sec">
          <div className="wrap ld-wrap">
            {t.blocks.map((b) => (
              <div key={b.h} className="ld-block">
                <h2>{b.h}</h2>
                <p>{b.p}</p>
                {page === "cafes" && b === t.blocks[t.blocks.length - 1] && (
                  <p><Link href={partnerPath(lang)} className="btn btn-pink">{lang === "nl" ? "Voor cafés: samenwerken" : "For cafés: partner with us"} →</Link></p>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="sec">
          <div className="wrap ld-wrap">
            <h2 className="title">{lang === "nl" ? "Vragen" : "Questions"}</h2>
            <div className="ld-faq">
              {t.faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
            </div>
            <div className="ctas" style={{ marginTop: 28 }}>
              <a href={`${home === "/" ? "" : home}/#join`} className="btn btn-wine">{lang === "nl" ? "Ik doe mee" : "I'm in"} →</a>
            </div>
            <nav className="ld-more" aria-label={lang === "nl" ? "Lees ook" : "Read more"}>
              <h3>{lang === "nl" ? "Lees ook" : "Read more"}</h3>
              <ul>{more.map((k) => <li key={k}><Link href={pubPath(lang, LANDING_ROUTES[k][lang])}>{LANDINGS[k][lang].nav}</Link></li>)}</ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
      <JsonLd lang={lang} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </div>
  );
}
