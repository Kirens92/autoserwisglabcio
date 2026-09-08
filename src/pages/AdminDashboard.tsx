import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Cpu,
  Eye,
  FileText,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Search,
  Settings,
  Star,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/nowelogobg.png";

type Stat = { label: string; value: string; note: string; Icon: LucideIcon };

const fieldClass = "w-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#dca92c]/60 focus:ring-1 focus:ring-[#dca92c]/20";

const sideItems = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/strona", "Strona główna", FileText],
  ["/admin/ecu-tcu", "ECU | TCU", Cpu],
  ["/admin/uslugi", "Usługi", Wrench],
  ["/admin/realizacje", "Realizacje", ImagePlus],
  ["/admin/opinie", "Opinie Google", Star],
  ["/admin/seo", "SEO", BarChart3],
  ["/admin/ustawienia", "Ustawienia", Settings],
] as const;

export default function AdminDashboard() {
  const [checked, setChecked] = useState(false);
  const [auth, setAuth] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [serviceCount, setServiceCount] = useState(0);
  const [realizationCount, setRealizationCount] = useState(0);
  const [rating, setRating] = useState<string>("—");
  const [reviewCount, setReviewCount] = useState<string>("—");

  const loadStats = async () => {
    const [services, realizations, reviews] = await Promise.allSettled([
      fetch("/api/services", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/realizations", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/google-reviews", { cache: "no-store" }).then((r) => r.json()),
    ]);
    if (services.status === "fulfilled" && Array.isArray(services.value)) setServiceCount(services.value.length);
    if (realizations.status === "fulfilled" && Array.isArray(realizations.value)) setRealizationCount(realizations.value.length);
    if (reviews.status === "fulfilled") {
      if (typeof reviews.value?.rating === "number") setRating(reviews.value.rating.toFixed(1).replace(".", ","));
      if (typeof reviews.value?.reviewCount === "number") setReviewCount(String(reviews.value.reviewCount));
    }
  };

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => {
        setAuth(Boolean(data.authenticated));
        setChecked(true);
        if (data.authenticated) loadStats();
      })
      .catch(() => setChecked(true));
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ login, password }) });
    if (!response.ok) {
      setMessage("Nieprawidłowy login lub hasło.");
      return;
    }
    setAuth(true);
    setPassword("");
    loadStats();
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth(false);
  };

  if (!checked) return <main className="grid min-h-screen place-items-center bg-[#070807] text-white/40">Ładowanie panelu…</main>;

  if (!auth) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#070807] p-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(220,169,44,.12),transparent_28%),linear-gradient(140deg,#070807,#0b0c0b_55%,#050605)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:58px_58px]" />
        <form onSubmit={submit} className="relative w-full max-w-md border border-[#dca92c]/25 bg-[#090a09]/96 p-8 shadow-[0_35px_120px_rgba(0,0,0,.65)] sm:p-10">
          <img src={logo} alt="Auto Serwis Gl@bcio" className="h-16 w-auto" />
          <div className="mt-8 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e0ad31]">Panel administratora</div>
          <h1 className="mt-3 font-serif text-4xl font-semibold">Gl@bcio CMS</h1>
          <p className="mt-3 text-sm leading-6 text-white/38">Zarządzaj stroną główną, ECU/TCU, usługami, realizacjami i SEO z jednego miejsca.</p>
          <div className="mt-7 space-y-4">
            <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Login</span><input required autoComplete="username" value={login} onChange={(e) => setLogin(e.target.value)} className={fieldClass} placeholder="Login administratora" /></label>
            <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Hasło</span><input required autoComplete="current-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} placeholder="••••••••" /></label>
          </div>
          <button className="mt-6 w-full bg-[#e0ad31] px-5 py-3.5 text-sm font-extrabold text-black transition hover:bg-[#f0c354]">Zaloguj do panelu</button>
          {message && <p className="mt-4 text-sm text-red-300">{message}</p>}
        </form>
      </main>
    );
  }

  const stats: Stat[] = [
    { label: "Usługi", value: String(serviceCount), note: "Aktywne pozycje oferty", Icon: Wrench },
    { label: "Realizacje", value: String(realizationCount), note: "Opublikowane wpisy", Icon: ImagePlus },
    { label: "Ocena Google", value: rating, note: "Aktualna średnia ocena", Icon: Star },
    { label: "Opinie Google", value: reviewCount, note: "Liczba opinii w profilu", Icon: MessageSquareText },
  ];

  return (
    <main className="min-h-screen bg-[#070807] text-white">
      <div className="grid min-h-screen xl:grid-cols-[230px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#090a09] xl:flex xl:flex-col">
          <div className="border-b border-white/10 px-6 py-5"><img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto" /><div className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">Panel Administratora</div></div>
          <nav className="flex-1 space-y-1 p-3">{sideItems.map(([href, label, Icon]) => <Link key={href} to={href} className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition ${href === "/admin" ? "border border-[#dca92c]/35 bg-[#dca92c]/10 font-bold text-[#e6b43a]" : "text-white/48 hover:bg-white/[0.035] hover:text-white"}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
          <div className="border-t border-white/10 p-5"><div className="text-xs font-bold">Auto Serwis Gl@bcio</div><div className="mt-1 text-[10px] text-white/25">CMS · v2</div></div>
        </aside>

        <section>
          <header className="sticky top-0 z-40 flex min-h-[70px] items-center justify-between gap-4 border-b border-white/10 bg-[#090a09]/96 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div><div className="text-lg font-bold">Panel Administratora</div><div className="text-[10px] uppercase tracking-[0.16em] text-white/28">Dashboard</div></div>
            <div className="flex items-center gap-2"><a href="/nowa-strona" target="_blank" rel="noreferrer" className="hidden items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white/55 hover:border-[#dca92c]/40 hover:text-[#dca92c] sm:inline-flex"><Eye className="h-4 w-4" />Podgląd strony</a><button onClick={logout} className="inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white/45 hover:text-white"><LogOut className="h-4 w-4" />Wyloguj</button></div>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
            <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e0ad31]">Centrum zarządzania</div><h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Wszystko w jednym panelu.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">Edytuj stronę, specjalizację ECU/TCU, usługi, realizacje i dane SEO bez dotykania kodu.</p></div><div className="flex flex-wrap gap-2"><Link to="/admin/ecu-tcu" className="inline-flex items-center gap-2 bg-[#e0ad31] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-black"><Cpu className="h-4 w-4" />Edytuj ECU / TCU</Link><Link to="/admin/realizacje" className="inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-xs font-bold text-white/60"><ImagePlus className="h-4 w-4" />Dodaj realizację</Link></div></div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, note, Icon }) => <article key={label} className="border border-white/10 bg-[#0b0c0b] p-5"><div className="flex items-center justify-between"><div className="text-[9px] font-bold uppercase tracking-[0.17em] text-white/28">{label}</div><Icon className="h-5 w-5 text-[#e0ad31]" /></div><div className="mt-4 text-3xl font-black text-white">{value}</div><div className="mt-2 text-xs text-white/30">{note}</div></article>)}</div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
              <section className="border border-white/10 bg-[#0b0c0b] p-5 sm:p-7"><div className="flex items-center justify-between"><div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e0ad31]">Szybkie akcje</div><h2 className="mt-2 text-2xl font-bold">Najczęściej używane</h2></div><LayoutDashboard className="h-6 w-6 text-white/20" /></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[
                ["/admin/ecu-tcu", "Edytuj stronę ECU / TCU", "Hero, usługi, FLEX, proces, FAQ", Cpu],
                ["/admin/strona", "Edytuj stronę główną", "Treść, kontakt, specjalizacja, SEO", FileText],
                ["/admin/uslugi", "Zarządzaj usługami", "Pełna oferta warsztatu", Wrench],
                ["/admin/realizacje", "Dodaj realizację", "Zdjęcia, diagnoza i wykonane prace", ImagePlus],
              ].map(([href, title, note, Icon]) => <Link key={String(href)} to={String(href)} className="group border border-white/10 bg-[#080908] p-5 transition hover:border-[#dca92c]/35"><Icon className="h-5 w-5 text-[#e0ad31]" /><div className="mt-4 text-sm font-bold group-hover:text-[#e8ba47]">{String(title)}</div><div className="mt-2 text-xs leading-5 text-white/30">{String(note)}</div></Link>)}</div></section>

              <section className="border border-white/10 bg-[#0b0c0b] p-5 sm:p-7"><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e0ad31]">Status projektu</div><h2 className="mt-2 text-2xl font-bold">Nowa wersja Gl@bcio</h2><div className="mt-6 space-y-3">{[
                ["Nowa strona główna", true],
                ["Live opinie Google", true],
                ["Realizacje + panel", true],
                ["Strona ECU / TCU", true],
                ["Edytor ECU / TCU", true],
                ["Finalne indeksowanie SEO", false],
              ].map(([label, done]) => <div key={String(label)} className="flex items-center justify-between border-b border-white/8 pb-3 text-sm"><span className="text-white/55">{String(label)}</span><span className={`text-[10px] font-bold uppercase tracking-[0.12em] ${done ? "text-emerald-400" : "text-[#e0ad31]"}`}>{done ? "Gotowe" : "Po testach"}</span></div>)}</div><div className="mt-6 border border-[#dca92c]/20 bg-[#dca92c]/[0.04] p-4 text-xs leading-6 text-white/45">Przed przełączeniem nowej wersji na `/` pozostawiamy `noindex` dla wersji testowych i sprawdzamy mobilkę, treści oraz wszystkie linki.</div></section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
