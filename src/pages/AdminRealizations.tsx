import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Cpu, FileText, ImagePlus, Plus, Save, Search, ShieldCheck, Trash2, Wrench } from "lucide-react";
import AdminPanelShell from "@/components/AdminPanelShell";

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  clientReport: string;
  diagnosis: string;
  image: string;
  images?: string[];
  createdAt: string;
  category?: string;
};

type StringField = Exclude<keyof Realization, "images">;

const MAX_IMAGES = 12;

const blank = (): Realization => ({
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  clientReport: "",
  diagnosis: "",
  image: "",
  images: [],
  createdAt: new Date().toISOString(),
  category: "ogolne",
});

const fieldClass = "w-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#dca92c]/60 focus:ring-1 focus:ring-[#dca92c]/20";
const textareaClass = `${fieldClass} resize-y leading-6`;

const categories = [
  ["ogolne", "Ogólna"],
  ["ecu-tcu", "ECU / TCU"],
  ["peugeot", "Peugeot"],
  ["citroen", "Citroën"],
  ["diagnostyka", "Diagnostyka"],
  ["mechanika", "Mechanika"],
] as const;

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/52">
        {label}
        {hint && <small className="normal-case tracking-normal text-white/25">{hint}</small>}
      </span>
      {children}
    </label>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function normalizeRealization(item: Realization): Realization {
  const images = Array.from(
    new Set(
      [item.image, ...(Array.isArray(item.images) ? item.images : [])].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  ).slice(0, MAX_IMAGES);

  return {
    ...item,
    image: images[0] || "",
    images,
  };
}

function imagesFor(item: Realization) {
  return Array.from(
    new Set(
      [item.image, ...(Array.isArray(item.images) ? item.images : [])].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  ).slice(0, MAX_IMAGES);
}

export default function AdminRealizations() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [items, setItems] = useState<Realization[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const load = async () => {
    const response = await fetch("/api/realizations", { cache: "no-store" });
    const data = await response.json();
    setItems(Array.isArray(data) ? data.map(normalizeRealization) : []);
    setDirty(false);
  };

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then(async (session) => {
        const authenticated = Boolean(session.authenticated);
        setAuth(authenticated);
        if (authenticated) await load();
      })
      .catch(() => setAuth(false));
  }, []);

  const patchItems = (next: Realization[]) => {
    setItems(next);
    setDirty(true);
    setMessage("");
  };

  const update = (index: number, key: StringField, value: string) => {
    patchItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  };

  const updateTitle = (index: number, value: string) => {
    const current = items[index];
    const shouldUpdateSlug = !current.slug || current.slug === slugify(current.title);
    patchItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, title: value, slug: shouldUpdateSlug ? slugify(value) : item.slug } : item));
  };

  const setImages = (index: number, nextImages: string[]) => {
    const images = Array.from(new Set(nextImages.filter(Boolean))).slice(0, MAX_IMAGES);
    patchItems(
      items.map((item, itemIndex) => itemIndex === index
        ? { ...item, image: images[0] || "", images }
        : item),
    );
  };

  const removeImage = (index: number, image: string) => {
    setImages(index, imagesFor(items[index]).filter((entry) => entry !== image));
  };

  const makeCover = (index: number, image: string) => {
    const current = imagesFor(items[index]);
    setImages(index, [image, ...current.filter((entry) => entry !== image)]);
  };

  const upload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const current = imagesFor(items[index]);
    const selected = Array.from(event.target.files || []).slice(0, Math.max(0, MAX_IMAGES - current.length));

    if (!selected.length) {
      setMessage(current.length >= MAX_IMAGES ? `Ta realizacja ma już maksymalną liczbę ${MAX_IMAGES} zdjęć.` : "Nie wybrano zdjęć.");
      event.target.value = "";
      return;
    }

    setMessage(`Wysyłanie ${selected.length} ${selected.length === 1 ? "zdjęcia" : "zdjęć"}…`);

    try {
      const uploaded: string[] = [];

      for (const file of selected) {
        const response = await fetch(`/api/admin/upload?name=${encodeURIComponent(file.name)}`, {
          method: "POST",
          body: file,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `Błąd wysyłania pliku ${file.name}.`);
        uploaded.push(data.image);
      }

      const next = [...current, ...uploaded].slice(0, MAX_IMAGES);
      const normalized = Array.from(new Set(next));
      setItems((previous) => previous.map((item, itemIndex) => itemIndex === index
        ? { ...item, image: normalized[0] || "", images: normalized }
        : item));
      setDirty(true);
      setMessage(`Wgrano ${uploaded.length} ${uploaded.length === 1 ? "zdjęcie" : "zdjęcia"}. Łącznie: ${normalized.length}/${MAX_IMAGES}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Błąd wysyłania zdjęć.");
    } finally {
      event.target.value = "";
    }
  };

  const save = async () => {
    const invalid = items.find((item) => !item.title.trim() || !item.slug.trim() || !item.excerpt.trim());
    if (invalid) {
      setMessage("Każda realizacja musi mieć tytuł, slug i krótki opis.");
      return;
    }

    const duplicated = items.some((item, index) => items.findIndex((other) => other.slug === item.slug) !== index);
    if (duplicated) {
      setMessage("Slug realizacji musi być unikalny.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = items.map(normalizeRealization);
      const response = await fetch("/api/admin/realizations", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Nie udało się zapisać realizacji.");
      setItems(payload);
      setDirty(false);
      setMessage("Realizacje zostały zapisane. Galerie obsługują do 12 zdjęć, a pierwsze zdjęcie jest zdjęciem głównym.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się zapisać realizacji.");
    } finally {
      setSaving(false);
    }
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => category === "all" || (item.category || "ogolne") === category)
      .filter(({ item }) => !needle || `${item.title} ${item.excerpt} ${item.diagnosis}`.toLowerCase().includes(needle));
  }, [items, query, category]);

  if (auth === null) return <main className="grid min-h-screen place-items-center bg-[#070807] text-white/40">Ładowanie realizacji…</main>;

  if (!auth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070807] p-6 text-white">
        <div className="w-full max-w-lg border border-[#dca92c]/20 bg-[#0b0c0b] p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-[#e0ad31]" />
          <h1 className="mt-5 text-3xl font-bold">Wymagane logowanie</h1>
          <p className="mt-3 text-sm leading-6 text-white/40">Zarządzanie realizacjami jest dostępne po zalogowaniu do panelu administratora.</p>
          <Link to="/admin" className="mt-6 inline-flex bg-[#e0ad31] px-6 py-3 text-sm font-bold text-black">Przejdź do logowania</Link>
        </div>
      </main>
    );
  }

  return (
    <AdminPanelShell activePath="/admin/realizacje" title="Zarządzanie realizacjami" eyebrow="Portfolio warsztatu" previewHref="/realizacje">
      <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e0ad31]">Realizacje</div>
            <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Naprawy zarządzane z jednego miejsca.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/40">Dodawaj do 12 zdjęć do jednej realizacji, zgłoszenie klienta, diagnozę i opis naprawy. Pierwsze zdjęcie jest używane jako okładka na listach.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => patchItems([blank(), ...items])} className="inline-flex items-center gap-2 border border-[#dca92c]/35 px-5 py-3 text-xs font-bold text-[#e0ad31]"><Plus className="h-4 w-4" />Dodaj realizację</button>
            <button type="button" onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 bg-[#e0ad31] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-black disabled:cursor-not-allowed disabled:opacity-35"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : dirty ? "Zapisz zmiany" : "Zapisano"}</button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">Wszystkie</div><div className="mt-3 text-3xl font-black">{items.length}</div></article>
          <article className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">ECU / TCU</div><div className="mt-3 text-3xl font-black">{items.filter((item) => item.category === "ecu-tcu").length}</div></article>
          <article className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">Ze zdjęciami</div><div className="mt-3 text-3xl font-black">{items.filter((item) => imagesFor(item).length > 0).length}</div></article>
          <article className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">Status</div><div className={`mt-3 text-sm font-bold ${dirty ? "text-[#e0ad31]" : "text-emerald-400"}`}>{dirty ? "Niezapisane zmiany" : "Dane aktualne"}</div></article>
        </div>

        <div className="mt-6 grid gap-3 border border-white/10 bg-[#0b0c0b] p-3 md:grid-cols-[1fr_230px]">
          <div className="flex items-center gap-3 px-2">
            <Search className="h-4 w-4 text-[#e0ad31]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Szukaj po tytule, opisie lub diagnozie…" className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/25" />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass}>
            <option value="all">Wszystkie kategorie</option>
            {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>

        <div className="mt-5 space-y-5">
          {visible.length === 0 && <div className="border border-dashed border-white/15 p-12 text-center text-sm text-white/35">Brak realizacji pasujących do filtrów.</div>}

          {visible.map(({ item, index }) => {
            const gallery = imagesFor(item);
            const cover = gallery[0];

            return (
              <section key={`${item.slug}-${index}`} className="overflow-hidden border border-white/10 bg-[#0b0c0b]">
                <div className="grid lg:grid-cols-[260px_1fr]">
                  <div className="border-b border-white/10 bg-black/25 lg:border-b-0 lg:border-r">
                    {cover ? (
                      <img src={cover} alt={item.title || "Podgląd realizacji"} className="h-56 w-full object-cover lg:h-full lg:min-h-[250px]" />
                    ) : (
                      <div className="grid h-56 place-items-center text-white/18 lg:h-full lg:min-h-[250px]"><Wrench className="h-12 w-12" /></div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#e0ad31]">{item.category === "ecu-tcu" ? <Cpu className="h-4 w-4" /> : <FileText className="h-4 w-4" />}Realizacja {index + 1}</div>
                        <div className="mt-1 truncate font-bold">{item.title || "Nowa realizacja"}</div>
                      </div>
                      <button type="button" onClick={() => patchItems(items.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex items-center gap-2 self-start border border-red-500/15 px-3 py-2 text-xs text-red-300 sm:self-auto"><Trash2 className="h-4 w-4" />Usuń</button>
                    </div>

                    <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
                      <Field label="Tytuł"><input value={item.title} onChange={(e) => updateTitle(index, e.target.value)} placeholder="Np. Peugeot 308 — naprawa sterownika" className={fieldClass} /></Field>
                      <Field label="Slug" hint="adres realizacji"><input value={item.slug} onChange={(e) => update(index, "slug", slugify(e.target.value))} placeholder="peugeot-308-naprawa-sterownika" className={fieldClass} /></Field>
                      <Field label="Kategoria"><select value={item.category || "ogolne"} onChange={(e) => update(index, "category", e.target.value)} className={fieldClass}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
                      <Field label="Data publikacji"><input type="datetime-local" value={item.createdAt ? item.createdAt.slice(0, 16) : ""} onChange={(e) => update(index, "createdAt", e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString())} className={fieldClass} /></Field>
                      <div className="lg:col-span-2"><Field label="Krótki opis" hint="karta na liście"><textarea value={item.excerpt} onChange={(e) => update(index, "excerpt", e.target.value)} className={`${textareaClass} min-h-24`} /></Field></div>
                      <Field label="Zgłoszenie klienta"><textarea value={item.clientReport || ""} onChange={(e) => update(index, "clientReport", e.target.value)} className={`${textareaClass} min-h-28`} /></Field>
                      <Field label="Diagnoza"><textarea value={item.diagnosis || ""} onChange={(e) => update(index, "diagnosis", e.target.value)} className={`${textareaClass} min-h-28`} /></Field>
                      <div className="lg:col-span-2"><Field label="Pełny opis wykonanych prac"><textarea value={item.content || ""} onChange={(e) => update(index, "content", e.target.value)} className={`${textareaClass} min-h-40`} /></Field></div>

                      <div className="lg:col-span-2">
                        <div className="border border-white/10 bg-black/20 p-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <label className={`inline-flex items-center gap-2 border border-[#dca92c]/30 px-4 py-2.5 text-xs font-bold text-[#e0ad31] ${gallery.length >= MAX_IMAGES ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
                              <ImagePlus className="h-4 w-4" />
                              Wgraj zdjęcia
                              <input type="file" accept="image/*" multiple disabled={gallery.length >= MAX_IMAGES} onChange={(e) => upload(index, e)} className="hidden" />
                            </label>
                            <span className="text-xs text-white/35">{gallery.length}/{MAX_IMAGES} zdjęć</span>
                            <span className="text-xs text-white/25">Możesz zaznaczyć kilka plików jednocześnie.</span>
                          </div>

                          {gallery.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                              {gallery.map((image, imageIndex) => (
                                <div key={`${image}-${imageIndex}`} className="overflow-hidden border border-white/10 bg-black/40">
                                  <img src={image} alt={`${item.title || "Realizacja"} — zdjęcie ${imageIndex + 1}`} className="aspect-[4/3] w-full object-cover" />
                                  <div className="flex min-h-10 items-center justify-between gap-2 border-t border-white/10 px-2 py-2">
                                    {imageIndex === 0 ? (
                                      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#e0ad31]">Główne</span>
                                    ) : (
                                      <button type="button" onClick={() => makeCover(index, image)} className="text-[9px] font-semibold text-white/45 hover:text-[#e0ad31]">Ustaw główne</button>
                                    )}
                                    <button type="button" onClick={() => removeImage(index, image)} className="text-red-300/70 hover:text-red-300" aria-label={`Usuń zdjęcie ${imageIndex + 1}`}><Trash2 className="h-3.5 w-3.5" /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {item.category === "ecu-tcu" && <div className="border-t border-[#dca92c]/18 bg-[#dca92c]/[0.035] px-5 py-3 text-xs text-[#e0ad31] sm:px-7">Ta realizacja jest automatycznie pobierana także przez sekcję „Realizacje ECU / TCU”.</div>}
              </section>
            );
          })}
        </div>

        <div className="sticky bottom-4 z-20 mt-6 flex flex-col gap-3 border border-white/10 bg-[#090a09]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/35">{dirty ? "Masz niezapisane zmiany w realizacjach." : "Wszystkie zmiany są zapisane."}</div>
          <button type="button" onClick={save} disabled={saving || !dirty} className="inline-flex items-center justify-center gap-2 bg-[#e0ad31] px-6 py-3 text-sm font-extrabold text-black disabled:opacity-35"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : "Zapisz realizacje"}</button>
        </div>

        {message && <div className="mt-4 border border-[#dca92c]/20 bg-[#dca92c]/[0.04] px-4 py-3 text-sm text-[#e8ba47]">{message}</div>}
      </div>
    </AdminPanelShell>
  );
}
