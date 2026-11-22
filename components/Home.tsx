import HeroCta from "./HeroCta";
import Quotes from "./Quotes";
import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { dict, EVENTS, MEETUP_PHOTOS, hostPath, homePath, type Lang } from "@/lib/site";
import Socials from "./Socials";
import Header from "./Header";
import Footer from "./Footer";
import Events from "./Events";
import Deck from "./Deck";
import JoinForm from "./JoinForm";
import JsonLd from "./JsonLd";
import { Icon } from "./SvgDefs";
import { tableSvg } from "@/lib/tableSvg";

const IC = [["var(--pink)", "var(--wine)"], ["var(--blush)", "var(--berry)"], ["var(--peach)", "var(--wine)"], ["var(--pink)", "var(--wine)"], ["#DCE6F2", "var(--blue)"], ["#E2E8D8", "var(--green)"]];

export default function Home({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const lines = t.hero_title.split("<br>");
  const marquee = [...t.marquee, ...t.marquee, ...t.marquee, ...t.marquee];

  return (
    <div lang={lang}>
      <Header lang={lang} alt={homePath(lang === "nl" ? "en" : "nl", lang)} />
      <main>
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow"><Icon id="heart" style={{ width: 14, height: 14, color: "var(--tomato)" }} />{t.hero_eyebrow}</span>
              <h1>
                <span className="big" id="heroBig">
                  {lines.map((line, li) => (
                    <span key={li} style={{ display: "block" }}>
                      {line.split(" ").map((w, wi) => <Fragment key={wi}><span className="w">{w}</span>{" "}</Fragment>)}
                    </span>
                  ))}
                </span>
                <span className="sub">{t.hero_h1sub}</span>
              </h1>
              <p className="lead">{t.hero_lead}</p>
              <div className="ctas">
                <HeroCta a={t.hero_cta1} b={t.hero_cta1_b} />
                <a href="#meetups" className="btn btn-ghost">{t.hero_cta2}</a>
              </div>
              <p className="note"><Icon id="cup" style={{ color: "var(--tomato)" }} />{t.hero_note}</p>
              <div className="promo"><small>{t.promo_k}</small><b>{t.promo}</b></div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="card-pink scallop" id="cardPink">
                <div className="inner"><b>Table<br />of Six</b><span>where friendships start</span></div>
              </div>
              <div className="receipt" id="receipt">
                <div className="c"><b>{t.r_head}</b><br />{t.r_table}<br />SUN 20 DEC · 14:00</div>
                <hr />
                <div className="row"><span>{t.r_seat}</span><span>€12.50</span></div>
                <div className="row"><span>{t.r_coffee}</span><span className="free">{t.r_free}</span></div>
                <div className="row"><span>{t.r_cards}</span><span className="free">{t.r_free}</span></div>
                <div className="row"><span>{t.r_talks}</span><span className="free">{t.r_free}</span></div>
                <div className="row"><span>{t.r_friends}</span><span className="free">{t.r_free}</span></div>
                <hr />
                <div className="row tot"><span>{t.r_total}</span><span>€12.50</span></div>
                <div className="row"><span>{t.r_mood}</span><span>{t.r_incl}</span></div>
                <hr />
                <div className="c">*** {t.r_thanks} ***</div>
                <div className="bar" />
              </div>
              <div className="hand-note">{t.r_hand}</div>
              <Icon id="cup" className="cup-hero" style={{ filter: "url(#wobble)" }} />
              <svg className="doodle" style={{ width: 38, height: 38, left: "40%", top: 0, color: "var(--tomato)" }} data-wiggle=""><use href="#sparkle" /></svg>
              <svg className="doodle" style={{ width: 26, height: 26, left: "8%", top: "30%" }} data-wiggle=""><use href="#heart" /></svg>
              <svg className="doodle" style={{ width: 22, height: 22, right: 0, top: "45%", color: "var(--blue)" }} data-wiggle=""><use href="#sparkle" /></svg>
            </div>
          </div>
        </section>

        <div style={{ overflow: "hidden", padding: "24px 0" }}>
          <div className="marquee" aria-hidden="true">
            <div className="track">{marquee.map((m, i) => <span key={i}>{m}</span>)}</div>
          </div>
        </div>

        {/* PREVIOUS MEETUPS */}
        <section className="gallery-sec" id="gallery">
          <div className="wrap" style={{ textAlign: "center" }}>
            <span className="kicker">{t.g_kicker}</span>
            <h2 className="title" style={{ margin: "0 auto" }}>{t.g_title}</h2>
            <p className="lead" style={{ margin: "14px auto 0" }}>{t.g_text}</p>
          </div>
          <div className="gallery" id="galleryRow">
            {MEETUP_PHOTOS.map((src, i) => (
              <figure className="polaroid" tabIndex={0} key={src}>
                <Image src={src} alt={t.g_alts[i]} width={360} height={450} sizes="220px" />
                <figcaption>{t.g_caps[i]}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* USP */}
        <section className="sec" id="why" style={{ paddingBottom: 40 }}>
          <div className="wrap">
            <div className="sec-head"><div>
              <span className="kicker">{t.u_kicker}</span>
              <h2 className="title" style={{ maxWidth: "20ch" }}>{t.u_title}</h2>
              <p className="lead" style={{ marginTop: 14 }}>{t.u_text}</p>
            </div></div>
            <div className="usp-grid">
              {t.usps.map(([h, p], i) => (
                <article className="usp reveal" key={h}>
                  <div className="ic" style={{ background: IC[i][0], color: IC[i][1] }}>{i + 1}</div>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MEETUPS */}
        <section className="sec" id="meetups">
          <div className="wrap">
            <div className="sec-head"><div>
              <span className="kicker">{t.m_kicker}</span>
              <h2 className="title">{t.m_title}</h2>
              <p className="lead" style={{ marginTop: 14 }}>{t.m_text}</p>
            </div></div>
            <Events lang={lang} t={t} events={EVENTS} />
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="sec exp" id="experience">
          <div className="wrap">
            <div className="sec-head"><div><span className="kicker">{t.e_kicker}</span><h2 className="title">{t.e_title}</h2></div></div>
            <div className="exp-grid">
              <article className="xcard scallop x1 reveal">
                <div className="ill" style={{ color: "var(--pink)" }}><svg viewBox="0 0 200 150" style={{ filter: "url(#wobble)" }}><use href="#cards" /></svg></div>
                <h3>{t.e1_t}</h3><p>{t.e1_p}</p>
              </article>
              <article className="xcard scallop x2 reveal">
                <div className="ill" style={{ color: "var(--tomato)" }}><svg viewBox="0 0 220 160" style={{ filter: "url(#wobble)" }}><use href="#hands" /></svg></div>
                <h3>{t.e2_t}</h3><p>{t.e2_p}</p>
              </article>
              <article className="xcard scallop wavy stripes x3 reveal">
                <div className="ill" style={{ color: "var(--paper)" }}><svg viewBox="0 0 200 230" style={{ filter: "url(#wobble)" }}><use href="#chair" /></svg></div>
                <div className="panel"><h3>{t.e3_t}</h3><p>{t.e3_p}</p></div>
              </article>
            </div>
          </div>
        </section>

        {/* HOW */}
        <section className="sec" id="how">
          <div className="wrap">
            <div className="table-band" style={{ marginBottom: 70 }}>
              <div><span className="kicker">{t.h_kicker}</span><h2 className="title">{t.h_title}</h2></div>
              <div>
                <div className="table-ill" id="tableIll" dangerouslySetInnerHTML={{ __html: tableSvg() }} />
              </div>
            </div>
            <div className="how-grid">
              {[[t.h1_t, t.h1_p], [t.h2_t, t.h2_p], [t.h3_t, t.h3_p], [t.h4_t, t.h4_p]].map(([h, p], i) => (
                <div className="step reveal" key={h}><div className="n">{i + 1}</div><h3>{h}</h3><p>{p}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* CONVERSATION CARDS */}
        <section className="sec qsec"><Deck t={t} /></section>

        {/* HOST */}
        <section className="sec host" id="host">
          <div className="wrap host-grid">
            <div className="portrait scallop" id="portrait">
              <Image src="/boanna.jpg" alt="Boanna Pieterse, founder of Women's Meetups in Amsterdam" fill sizes="(max-width: 900px) 90vw, 380px" style={{ objectFit: "cover" }} />
            </div>
            <div className="story">
              <span className="kicker">{t.b_kicker}</span>
              <h2 className="title" style={{ marginBottom: 18 }}>{t.b_title}</h2>
              <p>{t.b_story[0]}</p>
              <p>{t.b_short}</p>
              <Link className="btn btn-wine" href={hostPath(lang)}>{t.b_more}</Link>
              <Socials label={t.s_follow} />
            </div>
          </div>
        </section>

        {/* JOIN */}
        <section className="sec" id="join">
          <div className="wrap join-grid">
            <div className="sticky-desk">
              <span className="kicker">{t.j_kicker}</span>
              <h2 className="title">{t.j_title}</h2>
              <p className="lead" style={{ marginTop: 14 }}>{t.j_text}</p>
              <svg viewBox="0 0 200 200" style={{ width: 160, marginTop: 30, color: "var(--tomato)", filter: "url(#wobble)" }} aria-hidden="true"><use href="#cup" /></svg>
            </div>
            <JoinForm t={t} lang={lang} />
          </div>
        </section>

        {/* NEW FRIENDS (SEO) */}
        <section className="sec" id="new-friends" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <span className="kicker">{t.k_kicker}</span>
            <h2 className="title" style={{ maxWidth: "22ch" }}>{t.k_title}</h2>
            <p className="lead" style={{ marginTop: 14, maxWidth: "60ch" }}>{t.k_text}</p>
            <div className="usp-grid" style={{ marginTop: 34 }}>
              {t.k_items.map(([h, p]) => (
                <article className="usp reveal" key={h}>
                  <h3>{h}</h3>
                  <p>{p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Quotes kicker={t.rv_kicker} title={t.rv_title} ant={{ kicker: t.ant_kicker, title: t.ant_title, by: t.ant_by, quotes: t.ant_quotes }} />

        {/* FAQ */}
        <section className="sec" id="faq" style={{ paddingTop: 40 }}>
          <div className="wrap">
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <span className="kicker">{t.faq_kicker}</span>
              <h2 className="title" style={{ margin: "0 auto" }}>{t.faq_title}</h2>
            </div>
            <div className="faq">
              {t.faq.map(([q, a]) => (
                <details key={q}><summary data-track={`faq:${q.slice(0, 40)}`}>{q}<span className="pm">+</span></summary><p>{a}</p></details>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING */}
        <section className="sec closing">
          <div className="wrap">
            <svg className="chair" viewBox="0 0 200 230" id="chairEnd" style={{ filter: "url(#wobble)" }} aria-hidden="true"><use href="#chair" /></svg>
            <h2>{t.cl_title}</h2>
            <p>{t.cl_text}</p>
            <a href="#join" className="btn btn-wine">{t.cl_btn}</a>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
      <JsonLd lang={lang} />
    </div>
  );
}
