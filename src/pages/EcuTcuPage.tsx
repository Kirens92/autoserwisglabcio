import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CarFront,
  Check,
  ChevronDown,
  Copy,
  Cpu,
  KeyRound,
  Leaf,
  ListX,
  Mail,
  Menu,
  PackageCheck,
  Phone,
  RotateCcw,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/nowelogobg.png";
import heroBg from "@/assets/hero-bg.png";
import { defaultEcuTcuContent, type EcuTcuContent } from "@/lib/ecuTcuContent";

type ExtendedContent = EcuTcuContent & { media?: { heroImage?: string } };
type Realization = { slug: string; title: string; excerpt: string; image?: string; createdAt?: string; category?: string; categories?: string[] };

const icons: Record<string, LucideIcon> = {
  ShieldCheck,
  Settings2,
  ScanSearch,
  Copy,
  Wrench,
  RotateCcw,
  CarFront,
  ListX,
  KeyRound,
  Leaf,
  PackageCheck,
};

function setMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

export default function EcuTcuPage() {
  const [content, setContent] = useState<ExtendedContent>(defaultEcuTcuContent);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [realizations, setRealizations] = useState<Realization[]>([]);

  useEffect(() => {
    fetch("/api/ecu-tcu", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data?.hero?.titleLine1) setContent(data);
      })
      .catch(() => undefined);

    fetch("/api/realizations", { cache: "no-store" })
      .then((response) => response.json())
      .then((items: Realization[]) => {
        if (!Array.isArray(items)) return;
        const ecu = items.filter((item) => {
          const category = String(item.category || "").toLowerCase();
          const categories = Array.isArray(item.categories) ? item.categories.map((value) => String(value).toLowerCase()) : [];
          return category.includes("ecu") || category.includes("tcu") || categories.some((value) => value.includes("ecu") || value.includes("tcu"));
        });
        setRealizations([...ecu].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))).slice(0, 3));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    document.title = content.seo.title;
    setMeta("description", content.seo.description);
    setMeta("robots", content.seo.robots);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", "https://autoserwisglabcio.pl/ecu-tcu");
    if (!canonical.parentNode) document.head.appendChild(canonical);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Diagnostyka, programowanie i naprawa ECU / TCU",
      serviceType: "Elektronika samochodowa i sterowniki ECU TCU",
      provider: {
        "@type": "AutoRepair",
        name: "Auto Serwis Gl@bcio",
        telephone: "+48 530 978 968",
        email: "glabcio@interia.pl",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Raszkowska 53",
          postalCode: "63-400",
          addressLocality: "Ostrów Wielkopolski",
          addressCountry: "PL",
        },
      },
      areaServed: ["Ostrów Wielkopolski", "Polska"],
      url: "https://autoserwisglabcio.pl/ecu-tcu",
    };
    let script = document.getElementById("ecu-tcu-schema") as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = "ecu-tcu-schema";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [content]);

  const heroImage = content.media?.heroImage || heroBg;
  const nav = useMemo(() => [
    ["Strona główna", "/nowa-strona"],
    ["Usługi", "/uslugi"],
    ["ECU | TCU", "/ecu-tcu"],
    ["Realizacje", "/realizacje"],
    ["Kontakt", "#kontakt"],
  ], []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#060706] text-[#f5f5f1] selection:bg-[#d8a82f] selection:text-black">
      <header className="sticky top-0 z-50 border-b border-[#d8a82f]/20 bg-[#080908]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[82px] max-w-[1480px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <a href="/nowa-strona" className="flex min-w-0 items-center gap-5">
            <img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto object-contain" />
            <div className="hidden border-l border-[#d8a82f]/30 pl-5 text-[9px] font-bold uppercase leading-4 tracking-[0.25em] text-white/35 xl:block">Specjalizacja<br />elektronika / ECU / TCU</div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {nav.map(([label, href]) => (
              <a key={label} href={href} className={`relative py-8 text-[11px] font-bold uppercase tracking-[0.16em] transition ${label === "ECU | TCU" ? "text-[#e4b438]" : "text-white/55 hover:text-white"}`}>
                {label}
                {label === "ECU | TCU" && <span className="absolute inset-x-0 bottom-0 h-px bg-[#e4b438]" />}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 sm:flex">
            <a href="tel:+48530978968" className="hidden text-right xl:block"><div className="text-xs font-bold text-white">+48 530 978 968</div><div className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/30">Ostrów Wielkopolski</div></a>
            <a href="tel:+48530978968" className="inline-flex items-center gap-2 bg-[#e1ad2d] px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-black transition hover:bg-[#f2c85b]">{content.hero.primaryCta}<ArrowRight className="h-4 w-4" /></a>
          </div>
          <button className="grid h-11 w-11 place-items-center border border-white/10 lg:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <div className="border-t border-white/10 bg-[#090a09] px-4 py-4 lg:hidden">{nav.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-white/5 py-4 text-sm font-semibold text-white/70">{label}</a>)}</div>}
      </header>

      <section className="relative border-b border-[#d8a82f]/20">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.22]" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#060706_0%,rgba(6,7,6,.97)_35%,rgba(6,7,6,.76)_69%,rgba(6,7,6,.92)_100%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="relative mx-auto grid min-h-[720px] max-w-[1480px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#e4b438]"><span className="h-px w-10 bg-[#e4b438]" />{content.hero.eyebrow}</div>
            <h1 className="mt-7 font-serif text-[clamp(3.2rem,6vw,6.4rem)] font-semibold leading-[.86] tracking-[-.045em]">
              <span className="block text-white">{content.hero.titleLine1}</span>
              <span className="mt-2 block text-[#e0ab2f]">{content.hero.titleLine2}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/58 sm:text-lg">{content.hero.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:+48530978968" className="inline-flex items-center gap-3 bg-[#e1ad2d] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.13em] text-black transition hover:bg-[#f2c85b]">{content.hero.primaryCta}<ArrowRight className="h-4 w-4" /></a>
              <a href="#realizacje-ecu" className="inline-flex items-center gap-3 border border-white/20 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.13em] text-white transition hover:border-[#e1ad2d]/50 hover:text-[#e1ad2d]">{content.hero.secondaryCta}<ArrowRight className="h-4 w-4" /></a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {content.hero.trust.map((item, index) => {
                const Icon = [Cpu, ShieldCheck, PackageCheck][index] || Cpu;
                return <div key={item.title} className="border border-[#d8a82f]/25 bg-black/35 p-4 backdrop-blur-sm"><Icon className="h-5 w-5 text-[#e2ae31]" /><div className="mt-3 text-xs font-bold">{item.title}</div><div className="mt-1 text-[11px] text-white/38">{item.text}</div></div>;
              })}
            </div>
          </div>

          <div className="relative lg:pl-5">
            <div className="absolute -inset-4 border border-[#e0ad31]/10" />
            <div className="relative overflow-hidden border border-[#d9a62d]/45 bg-[#090a09] p-2 shadow-[0_35px_90px_rgba(0,0,0,.55)]">
              <img src={heroImage} alt="Stanowisko do obsługi sterowników ECU i TCU" className="aspect-[16/10] w-full object-cover" />
              <div className="absolute inset-2 bg-gradient-to-t from-black/65 via-transparent to-black/10" />
              <div className="absolute bottom-6 right-6 max-w-xs border border-[#d8a82f]/40 bg-[#080908]/92 p-5 backdrop-blur-md">
                <div className="text-[9px] font-extrabold uppercase tracking-[0.23em] text-[#d8a82f]">{content.hero.mediaLabel}</div>
                <div className="mt-2 font-serif text-2xl font-semibold">{content.hero.mediaTitle}</div>
                <p className="mt-2 text-xs leading-5 text-white/45">{content.hero.mediaText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#090a09]">
        <div className="mx-auto grid max-w-[1480px] md:grid-cols-3">
          {content.benefits.map((item, index) => {
            const Icon = icons[item.icon] || ShieldCheck;
            return <article key={item.title} className={`p-7 sm:p-9 ${index > 0 ? "border-t border-white/10 md:border-l md:border-t-0" : ""}`}><div className="flex gap-5"><Icon className="mt-1 h-8 w-8 shrink-0 text-[#e1ad2d]" /><div><h2 className="font-serif text-2xl font-semibold">{item.title}</h2><p className="mt-3 text-sm leading-6 text-white/45">{item.text}</p></div></div></article>;
          })}
        </div>
      </section>

      <section id="uslugi-ecu" className="bg-[#060706] py-20 sm:py-24">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e1ad2d]">{content.services.eyebrow}</div><h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">{content.services.title}</h2></div><p className="max-w-xl text-sm leading-7 text-white/42">{content.services.description}</p></div>
          <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {content.services.items.map((item) => { const Icon = icons[item.icon] || Cpu; return <article key={item.title} className="group min-h-[180px] border border-white/10 bg-[#0a0b0a] p-6 transition hover:border-[#e1ad2d]/45 hover:bg-[#0e0f0e]"><Icon className="h-7 w-7 text-[#e1ad2d]" /><h3 className="mt-5 text-base font-bold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/40">{item.text}</p><div className="mt-5 h-px w-12 bg-[#e1ad2d]/50 transition-all group-hover:w-24" /></article>; })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#d8a82f]/18 bg-[#090a09]">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.16]" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060706] via-[#060706]/90 to-[#060706]/75" />
        <div className="relative mx-auto grid max-w-[1480px] gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:py-24">
          <div className="hidden min-h-[420px] border border-white/10 bg-cover bg-center lg:block" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.22),rgba(0,0,0,.55)),url(${heroBg})` }} />
          <div className="self-center"><div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e1ad2d]">{content.problem.eyebrow}</div><h2 className="mt-4 max-w-3xl font-serif text-4xl font-semibold sm:text-5xl">{content.problem.title}</h2><p className="mt-6 max-w-3xl text-base leading-8 text-white/52">{content.problem.description}</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{content.problem.bullets.map((bullet) => <div key={bullet} className="flex gap-3 border border-white/10 bg-black/25 p-4 text-sm text-white/65"><Check className="h-5 w-5 shrink-0 text-[#e1ad2d]" />{bullet}</div>)}</div></div>
        </div>
      </section>

      <section className="bg-[#060706] py-20 sm:py-24">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div><div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e1ad2d]">{content.flex.eyebrow}</div><h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">{content.flex.title}</h2><p className="mt-6 max-w-2xl text-base leading-8 text-white/50">{content.flex.description}</p></div>
          <div className="grid gap-3 sm:grid-cols-3">{content.flex.modes.map((mode) => <article key={mode.name} className="border border-[#d8a82f]/25 bg-[#0b0c0b] p-6"><div className="text-xs font-extrabold tracking-[0.2em] text-[#e1ad2d]">{mode.name}</div><p className="mt-4 text-sm leading-6 text-white/45">{mode.text}</p></article>)}</div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0a0b0a] py-20 sm:py-24">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8"><div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e1ad2d]">{content.process.eyebrow}</div><div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><h2 className="max-w-3xl font-serif text-4xl font-semibold sm:text-5xl">{content.process.title}</h2><p className="max-w-xl text-sm leading-7 text-white/42">{content.process.description}</p></div><div className="mt-10 grid gap-3 lg:grid-cols-5">{content.process.steps.map((step) => <article key={step.number} className="relative border border-white/10 bg-[#070807] p-6"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#e1ad2d] text-sm font-black text-black">{step.number}</div><h3 className="mt-5 font-serif text-xl font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-white/40">{step.text}</p></article>)}</div></div>
      </section>

      <section className="relative overflow-hidden bg-[#060706] py-20 sm:py-24">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.12]" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060706] via-[#060706]/88 to-[#060706]/70" />
        <div className="relative mx-auto grid max-w-[1480px] gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e1ad2d]">{content.shipping.eyebrow}</div><h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">{content.shipping.title}</h2><p className="mt-6 max-w-3xl text-base leading-8 text-white/50">{content.shipping.description}</p><a href="mailto:glabcio@interia.pl?subject=Wycena%20ECU%20TCU" className="mt-8 inline-flex items-center gap-3 bg-[#e1ad2d] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.13em] text-black">{content.shipping.cta}<ArrowRight className="h-4 w-4" /></a></div><div className="grid gap-3 sm:grid-cols-2">{content.shipping.points.map((point) => <div key={point} className="flex min-h-28 items-center gap-4 border border-white/10 bg-black/30 p-5"><PackageCheck className="h-6 w-6 shrink-0 text-[#e1ad2d]" /><span className="text-sm font-semibold text-white/65">{point}</span></div>)}</div></div>
      </section>

      <section id="realizacje-ecu" className="border-y border-white/10 bg-[#0a0b0a] py-20 sm:py-24">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8"><div className="flex items-end justify-between gap-6"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e1ad2d]">Realne naprawy</div><h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">Realizacje ECU / TCU</h2></div><a href="/realizacje" className="hidden text-xs font-bold uppercase tracking-[0.14em] text-[#e1ad2d] sm:inline-flex">Wszystkie realizacje →</a></div>{realizations.length ? <div className="mt-10 grid gap-4 lg:grid-cols-3">{realizations.map((item) => <a key={item.slug} href={`/realizacje/${item.slug}`} className="group overflow-hidden border border-white/10 bg-[#070807] hover:border-[#e1ad2d]/40">{item.image ? <img src={item.image} alt={item.title} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.02]" /> : <div className="grid aspect-[16/10] place-items-center bg-black/30"><Cpu className="h-10 w-10 text-[#e1ad2d]/50" /></div>}<div className="p-6"><div className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#e1ad2d]">ECU / TCU</div><h3 className="mt-3 font-serif text-2xl font-semibold">{item.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-white/40">{item.excerpt}</p></div></a>)}</div> : <div className="mt-10 border border-dashed border-white/12 bg-black/20 p-10 text-center"><Cpu className="mx-auto h-9 w-9 text-[#e1ad2d]/50" /><h3 className="mt-4 text-xl font-bold">Realizacje ECU / TCU pojawią się tutaj automatycznie</h3><p className="mx-auto mt-2 max-w-2xl text-sm text-white/38">Oznacz realizację kategorią ECU/TCU w panelu administratora, a zostanie wyświetlona w tej sekcji.</p></div>}</div>
      </section>

      <section className="bg-[#060706] py-20 sm:py-24"><div className="mx-auto grid max-w-[1480px] gap-10 px-4 sm:px-6 lg:grid-cols-[.72fr_1.28fr] lg:px-8"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e1ad2d]">{content.faq.eyebrow}</div><h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">{content.faq.title}</h2><p className="mt-5 max-w-md text-sm leading-7 text-white/42">Najważniejsze informacje o diagnostyce, programowaniu i obsłudze wysyłkowej sterowników.</p></div><div className="border-t border-white/10">{content.faq.items.map((item, index) => <div key={item.question} className="border-b border-white/10"><button className="flex w-full items-center justify-between gap-6 py-6 text-left" onClick={() => setOpenFaq(openFaq === index ? null : index)}><span className="font-serif text-xl font-semibold">{item.question}</span><ChevronDown className={`h-5 w-5 shrink-0 text-[#e1ad2d] transition ${openFaq === index ? "rotate-180" : ""}`} /></button>{openFaq === index && <p className="max-w-4xl pb-6 text-sm leading-7 text-white/45">{item.answer}</p>}</div>)}</div></div></section>

      <section id="kontakt" className="border-t border-[#d8a82f]/25 bg-[#0b0c0b] py-16 sm:py-20"><div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e1ad2d]">{content.cta.eyebrow}</div><h2 className="mt-4 max-w-4xl font-serif text-4xl font-semibold sm:text-5xl">{content.cta.title}</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-white/45">{content.cta.description}</p></div><div className="flex shrink-0 flex-wrap gap-3"><a href="tel:+48530978968" className="inline-flex items-center gap-3 bg-[#e1ad2d] px-6 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-black"><Phone className="h-4 w-4" />{content.cta.primaryLabel}</a><a href="mailto:glabcio@interia.pl?subject=ECU%20TCU%20-%20wycena" className="inline-flex items-center gap-3 border border-white/15 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-white"><Mail className="h-4 w-4" />{content.cta.secondaryLabel}</a></div></div></section>

      <footer className="border-t border-white/10 bg-[#050605] py-10"><div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8"><div className="flex items-center gap-5"><img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto" /><div className="text-xs leading-5 text-white/30">Elektronika samochodowa · ECU · TCU<br />Raszkowska 53, Ostrów Wielkopolski</div></div><div className="text-xs text-white/30">© Auto Serwis Gl@bcio · Profesjonalna diagnostyka i naprawa elektroniki samochodowej</div></div></footer>
    </main>
  );
}
