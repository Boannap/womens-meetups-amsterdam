import Link from "next/link";
import { privacyPath, guidelinesPath, contactPath, EMAIL, BUSINESS, type Lang } from "@/lib/site";
import Header from "./Header";
import Footer from "./Footer";

/* Checked against ACM, KVK, Ondernemersplein and AP guidance on 20 Nov 2026. Not legal advice:
   have a lawyer look at it before ticket sales grow. Keep the retention terms in sync with cleanup_old_data(). */
type S = [string, string][];
const COPY: Record<Lang, { title: string; updated: string; who: string; privTitle: string; priv: S; termsTitle: string; terms: S }> = {
  nl: {
    title: "Privacy & voorwaarden",
    updated: "Laatst bijgewerkt: 22 november 2026",
    who: `${BUSINESS.name} is een eenmanszaak van ${BUSINESS.owner}, gevestigd in ${BUSINESS.city}. KvK-nummer ${BUSINESS.kvk} · btw-id ${BUSINESS.vat}. Contact: ${EMAIL} of het contactformulier.`,
    privTitle: "Privacyverklaring",
    priv: [
      ["Welke gegevens we verzamelen", "Als je je aanmeldt: je voornaam, e-mailadres, leeftijd, taalvoorkeur, werk- of studieveld, je hobby's, de antwoorden op de quiz (en het type dat daaruit komt), wat je uit de meetup wilt halen, of je op de foto wilt, hoe je ons vond, je tafelwens en (als je die invult) je Instagram. Kies je voor WhatsApp, dan ook je telefoonnummer. Na de meetup je reviewantwoorden en de foto's die je zelf met ons deelt. Via het contactformulier je naam, e-mail en bericht. Cafés die willen samenwerken: hun contactgegevens."],
      ["Waarvoor en op welke grondslag", "Om je aan een tafel te matchen, je ticket te regelen en je over je meetup te mailen (nodig voor de overeenkomst). Geef je je telefoonnummer op, dan sturen we je via WhatsApp berichten over jouw tafel, zoals het café, de tijd en wie er aanschuiven (nodig voor de overeenkomst; liever niet meer, laat het ons weten en we mailen alleen). Reviewzinnetjes zetten we op de site zoals hieronder bij Reviews staat. Foto's die je na de meetup deelt, bewaren we privé; alleen als je dat aanvinkt, zetten we ze op Instagram of de website. Om je mails over nieuwe tafels en events te sturen: met jouw toestemming, of omdat je eerder een ticket kocht (dan mailen we alleen over vergelijkbare meetups). In elke mail kun je je afmelden. Om de website te verbeteren met anonieme statistieken (gerechtvaardigd belang)."],
      ["Wie je gegevens ziet", "Je tafelgenoten zien alleen je voornaam. We verkopen je gegevens nooit. We werken wel met een paar dienstverleners die ze voor ons verwerken: Supabase (database, EU), Hetzner (server van de website, EU), Resend (verzenden van mails, EU), Stripe (betalingen) en Google (onze mailbox). Kies je WhatsApp, dan loopt dat via WhatsApp (Meta). Sommige van deze bedrijven zijn Amerikaans; met hen zijn afspraken gemaakt die de Europese regels volgen, zoals het EU-VS Data Privacy Framework of standaardcontractbepalingen."],
      ["Websitestatistieken", "We tellen bezoek zonder cookies, zonder IP-adressen en zonder advertentiepartijen. Een willekeurige code per browsertabblad (die verdwijnt als je het tabblad sluit) laat ons zien welke delen gelezen worden en waar het formulier makkelijker kan. Dat is niet naar jou te herleiden. Daarom is er geen cookiemelding."],
      ["Foto's tijdens meetups", "Tijdens meetups maken we soms sfeerfoto's voor onze website en Instagram, zodat andere meiden kunnen zien hoe gezellig het is. Dat doen we op basis van gerechtvaardigd belang. Wil je liever niet op de foto? Zeg het gewoon tegen je host, dan fotograferen we jou niet. Close-ups van één persoon maken we alleen als je daar ter plekke ja op zegt. Sta je toch op een foto die je liever niet online ziet? Laat het ons weten, dan halen we hem weg."],
      ["Reviews", "Na je meetup vragen we je hoe het was. Als je ons een review of zinnetje stuurt via het reviewformulier of door op onze mail te reageren, mogen we die met alleen je voornaam op de website en Instagram delen. Liever anoniem of niet gedeeld? Zet dat er gewoon bij, of laat het ons later weten."],
      ["Hoe lang we het bewaren", "Aanmeldingen en reviews: tot 2 jaar na je aanmelding. Berichten via het contactformulier: 1 jaar. Aanvragen van cafés: 2 jaar. Anonieme websitestatistieken: 13 maanden. Betaalgegevens bewaren we 7 jaar, omdat de belastingwet dat verplicht. Dit wordt automatisch opgeschoond. Wil je eerder weg? Vraag het, dan verwijderen we alles binnen 30 dagen (behalve wat we wettelijk moeten bewaren)."],
      ["Je rechten", "Je mag je gegevens inzien, laten verbeteren of verwijderen, de verwerking laten beperken, bezwaar maken, je gegevens meenemen en je toestemming altijd intrekken. Stuur ons een berichtje; we reageren binnen een maand. Ben je niet tevreden over hoe we met je gegevens omgaan? Dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens."],
      ["18 jaar of ouder", "Onze meetups zijn voor vrouwen van 18 jaar en ouder. We verzamelen bewust geen gegevens van jongere meiden."],
      ["Beveiliging", "Je gegevens staan in een beveiligde database waar alleen wij bij kunnen. Gaat er toch iets mis, dan melden we dat volgens de regels bij de Autoriteit Persoonsgegevens en, waar nodig, bij jou."],
    ],
    termsTitle: "Voorwaarden & annuleren",
    terms: [
      ["Voor wie deze voorwaarden gelden", "Deze voorwaarden gelden voor elke aanmelding en elk ticket voor een meetup van Women's Meetups in Amsterdam. Je gaat ermee akkoord als je je aanmeldt. Je kunt ze altijd hier teruglezen en opslaan."],
      ["Wat je krijgt", "Een plek aan een tafel van zes in een café in Amsterdam, op de datum en tijd die je kiest. Inclusief een host, de vragenkaartjes en je eerste koffietje. Wat je verder bestelt, reken je zelf af bij het café. Welk café het wordt en wie je tafelgenoten zijn, hoor je uiterlijk twee dagen van tevoren."],
      ["Prijs en betalen", "Een ticket kost €12,50, inclusief btw en servicekosten. Je betaalt bij je aanmelding via Stripe, met iDEAL/Wero, je kaart of Apple Pay. Sta je op de wachtlijst, dan betaal je pas als er een plek voor je vrijkomt."],
      ["Geen bedenktijd", "Een ticket is voor een vaste datum. Daarom geldt er geen wettelijke bedenktijd van 14 dagen."],
      ["Zelf annuleren", "Kun je niet? Laat het ons minstens 48 uur van tevoren weten, dan verplaatsen we je plek kosteloos naar een volgende datum. Later annuleren of niet komen kunnen we helaas niet terugbetalen of verplaatsen."],
      ["Als wij iets moeten veranderen", "Moeten wij een meetup afzeggen, dan bieden we je altijd een andere datum aan. Past die je niet, dan krijg je je geld volledig terug. Verandert het café of de tijd, dan laten we het je zo snel mogelijk weten; past het je dan niet meer, dan krijg je ook je geld terug."],
      ["Huisregels en wegsturen", "Aan tafel gelden onze huisregels. Ontstaat er een onveilige of grensoverschrijdende situatie, dan kan de host iemand vragen om te vertrekken. Wie wordt weggestuurd, krijgt haar ticket niet terug en kan worden uitgesloten van volgende meetups."],
      ["Foto's", "Tijdens meetups maken we soms sfeerfoto's voor onze website en Instagram. Liever niet op de foto? Zeg het tegen je host, dan houden we daar rekening mee. Meer hierover lees je in de privacyverklaring."],
      ["Kortingslinks", "Krijg je een persoonlijke link met korting, bijvoorbeeld om vriendinnen mee te nemen? Die is één keer geldig, voor de data die erbij staan, en niet te combineren met andere kortingen."],
      ["WhatsApp", "Geef je bij het aanmelden je telefoonnummer op, dan ga je ermee akkoord dat we je via WhatsApp berichten sturen over jouw tafel en meetup. Geen reclame. Wil je dat niet meer, laat het ons weten, dan mailen we je alleen."],
      ["Eten, allergieën en eigen risico", "Je komt op eigen verantwoordelijkheid en let zelf op je spullen. Het café is verantwoordelijk voor wat het serveert. Heb je een allergie of dieetwens? Geef het zelf door aan het café als je bestelt; vertel het ons gerust ook, dan houden we er waar we kunnen rekening mee bij het kiezen van het café. Wij zijn niet aansprakelijk voor schade, ongevallen of allergische reacties, behalve als die door onze eigen grove fout komen; dan nooit voor meer dan de prijs van je ticket."],
      ["Klachten", "Niet tevreden? Laat het ons binnen twee weken na de meetup weten via het contactformulier of per mail. We reageren binnen 14 dagen en zoeken samen met je naar een oplossing."],
      ["Recht", "Op deze voorwaarden is Nederlands recht van toepassing."],
    ],
  },
  en: {
    title: "Privacy & terms",
    updated: "Last updated: 22 November 2026",
    who: `${BUSINESS.name} is a sole proprietorship of ${BUSINESS.owner}, based in ${BUSINESS.city}. Chamber of Commerce (KvK) ${BUSINESS.kvk} · VAT ${BUSINESS.vat}. Contact: ${EMAIL} or the contact form.`,
    privTitle: "Privacy policy",
    priv: [
      ["What we collect", "When you sign up: your first name, e-mail address, age, language preference, work or study field, your hobbies, your quiz answers (and the type that comes out), what you want to get out of the meetup, whether you'd like to be in photos, how you found us, your table wish and (if you fill it in) your Instagram. If you choose WhatsApp, also your phone number. After the meetup, your review answers and any photos you choose to share with us. Through the contact form: your name, e-mail and message. Cafés that want to work with us: their contact details."],
      ["Why, and on what basis", "To match you with a table, arrange your ticket and e-mail you about your meetup (needed for our agreement). If you give us your phone number, we send you WhatsApp messages about your table, such as the café, the time and who's joining (needed for our agreement; rather not, just tell us and we'll only e-mail). We show review quotes on the site as described under Reviews below. Photos you share after the meetup are kept private; only if you tick the box do we post them on Instagram or the website. To e-mail you about new tables and events: with your consent, or because you bought a ticket before (then only about similar meetups). You can unsubscribe in every e-mail. To improve the website with anonymous statistics (legitimate interest)."],
      ["Who sees your data", "Your tablemates only see your first name. We never sell your data. We do work with a few service providers who process it for us: Supabase (database, EU), Hetzner (website server, EU), Resend (sending e-mails, EU), Stripe (payments) and Google (our mailbox). If you choose WhatsApp, that runs through WhatsApp (Meta). Some of these companies are American; agreements with them follow the European rules, such as the EU-US Data Privacy Framework or standard contractual clauses."],
      ["Website statistics", "We count visits without cookies, without IP addresses and without advertising parties. A random code per browser tab (gone when you close the tab) shows us which parts are read and where the form could be easier. It can't be traced back to you. That's why there's no cookie banner."],
      ["Photos at meetups", "At meetups we sometimes take atmosphere photos for our website and Instagram, so other girls can see how lovely it is. We do this based on legitimate interest. Rather not be in photos? Just tell your host and we won't photograph you. Close-ups of one person are only taken if you say yes on the spot. Ended up in a photo you'd rather not see online? Let us know and we'll take it down."],
      ["Reviews", "After your meetup we ask how it was. If you send us a review or a few words through the review form or by replying to our e-mail, we may share it on the website and Instagram with only your first name. Rather stay anonymous or not shared? Just add that, or let us know later."],
      ["How long we keep it", "Sign-ups and reviews: up to 2 years after you signed up. Contact form messages: 1 year. Café requests: 2 years. Anonymous website statistics: 13 months. Payment records are kept for 7 years because tax law requires it. This is cleaned up automatically. Want it gone sooner? Ask us and we'll delete everything within 30 days (except what we're legally required to keep)."],
      ["Your rights", "You can see, correct or delete your data, restrict or object to its use, take it with you and withdraw your consent at any time. Just send us a message; we reply within a month. Not happy with how we handle your data? You can complain to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens)."],
      ["18 or older", "Our meetups are for women aged 18 and over. We don't knowingly collect data from anyone younger."],
      ["Security", "Your data is stored in a secured database that only we can access. If something does go wrong, we report it to the Autoriteit Persoonsgegevens and, where needed, to you, as the rules require."],
    ],
    termsTitle: "Terms & cancellation",
    terms: [
      ["Who these terms apply to", "These terms apply to every sign-up and ticket for a Women's Meetups in Amsterdam meetup. You accept them when you sign up. You can always read and save them here."],
      ["What you get", "A seat at a table of six in a café in Amsterdam, on the date and time you choose. Including a host, the question cards and your first coffee. Anything else you order, you pay at the café. You'll hear which café and who your tablemates are at least two days before."],
      ["Price and payment", "A ticket costs €12.50 including VAT and service costs. You pay when you sign up, through Stripe, with iDEAL/Wero, your card or Apple Pay. If you're on the waitlist, you only pay once a seat opens up for you."],
      ["No cooling-off period", "A ticket is for a fixed date, so the legal 14-day cooling-off period does not apply."],
      ["Cancelling yourself", "Can't make it? Let us know at least 48 hours before and we'll move your seat to a later date for free. Later cancellations or no-shows can't be refunded or moved."],
      ["If we have to change something", "If we have to cancel a meetup, we'll always offer you another date. If that doesn't suit you, you get your money back in full. If the café or time changes, we'll let you know as soon as possible; if it no longer works for you, you also get your money back."],
      ["Table guidelines and being asked to leave", "Our table guidelines apply at every meetup. If an unsafe situation arises or someone crosses a line, the host can ask that person to leave. Anyone asked to leave won't get her ticket refunded and may be excluded from future meetups."],
      ["Photos", "At meetups we sometimes take atmosphere photos for our website and Instagram. Rather not be in photos? Tell your host and we'll take that into account. You can read more in the privacy policy."],
      ["Discount links", "Get a personal discount link, for example to bring friends? It's valid once, for the dates shown, and can't be combined with other discounts."],
      ["WhatsApp", "If you give us your phone number when signing up, you agree that we send you WhatsApp messages about your table and meetup. No ads. If you'd rather not, just tell us and we'll only e-mail you."],
      ["Food, allergies and own risk", "You attend at your own responsibility and look after your own belongings. The café is responsible for what it serves. Got an allergy or dietary wish? Tell the café yourself when you order; feel free to tell us too, and we'll take it into account where we can when choosing the café. We're not liable for damage, accidents or allergic reactions, unless caused by our own gross negligence; and never for more than the price of your ticket."],
      ["Complaints", "Not happy? Let us know within two weeks after the meetup via the contact form or by e-mail. We'll reply within 14 days and look for a solution together."],
      ["Law", "These terms are governed by Dutch law."],
    ],
  },
};

const H = ({ children }: { children: React.ReactNode }) => <h2 className="display" style={{ fontSize: "1.35rem", color: "var(--wine)", margin: "0 0 6px" }}>{children}</h2>;
const mail = (p: string) => (p.includes(EMAIL) ? <>{p.split(EMAIL)[0]}<a href={`mailto:${EMAIL}`}>{EMAIL}</a>{p.split(EMAIL)[1]}</> : p);

export default function PrivacyPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <div lang={lang}>
      <Header lang={lang} alt={privacyPath(lang === "nl" ? "en" : "nl", lang)} />
      <main className="sec">
        <div className="wrap faq story-page">
          <h1 className="title" style={{ marginBottom: 10 }}>{c.title}</h1>
          <p style={{ opacity: 0.7, marginBottom: 24 }}>{c.updated}</p>
          <p style={{ marginBottom: 30 }}>{mail(c.who)} <Link href={contactPath(lang)}>{lang === "nl" ? "Naar het contactformulier" : "Go to the contact form"}</Link></p>
          <h2 className="title" style={{ fontSize: "2rem", margin: "10px 0 18px" }}>{c.privTitle}</h2>
          {c.priv.map(([h, p]) => <section key={h} style={{ marginBottom: 20 }}><H>{h}</H><p>{p}</p></section>)}
          <section id="cancellation" style={{ marginTop: 44, scrollMarginTop: 90 }}>
            <h2 className="title" style={{ fontSize: "2rem", margin: "0 0 18px" }}>{c.termsTitle}</h2>
            {c.terms.map(([h, p]) => <section key={h} style={{ marginBottom: 20 }}><H>{h}</H><p>{p}</p></section>)}
            <p><Link href={guidelinesPath(lang)}>{lang === "nl" ? "Lees de huisregels →" : "Read the table guidelines →"}</Link></p>
          </section>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
