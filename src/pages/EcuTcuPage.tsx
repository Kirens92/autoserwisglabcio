import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  CarFront,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Cpu,
  Database,
  Facebook,
  FileCheck2,
  FileText,
  Gauge,
  Instagram,
  KeyRound,
  Leaf,
  ListX,
  LockKeyhole,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  Phone,
  RefreshCcw,
  RotateCcw,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Truck,
  Wrench,
  X,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/nowelogobg.png";
import heroBg from "@/assets/hero-bg.png";
import { defaultEcuTcuContent, type EcuTcuContent } from "@/lib/ecuTcuContent";

type ExtendedContent = EcuTcuContent & { media?: { heroImage?: string } };
type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  createdAt?: string;
  category?: string;
  categories?: string[];
};

type DisplayStep = {
  number: string;
  title: string;
  text: string;
};

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

const gold = "#e3ad31";
const goldSoft = "#c9962a";

function setMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function SectionKicker({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.28em] text-[#e3ad31]">
      <span className="h-px w-8 bg-[#e3ad31]" />
      {children}
    </div>
  );
}

function PolandMap() {
  const points = [
    [88, 50],
    [142, 58],
    [190, 76],
    [218, 112],
    [187, 145],
    [132, 152],
    [83, 135],
    [55, 104],
  ];

  return (
    <div className="relative mx-auto aspect-[1.25/1] w-full max-w-[310px]">
      <svg viewBox="0 0 280 210" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M54 46 84 28l30 4 20-12 34 10 21 18 31 4 13 25 21 16-8 27 9 27-25 11-13 26-31 2-22 16-33-8-29 8-22-17-27 1-10-28-19-15 7-30-12-25 22-18 13-26Z"
          fill="rgba(227,173,49,.04)"
          stroke="rgba(227,173,49,.95)"
          strokeWidth="2"
          filter="url(#glow)"
        />
        {points.map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="11" fill="rgba(227,173,49,.08)" />
            <circle cx={x} cy={y} r="4" fill="#e3ad31" filter="url(#glow)" />
            {index < points.length - 1 && (
              <line
                x1={x}
                y1={y}
                x2={points[index + 1][0]}
                y2={points[index + 1][1]}
                stroke="rgba(227,173,49,.28)"
                strokeWidth="1"
              />
            )}
          </g>
        ))}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(227,173,49,.08),transparent_65%)]" />
    </div>
  );
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
          const categories = Array.isArray(item.categories)
            ? item.categories.map((value) => String(value).toLowerCase())
            : [];
          return (
            category.includes("ecu") ||
            category.includes("tcu") ||
            categories.some((value) => value.includes("ecu") || value.includes("tcu"))
          );
        });
        setRealizations(
          [...ecu]
            .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
            .slice(0, 3),
        );
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
  const nav = useMemo(
    () => [
      ["Strona główna", "/nowa-strona"],
      ["Usługi", "/uslugi"],
      ["ECU | TCU", "/ecu-tcu"],
      ["Realizacje", "/realizacje"],
      ["Kontakt", "#kontakt"],
    ],
    [],
  );

  const processSteps: DisplayStep[] = useMemo(() => {
    const steps = content.process.steps;
    if (steps.length <= 4) return steps;
    return [
      steps[0],
      steps[1],
      {
        ...steps[2],
        text: `${steps[2].text} ${steps[3]?.text || ""}`.trim(),
      },
      {
        number: "04",
        title: steps[4]?.title || "Odbiór lub wysyłka",
        text: steps[4]?.text || "Odbiór osobisty lub bezpieczna wysyłka zwrotna.",
      },
    ];
  }, [content.process.steps]);

  const problemHighlights = [
    { icon: FileCheck2, title: "Diagnoza i kosztorys", text: "przed naprawą" },
    { icon: Clock3, title: "Sprawna realizacja", text: "jasny proces" },
    { icon: Database, title: "Ochrona danych", text: "kopie i kontrola" },
    { icon: ShieldCheck, title: "FLEX", text: "oryginalny sprzęt" },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050605] text-[#f4f1e9] selection:bg-[#e3ad31] selection:text-black">
      <header className="sticky top-0 z-50 border-b border-[#c9962a]/30 bg-[#060706]/95 shadow-[0_12px_32px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-5 px-4 sm:px-6">
          <a href="/nowa-strona" className="flex shrink-0 items-center">
            <img src={logo} alt="Auto Serwis Gl@bcio" className="h-[54px] w-auto object-contain" />
          </a>

          <nav className="hidden items-stretch lg:flex">
            {nav.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className={`relative flex items-center px-4 text-[11px] font-semibold transition ${
                  label === "ECU | TCU" ? "text-[#efb83b]" : "text-white/66 hover:text-white"
                }`}
              >
                {label}
                {label === "ECU | TCU" && (
                  <span className="absolute inset-x-4 bottom-0 h-[2px] bg-[#e3ad31] shadow-[0_0_15px_rgba(227,173,49,.55)]" />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:+48530978968"
              className="hidden border-r border-white/10 pr-4 text-right xl:block"
            >
              <div className="flex items-center justify-end gap-2 text-[11px] font-bold text-white">
                <Phone className="h-3.5 w-3.5 text-[#e3ad31]" /> +48 530 978 968
              </div>
              <div className="mt-1 flex items-center justify-end gap-2 text-[9px] text-white/40">
                <MapPin className="h-3 w-3 text-[#e3ad31]" /> Ostrów Wielkopolski
              </div>
            </a>
            <a
              href="tel:+48530978968"
              className="inline-flex items-center gap-2 rounded-[2px] bg-[#e3ad31] px-5 py-3 text-[10px] font-black uppercase tracking-[0.08em] text-black shadow-[0_6px_24px_rgba(227,173,49,.18)] transition hover:bg-[#f3c34f]"
            >
              {content.hero.primaryCta}
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button
            className="grid h-10 w-10 place-items-center border border-white/10 lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/8 bg-[#080908] px-4 py-3 lg:hidden">
            {nav.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block border-b border-white/5 py-4 text-sm font-semibold text-white/70 last:border-b-0"
              >
                {label}
              </a>
            ))}
          </div>
        )}
      </header>

      <section className="relative border-b border-[#c9962a]/35 bg-[#080908]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.34]"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,5,4,.98)_0%,rgba(4,5,4,.92)_38%,rgba(4,5,4,.58)_70%,rgba(4,5,4,.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,rgba(227,173,49,.08),transparent_33%)]" />

        <div className="relative mx-auto grid min-h-[530px] max-w-[1240px] items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:py-14">
          <div className="relative z-10 max-w-[520px]">
            <SectionKicker>{content.hero.eyebrow}</SectionKicker>
            <h1
              className="mt-5 text-[clamp(3rem,5.1vw,5.25rem)] font-semibold leading-[.9] tracking-[-.045em]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              <span className="block text-white">{content.hero.titleLine1}</span>
              <span className="mt-1 block text-[#e3ad31]">{content.hero.titleLine2}</span>
            </h1>
            <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-white/72">
              {content.hero.description}
            </p>

            <div className="mt-6 grid max-w-[500px] gap-2 sm:grid-cols-3">
              {content.hero.trust.map((item, index) => {
                const Icon = [Cpu, Gauge, Truck][index] || Cpu;
                return (
                  <div
                    key={item.title}
                    className="flex min-h-[62px] items-center gap-3 border border-[#c9962a]/55 bg-[#080908]/72 px-3.5 py-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.02)] backdrop-blur"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-[#e3ad31]" />
                    <div>
                      <div className="text-[10px] font-bold leading-4 text-white">{item.title}</div>
                      <div className="text-[9px] leading-4 text-white/42">{item.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <a
                href="tel:+48530978968"
                className="inline-flex items-center gap-2 bg-[#e3ad31] px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.08em] text-black transition hover:bg-[#f1c14c]"
              >
                {content.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:glabcio@interia.pl?subject=ECU%20TCU%20-%20szybka%20wycena"
                className="inline-flex items-center gap-2 border border-[#c9962a]/55 bg-black/30 px-5 py-3.5 text-[10px] font-black uppercase tracking-[0.08em] text-white transition hover:border-[#e3ad31] hover:text-[#e3ad31]"
              >
                <FileText className="h-4 w-4 text-[#e3ad31]" />
                Szybka wycena
              </a>
            </div>
          </div>

          <div className="relative lg:-mr-2 lg:pl-2">
            <div className="absolute -inset-2 border border-[#e3ad31]/20" />
            <div className="relative overflow-hidden rounded-[3px] border border-[#e3ad31]/80 bg-[#080908] p-[5px] shadow-[0_28px_70px_rgba(0,0,0,.55),0_0_30px_rgba(227,173,49,.08)]">
              <img
                src={heroImage}
                alt="Stanowisko do diagnostyki i programowania ECU oraz TCU"
                className="aspect-[1.47/1] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-[5px] bg-gradient-to-t from-black/58 via-transparent to-black/8" />
              <div className="absolute bottom-5 right-5 w-[min(300px,72%)] border border-[#e3ad31]/45 bg-[#070807]/94 p-4 shadow-[0_14px_40px_rgba(0,0,0,.45)] backdrop-blur-md">
                <div
                  className="text-[21px] font-semibold leading-6 text-white"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {content.hero.mediaTitle}
                </div>
                <p className="mt-2 text-[11px] leading-5 text-white/52">{content.hero.mediaText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#c9962a]/24 bg-[#080908]">
        <div className="mx-auto grid max-w-[1240px] md:grid-cols-3">
          {content.benefits.map((item, index) => {
            const Icon = icons[item.icon] || ShieldCheck;
            return (
              <article
                key={item.title}
                className={`px-5 py-6 sm:px-7 ${
                  index > 0 ? "border-t border-white/8 md:border-l md:border-t-0" : ""
                }`}
              >
                <div className="flex gap-4">
                  <Icon className="mt-0.5 h-8 w-8 shrink-0 text-[#e3ad31]" />
                  <div>
                    <h2
                      className="text-[19px] font-semibold"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {item.title}
                    </h2>
                    <p className="mt-2 text-[12px] leading-5 text-white/48">{item.text}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="uslugi-ecu" className="border-b border-[#c9962a]/25 bg-[#050605] py-9 sm:py-11">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <h2
              className="text-3xl font-semibold sm:text-[38px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {content.services.title}
            </h2>
            <p className="max-w-[460px] text-right text-[11px] leading-5 text-white/44 md:text-right">
              {content.services.description}
            </p>
          </div>

          <div className="mt-7 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
            {content.services.items.map((item) => {
              const Icon = icons[item.icon] || Cpu;
              return (
                <article
                  key={item.title}
                  className="group flex min-h-[94px] items-center gap-4 border border-[#c9962a]/45 bg-[#090a09] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#e3ad31] hover:bg-[#0d0e0d]"
                >
                  <Icon className="h-7 w-7 shrink-0 text-[#e3ad31]" />
                  <div>
                    <h3 className="text-[12px] font-semibold leading-5 text-white">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/38">{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#c9962a]/30 bg-[#080908]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_50%,rgba(227,173,49,.08),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-[1240px] lg:grid-cols-[.78fr_1.22fr]">
          <div className="relative min-h-[330px] overflow-hidden border-r border-white/8 lg:min-h-[360px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroBg})` }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,5,.08),rgba(5,6,5,.15)_55%,#080908_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          </div>

          <div className="grid gap-8 px-5 py-9 sm:px-8 lg:grid-cols-[1fr_190px] lg:py-10">
            <div className="self-center">
              <div className="text-[9px] font-black uppercase tracking-[0.24em] text-[#e3ad31]">
                {content.problem.eyebrow}
              </div>
              <h2
                className="mt-3 max-w-[520px] text-[34px] font-semibold leading-[1.02] sm:text-[42px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {content.problem.title}
              </h2>
              <p className="mt-4 max-w-[610px] text-[12px] leading-6 text-white/55">
                {content.problem.description}
              </p>
              <p className="mt-3 max-w-[610px] text-[12px] leading-6 text-white/48">
                Najpierw identyfikujemy przyczynę usterki i zakres możliwej naprawy. Następnie klient otrzymuje kosztorys do akceptacji. Dopiero po zatwierdzeniu rozpoczynamy płatne prace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {problemHighlights.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-center gap-3 border-l border-[#c9962a]/30 py-2 pl-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#c9962a]/50 text-[#e3ad31]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold leading-4 text-white/78">{title}</div>
                    <div className="text-[9px] leading-4 text-white/35">{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#c9962a]/30 bg-[#070807] py-8 sm:py-10">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h2
              className="text-[30px] font-semibold sm:text-[38px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Jak wygląda realizacja?
            </h2>
            <p className="text-[10px] text-white/42">Przejrzysty proces — pełna kontrola na każdym etapie</p>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-0">
            {processSteps.map((step, index) => (
              <article key={`${step.number}-${step.title}`} className="relative xl:pr-7">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#e3ad31] text-sm font-black text-black shadow-[0_0_22px_rgba(227,173,49,.2)]">
                    {index + 1}
                  </div>
                  {index === 0 && <ScanSearch className="h-5 w-5 text-[#e3ad31]" />}
                  {index === 1 && <FileText className="h-5 w-5 text-[#e3ad31]" />}
                  {index === 2 && <Settings2 className="h-5 w-5 text-[#e3ad31]" />}
                  {index === 3 && <Box className="h-5 w-5 text-[#e3ad31]" />}
                  {index < processSteps.length - 1 && (
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-[#e3ad31]/35 to-white/10 xl:block" />
                  )}
                </div>
                <h3 className="mt-4 text-[12px] font-bold text-white">{step.title}</h3>
                <p className="mt-2 max-w-[240px] text-[10px] leading-5 text-white/42">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#c9962a]/30 bg-[#080908] py-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_45%,rgba(227,173,49,.06),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-[320px_1fr_310px]">
          <PolandMap />

          <div>
            <SectionKicker>{content.shipping.eyebrow}</SectionKicker>
            <h2
              className="mt-3 text-[31px] font-semibold sm:text-[38px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {content.shipping.title}
            </h2>
            <p className="mt-3 max-w-[560px] text-[12px] leading-6 text-white/52">{content.shipping.description}</p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {content.shipping.points.slice(0, 4).map((point, index) => {
                const Icon = [Truck, PackageCheck, ShieldCheck, Phone][index] || PackageCheck;
                return (
                  <div key={point} className="flex items-center gap-2.5 border border-white/8 bg-black/25 px-3 py-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-[#e3ad31]" />
                    <span className="text-[10px] font-semibold text-white/58">{point}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[210px] overflow-hidden border border-[#c9962a]/35 bg-[#0b0c0b] p-5">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(227,173,49,.05))]" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex justify-end">
                <div className="rounded-[2px] border border-white/8 bg-white/5 px-3 py-2 text-right">
                  <div className="text-[10px] font-bold text-white">Paczkomat / Kurier</div>
                  <div className="text-[9px] text-white/35">wysyłka z całej Polski</div>
                </div>
              </div>
              <div className="mx-auto w-[86%] border border-[#c9962a]/45 bg-[#8a632b] p-4 text-black shadow-[0_18px_30px_rgba(0,0,0,.32)]">
                <div className="text-[9px] font-black uppercase tracking-[0.16em]">Auto Serwis</div>
                <div
                  className="mt-1 text-2xl font-black"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Gl@bcio
                </div>
                <div className="mt-2 h-px bg-black/35" />
                <div className="mt-2 text-[8px] font-semibold uppercase tracking-[0.14em]">ECU / TCU — bezpieczna przesyłka</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {realizations.length > 0 && (
        <section id="realizacje-ecu" className="border-b border-[#c9962a]/25 bg-[#050605] py-10">
          <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <SectionKicker>Realne naprawy</SectionKicker>
                <h2
                  className="mt-3 text-[31px] font-semibold sm:text-[38px]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Realizacje ECU / TCU
                </h2>
              </div>
              <a href="/realizacje" className="hidden text-[10px] font-bold uppercase tracking-[0.12em] text-[#e3ad31] sm:block">
                Wszystkie realizacje →
              </a>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-3">
              {realizations.map((item) => (
                <a
                  key={item.slug}
                  href={`/realizacje/${item.slug}`}
                  className="group overflow-hidden border border-white/10 bg-[#090a09] transition hover:border-[#e3ad31]/55"
                >
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="aspect-[16/8] w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                  ) : (
                    <div className="grid aspect-[16/8] place-items-center bg-black/30">
                      <Cpu className="h-9 w-9 text-[#e3ad31]/50" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-[8px] font-black uppercase tracking-[0.18em] text-[#e3ad31]">ECU / TCU</div>
                    <h3 className="mt-2 text-[15px] font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 line-clamp-2 text-[10px] leading-5 text-white/40">{item.excerpt}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-b border-[#c9962a]/28 bg-[#080908] py-8 sm:py-10">
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1.05fr_.8fr]">
          <div>
            <h2
              className="text-[26px] font-semibold"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Najczęściej zadawane pytania
            </h2>
            <div className="mt-5 border-t border-white/10">
              {content.faq.items.slice(0, 3).map((item, index) => (
                <div key={item.question} className="border-b border-white/10">
                  <button
                    className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="text-[10px] font-semibold leading-4 text-white/72">{item.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#e3ad31] transition ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === index && (
                    <p className="pb-4 text-[10px] leading-5 text-white/42">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-l border-white/8 lg:pl-8">
            <h2
              className="text-[26px] font-semibold"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {content.flex.title}
            </h2>
            <p className="mt-4 max-w-[500px] text-[11px] leading-5 text-white/44">{content.flex.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {content.flex.modes.map((mode, index) => {
                const Icon = [CarFront, Cpu, LockKeyhole][index] || Cpu;
                return (
                  <div key={mode.name} className="text-center">
                    <Icon className="mx-auto h-5 w-5 text-[#e3ad31]" />
                    <div className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-white">{mode.name}</div>
                    <div className="mt-1 text-[8px] leading-3 text-white/32">{mode.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border border-white/12 bg-[#0a0b0a] p-5">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="text-[28px] font-black italic tracking-[-.04em] text-white">FLEX</div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-white">Oryginalny sprzęt</div>
                <div className="text-[9px] text-[#e3ad31]">FLEX</div>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {["Legalny i profesjonalny sprzęt", "Aktualne protokoły", "Szeroka baza sterowników", "Stabilność procesu"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-[10px] text-white/58">
                  <Check className="h-4 w-4 shrink-0 text-[#e3ad31]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="kontakt" className="border-b border-white/8 bg-[#060706] py-8">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5">
            <img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto" />
            <div className="hidden border-l border-white/10 pl-5 sm:block">
              <div className="text-[12px] font-semibold text-white">Profesjonalna elektronika samochodowa</div>
              <div className="mt-1 text-[9px] text-white/35">Silniki. Skrzynie biegów. Diagnostyka. Rozwiązania.</div>
            </div>
          </div>

          <div className="grid gap-2 text-[10px] text-white/58">
            <a href="tel:+48530978968" className="flex items-center gap-2 hover:text-[#e3ad31]">
              <Phone className="h-4 w-4 text-[#e3ad31]" /> +48 530 978 968
            </a>
            <a href="mailto:glabcio@interia.pl" className="flex items-center gap-2 hover:text-[#e3ad31]">
              <Mail className="h-4 w-4 text-[#e3ad31]" /> glabcio@interia.pl
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#e3ad31]" /> Raszkowska 53, Ostrów Wielkopolski
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/68">
            <a href="#" aria-label="Facebook" className="transition hover:text-[#e3ad31]"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="transition hover:text-[#e3ad31]"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="YouTube" className="transition hover:text-[#e3ad31]"><Youtube className="h-5 w-5" /></a>
            <div className="ml-2 border-l border-white/10 pl-5 text-[8px] font-bold uppercase leading-4 tracking-[0.18em] text-white/35">
              Pasja<br />Wiedza<br />Realne rozwiązania
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#050605] py-5">
        <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-3 px-4 text-[9px] text-white/28 sm:px-6 md:flex-row">
          <span>© {new Date().getFullYear()} Auto Serwis Gl@bcio. Wszelkie prawa zastrzeżone.</span>
          <div className="flex gap-5">
            <a href="/polityka-prywatnosci" className="hover:text-white/60">Polityka prywatności</a>
            <a href="/regulamin" className="hover:text-white/60">Regulamin</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
