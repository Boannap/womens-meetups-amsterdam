import type { MetadataRoute } from "next";
import { SITE_URL, SPLIT, DOMAIN_EN, DOMAIN_NL } from "@/lib/site";

// Search engines and AI answer engines are welcome (GEO): only the API, the dashboard and the review form are off limits.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/review"] }],
    sitemap: SPLIT ? [`${DOMAIN_EN}/sitemap.xml`, `${DOMAIN_NL}/sitemap.xml`] : `${SITE_URL}/sitemap.xml`,
  };
}
