import { useEffect, useMemo, useState, type CSSProperties } from "react";
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
import "./EcuTcuPage.css";

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

const serviceIcons: Record<string, LucideIcon> = {
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

const trustIcons = [Cpu, CarFront, Truck];
const processIcons = [ScanSearch, FileText, Settings2, Box];
const shippingIcons = [Truck, PackageCheck, ShieldCheck, Phone];
const problemIcons = [FileCheck2, Clock3, CarFront, ShieldCheck];
const modeIcons = [CarFront, Cpu, LockKeyhole];

function setMeta(name: string, content: string) {
  let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function hydrateContent(input: Partial<ExtendedContent> | null | undefined): ExtendedContent {
  if (!input) return defaultEcuTcuContent;

  return {
    ...defaultEcuTcuContent,
    ...input,
    seo: { ...defaultEcuTcuContent.seo, ...(input.seo || {}) },
    hero: {
      ...defaultEcuTcuContent.hero,
      ...(input.hero || {}),
      trust: Array.isArray(input.hero?.trust) && input.hero.trust.length
        ? input.hero.trust
        : defaultEcuTcuContent.hero.trust,
    },
    benefits: Array.isArray(input.benefits) && input.benefits.length
      ? input.benefits
      : defaultEcuTcuContent.benefits,
    services: {
      ...defaultEcuTcuContent.services,
      ...(input.services || {}),
      items: Array.isArray(input.services?.items) && input.services.items.length
        ? input.services.items
        : defaultEcuTcuContent.services.items,
    },
    problem: {
      ...defaultEcuTcuContent.problem,
      ...(input.problem || {}),
      bullets: Array.isArray(input.problem?.bullets) && input.problem.bullets.length
        ? input.problem.bullets
        : defaultEcuTcuContent.problem.bullets,
    },
    flex: {
      ...defaultEcuTcuContent.flex,
      ...(input.flex || {}),
      modes: Array.isArray(input.flex?.modes) && input.flex.modes.length
        ? input.flex.modes
        : defaultEcuTcuContent.flex.modes,
    },
    process: {
      ...defaultEcuTcuContent.process,
      ...(input.process || {}),
      steps: Array.isArray(input.process?.steps) && input.process.steps.length
        ? input.process.steps
        : defaultEcuTcuContent.process.steps,
    },
    shipping: {
      ...defaultEcuTcuContent.shipping,
      ...(input.shipping || {}),
      points: Array.isArray(input.shipping?.points) && input.shipping.points.length
        ? input.shipping.points
        : defaultEcuTcuContent.shipping.points,
    },
    faq: {
      ...defaultEcuTcuContent.faq,
      ...(input.faq || {}),
      items: Array.isArray(input.faq?.items) && input.faq.items.length
        ? input.faq.items
        : defaultEcuTcuContent.faq.items,
    },
    cta: { ...defaultEcuTcuContent.cta, ...(input.cta || {}) },
    media: { ...(input.media || {}) },
  };
}

function Kicker({ children }: { children: string }) {
  return <div className="ecu-kicker">{children}</div>;
}

function PolandMap() {
  const points = [
    [86, 49],
    [138, 58],
    [188, 74],
    [216, 110],
    [187, 145],
    [133, 153],
    [84, 136],
    [56, 103],
  ];

  return (
    <div className="ecu-map" aria-hidden="true">
      <svg viewBox="0 0 280 210">
        <defs>
          <filter id="ecu-map-glow">
            <feGaussianBlur stdDeviation="3.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M54 46 84 28l30 4 20-12 34 10 21 18 31 4 13 25 21 16-8 27 9 27-25 11-13 26-31 2-22 16-33-8-29 8-22-17-27 1-10-28-19-15 7-30-12-25 22-18 13-26Z"
          fill="rgba(229,173,49,.035)"
          stroke="rgba(229,173,49,.94)"
          strokeWidth="2"
          filter="url(#ecu-map-glow)"
        />
        {points.map(([x, y], index) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="10" fill="rgba(229,173,49,.07)" />
            <circle cx={x} cy={y} r="3.7" fill="#e5ad31" filter="url(#ecu-map-glow)" />
            {index < points.length - 1 && (
              <line
                x1={x}
                y1={y}
                x2={points[index + 1][0]}
                y2={points[index + 1][1]}
                stroke="rgba(229,173,49,.24)"
                strokeWidth="1"
              />
            )}
          </g>
        ))}
      </svg>
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
        if (data?.hero?.titleLine1) setContent(hydrateContent(data));
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

  const nav = useMemo(
    () => [
      ["Strona główna", "/"],
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
        number: "03",
        title: steps[2]?.title || "Programowanie / naprawa",
        text: `${steps[2]?.text || ""} ${steps[3]?.text || ""}`.trim(),
      },
      {
        number: "04",
        title: steps[4]?.title || "Odbiór lub wysyłka",
        text: steps[4]?.text || "Odbiór osobisty lub bezpieczna wysyłka zwrotna.",
      },
    ];
  }, [content.process.steps]);

  const heroImage = content.media?.heroImage || heroBg;
  const heroStyle = { "--ecu-hero-bg": `url(${heroBg})` } as CSSProperties;
  const problemStyle = { "--ecu-problem-bg": `url(${heroBg})` } as CSSProperties;

  return (
    <main className="ecu-page">
      <header className="ecu-header">
        <div className="ecu-shell ecu-header__inner">
          <a href="/" className="ecu-logo" aria-label="Auto Serwis Gl@bcio — strona główna">
            <img src={logo} alt="Auto Serwis Gl@bcio" />
          </a>

          <nav className="ecu-nav" aria-label="Główna nawigacja">
            {nav.map(([label, href]) => (
              <a key={label} href={href} className={label === "ECU | TCU" ? "is-active" : ""}>
                {label}
              </a>
            ))}
          </nav>

          <div className="ecu-header__right">
            <div className="ecu-contact-mini">
              <a className="ecu-contact-mini__row" href="tel:+48530978968">
                <Phone /> +48 530 978 968
              </a>
              <span className="ecu-contact-mini__row">
                <MapPin /> Raszkowska 53 · Ostrów Wlkp.
              </span>
            </div>
            <a className="ecu-btn ecu-btn--gold" href="tel:+48530978968">
              {content.hero.primaryCta} <ArrowRight />
            </a>
          </div>

          <button
            type="button"
            className="ecu-mobile-toggle"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div className={`ecu-mobile-menu ${menuOpen ? "is-open" : ""}`}>
          <div className="ecu-shell">
            {nav.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className={label === "ECU | TCU" ? "is-active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="ecu-hero" style={heroStyle}>
        <div className="ecu-hero__orange-light" />
        <div className="ecu-shell ecu-hero__inner">
          <div className="ecu-hero__copy">
            <Kicker>{content.hero.eyebrow}</Kicker>
            <h1>
              {content.hero.titleLine1}
              <span>{content.hero.titleLine2}</span>
            </h1>
            <p className="ecu-hero__lead">{content.hero.description}</p>

            <div className="ecu-trust-grid">
              {content.hero.trust.slice(0, 3).map((item, index) => {
                const Icon = trustIcons[index] || Cpu;
                return (
                  <div className="ecu-trust" key={item.title}>
                    <Icon />
                    <div>
                      <strong>{item.title}</strong>
                      <small>{item.text}</small>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ecu-hero__actions">
              <a className="ecu-btn ecu-btn--gold" href="tel:+48530978968">
                {content.hero.primaryCta} <ArrowRight />
              </a>
              <a className="ecu-btn ecu-btn--outline" href="mailto:glabcio@interia.pl?subject=ECU%20TCU%20-%20wycena">
                <FileText /> Szybka wycena
              </a>
              <div className="ecu-hero__microcopy">
                <strong>Szybka wycena</strong>
                <span>i profesjonalne doradztwo</span>
              </div>
            </div>
          </div>

          <div className="ecu-media">
            <div className="ecu-media__frame">
              <img src={heroImage} alt="Stanowisko do diagnostyki i programowania sterowników ECU i TCU" />
              <div className="ecu-media__label">
                <strong>{content.hero.mediaTitle}</strong>
                <span>{content.hero.mediaText}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ecu-benefits">
        <div className="ecu-shell ecu-benefits__grid">
          {content.benefits.slice(0, 3).map((item) => {
            const Icon = serviceIcons[item.icon] || ShieldCheck;
            return (
              <article className="ecu-benefit" key={item.title}>
                <Icon />
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="uslugi-ecu" className="ecu-services">
        <div className="ecu-shell">
          <div className="ecu-section-head">
            <div>
              <Kicker>{content.services.eyebrow}</Kicker>
              <h2 className="ecu-section-title" style={{ marginTop: 8 }}>{content.services.title}</h2>
            </div>
            <p className="ecu-section-copy">{content.services.description}</p>
          </div>

          <div className="ecu-services__grid">
            {content.services.items.slice(0, 8).map((item) => {
              const Icon = serviceIcons[item.icon] || Cpu;
              return (
                <article className="ecu-service-card" key={item.title}>
                  <div className="ecu-service-card__icon"><Icon /></div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ecu-problem">
        <div className="ecu-shell ecu-problem__grid">
          <div className="ecu-problem__visual" style={problemStyle} aria-hidden="true" />

          <div className="ecu-problem__copy">
            <Kicker>{content.problem.eyebrow}</Kicker>
            <h2>{content.problem.title}</h2>
            <p>{content.problem.description}</p>
            <p>
              Dzięki doświadczeniu, specjalistycznemu sprzętowi FLEX i dostępowi do właściwych procedur
              przywracamy funkcjonalność sterowników szybko, bezpiecznie i z jasnym zakresem prac.
            </p>
          </div>

          <div className="ecu-problem__points">
            {content.problem.bullets.slice(0, 4).map((point, index) => {
              const Icon = problemIcons[index] || ShieldCheck;
              return (
                <div className="ecu-problem-point" key={point}>
                  <div className="ecu-problem-point__icon"><Icon /></div>
                  <span>{point}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ecu-process">
        <div className="ecu-shell">
          <div className="ecu-process__header">
            <div>
              <Kicker>{content.process.eyebrow}</Kicker>
              <h2 className="ecu-section-title" style={{ marginTop: 8 }}>Jak wygląda realizacja?</h2>
            </div>
            <p>Przejrzysty proces — pełna kontrola na każdym etapie</p>
          </div>

          <div className="ecu-process__grid">
            {processSteps.slice(0, 4).map((step, index) => {
              const Icon = processIcons[index] || Settings2;
              return (
                <article className="ecu-step" key={`${step.number}-${step.title}`}>
                  <div className="ecu-step__top">
                    <div className="ecu-step__number">{index + 1}</div>
                    <Icon />
                    {index < 3 ? <div className="ecu-step__line" /> : <div />}
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ecu-shipping">
        <div className="ecu-shell ecu-shipping__grid">
          <PolandMap />

          <div className="ecu-shipping__copy">
            <Kicker>{content.shipping.eyebrow}</Kicker>
            <h2>{content.shipping.title}</h2>
            <p>{content.shipping.description}</p>
            <div className="ecu-shipping__features">
              {content.shipping.points.slice(0, 4).map((point, index) => {
                const Icon = shippingIcons[index] || PackageCheck;
                return (
                  <div className="ecu-shipping__feature" key={point}>
                    <Icon /> <span>{point}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ecu-parcel-scene" aria-label="Obsługa wysyłkowa sterowników">
            <div className="ecu-parcel-badge">
              Paczkomat<br />lub kurier
              <span>cała Polska</span>
            </div>
            <div className="ecu-parcel">
              <div className="ecu-parcel__brand">
                Auto Serwis Gl@bcio
                <small>ECU / TCU</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {realizations.length > 0 && (
        <section id="realizacje-ecu" className="ecu-realizations">
          <div className="ecu-shell">
            <div className="ecu-section-head">
              <div>
                <Kicker>Realne naprawy</Kicker>
                <h2 className="ecu-section-title" style={{ marginTop: 8 }}>Realizacje ECU / TCU</h2>
              </div>
              <p className="ecu-section-copy">
                Przykłady wykonanych diagnostyk, napraw i operacji programowania sterowników.
              </p>
            </div>

            <div className="ecu-realizations__grid">
              {realizations.map((item) => (
                <a className="ecu-realization-card" href={`/realizacje/${item.slug}`} key={item.slug}>
                  <div className="ecu-realization-card__image">
                    {item.image ? (
                      <img src={item.image} alt={item.title} />
                    ) : (
                      <div className="ecu-realization-card__empty"><Cpu /></div>
                    )}
                  </div>
                  <div className="ecu-realization-card__body">
                    <small>ECU / TCU</small>
                    <h3>{item.title}</h3>
                    <p>{item.excerpt}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="ecu-technical">
        <div className="ecu-shell ecu-technical__grid">
          <div className="ecu-tech-block">
            <h2>{content.faq.title}</h2>
            <div className="ecu-faq">
              {content.faq.items.slice(0, 3).map((item, index) => (
                <div className="ecu-faq__item" key={item.question}>
                  <button
                    type="button"
                    className={`ecu-faq__question ${openFaq === index ? "is-open" : ""}`}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                  >
                    <span>{item.question}</span>
                    <ChevronDown />
                  </button>
                  {openFaq === index && <p className="ecu-faq__answer">{item.answer}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="ecu-tech-block">
            <h2>{content.flex.title}</h2>
            <p>{content.flex.description}</p>
            <div className="ecu-modes">
              {content.flex.modes.slice(0, 3).map((mode, index) => {
                const Icon = modeIcons[index] || Cpu;
                return (
                  <div className="ecu-mode" key={mode.name}>
                    <Icon />
                    <strong>{mode.name}</strong>
                    <span>{mode.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="ecu-flex-card">
            <div className="ecu-flex-card__head">
              <div className="ecu-flex-wordmark">FLEX</div>
              <div>
                <strong>Oryginalny sprzęt</strong>
                <span>FLEX</span>
              </div>
            </div>
            <div className="ecu-flex-list">
              {[
                "Legalne, profesjonalne rozwiązania",
                "Regularne aktualizacje i protokoły",
                "Szeroka baza obsługiwanych sterowników",
                "Stabilność i kontrola procesu",
              ].map((item) => (
                <div key={item}><Check /> {item}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ecu-cta">
        <div className="ecu-shell ecu-cta__inner">
          <div>
            <Kicker>{content.cta.eyebrow}</Kicker>
            <h2>{content.cta.title}</h2>
            <p>{content.cta.description}</p>
          </div>
          <div className="ecu-cta__buttons">
            <a className="ecu-btn ecu-btn--gold" href="tel:+48530978968">
              <Phone /> {content.cta.primaryLabel}
            </a>
            <a className="ecu-btn ecu-btn--outline" href="mailto:glabcio@interia.pl?subject=ECU%20TCU%20-%20wycena">
              <Mail /> {content.cta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

      <section id="kontakt" className="ecu-contact-footer">
        <div className="ecu-shell ecu-contact-footer__grid">
          <div className="ecu-footer-brand">
            <img src={logo} alt="Auto Serwis Gl@bcio" />
            <div className="ecu-footer-brand__copy">
              <strong>Profesjonalna elektronika samochodowa</strong>
              <span>Silniki. Skrzynie biegów. Diagnostyka. Realne rozwiązania.</span>
            </div>
          </div>

          <div className="ecu-footer-contact">
            <a href="tel:+48530978968"><Phone /> +48 530 978 968</a>
            <a href="mailto:glabcio@interia.pl"><Mail /> glabcio@interia.pl</a>
            <span><MapPin /> Raszkowska 53, 63-400 Ostrów Wielkopolski</span>
          </div>

          <div className="ecu-footer-social">
            <a href="#" aria-label="Facebook"><Facebook /></a>
            <a href="#" aria-label="Instagram"><Instagram /></a>
            <a href="#" aria-label="YouTube"><Youtube /></a>
            <div className="ecu-footer-slogan">Pasja<br />Wiedza<br />Realne rozwiązania</div>
          </div>
        </div>
      </section>

      <footer className="ecu-footer-bottom">
        <div className="ecu-shell ecu-footer-bottom__inner">
          <span>© {new Date().getFullYear()} Auto Serwis Gl@bcio. Wszelkie prawa zastrzeżone.</span>
          <div className="ecu-footer-bottom__links">
            <a href="/polityka-prywatnosci">Polityka prywatności</a>
            <a href="/regulamin">Regulamin</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
