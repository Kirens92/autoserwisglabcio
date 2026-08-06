import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react";

const phones = [
  { value: "530 978 968", href: "tel:530978968" },
  { value: "669 513 740", href: "tel:669513740" },
];

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "glabcio@interia.pl",
    href: "mailto:glabcio@interia.pl",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "Raszkowska 53, 63-400 Ostrów Wielkopolski",
  },
  {
    icon: Clock,
    label: "Godziny otwarcia",
    value: "Pon–Pt: 8:00–17:00",
    sub: "Sobota: 8:00–13:00",
  },
  {
    icon: Clock,
    label: "Niedziela",
    value: "Zamknięte",
  },
  {
    icon: Facebook,
    label: "Facebook",
    value: "Auto Serwis Gl@bcio",
    href: "https://www.facebook.com/AutoSerwisGlabcio/",
    external: true,
  },
];

const Contact = () => {
  return (
    <section id="kontakt" className="py-20 md:py-28 px-4 sm:px-6 bg-card relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-gold opacity-20" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-primary font-body text-xs tracking-[0.3em] uppercase mb-4">Jak nas znaleźć</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Skontaktuj <span className="text-gradient-gold">się</span>
          </h2>
          <div className="gold-line mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          {/* Info */}
          <div className="space-y-6 sm:space-y-8">
            {/* Telefony obok siebie */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {phones.map((phone) => (
                <a key={phone.href} href={phone.href} className="flex items-start gap-3 sm:gap-4 group">
                  <div className="w-12 h-12 border gold-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-colors duration-300">
                    <Phone className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-1 font-body">
                      Telefon
                    </p>
                    <p className="text-foreground font-body font-medium">
                      {phone.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {contactItems.map((item, i) => {
              const Wrapper = item.href ? "a" : "div";
              return (
                <Wrapper
                  key={`${item.label}-${i}`}
                  {...(item.href ? { href: item.href } : {})}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-start gap-5 group"
                >
                  <div className="w-12 h-12 border gold-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground tracking-[0.2em] uppercase mb-1 font-body">
                      {item.label}
                    </p>
                    <p className="text-foreground font-body font-medium">
                      {item.value}
                    </p>
                    {item.sub && (
                      <p className="text-foreground text-sm font-body font-medium">{item.sub}</p>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>

          {/* Map */}
          <div className="border gold-border card-shadow overflow-hidden h-72 sm:h-80 md:h-auto min-h-[288px] md:min-h-[320px]">
            <iframe
              src="https://maps.google.com/maps?q=Raszkowska%2053%2C%2063-400%20Ostr%C3%B3w%20Wielkopolski&z=16&hl=pl&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 288, filter: "grayscale(0.6) contrast(1.1)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa dojazdu do Auto Serwis Gl@bcio, Raszkowska 53, Ostrów Wielkopolski"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
