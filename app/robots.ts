import type { MetadataRoute } from "next";
import { SITE_URL, SPLIT, DOMAIN_EN, DOMAIN_NL } from "@/lib/site";

// Search engines and AI answer engines are welcome (GEO): only the API is off limits.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: SPLIT ? [`${DOMAIN_EN}/sitemap.xml`, `${DOMAIN_NL}/sitemap.xml`] : `${SITE_URL}/sitemap.xml`,
  };
}
