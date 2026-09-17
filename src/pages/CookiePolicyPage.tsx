import { useEffect, useState } from "react";
import { ArrowLeft, Cookie, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import logo from "@/assets/nowelogo.png";
import { defaultSiteContent, normalizeSiteContent, type SiteContent } from "@/lib/siteContent";
import "./LegalPage.css";

export default function CookiePolicyPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  useEffect(() => {
    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setContent(normalizeSiteContent(data)))
      .catch(() => setContent(defaultSiteContent));
  }, []);

  useEffect(() => {
    document.title = "Polityka plików cookies | Auto Serwis Gl@bcio";
  }, []);

  const business = content.business;

  const openSettings = () => {
    window.dispatchEvent(new Event("glabcio-open-cookie-settings"));
  };

  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-shell legal-header__inner">
          <a href="/" className="legal-logo" aria-label="Auto Serwis Gl@bcio — strona główna"><img src={logo} alt="Auto Serwis Gl@bcio" /></a>
          <a className="legal-back" href="/"><ArrowLeft />Wróć na stronę</a>
        </div>
      </header>

      <section className="legal-hero">
        <div className="legal-shell">
          <div className="legal-kicker">Auto Serwis Gl@bcio · prywatność</div>
          <h1>Polityka plików cookies</h1>
          <p>Informacje o plikach cookies, pamięci lokalnej, Google Tag Manager, zgodach użytkownika i sposobie zmiany ustawień prywatności w serwisie autoserwisglabcio.pl.</p>
          <p>Ostatnia aktualizacja: 17 września 2026 r.</p>
        </div>
      </section>

      <div className="legal-shell legal-grid">
        <aside className="legal-summary">
          <h2>Na tej stronie</h2>
          <a href="#czym-sa">1. Czym są cookies</a>
          <a href="#administrator">2. Administrator</a>
          <a href="#kategorie">3. Kategorie</a>
          <a href="#google">4. Google Tag Manager</a>
          <a href="#zgoda">5. Zgoda i jej zmiana</a>
          <a href="#przegladarka">6. Ustawienia przeglądarki</a>
          <a href="#czas">7. Czas przechowywania</a>
          <a href="#zmiany">8. Zmiany polityki</a>
        </aside>

        <article className="legal-content">
          <section id="czym-sa" className="legal-section">
            <h2>1. Czym są pliki cookies i podobne technologie</h2>
            <p>Pliki cookies to niewielkie informacje zapisywane lub odczytywane przez przeglądarkę podczas korzystania ze strony. Serwis może także korzystać z pamięci lokalnej przeglądarki, identyfikatorów technicznych oraz mechanizmów zgody służących do zapamiętania ustawień użytkownika.</p>
            <p>Nie wszystkie mechanizmy wymagają zgody. Te, które są niezbędne do działania, bezpieczeństwa lub zapamiętania wyboru użytkownika, mogą działać bez dodatkowej zgody. Mechanizmy analityczne, reklamowe lub inne niewymagane do podstawowego działania strony powinny być uruchamiane zgodnie z ustawieniami zgody użytkownika.</p>
          </section>

          <section id="administrator" className="legal-section">
            <h2>2. Administrator i kontakt</h2>
            <p>Administratorem serwisu i podmiotem decydującym o wykorzystaniu cookies jest <strong>Auto Serwis Gl@bcio Krzysztof Glabian</strong>.</p>
            <div className="legal-company-card">
              <strong>Auto Serwis Gl@bcio Krzysztof Glabian</strong>
              <span><MapPin style={{ display: "inline", width: 14, marginRight: 6 }} />{business.street}, {business.postalCode} {business.city}</span>
              <span>NIP: 6222576011 · REGON: 526255980</span>
              <a href={`tel:${business.phoneHref}`}><Phone style={{ display: "inline", width: 14, marginRight: 6 }} />{business.phone}</a>
              <a href={`mailto:${business.email}`}><Mail style={{ display: "inline", width: 14, marginRight: 6 }} />{business.email}</a>
            </div>
          </section>

          <section id="kategorie" className="legal-section">
            <h2>3. Kategorie stosowanych mechanizmów</h2>
            <h3>Niezbędne</h3>
            <p>Służą do prawidłowego działania strony, bezpieczeństwa, obsługi podstawowych funkcji i zapamiętania decyzji dotyczącej cookies. W szczególności wybór „Akceptuję wszystkie” lub „Tylko niezbędne” jest zapisywany lokalnie w przeglądarce, aby baner nie był wyświetlany przy każdej wizycie.</p>
            <h3>Analityczne i statystyczne</h3>
            <p>Mogą służyć do pomiaru sposobu korzystania z serwisu, liczby wizyt, źródeł ruchu lub działania poszczególnych elementów strony. Ich uruchomienie jest uzależnione od odpowiedniego ustawienia zgody.</p>
            <h3>Reklamowe i marketingowe</h3>
            <p>Mogą służyć do pomiaru skuteczności kampanii, personalizacji lub innych funkcji marketingowych, jeżeli takie tagi są skonfigurowane. Domyślnie zgoda dla tych kategorii jest ustawiona jako odmowa do czasu świadomej akceptacji przez użytkownika.</p>
          </section>

          <section id="google" className="legal-section">
            <h2>4. Google Tag Manager i Google Consent Mode</h2>
            <div className="legal-highlight"><ShieldCheck style={{ display: "inline", width: 18, marginRight: 8 }} />Serwis zawiera kontener Google Tag Manager oraz mechanizm Google Consent Mode. Kategorie <strong>analytics_storage</strong>, <strong>ad_storage</strong>, <strong>ad_user_data</strong> i <strong>ad_personalization</strong> są domyślnie ustawione jako „denied” i mogą zostać zmienione dopiero po wyborze użytkownika.</div>
            <p>Google Tag Manager jest narzędziem do zarządzania tagami. Sam zakres danych przetwarzanych po wyrażeniu zgody zależy od tagów rzeczywiście skonfigurowanych w kontenerze GTM. Zmiana konfiguracji narzędzi analitycznych lub marketingowych może wymagać odpowiedniej aktualizacji niniejszej polityki.</p>
          </section>

          <section id="zgoda" className="legal-section">
            <h2>5. Zgoda, odmowa i zmiana decyzji</h2>
            <p>Przy pierwszej wizycie użytkownik może zaakceptować wszystkie kategorie albo pozostawić wyłącznie mechanizmy niezbędne. Odmowa nie powinna uniemożliwiać korzystania z podstawowej treści strony.</p>
            <p>Decyzję można zmienić w dowolnym momencie. Po ponownym otwarciu ustawień można wybrać inną opcję zgody.</p>
            <button type="button" onClick={openSettings} className="legal-payment" style={{ cursor: "pointer" }}><Cookie style={{ width: 16 }} /> Zmień ustawienia cookies</button>
          </section>

          <section id="przegladarka" className="legal-section">
            <h2>6. Ustawienia przeglądarki</h2>
            <p>Użytkownik może dodatkowo usuwać lub blokować pliki cookies w ustawieniach swojej przeglądarki. Całkowite blokowanie wszystkich cookies lub podobnych mechanizmów może jednak wpłynąć na niektóre funkcje serwisu.</p>
          </section>

          <section id="czas" className="legal-section">
            <h2>7. Czas przechowywania</h2>
            <p>Czas przechowywania poszczególnych cookies zależy od ich przeznaczenia i ustawień konkretnego narzędzia. Informacja o decyzji dotyczącej zgody jest przechowywana w pamięci lokalnej przeglądarki do momentu jej usunięcia przez użytkownika albo zmiany sposobu zarządzania zgodami w serwisie.</p>
          </section>

          <section id="zmiany" className="legal-section">
            <h2>8. Zmiany polityki cookies</h2>
            <p>Polityka może być aktualizowana w związku ze zmianą funkcjonalności strony, konfiguracji narzędzi analitycznych i marketingowych, dostawców technologii lub wymagań prawnych. Aktualna wersja jest publikowana pod tym adresem.</p>
            <p>W sprawach dotyczących prywatności można skontaktować się z administratorem przez adres <a href={`mailto:${business.email}`}>{business.email}</a>.</p>
          </section>
        </article>
      </div>

      <footer className="legal-footer">
        <div className="legal-shell legal-footer__inner">
          <span>© {new Date().getFullYear()} Auto Serwis Gl@bcio · NIP 6222576011 · REGON 526255980</span>
          <div className="legal-footer__links">
            <a href="/regulamin">Regulamin</a>
            <a href="/polityka-prywatnosci">Polityka prywatności</a>
            <a href="/polityka-cookies">Polityka cookies</a>
            <button type="button" onClick={openSettings}>Ustawienia cookies</button>
          </div>
        </div>
      </footer>
    </main>
  );
}
