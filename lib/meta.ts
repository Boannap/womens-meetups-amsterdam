import type { Metadata } from "next";
import { dict, baseUrl, absUrl, SITE_NAME, type Lang } from "./site";

/** Builds title/description/canonical/hreflang/OpenGraph for a page that exists in both languages. */
export function pageMeta(lang: Lang, paths: { en: string; nl: string }, title?: string, description?: string): Metadata {
  const t = dict(lang);
  const tt = title ?? t.meta_title;
  const dd = description ?? t.meta_desc;
  return {
    metadataBase: new URL(baseUrl(lang)),
    title: tt,
    description: dd,
    alternates: {
      canonical: absUrl(lang, paths[lang]),
      languages: { en: absUrl("en", paths.en), nl: absUrl("nl", paths.nl), "x-default": absUrl("en", paths.en) },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: tt,
      description: dd,
      url: absUrl(lang, paths[lang]),
      locale: lang === "nl" ? "nl_NL" : "en_GB",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: "summary_large_image", title: tt, description: dd, images: ["/og.png"] },
    icons: { icon: "/favicon.svg" },
    keywords: [
      "women's meetups Amsterdam", "make friends in Amsterdam", "new friends Amsterdam", "hidden spots Amsterdam",
      "cosy cafés Amsterdam", "coffee meetup Amsterdam", "koffiemeetups vrouwen Amsterdam", "vriendinnen maken Amsterdam",
      "verborgen plekjes Amsterdam", "Table of Six",
    ],
  };
}
