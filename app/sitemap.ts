import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, string, number][] = [["/", "/nl", 1], ["/founder", "/nl/founder", 0.8], ["/privacy", "/nl/privacy", 0.3]];
  return pages.flatMap(([en, nl, priority]) =>
    [en, nl].map((path) => ({
      url: SITE_URL + (path === "/" ? "" : path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: { en: SITE_URL + (en === "/" ? "" : en), nl: SITE_URL + nl } },
    }))
  );
}
