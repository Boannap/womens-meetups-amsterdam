import Link from "next/link";
import { dict, homePath, type Lang } from "@/lib/site";
import { Icon } from "./SvgDefs";

/** `alt` = the same page in the other language, for the NL/EN switch. */
export default function Header({ lang, alt }: { lang: Lang; alt: string }) {
  const t = dict(lang);
  const home = homePath(lang);
  const a = (hash: string) => (home === "/" ? `/${hash}` : `${home}${hash}`);
  return (
    <header id="top">
      <div className="wrap nav">
        <Link className="logo" href={home} aria-label="Women's Meetups in Amsterdam, home">
          <b>women&apos;s meetups</b>
          <Icon id="heart" style={{ color: "var(--tomato)" }} />
          <i>in Amsterdam</i>
        </Link>
        <ul>
          <li><a href={a("#meetups")}>{t.nav_meetups}</a></li>
          <li><a href={a("#experience")}>{t.nav_exp}</a></li>
          <li><a href={a("#how")}>{t.nav_how}</a></li>
          <li><a href={a("#faq")}>{t.nav_faq}</a></li>
        </ul>
        <div className="nav-r">
          <nav className="lang" aria-label="Language">
            {lang === "nl" ? (
              <>
                <span aria-current="true" className="on">NL</span>
                <Link href={alt} hrefLang="en" data-track="lang_switch">EN</Link>
              </>
            ) : (
              <>
                <Link href={alt} hrefLang="nl" data-track="lang_switch">NL</Link>
                <span aria-current="true" className="on">EN</span>
              </>
            )}
          </nav>
          <a href={a("#join")} className="btn btn-wine">{t.nav_cta}</a>
        </div>
      </div>
    </header>
  );
}
