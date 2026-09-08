import { useEffect, useRef, useState } from "react";
import { ArrowRight, Cpu, ExternalLink, FileCheck2, MessageSquareQuote, PackageCheck, ShieldCheck, Star, Wrench } from "lucide-react";
import type { SiteContent } from "@/lib/siteContent";

type GoogleReview = {
  id: string;
  rating: number;
  text: string;
  relativeTime?: string;
  googleMapsUri?: string;
  flagContentUri?: string;
  author: {
    name: string;
    uri?: string;
    photoUri?: string;
  };
};

type GoogleReviewsPayload = {
  live: boolean;
  configured?: boolean;
  rating?: number;
  reviewCount?: number;
  googleMapsUri?: string;
  reviews?: GoogleReview[];
};

type Realization = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  createdAt: string;
};

type Props = {
  fallback: SiteContent["reviews"];
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`Ocena ${rating} na 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3.5 w-3.5 ${index < Math.round(rating) ? "fill-primary text-primary" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

export default function GoogleReviews({ fallback }: Props) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const fetchedRef = useRef(false);
  const [live, setLive] = useState<GoogleReviewsPayload | null>(null);
  const [realizations, setRealizations] = useState<Realization[]>([]);

  useEffect(() => {
    fetch("/api/realizations", { cache: "no-store" })
      .then((response) => response.json())
      .then((items: Realization[]) => {
        if (!Array.isArray(items)) return;
        const latest = [...items]
          .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
          .slice(0, 3);
        setRealizations(latest);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const fetchReviews = () => {
      if (fetchedRef.current) return;
      fetchedRef.current = true;
      fetch("/api/google-reviews", { cache: "no-store" })
        .then(async (response) => {
          const payload = await response.json();
          if (!response.ok || !payload?.live) throw new Error("Google reviews unavailable");
          setLive(payload);
        })
        .catch(() => undefined);
    };

    if (!("IntersectionObserver" in window)) {
      fetchReviews();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          fetchReviews();
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const fallbackRating = Number.parseFloat(fallback.ratingLabel.replace(",", ".")) || 5;
  const rating = live?.rating ?? fallbackRating;
  const reviewCount = live?.reviewCount;
  const liveReviews = live?.reviews?.filter((review) => review.text)?.slice(0, 5) ?? [];
  const usingLive = liveReviews.length > 0;

  const fallbackReviews: GoogleReview[] = fallback.items.map((review, index) => ({
    id: `fallback-${index}`,
    rating: 5,
    text: review.text,
    author: { name: review.name },
  }));

  const reviews = usingLive ? liveReviews : fallbackReviews;

  return (
    <div ref={sectionRef}>
      <section className="relative overflow-hidden border-y border-primary/20 bg-[#090909] py-20 sm:py-24">
        <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-primary/10" />
        <div className="absolute -right-8 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full border border-primary/10" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:px-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Specjalistyczna elektronika samochodowa</div>
            <h2 className="mt-4 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">Modyfikacje i naprawa sterowników <span className="text-primary">ECU | TCU</span></h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/55">Diagnostyka, programowanie, kodowanie i klonowanie sterowników silnika oraz skrzyń biegów. Oryginalny sprzęt FLEX, tryby OBD / BENCH / BOOT i możliwość obsługi wysyłkowej sterowników z całej Polski.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs text-white/60">
              <span className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.04] px-4 py-3"><ShieldCheck className="h-4 w-4 text-primary" />Oryginalny FLEX</span>
              <span className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.04] px-4 py-3"><Cpu className="h-4 w-4 text-primary" />OBD / BENCH / BOOT</span>
              <span className="inline-flex items-center gap-2 border border-primary/25 bg-primary/[0.04] px-4 py-3"><PackageCheck className="h-4 w-4 text-primary" />Obsługa wysyłkowa</span>
            </div>
            <a href="/ecu-tcu" className="mt-8 inline-flex items-center gap-3 bg-gradient-gold px-6 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-black transition hover:brightness-110">Poznaj usługę ECU / TCU <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="border border-primary/25 bg-black/40 p-6 sm:p-8">
            <Cpu className="h-9 w-9 text-primary" />
            <div className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Jasny proces</div>
            <div className="mt-3 text-2xl font-bold">Diagnoza → kosztorys → akceptacja → naprawa</div>
            <p className="mt-4 text-sm leading-7 text-white/45">Przed rozpoczęciem płatnych prac przedstawiamy zakres i kosztorys. Realizacja rozpoczyna się dopiero po akceptacji klienta.</p>
          </div>
        </div>
      </section>

      <section id="realizacje" className="border-t border-white/10 bg-[#080808] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Efekty naszej pracy</div>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Najnowsze realizacje</h2>
              <p className="mt-4 max-w-2xl leading-7 text-white/50">
                Pokazujemy wybrane naprawy, diagnozy i wykonane prace. Każda realizacja może być dodana z panelu administratora i automatycznie pojawia się na stronie.
              </p>
            </div>
            <a href="/realizacje" className="inline-flex items-center gap-2 border border-primary/40 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-black">
              Wszystkie realizacje <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {realizations.length > 0 ? (
              realizations.map((item) => (
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
                    <h3 className="mt-3 text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">{item.excerpt}</p>
                    <div className="mt-5 text-xs font-semibold text-primary">Zobacz szczegóły →</div>
                  </div>
                </a>
              ))
            ) : (
              <div className="lg:col-span-3 border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                <Wrench className="mx-auto h-8 w-8 text-primary/60" />
                <h3 className="mt-4 text-lg font-bold">Realizacje będą publikowane z panelu administracyjnego</h3>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/40">Po dodaniu pierwszej realizacji w panelu pojawi się ona tutaj automatycznie — bez zmian w kodzie strony.</p>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4 border border-primary/20 bg-primary/[0.045] p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
            <div className="flex h-12 w-12 items-center justify-center border border-primary/30 bg-black/30 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Najpierw kosztorys, potem naprawa</div>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-white/60">
                Po diagnozie przygotowujemy kosztorys i wysyłamy go klientowi do akceptacji. Naprawę rozpoczynamy dopiero po zatwierdzeniu zakresu prac i kosztów. Jeżeli w trakcie pojawią się dodatkowe prace, kontaktujemy się z klientem przed ich wykonaniem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="opinie" className="border-y border-white/10 bg-[#0b0b0b] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-primary">{fallback.eyebrow}</div>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">{fallback.title}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
                Opinie i ocena są pobierane z profilu Google Maps warsztatu. Google domyślnie zwraca wybrane opinie według trafności; na stronie pokazujemy maksymalnie 5.
              </p>
            </div>

            <div className="min-w-[250px] border border-primary/20 bg-primary/[0.04] px-5 py-4">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Google Maps</div>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-3xl font-black text-primary">{rating.toFixed(1).replace(".", ",")}</span>
                    <span className="pb-1 text-sm text-white/45">/ 5</span>
                  </div>
                </div>
                <div className="text-right">
                  <Stars rating={rating} />
                  <div className="mt-2 text-xs text-white/45">
                    {reviewCount !== undefined ? `${reviewCount} opinii` : fallback.ratingLabel}
                  </div>
                </div>
              </div>
              {live?.googleMapsUri && (
                <a href={live.googleMapsUri} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-gold-light">
                  Zobacz wszystkie opinie w Google Maps <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
              <article key={review.id} className="flex h-full flex-col border border-white/10 bg-[#090909] p-6 sm:p-7">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {review.author.photoUri ? (
                      <img src={review.author.photoUri} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/70">{review.author.name.slice(0, 1)}</div>
                    )}
                    <div className="min-w-0">
                      {review.author.uri ? (
                        <a href={review.author.uri} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-bold hover:text-primary">{review.author.name}</a>
                      ) : (
                        <div className="truncate text-sm font-bold">{review.author.name}</div>
                      )}
                      {review.relativeTime && <div className="mt-1 text-xs text-white/30">{review.relativeTime}</div>}
                    </div>
                  </div>
                  <MessageSquareQuote className="h-5 w-5 shrink-0 text-primary/70" />
                </div>

                <Stars rating={review.rating} />
                <p className="mt-4 flex-1 text-sm leading-6 text-white/55">„{review.text}”</p>

                {review.googleMapsUri && (
                  <a href={review.googleMapsUri} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-gold-light">
                    Zobacz tę opinię w Google Maps <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2 text-[11px] leading-5 text-white/30 sm:flex-row sm:items-center sm:justify-between">
            <span>Źródło danych: Google Maps. Opinie są autorstwa użytkowników Google Maps.</span>
            {usingLive && <span>Dane pobierane na żywo przy wejściu do sekcji opinii.</span>}
          </div>
        </div>
      </section>
    </div>
  );
}
