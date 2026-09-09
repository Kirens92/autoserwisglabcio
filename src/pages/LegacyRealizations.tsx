import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LegacyNavbar from "@/components/LegacyNavbar";
import Footer from "@/components/Footer";

type Realization = { slug: string; title: string; excerpt: string; content: string; image: string; createdAt: string };

export default function LegacyRealizations() {
  const [items, setItems] = useState<Realization[]>([]);

  useEffect(() => {
    fetch("/api/realizations")
      .then((response) => response.json())
      .then((data: Realization[]) => Array.isArray(data) && setItems(data))
      .catch(() => undefined);
  }, []);

  return (
    <>
      <LegacyNavbar />
      <main className="min-h-screen bg-background text-foreground p-8 pt-32">
        <header className="text-center mb-14">
          <p className="text-primary text-xs tracking-[.3em] uppercase mb-4">Efekty naszej pracy</p>
          <h1 className="text-4xl md:text-6xl font-heading">Nasze <span className="text-gradient-gold">Realizacje</span></h1>
        </header>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <Link to={`/stara-strona/realizacje/${item.slug}`} key={item.slug} className="group border gold-border bg-card overflow-hidden card-shadow">
              <img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="bg-card p-5 border-t gold-border">
                <h2 className="text-2xl font-heading text-foreground">{item.title}</h2>
                <p className="mt-3 text-muted-foreground">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
