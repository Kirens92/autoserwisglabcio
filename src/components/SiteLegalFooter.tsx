import { Banknote, CreditCard, Globe2, Landmark, Smartphone } from "lucide-react";
import { useLocation } from "react-router-dom";
import "./SiteLegalFooter.css";

const payments = [
  [CreditCard, "Kartą"],
  [Banknote, "Gotówka"],
  [Landmark, "Przelewem"],
  [Smartphone, "BLIK"],
  [Globe2, "Płatności Online (Tpay)"],
] as const;

export default function SiteLegalFooter() {
  const location = useLocation();
  if (location.pathname !== "/nowa-strona") return null;

  return (
    <section className="site-legal-footer" aria-label="Formy płatności i dokumenty prawne">
      <div className="site-legal-footer__inner">
        <div>
          <div className="site-legal-footer__title">Formy płatności</div>
          <div className="site-legal-footer__payments">
            {payments.map(([Icon, label]) => <span key={label} className="site-legal-footer__payment"><Icon />{label}</span>)}
          </div>
        </div>
        <div className="site-legal-footer__right">
          <div className="site-legal-footer__links"><a href="/regulamin">Regulamin</a><a href="/polityka-prywatnosci">Polityka prywatności</a><a href="https://zarembatech.pl" target="_blank" rel="noreferrer">Administracja techniczna: ZarembaTECH</a></div>
          <div className="site-legal-footer__meta">Auto Serwis Gl@bcio Krzysztof Glabian · NIP 6222576011 · REGON 526255980 · hosting OVHcloud</div>
        </div>
      </div>
    </section>
  );
}
