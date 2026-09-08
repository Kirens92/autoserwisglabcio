import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Cpu,
  Eye,
  FileText,
  ImagePlus,
  LayoutDashboard,
  ListChecks,
  LogOut,
  MessageSquareText,
  Save,
  Search,
  Settings,
  Star,
  Upload,
  Wrench,
} from "lucide-react";
import logo from "@/assets/nowelogobg.png";
import heroBg from "@/assets/hero-bg.png";
import { defaultEcuTcuContent, type EcuTcuContent } from "@/lib/ecuTcuContent";

type ExtendedContent = EcuTcuContent & { media?: { heroImage?: string } };

type SectionKey = "hero" | "services" | "process" | "faq" | "seo";

const fieldClass = "w-full rounded-sm border border-white/10 bg-[#080908] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#dca92c]/60 focus:ring-1 focus:ring-[#dca92c]/20";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block"><div className="mb-2 flex items-center justify-between gap-4"><span className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-white/48">{label}</span>{hint && <span className="text-[10px] text-white/25">{hint}</span>}</div>{children}</label>;
}

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

export default function AdminEcuTcu() {
  const [checked, setChecked] = useState(false);
  const [auth, setAuth] = useState(false);
  const [content, setContent] = useState<ExtendedContent>(defaultEcuTcuContent);
  const [active, setActive] = useState<SectionKey>("hero");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((data) => {
        setAuth(Boolean(data.authenticated));
        setChecked(true);
        if (data.authenticated) {
          fetch("/api/ecu-tcu", { cache: "no-store" })
            .then((response) => response.json())
            .then((payload) => {
              if (payload?.hero?.titleLine1) setContent(payload);
            })
            .catch(() => undefined);
        }
      })
      .catch(() => setChecked(true));
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    const response = await fetch("/api/admin/ecu-tcu", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setMessage(response.ok ? "Zmiany ECU / TCU zostały zapisane." : "Nie udało się zapisać zmian.");
  };

  const uploadHero = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/upload?name=${encodeURIComponent(file.name)}`, { method: "POST", headers: { "content-type": file.type || "application/octet-stream" }, body: file });
      const payload = await response.json();
      if (!response.ok || !payload.image) throw new Error();
      setContent({ ...content, media: { ...(content.media || {}), heroImage: payload.image } });
      setMessage("Zdjęcie zostało wgrane. Kliknij „Zapisz zmiany”, aby ustawić je w sekcji HERO.");
    } catch {
      setMessage("Nie udało się wgrać zdjęcia.");
    } finally {
      setUploading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  const currentHeroImage = content.media?.heroImage || heroBg;
  const tabs = useMemo(() => [
    ["hero", "Hero", Eye],
    ["services", "Usługi ECU/TCU", ListChecks],
    ["process", "Proces", MessageSquareText],
    ["faq", "FAQ", MessageSquareText],
    ["seo", "SEO", Search],
  ] as const, []);

  if (!checked) return <main className="grid min-h-screen place-items-center bg-[#070807] text-white/40">Ładowanie panelu…</main>;
  if (!auth) return <main className="grid min-h-screen place-items-center bg-[#070807] p-6 text-white"><div className="max-w-md border border-[#dca92c]/20 bg-[#0b0c0b] p-8 text-center"><Cpu className="mx-auto h-9 w-9 text-[#dca92c]" /><h1 className="mt-5 text-2xl font-bold">Sesja administratora wygasła</h1><p className="mt-3 text-sm text-white/40">Zaloguj się ponownie, aby edytować stronę ECU / TCU.</p><Link to="/admin" className="mt-6 inline-flex bg-[#dca92c] px-5 py-3 text-sm font-bold text-black">Przejdź do logowania</Link></div></main>;

  return (
    <main className="min-h-screen bg-[#070807] text-white">
      <div className="grid min-h-screen xl:grid-cols-[230px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#090a09] xl:flex xl:flex-col">
          <div className="border-b border-white/10 px-6 py-5"><img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto" /><div className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">Panel Administratora</div></div>
          <nav className="flex-1 space-y-1 p-3">{sideItems.map(([href, label, Icon]) => <Link key={href} to={href} className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition ${href === "/admin/ecu-tcu" ? "border border-[#dca92c]/35 bg-[#dca92c]/10 font-bold text-[#e6b43a]" : "text-white/48 hover:bg-white/[0.035] hover:text-white"}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
          <div className="border-t border-white/10 p-5"><div className="text-xs font-bold">Auto Serwis Gl@bcio</div><div className="mt-1 text-[10px] text-white/25">CMS · ECU/TCU</div></div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-40 flex min-h-[70px] items-center justify-between gap-4 border-b border-white/10 bg-[#090a09]/96 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div><div className="text-lg font-bold">ECU / TCU</div><div className="text-[10px] uppercase tracking-[0.16em] text-white/28">Edytor specjalistycznej podstrony</div></div>
            <div className="flex items-center gap-2"><a href="/ecu-tcu" target="_blank" rel="noreferrer" className="hidden items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white/55 hover:border-[#dca92c]/40 hover:text-[#dca92c] sm:inline-flex"><Eye className="h-4 w-4" />Podgląd strony</a><button onClick={logout} className="hidden border border-white/10 px-4 py-2.5 text-xs text-white/40 hover:text-white md:inline-flex"><LogOut className="mr-2 h-4 w-4" />Wyloguj</button><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-[#e0ad31] px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-black disabled:opacity-50"><Save className="h-4 w-4" />{saving ? "Zapisywanie" : "Zapisz zmiany"}</button></div>
          </header>

          <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["Status", "Wersja robocza", "Treść można edytować bez zmian w kodzie"],
                ["Sekcje", "9", "Hero, usługi, proces, FAQ i więcej"],
                ["SEO", content.seo.robots.startsWith("noindex") ? "NOINDEX" : "INDEX", content.seo.title],
                ["Zdjęcie HERO", content.media?.heroImage ? "Własne" : "Domyślne", content.media?.heroImage ? "Grafika z biblioteki uploadów" : "Wgraj zdjęcie stanowiska FLEX"],
              ].map(([label, value, note]) => <div key={label} className="border border-white/10 bg-[#0b0c0b] p-5"><div className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">{label}</div><div className="mt-2 text-xl font-bold text-[#e3b039]">{value}</div><div className="mt-2 truncate text-xs text-white/30">{note}</div></div>)}
            </div>

            <div className="mt-5 grid gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(420px,.65fr)]">
              <div className="min-w-0">
                <div className="flex overflow-x-auto border border-white/10 bg-[#0b0c0b] p-1">{tabs.map(([key, label, Icon]) => <button key={key} onClick={() => setActive(key)} className={`inline-flex shrink-0 items-center gap-2 px-4 py-3 text-xs font-bold ${active === key ? "bg-[#e0ad31] text-black" : "text-white/42 hover:text-white"}`}><Icon className="h-4 w-4" />{label}</button>)}</div>

                <div className="mt-4 border border-white/10 bg-[#0b0c0b] p-5 sm:p-7">
                  {active === "hero" && <div className="space-y-5"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e0ad31]">Hero / sekcja główna</div><h2 className="mt-2 text-2xl font-bold">Pierwsze wrażenie strony ECU / TCU</h2></div><div className="grid gap-5 md:grid-cols-2"><Field label="Eyebrow"><input className={fieldClass} value={content.hero.eyebrow} onChange={(e) => setContent({ ...content, hero: { ...content.hero, eyebrow: e.target.value } })} /></Field><Field label="Przycisk główny"><input className={fieldClass} value={content.hero.primaryCta} onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryCta: e.target.value } })} /></Field></div><div className="grid gap-5 md:grid-cols-2"><Field label="Nagłówek H1 — linia 1"><input className={fieldClass} value={content.hero.titleLine1} onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleLine1: e.target.value } })} /></Field><Field label="Nagłówek H1 — linia 2"><input className={fieldClass} value={content.hero.titleLine2} onChange={(e) => setContent({ ...content, hero: { ...content.hero, titleLine2: e.target.value } })} /></Field></div><Field label="Opis"><textarea className={`${fieldClass} min-h-28 resize-y`} value={content.hero.description} onChange={(e) => setContent({ ...content, hero: { ...content.hero, description: e.target.value } })} /></Field><div className="grid gap-4 md:grid-cols-3">{content.hero.trust.map((item, index) => <div key={index} className="space-y-3 border border-white/10 p-4"><Field label={`Wyróżnik ${index + 1}`}><input className={fieldClass} value={item.title} onChange={(e) => { const trust = [...content.hero.trust]; trust[index] = { ...trust[index], title: e.target.value }; setContent({ ...content, hero: { ...content.hero, trust } }); }} /></Field><Field label="Opis"><input className={fieldClass} value={item.text} onChange={(e) => { const trust = [...content.hero.trust]; trust[index] = { ...trust[index], text: e.target.value }; setContent({ ...content, hero: { ...content.hero, trust } }); }} /></Field></div>)}</div><div className="border border-[#dca92c]/25 bg-[#dca92c]/[0.04] p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><div className="text-xs font-bold text-[#e0ad31]">Zdjęcie stanowiska FLEX</div><div className="mt-1 text-xs text-white/35">Wgraj prawdziwe zdjęcie stanowiska. Plik zostanie zapisany w trwałym katalogu uploadów.</div></div><label className="inline-flex cursor-pointer items-center gap-2 border border-[#dca92c]/35 px-4 py-3 text-xs font-bold text-[#e0ad31]"><Upload className="h-4 w-4" />{uploading ? "Wgrywanie…" : "Zmień zdjęcie"}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => uploadHero(e.target.files?.[0])} /></label></div>{content.media?.heroImage && <img src={content.media.heroImage} alt="Aktualne zdjęcie HERO" className="mt-5 aspect-[16/7] w-full object-cover" />}</div></div>}

                  {active === "services" && <div><div className="mb-6"><div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e0ad31]">Zakres usług</div><h2 className="mt-2 text-2xl font-bold">Kafelki „W czym możemy pomóc?”</h2></div><div className="space-y-4">{content.services.items.map((item, index) => <div key={index} className="grid gap-4 border border-white/10 p-4 md:grid-cols-[.9fr_1.5fr]"><Field label={`Usługa ${index + 1}`}><input className={fieldClass} value={item.title} onChange={(e) => { const items = [...content.services.items]; items[index] = { ...items[index], title: e.target.value }; setContent({ ...content, services: { ...content.services, items } }); }} /></Field><Field label="Opis"><textarea className={`${fieldClass} min-h-20 resize-y`} value={item.text} onChange={(e) => { const items = [...content.services.items]; items[index] = { ...items[index], text: e.target.value }; setContent({ ...content, services: { ...content.services, items } }); }} /></Field></div>)}</div></div>}

                  {active === "process" && <div><div className="mb-6"><div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e0ad31]">Proces realizacji</div><h2 className="mt-2 text-2xl font-bold">Kosztorys i akceptacja przed naprawą</h2></div><Field label="Opis sekcji"><textarea className={`${fieldClass} min-h-24 resize-y`} value={content.process.description} onChange={(e) => setContent({ ...content, process: { ...content.process, description: e.target.value } })} /></Field><div className="mt-5 grid gap-4 lg:grid-cols-2">{content.process.steps.map((step, index) => <div key={index} className="border border-white/10 p-4"><div className="mb-3 text-xs font-bold text-[#e0ad31]">Krok {step.number}</div><Field label="Tytuł"><input className={fieldClass} value={step.title} onChange={(e) => { const steps = [...content.process.steps]; steps[index] = { ...steps[index], title: e.target.value }; setContent({ ...content, process: { ...content.process, steps } }); }} /></Field><div className="mt-3"><Field label="Opis"><textarea className={`${fieldClass} min-h-24 resize-y`} value={step.text} onChange={(e) => { const steps = [...content.process.steps]; steps[index] = { ...steps[index], text: e.target.value }; setContent({ ...content, process: { ...content.process, steps } }); }} /></Field></div></div>)}</div></div>}

                  {active === "faq" && <div><div className="mb-6"><div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e0ad31]">FAQ</div><h2 className="mt-2 text-2xl font-bold">Pytania i odpowiedzi</h2></div><div className="space-y-4">{content.faq.items.map((item, index) => <div key={index} className="border border-white/10 p-4"><Field label={`Pytanie ${index + 1}`}><input className={fieldClass} value={item.question} onChange={(e) => { const items = [...content.faq.items]; items[index] = { ...items[index], question: e.target.value }; setContent({ ...content, faq: { ...content.faq, items } }); }} /></Field><div className="mt-3"><Field label="Odpowiedź"><textarea className={`${fieldClass} min-h-24 resize-y`} value={item.answer} onChange={(e) => { const items = [...content.faq.items]; items[index] = { ...items[index], answer: e.target.value }; setContent({ ...content, faq: { ...content.faq, items } }); }} /></Field></div></div>)}</div></div>}

                  {active === "seo" && <div className="space-y-5"><div><div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e0ad31]">SEO i indeksowanie</div><h2 className="mt-2 text-2xl font-bold">Meta dane `/ecu-tcu`</h2></div><Field label="Title" hint={`${content.seo.title.length}/60`}><input className={fieldClass} value={content.seo.title} onChange={(e) => setContent({ ...content, seo: { ...content.seo, title: e.target.value } })} /></Field><Field label="Meta description" hint={`${content.seo.description.length}/160`}><textarea className={`${fieldClass} min-h-28 resize-y`} value={content.seo.description} onChange={(e) => setContent({ ...content, seo: { ...content.seo, description: e.target.value } })} /></Field><Field label="Robots"><select className={fieldClass} value={content.seo.robots} onChange={(e) => setContent({ ...content, seo: { ...content.seo, robots: e.target.value } })}><option value="noindex, follow">noindex, follow — wersja testowa</option><option value="index, follow">index, follow — publikacja w Google</option></select></Field><div className="border border-white/10 bg-white p-4 text-black"><div className="text-xs text-[#202124]">autoserwisglabcio.pl › ecu-tcu</div><div className="mt-1 text-lg text-[#1a0dab]">{content.seo.title}</div><div className="mt-1 text-sm leading-5 text-[#4d5156]">{content.seo.description}</div></div></div>}
                </div>
                {message && <div className="mt-4 border border-[#dca92c]/20 bg-[#dca92c]/[0.05] px-4 py-3 text-sm text-[#e7b73f]">{message}</div>}
              </div>

              <aside className="min-w-0 2xl:sticky 2xl:top-[94px] 2xl:self-start">
                <div className="border border-white/10 bg-[#0b0c0b] p-4"><div className="mb-4 flex items-center justify-between"><div><div className="text-xs font-bold">Podgląd HERO</div><div className="text-[10px] text-white/25">Aktualizuje się podczas edycji</div></div><a href="/ecu-tcu" target="_blank" rel="noreferrer" className="text-xs text-[#e0ad31]">Pełny podgląd →</a></div><div className="relative overflow-hidden border border-[#dca92c]/25 bg-[#060706]"><img src={currentHeroImage} alt="Podgląd" className="absolute inset-0 h-full w-full object-cover opacity-20" /><div className="absolute inset-0 bg-gradient-to-r from-[#060706] via-[#060706]/95 to-[#060706]/60" /><div className="relative min-h-[390px] p-7"><img src={logo} alt="Gl@bcio" className="h-12 w-auto" /><div className="mt-12 text-[8px] font-extrabold uppercase tracking-[0.24em] text-[#e0ad31]">{content.hero.eyebrow}</div><div className="mt-4 font-serif text-4xl font-semibold leading-[.9]"><div>{content.hero.titleLine1}</div><div className="mt-2 text-[#e0ad31]">{content.hero.titleLine2}</div></div><p className="mt-5 max-w-sm text-xs leading-5 text-white/50">{content.hero.description}</p><div className="mt-6 inline-flex bg-[#e0ad31] px-4 py-3 text-[9px] font-extrabold uppercase tracking-[0.12em] text-black">{content.hero.primaryCta}</div></div></div></div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
