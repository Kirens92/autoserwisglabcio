import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string;
};

export default function LatestRealizations() {
  const [items, setItems] = useState<Realization[]>([]);

  useEffect(() => {
    fetch("/api/realizations")
      .then((response) => response.json())
      .then((data: Realization[]) => {
        if (!Array.isArray(data)) return;
        setItems([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3));
      })
      .catch(() => undefined);
  }, []);

  if (!items.length) return null;

  return (
    <section id="realizacje" className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-4xl font-heading mb-12">Najnowsze <span className="text-primary">Realizacje</span></h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link to={`/stara-strona/realizacje/${item.slug}`} key={item.slug} className="border gold-border overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full aspect-video object-cover" />
              <div className="p-5">
                <h3 className="font-heading text-2xl">{item.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/stara-strona/realizacje" className="text-primary uppercase tracking-wider">Wszystkie realizacje →</Link>
        </div>
      </div>
    </section>
  );
}
