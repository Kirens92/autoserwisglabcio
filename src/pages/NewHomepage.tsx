import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  BatteryCharging,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cpu,
  ExternalLink,
  Gauge,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Star,
  ThermometerSnowflake,
  Truck,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/nowelogo.png";
import heroBg from "@/assets/hero-bg.png";
import aboutFallback from "@/assets/ecutcu.png";
import shippingFallback from "@/assets/Wysyłka w całej Polsce.png";
import { defaultSiteContent, normalizeSiteContent, type SiteContent } from "@/lib/siteContent";
import "./NewHomepage.css";

type Service = {
  icon: string;
  title: string;
  description: string;
  image?: string;
};

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  createdAt?: string;
  category?: string;
};

type Review = {
  id?: string;
  rating?: number;
  text?: string;
  relativeTime?: string;
  author?: { name?: string; photoUri?: string };
};

const iconMap: Record<string, LucideIcon> = {
  SearchCheck,
  Wrench,
  Gauge,
  Sparkles,
  ThermometerSnowflake,
  Zap,
  BatteryCharging,
  ShieldCheck,
  Cpu,
};

const trustIcons: LucideIcon[] = [Award, SearchCheck, ShieldCheck];
const processIcons: LucideIcon[] = [CalendarDays, SearchCheck, MessageCircle, Wrench];

function ensureMeta(name: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  return meta;
}

function telHref(value: string) {
  if (!value) return "";
  return `tel:${value}`;
}

function SectionKicker({ children }: { children: string }) {
  return <div className="home-kicker"><span />{children}</div>;
}

export default function NewHomepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [services, setServices] = useState<Service[]>([]);
  const [realizations, setRealizations] = useState<Realization[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewCount, setReviewCount] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState("");

  useEffect(() => {
    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setContent(normalizeSiteContent(data)))
      .catch(() => setContent(defaultSiteContent));

    fetch("/api/services", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => undefined);

    fetch("/api/realizations", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: Realization[]) => {
        if (!Array.isArray(data)) return;
        setRealizations([...data].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))).slice(0, 3));
      })
      .catch(() => undefined);

    fetch("/api/google-reviews", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (typeof data?.rating === "number") setRating(data.rating);
        if (typeof data?.reviewCount === "number") setReviewCount(data.reviewCount);
        if (Array.isArray(data?.reviews)) setReviews(data.reviews.slice(0, 3));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    document.title = content.seo.title;
    ensureMeta("description").content = content.seo.description;
    ensureMeta("robots").content = content.seo.robots;
  }, [content.seo]);

  const business = content.business;
  const primaryTel = telHref(business.phoneHref);
  const secondTel = business.phone2 && business.phoneHref2 ? telHref(business.phoneHref2) : "";
  const heroImage = content.hero.image || heroBg;
  const aboutImage = content.about.image || aboutFallback;
  const shippingImage = content.shipping.image || shippingFallback;

  const displayedServices = useMemo<Service[]>(() => {
    if (services.length) return services.slice(0, 6);
    return content.services.items.slice(0, 6).map((item) => ({ icon: item.icon, title: item.title, description: item.text }));
  }, [services, content.services.items]);

  const displayedReviews = useMemo(() => {
    if (reviews.length) return reviews;
    return content.reviews.items.slice(0, 3).map((item, index) => ({ id: `fallback-${index}`, rating: 5, text: item.text, author: { name: item.name } }));
  }, [reviews, content.reviews.items]);

  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "AutoRepair",
      name: "Auto Serwis Gl@bcio",
      url: "https://autoserwisglabcio.pl/",
      telephone: business.phone,
      email: business.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.street,
        postalCode: business.postalCode,
        addressLocality: business.city,
        addressCountry: "PL",
      },
      areaServed: business.city,
      knowsAbout: ["Peugeot", "Citroën", "PSA", "Stellantis", "ECU", "TCU", "diagnostyka samochodowa", "mechanika samochodowa"],
    }),
    [business],
  );

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const car = String(data.get("car") || "");
    const message = String(data.get("message") || "");
    const subject = encodeURIComponent(`Zapytanie ze strony — ${car || "Auto Serwis Gl@bcio"}`);
    const body = encodeURIComponent(`Imię: ${name}\nTelefon: ${phone}\nSamochód: ${car}\n\n${message}`);
    window.location.href = `mailto:${business.email}?subject=${subject}&body=${body}`;
    setFormStatus("Otwieram program pocztowy z przygotowaną wiadomością.");
  };

  return (
    <main className="home-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="home-topbar">
        <div className="home-shell home-topbar__inner">
          <div className="home-topbar__hours">
            <Clock3 />
            <span>Pon–Pt: <strong>{business.hoursWeekdays}</strong></span>
            <span>Sob: <strong>{business.hoursSaturday}</strong></span>
          </div>
          <div className="home-topbar__phones">
            <a href={primaryTel}><Phone /> {business.phone}</a>
            {secondTel && <a href={secondTel}><Phone /> {business.phone2}</a>}
          </div>
        </div>
      </div>

      <header className="home-header">
        <div className="home-shell home-header__inner">
          <a href="/nowa-strona" className="home-logo" aria-label="Auto Serwis Gl@bcio — strona główna">
            <img src={logo} alt="Auto Serwis Gl@bcio" />
          </a>

          <nav className="home-nav" aria-label="Główna nawigacja">
            {content.navigation.map((item) => (
              <a key={`${item.href}-${item.label}`} href={item.href}>{item.label}</a>
            ))}
          </nav>

          <a href="#kontakt" className="home-btn home-btn--gold home-header__cta">{content.hero.primaryCta}<ArrowRight /></a>

          <button className="home-menu-btn" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div className={`home-mobile-nav ${menuOpen ? "is-open" : ""}`}>
          <div className="home-shell">
            {content.navigation.map((item) => <a key={`${item.href}-${item.label}`} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
            <a href="#kontakt" className="home-btn home-btn--gold" onClick={() => setMenuOpen(false)}>{content.hero.primaryCta}</a>
          </div>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-shell home-hero__grid">
          <div className="home-hero__copy">
            <SectionKicker>{content.hero.eyebrow}</SectionKicker>
            <h1>{content.hero.titleLine1}<span>{content.hero.titleLine2}</span></h1>
            <p className="home-hero__lead">{content.hero.description}</p>
            <div className="home-hero__actions">
              <a href="#kontakt" className="home-btn home-btn--gold"><CalendarDays />{content.hero.primaryCta}<ArrowRight /></a>
              <a href="/uslugi" className="home-btn home-btn--outline">{content.hero.secondaryCta}<ChevronRight /></a>
            </div>
            <div className="home-trust-grid">
              {content.hero.trustPoints.slice(0, 3).map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return <div key={`${item.title}-${index}`} className="home-trust"><Icon /><div><strong>{item.title}</strong><span>{item.text}</span></div></div>;
              })}
            </div>
          </div>

          <div className="home-hero__media">
            <img src={heroImage} alt={content.hero.imageAlt} />
            <div className="home-hero-card">
              <span>{content.hero.overlayEyebrow}</span>
              <strong>{content.hero.overlayTitle}</strong>
              <p>{content.hero.overlayText}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="specjalizacja" className="home-section home-specialization">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center">
            <SectionKicker>{content.specialization.eyebrow}</SectionKicker>
            <h2>{content.specialization.title}</h2>
            <p>{content.specialization.description}</p>
          </div>
          <div className="home-brand-grid">
            {content.specialization.brands.slice(0, 2).map((brand, index) => {
              const image = brand.image || heroBg;
              return (
                <article key={`${brand.name}-${index}`} className="home-brand-card">
                  <img src={image} alt={brand.imageAlt || brand.name} />
                  <div className="home-brand-card__overlay" />
                  <div className="home-brand-card__content">
                    <span>Specjalizacja {String(index + 1).padStart(2, "0")}</span>
                    <h3>{brand.name}</h3>
                    <p>{brand.description}</p>
                    <div className="home-tags">{brand.tags.map((tag) => <em key={tag}>{tag}</em>)}</div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="uslugi" className="home-section home-services">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center">
            <SectionKicker>{content.services.eyebrow}</SectionKicker>
            <h2>{content.services.title}</h2>
            <p>{content.services.description}</p>
          </div>
          <div className="home-service-grid">
            {displayedServices.map((service, index) => {
              const Icon = iconMap[service.icon] || Wrench;
              const serviceFallbacks = [heroBg, aboutFallback, heroBg, aboutFallback, heroBg, aboutFallback];
              return (
                <article key={`${service.title}-${index}`} className="home-service-card">
                  <div className="home-service-card__image"><img src={service.image || serviceFallbacks[index % serviceFallbacks.length]} alt={service.title} /></div>
                  <div className="home-service-card__body">
                    <div className="home-service-card__icon"><Icon /></div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <a href="/uslugi">Dowiedz się więcej <ArrowRight /></a>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="home-section-action"><a href="/uslugi" className="home-btn home-btn--gold">{content.services.buttonLabel}<ArrowRight /></a></div>
        </div>
      </section>

      <section id="realizacje" className="home-section home-realizations">
        <div className="home-shell">
          <div className="home-section-head home-section-head--split">
            <div><SectionKicker>{content.realizations.eyebrow}</SectionKicker><h2>{content.realizations.title}</h2></div>
            <p>{content.realizations.description}</p>
          </div>
          {realizations.length > 0 ? (
            <div className="home-realization-grid">
              {realizations.map((item) => (
                <a key={item.slug} href={`/realizacje/${item.slug}`} className="home-realization-card">
                  <div className="home-realization-card__image">{item.image ? <img src={item.image} alt={item.title} /> : <div className="home-realization-placeholder"><Wrench /></div>}</div>
                  <div className="home-realization-card__body"><span>{item.category === "ecu-tcu" ? "ECU / TCU" : "Realizacja"}</span><h3>{item.title}</h3><p>{item.excerpt}</p><b>Zobacz szczegóły <ExternalLink /></b></div>
                </a>
              ))}
            </div>
          ) : (
            <div className="home-empty">Pierwsze realizacje pojawią się tutaj po dodaniu ich w panelu administratora.</div>
          )}
          <div className="home-section-action"><a href="/realizacje" className="home-btn home-btn--outline">{content.realizations.buttonLabel}<ArrowRight /></a></div>
        </div>
      </section>

      <section id="o-nas" className="home-section home-about">
        <div className="home-shell home-about__grid">
          <div className="home-about__image"><img src={aboutImage} alt={content.about.imageAlt} /><div className="home-about__badge"><Award /><strong>{content.about.stats[0]?.value || "10+"}</strong><span>{content.about.stats[0]?.label || "lat doświadczenia"}</span></div></div>
          <div className="home-about__copy">
            <SectionKicker>{content.about.eyebrow}</SectionKicker>
            <h2>{content.about.title}</h2>
            <p>{content.about.description}</p>
            <div className="home-check-list">{content.about.bullets.map((item) => <div key={item}><CheckCircle2 /><span>{item}</span></div>)}</div>
            <div className="home-stats">{content.about.stats.slice(1).map((item, index) => <div key={`${item.label}-${index}`}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
            <a href="#kontakt" className="home-text-link">Poznaj nas bliżej <ArrowRight /></a>
          </div>
        </div>
      </section>

      <section className="home-section home-process">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center">
            <SectionKicker>{content.process.eyebrow}</SectionKicker>
            <h2>{content.process.title}</h2>
            <p>{content.process.description}</p>
          </div>
          <div className="home-process-grid">
            {content.process.steps.slice(0, 4).map((step, index) => {
              const Icon = processIcons[index % processIcons.length];
              return <article key={`${step.number}-${index}`}><div className="home-process-icon"><Icon /></div><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p>{index < 3 && <div className="home-process-arrow"><ChevronRight /></div>}</article>;
            })}
          </div>
        </div>
      </section>

      <section id="opinie" className="home-section home-reviews">
        <div className="home-shell">
          <div className="home-section-head home-section-head--center">
            <SectionKicker>{content.reviews.eyebrow}</SectionKicker>
            <h2>{content.reviews.title}</h2>
            <div className="home-rating"><strong>{rating ? rating.toFixed(1).replace(".", ",") : "4,8"}</strong><div>{Array.from({ length: 5 }).map((_, index) => <Star key={index} />)}</div><span>{reviewCount ? `${reviewCount} opinii` : content.reviews.ratingLabel}</span></div>
          </div>
          <div className="home-review-grid">
            {displayedReviews.map((review, index) => (
              <article key={review.id || index} className="home-review-card">
                <div className="home-review-stars">{Array.from({ length: 5 }).map((_, starIndex) => <Star key={starIndex} />)}</div>
                <p>“{review.text || "Profesjonalna obsługa i bardzo dobry kontakt."}”</p>
                <div className="home-review-author"><div>{review.author?.photoUri ? <img src={review.author.photoUri} alt="" /> : <span>{(review.author?.name || "K").slice(0, 1)}</span>}</div><strong>{review.author?.name || "Klient Google"}</strong></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-shipping">
        <div className="home-shell">
          <div className="home-shipping__frame"><img src={shippingImage} alt={content.shipping.imageAlt} /></div>
          <div className="home-shipping__caption"><div><SectionKicker>{content.shipping.eyebrow}</SectionKicker><h2>{content.shipping.title}</h2><p>{content.shipping.description}</p></div><a href="/ecu-tcu" className="home-btn home-btn--gold">{content.shipping.buttonLabel}<ArrowRight /></a></div>
        </div>
      </section>

      <section id="kontakt" className="home-section home-contact">
        <div className="home-shell home-contact__grid">
          <div className="home-contact__copy">
            <SectionKicker>{content.contact.eyebrow}</SectionKicker>
            <h2>{content.contact.title}</h2>
            <p>{content.contact.description}</p>

            <div className="home-contact-phonebox">
              <span>{content.contact.phoneTitle}</span>
              <a href={primaryTel}><Phone />{business.phone}</a>
              {secondTel && <a href={secondTel}><Phone />{business.phone2}</a>}
            </div>

            <div className="home-contact-meta">
              <div><MapPin /><span><strong>{business.street}</strong>{business.postalCode} {business.city}</span></div>
              <div><Clock3 /><span><strong>Pon–Pt {business.hoursWeekdays}</strong>Sobota {business.hoursSaturday}</span></div>
              <div><Mail /><span><strong>{business.email}</strong>Napisz do nas w każdej chwili</span></div>
            </div>
          </div>

          <form className="home-contact-form" onSubmit={submitContact}>
            <h3>{content.contact.formTitle}</h3>
            <p>{content.contact.formDescription}</p>
            <div className="home-form-grid"><label>Imię<input name="name" required placeholder="Twoje imię" /></label><label>Telefon<input name="phone" required placeholder="+48 ..." /></label></div>
            <label>Samochód<input name="car" placeholder="Marka, model, rocznik" /></label>
            <label>Wiadomość<textarea name="message" required placeholder="Opisz krótko problem lub usługę, której potrzebujesz" /></label>
            <button className="home-btn home-btn--gold" type="submit">{content.contact.submitLabel}<ArrowRight /></button>
            {formStatus && <small>{formStatus}</small>}
          </form>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-shell home-footer__grid">
          <div className="home-footer__brand"><img src={logo} alt="Auto Serwis Gl@bcio" /><p>{content.footer.description}</p><div className="home-footer__icons"><span>f</span><span>◎</span><span>▶</span></div></div>
          <div><h3>Szybkie linki</h3>{content.footer.quickLinks.map((item) => <a key={`${item.href}-${item.label}`} href={item.href}>{item.label}</a>)}</div>
          <div><h3>Kontakt</h3><a href={primaryTel}>{business.phone}</a>{secondTel && <a href={secondTel}>{business.phone2}</a>}<a href={`mailto:${business.email}`}>{business.email}</a><span>{business.street}<br />{business.postalCode} {business.city}</span></div>
          <div><h3>Godziny otwarcia</h3><span>Pon–Pt <strong>{business.hoursWeekdays}</strong></span><span>Sobota <strong>{business.hoursSaturday}</strong></span><span>Niedziela <strong>{business.hoursSunday}</strong></span></div>
        </div>
        <div className="home-footer__bottom"><div className="home-shell"><span>© {new Date().getFullYear()} {content.footer.bottomText}</span><span>Polityka prywatności · Regulamin</span></div></div>
      </footer>
    </main>
  );
}
