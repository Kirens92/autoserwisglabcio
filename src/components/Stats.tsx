const stats = [
  { value: "100%", label: "Indywidualnego podejścia" },
  { value: "500+", label: "Zadowolonych klientów" },
  { value: "4.9", label: "Ocena Google", suffix: "★" },
  { value: "103", label: "Opinii w Google" },
];

const Stats = () => {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 bg-background relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center animate-count-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-gradient-gold mb-3">
                {stat.value}
                {stat.suffix && <span>{stat.suffix}</span>}
              </div>
              <div className="text-muted-foreground text-[0.7rem] sm:text-xs tracking-[0.2em] uppercase font-body">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />
    </section>
  );
};

export default Stats;
