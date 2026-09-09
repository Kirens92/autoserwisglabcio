import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LegacyNavbar from "@/components/LegacyNavbar";
import Footer from "@/components/Footer";

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  clientReport?: string;
  diagnosis?: string;
  image: string;
};

export default function LegacyRealizationDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<Realization>();

  useEffect(() => {
    fetch("/api/realizations")
      .then((response) => response.json())
      .then((items: Realization[]) => setItem(Array.isArray(items) ? items.find((entry) => entry.slug === slug) : undefined))
      .catch(() => undefined);
  }, [slug]);

  if (!item) {
    return <><LegacyNavbar /><main className="min-h-screen bg-background text-foreground pt-32 text-center">Nie znaleziono realizacji.</main><Footer /></>;
  }

  return (
    <>
      <LegacyNavbar />
      <main className="bg-background text-foreground pt-28 pb-20">
        <article className="max-w-5xl mx-auto px-4">
          <Link to="/stara-strona/realizacje" className="text-primary text-sm tracking-wider uppercase">← Wszystkie realizacje</Link>
          <div className="mt-8 border gold-border overflow-hidden card-shadow">
            <img src={item.image} alt={item.title} className="w-full aspect-video object-cover" />
            <div className="bg-white p-7 md:p-10">
              <h1 className="font-heading text-4xl md:text-5xl text-gradient-gold">{item.title}</h1>
              <p className="text-zinc-600 mt-4">{item.excerpt}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 my-10">
            {item.clientReport && <section className="bg-card border gold-border p-7"><p className="text-primary text-xs tracking-[.2em] uppercase mb-4">Zgłoszenie klienta</p><p className="text-muted-foreground leading-relaxed">{item.clientReport}</p></section>}
            {item.diagnosis && <section className="bg-card border gold-border p-7"><p className="text-primary text-xs tracking-[.2em] uppercase mb-4">Diagnoza</p><p className="text-muted-foreground leading-relaxed">{item.diagnosis}</p></section>}
          </div>
          <section className="max-w-3xl mx-auto">
            <p className="text-primary text-xs tracking-[.2em] uppercase mb-4">Główny opis</p>
            <div className="whitespace-pre-line text-muted-foreground leading-8">{item.content}</div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
