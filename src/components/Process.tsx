const steps = [
  {
    title: "Przyjęcie auta i wstępny wywiad",
    description:
      "Rozmawiamy o objawach usterki i Twoich oczekiwaniach. Jeśli to możliwe, od razu podajemy szacunkowy koszt podstawowych czynności.",
  },
  {
    title: "Dokładna weryfikacja i diagnostyka",
    description:
      "Sprawdzamy auto na podnośniku lub podłączamy pod komputer diagnostyczny. Lokalizujemy rzeczywiste źródło problemu i określamy listę niezbędnych części.",
  },
  {
    title: "Kontakt z klientem i akceptacja kosztów",
    description:
      "Zawsze dzwonimy do Ciebie przed rozpoczęciem naprawy! Przedstawiamy szacunkowy kosztorys. Proponujemy różne warianty części (oryginalne OE lub sprawdzone, wysokiej jakości zamienniki), dopasowane do Twojego budżetu.",
  },
  {
    title: "Naprawa i odbiór pojazdu",
    description:
      "Przystępujemy do pracy dopiero po Twoim podpisaniu kosztorysu online lub zgodzie telefonicznej. Przy odbiorze auta otrzymujesz szczegółowy rachunek.",
  },
];

const Process = () => {
  return (
    <section id="proces" className="py-20 md:py-28 px-4 sm:px-6 bg-background relative">
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-4">Proces</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Jak wygląda proces przyjęcia i wydania w Auto Serwis{" "}
            <span className="text-gradient-gold">Gl@bcio?</span>
          </h2>
          <div className="gold-line mx-auto" />
          <p className="mt-6 text-muted-foreground font-body font-light tracking-wide text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            Po wpisaniu do systemu niezbędnych informacji otrzymujesz sms z linkiem
            gdzie masz dostęp online do kosztorysu oraz statusie pojazdu. Kosztorys jest
            aktualizowany na bieżąco także masz pełny podgląd kosztów.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="bg-card border gold-border p-6 sm:p-8 card-shadow hover:border-primary/40 transition-all duration-500 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-center justify-center w-12 h-12 border gold-border text-primary font-heading font-bold text-xl mb-8 group-hover:border-primary/50 transition-colors duration-500">
                {i + 1}
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground font-body font-light leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />
    </section>
  );
};

export default Process;
