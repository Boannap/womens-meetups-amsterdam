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
      ["Gasten op rustige momenten", "Wij plannen tafels op middagen en avonden waarop het bij jou wat stiller is. Zes meiden die blijven, bestellen en terugkomen."],
      ["Nieuwe vaste klanten", "Meiden die bij jou een fijne avond hadden, komen terug. Met hun nieuwe vriendinnen."],
      ["Zichtbaar bij de juiste doelgroep", "Vrouwen van 20 tot 35 in Amsterdam, Nederlands en internationaal. Via onze site, mails en Instagram."],
      ["Een link die Google waardeert", "Je krijgt een eigen plekje met link op onze partnerpagina. Goed voor je vindbaarheid."],
    ],
    pk_t: "Kies wat bij je past",
    pk_note: "Prijzen excl. btw. Opzeggen kan per maand. Gemiddeld besteedt een meid €10 tot €12 per meetup.",
    packages: [
      { id: "proeftafel", name: "Proeftafel", price: "Gratis", per: "eenmalig", guests: "1 tafel · 6 meiden", items: ["Jij reserveert een tafel, wij brengen de gasten", "Vermelding in onze Instagram-story", "Een maand op onze partnerpagina"], cta: "Proeftafel aanvragen" },
      { id: "buurtcafe", name: "Buurtcafé", price: "€39", per: "per maand", guests: "±2 tafels · ±12 meiden per maand", items: ["Logo en link op onze partnerpagina", "Je café in de bevestigingsmail van elke meid aan jouw tafel", "Een Instagram-story bij elke meetup", "Partner-sticker voor op je raam"], cta: "Buurtcafé worden", star: true },
      { id: "stamcafe", name: "Stamcafé", price: "€79", per: "per maand", guests: "±4 tafels · ±24 meiden per maand", items: ["Alles van Buurtcafé", "Logo op onze homepage", "Een blog over jouw café op onze site", "Elke maand een samen-post of reel", "Exclusief: geen ander partnercafé in jouw buurt"], cta: "Stamcafé worden" },
    ],
    coffee_t: "Liever betalen in koffie?",
    coffee: "Dat kan ook. Trakteer de meiden aan jouw tafels op hun eerste koffie, dan krijg je het pakket Buurtcafé zonder maandbedrag.",
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
      ["Guests at quiet times", "We plan tables on afternoons and evenings when it's calmer at your place. Six women who stay, order and come back."],
      ["New regulars", "Women who had a lovely evening at your café come back. With their new friends."],
      ["Seen by the right crowd", "Women aged 20 to 35 in Amsterdam, Dutch and international. Through our site, e-mails and Instagram."],
      ["A link Google likes", "You get your own spot with a link on our partner page. Good for being found online."],
    ],
    pk_t: "Pick what suits you",
    pk_note: "Prices excl. VAT. Cancel any month. On average each woman spends €10 to €12 per meetup.",
    packages: [
      { id: "proeftafel", name: "Taster table", price: "Free", per: "one time", guests: "1 table · 6 women", items: ["You reserve a table, we bring the guests", "A mention in our Instagram story", "One month on our partner page"], cta: "Request a taster table" },
      { id: "buurtcafe", name: "Neighbourhood café", price: "€39", per: "per month", guests: "±2 tables · ±12 women a month", items: ["Logo and link on our partner page", "Your café in the confirmation e-mail of every woman at your table", "An Instagram story at every meetup", "Partner sticker for your window"], cta: "Become a neighbourhood café", star: true },
      { id: "stamcafe", name: "Home café", price: "€79", per: "per month", guests: "±4 tables · ±24 women a month", items: ["Everything in Neighbourhood café", "Logo on our homepage", "A blog about your café on our site", "A joint post or reel every month", "Exclusive: no other partner café in your area"], cta: "Become our home café" },
    ],
    coffee_t: "Rather pay in coffee?",
    coffee: "That works too. Treat the women at your tables to their first coffee and you get the Neighbourhood café package without a monthly fee.",
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
            <div className="pt-extra">
              <div><h3>☕ {t.coffee_t}</h3><p>{t.coffee}</p></div>
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
