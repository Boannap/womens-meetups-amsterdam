import type { MetadataRoute } from "next";
import { ROUTES, absUrl, type Lang } from "@/lib/site";

const PRIORITY = { home: 1, founder: 0.8, partners: 0.7, privacy: 0.3 } as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(ROUTES) as (keyof typeof ROUTES)[]).flatMap((k) =>
    (["en", "nl"] as Lang[]).map((lang) => ({
      url: absUrl(lang, ROUTES[k][lang]),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: PRIORITY[k],
      alternates: { languages: { en: absUrl("en", ROUTES[k].en), nl: absUrl("nl", ROUTES[k].nl) } },
    }))
  );
}
