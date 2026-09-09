import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Battery,
  CalendarDays,
  Check,
  ChevronDown,
  Cog,
  Cpu,
  Fuel,
  Gauge,
  Monitor,
  Phone,
  ShieldCheck,
  Snowflake,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import CallButton from "@/components/CallButton";
import heroFallback from "@/assets/hero-bg.png";
import "./ServicesPage.css";

type Service = {
  icon: string;
  title: string;
  description: string;
  image?: string;
  fullDescription?: string;
  faq?: string;
  items?: string[];
};

type FaqRow = { question: string; answer: string };

const icons: Record<string, LucideIcon> = {
  Cpu,
  Fuel,
  Monitor,
  Wrench,
  Zap,
  Cog,
  Gauge,
  Battery,
  Snowflake,
  ShieldCheck,
};

const fallback: Service[] = [
  {
    icon: "Wrench",
    title: "Mechanika samochodowa",
    description: "Kompleksowe naprawy mechaniczne, diagnostyka usterek i obsługa eksploatacyjna pojazdu.",
    items: ["Diagnostyka usterki", "Naprawy mechaniczne", "Obsługa eksploatacyjna"],
  },
  {
    icon: "Zap",
    title: "Elektryka samochodowa",
    description: "Diagnostyka instalacji, modułów, czujników i układów elektrycznych pojazdu.",
    items: ["Diagnostyka instalacji", "Naprawa usterek elektrycznych", "Kontrola modułów"],
  },
];

function parseFaq(text?: string): FaqRow[] {
  if (!text?.trim()) return [];
  return text
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [question, ...answer] = row.split("|");
      return { question: question.trim(), answer: answer.join("|").trim() };
    })
    .filter((row) => row.question && row.answer);
}

function BookingButton({ className, label = "Umów wizytę online" }: { className: string; label?: string }) {
  return (
    <button type="button" className={className} data-motowarsztat-booking-trigger="true">
      <CalendarDays /> {label}
    </button>
  );
}

function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const Icon = icons[service.icon] || Wrench;
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const faq = useMemo(() => parseFaq(service.faq), [service.faq]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div className="services-modal" role="dialog" aria-modal="true" aria-label={`Szczegóły usługi: ${service.title}`} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="services-modal__dialog">
        <button type="button" className="services-modal__close" onClick={onClose} aria-label="Zamknij szczegóły usługi"><X /></button>

        <div className="services-modal__hero">
          <img src={service.image || heroFallback} alt={service.title} />
          <div className="services-modal__shade" />
          <div className="services-modal__hero-copy">
            <div className="services-modal__icon"><Icon /></div>
            <span>Auto Serwis Gl@bcio</span>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </div>
        </div>

        <div className="services-modal__content">
          <div className="services-modal__main">
            <section>
              <div className="services-modal__eyebrow">Pełne informacje</div>
              <p className="services-modal__description">
                {service.fullDescription?.trim() || service.description}
              </p>
            </section>

            {service.items && service.items.length > 0 && (
              <section className="services-modal__scope">
                <h3>Zakres usługi</h3>
                <div className="services-modal__scope-grid">
                  {service.items.map((item) => <div key={item}><Check /><span>{item}</span></div>)}
                </div>
              </section>
            )}

            {faq.length > 0 && (
              <section className="services-modal__faq">
                <h3>Najczęstsze pytania</h3>
                {faq.map((row, index) => (
                  <div className="services-modal__faq-row" key={`${row.question}-${index}`}>
                    <button type="button" onClick={() => setFaqOpen(faqOpen === index ? null : index)} aria-expanded={faqOpen === index}>
                      <span>{row.question}</span><ChevronDown className={faqOpen === index ? "is-open" : ""} />
                    </button>
                    {faqOpen === index && <p>{row.answer}</p>}
                  </div>
                ))}
              </section>
            )}
          </div>

          <aside className="services-modal__aside">
            <div className="services-modal__aside-card">
              <span>Potrzebujesz tej usługi?</span>
              <strong>Umów dogodny termin</strong>
              <p>Zadzwoń do warsztatu albo wybierz termin online przez system MotoWarsztat.</p>
              <div className="services-modal__actions">
                <CallButton className="services-modal__call"><Phone /> Zadzwoń teraz</CallButton>
                <BookingButton className="services-modal__booking" />
              </div>
            </div>
            <div className="services-modal__note"><ShieldCheck /><span>Przed rozpoczęciem dodatkowych prac kontaktujemy się z klientem i ustalamy zakres usługi.</span></div>
          </aside>
        </div>
      </article>
    </div>
  );
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(fallback);
  const [activeService, setActiveService] = useState<Service | null>(null);

  useEffect(() => {
    fetch("/api/services", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => Array.isArray(data) && data.length && setServices(data))
      .catch(() => undefined);
  }, []);

  return (
    <>
      <Navbar />
      <main className="services-page">
        <section className="services-hero">
          <div className="services-shell">
            <div className="services-kicker">Profesjonalny serwis samochodowy</div>
            <h1>Kompleksowy zakres <span>usług</span></h1>
            <p>Wybierz interesującą Cię usługę i zobacz pełny zakres prac, dodatkowe informacje oraz odpowiedzi na najczęstsze pytania.</p>
          </div>
        </section>

        <section className="services-list-section">
          <div className="services-shell">
            <div className="services-grid">
              {services.map((service, index) => {
                const Icon = icons[service.icon] || Wrench;
                return (
                  <article className="services-card" key={`${service.title}-${index}`}>
                    <div className="services-card__media">
                      <img src={service.image || heroFallback} alt={service.title} loading="lazy" />
                      <div className="services-card__number">{String(index + 1).padStart(2, "0")}</div>
                    </div>
                    <div className="services-card__body">
                      <div className="services-card__icon"><Icon /></div>
                      <h2>{service.title}</h2>
                      <p>{service.description}</p>
                      {service.items && service.items.length > 0 && (
                        <div className="services-card__chips">{service.items.slice(0, 3).map((item) => <span key={item}>{item}</span>)}</div>
                      )}
                      <button type="button" className="services-card__more" onClick={() => setActiveService(service)}>
                        Dowiedz się więcej <ArrowRight />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="services-bottom-cta">
              <div><span>Nie wiesz, którą usługę wybrać?</span><h2>Opisz problem telefonicznie — pomożemy dobrać właściwe rozwiązanie.</h2></div>
              <div className="services-bottom-cta__actions">
                <CallButton className="services-bottom-cta__button"><Phone /> Zadzwoń do nas</CallButton>
                <BookingButton className="services-bottom-cta__booking" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {activeService && <ServiceModal service={activeService} onClose={() => setActiveService(null)} />}
    </>
  );
}
