import { useEffect, useState } from "react";
import { Building2, ExternalLink, Handshake, Mail, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import { defaultPartnersContent, normalizePartnersContent, normalizeWebsite, type PartnersContent } from "@/lib/partners";

function ensureMeta(name: string) {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }
  return meta;
}

export default function PartnersPage() {
  const [content, setContent] = useState<PartnersContent>(defaultPartnersContent);

  useEffect(() => {
    document.title = "Partnerzy | Auto Serwis Gl@bcio";
    ensureMeta("description").content = "Poznaj firmy i marki współpracujące z Auto Serwis Gl@bcio. Dane kontaktowe, opis działalności i bezpośrednie linki do stron partnerów.";
    ensureMeta("robots").content = "index, follow";

    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setContent(normalizePartnersContent(data?.partners)))
      .catch(() => setContent(defaultPartnersContent));
  }, []);

  const partners = content.items.filter((item) => item.active);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-[#f6f2e8]">
        <section className="relative overflow-hidden bg-black px-5 py-20 sm:py-28">
          <div className="relative mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.22em] text-[#f0a928]"><span className="h-px w-10 bg-[#f0a928]" />{content.eyebrow}<span className="h-px w-10 bg-[#f0a928]" /></div>
            <h1 className="mt-5 font-serif text-5xl font-bold tracking-[-.04em] sm:text-6xl lg:text-7xl">{content.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#9ca8b8] sm:text-lg">{content.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] bg-black px-5 py-16 sm:py-20">
          {partners.length > 0 ? (
            <div className="space-y-7">
              {partners.map((partner, index) => {
                const website = normalizeWebsite(partner.website);
                return (
                  <article key={partner.id} className="overflow-hidden border border-white/10 bg-[#050505] shadow-[0_24px_70px_rgba(0,0,0,.35)]">
                    <div className="grid lg:grid-cols-[.9fr_1.1fr]">
                      <div className="relative min-h-[300px] bg-black lg:min-h-[420px]">
                        {partner.image ? (
                          <img src={partner.image} alt={`Grafika firmy ${partner.name}`} className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 grid place-items-center bg-black"><Building2 className="h-20 w-20 text-[#f0a928]/30" /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute left-5 top-5 border border-[#f0a928]/45 bg-black/90 px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] text-[#f0a928] backdrop-blur">Partner {String(index + 1).padStart(2, "0")}</div>
                      </div>

                      <div className="flex flex-col justify-center bg-[#050505] p-7 sm:p-10 lg:p-12">
                        <div className="flex min-h-[90px] items-center">
                          {partner.logo ? <img src={partner.logo} alt={`Logo ${partner.name}`} className="max-h-20 max-w-[240px] object-contain" /> : <Handshake className="h-14 w-14 text-[#f0a928]" />}
                        </div>
                        <h2 className="mt-7 font-serif text-4xl font-bold tracking-[-.03em] sm:text-5xl">{partner.name}</h2>
                        <div className="mt-4 h-px w-16 bg-[#f0a928]" />
                        <p className="mt-6 whitespace-pre-line text-sm leading-7 text-[#9ca8b8] sm:text-base">{partner.description || "Opis partnera zostanie uzupełniony w panelu administratora."}</p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">
                          {partner.phone && <a href={`tel:${partner.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-3 border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:border-[#f0a928]/45 hover:text-[#f0a928]"><Phone className="h-4 w-4" />{partner.phone}</a>}
                          {partner.email && <a href={`mailto:${partner.email}`} className="inline-flex items-center gap-3 border border-white/10 px-4 py-3 text-sm text-white/70 transition hover:border-[#f0a928]/45 hover:text-[#f0a928]"><Mail className="h-4 w-4" />{partner.email}</a>}
                        </div>

                        {website && (
                          <a href={website} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-fit items-center gap-2 bg-[#f0a928] px-6 py-3.5 text-xs font-black uppercase tracking-[0.1em] text-[#111] transition hover:bg-[#ffbd42]">
                            Odwiedź stronę partnera <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="border border-dashed border-[#f0a928]/25 bg-[#050505] px-6 py-20 text-center">
              <Handshake className="mx-auto h-14 w-14 text-[#f0a928]/45" />
              <h2 className="mt-5 text-2xl font-bold">Lista partnerów jest przygotowywana</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/40">Partnerzy pojawią się tutaj po dodaniu ich w panelu administracyjnym Auto Serwis Gl@bcio.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
