import { Facebook } from "lucide-react";
import logo from "@/assets/nowelogo.png";

const Footer = () => {
  return (
    <footer className="bg-background border-t gold-border py-14 md:py-16 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
          <div>
            <div className="relative mb-6 h-24 w-64 max-w-full overflow-hidden">
              <img src={logo} alt="Logo Auto Serwis Gl@bcio" className="absolute left-1/2 top-1/2 w-64 max-w-none -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-muted-foreground text-sm font-body font-light leading-relaxed">
              Auto Serwis Gl@bcio – profesjonalny serwis aut osobowych w&nbsp;Ostrowie Wielkopolskim. Specjalizacja w&nbsp;pojazdach marki Peugeot i&nbsp;Citroën. Mechanika, elektryka, diagnostyka komputerowa.
            </p>
            <a href="https://www.facebook.com/AutoSerwisGlabcio/" target="_blank" rel="noopener noreferrer" aria-label="Facebook Auto Serwis Gl@bcio" className="inline-flex items-center gap-2 mt-6 text-primary hover:text-gold-light font-body text-sm transition-colors">
              <span className="w-10 h-10 border gold-border flex items-center justify-center group-hover:border-primary/50"><Facebook className="w-5 h-5" strokeWidth={1.5} /></span>
              Odwiedź nas na Facebooku
            </a>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-6 text-lg">Dane firmy</h4>
            <div className="text-muted-foreground text-sm font-body font-light space-y-2">
              <p>Auto Serwis Gl@bcio</p><p>Krzysztof Glabian</p><p>ul. Raszkowska 53</p><p>63-400 Ostrów Wielkopolski</p><p>woj. wielkopolskie</p><p className="pt-2">NIP: 6222576011</p><p>REGON: 526255980</p>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-6 text-lg">Kontakt</h4>
            <div className="text-muted-foreground text-sm font-body font-light space-y-2">
              <p>Tel: <a href="tel:530978968" className="text-primary hover:text-gold-light transition-colors">530 978 968</a></p>
              <p>Tel: <a href="tel:669513740" className="text-primary hover:text-gold-light transition-colors">669 513 740</a></p>
              <p>Email: <a href="mailto:glabcio@interia.pl" className="text-primary hover:text-gold-light transition-colors">glabcio@interia.pl</a></p>
              <p className="pt-3"><a href="https://www.facebook.com/AutoSerwisGlabcio/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-light transition-colors">Facebook</a></p>
              <p><a href="https://www.google.com/search?q=Auto+Serwis+Gl%40bcio+Opinie" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold-light transition-colors">★ Oceń nas na Google</a></p>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-foreground mb-6 text-lg">Formy płatności</h4>
            <div className="text-muted-foreground text-sm font-body font-light space-y-2"><p>Kartą</p><p>Gotówka</p><p>Przelewem</p><p>BLIK</p><p>Płatności Online (Tpay)</p></div>
          </div>
        </div>

        <div className="h-px bg-gradient-gold opacity-20 mb-8" />
        <p className="text-center text-muted-foreground text-xs font-body tracking-wider">© {new Date().getFullYear()} Auto Serwis Gl@bcio. Wszelkie prawa zastrzeżone.</p>
        <p className="mt-2 text-center text-muted-foreground text-xs font-body tracking-wider">Stworzony przez ZarembaTECH</p>
      </div>
    </footer>
  );
};

export default Footer;
