export type SiteService = {
  icon: string;
  title: string;
  text: string;
};

export type SiteReview = {
  name: string;
  text: string;
};

export type SiteBrand = {
  name: string;
  description: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
};

export type SiteContent = {
  seo: {
    title: string;
    description: string;
    robots: string;
  };
  business: {
    phone: string;
    phoneHref: string;
    phone2: string;
    phoneHref2: string;
    email: string;
    street: string;
    postalCode: string;
    city: string;
    hoursWeekdays: string;
    hoursSaturday: string;
    hoursSunday: string;
  };
  navigation: Array<{ label: string; href: string }>;
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
    imageAlt: string;
    overlayEyebrow: string;
    overlayTitle: string;
    overlayText: string;
    trustPoints: Array<{ title: string; text: string }>;
    diagnosticEyebrow: string;
    diagnosticTitle: string;
    diagnosticCenterTop: string;
    diagnosticCenterMain: string;
    diagnosticCenterBottom: string;
    diagnosticItems: string[];
  };
  specialization: {
    eyebrow: string;
    title: string;
    description: string;
    brands: SiteBrand[];
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
    items: SiteService[];
  };
  realizations: {
    eyebrow: string;
    title: string;
    description: string;
    buttonLabel: string;
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    bullets: string[];
    stats: Array<{ value: string; label: string }>;
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: Array<{ number: string; title: string; text: string }>;
  };
  reviews: {
    eyebrow: string;
    title: string;
    ratingLabel: string;
    items: SiteReview[];
  };
  shipping: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    buttonLabel: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    phoneTitle: string;
    formTitle: string;
    formDescription: string;
    submitLabel: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  footer: {
    description: string;
    quickLinks: Array<{ label: string; href: string }>;
    bottomText: string;
  };
};

export const defaultSiteContent: SiteContent = {
  seo: {
    title: "Auto Serwis Gl@bcio – Peugeot i Citroën | Ostrów Wielkopolski",
    description: "Auto Serwis Gl@bcio w Ostrowie Wielkopolskim. Specjalizacja Peugeot i Citroën, diagnostyka, mechanika, elektryka, ECU/TCU i kompleksowy serwis samochodowy.",
    robots: "noindex, follow",
  },
  business: {
    phone: "+48 530 978 968",
    phoneHref: "+48530978968",
    phone2: "",
    phoneHref2: "",
    email: "glabcio@interia.pl",
    street: "Raszkowska 53",
    postalCode: "63-400",
    city: "Ostrów Wielkopolski",
    hoursWeekdays: "8:00–17:00",
    hoursSaturday: "8:00–13:00",
    hoursSunday: "zamknięte",
  },
  navigation: [
    { label: "Strona główna", href: "/nowa-strona" },
    { label: "Usługi", href: "/uslugi" },
    { label: "ECU | TCU", href: "/ecu-tcu" },
    { label: "Realizacje", href: "/realizacje" },
    { label: "Kontakt", href: "#kontakt" },
  ],
  hero: {
    eyebrow: "Profesjonalny serwis samochodowy",
    titleLine1: "Twój samochód.",
    titleLine2: "Nasza specjalizacja.",
    description: "Specjalistyczny serwis Peugeot i Citroën. Precyzyjna diagnostyka, mechanika, elektronika i naprawy wykonywane według przejrzystego procesu.",
    primaryCta: "Umów wizytę",
    secondaryCta: "Poznaj nasze usługi",
    image: "",
    imageAlt: "Samochód w Auto Serwis Gl@bcio",
    overlayEyebrow: "Peugeot & Citroën",
    overlayTitle: "Specjalizacja poparta doświadczeniem",
    overlayText: "Znamy typowe usterki, rozwiązania i procedury serwisowe platform PSA / Stellantis.",
    trustPoints: [
      { title: "Peugeot & Citroën", text: "Specjalizacja PSA / Stellantis" },
      { title: "Profesjonalna diagnostyka", text: "Diagbox, Bosch, Launch" },
      { title: "Transparentna wycena", text: "Kosztorys przed naprawą" },
    ],
    diagnosticEyebrow: "Centrum diagnostyczne",
    diagnosticTitle: "Serwis oparty na danych",
    diagnosticCenterTop: "Specjalizacja",
    diagnosticCenterMain: "PSA",
    diagnosticCenterBottom: "Stellantis",
    diagnosticItems: ["Diagnostyka", "Kosztorys", "Akceptacja", "Naprawa"],
  },
  specialization: {
    eyebrow: "Nasza specjalizacja",
    title: "Marki, które znamy od podszewki",
    description: "Skupiamy się na samochodach grupy PSA / Stellantis, dzięki czemu szybciej łączymy objawy z typowymi przyczynami i pracujemy według sprawdzonych procedur.",
    brands: [
      {
        name: "Peugeot",
        description: "Diagnostyka, obsługa serwisowa, mechanika, układy emisji spalin, elektryka i problemy eksploatacyjne.",
        tags: ["PureTech", "BlueHDi", "AdBlue / SCR", "EAT", "BSI / elektronika"],
        image: "",
        imageAlt: "Peugeot w Auto Serwis Gl@bcio",
      },
      {
        name: "Citroën",
        description: "Kompleksowa obsługa układów mechanicznych i elektronicznych oraz diagnostyka charakterystycznych usterek platform PSA.",
        tags: ["PureTech", "BlueHDi", "AdBlue / SCR", "EAT", "BSI / elektronika"],
        image: "",
        imageAlt: "Citroën w Auto Serwis Gl@bcio",
      },
    ],
  },
  services: {
    eyebrow: "Kompleksowa obsługa",
    title: "Wszystko, czego potrzebuje Twój samochód",
    description: "Od diagnostyki po naprawę — jeden warsztat, przejrzysty kosztorys i jasna informacja o tym, co naprawdę wymaga uwagi.",
    buttonLabel: "Zobacz pełny zakres usług",
    items: [
      { icon: "SearchCheck", title: "Diagnostyka komputerowa", text: "Precyzyjna diagnostyka usterek i parametrów pracy." },
      { icon: "Wrench", title: "Mechanika pojazdowa", text: "Naprawy bieżące, serwis i kompleksowa obsługa." },
      { icon: "Gauge", title: "Układ hamulcowy", text: "Tarcze, klocki, płyn hamulcowy i kontrola układu." },
      { icon: "Sparkles", title: "Serwis olejowy", text: "Olej, filtry i obsługa zgodna z wymaganiami auta." },
      { icon: "ThermometerSnowflake", title: "Klimatyzacja", text: "Serwis, odgrzybianie i diagnostyka klimatyzacji." },
      { icon: "Zap", title: "Elektryka i elektronika", text: "Instalacja, ładowanie, rozruch i usterki elektryczne." },
      { icon: "BatteryCharging", title: "Akumulator i ładowanie", text: "Testy akumulatora, alternatora i układu rozruchowego." },
      { icon: "ShieldCheck", title: "Kontrola przed zakupem", text: "Weryfikacja stanu technicznego przed zakupem auta." },
    ],
  },
  realizations: {
    eyebrow: "Ostatnie realizacje",
    title: "Zobacz efekty naszej pracy",
    description: "Rzeczywiste naprawy, diagnozy i serwisy wykonywane w naszym warsztacie.",
    buttonLabel: "Zobacz wszystkie realizacje",
  },
  about: {
    eyebrow: "Dlaczego Gl@bcio?",
    title: "Warsztat, któremu możesz zaufać",
    description: "Łączymy doświadczenie, nowoczesną diagnostykę i uczciwe podejście. Najpierw diagnoza i kosztorys, później prace zaakceptowane przez klienta.",
    image: "",
    imageAlt: "Wnętrze Auto Serwis Gl@bcio",
    bullets: ["Doświadczenie i specjalizacja", "Nowoczesny sprzęt diagnostyczny", "Transparentne ceny", "Gwarancja na wykonane usługi"],
    stats: [
      { value: "10+", label: "lat doświadczenia" },
      { value: "4.8/5", label: "ocena klientów" },
      { value: "100%", label: "zaangażowania" },
      { value: "PSA", label: "specjalizacja" },
    ],
  },
  process: {
    eyebrow: "Jak wygląda obsługa?",
    title: "Prosty proces. Pełna przejrzystość.",
    description: "Od pierwszego kontaktu do odbioru samochodu wiesz, na jakim etapie jest zlecenie i jaki jest zaakceptowany koszt naprawy.",
    steps: [
      { number: "01", title: "Umów wizytę", text: "Zadzwoń lub napisz. Ustalamy objawy i dogodny termin." },
      { number: "02", title: "Diagnostyka", text: "Sprawdzamy przyczynę problemu i przygotowujemy zakres prac." },
      { number: "03", title: "Wycena i akceptacja", text: "Przed naprawą otrzymujesz kosztorys. Działamy po Twojej akceptacji." },
      { number: "04", title: "Naprawa i odbiór", text: "Realizujemy uzgodnione prace i przekazujemy zalecenia przy odbiorze." },
    ],
  },
  reviews: {
    eyebrow: "Opinie klientów",
    title: "Zaufanie budowane naprawami",
    ratingLabel: "Google",
    items: [
      { name: "Marek K.", text: "Profesjonalna obsługa, szybka diagnoza i konkretne wyjaśnienie naprawy. Zdecydowanie polecam." },
      { name: "Anna P.", text: "Bardzo dobry kontakt i uczciwe podejście. Wszystko wykonane sprawnie i w umówionym terminie." },
      { name: "Jakub T.", text: "Warsztat, do którego można wrócić. Rzetelnie, bez naciągania i z dużą wiedzą techniczną." },
    ],
  },
  shipping: {
    eyebrow: "Nie tylko lokalnie",
    title: "Obsługa wysyłkowa w całej Polsce",
    description: "Sterowniki ECU/TCU i wybrane elementy możesz bezpiecznie wysłać kurierem lub Paczkomatem.",
    image: "",
    imageAlt: "Obsługa wysyłkowa Auto Serwis Gl@bcio w całej Polsce",
    buttonLabel: "Dowiedz się więcej o ECU / TCU",
  },
  contact: {
    eyebrow: "Skontaktuj się z nami",
    title: "Umów wizytę w serwisie",
    description: "Opisz problem, podaj model auta i zostaw numer telefonu. Oddzwonimy i ustalimy dogodny termin.",
    phoneTitle: "Wolisz zadzwonić?",
    formTitle: "Napisz do nas",
    formDescription: "Wyślij krótką wiadomość — przygotujemy odpowiedź i ustalimy kolejny krok.",
    submitLabel: "Wyślij wiadomość",
  },
  cta: {
    eyebrow: "Umów wizytę",
    title: "Potrzebujesz diagnostyki lub naprawy?",
    description: "Skontaktuj się z nami. Ustalimy termin i zakres pierwszego etapu diagnostyki.",
    primaryLabel: "Zadzwoń teraz",
    secondaryLabel: "Dane kontaktowe",
  },
  footer: {
    description: "Profesjonalny serwis samochodowy w Ostrowie Wielkopolskim. Specjalizacja Peugeot, Citroën oraz elektronika ECU / TCU.",
    quickLinks: [
      { label: "Strona główna", href: "/nowa-strona" },
      { label: "Usługi", href: "/uslugi" },
      { label: "ECU / TCU", href: "/ecu-tcu" },
      { label: "Realizacje", href: "/realizacje" },
    ],
    bottomText: "Auto Serwis Gl@bcio. Wszelkie prawa zastrzeżone.",
  },
};

export function normalizeSiteContent(input?: Partial<SiteContent> | null): SiteContent {
  const source = input || {};
  const business = source.business || {} as SiteContent["business"];
  const hero = source.hero || {} as SiteContent["hero"];
  const specialization = source.specialization || {} as SiteContent["specialization"];
  const services = source.services || {} as SiteContent["services"];
  const realizations = source.realizations || {} as SiteContent["realizations"];
  const about = source.about || {} as SiteContent["about"];
  const process = source.process || {} as SiteContent["process"];
  const reviews = source.reviews || {} as SiteContent["reviews"];
  const shipping = source.shipping || {} as SiteContent["shipping"];
  const contact = source.contact || {} as SiteContent["contact"];
  const cta = source.cta || {} as SiteContent["cta"];
  const footer = source.footer || {} as SiteContent["footer"];

  return {
    ...defaultSiteContent,
    ...source,
    seo: { ...defaultSiteContent.seo, ...(source.seo || {}) },
    business: { ...defaultSiteContent.business, ...business },
    navigation: Array.isArray(source.navigation) && source.navigation.length ? source.navigation : defaultSiteContent.navigation,
    hero: {
      ...defaultSiteContent.hero,
      ...hero,
      trustPoints: Array.isArray(hero.trustPoints) && hero.trustPoints.length ? hero.trustPoints : defaultSiteContent.hero.trustPoints,
      diagnosticItems: Array.isArray(hero.diagnosticItems) && hero.diagnosticItems.length ? hero.diagnosticItems : defaultSiteContent.hero.diagnosticItems,
    },
    specialization: {
      ...defaultSiteContent.specialization,
      ...specialization,
      brands: Array.isArray(specialization.brands) && specialization.brands.length
        ? specialization.brands.map((brand, index) => ({ ...defaultSiteContent.specialization.brands[index % defaultSiteContent.specialization.brands.length], ...brand }))
        : defaultSiteContent.specialization.brands,
    },
    services: {
      ...defaultSiteContent.services,
      ...services,
      items: Array.isArray(services.items) && services.items.length ? services.items : defaultSiteContent.services.items,
    },
    realizations: { ...defaultSiteContent.realizations, ...realizations },
    about: {
      ...defaultSiteContent.about,
      ...about,
      bullets: Array.isArray(about.bullets) && about.bullets.length ? about.bullets : defaultSiteContent.about.bullets,
      stats: Array.isArray(about.stats) && about.stats.length ? about.stats : defaultSiteContent.about.stats,
    },
    process: {
      ...defaultSiteContent.process,
      ...process,
      steps: Array.isArray(process.steps) && process.steps.length ? process.steps : defaultSiteContent.process.steps,
    },
    reviews: {
      ...defaultSiteContent.reviews,
      ...reviews,
      items: Array.isArray(reviews.items) && reviews.items.length ? reviews.items : defaultSiteContent.reviews.items,
    },
    shipping: { ...defaultSiteContent.shipping, ...shipping },
    contact: { ...defaultSiteContent.contact, ...contact },
    cta: { ...defaultSiteContent.cta, ...cta },
    footer: {
      ...defaultSiteContent.footer,
      ...footer,
      quickLinks: Array.isArray(footer.quickLinks) && footer.quickLinks.length ? footer.quickLinks : defaultSiteContent.footer.quickLinks,
    },
  };
}
