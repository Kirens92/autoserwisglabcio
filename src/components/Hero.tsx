import heroBg from "@/assets/hero-bg.png";
import logo from "@/assets/nowelogobg.png";
import CallButton from "@/components/CallButton";
import ReserveButton from "@/components/ReserveButton";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Warsztat samochodowy" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 hero-overlay" />
        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto py-24">
        <img src={logo} alt="Logo Auto Serwis Gl@bcio" className="w-72 sm:w-[28rem] md:w-[36rem] mx-auto mb-6 md:mb-8 animate-fade-in" />

        <div className="gold-line mx-auto mb-8 animate-fade-in" />

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight mb-6 animate-fade-in-up text-foreground leading-tight">
          Auto Serwis{" "}
          <span className="text-gradient-gold">Gl@bcio</span>
        </h1>

        <p className="text-primary font-body text-xs sm:text-sm tracking-[0.3em] uppercase mb-6 animate-fade-in">
          Specjalizacja Peugeot i Citroën
        </p>

        <p
          className="text-sm md:text-base text-muted-foreground mb-10 font-body font-light leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Samochody koncernu Stellantis (PSA) nie mają przed nami tajemnic. Auta Peugeot
          i&nbsp;Citroën to nasza pasja i codzienna praca. Wiemy, jak specyficznej opieki
          wymagają, dlatego oferujemy usługi na poziomie Autoryzowanej Stacji Obsługi (ASO),
          ale w znacznie bardziej przyjaznych cenach. Serwisujemy także z pełnym sukcesem
          samochody wszystkich marek oprócz BMW i&nbsp;Mercedesów do rocznika 2015.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          <CallButton
            className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-widest uppercase hover:brightness-110 transition-all glow-gold"
          >
            <PhoneIcon />
            Zadzwoń teraz
          </CallButton>
          <ReserveButton
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 border border-primary/30 text-primary font-body font-semibold text-sm tracking-widest uppercase hover:bg-primary/5 transition-all"
          >
            Zarezerwuj wizytę
          </ReserveButton>
          <a
            href="#uslugi"
            className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 border border-primary/30 text-primary font-body font-semibold text-sm tracking-widest uppercase hover:bg-primary/5 transition-all"
          >
            Nasze usługi
          </a>
        </div>
      </div>
    </section>
  );
};

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export default Hero;
