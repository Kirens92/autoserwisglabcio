export type EcuFeature = {
  icon: string;
  title: string;
  text: string;
};

export type EcuService = {
  icon: string;
  title: string;
  text: string;
};

export type EcuStep = {
  number: string;
  title: string;
  text: string;
};

export type EcuFaq = {
  question: string;
  answer: string;
};

export type EcuTcuContent = {
  seo: {
    title: string;
    description: string;
    robots: string;
  };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    trust: Array<{ title: string; text: string }>;
    mediaLabel: string;
    mediaTitle: string;
    mediaText: string;
  };
  benefits: EcuFeature[];
  services: {
    eyebrow: string;
    title: string;
    description: string;
    items: EcuService[];
  };
  problem: {
    eyebrow: string;
    title: string;
    description: string;
    bullets: string[];
  };
  flex: {
    eyebrow: string;
    title: string;
    description: string;
    modes: Array<{ name: string; text: string }>;
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: EcuStep[];
  };
  shipping: {
    eyebrow: string;
    title: string;
    description: string;
    points: string[];
    cta: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: EcuFaq[];
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
};

export const defaultEcuTcuContent: EcuTcuContent = {
  seo: {
    title: "Naprawa i programowanie ECU TCU Ostrów Wielkopolski | Gl@bcio",
    description: "Programowanie, diagnostyka, klonowanie i naprawa sterowników ECU oraz TCU. Oryginalny FLEX, OBD/BENCH/BOOT i obsługa wysyłkowa w całej Polsce.",
    robots: "noindex, follow",
  },
  hero: {
    eyebrow: "Specjalistyczny serwis elektroniki samochodowej",
    titleLine1: "Modyfikacje Sterowników",
    titleLine2: "ECU | TCU",
    description: "Profesjonalna diagnostyka, programowanie, kodowanie i naprawa sterowników silnika oraz skrzyń biegów. Pracujemy na oryginalnym sprzęcie FLEX w trybach OBD, BENCH oraz BOOT.",
    primaryCta: "Umów konsultację",
    secondaryCta: "Zobacz realizacje",
    trust: [
      { title: "Oryginalny FLEX", text: "Profesjonalny sprzęt" },
      { title: "OBD / BENCH / BOOT", text: "Pełny zakres pracy" },
      { title: "Obsługa wysyłkowa", text: "Cała Polska" },
    ],
    mediaLabel: "Profesjonalny sprzęt",
    mediaTitle: "Realne możliwości.",
    mediaText: "Oryginalny FLEX — stabilność, bezpieczeństwo i kontrola procesu.",
  },
  benefits: [
    { icon: "ShieldCheck", title: "Bezpieczna praca ze sterownikiem", text: "Kontrolowany proces, kopie danych przed operacją i praca na profesjonalnym sprzęcie." },
    { icon: "Settings2", title: "Szeroki zakres usług", text: "ECU, TCU, kodowanie, klonowanie, naprawa oprogramowania i diagnostyka elektroniki." },
    { icon: "ScanSearch", title: "Specjalistyczna diagnostyka", text: "Analiza błędów, danych sterownika i rzeczywistych przyczyn powracających usterek." },
  ],
  services: {
    eyebrow: "Zakres usług ECU / TCU",
    title: "W czym możemy pomóc?",
    description: "Kompleksowa obsługa sterowników silnika i skrzyń biegów — od diagnozy po bezpieczne przywrócenie sprawności.",
    items: [
      { icon: "Copy", title: "Klonowanie ECU / TCU 1:1", text: "Migracja danych do jednostki zastępczej po awarii, tam gdzie jest to technicznie możliwe." },
      { icon: "Wrench", title: "Naprawa oprogramowania", text: "Przywracanie sterowników po nieudanych zapisach, błędach danych i problemach programowych." },
      { icon: "RotateCcw", title: "Oryginalne oprogramowanie", text: "Przywracanie poprawnego, fabrycznego oprogramowania, gdy wymaga tego diagnostyka." },
      { icon: "CarFront", title: "Kodowanie i adaptacja", text: "Dopasowanie wymienionych modułów do pojazdu i konfiguracji auta." },
      { icon: "ListX", title: "Diagnostyka DTC", text: "Identyfikacja źródła powracających kodów usterek zamiast kasowania objawów." },
      { icon: "KeyRound", title: "Immobilizer i synchronizacja", text: "Diagnostyka i zgodne z prawem operacje synchronizacji modułów po potwierdzeniu prawa do pojazdu." },
      { icon: "Leaf", title: "Układy emisji", text: "Diagnostyka i naprawa systemów AdBlue, SCR, DPF/FAP oraz EGR zgodnie z przeznaczeniem pojazdu." },
      { icon: "PackageCheck", title: "Obsługa wysyłkowa", text: "Diagnostyka i obsługa sterowników wysyłanych z całej Polski." },
    ],
  },
  problem: {
    eyebrow: "Twoje auto nie musi stać w ASO",
    title: "Awaria sterownika? Mamy rozwiązanie.",
    description: "Uszkodzony sterownik ECU lub TCU może całkowicie unieruchomić samochód. W wielu przypadkach zamiast wymiany całej jednostki możliwa jest diagnoza, naprawa danych lub migracja sterownika do sprawnej jednostki zastępczej.",
    bullets: [
      "Diagnoza przed rozpoczęciem prac",
      "Kosztorys wysyłany do klienta do akceptacji",
      "Możliwość niższego kosztu niż wymiana całego modułu",
      "Praca na oryginalnym sprzęcie FLEX",
    ],
  },
  flex: {
    eyebrow: "Oryginalny sprzęt FLEX",
    title: "OBD / BENCH / BOOT",
    description: "Dobieramy metodę dostępu do sterownika do konkretnej jednostki i zakresu prac. Nie stosujemy jednego schematu do każdego sterownika.",
    modes: [
      { name: "OBD", text: "Praca przez złącze diagnostyczne, gdy sterownik i procedura na to pozwalają." },
      { name: "BENCH", text: "Bezpośrednia praca ze sterownikiem poza pojazdem bez ingerencji w obudowę, jeśli wspiera to dany moduł." },
      { name: "BOOT", text: "Dostęp serwisowy do pamięci sterownika używany wtedy, gdy wymaga tego procedura naprawcza." },
    ],
  },
  process: {
    eyebrow: "Jak wygląda realizacja?",
    title: "Przejrzysty proces. Pełna kontrola kosztów.",
    description: "Każdy etap jest jasny, a płatne prace rozpoczynamy dopiero po akceptacji kosztorysu przez klienta.",
    steps: [
      { number: "01", title: "Wycena i diagnoza", text: "Wstępna analiza objawów, numerów sterownika i danych pojazdu." },
      { number: "02", title: "Akceptacja kosztorysu", text: "Wysyłamy klientowi zakres prac i kosztorys do zatwierdzenia przed rozpoczęciem naprawy." },
      { number: "03", title: "Programowanie / naprawa", text: "Realizujemy wyłącznie zaakceptowany zakres na profesjonalnym sprzęcie." },
      { number: "04", title: "Test i weryfikacja", text: "Sprawdzamy poprawność wykonanych operacji i integralność danych." },
      { number: "05", title: "Odbiór lub wysyłka", text: "Sterownik odbierasz w warsztacie albo otrzymujesz bezpiecznie zapakowaną przesyłkę." },
    ],
  },
  shipping: {
    eyebrow: "Usługa wysyłkowa",
    title: "Obsługa sterowników z całej Polski",
    description: "Nie musisz przyjeżdżać do Ostrowa Wielkopolskiego. Po kontakcie ustalamy zakres wstępny i sposób bezpiecznej wysyłki sterownika.",
    points: ["Kurier lub Paczkomat", "Klienci indywidualni i warsztaty", "Kosztorys przed naprawą", "Stały kontakt na każdym etapie"],
    cta: "Wyceń usługę wysyłkową",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Najczęstsze pytania",
    items: [
      { question: "Czym różni się ECU od TCU?", answer: "ECU steruje pracą silnika, a TCU odpowiada za sterowanie automatyczną skrzynią biegów. Zakres danych i procedur zależy od konkretnego sterownika." },
      { question: "Czy sterownik można sklonować 1:1?", answer: "W wielu przypadkach tak, ale możliwość klonowania zależy od typu sterownika, jego stanu oraz dostępności danych źródłowych. Najpierw wykonujemy identyfikację i diagnozę." },
      { question: "Czy potrzebny jest cały samochód?", answer: "Nie zawsze. Część usług można wykonać wysyłkowo na samym sterowniku, ale niektóre procedury wymagają pojazdu do adaptacji, testów lub finalnej weryfikacji." },
      { question: "Jakie tryby programowania obsługujecie?", answer: "Pracujemy w zależności od sterownika i procedury w trybach OBD, BENCH oraz BOOT na oryginalnym sprzęcie FLEX." },
      { question: "Czy przed naprawą otrzymam kosztorys?", answer: "Tak. Po diagnozie przedstawiamy zakres i koszt prac. Naprawę rozpoczynamy dopiero po akceptacji klienta." },
      { question: "Czy obsługujecie wysyłkę z całej Polski?", answer: "Tak. Po kontakcie przekazujemy instrukcję przygotowania i wysyłki sterownika. Zwrot może odbyć się kurierem lub do Paczkomatu." },
      { question: "Czy diagnozujecie systemy AdBlue, DPF/FAP i EGR?", answer: "Tak. Skupiamy się na diagnostyce przyczyn usterek i naprawie systemów zgodnie z przeznaczeniem oraz wymaganiami dla danego pojazdu." },
      { question: "Jakie dane podać do wyceny?", answer: "Najlepiej podać markę, model, rok, silnik, numer sterownika, objawy oraz — jeśli są dostępne — zdjęcie etykiety i kody błędów." },
    ],
  },
  cta: {
    eyebrow: "Potrzebujesz wyceny?",
    title: "Wyślij numer sterownika i opisz problem.",
    description: "Na tej podstawie ustalimy, jakie dane są potrzebne do dalszej diagnostyki i czy usługę można zrealizować wysyłkowo.",
    primaryLabel: "Zadzwoń: +48 530 978 968",
    secondaryLabel: "Napisz e-mail",
  },
};
