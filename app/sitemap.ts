import type { MetadataRoute } from "next";
import { ROUTES, absUrl, type Lang } from "@/lib/site";
import { LANDING_ROUTES } from "@/lib/landings";

const PRIORITY = { home: 1, founder: 0.8, partners: 0.7, privacy: 0.3 } as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const landings = Object.values(LANDING_ROUTES).flatMap((r) =>
    (["en", "nl"] as Lang[]).map((lang) => ({
      url: absUrl(lang, r[lang]),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: { en: absUrl("en", r.en), nl: absUrl("nl", r.nl) } },
    }))
  );
  return [...(Object.keys(ROUTES) as (keyof typeof ROUTES)[]).flatMap((k) =>
    (["en", "nl"] as Lang[]).map((lang) => ({
      url: absUrl(lang, ROUTES[k][lang]),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: PRIORITY[k],
      alternates: { languages: { en: absUrl("en", ROUTES[k].en), nl: absUrl("nl", ROUTES[k].nl) } },
    }))
  ), ...landings];
}
