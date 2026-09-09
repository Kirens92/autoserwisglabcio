import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/nowelogobg.png";
import CallButton from "@/components/CallButton";

const links = [
  { href: "/uslugi", label: "Usługi" },
  { href: "/realizacje", label: "Realizacje" },
  { href: "/#proces", label: "Proces" },
  { href: "/#opinie", label: "Opinie" },
  { href: "/#kontakt", label: "Kontakt" },
];

const LegacyNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b gold-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <a href="/" aria-label="Auto Serwis Gl@bcio – strona główna" className="flex items-center gap-3">
          <img src={logo} alt="Auto Serwis Gl@bcio" className="h-12 sm:h-16 w-auto" />
        </a>

        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary font-body font-medium text-sm tracking-widest uppercase transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <CallButton className="px-6 py-2.5 bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-wider uppercase hover:brightness-110 transition-all">
            Zadzwoń
          </CallButton>
          <a
            href="#rezerwacja"
            className="px-6 py-2.5 border border-primary/40 text-primary font-body font-semibold text-sm tracking-wider uppercase hover:bg-primary/5 transition-all"
          >
            Zarezerwuj wizytę
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="md:hidden text-primary"
          aria-label={open ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b gold-border px-4 sm:px-6 pb-6 animate-fade-in">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-muted-foreground hover:text-primary font-body font-medium text-sm tracking-widest uppercase"
            >
              {link.label}
            </a>
          ))}
          <CallButton className="block w-full mt-4 text-center px-6 py-3 bg-gradient-gold text-primary-foreground font-body font-semibold text-sm tracking-wider uppercase">
            Zadzwoń
          </CallButton>
          <a
            href="#rezerwacja"
            onClick={() => setOpen(false)}
            className="block w-full mt-3 text-center px-6 py-3 border border-primary/40 text-primary font-body font-semibold text-sm tracking-wider uppercase"
          >
            Zarezerwuj wizytę
          </a>
        </div>
      )}
    </nav>
  );
};

export default LegacyNavbar;
