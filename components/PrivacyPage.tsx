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
      ["Why", "Only to match you with a table, to email you about your meetup and to invite you to the community group. We never sell or share your data with other companies. Your tablemates only see your first name."],
      ["How long", "We keep your data while you're part of the community. Email us and we'll delete everything within 30 days."],
      ["Where it's stored", "In a secure database (Supabase, EU region). Payments are handled by Mollie; we never see your bank or card details."],
      ["Your rights", "You can ask to see, correct or delete your data at any time, and you can complain to the Autoriteit Persoonsgegevens."],
    ],
    cancelTitle: "Tickets & cancellation",
    cancel: "A ticket costs €12.50 including VAT and service costs (for a limited time your first coffee is on us). Can't make it? Let us know at least 48 hours before the meetup and we'll move your seat to the next date. Later cancellations or no-shows can't be refunded. If we have to cancel, you get a full refund.",
  },
  nl: {
    title: "Privacy & voorwaarden",
    sections: [
      ["Wie we zijn", `Women's Meetups in Amsterdam wordt gerund door Boanna Pieterse, Amsterdam. Contact: ${EMAIL}.`],
      ["Wat we verzamelen", "Je voornaam, e-mailadres, leeftijdscategorie, buurt, taalvoorkeur, persoonlijkheidstype, werk- of studieveld, waar je op hoopt, je voorkeursdagen en (optioneel) je Instagram."],
      ["Waarom", "Alleen om je aan een tafel te matchen, je te mailen over je meetup en je uit te nodigen voor de communitygroep. We verkopen of delen je gegevens nooit met andere bedrijven. Je tafelgenoten zien alleen je voornaam."],
      ["Hoe lang", "We bewaren je gegevens zolang je deel uitmaakt van de community. Mail ons en we verwijderen alles binnen 30 dagen."],
      ["Waar het staat", "In een beveiligde database (Supabase, EU-regio). Betalingen lopen via Mollie; wij zien nooit je bank- of kaartgegevens."],
      ["Jouw rechten", "Je kunt je gegevens altijd inzien, laten aanpassen of verwijderen, en je kunt een klacht indienen bij de Autoriteit Persoonsgegevens."],
    ],
    cancelTitle: "Tickets & annuleren",
    cancel: "Een ticket kost €12,50, inclusief btw en servicekosten (tijdelijk is je eerste koffie van ons). Kun je niet? Laat het minstens 48 uur van tevoren weten, dan verplaatsen we je plek naar de volgende datum. Later annuleren of niet komen kunnen we niet terugbetalen. Moeten wij annuleren, dan krijg je je geld volledig terug.",
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
              <p>{p}</p>
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
