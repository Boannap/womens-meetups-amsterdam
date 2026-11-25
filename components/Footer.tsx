import Link from "next/link";
import { BUSINESS, dict, homePath, hostPath, partnerPath, contactPath, guidelinesPath, privacyPath, EMAIL, INSTAGRAM, type Lang } from "@/lib/site";
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
              <li><a href={a("#looking-forward")}>{t.nav_exp}</a></li>
              <li><a href={a("#how")}>{t.nav_how}</a></li>
              <li><Link href={`${hostPath(lang)}#top`}>{t.b_founder}</Link></li>
              <li><a href={a("#faq")}>{t.nav_faq}</a></li>
              <li><Link className="ft-partner" href={`${partnerPath(lang)}#top`}>☕ {lang === "nl" ? "Voor cafés: samenwerken" : "For cafés: partner with us"} →</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.ft_legal}</h4>
            <ul>
              <li><a href={`${privacyPath(lang)}#top`}>{t.ft_privacy}</a></li>
              <li><a href={`${privacyPath(lang)}#cancellation`}>{t.ft_terms}</a></li>
              <li><Link href={guidelinesPath(lang)}>{lang === "nl" ? "Huisregels" : "Table guidelines"}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t.ft_follow}</h4>
            <ul>
              <li><span className="ft-k">Instagram:</span><a className="handle" href={`https://www.instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener">{splitAmsterdam(`@${INSTAGRAM}`)}</a></li>
              <li><span className="ft-k">{t.ft_contact}:</span><Link className="handle" href={contactPath(lang)}>{splitAmsterdam(EMAIL)}</Link></li>
            </ul>
            <div className="ft-icons">
              <a href={`https://www.instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg></a>
              <Link href={`${contactPath(lang)}#top`} aria-label={lang === "nl" ? "Contactformulier" : "Contact form"}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
              <a href="https://www.linkedin.com/company/147034006/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 10.5V17M8 7.2v.1M11.5 17v-6.5M11.5 13.2c0-1.6 1.1-2.7 2.5-2.7s2.4 1 2.4 2.7V17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></a>
            </div>
          </div>
        </div>
        <nav className="ft-seo" aria-label={lang === "nl" ? "Meer over meetups" : "More about the meetups"}>
          {(Object.keys(LANDINGS) as LandingKey[]).map((k) => <Link key={k} href={pubPath(lang, LANDING_ROUTES[k][lang])}>{LANDINGS[k][lang].nav}</Link>)}
        </nav>
        <div className="copy">
          <span>© {new Date().getFullYear()} Women&apos;s Meetups in Amsterdam</span>
          <span>KvK {BUSINESS.kvk} · {lang === "nl" ? "btw" : "VAT"} {BUSINESS.vat} · {BUSINESS.city}</span>
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
