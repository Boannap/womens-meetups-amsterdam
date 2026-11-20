import Link from "next/link";
import { guidelinesPath, contactPath, homePath, EMAIL, type Lang } from "@/lib/site";
import Header from "./Header";
import Footer from "./Footer";

export const GUIDE = {
  nl: {
    title: "Huisregels | Women's Meetups in Amsterdam",
    desc: "Zo zorgen we samen dat iedereen zich welkom en veilig voelt aan tafel: de huisregels van Women's Meetups in Amsterdam.",
    h1: "Huisregels aan tafel",
    intro: "Een Table of Six werkt alleen als iedereen zich welkom en veilig voelt. Daarom vragen we iedereen die aanschuift om zich aan deze afspraken te houden.",
    rules: [
      ["Wees vriendelijk en respectvol", "Iedereen is welkom, wat haar achtergrond, geloof, geaardheid, lichaam of taal ook is. Discriminatie, pesten en kwetsende opmerkingen horen niet aan onze tafels."],
      ["Geef elkaar ruimte", "Luister, laat elkaar uitpraten en dring niet aan. Iedereen doet mee op haar eigen tempo, en niemand hoeft iets te delen wat ze niet wil."],
      ["Wat aan tafel gedeeld wordt, blijft aan tafel", "Vertel geen persoonlijke verhalen of namen van anderen door, ook niet online."],
      ["Eerst vragen, dan pas filmen", "Foto's of video's van anderen maak en deel je alleen als zij daar ja op zeggen."],
      ["Geen verkooppraatjes", "We zijn hier om vriendinnen te maken. Werf dus geen klanten, leden of deelnemers voor je bedrijf, netwerk of MLM."],
      ["Contact daarna alleen als het van twee kanten komt", "Wil iemand geen nummer uitwisselen of reageert ze niet? Dan accepteer je dat gewoon."],
      ["Kom helder en op tijd", "Kom nuchter en op tijd. Kun je niet? Laat het ons minstens 48 uur van tevoren weten, dan krijgt iemand van de wachtlijst je plek."],
    ],
    safe_t: "Veiligheid gaat voor alles",
    safe: [
      "Voelt iets niet goed tijdens een meetup? Zeg het meteen tegen de host. Zij is er voor jou.",
      "Ontstaat er een onveilige of grensoverschrijdende situatie, dan kan de host iemand vragen om te vertrekken. Wie wordt weggestuurd, krijgt haar kaartje niet terug en kan worden uitgesloten van volgende meetups.",
      "In een noodsituatie bel je altijd 112.",
    ],
    report_t: "Iets melden",
    report: "Is er tijdens of na een meetup iets gebeurd? Laat het ons weten via het contactformulier of mail naar",
    report2: "We behandelen elke melding vertrouwelijk.",
    form: "Naar het contactformulier",
    back: "Terug naar de meetups",
  },
  en: {
    title: "Table guidelines | Women's Meetups in Amsterdam",
    desc: "How we make sure everyone feels welcome and safe at the table: the guidelines of Women's Meetups in Amsterdam.",
    h1: "Table guidelines",
    intro: "A Table of Six only works when everyone feels welcome and safe. That's why we ask everyone who joins to stick to these guidelines.",
    rules: [
      ["Be kind and respectful", "Everyone is welcome, whatever her background, faith, orientation, body or language. Discrimination, bullying and hurtful remarks have no place at our tables."],
      ["Give each other space", "Listen, let each other finish and don't push. Everyone joins in at her own pace, and nobody has to share anything she doesn't want to."],
      ["What's shared at the table, stays at the table", "Don't pass on other people's personal stories or names, online or offline."],
      ["Ask before you film", "Only take or share photos or videos of others if they say yes."],
      ["No sales pitches", "We're here to make friends. So no recruiting customers, members or participants for your business, network or MLM."],
      ["Contact afterwards only if it's mutual", "If someone doesn't want to swap numbers or doesn't reply, just accept it."],
      ["Come clear-headed and on time", "Come sober and on time. Can't make it? Let us know at least 48 hours before, so someone on the waitlist gets your seat."],
    ],
    safe_t: "Safety comes first",
    safe: [
      "Something doesn't feel right during a meetup? Tell the host straight away. She's there for you.",
      "If an unsafe situation arises or someone crosses a line, the host can ask that person to leave. Anyone who is asked to leave won't get her ticket refunded and may be excluded from future meetups.",
      "In an emergency, always call 112.",
    ],
    report_t: "Report something",
    report: "Did something happen during or after a meetup? Let us know through the contact form or e-mail",
    report2: "We treat every report confidentially.",
    form: "Go to the contact form",
    back: "Back to the meetups",
  },
} as const;

export default function GuidelinesPage({ lang }: { lang: Lang }) {
  const t = GUIDE[lang];
  return (
    <div lang={lang}>
      <Header lang={lang} alt={guidelinesPath(lang === "nl" ? "en" : "nl", lang)} />
      <main className="landing">
        <section className="sec">
          <div className="wrap ld-wrap">
            <h1 className="pt-h1">{t.h1}</h1>
            <p className="pt-intro">{t.intro}</p>
            <ol className="gl-rules">
              {t.rules.map(([h, p]) => <li key={h}><h2>{h}</h2><p>{p}</p></li>)}
            </ol>
            <div className="gl-safe">
              <h2>🛡️ {t.safe_t}</h2>
              {t.safe.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="ld-block" style={{ marginTop: 30 }}>
              <h2>{t.report_t}</h2>
              <p>{t.report} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. {t.report2}</p>
              <p style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
                <Link href={contactPath(lang)} className="btn btn-wine">{t.form} →</Link>
                <Link href={homePath(lang)} className="btn btn-ghost">{t.back}</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </div>
  );
}
