import { useEffect, useState } from "react";
import { Handshake } from "lucide-react";
import { defaultPartnersContent, normalizePartnersContent, type PartnersContent } from "@/lib/partners";

export default function HomePartners() {
  const [partners, setPartners] = useState<PartnersContent>(defaultPartnersContent);

  useEffect(() => {
    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setPartners(normalizePartnersContent(data?.partners)))
      .catch(() => setPartners(defaultPartnersContent));
  }, []);

  const active = partners.items.filter((item) => item.active);

  return (
    <section id="partnerzy" className="home-section bg-black">
      <div className="home-shell">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-[-.04em] text-[#f6f2e8] sm:text-5xl">Partnerzy</h2>
        </div>

        {active.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {active.slice(0, 8).map((partner) => (
              <a
                key={partner.id}
                href="/partnerzy"
                className="group flex min-h-[190px] flex-col items-center justify-between border border-white/10 bg-[#050505] p-6 text-center transition hover:-translate-y-1 hover:border-[#f0a928]/50 hover:shadow-[0_18px_45px_rgba(0,0,0,.35)]"
              >
                <div className="flex min-h-[105px] w-full items-center justify-center">
                  {partner.logo ? (
                    <img src={partner.logo} alt={`Logo ${partner.name}`} className="max-h-20 max-w-[190px] object-contain" loading="lazy" />
                  ) : (
                    <Handshake className="h-12 w-12 text-[#f0a928]/55" />
                  )}
                </div>
                <div className="mt-5 w-full border border-[#f0a928] px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-[#ffd16f] transition group-hover:bg-[#f0a928] group-hover:text-[#111]">
                  {partner.name || "Partner"}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl border border-dashed border-[#f0a928]/25 bg-white/[0.015] px-6 py-10 text-center text-sm text-white/35">
            Partnerzy pojawią się tutaj po dodaniu ich w panelu administratora.
          </div>
        )}
      </div>
    </section>
  );
}
