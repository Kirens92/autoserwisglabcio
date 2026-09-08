import { useEffect, useState } from "react";
import { ExternalLink, MessageSquareQuote, Star } from "lucide-react";

type GoogleReview = {
  id: string;
  rating: number;
  text: string;
  relativeTime?: string;
  googleMapsUri?: string;
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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`Ocena ${rating} na 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < Math.round(rating) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  const card = (
    <div className="w-[300px] shrink-0 border border-primary/20 bg-card p-6 card-shadow sm:w-[360px] sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {review.author.photoUri ? (
            <img
              src={review.author.photoUri}
              alt=""
              className="h-11 w-11 shrink-0 rounded-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary">
              {review.author.name.slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            {review.author.uri ? (
              <a
                href={review.author.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate font-heading font-semibold text-foreground transition-colors hover:text-primary"
              >
                {review.author.name}
              </a>
            ) : (
              <p className="truncate font-heading font-semibold text-foreground">{review.author.name}</p>
            )}
            {review.relativeTime && <p className="mt-1 text-xs text-muted-foreground">{review.relativeTime}</p>}
          </div>
        </div>

        <MessageSquareQuote className="h-5 w-5 shrink-0 text-primary/70" />
      </div>

      <Stars rating={review.rating} />

      <p className="mt-5 line-clamp-6 min-h-[120px] text-sm font-light leading-relaxed text-secondary-foreground">
        „{review.text}”
      </p>

      <div className="gold-line mb-4 mt-6" />

      {review.googleMapsUri ? (
        <a
          href={review.googleMapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-gold-light"
        >
          Opinia w Google Maps
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : (
        <span className="text-xs uppercase tracking-wider text-muted-foreground">Google Maps</span>
      )}
    </div>
  );

  return card;
}

const Reviews = () => {
  const [data, setData] = useState<GoogleReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/google-reviews", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json()) as GoogleReviewsPayload;
        if (!response.ok || !payload.live) throw new Error("Google reviews unavailable");
        setData(payload);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setData(null);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const reviews = (data?.reviews ?? []).filter((review) => review.text.trim().length > 0);
  const rating = data?.rating;
  const reviewCount = data?.reviewCount;

  return (
    <section id="opinie" className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-gold opacity-20" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-14 text-center md:mb-16">
          <p className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-primary">Zaufali nam</p>
          <h2 className="mb-6 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Opinie <span className="text-gradient-gold">Klientów</span>
          </h2>
          <div className="gold-line mx-auto mb-5" />

          {rating !== undefined && reviewCount !== undefined ? (
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-3">
                <span className="font-heading text-3xl font-bold text-primary">{rating.toFixed(1).replace(".", ",")}</span>
                <Stars rating={rating} />
              </div>
              <p className="font-body text-sm text-muted-foreground">
                Na podstawie {reviewCount} opinii w Google Maps
              </p>
            </div>
          ) : loading ? (
            <p className="font-body text-sm text-muted-foreground">Pobieramy aktualne opinie z Google Maps…</p>
          ) : (
            <p className="font-body text-sm text-muted-foreground">
              Aktualne opinie są chwilowo niedostępne. Możesz zobaczyć je bezpośrednio w Google Maps.
            </p>
          )}
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-24" />

          <div className="flex w-max gap-6 animate-marquee group-hover:[animation-play-state:paused] md:gap-8">
            {[...reviews, ...reviews].map((review, index) => (
              <ReviewCard key={`${review.id}-${index}`} review={review} />
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mt-12 text-center">
          <a
            href={data?.googleMapsUri || "https://www.google.com/search?q=Auto+Serwis+Gl%40bcio+Opinie"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm uppercase tracking-wider text-primary transition-colors hover:text-gold-light"
          >
            Zobacz wszystkie opinie w Google Maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
