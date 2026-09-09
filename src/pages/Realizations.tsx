import { useEffect, useState } from "react";
import { ExternalLink, Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt: string;
};

export default function Realizations() {
  const [items, setItems] = useState<Realization[]>([]);

  useEffect(() => {
    fetch("/api/realizations", { cache: "no-store" })
      .then((response) => response.json())
      .then((data: Realization[]) => {
        if (!Array.isArray(data)) return;
        setItems([...data].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))));
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#070707] text-white">
        <section className="relative overflow-hidden border-b border-white/10 py-20 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(214,165,52,.12),transparent_26%),linear-gradient(120deg,#080808,#050505)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Efekty naszej pracy</div>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Nasze realizacje</h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/50">
                Wybrane naprawy, diagnozy i prace serwisowe wykonywane w Auto Serwis Gl@bcio. Każda realizacja pokazuje rzeczywisty zakres wykonanych prac.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {items.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <a key={item.slug} href={`/realizacje/${item.slug}`} className="group overflow-hidden border border-white/10 bg-[#0b0b0b] transition hover:border-primary/35">
                    {item.image ? (
                      <div className="aspect-[16/10] overflow-hidden bg-black/30">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
                      </div>
                    ) : (
                      <div className="flex aspect-[16/10] items-center justify-center bg-black/30 text-primary/50"><Wrench className="h-10 w-10" /></div>
                    )}
                    <div className="p-6">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Realizacja</div>
                      <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">{item.excerpt}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary">Zobacz szczegóły <ExternalLink className="h-3.5 w-3.5" /></div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
                <Wrench className="mx-auto h-9 w-9 text-primary/60" />
                <h2 className="mt-5 text-2xl font-bold">Pierwsze realizacje pojawią się tutaj wkrótce</h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/40">Realizacje są dodawane z panelu administracyjnego i po publikacji automatycznie trafiają na tę stronę oraz na stronę główną.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
