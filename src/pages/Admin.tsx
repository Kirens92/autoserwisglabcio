import { FormEvent, useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Battery,
  Cog,
  Cpu,
  Eye,
  Fuel,
  Gauge,
  LayoutDashboard,
  LogOut,
  Monitor,
  Plus,
  Save,
  Snowflake,
  Trash2,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/nowelogobg.png";

type Service = {
  icon: string;
  title: string;
  description: string;
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
];

const fieldClass = "w-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-primary/60 focus:ring-1 focus:ring-primary/20";
const empty = (): Service => ({ icon: "Wrench", title: "", description: "", fullDescription: "", faq: "", items: [] });

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">{label}</span>{children}</label>;
}

export default function Admin() {
  const [auth, setAuth] = useState(false);
  const [checked, setChecked] = useState(false);
  const [items, setItems] = useState<Service[]>([]);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const loadServices = () => fetch("/api/services", { cache: "no-store" }).then((r) => r.json()).then(setItems);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => {
        setAuth(Boolean(data.authenticated));
        setChecked(true);
        if (data.authenticated) loadServices();
      })
      .catch(() => setChecked(true));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    if (response.ok) {
      setAuth(true);
      setPassword("");
      await loadServices();
    } else {
      setMessage("Nieprawidłowy login lub hasło.");
    }
  };

  const update = (index: number, value: Service) => setItems(items.map((item, itemIndex) => itemIndex === index ? value : item));

  const save = async () => {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/services", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(items),
    });
    setMessage(response.ok ? "Usługi zostały zapisane." : "Nie udało się zapisać usług.");
    setSaving(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth(false);
    setItems([]);
  };

  if (!checked) return <main className="grid min-h-screen place-items-center bg-[#070707] text-white/40">Ładowanie panelu…</main>;

  if (!auth) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#070707] p-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(214,165,52,.12),transparent_28%),linear-gradient(135deg,#070707,#0b0b0b_55%,#050505)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:52px_52px]" />
        <form onSubmit={submit} className="relative w-full max-w-md border border-primary/20 bg-[#0a0a0a]/95 p-7 shadow-[0_30px_100px_rgba(0,0,0,.55)] sm:p-9">
          <img src={logo} alt="Auto Serwis Gl@bcio" className="h-16 w-auto" />
          <div className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Panel administracyjny</div>
          <h1 className="mt-3 text-3xl font-bold">Gl@bcio CMS</h1>
          <p className="mt-3 text-sm leading-6 text-white/40">Zaloguj się, aby zarządzać stroną, usługami, realizacjami i SEO.</p>
          <div className="mt-7 space-y-4">
            <Field label="Login"><input required autoComplete="username" value={login} onChange={(e) => setLogin(e.target.value)} className={fieldClass} placeholder="Login administratora" /></Field>
            <Field label="Hasło"><input required autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} placeholder="••••••••" /></Field>
          </div>
          <button className="mt-6 w-full bg-gradient-gold px-5 py-3.5 text-sm font-extrabold text-black transition hover:brightness-110">Zaloguj do panelu</button>
          {message && <p className="mt-4 text-sm text-red-300">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070707]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center border border-primary/30 bg-primary/[0.06] text-primary"><LayoutDashboard className="h-4 w-4" /></div>
            <div><div className="text-sm font-bold">Gl@bcio CMS</div><div className="text-[10px] uppercase tracking-[0.16em] text-white/30">Usługi</div></div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/nowa-strona" target="_blank" rel="noreferrer" className="hidden items-center gap-2 border border-white/10 px-4 py-2 text-xs text-white/55 hover:border-primary/40 hover:text-primary sm:inline-flex"><Eye className="h-4 w-4" />Podgląd</a>
            <button onClick={logout} className="inline-flex items-center gap-2 border border-white/10 px-4 py-2 text-xs text-white/45 hover:text-white"><LogOut className="h-4 w-4" />Wyloguj</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div><div className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Panel administratora</div><h1 className="mt-2 text-3xl font-bold sm:text-4xl">Zarządzanie usługami</h1><p className="mt-3 text-sm text-white/40">Pełne opisy usług wykorzystywane na podstronie oferty.</p></div>
          <nav className="flex border border-white/10 p-1 text-xs">
            <Link to="/admin/strona" className="px-4 py-2.5 text-white/45 hover:text-white">Strona</Link>
            <Link to="/admin" className="bg-primary px-4 py-2.5 font-bold text-black">Usługi</Link>
            <Link to="/admin/realizacje" className="px-4 py-2.5 text-white/45 hover:text-white">Realizacje</Link>
          </nav>
        </div>

        <div className="space-y-5">
          {items.map((service, index) => {
            const selected = iconList.find((item) => item.name === service.icon) || iconList[0];
            const Icon = selected.Icon;
            return (
              <section key={index} className="border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
                <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-4"><div className="grid h-11 w-11 place-items-center border border-primary/25 bg-primary/[0.05] text-primary"><Icon className="h-5 w-5" /></div><div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Usługa {index + 1}</div><div className="mt-1 font-bold">{service.title || "Nowa usługa"}</div></div></div>
                  <button onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex items-center gap-2 text-xs text-red-300"><Trash2 className="h-4 w-4" />Usuń</button>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Tytuł"><input value={service.title} onChange={(e) => update(index, { ...service, title: e.target.value })} className={fieldClass} /></Field>
                  <Field label="Ikona"><select value={service.icon} onChange={(e) => update(index, { ...service, icon: e.target.value })} className={fieldClass}>{iconList.map((item) => <option key={item.name} value={item.name}>{item.label}</option>)}</select></Field>
                </div>
                <div className="mt-5 space-y-5">
                  <Field label="Krótki opis"><textarea value={service.description} onChange={(e) => update(index, { ...service, description: e.target.value })} className={`${fieldClass} min-h-24 resize-y`} /></Field>
                  <Field label="Pełny opis usługi"><textarea value={service.fullDescription || ""} onChange={(e) => update(index, { ...service, fullDescription: e.target.value })} className={`${fieldClass} min-h-40 resize-y`} /></Field>
                  <Field label="FAQ / informacje dodatkowe"><textarea value={service.faq || ""} onChange={(e) => update(index, { ...service, faq: e.target.value })} placeholder="Pytania i odpowiedzi lub dodatkowe informacje" className={`${fieldClass} min-h-28 resize-y`} /></Field>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={() => setItems([...items, empty()])} className="inline-flex items-center justify-center gap-2 border border-primary/30 px-5 py-3 text-sm font-bold text-primary"><Plus className="h-4 w-4" />Dodaj usługę</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 bg-gradient-gold px-6 py-3 text-sm font-extrabold text-black disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : "Zapisz usługi"}</button>
        </div>
        {message && <div className="mt-5 border border-primary/15 bg-primary/[0.04] px-4 py-3 text-sm text-primary">{message}</div>}
      </div>
    </main>
  );
}
