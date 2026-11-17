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

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://womensmeetupsamsterdam.nl").replace(/\/$/, "");
export const SITE_NAME = "Women's Meetups in Amsterdam";
export const INSTAGRAM = "womensmeetupsinamsterdam";
export const EMAIL = "hello@womensmeetupsamsterdam.nl";
export const BOANNA_SOCIALS = [
  { name: "Instagram", handle: "@boannap", url: "https://www.instagram.com/boannap" },
  { name: "YouTube", handle: "@boannathroughtwenties", url: "https://www.youtube.com/@boannathroughtwenties" },
] as const;
export const MEETUP_PHOTOS = [1, 2, 3, 4, 5].map((n) => `/meetups/meetup-${n}.jpg`);
export const PRICE_EUR = "8.00";

export const dict = (lang: Lang): Dict => content[lang] as Dict;
export const EVENTS = events as MeetupEvent[];
export const homePath = (lang: Lang) => (lang === "nl" ? "/nl" : "/");
export const hostPath = (lang: Lang) => (lang === "nl" ? "/nl/founder" : "/founder");
export const privacyPath = (lang: Lang) => (lang === "nl" ? "/nl/privacy" : "/privacy");
