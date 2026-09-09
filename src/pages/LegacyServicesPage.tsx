import { useEffect, useState } from "react";
import { Cpu, Fuel, Monitor, Wrench, Zap, Cog, Phone, type LucideIcon } from "lucide-react";
import LegacyNavbar from "@/components/LegacyNavbar";
import Footer from "@/components/Footer";
import CallButton from "@/components/CallButton";

type Service = {
  icon: string;
  title: string;
  description: string;
  fullDescription?: string;
  faq?: string;
  items?: string[];
};

const icons: Record<string, LucideIcon> = { Cpu, Fuel, Monitor, Wrench, Zap, Cog };
const fallback: Service[] = [
  { icon: "Wrench", title: "Mechanika", description: "Kompleksowe naprawy mechaniczne." },
  { icon: "Zap", title: "Elektryka", description: "Diagnostyka instalacji i modułów." },
  { icon: "Monitor", title: "Diagnostyka", description: "Precyzyjne wykrywanie usterek." },
];

export default function LegacyServicesPage() {
  const [services, setServices] = useState<Service[]>(fallback);

  useEffect(() => {
    fetch("/api/services")
      .then((response) => response.json())
      .then((data) => Array.isArray(data) && data.length && setServices(data))
      .catch(() => undefined);
  }, []);

  return (
    <>
      <LegacyNavbar />
      <main className="min-h-screen bg-background text-foreground pt-32 pb-20">
        <header className="max-w-4xl mx-auto px-4 text-center mb-16">
          <p className="text-primary text-xs tracking-[.3em] uppercase mb-4">Profesjonalny serwis</p>
          <h1 className="text-4xl md:text-6xl font-heading">Zakres <span className="text-gradient-gold">usług</span></h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">Do każdego samochodu podchodzimy indywidualnie.</p>
        </header>

        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {services.map((service, index) => {
            const Icon = icons[service.icon] || Cpu;
            return (
              <article id={`usluga-${index}`} key={`${service.title}-${index}`} className="border gold-border bg-card p-7 md:p-10">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 shrink-0 border gold-border grid place-items-center"><Icon className="w-7 h-7 text-primary" /></div>
                  <div className="flex-1">
                    <h2 className="font-heading text-3xl md:text-4xl mb-4">{service.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                    {service.items && <ul className="mt-5 space-y-2 text-muted-foreground">{service.items.map((item) => <li key={item} className="flex gap-2"><span className="text-primary">•</span>{item}</li>)}</ul>}
                    {service.fullDescription && <div className="mt-6 pt-6 border-t gold-border whitespace-pre-line leading-8 text-muted-foreground">{service.fullDescription}</div>}
                    {service.faq && <div className="mt-6 pt-6 border-t gold-border"><h3 className="font-heading text-xl text-primary mb-3">FAQ</h3><p className="whitespace-pre-line text-muted-foreground leading-relaxed">{service.faq}</p></div>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <CallButton className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-primary-foreground font-semibold uppercase tracking-wider"><Phone className="w-5 h-5" />Zadzwoń do nas</CallButton>
        </div>
      </main>
      <Footer />
    </>
  );
}
