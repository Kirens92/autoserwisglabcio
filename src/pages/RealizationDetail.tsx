import { useEffect, useState } from "react";
import { ArrowLeft, FileCheck2, SearchCheck, Wrench } from "lucide-react";
import { useParams } from "react-router-dom";
import logo from "@/assets/nowelogobg.png";

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  clientReport?: string;
  diagnosis?: string;
  image: string;
};

export default function RealizationDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<Realization | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/realizations", { cache: "no-store" })
      .then((response) => response.json())
      .then((items: Realization[]) => {
        if (!Array.isArray(items)) return setItem(null);
        setItem(items.find((entry) => entry.slug === slug) ?? null);
      })
      .catch(() => setItem(null));
  }, [slug]);

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <nav className="sticky top-0 z-50 border-b border-primary/15 bg-[#070707]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/nowa-strona" className="flex items-center" aria-label="Auto Serwis Gl@bcio – strona główna">
            <img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto sm:h-16" />
          </a>
          <a href="/realizacje" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/60 transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Wszystkie realizacje
          </a>
        </div>
      </nav>

      {item === undefined && (
        <div className="grid min-h-[60vh] place-items-center text-sm text-white/40">Wczytywanie realizacji…</div>
      )}

      {item === null && (
        <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
          <Wrench className="mx-auto h-10 w-10 text-primary/60" />
          <h1 className="mt-5 text-3xl font-bold">Nie znaleziono tej realizacji</h1>
          <p className="mt-3 text-white/40">Wpis mógł zostać usunięty albo adres jest nieprawidłowy.</p>
          <a href="/realizacje" className="mt-7 inline-flex items-center gap-2 border border-primary/40 px-5 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-black">Wróć do realizacji</a>
        </section>
      )}

      {item && (
        <>
          <section className="relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(214,165,52,.10),transparent_28%),linear-gradient(120deg,#080808,#050505)]" />
            <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
              <div className="max-w-4xl">
                <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Realizacja Auto Serwis Gl@bcio</div>
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{item.title}</h1>
                <p className="mt-6 max-w-3xl text-base leading-7 text-white/50">{item.excerpt}</p>
              </div>
            </div>
          </section>

          <article className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            {item.image && (
              <div className="overflow-hidden border border-white/10 bg-black/30">
                <img src={item.image} alt={item.title} className="max-h-[720px] w-full object-cover" />
              </div>
            )}

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {item.clientReport && (
                <section className="border border-white/10 bg-[#0b0b0b] p-6 sm:p-7">
                  <div className="flex h-10 w-10 items-center justify-center border border-primary/25 bg-primary/[0.05] text-primary"><Wrench className="h-4 w-4" /></div>
                  <div className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">Zgłoszenie klienta</div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/55">{item.clientReport}</p>
                </section>
              )}

              {item.diagnosis && (
                <section className="border border-white/10 bg-[#0b0b0b] p-6 sm:p-7">
                  <div className="flex h-10 w-10 items-center justify-center border border-primary/25 bg-primary/[0.05] text-primary"><SearchCheck className="h-4 w-4" /></div>
                  <div className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">Diagnoza</div>
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/55">{item.diagnosis}</p>
                </section>
              )}
            </div>

            <section className="mt-8 border border-white/10 bg-[#0b0b0b] p-6 sm:p-8 lg:p-10">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Zakres wykonanych prac</div>
              <div className="mt-5 max-w-4xl whitespace-pre-line text-base leading-8 text-white/60">{item.content}</div>
            </section>

            <div className="mt-8 grid gap-4 border border-primary/20 bg-primary/[0.045] p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center border border-primary/30 bg-black/30 text-primary"><FileCheck2 className="h-5 w-5" /></div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Przejrzyste koszty przed naprawą</div>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-white/60">Po diagnozie klient otrzymuje kosztorys do akceptacji. Prace rozpoczynamy dopiero po zatwierdzeniu zakresu i kosztu naprawy.</p>
              </div>
            </div>
          </article>
        </>
      )}
    </main>
  );
}
