import Link from "next/link";
import { homePath, partnerPath, type Lang } from "@/lib/site";
import Header from "./Header";
import Footer from "./Footer";
import JsonLd from "./JsonLd";
import PartnerForm from "./PartnerForm";

export const PARTNER = {
  nl: {
    meta_title: "Samenwerken met cafés in Amsterdam | Women's Meetups in Amsterdam",
    meta_desc: "Heb jij een gezellig, hartverwarmend café in Amsterdam? Word partner van Women's Meetups: wij brengen groepjes van zes meiden naar jouw tafels. Eenmalig of als vaste stek.",
    kicker: "Voor cafés",
    h1: "Ben jij een te gek gezellig en hartverwarmend café in Amsterdam?",
    intro: "Wij brengen groepjes van zes meiden samen aan één tafel, om nieuwe vriendinnen te maken. Op zoek naar de fijnste plekken van de stad. Klinkt jouw café als zo'n plek? Dan werken we graag samen: één keer om te proeven, of als vaste partner.",
    why_t: "Wat het jouw café oplevert",
    why: [
      ["Brunchgasten op zondagochtend", "Onze tafels zijn meestal op zondag rond 10.30. Zes meiden die blijven, ontbijten, bestellen en terugkomen."],
      ["Nieuwe vaste klanten", "Meiden die bij jou een fijne avond hadden, komen terug. Met hun nieuwe vriendinnen."],
      ["Zichtbaar bij de juiste doelgroep", "Vrouwen van 20 tot 35 in Amsterdam, Nederlands en internationaal. Via onze site, mails en Instagram."],
      ["Een link die Google waardeert", "Je krijgt een eigen plekje met link op onze partnerpagina. Goed voor je vindbaarheid."],
    ],
    pk_t: "Kies wat bij je past",
    pk_note: "Prijzen excl. btw. Opzeggen kan per maand. Op zondagochtend bestellen de meiden vaak ontbijt of iets lekkers erbij.",
    packages: [
      { id: "proeftafel", name: "Proeftafel", price: "Gratis", per: "eenmalig", guests: "1 meetup bij jou", items: ["Jij trakteert elke meid op 1 koffie van het huis", "We bieden jouw café één keer aan als meetup-locatie", "Vermelding in onze Instagram-story", "Een maand op onze partnerpagina"], cta: "Proeftafel aanvragen" },
      { id: "maand1", name: "1x per maand", price: "€19", per: "per maand", guests: "Elke maand 1 meetup bij jou", items: ["Jij trakteert elke meid op 1 koffie van het huis", "Je café als vaste meetup-locatie in onze agenda", "Logo en link op onze partnerpagina", "Je café in de mails van de meiden aan jouw tafels", "Een Instagram-story bij elke meetup"], cta: "1x per maand" },
      { id: "maand2", name: "2x per maand", price: "€35", per: "per maand", guests: "Elke maand 2 meetups bij jou", items: ["Alles van 1x per maand", "Logo op onze homepage", "Een blog over jouw café op onze site", "Elke maand een samen-post of reel", "Partner-sticker voor op je raam"], cta: "2x per maand", star: true },
    ],
    coffee_t: "Standaard bij elk pakket",
    coffee: "Elke meid aan jouw tafel krijgt 1 koffie van het huis. Dat is onze vaste aanbieding aan de meiden, en hun eerste kennismaking met jouw koffie.",
    vibe_t: "Wat we de meiden meegeven",
    vibe: "We raden de meiden altijd aan om tijdens de gezellige kennismaking een ontbijtje of hapje te bestellen. En we vinden een goede, persoonlijke sfeer heel belangrijk: een fijne tafel, een warm welkom, een plek waar je graag blijft hangen.",
    disc: "Let op: je betaalt voor een plek als meetup-locatie in onze agenda en voor de promotie. We doen ons best om elke tafel vol te krijgen, maar we kunnen niet garanderen hoeveel meiden er per keer komen.",
    link_t: "Bonus: een maand gratis",
    link: "Schrijf een blogje of post over onze samenwerking op je eigen website, met een link naar ons. Dan is je eerste maand gratis. Wij leveren de tekst en foto's aan, jij hoeft alleen te plaatsen.",
    form_t: "Laten we kennismaken",
    form_p: "Vul dit in, dan mail ik je binnen een paar dagen. Liefs, Boanna",
    back: "Terug naar de meetups",
  },
  en: {
    meta_title: "Partner with us: cafés in Amsterdam | Women's Meetups in Amsterdam",
    meta_desc: "Do you run a cosy, heart-warming café in Amsterdam? Become a partner of Women's Meetups: we bring tables of six women to your café. One time or as a regular spot.",
    kicker: "For cafés",
    h1: "Do you run a seriously cosy, heart-warming café in Amsterdam?",
    intro: "We bring six women together at one table to make new friends, and we're always looking for the loveliest spots in town. Sounds like your café? Let's work together: once to try it out, or as a regular partner.",
    why_t: "What's in it for your café",
    why: [
      ["Brunch guests on Sunday morning", "Our tables are usually on Sunday around 10:30. Six women who stay, have breakfast, order and come back."],
      ["New regulars", "Women who had a lovely evening at your café come back. With their new friends."],
      ["Seen by the right crowd", "Women aged 20 to 35 in Amsterdam, Dutch and international. Through our site, e-mails and Instagram."],
      ["A link Google likes", "You get your own spot with a link on our partner page. Good for being found online."],
    ],
    pk_t: "Pick what suits you",
    pk_note: "Prices excl. VAT. Cancel any month. On Sunday mornings the women often order breakfast or a treat too.",
    packages: [
      { id: "proeftafel", name: "Taster table", price: "Free", per: "one time", guests: "1 meetup at your café", items: ["You treat every woman to 1 coffee on the house", "We offer your café once as a meetup location", "A mention in our Instagram story", "One month on our partner page"], cta: "Request a taster table" },
      { id: "maand1", name: "Once a month", price: "€19", per: "per month", guests: "1 meetup at your café every month", items: ["You treat every woman to 1 coffee on the house", "Your café as a regular meetup location in our calendar", "Logo and link on our partner page", "Your café in the e-mails of the women at your tables", "An Instagram story at every meetup"], cta: "Once a month" },
      { id: "maand2", name: "Twice a month", price: "€35", per: "per month", guests: "2 meetups at your café every month", items: ["Everything in Once a month", "Logo on our homepage", "A blog about your café on our site", "A joint post or reel every month", "Partner sticker for your window"], cta: "Twice a month", star: true },
    ],
    coffee_t: "Included in every package",
    coffee: "Every woman at your table gets 1 coffee on the house. That's our standard offer to the women, and their first taste of your coffee.",
    vibe_t: "What we tell the women",
    vibe: "We always recommend the women order breakfast or a bite during the cosy first meeting. And a good, personal atmosphere matters a lot to us: a nice table, a warm welcome, a place where you want to stay a little longer.",
    disc: "Please note: you pay for a spot as a meetup location in our calendar and for the promotion. We do our best to fill every table, but we can't guarantee how many women come each time.",
    link_t: "Bonus: one month free",
    link: "Write a short blog or post about our partnership on your own website, with a link to us, and your first month is free. We'll send the text and photos, you just publish it.",
    form_t: "Let's meet",
    form_p: "Fill this in and I'll e-mail you within a few days. Love, Boanna",
    back: "Back to the meetups",
  },
} as const;

export default function PartnerPage({ lang }: { lang: Lang }) {
  const t = PARTNER[lang];
  const home = homePath(lang);
  return (
    <div lang={lang}>
      <Header lang={lang} alt={partnerPath(lang === "nl" ? "en" : "nl", lang)} />
      <main className="partner">
        <section className="sec">
          <div className="wrap">
            <span className="kicker">{t.kicker}</span>
            <h1 className="title pt-h1">{t.h1}</h1>
            <p className="pt-intro">{t.intro}</p>
            <a href="#partner-form" className="btn btn-wine">{t.form_t} →</a>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <h2 className="title">{t.why_t}</h2>
            <div className="pt-why">
              {t.why.map(([h, p]) => <div key={h}><h3>{h}</h3><p>{p}</p></div>)}
            </div>
          </div>
        </section>

        <section className="sec">
          <div className="wrap">
            <h2 className="title">{t.pk_t}</h2>
            <div className="pt-packs">
              {t.packages.map((p) => (
                <article key={p.id} className={`pt-pack${"star" in p && p.star ? " star" : ""}`}>
                  <h3>{p.name}</h3>
                  <p className="pt-price"><b>{p.price}</b> <span>{p.per}</span></p>
                  <p className="pt-guests">{p.guests}</p>
                  <ul>{p.items.map((i) => <li key={i}>{i}</li>)}</ul>
                  <a href={`?pakket=${p.id}#partner-form`} className="btn btn-pink">{p.cta}</a>
                </article>
              ))}
            </div>
            <p className="pt-note">{t.pk_note}</p>
            <p className="pt-disc">{t.disc}</p>
            <div className="pt-extra">
              <div><h3>☕ {t.coffee_t}</h3><p>{t.coffee}</p></div>
              <div><h3>🥐 {t.vibe_t}</h3><p>{t.vibe}</p></div>
              <div><h3>🔗 {t.link_t}</h3><p>{t.link}</p></div>
            </div>
          </div>
        </section>

        <section className="sec" id="partner-form">
          <div className="wrap pt-form-wrap">
            <h2 className="title">{t.form_t}</h2>
            <p>{t.form_p}</p>
            <PartnerForm lang={lang} />
            <p style={{ marginTop: 28 }}><Link href={home} className="btn btn-ghost">{t.back}</Link></p>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
      <JsonLd lang={lang} />
    </div>
  );
}
