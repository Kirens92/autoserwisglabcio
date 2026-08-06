import { useMemo } from "react";
import { Star } from "lucide-react";

// Pula pozytywnych opinii (wszystkie 5/5). Kolejność losowana przy każdym wejściu.
const reviewsPool = [
  {
    name: "Marcin K.",
    text: "Świetny serwis! Szybka i profesjonalna obsługa. Polecam każdemu kto szuka uczciwego mechanika.",
  },
  {
    name: "Anna W.",
    text: "Bardzo rzetelna firma. Diagnoza problemu trafna, naprawa szybka i w rozsądnej cenie.",
  },
  {
    name: "Tomasz P.",
    text: "Najlepszy serwis w Ostrowie! Pan Krzysztof dokładnie wyjaśnia co jest do naprawy. Profesjonalizm.",
  },
  {
    name: "Paweł M.",
    text: "Uczciwie, konkretnie i bez naciągania. Naprawili to, co faktycznie było do naprawy. Polecam!",
  },
  {
    name: "Karolina S.",
    text: "Miła obsługa i szybki termin. Auto wróciło sprawne, a cena bardzo przystępna. Wrócę na pewno.",
  },
  {
    name: "Grzegorz L.",
    text: "Fachowo podeszli do usterki, której inni nie potrafili znaleźć. Wielki plus za diagnostykę.",
  },
  {
    name: "Michał D.",
    text: "Solidny warsztat, dobry kontakt i wszystko wyjaśnione. Czuć, że robią to z pasją.",
  },
  {
    name: "Ewelina R.",
    text: "Naprawa ekspresowa, a do tego uczciwa wycena. Wreszcie mechanik, któremu można zaufać.",
  },
  {
    name: "Robert N.",
    text: "Polecam w 100%. Profesjonalne podejście, szybko i bezproblemowo. Auto jak nowe.",
  },
  {
    name: "Katarzyna B.",
    text: "Bardzo dobry serwis. Pomogli od ręki, cena adekwatna do usługi. Będę wracać.",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const ReviewCard = ({ name, text }: { name: string; text: string }) => (
  <div className="w-[280px] sm:w-[340px] shrink-0 bg-card border gold-border p-6 sm:p-8 card-shadow">
    <div className="flex gap-1 mb-6">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star key={j} className="w-4 h-4 fill-primary text-primary" />
      ))}
    </div>
    <p className="text-secondary-foreground mb-8 leading-relaxed font-body font-light text-sm italic">
      „{text}"
    </p>
    <div className="gold-line mb-4" />
    <p className="font-heading font-semibold text-foreground">{name}</p>
  </div>
);

const Reviews = () => {
  // Losowa kolejność ustalana raz przy załadowaniu strony.
  const reviews = useMemo(() => shuffle(reviewsPool), []);

  return (
    <section id="opinie" className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-4">Zaufali nam</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Opinie <span className="text-gradient-gold">Klientów</span>
          </h2>
          <div className="gold-line mx-auto mb-4" />
          <p className="text-muted-foreground text-sm font-body">
            Ocena 4.9/5 na podstawie 103 opinii Google
          </p>
        </div>
      </div>

      {/* Automatycznie przesuwająca się taśma opinii */}
      <div className="group relative">
        {/* delikatne wygaszenie na krawędziach */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max gap-6 md:gap-8 animate-marquee group-hover:[animation-play-state:paused]">
          {[...reviews, ...reviews].map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} name={review.name} text={review.text} />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mt-12">
          <a
            href="https://www.google.com/search?q=Auto+Serwis+Gl%40bcio+Opinie"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-gold-light font-body text-sm tracking-wider uppercase transition-colors"
          >
            Zobacz wszystkie opinie
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
