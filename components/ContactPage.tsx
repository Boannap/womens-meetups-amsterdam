import { contactPath, EMAIL, INSTAGRAM, type Lang } from "@/lib/site";
import Header from "./Header";
import Footer from "./Footer";
import JsonLd from "./JsonLd";
import ContactForm from "./ContactForm";

export const CONTACT = {
  nl: { title: "Contact | Women's Meetups in Amsterdam", desc: "Vraag over een meetup, je aanmelding of samenwerken? Stuur ons een berichtje via het formulier of mail naar hello@womensmeetupsinamsterdam.com.", kicker: "Contact", h1: "Zeg het maar!", intro: "Een vraag over een meetup, iets aanpassen aan je aanmelding of gewoon even hoi zeggen? Vul het formulier in, dan hoor je binnen een paar dagen van me. Liefs, Boanna", or: "Liever mailen?", ig: "Of stuur een DM op Instagram:" },
  en: { title: "Contact | Women's Meetups in Amsterdam", desc: "Question about a meetup, your sign-up or working together? Send us a message through the form or e-mail hello@womensmeetupsinamsterdam.com.", kicker: "Contact", h1: "Tell us!", intro: "A question about a meetup, something to change in your sign-up, or just want to say hi? Fill in the form and you'll hear from me within a few days. Love, Boanna", or: "Rather e-mail?", ig: "Or send a DM on Instagram:" },
} as const;

export default function ContactPage({ lang }: { lang: Lang }) {
  const t = CONTACT[lang];
  return (
    <div lang={lang}>
      <Header lang={lang} alt={contactPath(lang === "nl" ? "en" : "nl", lang)} />
      <main className="landing">
        <section className="sec">
          <div className="wrap pt-form-wrap">
            <span className="kicker">{t.kicker}</span>
            <h1 className="pt-h1">{t.h1}</h1>
            <p className="pt-intro">{t.intro}</p>
            <ContactForm lang={lang} />
            <div className="ct-alt">
              <p><b>{t.or}</b> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
              <p>{t.ig} <a href={`https://www.instagram.com/${INSTAGRAM}`} rel="noopener">@{INSTAGRAM}</a></p>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
      <JsonLd lang={lang} />
    </div>
  );
}
