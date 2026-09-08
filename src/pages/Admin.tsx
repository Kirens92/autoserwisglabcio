import { ChangeEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  Battery,
  Cog,
  Cpu,
  Fuel,
  Gauge,
  ImagePlus,
  Monitor,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Snowflake,
  Trash2,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import AdminPanelShell from "@/components/AdminPanelShell";

type Service = {
  icon: string;
  title: string;
  description: string;
  image?: string;
  fullDescription?: string;
  faq?: string;
  items?: string[];
};

const iconList: { name: string; label: string; Icon: LucideIcon }[] = [
  { name: "Wrench", label: "Mechanika", Icon: Wrench },
  { name: "Zap", label: "Elektryka", Icon: Zap },
  { name: "Monitor", label: "Diagnostyka", Icon: Monitor },
  { name: "Fuel", label: "Paliwo / olej", Icon: Fuel },
  { name: "Cpu", label: "Sterownik ECU", Icon: Cpu },
  { name: "Cog", label: "Skrzynia biegów", Icon: Cog },
  { name: "Gauge", label: "Parametry / testy", Icon: Gauge },
  { name: "Battery", label: "Akumulator", Icon: Battery },
  { name: "Snowflake", label: "Klimatyzacja", Icon: Snowflake },
  { name: "ShieldCheck", label: "Kontrola / bezpieczeństwo", Icon: ShieldCheck },
];

const fieldClass = "w-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#dca92c]/60 focus:ring-1 focus:ring-[#dca92c]/20";
const textareaClass = `${fieldClass} resize-y leading-6`;
const blankService = (): Service => ({ icon: "Wrench", title: "", description: "", image: "", fullDescription: "", faq: "", items: [] });

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/52">{label}{hint && <small className="normal-case tracking-normal text-white/25">{hint}</small>}</span>{children}</label>;
}

export default function Admin() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [items, setItems] = useState<Service[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState("");

  const loadServices = async () => {
    const response = await fetch("/api/services", { cache: "no-store" });
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
    setDirty(false);
  };

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then(async (session) => {
        const authenticated = Boolean(session.authenticated);
        setAuth(authenticated);
        if (authenticated) await loadServices();
      })
      .catch(() => setAuth(false));
  }, []);

  const patchItems = (next: Service[]) => { setItems(next); setDirty(true); setMessage(""); };
  const update = (index: number, value: Service) => patchItems(items.map((item, itemIndex) => itemIndex === index ? value : item));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    patchItems(next);
  };

  const upload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage(`Wysyłanie grafiki ${file.name}…`);
    try {
      const response = await fetch(`/api/admin/upload?name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Nie udało się wysłać grafiki.");
      update(index, { ...items[index], image: data.image });
      setMessage("Grafika została wgrana. Zapisz usługi, aby opublikować zmianę.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się wysłać grafiki.");
    } finally {
      event.target.value = "";
    }
  };

  const save = async () => {
    if (items.some((item) => !item.title.trim() || !item.description.trim())) { setMessage("Każda usługa musi mieć tytuł i krótki opis."); return; }
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/admin/services", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(items) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Nie udało się zapisać usług.");
      setDirty(false);
      setMessage("Usługi zapisane. Teksty i grafiki są używane na /uslugi oraz /nowa-strona.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się zapisać usług.");
    } finally { setSaving(false); }
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.map((service, index) => ({ service, index })).filter(({ service }) => !needle || `${service.title} ${service.description}`.toLowerCase().includes(needle));
  }, [items, query]);

  if (auth === null) return <main className="grid min-h-screen place-items-center bg-[#070807] text-white/40">Ładowanie usług…</main>;
  if (!auth) return <main className="grid min-h-screen place-items-center bg-[#070807] p-6 text-white"><div className="w-full max-w-lg border border-[#dca92c]/20 bg-[#0b0c0b] p-8 text-center"><ShieldCheck className="mx-auto h-10 w-10 text-[#e0ad31]" /><h1 className="mt-5 text-3xl font-bold">Wymagane logowanie</h1><p className="mt-3 text-sm leading-6 text-white/40">Zarządzanie usługami jest dostępne po zalogowaniu.</p><Link to="/admin" className="mt-6 inline-flex bg-[#e0ad31] px-6 py-3 text-sm font-bold text-black">Przejdź do logowania</Link></div></main>;

  return (
    <AdminPanelShell activePath="/admin/uslugi" title="Zarządzanie usługami" eyebrow="Oferta i grafiki" previewHref="/uslugi">
      <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
          <div><div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e0ad31]">Usługi</div><h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Jedna oferta, wszystkie widoki.</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-white/40">Każda usługa może mieć własną grafikę. Pierwszych sześć pozycji automatycznie zasila karty na nowej stronie głównej.</p></div>
          <div className="flex flex-wrap gap-2"><button onClick={() => patchItems([...items, blankService()])} className="inline-flex items-center gap-2 border border-[#dca92c]/35 px-5 py-3 text-xs font-bold text-[#e0ad31]"><Plus className="h-4 w-4" />Dodaj usługę</button><button onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 bg-[#e0ad31] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-black disabled:opacity-35"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : dirty ? "Zapisz zmiany" : "Zapisano"}</button></div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <article className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">Liczba usług</div><div className="mt-3 text-3xl font-black">{items.length}</div></article>
          <article className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">Z grafiką</div><div className="mt-3 text-3xl font-black">{items.filter((item) => item.image).length}</div></article>
          <article className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">Z pełnym opisem</div><div className="mt-3 text-3xl font-black">{items.filter((item) => item.fullDescription?.trim()).length}</div></article>
          <article className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">Status</div><div className={`mt-3 text-sm font-bold ${dirty ? "text-[#e0ad31]" : "text-emerald-400"}`}>{dirty ? "Niezapisane zmiany" : "Dane aktualne"}</div></article>
        </div>

        <div className="mt-6 flex items-center gap-3 border border-white/10 bg-[#0b0c0b] px-4 py-3"><Search className="h-4 w-4 text-[#e0ad31]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj usługi…" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" /></div>

        <div className="mt-5 space-y-5">
          {visible.length === 0 && <div className="border border-dashed border-white/15 p-12 text-center text-sm text-white/35">Nie znaleziono usług.</div>}
          {visible.map(({ service, index }) => {
            const selected = iconList.find((item) => item.name === service.icon) || iconList[0];
            const Icon = selected.Icon;
            return (
              <section key={`${index}-${service.title}`} className="border border-white/10 bg-[#0b0c0b]">
                <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"><div className="flex min-w-0 items-center gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center border border-[#dca92c]/25 bg-[#dca92c]/[0.05] text-[#e0ad31]"><Icon className="h-5 w-5" /></div><div className="min-w-0"><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e0ad31]">Usługa {index + 1}</div><div className="mt-1 truncate font-bold">{service.title || "Nowa usługa"}</div></div></div><div className="flex items-center gap-2"><button onClick={() => move(index, -1)} disabled={index === 0} className="border border-white/10 p-2 text-white/45 disabled:opacity-20"><ArrowUp className="h-4 w-4" /></button><button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="border border-white/10 p-2 text-white/45 disabled:opacity-20"><ArrowDown className="h-4 w-4" /></button><button onClick={() => patchItems(items.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex items-center gap-2 border border-red-500/15 px-3 py-2 text-xs text-red-300"><Trash2 className="h-4 w-4" />Usuń</button></div></div>

                <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
                  <Field label="Tytuł"><input value={service.title} onChange={(e) => update(index, { ...service, title: e.target.value })} className={fieldClass} /></Field>
                  <Field label="Ikona"><select value={service.icon} onChange={(e) => update(index, { ...service, icon: e.target.value })} className={fieldClass}>{iconList.map((item) => <option key={item.name} value={item.name}>{item.label}</option>)}</select></Field>
                  <div className="lg:col-span-2"><Field label="Grafika usługi" hint="widoczna na stronie głównej"><div className="grid gap-4 border border-white/10 bg-black/20 p-4 md:grid-cols-[220px_1fr]"><div className="flex min-h-32 items-center justify-center overflow-hidden bg-black/30">{service.image ? <img src={service.image} alt={service.title} className="h-40 w-full object-cover" /> : <span className="px-4 text-center text-xs text-white/25">Brak własnej grafiki — strona użyje grafiki domyślnej.</span>}</div><div className="space-y-3"><div className="flex flex-wrap gap-2"><label className="inline-flex cursor-pointer items-center gap-2 border border-[#dca92c]/30 px-4 py-2.5 text-xs font-bold text-[#e0ad31]"><ImagePlus className="h-4 w-4" />Wgraj grafikę<input type="file" accept="image/*" onChange={(e) => upload(index, e)} className="hidden" /></label>{service.image && <button onClick={() => update(index, { ...service, image: "" })} className="border border-red-500/15 px-4 py-2.5 text-xs text-red-300">Usuń grafikę</button>}</div><input value={service.image || ""} onChange={(e) => update(index, { ...service, image: e.target.value })} className={fieldClass} placeholder="/uploads/... lub https://..." /></div></div></Field></div>
                  <div className="lg:col-span-2"><Field label="Krótki opis" hint="widoczny na kafelku"><textarea value={service.description} onChange={(e) => update(index, { ...service, description: e.target.value })} className={`${textareaClass} min-h-24`} /></Field></div>
                  <div className="lg:col-span-2"><Field label="Zakres usługi" hint="jedna pozycja w wierszu"><textarea value={(service.items || []).join("\n")} onChange={(e) => update(index, { ...service, items: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })} className={`${textareaClass} min-h-28`} /></Field></div>
                  <div className="lg:col-span-2"><Field label="Pełny opis"><textarea value={service.fullDescription || ""} onChange={(e) => update(index, { ...service, fullDescription: e.target.value })} className={`${textareaClass} min-h-40`} /></Field></div>
                  <div className="lg:col-span-2"><Field label="FAQ / informacje dodatkowe" hint="Pytanie | Odpowiedź"><textarea value={service.faq || ""} onChange={(e) => update(index, { ...service, faq: e.target.value })} className={`${textareaClass} min-h-28`} /></Field></div>
                </div>
              </section>
            );
          })}
        </div>

        <div className="sticky bottom-4 z-20 mt-6 flex flex-col gap-3 border border-white/10 bg-[#090a09]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"><div className="text-xs text-white/35">{dirty ? "Masz niezapisane zmiany w ofercie." : "Wszystkie zmiany są zapisane."}</div><button onClick={save} disabled={saving || !dirty} className="inline-flex items-center justify-center gap-2 bg-[#e0ad31] px-6 py-3 text-sm font-extrabold text-black disabled:opacity-35"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : "Zapisz usługi"}</button></div>
        {message && <div className="mt-4 border border-[#dca92c]/20 bg-[#dca92c]/[0.04] px-4 py-3 text-sm text-[#e8ba47]">{message}</div>}
      </div>
    </AdminPanelShell>
  );
}
