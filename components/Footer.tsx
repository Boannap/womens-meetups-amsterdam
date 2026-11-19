import Link from "next/link";
import { dict, homePath, hostPath, partnerPath, privacyPath, EMAIL, INSTAGRAM, type Lang } from "@/lib/site";
import { Icon } from "./SvgDefs";
import { LANDINGS, LANDING_ROUTES, type LandingKey } from "@/lib/landings";
import { pubPath } from "@/lib/site";

export default function Footer({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const home = homePath(lang);
  const a = (hash: string) => (home === "/" ? `/${hash}` : `${home}${hash}`);
  return (
    <footer>
      <div className="wrap">
        <div className="ft">
          <div>
            <Link className="logo" href={home}>
              <b>women&apos;s meetups</b>
              <Icon id="heart" style={{ color: "var(--tomato)" }} />
              <i>in Amsterdam</i>
            </Link>
            <p style={{ marginTop: 14, maxWidth: "30ch" }}>{t.ft_tag}</p>
          </div>
          <div>
            <h4>{t.ft_explore}</h4>
            <ul>
              <li><a href={a("#meetups")}>{t.nav_meetups}</a></li>
              <li><a href={a("#experience")}>{t.nav_exp}</a></li>
              <li><a href={a("#how")}>{t.nav_how}</a></li>
              <li><Link href={hostPath(lang)}>{t.b_founder}</Link></li>
              <li><a href={a("#faq")}>{t.nav_faq}</a></li>
              <li><Link href={partnerPath(lang)}>{lang === "nl" ? "Voor cafés: samenwerken" : "For cafés: partner with us"}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.ft_legal}</h4>
            <ul>
              <li><Link href={privacyPath(lang)}>{t.ft_privacy}</Link></li>
              <li><Link href={`${privacyPath(lang)}#cancellation`}>{t.ft_terms}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.ft_follow}</h4>
            <ul>
              <li><a href={`https://www.instagram.com/${INSTAGRAM}`} rel="noopener">Instagram: <span className="handle">{splitAmsterdam(`@${INSTAGRAM}`)}</span></a></li>
              <li>{t.ft_contact}: <a className="handle" href={`mailto:${EMAIL}`}>{splitAmsterdam(EMAIL)}</a></li>
            </ul>
          </div>
        </div>
        <nav className="ft-seo" aria-label={lang === "nl" ? "Meer over meetups" : "More about the meetups"}>
          {(Object.keys(LANDINGS) as LandingKey[]).map((k) => <Link key={k} href={pubPath(lang, LANDING_ROUTES[k][lang])}>{LANDINGS[k][lang].nav}</Link>)}
        </nav>
        <div className="copy">
          <span>© {new Date().getFullYear()} Women&apos;s Meetups in Amsterdam</span>
          <span>Table of Six ♥ Amsterdam</span>
        </div>
      </div>
    </footer>
  );
}

/** Long handles may only wrap right before "amsterdam": "hello@womensmeetupsin" / "amsterdam.nl". */
function splitAmsterdam(text: string) {
  const i = text.lastIndexOf("amsterdam");
  if (i <= 0) return text;
  return (<>{text.slice(0, i)}<wbr />{text.slice(i)}</>);
}
