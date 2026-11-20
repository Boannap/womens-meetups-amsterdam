import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { ROUTES, absUrl, type Lang } from "@/lib/site";
import { LANDING_ROUTES } from "@/lib/landings";

const PRIORITY = { home: 1, founder: 0.8, partners: 0.7, contact: 0.5, guidelines: 0.4, privacy: 0.3 } as const;

/** Elke sitemap noemt alleen adressen van zijn eigen domein (.nl = Nederlands, .com = Engels); de andere taal staat er als hreflang-alternatief bij. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = ((await headers()).get("host") || "").toLowerCase();
  const langs: Lang[] = host.endsWith(".nl") ? ["nl"] : host.endsWith(".com") ? ["en"] : ["en", "nl"];
  const landings = Object.values(LANDING_ROUTES).flatMap((r) =>
    langs.map((lang) => ({
      url: absUrl(lang, r[lang]),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: { en: absUrl("en", r.en), nl: absUrl("nl", r.nl) } },
    }))
  );
  return [...(Object.keys(ROUTES) as (keyof typeof ROUTES)[]).flatMap((k) =>
    langs.map((lang) => ({
      url: absUrl(lang, ROUTES[k][lang]),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: PRIORITY[k],
      alternates: { languages: { en: absUrl("en", ROUTES[k].en), nl: absUrl("nl", ROUTES[k].nl) } },
    }))
  ), ...landings];
}
