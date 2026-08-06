const Reserve = () => {
  return (
    <section id="rezerwacja" className="py-20 md:py-28 px-4 sm:px-6 bg-card relative">
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />

      <div className="max-w-4xl mx-auto text-center">
        <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-4">Rezerwacja</p>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
          Zarezerwuj <span className="text-gradient-gold">wizytę</span>
        </h2>
        <div className="gold-line mx-auto mb-10" />

        {/* Tu zostanie osadzony iframe z rezerwacją (motowarsztat.pl) */}
        <div className="border gold-border card-shadow p-8 md:p-12 text-muted-foreground font-body font-light">
          Rezerwacja online zostanie wkrótce udostępniona.
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />
    </section>
  );
};

export default Reserve;
