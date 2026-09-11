import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import logo from "@/assets/nowelogo.png";
import CallButton from "@/components/CallButton";
import "./Navbar.css";

const links = [
  { href: "/nowa-strona", label: "Strona główna" },
  { href: "/uslugi", label: "Usługi" },
  { href: "/ecu-tcu", label: "ECU | TCU" },
  { href: "/realizacje", label: "Realizacje" },
  { href: "/nowa-strona#kontakt", label: "Kontakt" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="public-nav">
      <div className="public-nav__inner">
        <a href="/" aria-label="Auto Serwis Gl@bcio – strona główna" className="public-nav__logo">
          <img src={logo} alt="Auto Serwis Gl@bcio" />
        </a>

        <nav className="public-nav__links" aria-label="Główna nawigacja">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>

        <div className="public-nav__actions">
          <CallButton className="public-nav__call"><Phone /> Zadzwoń</CallButton>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="public-nav__toggle" aria-label={open ? "Zamknij menu" : "Otwórz menu"} aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div className={`public-nav__mobile ${open ? "is-open" : ""}`}>
        <div className="public-nav__mobile-inner">
          {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
          <div className="public-nav__mobile-actions">
            <CallButton className="public-nav__call"><Phone /> Zadzwoń do nas</CallButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
