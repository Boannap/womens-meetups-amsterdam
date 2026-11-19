import { privacyPath, EMAIL, type Lang } from "@/lib/site";
import Header from "./Header";
import Footer from "./Footer";

/* DRAFT. Have this checked before you go live (for example with a free AVG/GDPR template
   or a legal check). Fill in your KvK number once you have one. */
const COPY = {
  en: {
    title: "Privacy & terms",
    sections: [
      ["Who we are", `Women's Meetups in Amsterdam is run by Boanna Pieterse, Amsterdam. Contact: ${EMAIL}.`],
      ["What we collect", "Your first name, email address, age range, neighbourhood, language preference, personality type, work or study field, what you're hoping for, your preferred days and (optionally) your Instagram handle."],
      ["Why", "Only to match you with a table, to email you about your meetup and to keep you posted about new tables and events. We never sell or share your data with other companies. Your tablemates only see your first name."],
      ["WhatsApp and reviews", "If you choose WhatsApp, we save your phone number to send you your table details; you can switch to email only at any time. After the meetup we ask a few one-tap review questions. Your words only appear on the website (first name only) if you tick that box and we approve it."],
      ["Website statistics", "We count visits in a privacy-friendly way: no cookies, no IP addresses and no third parties. A random code per browser tab lets us see which parts of the page are read and where the form could be easier. This can't be traced back to you."],
      ["How long", "We keep your data while you're part of the community. Email us and we'll delete everything within 30 days."],
      ["Where it's stored", "In a secure database (Supabase, EU region). Payments are handled by Mollie; we never see your bank or card details."],
      ["Your rights", "You can ask to see, correct or delete your data at any time, and you can complain to the Autoriteit Persoonsgegevens."],
    ],
    cancelTitle: "Tickets & cancellation",
    cancel: "A ticket costs €12.50 including VAT and service costs (your first coffee is included). Can't make it? Let us know at least 48 hours before the meetup and we'll move your seat to the next date. Later cancellations or no-shows can't be refunded. If we have to cancel, you get a full refund.",
  },
  nl: {
    title: "Privacy & voorwaarden",
    sections: [
      ["Wie we zijn", `Women's Meetups in Amsterdam wordt gerund door Boanna Pieterse, Amsterdam. Contact: ${EMAIL}.`],
      ["Wat we verzamelen", "Je voornaam, e-mailadres, leeftijdscategorie, buurt, taalvoorkeur, persoonlijkheidstype, werk- of studieveld, waar je op hoopt, je voorkeursdagen en (optioneel) je Instagram."],
      ["Waarom", "Alleen om je aan een tafel te matchen, je te mailen over je meetup en je op de hoogte te houden van nieuwe tafels en events. We verkopen of delen je gegevens nooit met andere bedrijven. Je tafelgenoten zien alleen je voornaam."],
      ["WhatsApp en reviews", "Kies je voor WhatsApp, dan bewaren we je telefoonnummer om je de details van je tafel te sturen en je op de hoogte te houden van nieuwe tafels en events. Je kunt altijd terug naar alleen mail. Na de meetup stellen we een paar korte reviewvragen. Je tekst komt alleen op de website (met alleen je voornaam) als je dat aanvinkt en wij het goedkeuren."],
      ["Websitestatistieken", "We tellen bezoek op een privacyvriendelijke manier: geen cookies, geen IP-adressen en geen derde partijen. Een willekeurige code per browsertabblad laat ons zien welke delen van de pagina gelezen worden en waar het formulier makkelijker kan. Dit is niet naar jou te herleiden."],
      ["Hoe lang", "We bewaren je gegevens zolang je deel uitmaakt van de community. Mail ons en we verwijderen alles binnen 30 dagen."],
      ["Waar het staat", "In een beveiligde database (Supabase, EU-regio). Betalingen lopen via Mollie; wij zien nooit je bank- of kaartgegevens."],
      ["Jouw rechten", "Je kunt je gegevens altijd inzien, laten aanpassen of verwijderen, en je kunt een klacht indienen bij de Autoriteit Persoonsgegevens."],
    ],
    cancelTitle: "Tickets & annuleren",
    cancel: "Een ticket kost €12,50, inclusief btw en servicekosten (je eerste koffietje krijg je van ons). Kun je niet? Laat het minstens 48 uur van tevoren weten, dan verplaatsen we je plek naar de volgende datum. Later annuleren of niet komen kunnen we niet terugbetalen. Moeten wij annuleren, dan krijg je je geld volledig terug.",
  },
};

export default function PrivacyPage({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  return (
    <div lang={lang}>
      <Header lang={lang} alt={privacyPath(lang === "nl" ? "en" : "nl", lang)} />
      <main className="sec">
        <div className="wrap faq story-page">
          <h1 className="title" style={{ marginBottom: 30 }}>{c.title}</h1>
          {c.sections.map(([h, p]) => (
            <section key={h} style={{ marginBottom: 22 }}>
              <h2 className="display" style={{ fontSize: "1.5rem", color: "var(--wine)", marginBottom: 6 }}>{h}</h2>
              <p>{p.includes(EMAIL) ? <>{p.split(EMAIL)[0]}<a href={`mailto:${EMAIL}`}>{EMAIL}</a>{p.split(EMAIL)[1]}</> : p}</p>
            </section>
          ))}
          <section id="cancellation" style={{ marginTop: 40 }}>
            <h2 className="display" style={{ fontSize: "1.5rem", color: "var(--wine)", marginBottom: 6 }}>{c.cancelTitle}</h2>
            <p>{c.cancel}</p>
          </section>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
