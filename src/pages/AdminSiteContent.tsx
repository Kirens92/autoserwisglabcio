import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  Globe2,
  Home,
  LayoutDashboard,
  ListPlus,
  MessageSquareQuote,
  Save,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { defaultSiteContent, type SiteContent } from "@/lib/siteContent";

type Tab = "seo" | "firma" | "hero" | "specjalizacja" | "uslugi" | "onas" | "proces" | "opinie" | "cta" | "stopka";

const tabs: Array<{ id: Tab; label: string; icon: typeof Search }> = [
  { id: "seo", label: "SEO", icon: Search },
  { id: "firma", label: "Firma i kontakt", icon: Globe2 },
  { id: "hero", label: "Hero", icon: Home },
  { id: "specjalizacja", label: "Peugeot / Citroën", icon: ShieldCheck },
  { id: "uslugi", label: "Usługi strony", icon: Wrench },
  { id: "onas", label: "O nas i statystyki", icon: BarChart3 },
  { id: "proces", label: "Proces obsługi", icon: ListPlus },
  { id: "opinie", label: "Opinie", icon: MessageSquareQuote },
  { id: "cta", label: "Sekcja kontaktowa", icon: Sparkles },
  { id: "stopka", label: "Stopka", icon: FileText },
];

const fieldClass = "w-full rounded-sm border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-primary/60 focus:ring-1 focus:ring-primary/20";
const textareaClass = `${fieldClass} min-h-28 resize-y leading-6`;

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2.5">
      <span className="flex items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
        {label}
        {hint && <small className="normal-case tracking-normal text-white/30">{hint}</small>}
      </span>
      {children}
    </label>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
      <div className="mb-6 border-b border-white/10 pb-5">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function AdminSiteContent() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [active, setActive] = useState<Tab>("seo");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((x) => {
        setAuth(Boolean(x.authenticated));
        if (x.authenticated) {
          fetch("/api/site-content", { cache: "no-store" })
            .then((r) => r.json())
            .then((data) => {
              if (data?.hero?.titleLine1) setContent(data);
            })
            .catch(() => setMessage("Nie udało się pobrać treści. Wyświetlam dane domyślne."));
        }
      })
      .catch(() => setAuth(false));
  }, []);

  const currentTab = useMemo(() => tabs.find((tab) => tab.id === active)!, [active]);

  const patch = (next: SiteContent) => {
    setContent(next);
    setDirty(true);
    setMessage("");
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Błąd zapisu");
      setDirty(false);
      setMessage("Treść strony została zapisana.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się zapisać zmian.");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  if (auth === null) {
    return <main className="grid min-h-screen place-items-center bg-[#070707] text-white/50">Ładowanie panelu…</main>;
  }

  if (!auth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070707] p-6 text-white">
        <div className="w-full max-w-lg border border-primary/20 bg-[#0b0b0b] p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-5 text-3xl font-bold">Wymagane logowanie</h1>
          <p className="mt-3 text-sm leading-6 text-white/45">Edytor treści jest dostępny wyłącznie dla zalogowanego administratora.</p>
          <Link to="/admin" className="mt-6 inline-flex items-center gap-2 bg-gradient-gold px-6 py-3 text-sm font-bold text-black">
            Przejdź do logowania <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  const renderTab = () => {
    if (active === "seo") {
      return (
        <div className="space-y-5">
          <Card title="SEO strony głównej" description="Tytuł i opis widoczne w Google oraz ustawienie indeksowania wersji testowej.">
            <Field label="Meta title" hint={`${content.seo.title.length}/60`}>
              <input className={fieldClass} value={content.seo.title} onChange={(e) => patch({ ...content, seo: { ...content.seo, title: e.target.value } })} />
            </Field>
            <Field label="Meta description" hint={`${content.seo.description.length}/160`}>
              <textarea className={textareaClass} value={content.seo.description} onChange={(e) => patch({ ...content, seo: { ...content.seo, description: e.target.value } })} />
            </Field>
            <Field label="Robots">
              <select className={fieldClass} value={content.seo.robots} onChange={(e) => patch({ ...content, seo: { ...content.seo, robots: e.target.value } })}>
                <option value="noindex, follow">Wersja testowa — noindex, follow</option>
                <option value="index, follow">Wersja produkcyjna — index, follow</option>
              </select>
            </Field>
          </Card>
          <div className="border border-white/10 bg-white/[0.025] p-5">
            <div className="text-xs text-white/35">Podgląd wyniku Google</div>
            <div className="mt-3 text-xl text-[#8ab4f8]">{content.seo.title}</div>
            <div className="mt-1 text-sm text-[#bdc1c6]">https://autoserwisglabcio.pl/</div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#bdc1c6]">{content.seo.description}</p>
          </div>
        </div>
      );
    }

    if (active === "firma") {
      const b = content.business;
      return (
        <Card title="Dane firmy i kontakt" description="Te dane są używane w górnym pasku, CTA oraz stopce nowej strony.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Telefon"><input className={fieldClass} value={b.phone} onChange={(e) => patch({ ...content, business: { ...b, phone: e.target.value } })} /></Field>
            <Field label="Telefon do linku tel:"><input className={fieldClass} value={b.phoneHref} onChange={(e) => patch({ ...content, business: { ...b, phoneHref: e.target.value } })} /></Field>
            <Field label="E-mail"><input className={fieldClass} value={b.email} onChange={(e) => patch({ ...content, business: { ...b, email: e.target.value } })} /></Field>
            <Field label="Ulica"><input className={fieldClass} value={b.street} onChange={(e) => patch({ ...content, business: { ...b, street: e.target.value } })} /></Field>
            <Field label="Kod pocztowy"><input className={fieldClass} value={b.postalCode} onChange={(e) => patch({ ...content, business: { ...b, postalCode: e.target.value } })} /></Field>
            <Field label="Miasto"><input className={fieldClass} value={b.city} onChange={(e) => patch({ ...content, business: { ...b, city: e.target.value } })} /></Field>
            <Field label="Pn–Pt"><input className={fieldClass} value={b.hoursWeekdays} onChange={(e) => patch({ ...content, business: { ...b, hoursWeekdays: e.target.value } })} /></Field>
            <Field label="Sobota"><input className={fieldClass} value={b.hoursSaturday} onChange={(e) => patch({ ...content, business: { ...b, hoursSaturday: e.target.value } })} /></Field>
            <Field label="Niedziela"><input className={fieldClass} value={b.hoursSunday} onChange={(e) => patch({ ...content, business: { ...b, hoursSunday: e.target.value } })} /></Field>
          </div>
          <div className="pt-4">
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Menu strony</div>
            <div className="space-y-3">
              {content.navigation.map((item, index) => (
                <div key={`${item.href}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input className={fieldClass} value={item.label} onChange={(e) => {
                    const next = [...content.navigation]; next[index] = { ...item, label: e.target.value }; patch({ ...content, navigation: next });
                  }} />
                  <input className={fieldClass} value={item.href} onChange={(e) => {
                    const next = [...content.navigation]; next[index] = { ...item, href: e.target.value }; patch({ ...content, navigation: next });
                  }} />
                  <button onClick={() => patch({ ...content, navigation: content.navigation.filter((_, i) => i !== index) })} className="border border-red-500/20 px-4 text-red-300"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => patch({ ...content, navigation: [...content.navigation, { label: "Nowy link", href: "#sekcja" }] })} className="mt-4 border border-primary/30 px-4 py-2 text-xs font-bold text-primary">+ Dodaj link</button>
          </div>
        </Card>
      );
    }

    if (active === "hero") {
      const h = content.hero;
      return (
        <div className="space-y-5">
          <Card title="Sekcja Hero" description="Pierwszy ekran strony — najważniejszy komunikat i przyciski.">
            <Field label="Nadtytuł"><input className={fieldClass} value={h.eyebrow} onChange={(e) => patch({ ...content, hero: { ...h, eyebrow: e.target.value } })} /></Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nagłówek — linia 1"><input className={fieldClass} value={h.titleLine1} onChange={(e) => patch({ ...content, hero: { ...h, titleLine1: e.target.value } })} /></Field>
              <Field label="Nagłówek — złota linia"><input className={fieldClass} value={h.titleLine2} onChange={(e) => patch({ ...content, hero: { ...h, titleLine2: e.target.value } })} /></Field>
            </div>
            <Field label="Opis"><textarea className={textareaClass} value={h.description} onChange={(e) => patch({ ...content, hero: { ...h, description: e.target.value } })} /></Field>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Przycisk główny"><input className={fieldClass} value={h.primaryCta} onChange={(e) => patch({ ...content, hero: { ...h, primaryCta: e.target.value } })} /></Field>
              <Field label="Przycisk dodatkowy"><input className={fieldClass} value={h.secondaryCta} onChange={(e) => patch({ ...content, hero: { ...h, secondaryCta: e.target.value } })} /></Field>
            </div>
          </Card>
          <Card title="Punkty zaufania">
            <div className="grid gap-4 lg:grid-cols-3">
              {h.trustPoints.map((item, index) => (
                <div key={index} className="border border-white/10 p-4 space-y-3">
                  <input className={fieldClass} value={item.title} onChange={(e) => { const next = [...h.trustPoints]; next[index] = { ...item, title: e.target.value }; patch({ ...content, hero: { ...h, trustPoints: next } }); }} />
                  <input className={fieldClass} value={item.text} onChange={(e) => { const next = [...h.trustPoints]; next[index] = { ...item, text: e.target.value }; patch({ ...content, hero: { ...h, trustPoints: next } }); }} />
                </div>
              ))}
            </div>
          </Card>
          <Card title="Panel diagnostyczny po prawej">
            <div className="grid gap-5 md:grid-cols-2">
              {(["diagnosticEyebrow", "diagnosticTitle", "diagnosticCenterTop", "diagnosticCenterMain", "diagnosticCenterBottom"] as const).map((key) => (
                <Field key={key} label={key}><input className={fieldClass} value={h[key]} onChange={(e) => patch({ ...content, hero: { ...h, [key]: e.target.value } })} /></Field>
              ))}
            </div>
            <Field label="Kafelki — oddziel przecinkami"><input className={fieldClass} value={h.diagnosticItems.join(", ")} onChange={(e) => patch({ ...content, hero: { ...h, diagnosticItems: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) } })} /></Field>
          </Card>
        </div>
      );
    }

    if (active === "specjalizacja") {
      const s = content.specialization;
      return (
        <Card title="Specjalizacja Peugeot i Citroën" description="Bez logotypów innych marek. Tutaj zarządzasz komunikatem specjalizacji PSA / Stellantis.">
          <Field label="Nadtytuł"><input className={fieldClass} value={s.eyebrow} onChange={(e) => patch({ ...content, specialization: { ...s, eyebrow: e.target.value } })} /></Field>
          <Field label="Nagłówek"><input className={fieldClass} value={s.title} onChange={(e) => patch({ ...content, specialization: { ...s, title: e.target.value } })} /></Field>
          <Field label="Opis"><textarea className={textareaClass} value={s.description} onChange={(e) => patch({ ...content, specialization: { ...s, description: e.target.value } })} /></Field>
          <div className="grid gap-5 lg:grid-cols-2">
            {s.brands.map((brand, index) => (
              <div key={index} className="border border-primary/15 bg-primary/[0.025] p-5 space-y-4">
                <div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Specjalizacja {index + 1}</span></div>
                <Field label="Nazwa"><input className={fieldClass} value={brand.name} onChange={(e) => { const next = [...s.brands]; next[index] = { ...brand, name: e.target.value }; patch({ ...content, specialization: { ...s, brands: next } }); }} /></Field>
                <Field label="Opis"><textarea className={textareaClass} value={brand.description} onChange={(e) => { const next = [...s.brands]; next[index] = { ...brand, description: e.target.value }; patch({ ...content, specialization: { ...s, brands: next } }); }} /></Field>
                <Field label="Zakresy / tagi — oddziel przecinkami"><input className={fieldClass} value={brand.tags.join(", ")} onChange={(e) => { const next = [...s.brands]; next[index] = { ...brand, tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }; patch({ ...content, specialization: { ...s, brands: next } }); }} /></Field>
              </div>
            ))}
          </div>
        </Card>
      );
    }

    if (active === "uslugi") {
      const s = content.services;
      return (
        <Card title="Usługi na nowej stronie" description="Te kafelki są niezależne od rozbudowanej podstrony /uslugi, dzięki czemu strona główna może pokazywać krótszą ofertę.">
          <Field label="Nadtytuł"><input className={fieldClass} value={s.eyebrow} onChange={(e) => patch({ ...content, services: { ...s, eyebrow: e.target.value } })} /></Field>
          <Field label="Nagłówek"><input className={fieldClass} value={s.title} onChange={(e) => patch({ ...content, services: { ...s, title: e.target.value } })} /></Field>
          <Field label="Opis"><textarea className={textareaClass} value={s.description} onChange={(e) => patch({ ...content, services: { ...s, description: e.target.value } })} /></Field>
          <Field label="Tekst przycisku"><input className={fieldClass} value={s.buttonLabel} onChange={(e) => patch({ ...content, services: { ...s, buttonLabel: e.target.value } })} /></Field>
          <div className="grid gap-4 lg:grid-cols-2">
            {s.items.map((item, index) => (
              <div key={index} className="relative border border-white/10 p-5 space-y-3">
                <button onClick={() => patch({ ...content, services: { ...s, items: s.items.filter((_, i) => i !== index) } })} className="absolute right-3 top-3 text-red-300"><Trash2 className="h-4 w-4" /></button>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Tytuł"><input className={fieldClass} value={item.title} onChange={(e) => { const next = [...s.items]; next[index] = { ...item, title: e.target.value }; patch({ ...content, services: { ...s, items: next } }); }} /></Field>
                  <Field label="Ikona"><select className={fieldClass} value={item.icon} onChange={(e) => { const next = [...s.items]; next[index] = { ...item, icon: e.target.value }; patch({ ...content, services: { ...s, items: next } }); }}>
                    {["SearchCheck", "Wrench", "Gauge", "Sparkles", "ThermometerSnowflake", "Zap", "BatteryCharging", "ShieldCheck"].map((x) => <option key={x}>{x}</option>)}
                  </select></Field>
                </div>
                <Field label="Opis"><textarea className={textareaClass} value={item.text} onChange={(e) => { const next = [...s.items]; next[index] = { ...item, text: e.target.value }; patch({ ...content, services: { ...s, items: next } }); }} /></Field>
              </div>
            ))}
          </div>
          <button onClick={() => patch({ ...content, services: { ...s, items: [...s.items, { icon: "Wrench", title: "Nowa usługa", text: "Opis usługi" }] } })} className="inline-flex items-center gap-2 border border-primary/30 px-4 py-2 text-xs font-bold text-primary"><ListPlus className="h-4 w-4" />Dodaj usługę</button>
        </Card>
      );
    }

    if (active === "onas") {
      const a = content.about;
      return (
        <div className="space-y-5">
          <Card title="Sekcja O nas">
            <Field label="Nadtytuł"><input className={fieldClass} value={a.eyebrow} onChange={(e) => patch({ ...content, about: { ...a, eyebrow: e.target.value } })} /></Field>
            <Field label="Nagłówek"><input className={fieldClass} value={a.title} onChange={(e) => patch({ ...content, about: { ...a, title: e.target.value } })} /></Field>
            <Field label="Opis"><textarea className={textareaClass} value={a.description} onChange={(e) => patch({ ...content, about: { ...a, description: e.target.value } })} /></Field>
            <Field label="Najważniejsze cechy — jedna na linię"><textarea className={textareaClass} value={a.bullets.join("\n")} onChange={(e) => patch({ ...content, about: { ...a, bullets: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) } })} /></Field>
          </Card>
          <Card title="Statystyki">
            <div className="grid gap-4 md:grid-cols-2">
              {a.stats.map((item, index) => (
                <div key={index} className="grid grid-cols-[.4fr_1fr] gap-3 border border-white/10 p-4">
                  <input className={fieldClass} value={item.value} onChange={(e) => { const next = [...a.stats]; next[index] = { ...item, value: e.target.value }; patch({ ...content, about: { ...a, stats: next } }); }} />
                  <input className={fieldClass} value={item.label} onChange={(e) => { const next = [...a.stats]; next[index] = { ...item, label: e.target.value }; patch({ ...content, about: { ...a, stats: next } }); }} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      );
    }

    if (active === "proces") {
      const p = content.process;
      return (
        <Card title="Proces obsługi klienta">
          <Field label="Nadtytuł"><input className={fieldClass} value={p.eyebrow} onChange={(e) => patch({ ...content, process: { ...p, eyebrow: e.target.value } })} /></Field>
          <Field label="Nagłówek"><input className={fieldClass} value={p.title} onChange={(e) => patch({ ...content, process: { ...p, title: e.target.value } })} /></Field>
          <Field label="Opis"><textarea className={textareaClass} value={p.description} onChange={(e) => patch({ ...content, process: { ...p, description: e.target.value } })} /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            {p.steps.map((item, index) => (
              <div key={index} className="border border-white/10 p-5 space-y-3">
                <div className="grid grid-cols-[100px_1fr] gap-3">
                  <input className={fieldClass} value={item.number} onChange={(e) => { const next = [...p.steps]; next[index] = { ...item, number: e.target.value }; patch({ ...content, process: { ...p, steps: next } }); }} />
                  <input className={fieldClass} value={item.title} onChange={(e) => { const next = [...p.steps]; next[index] = { ...item, title: e.target.value }; patch({ ...content, process: { ...p, steps: next } }); }} />
                </div>
                <textarea className={textareaClass} value={item.text} onChange={(e) => { const next = [...p.steps]; next[index] = { ...item, text: e.target.value }; patch({ ...content, process: { ...p, steps: next } }); }} />
              </div>
            ))}
          </div>
        </Card>
      );
    }

    if (active === "opinie") {
      const r = content.reviews;
      return (
        <Card title="Opinie klientów" description="Na razie ręczna treść. Później możemy podłączyć ocenę Google przez API i synchronizować ją automatycznie.">
          <Field label="Nadtytuł"><input className={fieldClass} value={r.eyebrow} onChange={(e) => patch({ ...content, reviews: { ...r, eyebrow: e.target.value } })} /></Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Nagłówek"><input className={fieldClass} value={r.title} onChange={(e) => patch({ ...content, reviews: { ...r, title: e.target.value } })} /></Field>
            <Field label="Ocena / źródło"><input className={fieldClass} value={r.ratingLabel} onChange={(e) => patch({ ...content, reviews: { ...r, ratingLabel: e.target.value } })} /></Field>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {r.items.map((item, index) => (
              <div key={index} className="relative border border-white/10 p-5 space-y-3">
                <button onClick={() => patch({ ...content, reviews: { ...r, items: r.items.filter((_, i) => i !== index) } })} className="absolute right-3 top-3 text-red-300"><Trash2 className="h-4 w-4" /></button>
                <Field label="Autor"><input className={fieldClass} value={item.name} onChange={(e) => { const next = [...r.items]; next[index] = { ...item, name: e.target.value }; patch({ ...content, reviews: { ...r, items: next } }); }} /></Field>
                <Field label="Treść"><textarea className={textareaClass} value={item.text} onChange={(e) => { const next = [...r.items]; next[index] = { ...item, text: e.target.value }; patch({ ...content, reviews: { ...r, items: next } }); }} /></Field>
              </div>
            ))}
          </div>
          <button onClick={() => patch({ ...content, reviews: { ...r, items: [...r.items, { name: "Nowy klient", text: "Treść opinii" }] } })} className="border border-primary/30 px-4 py-2 text-xs font-bold text-primary">+ Dodaj opinię</button>
        </Card>
      );
    }

    if (active === "cta") {
      const c = content.cta;
      return (
        <Card title="Końcowe wezwanie do kontaktu">
          <Field label="Nadtytuł"><input className={fieldClass} value={c.eyebrow} onChange={(e) => patch({ ...content, cta: { ...c, eyebrow: e.target.value } })} /></Field>
          <Field label="Nagłówek"><input className={fieldClass} value={c.title} onChange={(e) => patch({ ...content, cta: { ...c, title: e.target.value } })} /></Field>
          <Field label="Opis"><textarea className={textareaClass} value={c.description} onChange={(e) => patch({ ...content, cta: { ...c, description: e.target.value } })} /></Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Przycisk telefon"><input className={fieldClass} value={c.primaryLabel} onChange={(e) => patch({ ...content, cta: { ...c, primaryLabel: e.target.value } })} /></Field>
            <Field label="Przycisk kontakt"><input className={fieldClass} value={c.secondaryLabel} onChange={(e) => patch({ ...content, cta: { ...c, secondaryLabel: e.target.value } })} /></Field>
          </div>
        </Card>
      );
    }

    const f = content.footer;
    return (
      <Card title="Stopka strony">
        <Field label="Opis firmy"><textarea className={textareaClass} value={f.description} onChange={(e) => patch({ ...content, footer: { ...f, description: e.target.value } })} /></Field>
        <Field label="Tekst praw autorskich"><input className={fieldClass} value={f.bottomText} onChange={(e) => patch({ ...content, footer: { ...f, bottomText: e.target.value } })} /></Field>
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Szybkie linki</div>
          {f.quickLinks.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <input className={fieldClass} value={item.label} onChange={(e) => { const next = [...f.quickLinks]; next[index] = { ...item, label: e.target.value }; patch({ ...content, footer: { ...f, quickLinks: next } }); }} />
              <input className={fieldClass} value={item.href} onChange={(e) => { const next = [...f.quickLinks]; next[index] = { ...item, href: e.target.value }; patch({ ...content, footer: { ...f, quickLinks: next } }); }} />
              <button onClick={() => patch({ ...content, footer: { ...f, quickLinks: f.quickLinks.filter((_, i) => i !== index) } })} className="border border-red-500/20 px-4 text-red-300"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={() => patch({ ...content, footer: { ...f, quickLinks: [...f.quickLinks, { label: "Nowy link", href: "/" }] } })} className="border border-primary/30 px-4 py-2 text-xs font-bold text-primary">+ Dodaj link</button>
        </div>
      </Card>
    );
  };

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070707]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center border border-primary/30 bg-primary/[0.06] text-primary"><LayoutDashboard className="h-4 w-4" /></div>
            <div>
              <div className="text-sm font-bold">Gl@bcio CMS</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-white/30">Zarządzanie stroną</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/nowa-strona" target="_blank" rel="noreferrer" className="hidden items-center gap-2 border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:border-primary/40 hover:text-primary sm:inline-flex"><Eye className="h-4 w-4" />Podgląd strony</a>
            <button onClick={logout} className="border border-white/10 px-4 py-2 text-xs text-white/45 transition hover:text-white">Wyloguj</button>
            <button onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 bg-gradient-gold px-4 py-2 text-xs font-extrabold text-black disabled:cursor-not-allowed disabled:opacity-40"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : "Zapisz"}</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-white/10 bg-[#090909] p-4 lg:min-h-[calc(100vh-65px)]">
          <div className="mb-4 grid grid-cols-3 gap-1 border border-white/10 p-1 text-[10px] uppercase tracking-[0.12em]">
            <Link to="/admin/strona" className="bg-primary px-2 py-2 text-center font-bold text-black">Strona</Link>
            <Link to="/admin" className="px-2 py-2 text-center text-white/45 hover:text-white">Usługi</Link>
            <Link to="/admin/realizacje" className="px-2 py-2 text-center text-white/45 hover:text-white">Realizacje</Link>
          </div>
          <div className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Treść strony głównej</div>
          <nav className="grid gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = active === tab.id;
              return (
                <button key={tab.id} onClick={() => setActive(tab.id)} className={`flex items-center gap-3 px-3 py-3 text-left text-sm transition ${selected ? "bg-primary/[0.09] text-primary ring-1 ring-inset ring-primary/20" : "text-white/45 hover:bg-white/[0.03] hover:text-white/75"}`}>
                  <Icon className="h-4 w-4 shrink-0" />{tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-9">
          <div className="mb-7 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Panel administratora / Strona</div>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{currentTab.label}</h1>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {dirty ? <span className="text-amber-300">● Niezapisane zmiany</span> : <span className="inline-flex items-center gap-1.5 text-emerald-300"><CheckCircle2 className="h-4 w-4" />Wszystko zapisane</span>}
            </div>
          </div>

          {message && <div className={`mb-5 border px-4 py-3 text-sm ${message.includes("została zapisana") ? "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-200" : "border-amber-500/20 bg-amber-500/[0.05] text-amber-200"}`}>{message}</div>}
          {renderTab()}

          <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-white/30"><Settings2 className="h-4 w-4" />Zmiany publikują się po zapisaniu i odświeżeniu strony.</div>
            <button onClick={save} disabled={saving || !dirty} className="inline-flex items-center justify-center gap-2 bg-gradient-gold px-6 py-3 text-sm font-extrabold text-black disabled:opacity-40"><Save className="h-4 w-4" />Zapisz zmiany</button>
          </div>
        </section>
      </div>
    </main>
  );
}
