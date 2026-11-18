# Women's Meetups in Amsterdam

Website voor Table of Six: kleine koffiemeetups voor vrouwen in Amsterdam.
Gebouwd met Next.js, Tailwind CSS en GSAP. Hosting op Vercel, domein via Namecheap, data in Supabase, betalen later via Mollie.

## Wat zit erin

| Pagina | Engels | Nederlands |
|---|---|---|
| Home (hero, USP's, meetups, ervaring, hoe het werkt, gespreksvragen, host, aanmelden, FAQ) | `/` | `/nl` |
| Founder (verhaal van Boanna) | `/founder` | `/nl/founder` |
| Privacy & voorwaarden | `/privacy` | `/nl/privacy` |

Alle teksten staan in **`lib/content.json`** (Engels en Nederlands naast elkaar). Tekst aanpassen = alleen dat bestand.
Meetups staan in **`lib/events.json`**. Per datum zet je meerdere tafels neer, met taal (`nl`, `en` of `mix`) en hoeveel plekken bezet zijn.

Schrijfregel voor deze site: gebruik nergens het lange gedachtestreepje. Gebruik een punt, komma of dubbele punt.

## SEO en GEO (vindbaar in Google en in AI-zoekmachines)

- Titel, beschrijving, canonical en hreflang (Engels/Nederlands) per pagina: `lib/meta.ts`
- Gestructureerde data (Organization, Person, Event per meetup, FAQPage): `components/JsonLd.tsx`
- `sitemap.xml` en `robots.txt` worden automatisch gemaakt: `app/sitemap.ts`, `app/robots.ts`
- `public/llms.txt`: korte samenvatting voor AI-assistenten (ChatGPT, Perplexity, Claude)
- Deelplaatje voor WhatsApp/Instagram/LinkedIn: `public/og.png`
- Zoekwoorden die in de teksten zitten: women's meetups in Amsterdam, make friends in Amsterdam, hidden spots in Amsterdam, cosy cafés, koffiemeetups voor vrouwen, verborgen plekjes in Amsterdam

## Lokaal draaien (voor Dirck)

```bash
npm install
cp .env.example .env.local   # vul later in
npm run dev                  # http://localhost:3000
```

## Live zetten: gratis testen op Vercel

1. Maak een (privé) repository op GitHub en zet deze map erin.
2. Vercel > Add New > Project > kies de repository > Deploy. Je krijgt meteen een gratis adres op `.vercel.app`.
3. Vercel > Project > Settings > Environment Variables: zet `NEXT_PUBLIC_SITE_URL` op je domein.

Let op: het gratis Hobby-plan van Vercel is alleen voor niet-commercieel gebruik. Prima om te bouwen en testen; zodra je tickets verkoopt, moet je naar Pro (ongeveer $20 per maand) of naar een host die commercieel gebruik gratis toestaat.

## Domein koppelen (Namecheap)

1. Koop het domein bij Namecheap (bijvoorbeeld `womensmeetupsamsterdam.nl` of `.com`; kijk ook of de Instagram-naam vrij is).
2. Vercel > Project > Settings > Domains > voeg je domein toe. Vercel laat zien welke DNS-records je nodig hebt.
3. Namecheap > Domain List > Manage > Advanced DNS: voeg precies die records toe (meestal een A-record voor `@` en een CNAME voor `www`).
4. Na een paar minuten tot een paar uur staat de site op je eigen domein, met https.

## Aanmeldingen opslaan (Supabase)

1. Maak een project op supabase.com, kies regio EU (Frankfurt).
2. SQL editor > plak `supabase/schema.sql` > Run.
3. In Vercel staan `SUPABASE_URL` en `SUPABASE_PUBLISHABLE_KEY`. Die sleutel kan alleen aanmeldingen toevoegen, niet lezen. De `service_role` key is pas nodig voor Mollie en hoort alleen in Vercel, nooit in een chat.
4. Aanmeldingen zie je daarna in Supabase > Table editor > `signups`. Daar vul je ook `table_id` in als je iemand aan een tafel matcht.

Zolang Supabase nog niet gekoppeld is, werkt het formulier wel maar wordt er niets bewaard (alleen gelogd).
De site verstuurt zelf nooit e-mails.

## Betalen (Mollie, stap 2)

De route `app/api/checkout/route.ts` maakt een Mollie-betaling van €8 aan en `app/api/mollie-webhook/route.ts` slaat de status op. Nog niet aan het formulier gekoppeld.

1. Maak een Mollie-account (KvK-nummer nodig).
2. Zet eerst de `test_` API-key in `MOLLIE_API_KEY` en test.
3. Laat Dirck de knop "Reserve my seat" laten doorsturen naar `/api/checkout`.
4. Wissel naar de `live_` key als alles werkt.

## Foto's

Meetupfoto's staan in `public/meetups/` (meetup-1.jpg t/m meetup-5.jpg), de bijschriften en alt-teksten in `lib/content.json` (`g_caps`, `g_alts`). Vraag mensen die herkenbaar in beeld zijn of ze op de site mogen.

### Foto van Boanna

Staat in `public/boanna.jpg` (800 x 1000). Nieuwe foto? Vervang dat bestand met dezelfde naam.

## Nog te doen

- [ ] Echte meetupdata en cafés in `lib/events.json`
- [ ] Instagram-naam en e-mailadres in `lib/site.ts`
- [ ] Privacytekst en annuleringsvoorwaarden laten checken (`components/PrivacyPage.tsx`)
- [ ] Domein (womensmeetupsinamsterdam.nl), Supabase en later Mollie koppelen
