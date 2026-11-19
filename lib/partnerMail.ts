/* Mail met prijzen voor cafés. Staat bewust NIET op de website (de meiden zien die ook).
   Boanna stuurt hem zelf, vanuit het dashboard of door de tekst te kopiëren. */
export type PartnerMail = { subject: string; hi: string; intro: string; packs_t: string; packs: string[]; coffee: string; indic_t: string; indic: string; bonus: string; disc: string; next: string; bye: string };

export function partnerMail(lang: "nl" | "en", name = ""): PartnerMail {
  const first = name.trim().split(/\s+/)[0] || "";
  return lang === "nl"
    ? {
        subject: "Samenwerken met Women's Meetups in Amsterdam ☕",
        hi: `Hoi${first ? ` ${first}` : ""},`,
        intro: "Wat leuk dat je interesse hebt om samen te werken! Zoals beloofd hierbij de details.",
        packs_t: "De pakketten (excl. btw, opzeggen kan per maand)",
        packs: ["Proeftafel: gratis, eenmalig. Eén meetup bij jou om het te proberen.", "1x per maand: €19 per maand. Elke maand één meetup bij jou.", "2x per maand: €35 per maand. Elke maand twee meetups bij jou."],
        coffee: "Bij elk pakket trakteer jij elke meid op 1 koffie van het huis. Dat is onze vaste aanbieding aan de meiden. Wij raden ze daarnaast altijd aan om een ontbijtje of hapje te bestellen.",
        indic_t: "Ter indicatie",
        indic: "Een meid besteedt gemiddeld €10 tot €12 per meetup. Bij twee tafels per maand (zo'n 12 meiden) is dat ongeveer €130 extra omzet per maand, op zondagochtend.",
        bonus: "Bonus: schrijf je een blogje of post over onze samenwerking op je eigen website, met een link naar ons? Dan is je eerste maand gratis. Wij leveren tekst en foto's aan.",
        disc: "Goed om te weten: je betaalt voor een plek als meetup-locatie in onze agenda en voor de promotie. We doen ons best om elke tafel vol te krijgen, maar we kunnen niet garanderen hoeveel meiden er per keer komen.",
        next: "Zullen we een keer kennismaken? Ik kom graag even langs voor een koffie.",
        bye: "Liefs,",
      }
    : {
        subject: "Partnering with Women's Meetups in Amsterdam ☕",
        hi: `Hi${first ? ` ${first}` : ""},`,
        intro: "So lovely that you'd like to work together! As promised, here are the details.",
        packs_t: "The packages (excl. VAT, cancel any month)",
        packs: ["Taster table: free, one time. One meetup at your café to try it out.", "Once a month: €19 per month. One meetup at your café every month.", "Twice a month: €35 per month. Two meetups at your café every month."],
        coffee: "With every package you treat each woman to 1 coffee on the house. That's our standard offer to the women. We also always recommend they order breakfast or a bite.",
        indic_t: "As an indication",
        indic: "On average each woman spends €10 to €12 per meetup. With two tables a month (about 12 women) that's roughly €130 extra revenue per month, on a Sunday morning.",
        bonus: "Bonus: write a short blog or post about our partnership on your own website, with a link to us, and your first month is free. We'll send text and photos.",
        disc: "Good to know: you pay for a spot as a meetup location in our calendar and for the promotion. We do our best to fill every table, but we can't guarantee how many women come each time.",
        next: "Shall we meet? I'd love to drop by for a coffee.",
        bye: "Love,",
      };
}

export function partnerMailText(lang: "nl" | "en", name = "") {
  const m = partnerMail(lang, name);
  return [m.hi, "", m.intro, "", `${m.packs_t}:`, ...m.packs.map((x) => `- ${x}`), "", m.coffee, "", `${m.indic_t}: ${m.indic}`, "", m.bonus, "", m.disc, "", m.next, "", m.bye, "Boanna", "Women's Meetups in Amsterdam"].join("\n");
}
