/* SEO landing pages: one search intent per page, own text per language. */
export type LandingKey = "friends" | "introvert" | "newcity" | "cafes";
type Block = { h: string; p: string };
export type Landing = { title: string; desc: string; kicker: string; h1: string; intro: string; blocks: Block[]; faq: [string, string][]; cta: string; nav: string };

export const LANDING_ROUTES: Record<LandingKey, { en: string; nl: string }> = {
  friends: { en: "/make-friends-in-amsterdam", nl: "/nl/vriendinnen-maken-amsterdam" },
  introvert: { en: "/meet-people-as-an-introvert", nl: "/nl/nieuwe-mensen-ontmoeten-introvert" },
  newcity: { en: "/new-in-amsterdam", nl: "/nl/nieuw-in-amsterdam" },
  cafes: { en: "/cosy-cafes-amsterdam", nl: "/nl/gezellige-cafes-amsterdam" },
};

export const LANDINGS: Record<LandingKey, Record<"nl" | "en", Landing>> = {
  friends: {
    nl: {
      title: "Vriendinnen maken in Amsterdam | Women's Meetups in Amsterdam",
      desc: "Nieuwe vriendinnen maken in Amsterdam? Schuif aan bij een tafel van zes meiden, gematcht op persoonlijkheid, in een gezellig café. Zondag rond 10.30, zonder abonnement.",
      nav: "Vriendinnen maken in Amsterdam",
      kicker: "Vriendinnen maken",
      h1: "Nieuwe vriendinnen maken in Amsterdam",
      intro: "Na je studie, na een verhuizing of gewoon omdat je vriendengroep kleiner is geworden: nieuwe vriendinnen maken als volwassene is lastiger dan je zou denken. Je ziet elke dag honderden mensen, maar écht kennismaken gebeurt bijna nooit. Daarom zetten wij zes meiden aan één tafel.",
      blocks: [
        { h: "Waarom het als volwassene zo lastig is", p: "Op school en tijdens je studie zag je dezelfde mensen elke week, vanzelf. Daarna valt dat weg. Werk, sport en apps leveren wel contacten op, maar zelden een vriendschap. Vriendschap ontstaat door herhaling en echte gesprekken, en daar is gewoon een plek voor nodig." },
        { h: "Zo werkt een Table of Six", p: "Je doet een korte quiz over je persoonlijkheid. Wij matchen zes meiden die bij elkaar passen en reserveren een tafel in een gezellig café. Twee dagen van tevoren hoor je waar het is en hoe je tafelgenoten heten. Een host heet iedereen welkom en brengt het gesprek op gang met vragenkaartjes." },
        { h: "Zes is het perfecte aantal", p: "Met twee wordt het snel een sollicitatiegesprek, met twintig sta je met een drankje in een hoek. Aan een tafel van zes kan iedereen meepraten, en is er altijd iemand met wie het klikt." },
        { h: "En daarna?", p: "Veel meiden wisselen aan het eind nummers uit en spreken zelf weer af. Wil je meer nieuwe mensen leren kennen, dan schuif je de volgende keer aan bij een nieuwe tafel." },
      ],
      faq: [
        ["Hoe maak ik nieuwe vriendinnen in Amsterdam?", "Zoek een plek waar je dezelfde soort mensen vaker ziet en waar je echt kunt praten. Bij Women's Meetups zit je met zes meiden aan één tafel, gematcht op persoonlijkheid, met vragenkaartjes en een host, zodat het gesprek vanzelf gaat."],
        ["Wat kost het?", "€12,50 per meetup, inclusief btw en servicekosten. Je eerste koffietje krijg je van ons! Geen abonnement."],
        ["Wanneer zijn de meetups?", "Meestal op zondag rond 10.30, perfect voor een brunch (die bestel en betaal je zelf in het café). De data staan op de homepage."],
      ],
      cta: "Bekijk de volgende tafels",
    },
    en: {
      title: "Make friends in Amsterdam | Women's Meetups in Amsterdam",
      desc: "Want to make new friends in Amsterdam? Join a table of six women, matched on personality, in a cosy café. Sundays around 10:30, no subscription.",
      nav: "Make friends in Amsterdam",
      kicker: "Making friends",
      h1: "How to make new friends in Amsterdam",
      intro: "After uni, after a move or just because your circle got smaller: making friends as an adult is harder than you'd think. You pass hundreds of people every day, but actually getting to know someone almost never happens. That's why we put six women at one table.",
      blocks: [
        { h: "Why it's so hard as an adult", p: "At school and uni you saw the same people every week without trying. After that, it disappears. Work, sport and apps give you contacts, but rarely a friendship. Friendship grows from seeing each other again and having real conversations, and that needs a place." },
        { h: "How a Table of Six works", p: "You take a short personality quiz. We match six women who'll get along and book a table in a cosy café. Two days before, you hear where it is and your tablemates' first names. A host welcomes everyone and gets the conversation going with question cards." },
        { h: "Six is the perfect number", p: "With two it quickly feels like a job interview, with twenty you end up in a corner with a drink. At a table of six everyone gets to talk, and there's always someone you click with." },
        { h: "And after that?", p: "Many women swap numbers at the end and meet up again on their own. Want to meet more new people? Next time you join a new table." },
      ],
      faq: [
        ["How do I make friends in Amsterdam?", "Find a place where you see the same kind of people more than once and can actually talk. At Women's Meetups you sit with six women at one table, matched on personality, with question cards and a host, so the conversation flows."],
        ["How much does it cost?", "€12.50 per meetup, incl. VAT and service costs. Your first coffee is included. No subscription."],
        ["When are the meetups?", "Usually on Sunday around 10:30, perfect for brunch (you order and pay for that yourself at the café). Dates are on the homepage."],
      ],
      cta: "See the next tables",
    },
  },
  introvert: {
    nl: {
      title: "Nieuwe mensen ontmoeten als introvert in Amsterdam | Women's Meetups",
      desc: "Introvert en toch nieuwe mensen ontmoeten? Een kleine tafel van zes, vragenkaartjes en een host die het gesprek op gang brengt. Geen drukke borrel, geen small talk.",
      nav: "Mensen ontmoeten als introvert",
      kicker: "Voor introverts",
      h1: "Nieuwe mensen ontmoeten als introvert",
      intro: "Een netwerkborrel met vijftig onbekenden? Liever niet. Toch wil je best nieuwe mensen leren kennen, alleen op een manier die rustig voelt. Daar is een Table of Six voor gemaakt.",
      blocks: [
        { h: "Klein en overzichtelijk", p: "Je zit met zes meiden aan één tafel, niet in een volle zaal. Je weet van tevoren waar je heen gaat, hoe laat het is en hoe je tafelgenoten heten. Geen verrassingen, wel een nieuwe kring." },
        { h: "Niemand hoeft de stilte te vullen", p: "Een host heet iedereen welkom en brengt het gesprek op gang met vragenkaartjes. De vragen gaan verder dan \"en wat doe jij?\", dus je komt sneller bij de leuke gesprekken. En wil je even luisteren, dan is dat ook prima." },
        { h: "Gematcht op wie je bent", p: "Met een korte quiz kijken we of je liever kletst, luistert, verbindt of ontdekt. Zo zetten we geen zes drukke praters bij één stille meid, maar een tafel waar iedereen zich op haar plek voelt." },
        { h: "Twee uur, dan ben je klaar", p: "Een meetup duurt ongeveer twee uur, op zondagochtend met een ontbijtje erbij. Lang genoeg om echt kennis te maken, kort genoeg om daarna nog op te laden." },
      ],
      faq: [
        ["Is dit wel iets als ik introvert of verlegen ben?", "Juist. De tafel is klein, je weet alles van tevoren en de vragenkaartjes doen het eerste werk. Veel meiden die zich introvert noemen, vinden het makkelijker dan een gewone borrel."],
        ["Moet ik veel praten?", "Nee. Iedereen krijgt de ruimte, maar je mag ook luisteren. De host let erop dat het gesprek goed loopt."],
        ["Kan ik met een vriendin komen?", "Je schrijft je los in, zodat iedereen aan tafel nieuw is. Dat maakt het voor iedereen even spannend, en dus ook gelijk."],
      ],
      cta: "Schuif aan bij een tafel",
    },
    en: {
      title: "Meet new people as an introvert in Amsterdam | Women's Meetups",
      desc: "Introverted but want to meet new people? A small table of six, question cards and a host who gets the conversation going. No crowded drinks, no small talk.",
      nav: "Meet people as an introvert",
      kicker: "For introverts",
      h1: "How to meet new people as an introvert",
      intro: "A networking drinks with fifty strangers? No thanks. Still, you'd like to meet new people, just in a way that feels calm. That's what a Table of Six is made for.",
      blocks: [
        { h: "Small and easy to oversee", p: "You sit with six women at one table, not in a packed room. You know in advance where you're going, what time it is and your tablemates' first names. No surprises, just a new circle." },
        { h: "Nobody has to fill the silence", p: "A host welcomes everyone and gets the conversation going with question cards. The questions go beyond \"so what do you do?\", so you get to the good conversations faster. And if you'd rather listen for a while, that's fine too." },
        { h: "Matched on who you are", p: "A short quiz tells us whether you're more of a chatter, listener, connector or explorer. So we don't put five loud talkers next to one quiet woman, but build a table where everyone feels at home." },
        { h: "Two hours, then you're done", p: "A meetup takes about two hours, on a Sunday morning with breakfast. Long enough to really get to know each other, short enough to recharge afterwards." },
      ],
      faq: [
        ["Is this for me if I'm introverted or shy?", "Yes. The table is small, you know everything in advance and the question cards do the first bit of work. Many women who call themselves introverts find it easier than regular drinks."],
        ["Do I have to talk a lot?", "No. Everyone gets space, but you're welcome to listen. The host makes sure the conversation flows."],
        ["Can I bring a friend?", "You sign up on your own, so everyone at the table is new. That makes it a little exciting for everyone, and equal too."],
      ],
      cta: "Join a table",
    },
  },
  newcity: {
    nl: {
      title: "Nieuw in Amsterdam? Leer meiden kennen | Women's Meetups in Amsterdam",
      desc: "Net verhuisd naar Amsterdam en nog weinig mensen om mee af te spreken? Schuif aan bij een Nederlandse, Engelse of gemengde tafel van zes meiden.",
      nav: "Nieuw in Amsterdam",
      kicker: "Nieuw in de stad",
      h1: "Nieuw in Amsterdam? Zo leer je snel mensen kennen",
      intro: "Je hebt een kamer, een baan of een studie, en misschien al een favoriet koffietentje. Maar met wie spreek je op zondag af? Bij Women's Meetups schuif je aan bij vijf andere meiden die ook nieuwe mensen willen leren kennen.",
      blocks: [
        { h: "Nederlands, Engels of gemengd", p: "Je kiest zelf in welke taal je aan tafel wilt zitten. Er zijn Nederlandse tafels, Engelse tafels en gemengde tafels, dus ook als je net hier woont en nog geen Nederlands spreekt, kun je meedoen." },
        { h: "Ontdek de stad via haar cafés", p: "Elke meetup is in een ander gezellig café of hidden spot, van De Pijp tot Noord. Zo leer je niet alleen mensen kennen, maar ook de plekken waar je daarna zelf weer heen gaat." },
        { h: "Iedereen aan tafel is nieuw", p: "Niemand komt met een vriendin of een vaste groep. Iedereen schuift alleen aan, dus niemand valt erbuiten." },
        { h: "Zonder gedoe", p: "Je meldt je aan, doet een korte quiz en betaalt €12,50. Twee dagen van tevoren krijg je het adres en de namen. Een host zorgt dat het gesprek loopt." },
      ],
      faq: [
        ["Ik spreek geen Nederlands, kan ik meedoen?", "Ja. Kies een Engelse of gemengde tafel bij je aanmelding."],
        ["Hoe vind ik vriendinnen als ik net verhuisd ben?", "Zoek iets dat terugkomt en waar je echt praat. Een Table of Six is elke maand, binnenkort elke twee weken, en je zit steeds met nieuwe meiden aan tafel."],
        ["In welke buurten zijn de meetups?", "Verspreid over de stad: De Pijp, Jordaan, Oud-West, Oost, Noord en Centrum. Je hoort twee dagen van tevoren waar je tafel is."],
      ],
      cta: "Kies je tafel",
    },
    en: {
      title: "New in Amsterdam? Meet women and make friends | Women's Meetups",
      desc: "Just moved to Amsterdam and don't know many people yet? Join an English, Dutch or mixed table of six women in a cosy café. Expats and internationals welcome.",
      nav: "New in Amsterdam",
      kicker: "New in town",
      h1: "New in Amsterdam? Here's how to meet people fast",
      intro: "You've got a room, a job or a study, maybe even a favourite coffee spot. But who do you meet up with on a Sunday? At Women's Meetups you join five other women who also want to meet new people.",
      blocks: [
        { h: "English, Dutch or mixed", p: "You choose the language of your table. There are English tables, Dutch tables and mixed tables, so you can join even if you just moved here and don't speak Dutch yet." },
        { h: "Discover the city through its cafés", p: "Every meetup is in a different cosy café or hidden spot, from De Pijp to Noord. You don't just meet people, you also find the places you'll go back to on your own." },
        { h: "Everyone at the table is new", p: "Nobody brings a friend or a group. Everyone joins on their own, so nobody is left out." },
        { h: "No hassle", p: "Sign up, take a short quiz and pay €12.50. Two days before, you get the address and first names. A host keeps the conversation flowing." },
      ],
      faq: [
        ["I don't speak Dutch, can I join?", "Yes. Choose an English or mixed table when you sign up."],
        ["How do I make friends after moving to Amsterdam?", "Find something that repeats and where you actually talk. A Table of Six happens every month, soon every two weeks, and you sit with new women each time."],
        ["Which neighbourhoods are the meetups in?", "All over town: De Pijp, Jordaan, Oud-West, Oost, Noord and Centrum. You hear where your table is two days before."],
      ],
      cta: "Pick your table",
    },
  },
  cafes: {
    nl: {
      title: "Gezellige cafés en hidden spots in Amsterdam | Women's Meetups",
      desc: "Op zoek naar gezellige cafés en hidden spots in Amsterdam voor een koffie date of brunch? Zo kiezen wij de plekken voor onze meetups, van De Pijp tot Noord.",
      nav: "Gezellige cafés in Amsterdam",
      kicker: "Cute cafés & hidden spots",
      h1: "Gezellige cafés en hidden spots in Amsterdam",
      intro: "Een goede meetup begint bij de plek. Wij zoeken cafés waar je graag blijft hangen: warm licht, lekkere koffie, een fijne tafel en een eigenaar die je met een glimlach begroet. Hier lees je hoe we ze kiezen en waar je ze vindt.",
      blocks: [
        { h: "Waar we op letten", p: "Een tafel waar zes mensen fijn kunnen zitten en elkaar verstaan. Geen harde muziek. Goede koffie en iets lekkers erbij, zoals een ontbijtje of bananenbrood. En vooral een persoonlijke sfeer, want daar begint een gezellig gesprek." },
        { h: "Verspreid over de stad", p: "We wisselen af tussen buurten: De Pijp, de Jordaan, Oud-West, Oost, Noord en Centrum. Zo ontdek je bij elke meetup een nieuw stukje Amsterdam, en is er altijd een tafel bij jou in de buurt." },
        { h: "Perfect voor een koffie date of brunch", p: "Onze meetups zijn meestal op zondag rond 10.30. De cafés die we kiezen zijn dus ook ideaal voor een rustige zondagbrunch met je nieuwe vriendinnen, of later nog eens samen." },
        { h: "Onze partnercafés", p: "Binnenkort vind je hier de cafés waar onze tafels staan. Heb jij zelf een gezellig café en wil je een meetup-locatie worden? Lees dan hoe we samenwerken." },
      ],
      faq: [
        ["Welke cafés zijn het?", "Dat wisselt per meetup. Je hoort twee dagen van tevoren in welk café je tafel staat."],
        ["Moet ik daar iets bestellen?", "Je eerste koffietje krijg je van ons! We raden je aan er lekker een ontbijtje of hapje bij te bestellen. Dat reken je zelf af."],
        ["Ik heb een café, kan ik meedoen?", "Graag! Kijk op onze pagina voor cafés hoe we samenwerken."],
      ],
      cta: "Schuif aan bij een tafel",
    },
    en: {
      title: "Cosy cafés and hidden spots in Amsterdam | Women's Meetups",
      desc: "Looking for cosy cafés and hidden spots in Amsterdam for a coffee date or brunch? Here's how we pick the places for our meetups, from De Pijp to Noord.",
      nav: "Cosy cafés in Amsterdam",
      kicker: "Cute cafés & hidden spots",
      h1: "Cosy cafés and hidden spots in Amsterdam",
      intro: "A good meetup starts with the place. We look for cafés where you want to stay a little longer: warm light, great coffee, a nice table and an owner who greets you with a smile. Here's how we pick them and where to find them.",
      blocks: [
        { h: "What we look for", p: "A table where six people can sit comfortably and hear each other. No loud music. Good coffee and something tasty, like breakfast or banana bread. And above all a personal atmosphere, because that's where a good conversation starts." },
        { h: "All over the city", p: "We switch between neighbourhoods: De Pijp, the Jordaan, Oud-West, Oost, Noord and Centrum. So every meetup you discover a new bit of Amsterdam, and there's always a table near you." },
        { h: "Perfect for a coffee date or brunch", p: "Our meetups are usually on Sunday around 10:30. So the cafés we pick are also ideal for a slow Sunday brunch with your new friends, or to come back to together later." },
        { h: "Our partner cafés", p: "Soon you'll find the cafés where our tables are right here. Do you run a cosy café and want to become a meetup location? Read how we work together." },
      ],
      faq: [
        ["Which cafés are they?", "It changes every meetup. You hear which café your table is at two days before."],
        ["Do I have to order something?", "Your first coffee is included. We recommend treating yourself to breakfast or a bite too. That you pay yourself."],
        ["I run a café, can I join?", "We'd love that! See our page for cafés on how we work together."],
      ],
      cta: "Join a table",
    },
  },
};
