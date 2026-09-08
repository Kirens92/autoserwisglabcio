import { useEffect, useMemo, useState } from "react";
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
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/nowelogobg.png";
import { defaultSiteContent, type SiteContent } from "@/lib/siteContent";

const iconMap: Record<string, LucideIcon> = {
  SearchCheck,
  Wrench,
  Gauge,
  Sparkles,
  ThermometerSnowflake,
  Zap,
  BatteryCharging,
  ShieldCheck,
};

const trustIcons: LucideIcon[] = [Award, SearchCheck, ShieldCheck];

function ensureMeta(name: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  return meta;
}

export default function NewHomepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (data?.hero?.titleLine1) setContent(data);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    document.title = content.seo.title;
    ensureMeta("description").content = content.seo.description;
    ensureMeta("robots").content = content.seo.robots;
  }, [content.seo]);

  const business = content.business;
  const tel = `tel:${business.phoneHref}`;

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
      knowsAbout: ["Peugeot", "Citroën", "PSA", "Stellantis", "diagnostyka samochodowa", "mechanika samochodowa"],
    }),
    [business],
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070707] text-white selection:bg-primary selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="border-b border-white/10 bg-[#050505] text-[11px] text-white/60 sm:text-xs">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{business.street}, {business.city}</span>
            <span className="inline-flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-primary" />Pn–Pt {business.hoursWeekdays} · Sob {business.hoursSaturday}</span>
          </div>
          <a href={tel} className="inline-flex items-center gap-2 font-semibold text-white transition hover:text-primary">
            <Phone className="h-3.5 w-3.5 text-primary" />{business.phone}
          </a>
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-primary/15 bg-[#070707]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center" aria-label="Auto Serwis Gl@bcio – strona główna">
            <img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto sm:h-16" />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {content.navigation.map((item) => (
              <a key={`${item.href}-${item.label}`} href={item.href} className="text-xs font-semibold uppercase tracking-[0.16em] text-white/65 transition hover:text-primary">
                {item.label}
              </a>
            ))}
            <a href="#rezerwacja" className="border border-primary bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-primary/90">
              {content.hero.primaryCta}
            </a>
          </div>

          <button className="text-primary lg:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label="Menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#080808] px-4 pb-5 lg:hidden">
            {content.navigation.map((item) => (
              <a key={`${item.href}-${item.label}`} href={item.href} onClick={() => setMenuOpen(false)} className="block border-b border-white/5 py-4 text-sm font-medium text-white/75">
                {item.label}
              </a>
            ))}
            <a href="#rezerwacja" onClick={() => setMenuOpen(false)} className="mt-4 block bg-primary px-5 py-3 text-center text-sm font-bold text-black">
              {content.hero.primaryCta}
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
              <span className="h-px w-12 bg-primary" />{content.hero.eyebrow}
            </div>

            <h1 className="text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[78px]">
              {content.hero.titleLine1}
              <span className="mt-2 block text-gradient-gold">{content.hero.titleLine2}</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">{content.hero.description}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#rezerwacja" className="inline-flex items-center justify-center gap-2 bg-gradient-gold px-7 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-black transition hover:brightness-110">
                <CalendarDays className="h-4 w-4" />{content.hero.primaryCta}
              </a>
              <a href="#uslugi" className="inline-flex items-center justify-center gap-2 border border-white/20 bg-white/[0.03] px-7 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-primary/60 hover:text-primary">
                {content.hero.secondaryCta} <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-12 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-3">
              {content.hero.trustPoints.map((item, index) => {
                const Icon = trustIcons[index % trustIcons.length];
                return (
                  <div key={`${item.title}-${index}`} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-primary/30 bg-primary/[0.06] text-primary"><Icon className="h-4 w-4" /></div>
                    <div><div className="text-sm font-semibold">{item.title}</div><div className="mt-1 text-xs text-white/45">{item.text}</div></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md border border-primary/20 bg-black/45 p-7 shadow-[0_30px_100px_rgba(0,0,0,.55)] backdrop-blur-sm">
              <div className="absolute -left-px top-10 h-28 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
              <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
                <div><div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{content.hero.diagnosticEyebrow}</div><div className="mt-2 text-xl font-semibold">{content.hero.diagnosticTitle}</div></div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-primary"><Gauge className="h-5 w-5" /></div>
              </div>

              <div className="relative mx-auto my-8 flex h-56 w-56 items-center justify-center rounded-full border border-primary/20">
                <div className="absolute inset-5 rounded-full border border-dashed border-primary/25" />
                <div className="absolute inset-10 rounded-full border border-white/10" />
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/45">{content.hero.diagnosticCenterTop}</div>
                  <div className="mt-2 text-2xl font-extrabold text-primary">{content.hero.diagnosticCenterMain}</div>
                  <div className="mt-1 text-sm font-medium text-white/80">{content.hero.diagnosticCenterBottom}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {content.hero.diagnosticItems.map((item) => (
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
              <div className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">{content.specialization.eyebrow}</div>
              <h2 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{content.specialization.title}</h2>
              <p className="mt-5 max-w-3xl leading-7 text-white/55">{content.specialization.description}</p>
            </div>
            <div className="hidden text-right lg:block"><div className="text-5xl font-black text-primary/10">PSA</div></div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {content.specialization.brands.map((brand, index) => (
              <article key={`${brand.name}-${index}`} className="group relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/[0.08] to-transparent p-7 sm:p-9">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-primary/10 transition duration-500 group-hover:scale-110" />
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Specjalizacja {String(index + 1).padStart(2, "0")}</div>
                <h3 className="mt-4 text-4xl font-extrabold">{brand.name}</h3>
                <p className="mt-4 max-w-xl leading-7 text-white/55">{brand.description}</p>
                <div className="mt-7 flex flex-wrap gap-2 text-xs text-white/60">
                  {brand.tags.map((tag) => <span key={tag} className="border border-white/10 bg-black/30 px-3 py-2">{tag}</span>)}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="uslugi" className="bg-[#080808] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{content.services.eyebrow}</div>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{content.services.title}</h2>
            <p className="mt-4 text-white/50">{content.services.description}</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {content.services.items.map((service, index) => {
              const Icon = iconMap[service.icon] || Wrench;
              return (
                <article key={`${service.title}-${index}`} className="group bg-[#0b0b0b] p-6 transition hover:bg-[#101010] sm:p-7">
                  <div className="flex h-12 w-12 items-center justify-center border border-primary/25 bg-primary/[0.05] text-primary transition group-hover:border-primary/50"><Icon className="h-5 w-5" /></div>
                  <h3 className="mt-5 text-lg font-bold">{service.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{service.text}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <a href="/uslugi" className="inline-flex items-center gap-2 border border-primary/40 px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-black">
              {content.services.buttonLabel} <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="o-nas" className="border-y border-white/10 bg-[#0b0b0b] py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{content.about.eyebrow}</div>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{content.about.title}</h2>
            <p className="mt-6 leading-7 text-white/55">{content.about.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {content.about.bullets.map((item) => <div key={item} className="flex items-center gap-3 text-sm text-white/75"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{item}</div>)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {content.about.stats.map((item, index) => (
              <div key={`${item.label}-${index}`} className="flex min-h-40 flex-col justify-end border border-white/10 bg-gradient-to-br from-white/[0.035] to-transparent p-5 sm:p-6">
                <div className="text-3xl font-black text-primary sm:text-4xl">{item.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-white/45">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#080808] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{content.process.eyebrow}</div>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{content.process.title}</h2>
              <p className="mt-5 leading-7 text-white/50">{content.process.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.process.steps.map((step, index) => (
                <div key={`${step.number}-${index}`} className="border border-white/10 p-6">
                  <div className="text-xs font-black tracking-[0.2em] text-primary">{step.number}</div>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="opinie" className="border-y border-white/10 bg-[#0b0b0b] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{content.reviews.eyebrow}</div><h2 className="mt-4 text-3xl font-bold sm:text-4xl">{content.reviews.title}</h2></div>
            <div className="flex items-center gap-2 text-sm text-white/50"><Star className="h-4 w-4 fill-primary text-primary" />{content.reviews.ratingLabel}</div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {content.reviews.items.map((review, index) => (
              <article key={`${review.name}-${index}`} className="border border-white/10 bg-[#090909] p-6 sm:p-7">
                <div className="mb-5 flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/70">{review.name.slice(0, 1)}</div><MessageSquareQuote className="h-5 w-5 text-primary/70" /></div>
                <div className="flex gap-1">{Array.from({ length: 5 }).map((_, star) => <Star key={star} className="h-3.5 w-3.5 fill-primary text-primary" />)}</div>
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
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{content.cta.eyebrow}</div>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl">{content.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/50">{content.cta.description}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={tel} className="inline-flex items-center justify-center gap-2 bg-gradient-gold px-7 py-4 text-sm font-extrabold text-black"><Phone className="h-4 w-4" />{content.cta.primaryLabel}</a>
            <a href="#kontakt" className="inline-flex items-center justify-center gap-2 border border-primary/35 px-7 py-4 text-sm font-bold text-primary">{content.cta.secondaryLabel} <ChevronRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <footer id="kontakt" className="border-t border-primary/15 bg-[#050505]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div><img src={logo} alt="Auto Serwis Gl@bcio" className="h-16 w-auto" /><p className="mt-4 max-w-xs text-sm leading-6 text-white/40">{content.footer.description}</p></div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Kontakt</div>
            <div className="mt-5 space-y-3 text-sm text-white/50">
              <a href={tel} className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4 text-primary" />{business.phone}</a>
              <a href={`mailto:${business.email}`} className="flex items-center gap-2 hover:text-primary"><MessageSquareQuote className="h-4 w-4 text-primary" />{business.email}</a>
              <div className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{business.street}<br />{business.postalCode} {business.city}</span></div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Godziny otwarcia</div>
            <div className="mt-5 space-y-3 text-sm text-white/50">
              <div className="flex justify-between gap-4"><span>Poniedziałek – Piątek</span><span className="text-white/75">{business.hoursWeekdays}</span></div>
              <div className="flex justify-between gap-4"><span>Sobota</span><span className="text-white/75">{business.hoursSaturday}</span></div>
              <div className="flex justify-between gap-4"><span>Niedziela</span><span className="text-white/30">{business.hoursSunday}</span></div>
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Szybkie linki</div>
            <div className="mt-5 grid gap-3 text-sm text-white/50">
              {content.footer.quickLinks.map((item, index) => <a key={`${item.href}-${index}`} href={item.href} className="hover:text-primary">{item.label}</a>)}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-white/30 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"><span>© {new Date().getFullYear()} {content.footer.bottomText}</span><span>Projekt i system CMS: ZarembaTECH</span></div></div>
      </footer>
    </main>
  );
}
