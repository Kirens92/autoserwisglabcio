import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ImagePlus, LayoutDashboard, Plus, Save, Trash2 } from "lucide-react";

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  clientReport: string;
  diagnosis: string;
  image: string;
  createdAt: string;
};

const blank = (): Realization => ({ slug: "", title: "", excerpt: "", content: "", clientReport: "", diagnosis: "", image: "", createdAt: new Date().toISOString() });
const fieldClass = "w-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-primary/60 focus:ring-1 focus:ring-primary/20";

export default function AdminRealizations() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [items, setItems] = useState<Realization[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((session) => {
        setAuth(Boolean(session.authenticated));
        if (session.authenticated) fetch("/api/realizations", { cache: "no-store" }).then((r) => r.json()).then(setItems);
      })
      .catch(() => setAuth(false));
  }, []);

  const update = (index: number, key: keyof Realization, value: string) => setItems(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));

  const upload = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("Wysyłanie zdjęcia…");
    const response = await fetch(`/api/admin/upload?name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
    const data = await response.json();
    if (response.ok) {
      update(index, "image", data.image);
      setMessage("Zdjęcie zostało wgrane.");
    } else setMessage(data.message || "Błąd wysyłania zdjęcia.");
  };

  const save = async () => {
    setSaving(true);
    const response = await fetch("/api/admin/realizations", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(items) });
    setMessage(response.ok ? "Realizacje zostały zapisane." : "Nie udało się zapisać realizacji.");
    setSaving(false);
  };

  if (auth === null) return <main className="grid min-h-screen place-items-center bg-[#070707] text-white/40">Ładowanie panelu…</main>;
  if (!auth) return <main className="grid min-h-screen place-items-center bg-[#070707] p-6 text-white"><div className="border border-primary/20 bg-[#0b0b0b] p-8 text-center"><h1 className="text-2xl font-bold">Wymagane logowanie</h1><Link to="/admin" className="mt-5 inline-block bg-gradient-gold px-6 py-3 text-sm font-bold text-black">Przejdź do logowania</Link></div></main>;

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070707]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center border border-primary/30 bg-primary/[0.06] text-primary"><LayoutDashboard className="h-4 w-4" /></div><div><div className="text-sm font-bold">Gl@bcio CMS</div><div className="text-[10px] uppercase tracking-[0.16em] text-white/30">Realizacje</div></div></div>
          <a href="/realizacje" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-xs text-white/55 hover:border-primary/40 hover:text-primary"><Eye className="h-4 w-4" />Podgląd</a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div><div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Panel administratora</div><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Realizacje warsztatu</h1><p className="mt-3 text-sm text-white/40">Dodawaj opisy napraw, diagnozy i zdjęcia wykonanych realizacji.</p></div>
          <nav className="flex border border-white/10 p-1 text-xs"><Link to="/admin/strona" className="px-4 py-2.5 text-white/45 hover:text-white">Strona</Link><Link to="/admin" className="px-4 py-2.5 text-white/45 hover:text-white">Usługi</Link><Link to="/admin/realizacje" className="bg-primary px-4 py-2.5 font-bold text-black">Realizacje</Link></nav>
        </div>

        <div className="space-y-5">
          {items.length === 0 && <div className="border border-dashed border-white/15 p-10 text-center text-sm text-white/35">Brak realizacji. Dodaj pierwszą realizację przyciskiem poniżej.</div>}
          {items.map((item, index) => (
            <section key={`${item.slug}-${index}`} className="border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5"><div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Realizacja {index + 1}</div><div className="mt-1 font-bold">{item.title || "Nowa realizacja"}</div></div><button onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex items-center gap-2 text-xs text-red-300"><Trash2 className="h-4 w-4" />Usuń</button></div>
              <div className="grid gap-5 md:grid-cols-2">
                <input value={item.title} onChange={(e) => update(index, "title", e.target.value)} placeholder="Tytuł realizacji" className={fieldClass} />
                <input value={item.slug} onChange={(e) => update(index, "slug", e.target.value)} placeholder="slug-np-peugeot-308-diagnostyka" className={fieldClass} />
              </div>
              <div className="mt-5 space-y-5">
                <textarea value={item.excerpt} onChange={(e) => update(index, "excerpt", e.target.value)} placeholder="Krótki opis do listy realizacji" className={`${fieldClass} min-h-20 resize-y`} />
                <div className="grid gap-5 md:grid-cols-2"><textarea value={item.clientReport} onChange={(e) => update(index, "clientReport", e.target.value)} placeholder="Zgłoszenie klienta" className={`${fieldClass} min-h-28 resize-y`} /><textarea value={item.diagnosis} onChange={(e) => update(index, "diagnosis", e.target.value)} placeholder="Diagnoza" className={`${fieldClass} min-h-28 resize-y`} /></div>
                <textarea value={item.content} onChange={(e) => update(index, "content", e.target.value)} placeholder="Pełny opis wykonanej naprawy" className={`${fieldClass} min-h-40 resize-y`} />
                <div className="border border-white/10 bg-black/20 p-4"><label className="inline-flex cursor-pointer items-center gap-2 border border-primary/30 px-4 py-2 text-xs font-bold text-primary"><ImagePlus className="h-4 w-4" />Wgraj zdjęcie<input type="file" accept="image/*" onChange={(e) => upload(index, e)} className="hidden" /></label>{item.image && <div className="mt-4"><img src={item.image} alt="Podgląd realizacji" className="max-h-56 max-w-full border border-white/10 object-cover" /></div>}</div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><button onClick={() => setItems([...items, blank()])} className="inline-flex items-center justify-center gap-2 border border-primary/30 px-5 py-3 text-sm font-bold text-primary"><Plus className="h-4 w-4" />Dodaj realizację</button><button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 bg-gradient-gold px-6 py-3 text-sm font-extrabold text-black disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : "Zapisz realizacje"}</button></div>
        {message && <div className="mt-5 border border-primary/15 bg-primary/[0.04] px-4 py-3 text-sm text-primary">{message}</div>}
      </div>
    </main>
  );
}
