import content from "./content.json";
import events from "./events.json";

export type Lang = "en" | "nl";
export type Dict = (typeof content)["en"];
export type TableLang = "nl" | "en" | "mix";
export type MeetupEvent = {
  id: string;
  date: string;
  end: string;
  title: Record<Lang, string>;
  areas: string;
  tables: { lang: TableLang; taken: number }[];
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://womensmeetupsinamsterdam.nl").replace(/\/$/, "");
export const SITE_NAME = "Women's Meetups in Amsterdam";
export const INSTAGRAM = "womensmeetupsinamsterdam";
export const EMAIL = "hello@womensmeetupsinamsterdam.nl";
export const BOANNA_SOCIALS = [
  { name: "Instagram", handle: "@boannap", url: "https://www.instagram.com/boannap" },
  { name: "YouTube", handle: "@boannathroughtwenties", url: "https://www.youtube.com/@boannathroughtwenties" },
] as const;
export const MEETUP_PHOTOS = [1, 2, 3, 4, 5].map((n) => `/meetups/meetup-${n}.jpg`);
export const PRICE_EUR = "10.00";

export const dict = (lang: Lang): Dict => content[lang] as Dict;
export const EVENTS = events as MeetupEvent[];

/*
 * Two domains, one site: womensmeetupsinamsterdam.com shows the English pages, womensmeetupsinamsterdam.nl the Dutch ones.
 * Inside the app the Dutch routes live under /nl; proxy.ts maps the .nl domain onto them.
 * Switch on with NEXT_PUBLIC_SPLIT_DOMAINS=1 once both domains point at Vercel. Until then everything runs on SITE_URL.
 */
const clean = (u?: string) => u?.replace(/\/$/, "");
export const SPLIT = process.env.NEXT_PUBLIC_SPLIT_DOMAINS === "1";
export const DOMAIN_EN = clean(process.env.NEXT_PUBLIC_URL_EN) || "https://womensmeetupsinamsterdam.com";
export const DOMAIN_NL = clean(process.env.NEXT_PUBLIC_URL_NL) || "https://womensmeetupsinamsterdam.nl";
export const baseUrl = (lang: Lang) => (SPLIT ? (lang === "nl" ? DOMAIN_NL : DOMAIN_EN) : SITE_URL);

/** Internal route ("/nl/founder") to the path visitors see for that language ("/founder" on the .nl domain). */
export const pubPath = (lang: Lang, route: string) => (SPLIT && lang === "nl" ? route.replace(/^\/nl/, "") || "/" : route);
/** Full URL of a route, on the right domain. */
export const absUrl = (lang: Lang, route: string) => {
  const p = pubPath(lang, route);
  return baseUrl(lang) + (p === "/" ? "" : p);
};
/** Link to a route in `lang`, seen from a page in `from`: relative on the same domain, absolute across domains. */
const href = (lang: Lang, route: string, from: Lang = lang) => (SPLIT && from !== lang ? absUrl(lang, route) : pubPath(lang, route));

export const ROUTES = {
  home: { en: "/", nl: "/nl" },
  founder: { en: "/founder", nl: "/nl/founder" },
  privacy: { en: "/privacy", nl: "/nl/privacy" },
} as const;
export const homePath = (lang: Lang, from?: Lang) => href(lang, ROUTES.home[lang], from);
export const hostPath = (lang: Lang, from?: Lang) => href(lang, ROUTES.founder[lang], from);
export const privacyPath = (lang: Lang, from?: Lang) => href(lang, ROUTES.privacy[lang], from);
