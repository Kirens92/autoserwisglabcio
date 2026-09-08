import { useEffect, useRef, useState } from "react";
import { ExternalLink, MessageSquareQuote, Star } from "lucide-react";
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const fetchedRef = useRef(false);
  const [live, setLive] = useState<GoogleReviewsPayload | null>(null);

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

  const rating = live?.rating ?? Number.parseFloat(fallback.ratingLabel.replace(",", ".")) || 5;
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
    <section ref={sectionRef} id="opinie" className="border-y border-white/10 bg-[#0b0b0b] py-20 sm:py-24">
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
              <a
                href={live.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-gold-light"
              >
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/70">
                      {review.author.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="min-w-0">
                    {review.author.uri ? (
                      <a href={review.author.uri} target="_blank" rel="noopener noreferrer" className="block truncate text-sm font-bold hover:text-primary">
                        {review.author.name}
                      </a>
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
                <a
                  href={review.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-gold-light"
                >
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
  );
}
