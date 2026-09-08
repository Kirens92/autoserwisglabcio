import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, MessageSquareQuote, Star } from "lucide-react";
import logo from "@/assets/nowelogobg.png";

type Review = {
  id: string;
  rating: number;
  text: string;
  relativeTime?: string;
  googleMapsUri?: string;
  author: { name: string; photoUri?: string };
};

type Payload = {
  live?: boolean;
  configured?: boolean;
  rating?: number;
  reviewCount?: number;
  googleMapsUri?: string;
  reviews?: Review[];
};

export default function AdminGoogleReviews() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((session) => {
        const ok = Boolean(session.authenticated);
        setAuth(ok);
        if (!ok) return setLoading(false);
        fetch("/api/google-reviews", { cache: "no-store" })
          .then(async (r) => ({ ok: r.ok, payload: await r.json() }))
          .then(({ payload }) => setData(payload))
          .catch(() => setData({ live: false }))
          .finally(() => setLoading(false));
      })
      .catch(() => { setAuth(false); setLoading(false); });
  }, []);

  if (auth === null || loading) return <main className="grid min-h-screen place-items-center bg-[#070807] text-white/40">Ładowanie opinii Google…</main>;
  if (!auth) return <main className="grid min-h-screen place-items-center bg-[#070807] p-6 text-white"><div className="border border-[#dca92c]/20 bg-[#0b0c0b] p-8 text-center"><h1 className="text-2xl font-bold">Wymagane logowanie</h1><Link to="/admin" className="mt-5 inline-flex bg-[#e0ad31] px-5 py-3 text-sm font-bold text-black">Przejdź do logowania</Link></div></main>;

  const reviews = data?.reviews?.filter((item) => item.text).slice(0, 5) ?? [];

  return (
    <main className="min-h-screen bg-[#070807] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090a09]/96 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4"><img src={logo} alt="Auto Serwis Gl@bcio" className="h-12 w-auto" /><div><div className="text-sm font-bold">Opinie Google</div><div className="text-[10px] uppercase tracking-[0.16em] text-white/25">Gl@bcio CMS</div></div></div>
          <Link to="/admin" className="inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white/50 hover:text-[#e0ad31]"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-4 md:grid-cols-3">
          <section className="border border-white/10 bg-[#0b0c0b] p-6"><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">Ocena Google</div><div className="mt-3 flex items-end gap-2"><span className="text-5xl font-black text-[#e0ad31]">{typeof data?.rating === "number" ? data.rating.toFixed(1).replace(".", ",") : "—"}</span><span className="pb-1 text-white/30">/ 5</span></div></section>
          <section className="border border-white/10 bg-[#0b0c0b] p-6"><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">Liczba opinii</div><div className="mt-3 text-5xl font-black">{data?.reviewCount ?? "—"}</div></section>
          <section className="border border-white/10 bg-[#0b0c0b] p-6"><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">Status integracji</div><div className={`mt-3 text-xl font-bold ${data?.live ? "text-emerald-400" : "text-[#e0ad31]"}`}>{data?.live ? "LIVE" : data?.configured === false ? "Brak klucza API" : "Niedostępne"}</div><p className="mt-2 text-xs leading-5 text-white/30">Dane są pobierane z profilu Google Maps przez backend.</p></section>
        </div>

        <div className="mt-6 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end"><div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e0ad31]">Podgląd danych LIVE</div><h1 className="mt-2 font-serif text-4xl font-semibold">Najnowsze opinie</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/38">Ta sekcja służy do kontroli integracji. Odpowiedzi na opinie nadal wykonuje się w Profilu Firmy Google.</p></div>{data?.googleMapsUri && <a href={data.googleMapsUri} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[#dca92c]/30 px-5 py-3 text-xs font-bold text-[#e0ad31]">Otwórz Google Maps <ExternalLink className="h-4 w-4" /></a>}</div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">{reviews.length ? reviews.map((review) => <article key={review.id} className="border border-white/10 bg-[#0b0c0b] p-6"><div className="flex items-start justify-between gap-4"><div><div className="font-bold">{review.author.name}</div><div className="mt-1 text-xs text-white/30">{review.relativeTime || "Opinia Google"}</div></div><MessageSquareQuote className="h-5 w-5 text-[#e0ad31]" /></div><div className="mt-4 flex gap-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < Math.round(review.rating) ? "fill-[#e0ad31] text-[#e0ad31]" : "text-white/15"}`} />)}</div><p className="mt-4 text-sm leading-7 text-white/50">{review.text}</p>{review.googleMapsUri && <a href={review.googleMapsUri} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#e0ad31]">Zobacz w Google <ExternalLink className="h-3.5 w-3.5" /></a>}</article>) : <div className="lg:col-span-2 border border-dashed border-white/10 p-10 text-center text-sm text-white/35">Brak danych opinii do wyświetlenia. Sprawdź konfigurację `GOOGLE_PLACES_API_KEY` w Coolify.</div>}</div>
      </div>
    </main>
  );
}
