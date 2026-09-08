import { useEffect, useState } from "react";
import {
  Award,
  BatteryCharging,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Gauge,
  MapPin,
  Menu,
  MessageSquareQuote,
  Phone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Star,
  ThermometerSnowflake,
  Users,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import logo from "@/assets/nowelogobg.png";

const services = [
  { icon: SearchCheck, title: "Diagnostyka komputerowa", text: "Precyzyjna diagnostyka usterek i parametrów pracy." },
  { icon: Wrench, title: "Mechanika pojazdowa", text: "Naprawy bieżące, serwis i kompleksowa obsługa." },
  { icon: Gauge, title: "Układ hamulcowy", text: "Tarcze, klocki, płyn hamulcowy i kontrola układu." },
  { icon: Sparkles, title: "Serwis olejowy", text: "Olej, filtry i obsługa zgodna z wymaganiami auta." },
  { icon: ThermometerSnowflake, title: "Klimatyzacja", text: "Serwis, odgrzybianie i diagnostyka klimatyzacji." },
  { icon: Zap, title: "Elektryka", text: "Instalacja, ładowanie, rozruch i usterki elektryczne." },
  { icon: BatteryCharging, title: "Akumulator i ładowanie", text: "Testy akumulatora, alternatora i układu rozruchowego." },
  { icon: ShieldCheck, title: "Kontrola przed zakupem", text: "Weryfikacja stanu technicznego przed zakupem auta." },
];

const reviews = [
  {
    name: "Marek K.",
    text: "Profesjonalna obsługa, szybka diagnoza i konkretne wyjaśnienie naprawy. Zdecydowanie polecam.",
  },
  {
    name: "Anna P.",
    text: "Bardzo dobry kontakt i uczciwe podejście. Wszystko wykonane sprawnie i w umówionym terminie.",
  },
  {
    name: "Jakub T.",
    text: "Warsztat, do którego można wrócić. Rzetelnie, bez naciągania i z dużą wiedzą techniczną.",
  },
];

const NewHomepage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Auto Serwis Gl@bcio – nowy projekt strony | Ostrów Wielkopolski";

    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content") ?? null;
    description?.setAttribute(
      "content",
      "Auto Serwis Gl@bcio w Ostrowie Wielkopolskim. Specjalizacja Peugeot i Citroën, diagnostyka, mechanika, elektryka i serwis samochodowy.",
    );

    let robots = document.querySelector('meta[name="robots"]');
    const previousRobots = robots?.getAttribute("content") ?? null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");

    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.setAttribute("content", previousDescription);
      if (robots && previousRobots) robots.setAttribute("content", previousRobots);
    };
  }, []);

  const nav = [
    { href: "#specjalizacja", label: "Specjalizacja" },
    { href: "#uslugi", label: "Usługi" },
    { href: "#o-nas", label: "O nas" },
    { href: "#opinie", label: "Opinie" },
    { href: "#kontakt", label: "Kontakt" },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] text-white selection:bg-primary selection:text-black">
      <div className="border-b border-white/10 bg-[#050505] text-[11px] text-white/60 sm:text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />Raszkowska 53, Ostrów Wielkopolski</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-primary" />Pn–Pt 8:00–17:00 · Sob 8:00–13:00</span>
          </div>
          <a href="tel:+48530978968" className="inline-flex items-center gap-2 font-semibold text-white transition hover:text-primary">
            <Phone className="h-3.5 w-3.5 text-primary" />+48 530 978 968
          </a>
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-primary/15 bg-[#070707]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center" aria-label="Auto Serwis Gl@bcio – strona główna">
            <img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto sm:h-16" />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65 transition hover:text-primary">
                {item.label}
              </a>
            ))}
            <a href="#rezerwacja" className="border border-primary bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-primary/90">
              Umów wizytę
            </a>
          </div>

          <button className="text-primary lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#080808] px-4 pb-5 lg:hidden">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block border-b border-white/5 py-4 text-sm font-medium text-white/75">
                {item.label}
              </a>
            ))}
            <a href="#rezerwacja" onClick={() => setMenuOpen(false)} className="mt-4 block bg-primary px-5 py-3 text-center text-sm font-bold text-black">
              Umów wizytę
            </a>
          </div>
        )}
      </nav>

      <section className="relative isolate min-h-[760px] overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(214,165,52,0.18),transparent_24%),radial-gradient(circle_at_15%_20%,rgba(214,165,52,0.08),transparent_23%),linear-gradient(120deg,#080808_0%,#0b0b0b_54%,#050505_100%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:54px_54px]" />
        <div className="absolute -right-32 top-32 h-[520px] w-[520px] rounded-full border border-primary/20" />
        <div className="absolute -right-16 top-48 h-[390px] w-[390px] rounded-full border border-primary/10" />
        <div className="absolute right-20 top-64 h-[250px] w-[250px] rounded-full bg-primary/[0.04] blur-2xl" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-primary">
              <span className="h-px w-12 bg-primary" />Profesjonalny serwis samochodowy
            </div>

            <h1 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[78px]">
              Twój samochód.
              <span className="mt-2 block text-gradient-gold">Nasza specjalizacja.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
              Rzetelna diagnostyka, precyzyjna mechanika i doświadczenie w obsłudze samochodów Peugeot i Citroën. Bez przypadkowych decyzji — najpierw diagnoza, potem konkretna naprawa.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#rezerwacja" className="inline-flex items-center justify-center gap-2 bg-gradient-gold px-7 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-black transition hover:brightness-110">
                <CalendarDays className="h-4 w-4" />Umów wizytę
              </a>
              <a href="#uslugi" className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/[0.03] px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-primary/60 hover:text-primary">
                Poznaj nasze usługi <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-12 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-3">
              {[
                [Award, "Doświadczenie", "Wieloletnia praktyka"],
                [SearchCheck, "Precyzyjna diagnoza", "Bez zgadywania"],
                [ShieldCheck, "Uczciwe podejście", "Jasny zakres napraw"],
              ].map(([Icon, title, text]) => (
                <div key={String(title)} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-primary/30 bg-primary/[0.06] text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{String(title)}</div>
                    <div className="mt-1 text-xs text-white/45">{String(text)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md border border-primary/20 bg-black/45 p-7 shadow-[0_30px_100px_rgba(0,0,0,.55)] backdrop-blur-sm">
              <div className="absolute -left-px top-10 h-28 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
              <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Centrum diagnostyczne</div>
                  <div className="mt-2 text-xl font-semibold">Serwis oparty na danych</div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-primary">
                  <Gauge className="h-5 w-5" />
                </div>
              </div>

              <div className="relative mx-auto my-8 flex h-56 w-56 items-center justify-center rounded-full border border-primary/20">
                <div className="absolute inset-5 rounded-full border border-dashed border-primary/25" />
                <div className="absolute inset-10 rounded-full border border-white/10" />
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/45">Specjalizacja</div>
                  <div className="mt-2 text-2xl font-extrabold text-primary">PSA</div>
                  <div className="mt-1 text-sm font-medium text-white/80">Stellantis</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["Diagnostyka", "Mechanika", "Elektryka", "Serwis"].map((item) => (
                  <div key={item} className="border border-white/10 bg-white/[0.025] p-3">
                    <CheckCircle2 className="mb-2 h-4 w-4 text-primary" />
                    <div className="text-xs font-semibold text-white/75">{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="specjalizacja" className="relative border-b border-white/10 bg-[#0a0a0a] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">Nasza specjalizacja</div>
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Peugeot i Citroën znamy od strony praktycznej.</h2>
              <p className="mt-5 max-w-3xl leading-7 text-white/55">
                Skupiamy się na samochodach grupy PSA / Stellantis. Dzięki temu szybciej łączymy objawy z typowymi przyczynami i możemy prowadzić diagnostykę bardziej metodycznie.
              </p>
            </div>
            <div className="hidden text-right lg:block">
              <div className="text-5xl font-black text-primary/10">PSA</div>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="group relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-transparent p-7 sm:p-9">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-primary/10 transition duration-500 group-hover:scale-110" />
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Specjalizacja 01</div>
              <h3 className="mt-4 text-4xl font-extrabold">Peugeot</h3>
              <p className="mt-4 max-w-xl leading-7 text-white/55">Diagnostyka, obsługa serwisowa, mechanika, układy emisji spalin, elektryka i problemy eksploatacyjne.</p>
              <div className="mt-7 flex flex-wrap gap-2 text-xs text-white/60">
                {['PureTech', 'BlueHDi', 'AdBlue / SCR', 'EAT', 'BSI / elektronika'].map((tag) => <span key={tag} className="border border-white/10 bg-black/30 px-3 py-2">{tag}</span>)}
              </div>
            </article>

            <article className="group relative overflow-hidden border border-primary/20 bg-gradient-to-br from-white/[0.04] to-transparent p-7 sm:p-9">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-primary/10 transition duration-500 group-hover:scale-110" />
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Specjalizacja 02</div>
              <h3 className="mt-4 text-4xl font-extrabold">Citroën</h3>
              <p className="mt-4 max-w-xl leading-7 text-white/55">Kompleksowa obsługa układów mechanicznych i elektronicznych oraz diagnostyka charakterystycznych usterek platform PSA.</p>
              <div className="mt-7 flex flex-wrap gap-2 text-xs text-white/60">
                {['PureTech', 'BlueHDi', 'AdBlue / SCR', 'EAT', 'BSI / elektronika'].map((tag) => <span key={tag} className="border border-white/10 bg-black/30 px-3 py-2">{tag}</span>)}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="uslugi" className="bg-[#080808] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Nasze usługi</div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Kompleksowa obsługa serwisowa</h2>
            <p className="mt-4 text-white/50">Od diagnostyki po naprawę — jeden warsztat i jasna informacja o tym, co naprawdę wymaga uwagi.</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: Icon, title, text }) => (
              <article key={title} className="group bg-[#0b0b0b] p-6 transition hover:bg-[#101010] sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center border border-primary/25 bg-primary/[0.05] text-primary transition group-hover:border-primary/50">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a href="/uslugi" className="inline-flex items-center gap-2 border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-black">
              Zobacz wszystkie usługi <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="o-nas" className="border-y border-white/10 bg-[#0b0b0b] py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Auto Serwis Gl@bcio</div>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Warsztat, w którym diagnoza ma znaczenie.</h2>
            <p className="mt-6 leading-7 text-white/55">
              Stawiamy na rzetelną ocenę usterki, jasne przedstawienie zakresu prac i naprawę wykonaną bez zbędnych wymian. Każde zlecenie traktujemy indywidualnie, a klient otrzymuje konkretną informację, co zostało sprawdzone i dlaczego dana naprawa jest potrzebna.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {["Rzetelna diagnostyka", "Przejrzysty zakres prac", "Kontakt przed dodatkowymi kosztami", "Doświadczenie w PSA / Stellantis"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/75"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{item}</div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[
              ["10+", "lat doświadczenia"],
              ["4.9/5", "ocena klientów"],
              ["500+", "opinii i rekomendacji"],
              ["100%", "zaangażowania"],
            ].map(([value, label]) => (
              <div key={label} className="flex min-h-40 flex-col justify-end border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5 sm:p-6">
                <div className="text-3xl font-black text-primary sm:text-4xl">{value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-white/45">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080808] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Jak pracujemy</div>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Prosty proces. Bez niedomówień.</h2>
              <p className="mt-5 leading-7 text-white/50">Od pierwszego kontaktu do odbioru samochodu wiesz, na jakim etapie jest zlecenie.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["01", "Kontakt i termin", "Ustalamy objawy, zakres wstępny i dogodny termin."],
                ["02", "Diagnostyka", "Sprawdzamy przyczynę usterki i potwierdzamy zakres prac."],
                ["03", "Naprawa", "Realizujemy zaakceptowane prace i informujemy o zmianach."],
                ["04", "Odbiór", "Przekazujemy informacje o wykonanych czynnościach i zaleceniach."],
              ].map(([number, title, text]) => (
                <div key={number} className="border border-white/10 p-6">
                  <div className="text-xs font-black tracking-[0.2em] text-primary">{number}</div>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="opinie" className="border-y border-white/10 bg-[#0b0b0b] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Opinie klientów</div>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Zaufanie budowane naprawami.</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/50"><Star className="h-4 w-4 fill-primary text-primary" />4.9/5 · Google</div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.name} className="border border-white/10 bg-[#090909] p-6 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/70">{review.name.slice(0, 1)}</div>
                  <MessageSquareQuote className="h-5 w-5 text-primary/70" />
                </div>
                <div className="flex gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-primary text-primary" />)}</div>
                <p className="mt-4 text-sm leading-6 text-white/55">„{review.text}”</p>
                <div className="mt-5 text-sm font-bold">{review.name}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="rezerwacja" className="relative overflow-hidden bg-[#080808] py-20 sm:py-24">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[110px]" />
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Umów wizytę</div>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">Potrzebujesz diagnostyki lub naprawy?</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/50">Skontaktuj się z nami. Ustalimy termin i powiemy, jak przygotować samochód do wizyty.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="tel:+48530978968" className="inline-flex items-center justify-center gap-2 bg-gradient-gold px-7 py-4 text-sm font-extrabold text-black"><Phone className="h-4 w-4" />+48 530 978 968</a>
            <a href="#kontakt" className="inline-flex items-center justify-center gap-2 border border-primary/35 px-7 py-4 text-sm font-bold text-primary">Dane kontaktowe <ChevronRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <footer id="kontakt" className="border-t border-primary/15 bg-[#050505]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <img src={logo} alt="Auto Serwis Gl@bcio" className="h-16 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/40">Profesjonalny serwis samochodowy w Ostrowie Wielkopolskim. Specjalizacja Peugeot i Citroën.</p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Kontakt</div>
            <div className="mt-5 space-y-3 text-sm text-white/50">
              <a href="tel:+48530978968" className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-primary" />+48 530 978 968</a>
              <a href="mailto:glabcio@interia.pl" className="flex items-center gap-2 hover:text-primary"><MessageSquareQuote className="h-4 w-4 text-primary" />glabcio@interia.pl</a>
              <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Raszkowska 53<br />63-400 Ostrów Wielkopolski</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Godziny otwarcia</div>
            <div className="mt-5 space-y-3 text-sm text-white/50">
              <div className="flex justify-between gap-4"><span>Poniedziałek – Piątek</span><span className="text-white/75">8:00–17:00</span></div>
              <div className="flex justify-between gap-4"><span>Sobota</span><span className="text-white/75">8:00–13:00</span></div>
              <div className="flex justify-between gap-4"><span>Niedziela</span><span className="text-white/30">zamknięte</span></div>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Szybkie linki</div>
            <div className="mt-5 grid gap-3 text-sm text-white/50">
              <a href="/" className="hover:text-primary">Obecna strona główna</a>
              <a href="/uslugi" className="hover:text-primary">Usługi</a>
              <a href="/realizacje" className="hover:text-primary">Realizacje</a>
              <a href="#specjalizacja" className="hover:text-primary">Peugeot i Citroën</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/30 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <span>© {new Date().getFullYear()} Auto Serwis Gl@bcio. Wszelkie prawa zastrzeżone.</span>
            <span>Projekt demonstracyjny nowej strony głównej</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default NewHomepage;
