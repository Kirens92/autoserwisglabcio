import { ChangeEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  FileImage,
  FileText,
  Globe2,
  Home,
  ImagePlus,
  ListPlus,
  MapPinned,
  MessageSquareQuote,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import AdminPanelShell from "@/components/AdminPanelShell";
import { defaultSiteContent, normalizeSiteContent, type SiteContent } from "@/lib/siteContent";

type Tab = "seo" | "firma" | "hero" | "specjalizacja" | "oferta" | "onas" | "proces" | "opinie" | "wysylka" | "kontakt" | "stopka";

const tabs: Array<{ id: Tab; label: string; icon: typeof Search }> = [
  { id: "seo", label: "SEO", icon: Search },
  { id: "firma", label: "Firma i kontakt", icon: Globe2 },
  { id: "hero", label: "Hero", icon: Home },
  { id: "specjalizacja", label: "Specjalizacja", icon: Users },
  { id: "oferta", label: "Usługi i realizacje", icon: Wrench },
  { id: "onas", label: "Dlaczego Gl@bcio", icon: BarChart3 },
  { id: "proces", label: "Proces obsługi", icon: ListPlus },
  { id: "opinie", label: "Opinie", icon: MessageSquareQuote },
  { id: "wysylka", label: "Wysyłka", icon: MapPinned },
  { id: "kontakt", label: "Kontakt / formularz", icon: Sparkles },
  { id: "stopka", label: "Stopka", icon: FileText },
];

const fieldClass = "w-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#dca92c]/60 focus:ring-1 focus:ring-[#dca92c]/20";
const textareaClass = `${fieldClass} min-h-28 resize-y leading-6`;

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2.5">
      <span className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
        {label}
        {hint && <small className="normal-case tracking-normal text-white/28">{hint}</small>}
      </span>
      {children}
    </label>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="border border-white/10 bg-[#0b0c0b] p-5 sm:p-7">
      <div className="mb-6 border-b border-white/10 pb-5">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-white/40">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

type ImageEditorProps = {
  label: string;
  value: string;
  alt: string;
  onChange: (value: string) => void;
  onAltChange: (value: string) => void;
  onMessage: (value: string) => void;
  fallbackNote?: string;
};

function ImageEditor({ label, value, alt, onChange, onAltChange, onMessage, fallbackNote }: ImageEditorProps) {
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onMessage(`Wysyłanie grafiki: ${file.name}…`);
    try {
      const response = await fetch(`/api/admin/upload?name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Nie udało się wysłać grafiki.");
      onChange(data.image);
      onMessage("Grafika została wgrana. Zapisz stronę, aby opublikować zmianę.");
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Nie udało się wysłać grafiki.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div className="border border-white/10 bg-black/20 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex min-h-40 w-full items-center justify-center overflow-hidden border border-white/10 bg-black/30 lg:w-64">
          {value ? <img src={value} alt={alt || "Podgląd grafiki"} className="max-h-52 w-full object-cover" /> : <div className="px-6 text-center text-xs leading-5 text-white/25">{fallbackNote || "Brak własnej grafiki — strona użyje grafiki domyślnej."}</div>}
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{label}</div>
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 border border-[#dca92c]/30 px-4 py-2.5 text-xs font-bold text-[#e0ad31]"><ImagePlus className="h-4 w-4" />Wgraj grafikę<input type="file" accept="image/*" onChange={upload} className="hidden" /></label>
              {value && <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-2 border border-red-500/15 px-4 py-2.5 text-xs text-red-300"><Trash2 className="h-4 w-4" />Usuń własną</button>}
            </div>
          </div>
          <Field label="Adres grafiki" hint="możesz też wkleić URL"><input className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/... lub https://..." /></Field>
          <Field label="Tekst ALT"><input className={fieldClass} value={alt} onChange={(e) => onAltChange(e.target.value)} placeholder="Opis grafiki dla SEO i dostępności" /></Field>
        </div>
      </div>
    </div>
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
      .then((session) => {
        const authenticated = Boolean(session.authenticated);
        setAuth(authenticated);
        if (!authenticated) return;
        fetch("/api/site-content", { cache: "no-store" })
          .then((r) => r.json())
          .then((data) => setContent(normalizeSiteContent(data)))
          .catch(() => setMessage("Nie udało się pobrać treści. Wyświetlam dane domyślne."));
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
      setContent(normalizeSiteContent(data));
      setDirty(false);
      setMessage("Strona główna została zapisana. Zmiany są dostępne na /nowa-strona.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się zapisać zmian.");
    } finally {
      setSaving(false);
    }
  };

  if (auth === null) return <main className="grid min-h-screen place-items-center bg-[#070807] text-white/40">Ładowanie edytora…</main>;
  if (!auth) return <main className="grid min-h-screen place-items-center bg-[#070807] p-6 text-white"><div className="w-full max-w-lg border border-[#dca92c]/20 bg-[#0b0c0b] p-8 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-[#e0ad31]" /><h1 className="mt-5 text-3xl font-bold">Wymagane logowanie</h1><p className="mt-3 text-sm leading-6 text-white/40">Edytor strony głównej jest dostępny po zalogowaniu.</p><Link to="/admin" className="mt-6 inline-flex bg-[#e0ad31] px-6 py-3 text-sm font-bold text-black">Przejdź do logowania</Link></div></main>;

  const renderTab = () => {
    if (active === "seo") {
      return <div className="space-y-5"><Card title="SEO strony głównej" description="Tytuł, opis i indeksowanie podstrony /nowa-strona."><Field label="Meta title" hint={`${content.seo.title.length}/60`}><input className={fieldClass} value={content.seo.title} onChange={(e) => patch({ ...content, seo: { ...content.seo, title: e.target.value } })} /></Field><Field label="Meta description" hint={`${content.seo.description.length}/160`}><textarea className={textareaClass} value={content.seo.description} onChange={(e) => patch({ ...content, seo: { ...content.seo, description: e.target.value } })} /></Field><Field label="Robots"><select className={fieldClass} value={content.seo.robots} onChange={(e) => patch({ ...content, seo: { ...content.seo, robots: e.target.value } })}><option value="noindex, follow">Testowa — noindex, follow</option><option value="index, follow">Produkcyjna — index, follow</option></select></Field></Card></div>;
    }

    if (active === "firma") {
      const b = content.business;
      return <Card title="Dane firmy i kontakt" description="Telefony są wspólne dla nowej strony głównej, CTA, stopki i podstrony ECU/TCU."><div className="grid gap-5 md:grid-cols-2"><Field label="Telefon 1"><input className={fieldClass} value={b.phone} onChange={(e) => patch({ ...content, business: { ...b, phone: e.target.value } })} /></Field><Field label="Telefon 1 — tel:"><input className={fieldClass} value={b.phoneHref} onChange={(e) => patch({ ...content, business: { ...b, phoneHref: e.target.value } })} /></Field><Field label="Telefon 2"><input className={fieldClass} value={b.phone2} onChange={(e) => patch({ ...content, business: { ...b, phone2: e.target.value } })} placeholder="Opcjonalny drugi numer" /></Field><Field label="Telefon 2 — tel:"><input className={fieldClass} value={b.phoneHref2} onChange={(e) => patch({ ...content, business: { ...b, phoneHref2: e.target.value } })} placeholder="Np. +48500100200" /></Field><Field label="E-mail"><input className={fieldClass} value={b.email} onChange={(e) => patch({ ...content, business: { ...b, email: e.target.value } })} /></Field><Field label="Ulica"><input className={fieldClass} value={b.street} onChange={(e) => patch({ ...content, business: { ...b, street: e.target.value } })} /></Field><Field label="Kod pocztowy"><input className={fieldClass} value={b.postalCode} onChange={(e) => patch({ ...content, business: { ...b, postalCode: e.target.value } })} /></Field><Field label="Miasto"><input className={fieldClass} value={b.city} onChange={(e) => patch({ ...content, business: { ...b, city: e.target.value } })} /></Field><Field label="Pon–Pt"><input className={fieldClass} value={b.hoursWeekdays} onChange={(e) => patch({ ...content, business: { ...b, hoursWeekdays: e.target.value } })} /></Field><Field label="Sobota"><input className={fieldClass} value={b.hoursSaturday} onChange={(e) => patch({ ...content, business: { ...b, hoursSaturday: e.target.value } })} /></Field><Field label="Niedziela"><input className={fieldClass} value={b.hoursSunday} onChange={(e) => patch({ ...content, business: { ...b, hoursSunday: e.target.value } })} /></Field></div><div className="pt-3"><div className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">Menu strony</div><div className="space-y-3">{content.navigation.map((item, index) => <div key={`${item.href}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"><input className={fieldClass} value={item.label} onChange={(e) => { const next = [...content.navigation]; next[index] = { ...item, label: e.target.value }; patch({ ...content, navigation: next }); }} /><input className={fieldClass} value={item.href} onChange={(e) => { const next = [...content.navigation]; next[index] = { ...item, href: e.target.value }; patch({ ...content, navigation: next }); }} /><button onClick={() => patch({ ...content, navigation: content.navigation.filter((_, i) => i !== index) })} className="border border-red-500/15 px-4 text-red-300"><Trash2 className="h-4 w-4" /></button></div>)}</div><button onClick={() => patch({ ...content, navigation: [...content.navigation, { label: "Nowy link", href: "#sekcja" }] })} className="mt-4 border border-[#dca92c]/30 px-4 py-2 text-xs font-bold text-[#e0ad31]">+ Dodaj link</button></div></Card>;
    }

    if (active === "hero") {
      const h = content.hero;
      return <div className="space-y-5"><Card title="Pierwszy ekran — Hero" description="Najważniejsza sekcja strony. Teksty, CTA, punkty zaufania i główna grafika."><Field label="Nadtytuł"><input className={fieldClass} value={h.eyebrow} onChange={(e) => patch({ ...content, hero: { ...h, eyebrow: e.target.value } })} /></Field><div className="grid gap-5 md:grid-cols-2"><Field label="Nagłówek — linia 1"><input className={fieldClass} value={h.titleLine1} onChange={(e) => patch({ ...content, hero: { ...h, titleLine1: e.target.value } })} /></Field><Field label="Nagłówek — złota linia"><input className={fieldClass} value={h.titleLine2} onChange={(e) => patch({ ...content, hero: { ...h, titleLine2: e.target.value } })} /></Field></div><Field label="Opis"><textarea className={textareaClass} value={h.description} onChange={(e) => patch({ ...content, hero: { ...h, description: e.target.value } })} /></Field><div className="grid gap-5 md:grid-cols-2"><Field label="Przycisk główny"><input className={fieldClass} value={h.primaryCta} onChange={(e) => patch({ ...content, hero: { ...h, primaryCta: e.target.value } })} /></Field><Field label="Przycisk dodatkowy"><input className={fieldClass} value={h.secondaryCta} onChange={(e) => patch({ ...content, hero: { ...h, secondaryCta: e.target.value } })} /></Field></div></Card><Card title="Grafika Hero"><ImageEditor label="Zdjęcie po prawej" value={h.image} alt={h.imageAlt} onChange={(value) => patch({ ...content, hero: { ...h, image: value } })} onAltChange={(value) => patch({ ...content, hero: { ...h, imageAlt: value } })} onMessage={setMessage} fallbackNote="Bez własnej grafiki używany jest hero-bg.png z assets." /><div className="grid gap-5 md:grid-cols-3"><Field label="Nadtytuł karty"><input className={fieldClass} value={h.overlayEyebrow} onChange={(e) => patch({ ...content, hero: { ...h, overlayEyebrow: e.target.value } })} /></Field><Field label="Tytuł karty"><input className={fieldClass} value={h.overlayTitle} onChange={(e) => patch({ ...content, hero: { ...h, overlayTitle: e.target.value } })} /></Field><Field label="Opis karty"><textarea className={`${textareaClass} min-h-20`} value={h.overlayText} onChange={(e) => patch({ ...content, hero: { ...h, overlayText: e.target.value } })} /></Field></div></Card><Card title="Punkty zaufania"><div className="grid gap-4 lg:grid-cols-3">{h.trustPoints.slice(0, 3).map((item, index) => <div key={index} className="space-y-3 border border-white/10 p-4"><input className={fieldClass} value={item.title} onChange={(e) => { const next = [...h.trustPoints]; next[index] = { ...item, title: e.target.value }; patch({ ...content, hero: { ...h, trustPoints: next } }); }} /><input className={fieldClass} value={item.text} onChange={(e) => { const next = [...h.trustPoints]; next[index] = { ...item, text: e.target.value }; patch({ ...content, hero: { ...h, trustPoints: next } }); }} /></div>)}</div></Card></div>;
    }

    if (active === "specjalizacja") {
      const s = content.specialization;
      return <div className="space-y-5"><Card title="Sekcja specjalizacji"><Field label="Nadtytuł"><input className={fieldClass} value={s.eyebrow} onChange={(e) => patch({ ...content, specialization: { ...s, eyebrow: e.target.value } })} /></Field><Field label="Tytuł"><input className={fieldClass} value={s.title} onChange={(e) => patch({ ...content, specialization: { ...s, title: e.target.value } })} /></Field><Field label="Opis"><textarea className={textareaClass} value={s.description} onChange={(e) => patch({ ...content, specialization: { ...s, description: e.target.value } })} /></Field></Card>{s.brands.map((brand, index) => <Card key={`${brand.name}-${index}`} title={`Karta ${index + 1}: ${brand.name}`} description="Każda marka ma osobną grafikę, opis i tagi."><div className="grid gap-5 md:grid-cols-2"><Field label="Nazwa"><input className={fieldClass} value={brand.name} onChange={(e) => { const next = [...s.brands]; next[index] = { ...brand, name: e.target.value }; patch({ ...content, specialization: { ...s, brands: next } }); }} /></Field><Field label="Tagi" hint="oddziel przecinkami"><input className={fieldClass} value={brand.tags.join(", ")} onChange={(e) => { const next = [...s.brands]; next[index] = { ...brand, tags: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) }; patch({ ...content, specialization: { ...s, brands: next } }); }} /></Field></div><Field label="Opis"><textarea className={textareaClass} value={brand.description} onChange={(e) => { const next = [...s.brands]; next[index] = { ...brand, description: e.target.value }; patch({ ...content, specialization: { ...s, brands: next } }); }} /></Field><ImageEditor label={`Grafika ${brand.name}`} value={brand.image || ""} alt={brand.imageAlt || ""} onChange={(value) => { const next = [...s.brands]; next[index] = { ...brand, image: value }; patch({ ...content, specialization: { ...s, brands: next } }); }} onAltChange={(value) => { const next = [...s.brands]; next[index] = { ...brand, imageAlt: value }; patch({ ...content, specialization: { ...s, brands: next } }); }} onMessage={setMessage} fallbackNote="Bez własnego zdjęcia używana jest grafika domyślna z assets." /></Card>)}</div>;
    }

    if (active === "oferta") {
      const s = content.services;
      const r = content.realizations;
      return <div className="space-y-5"><Card title="Sekcja Usługi" description="Nagłówek tej sekcji edytujesz tutaj. Same karty usług, ich opisy, kolejność i grafiki są zarządzane w module Usługi."><Field label="Nadtytuł"><input className={fieldClass} value={s.eyebrow} onChange={(e) => patch({ ...content, services: { ...s, eyebrow: e.target.value } })} /></Field><Field label="Tytuł"><input className={fieldClass} value={s.title} onChange={(e) => patch({ ...content, services: { ...s, title: e.target.value } })} /></Field><Field label="Opis"><textarea className={textareaClass} value={s.description} onChange={(e) => patch({ ...content, services: { ...s, description: e.target.value } })} /></Field><Field label="Tekst przycisku"><input className={fieldClass} value={s.buttonLabel} onChange={(e) => patch({ ...content, services: { ...s, buttonLabel: e.target.value } })} /></Field><Link to="/admin/uslugi" className="inline-flex items-center gap-2 border border-[#dca92c]/30 px-5 py-3 text-xs font-bold text-[#e0ad31]"><Wrench className="h-4 w-4" />Edytuj karty usług i ich grafiki</Link></Card><Card title="Sekcja Realizacje" description="Treść nagłówka jest tutaj, a same realizacje i ich zdjęcia w module Realizacje."><Field label="Nadtytuł"><input className={fieldClass} value={r.eyebrow} onChange={(e) => patch({ ...content, realizations: { ...r, eyebrow: e.target.value } })} /></Field><Field label="Tytuł"><input className={fieldClass} value={r.title} onChange={(e) => patch({ ...content, realizations: { ...r, title: e.target.value } })} /></Field><Field label="Opis"><textarea className={textareaClass} value={r.description} onChange={(e) => patch({ ...content, realizations: { ...r, description: e.target.value } })} /></Field><Field label="Tekst przycisku"><input className={fieldClass} value={r.buttonLabel} onChange={(e) => patch({ ...content, realizations: { ...r, buttonLabel: e.target.value } })} /></Field><Link to="/admin/realizacje" className="inline-flex items-center gap-2 border border-[#dca92c]/30 px-5 py-3 text-xs font-bold text-[#e0ad31]"><FileImage className="h-4 w-4" />Edytuj realizacje i zdjęcia</Link></Card></div>;
    }

    if (active === "onas") {
      const a = content.about;
      return <div className="space-y-5"><Card title="Dlaczego Gl@bcio?" description="Sekcja z dużym zdjęciem warsztatu, przewagami i statystykami."><Field label="Nadtytuł"><input className={fieldClass} value={a.eyebrow} onChange={(e) => patch({ ...content, about: { ...a, eyebrow: e.target.value } })} /></Field><Field label="Tytuł"><input className={fieldClass} value={a.title} onChange={(e) => patch({ ...content, about: { ...a, title: e.target.value } })} /></Field><Field label="Opis"><textarea className={textareaClass} value={a.description} onChange={(e) => patch({ ...content, about: { ...a, description: e.target.value } })} /></Field><ImageEditor label="Duża grafika sekcji" value={a.image} alt={a.imageAlt} onChange={(value) => patch({ ...content, about: { ...a, image: value } })} onAltChange={(value) => patch({ ...content, about: { ...a, imageAlt: value } })} onMessage={setMessage} fallbackNote="Bez własnej grafiki używany jest ecutcu.png z assets." /><Field label="Punkty" hint="jeden w wierszu"><textarea className={textareaClass} value={a.bullets.join("\n")} onChange={(e) => patch({ ...content, about: { ...a, bullets: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) } })} /></Field><div className="grid gap-4 md:grid-cols-2">{a.stats.map((item, index) => <div key={index} className="grid gap-3 border border-white/10 p-4 sm:grid-cols-2"><input className={fieldClass} value={item.value} onChange={(e) => { const next = [...a.stats]; next[index] = { ...item, value: e.target.value }; patch({ ...content, about: { ...a, stats: next } }); }} /><input className={fieldClass} value={item.label} onChange={(e) => { const next = [...a.stats]; next[index] = { ...item, label: e.target.value }; patch({ ...content, about: { ...a, stats: next } }); }} /></div>)}</div></Card></div>;
    }

    if (active === "proces") {
      const p = content.process;
      return <Card title="Proces obsługi" description="Na stronie wyświetlane są pierwsze cztery kroki."><Field label="Nadtytuł"><input className={fieldClass} value={p.eyebrow} onChange={(e) => patch({ ...content, process: { ...p, eyebrow: e.target.value } })} /></Field><Field label="Tytuł"><input className={fieldClass} value={p.title} onChange={(e) => patch({ ...content, process: { ...p, title: e.target.value } })} /></Field><Field label="Opis"><textarea className={textareaClass} value={p.description} onChange={(e) => patch({ ...content, process: { ...p, description: e.target.value } })} /></Field><div className="grid gap-4 lg:grid-cols-2">{p.steps.slice(0, 4).map((step, index) => <div key={index} className="space-y-3 border border-white/10 p-4"><div className="grid grid-cols-[100px_1fr] gap-3"><input className={fieldClass} value={step.number} onChange={(e) => { const next = [...p.steps]; next[index] = { ...step, number: e.target.value }; patch({ ...content, process: { ...p, steps: next } }); }} /><input className={fieldClass} value={step.title} onChange={(e) => { const next = [...p.steps]; next[index] = { ...step, title: e.target.value }; patch({ ...content, process: { ...p, steps: next } }); }} /></div><textarea className={`${textareaClass} min-h-20`} value={step.text} onChange={(e) => { const next = [...p.steps]; next[index] = { ...step, text: e.target.value }; patch({ ...content, process: { ...p, steps: next } }); }} /></div>)}</div></Card>;
    }

    if (active === "opinie") {
      const r = content.reviews;
      return <Card title="Opinie klientów" description="Na produkcji strona korzysta z Google Places API. Te treści są awaryjnym fallbackiem, gdy API jest niedostępne."><Field label="Nadtytuł"><input className={fieldClass} value={r.eyebrow} onChange={(e) => patch({ ...content, reviews: { ...r, eyebrow: e.target.value } })} /></Field><Field label="Tytuł"><input className={fieldClass} value={r.title} onChange={(e) => patch({ ...content, reviews: { ...r, title: e.target.value } })} /></Field><Field label="Opis oceny / źródło"><input className={fieldClass} value={r.ratingLabel} onChange={(e) => patch({ ...content, reviews: { ...r, ratingLabel: e.target.value } })} /></Field><div className="grid gap-4 lg:grid-cols-3">{r.items.slice(0, 3).map((item, index) => <div key={index} className="space-y-3 border border-white/10 p-4"><input className={fieldClass} value={item.name} onChange={(e) => { const next = [...r.items]; next[index] = { ...item, name: e.target.value }; patch({ ...content, reviews: { ...r, items: next } }); }} /><textarea className={`${textareaClass} min-h-32`} value={item.text} onChange={(e) => { const next = [...r.items]; next[index] = { ...item, text: e.target.value }; patch({ ...content, reviews: { ...r, items: next } }); }} /></div>)}</div></Card>;
    }

    if (active === "wysylka") {
      const s = content.shipping;
      return <Card title="Obsługa wysyłkowa w całej Polsce" description="Ta grafika może być w całości podmieniona z panelu — domyślnie używana jest Wysyłka w całej Polsce.png z assets."><Field label="Nadtytuł"><input className={fieldClass} value={s.eyebrow} onChange={(e) => patch({ ...content, shipping: { ...s, eyebrow: e.target.value } })} /></Field><Field label="Tytuł"><input className={fieldClass} value={s.title} onChange={(e) => patch({ ...content, shipping: { ...s, title: e.target.value } })} /></Field><Field label="Opis"><textarea className={textareaClass} value={s.description} onChange={(e) => patch({ ...content, shipping: { ...s, description: e.target.value } })} /></Field><Field label="Tekst przycisku"><input className={fieldClass} value={s.buttonLabel} onChange={(e) => patch({ ...content, shipping: { ...s, buttonLabel: e.target.value } })} /></Field><ImageEditor label="Banner wysyłkowy" value={s.image} alt={s.imageAlt} onChange={(value) => patch({ ...content, shipping: { ...s, image: value } })} onAltChange={(value) => patch({ ...content, shipping: { ...s, imageAlt: value } })} onMessage={setMessage} fallbackNote="Domyślnie: Wysyłka w całej Polsce.png z assets." /></Card>;
    }

    if (active === "kontakt") {
      const c = content.contact;
      return <Card title="Kontakt i formularz" description="Sekcja końcowa z numerami telefonu, danymi warsztatu i formularzem otwierającym wiadomość e-mail."><Field label="Nadtytuł"><input className={fieldClass} value={c.eyebrow} onChange={(e) => patch({ ...content, contact: { ...c, eyebrow: e.target.value } })} /></Field><Field label="Tytuł"><input className={fieldClass} value={c.title} onChange={(e) => patch({ ...content, contact: { ...c, title: e.target.value } })} /></Field><Field label="Opis"><textarea className={textareaClass} value={c.description} onChange={(e) => patch({ ...content, contact: { ...c, description: e.target.value } })} /></Field><div className="grid gap-5 md:grid-cols-2"><Field label="Tytuł nad telefonami"><input className={fieldClass} value={c.phoneTitle} onChange={(e) => patch({ ...content, contact: { ...c, phoneTitle: e.target.value } })} /></Field><Field label="Tytuł formularza"><input className={fieldClass} value={c.formTitle} onChange={(e) => patch({ ...content, contact: { ...c, formTitle: e.target.value } })} /></Field></div><Field label="Opis formularza"><textarea className={`${textareaClass} min-h-20`} value={c.formDescription} onChange={(e) => patch({ ...content, contact: { ...c, formDescription: e.target.value } })} /></Field><Field label="Tekst przycisku formularza"><input className={fieldClass} value={c.submitLabel} onChange={(e) => patch({ ...content, contact: { ...c, submitLabel: e.target.value } })} /></Field></Card>;
    }

    const f = content.footer;
    return <Card title="Stopka" description="Logo jest stałe i pobierane z assets/nowelogo.png. Pozostałe treści są edytowalne."><Field label="Opis firmy"><textarea className={textareaClass} value={f.description} onChange={(e) => patch({ ...content, footer: { ...f, description: e.target.value } })} /></Field><Field label="Tekst copyright"><input className={fieldClass} value={f.bottomText} onChange={(e) => patch({ ...content, footer: { ...f, bottomText: e.target.value } })} /></Field><div><div className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">Szybkie linki</div><div className="space-y-3">{f.quickLinks.map((item, index) => <div key={`${item.href}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"><input className={fieldClass} value={item.label} onChange={(e) => { const next = [...f.quickLinks]; next[index] = { ...item, label: e.target.value }; patch({ ...content, footer: { ...f, quickLinks: next } }); }} /><input className={fieldClass} value={item.href} onChange={(e) => { const next = [...f.quickLinks]; next[index] = { ...item, href: e.target.value }; patch({ ...content, footer: { ...f, quickLinks: next } }); }} /><button onClick={() => patch({ ...content, footer: { ...f, quickLinks: f.quickLinks.filter((_, i) => i !== index) } })} className="border border-red-500/15 px-4 text-red-300"><Trash2 className="h-4 w-4" /></button></div>)}</div><button onClick={() => patch({ ...content, footer: { ...f, quickLinks: [...f.quickLinks, { label: "Nowy link", href: "/" }] } })} className="mt-4 border border-[#dca92c]/30 px-4 py-2 text-xs font-bold text-[#e0ad31]">+ Dodaj link</button></div></Card>;
  };

  return (
    <AdminPanelShell activePath="/admin/strona" title="Edytor strony głównej" eyebrow="Każda sekcja i grafika" previewHref="/nowa-strona">
      <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
          <div><div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e0ad31]">Strona główna /nowa-strona</div><h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Pełna kontrola nad stroną.</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-white/40">Edytuj teksty, numery telefonu, menu, grafiki Hero, karty Peugeot/Citroën, sekcję „Dlaczego Gl@bcio”, wysyłkę, kontakt i stopkę. Usługi oraz realizacje mają własne moduły i automatycznie zasilają stronę główną.</p></div><button onClick={save} disabled={saving || !dirty} className="inline-flex items-center justify-center gap-2 bg-[#e0ad31] px-6 py-3 text-sm font-extrabold text-black disabled:cursor-not-allowed disabled:opacity-35"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : dirty ? "Zapisz stronę" : "Zapisano"}</button></div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[250px_1fr]">
          <aside className="h-fit border border-white/10 bg-[#0b0c0b] p-2 xl:sticky xl:top-24">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActive(id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition ${active === id ? "bg-[#dca92c]/10 font-bold text-[#e0ad31]" : "text-white/45 hover:bg-white/[0.03] hover:text-white"}`}><Icon className="h-4 w-4" />{label}</button>)}</aside>
          <div className="min-w-0"><div className="mb-4 flex items-center gap-3 border border-white/10 bg-[#0b0c0b] px-4 py-3"><currentTab.icon className="h-4 w-4 text-[#e0ad31]" /><span className="text-sm font-bold">{currentTab.label}</span></div>{renderTab()}</div>
        </div>

        <div className="sticky bottom-4 z-20 mt-6 flex flex-col gap-3 border border-white/10 bg-[#090a09]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"><div className="text-xs text-white/35">{dirty ? "Masz niezapisane zmiany na stronie głównej." : "Wszystkie zmiany są zapisane."}</div><button onClick={save} disabled={saving || !dirty} className="inline-flex items-center justify-center gap-2 bg-[#e0ad31] px-6 py-3 text-sm font-extrabold text-black disabled:opacity-35"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : "Zapisz stronę"}</button></div>
        {message && <div className="mt-4 border border-[#dca92c]/20 bg-[#dca92c]/[0.04] px-4 py-3 text-sm text-[#e8ba47]">{message}</div>}
      </div>
    </AdminPanelShell>
  );
}
