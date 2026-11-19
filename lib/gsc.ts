import { createSign } from "crypto";

/* Google Search Console: zoekwoorden voor .nl en .com samen.
   Sleutel staat als GSC_KEY (service-account JSON) in Vercel. */

const SITES: { site: string; lang: "nl" | "en" }[] = [
  { site: "sc-domain:womensmeetupsinamsterdam.nl", lang: "nl" },
  { site: "sc-domain:womensmeetupsinamsterdam.com", lang: "en" },
];

const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

let cached: { token: string; exp: number } | null = null;

async function token(): Promise<string | null> {
  const raw = process.env.GSC_KEY;
  if (!raw) return null;
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  let key: { client_email: string; private_key: string };
  try { key = JSON.parse(raw); } catch { return null; }
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = b64url(JSON.stringify({ iss: key.client_email, scope: "https://www.googleapis.com/auth/webmasters.readonly", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const sig = b64url(createSign("RSA-SHA256").update(`${head}.${body}`).sign(key.private_key));
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${head}.${body}.${sig}` }),
  }).catch(() => null);
  if (!r || !r.ok) return null;
  const j = await r.json();
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in ?? 3600) * 1000 };
  return cached.token;
}

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };

async function query(t: string, site: string, start: string, end: string, dimensions: string[], rowLimit = 50): Promise<Row[]> {
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
    body: JSON.stringify({ startDate: start, endDate: end, dimensions, rowLimit }),
  }).catch(() => null);
  if (!r || !r.ok) return [];
  return ((await r.json()).rows ?? []) as Row[];
}

export type GscData = {
  connected: boolean;
  totals: { clicks: number; impressions: number; position: number };
  by_lang: Record<string, { clicks: number; impressions: number }>;
  queries: { q: string; clicks: number; impressions: number; position: number; lang: string }[];
  pages: { page: string; clicks: number; impressions: number }[];
};

export async function gsc(days: number): Promise<GscData> {
  const empty: GscData = { connected: false, totals: { clicks: 0, impressions: 0, position: 0 }, by_lang: {}, queries: [], pages: [] };
  const t = await token();
  if (!t) return empty;
  const day = (n: number) => new Date(Date.now() - n * 86400_000).toISOString().slice(0, 10);
  const start = day(days + 2), end = day(2); // Google loopt ~2 dagen achter
  const out: GscData = { ...empty, connected: true, by_lang: {} };
  const qmap = new Map<string, { clicks: number; impressions: number; posw: number; langs: Set<string> }>();
  let posw = 0;
  await Promise.all(SITES.map(async ({ site, lang }) => {
    const [tot, qs, ps] = await Promise.all([query(t, site, start, end, []), query(t, site, start, end, ["query"], 100), query(t, site, start, end, ["page"], 20)]);
    const tt = tot[0];
    if (tt) {
      out.totals.clicks += tt.clicks; out.totals.impressions += tt.impressions; posw += tt.position * tt.impressions;
      out.by_lang[lang] = { clicks: tt.clicks, impressions: tt.impressions };
    }
    for (const r of qs) {
      const q = r.keys?.[0] ?? ""; const m = qmap.get(q) ?? { clicks: 0, impressions: 0, posw: 0, langs: new Set<string>() };
      m.clicks += r.clicks; m.impressions += r.impressions; m.posw += r.position * r.impressions; m.langs.add(lang); qmap.set(q, m);
    }
    for (const r of ps) out.pages.push({ page: (r.keys?.[0] ?? "").replace(/^https?:\/\/(www\.)?womensmeetupsinamsterdam/, ""), clicks: r.clicks, impressions: r.impressions });
  }));
  out.totals.position = out.totals.impressions ? Math.round((posw / out.totals.impressions) * 10) / 10 : 0;
  out.queries = [...qmap.entries()].map(([q, m]) => ({ q, clicks: m.clicks, impressions: m.impressions, position: Math.round((m.posw / Math.max(1, m.impressions)) * 10) / 10, lang: [...m.langs].join("+") }))
    .sort((a, b) => b.impressions - a.impressions).slice(0, 40);
  out.pages.sort((a, b) => b.impressions - a.impressions);
  return out;
}
