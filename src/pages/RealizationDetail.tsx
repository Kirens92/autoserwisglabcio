import { useEffect, useMemo, useState } from "react";
import { Phone, SearchCheck, Wrench } from "lucide-react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CallButton from "@/components/CallButton";

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  clientReport?: string;
  diagnosis?: string;
  image: string;
  images?: string[];
};

function getImages(item: Realization | null | undefined) {
  if (!item) return [];
  return Array.from(
    new Set(
      [item.image, ...(Array.isArray(item.images) ? item.images : [])].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  ).slice(0, 12);
}

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

  const images = useMemo(() => getImages(item), [item]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#070707] text-white">
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
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <CallButton className="inline-flex min-h-12 items-center justify-center gap-2 bg-gradient-gold px-6 text-sm font-bold text-black"><Phone className="h-4 w-4" />Zadzwoń do nas</CallButton>
                  </div>
                </div>
              </div>
            </section>

            <article className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              {images.length > 0 && (
                <section aria-label="Galeria realizacji" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className={`overflow-hidden border border-white/10 bg-black/30 ${index === 0 ? "sm:col-span-2 lg:col-span-3" : ""}`}
                    >
                      <img
                        src={image}
                        alt={`${item.title} — zdjęcie ${index + 1}`}
                        className={index === 0 ? "max-h-[720px] w-full object-cover" : "aspect-[4/3] h-full w-full object-cover"}
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </section>
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
            </article>
          </>
        )}
      </main>
    </>
  );
}
