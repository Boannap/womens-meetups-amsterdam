import { dict, EVENTS, baseUrl, absUrl, ROUTES, SITE_NAME, INSTAGRAM, PRICE_EUR, BOANNA_SOCIALS, type Lang } from "@/lib/site";

/** Structured data for Google and AI answer engines: Organization, Person (host), Events, FAQ. */
export default function JsonLd({ lang }: { lang: Lang }) {
  const t = dict(lang);
  const SITE_URL = baseUrl(lang);
  const home = absUrl(lang, ROUTES.home[lang]);
  const org = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#org`,
    name: SITE_NAME,
    alternateName: ["Table of Six Amsterdam", "Womens Meetups Amsterdam"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    description: t.meta_desc,
    areaServed: { "@type": "City", name: "Amsterdam" },
    founder: { "@id": `${SITE_URL}/#boanna` },
    sameAs: [`https://www.instagram.com/${INSTAGRAM}`],
    knowsAbout: ["women's meetups in Amsterdam", "making friends in Amsterdam", "hidden spots in Amsterdam", "cosy cafés in Amsterdam", "koffiemeetups voor vrouwen"],
  };
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#boanna`,
    name: "Boanna Pieterse",
    jobTitle: "Founder & host, Women's Meetups in Amsterdam",
    knowsAbout: ["musical theatre", "content creation", "presenting", "community building"],
    description: t.b_page_desc,
    url: absUrl(lang, ROUTES.founder[lang]),
    homeLocation: { "@type": "City", name: "Amsterdam" },
    image: `${SITE_URL}/boanna.jpg`,
    sameAs: BOANNA_SOCIALS.map((s) => s.url),
  };
  const events = EVENTS.map((e) => ({
    "@type": "Event",
    name: e.title[lang],
    description: t.meta_desc,
    image: [`${SITE_URL}/og.png`],
    startDate: e.date,
    endDate: e.end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    inLanguage: Array.from(new Set(e.tables.map((tb) => (tb.lang === "mix" ? "nl" : tb.lang)))),
    maximumAttendeeCapacity: e.tables.length * 6,
    location: { "@type": "Place", name: `Café in ${e.areas}`, address: { "@type": "PostalAddress", addressLocality: "Amsterdam", addressCountry: "NL" } },
    offers: { "@type": "Offer", price: PRICE_EUR, priceCurrency: "EUR", validFrom: "2026-11-01T00:00:00+01:00", availability: e.soldOut || e.tables.every((tb) => tb.taken >= 6) ? "https://schema.org/SoldOut" : "https://schema.org/InStock", url: `${home}#join` },
    organizer: { "@id": `${SITE_URL}/#org` },
    performer: { "@id": `${SITE_URL}/#boanna` },
  }));
  const faq = {
    "@type": "FAQPage",
    mainEntity: t.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
  const data = { "@context": "https://schema.org", "@graph": [org, person, ...events, faq] };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
