import Link from "next/link";
import Image from "next/image";
import { dict, homePath, hostPath, type Lang } from "@/lib/site";
import Header from "./Header";
import Footer from "./Footer";
import JsonLd from "./JsonLd";
import Socials from "./Socials";

/** "Meet Boanna": the host's own story. Swap the placeholder for a real photo (see comment). */
export default function HostPage({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const home = homePath(lang);
  return (
    <div lang={lang}>
      <Header lang={lang} alt={hostPath(lang === "nl" ? "en" : "nl")} />
      <main>
        <section className="sec host" style={{ minHeight: "80vh" }}>
          <div className="wrap host-grid" style={{ alignItems: "start" }}>
            <div className="sticky-desk">
              <div className="portrait scallop" id="portrait">
                <Image src="/boanna.jpg" alt="Boanna Pieterse, founder of Women's Meetups in Amsterdam" fill sizes="(max-width: 900px) 90vw, 380px" style={{ objectFit: "cover" }} />
              </div>
            </div>
            <article className="story story-page">
              <span className="kicker">{t.b_founder}</span>
              <h1 className="title" style={{ marginBottom: 22 }}>{t.b_title}</h1>
              {t.b_story.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
              <p className="sign">{t.b_sign}</p>
              <Socials label={t.s_follow} />
              <div className="ctas" style={{ marginTop: 24 }}>
                <a href={`${home}#join`} className="btn btn-wine">{t.nav_cta}</a>
                <Link href={home} className="btn btn-ghost">{t.b_back}</Link>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
      <JsonLd lang={lang} />
    </div>
  );
}
