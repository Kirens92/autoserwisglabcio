import { Cpu, Fuel, Monitor, Wrench, Zap, Cog, type LucideIcon } from "lucide-react";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  items?: string[];
};

const services: Service[] = [
  {
    icon: Wrench,
    title: "Mechanika",
    description:
      "Zajmujemy się szerokim zakresem napraw mechanicznych, od prostych napraw do kapitalnych remontów silników. Dzięki naszej wiedzy i doświadczeniu możesz być pewien, że Twój samochód zostanie naprawiony sprawnie i solidnie.",
  },
  {
    icon: Zap,
    title: "Elektryka",
    description:
      "Współczesne auta to komputery na kołach. Gdy zawodzą przewody, czujniki lub moduły, oferujemy precyzyjne odnajdywanie usterek i skuteczną naprawę zaawansowanych systemów elektrycznych.",
  },
  {
    icon: Monitor,
    title: "Diagnostyka",
    description:
      "Twoje auto straciło moc? Na desce rozdzielczej pojawiła się niepokojąca kontrolka? Nie czekaj, aż drobna usterka doprowadzi do poważnej i kosztownej awarii. Szybko zdiagnozujemy przyczyny zapalenia się kontrolek.",
  },
  {
    icon: Cog,
    title: "Serwis Skrzyń Automatycznych",
    description:
      "Oferujemy profesjonalną, dynamiczną wymianę oleju w automatycznych skrzyniach biegów. W przeciwieństwie do metody statycznej, proces ten pozwala na całkowite odświeżenie środka smarnego wraz z konwerterem. Zyskaj dłuższą żywotność skrzyni, optymalną ochronę komponentów i maksymalny komfort jazdy.",
  },
  {
    icon: Cpu,
    title: "Modyfikacje Sterowników ECU / TCU",
    description:
      "Bezpieczne i bezinwazyjne modyfikacje oprogramowania sterowników na oryginalnym sprzęcie FLEX:",
    items: [
      "Modyfikacje ECU & TCU – naprawa, kodowanie oraz klonowanie komputerów silnika i skrzyń biegów 1:1.",
      "Diagnostyka układów emisji spalin – wykrywanie i usuwanie usterek AdBlue, FAP/DPF oraz EGR.",
      "Obsługa kodów DTC – identyfikacja przyczyn powracających błędów i profesjonalna naprawa.",
    ],
  },
];

const Services = () => {
  return (
    <section id="uslugi" className="py-20 md:py-28 px-4 sm:px-6 bg-card relative">
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-4">Co oferujemy</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Nasze <span className="text-gradient-gold">Usługi</span>
          </h2>
          <div className="gold-line mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <div
              key={service.title}
              className="bg-background border gold-border p-6 sm:p-8 md:p-10 card-shadow hover:border-primary/40 transition-all duration-500 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="w-14 h-14 border gold-border flex items-center justify-center mb-8 group-hover:border-primary/50 transition-colors duration-500">
                <service.icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4 text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground font-body font-light leading-relaxed text-sm">
                {service.description}
              </p>
              {service.items && (
                <ul className="mt-4 space-y-3 text-muted-foreground font-body font-light leading-relaxed text-sm">
                  {service.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />
    </section>
  );
};

export default Services;
