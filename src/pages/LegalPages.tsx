import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, ExternalLink, Mail, MapPin, Phone, Server, ShieldCheck } from "lucide-react";
import logo from "@/assets/nowelogo.png";
import { defaultSiteContent, normalizeSiteContent, type SiteContent } from "@/lib/siteContent";
import "./LegalPage.css";

type LegalKind = "terms" | "privacy";

type SectionLink = { id: string; label: string };

const TERMS_LINKS: SectionLink[] = [
  { id: "firma", label: "1. Dane firmy" },
  { id: "serwis", label: "2. Charakter serwisu" },
  { id: "elektroniczne", label: "3. Usługi elektroniczne" },
  { id: "warsztat", label: "4. Usługi warsztatowe" },
  { id: "platnosci", label: "5. Płatności" },
  { id: "reklamacje", label: "6. Reklamacje" },
  { id: "odpowiedzialnosc", label: "7. Odpowiedzialność" },
  { id: "konsument", label: "8. Konsument" },
  { id: "prawa", label: "9. Prawa autorskie" },
  { id: "koncowe", label: "10. Postanowienia końcowe" },
];

const PRIVACY_LINKS: SectionLink[] = [
  { id: "administrator", label: "1. Administrator danych" },
  { id: "zakres", label: "2. Zakres danych" },
  { id: "cele", label: "3. Cele i podstawy" },
  { id: "odbiorcy", label: "4. Odbiorcy danych" },
  { id: "retencja", label: "5. Okres przechowywania" },
  { id: "prawa", label: "6. Twoje prawa" },
  { id: "cookies", label: "7. Cookies i logi" },
  { id: "transfer", label: "8. Transfer poza EOG" },
  { id: "bezpieczenstwo", label: "9. Bezpieczeństwo" },
  { id: "zmiany", label: "10. Zmiany polityki" },
];

function LegalSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="legal-section"><h2>{title}</h2>{children}</section>;
}

function CompanyCard({ business }: { business: SiteContent["business"] }) {
  return (
    <div className="legal-company-card">
      <strong>Auto Serwis Gl@bcio Krzysztof Glabian</strong>
      <span><MapPin style={{ display: "inline", width: 14, marginRight: 6 }} />{business.street}, {business.postalCode} {business.city}</span>
      <span>NIP: 6222576011 · REGON: 526255980</span>
      <a href={`tel:${business.phoneHref}`}><Phone style={{ display: "inline", width: 14, marginRight: 6 }} />{business.phone}</a>
      {business.phone2 && business.phoneHref2 && <a href={`tel:${business.phoneHref2}`}><Phone style={{ display: "inline", width: 14, marginRight: 6 }} />{business.phone2}</a>}
      <a href={`mailto:${business.email}`}><Mail style={{ display: "inline", width: 14, marginRight: 6 }} />{business.email}</a>
    </div>
  );
}

function LegalLayout({ kind }: { kind: LegalKind }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const isTerms = kind === "terms";
  const links = isTerms ? TERMS_LINKS : PRIVACY_LINKS;

  useEffect(() => {
    fetch("/api/site-content", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setContent(normalizeSiteContent(data)))
      .catch(() => setContent(defaultSiteContent));
  }, []);

  useEffect(() => {
    document.title = isTerms ? "Regulamin | Auto Serwis Gl@bcio" : "Polityka prywatności | Auto Serwis Gl@bcio";
  }, [isTerms]);

  const business = content.business;

  return (
    <main className="legal-page">
      <header className="legal-header">
        <div className="legal-shell legal-header__inner">
          <a href="/nowa-strona" className="legal-logo" aria-label="Auto Serwis Gl@bcio — strona główna"><img src={logo} alt="Auto Serwis Gl@bcio" /></a>
          <a className="legal-back" href="/nowa-strona"><ArrowLeft />Wróć na stronę</a>
        </div>
      </header>

      <section className="legal-hero">
        <div className="legal-shell">
          <div className="legal-kicker">Auto Serwis Gl@bcio · dokumenty serwisu</div>
          <h1>{isTerms ? "Regulamin serwisu internetowego" : "Polityka prywatności"}</h1>
          <p>{isTerms ? "Zasady korzystania z serwisu autoserwisglabcio.pl, kontaktu elektronicznego oraz podstawowe informacje dotyczące usług warsztatowych i płatności." : "Informacje o przetwarzaniu danych osobowych, plikach cookies, bezpieczeństwie i podmiotach wspierających techniczne działanie strony."}</p>
          <p>Ostatnia aktualizacja: 8 września 2026 r.</p>
        </div>
      </section>

      <div className="legal-shell legal-grid">
        <aside className="legal-summary"><h2>Na tej stronie</h2>{links.map((item) => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</aside>

        <article className="legal-content">
          {isTerms ? (
            <>
              <LegalSection id="firma" title="1. Dane właściciela serwisu">
                <p>Serwis internetowy autoserwisglabcio.pl należy do przedsiębiorcy prowadzącego działalność pod firmą <strong>Auto Serwis Gl@bcio Krzysztof Glabian</strong>.</p>
                <CompanyCard business={business} />
                <div className="legal-highlight"><Server style={{ display: "inline", width: 18, marginRight: 8 }} />Infrastruktura serwerowa strony jest utrzymywana w środowisku OVHcloud. Administracją techniczną, utrzymaniem, wdrożeniami i wsparciem strony zajmuje się ZarembaTECH — <a href="https://zarembatech.pl" target="_blank" rel="noreferrer">zarembatech.pl <ExternalLink style={{ display: "inline", width: 14 }} /></a>. ZarembaTECH nie jest właścicielem Auto Serwis Gl@bcio i działa wyłącznie w zakresie technicznej obsługi serwisu na podstawie ustaleń z właścicielem strony.</div>
              </LegalSection>

              <LegalSection id="serwis" title="2. Charakter i przeznaczenie serwisu">
                <p>Serwis ma charakter informacyjny i kontaktowy. Prezentuje ofertę warsztatu, zakres usług, realizacje, informacje dotyczące specjalizacji ECU/TCU, dane kontaktowe, opinie oraz materiały dotyczące działalności Auto Serwis Gl@bcio.</p>
                <p>Treści zamieszczone w serwisie nie stanowią automatycznie oferty zawarcia umowy na określonych warunkach, chyba że przy konkretnej usłudze wyraźnie wskazano inaczej. Zakres prac, termin i cena są ustalane indywidualnie, w szczególności po diagnostyce pojazdu.</p>
              </LegalSection>

              <LegalSection id="elektroniczne" title="3. Usługi świadczone drogą elektroniczną">
                <p>W ramach serwisu użytkownik może nieodpłatnie korzystać z publicznie dostępnych treści, przechodzić do podstron oferty, korzystać z danych kontaktowych, inicjować połączenie telefoniczne lub wiadomość e-mail oraz — jeżeli dana funkcja jest aktywna — przekazywać zapytanie lub rozpocząć proces rezerwacji.</p>
                <h3>Wymagania techniczne</h3>
                <ul><li>urządzenie z dostępem do Internetu,</li><li>aktualna przeglądarka internetowa obsługująca HTTPS, HTML5, CSS i JavaScript,</li><li>aktywna poczta elektroniczna w przypadku kontaktu e-mail,</li><li>włączenie JavaScript dla pełnej funkcjonalności serwisu.</li></ul>
                <h3>Zasady korzystania</h3>
                <p>Zabronione jest przekazywanie treści bezprawnych, naruszających prawa osób trzecich, złośliwego kodu, prób obchodzenia zabezpieczeń oraz podejmowanie działań mogących zakłócać pracę serwisu.</p>
                <p>Użytkownik może w każdej chwili zakończyć korzystanie z usług elektronicznych poprzez zamknięcie strony lub przerwanie kontaktu.</p>
              </LegalSection>

              <LegalSection id="warsztat" title="4. Usługi warsztatowe, diagnostyka i wycena">
                <p>Ostateczny zakres usługi warsztatowej jest ustalany indywidualnie. W przypadku konieczności diagnostyki klient może otrzymać kosztorys lub informację o przewidywanym zakresie i kosztach przed rozpoczęciem naprawy.</p>
                <p>Prace wykraczające poza zaakceptowany zakres powinny zostać uzgodnione z klientem przed ich wykonaniem, z wyjątkiem sytuacji, w których odrębne ustalenia stron stanowią inaczej albo natychmiastowe działanie jest uzasadnione względami bezpieczeństwa i klient został o tym poinformowany zgodnie z możliwym sposobem kontaktu.</p>
                <p>Terminy podawane w serwisie lub podczas pierwszego kontaktu mogą mieć charakter orientacyjny do czasu potwierdzenia przyjęcia pojazdu i zakresu zlecenia.</p>
              </LegalSection>

              <LegalSection id="platnosci" title="5. Formy płatności">
                <p>W zależności od rodzaju usługi i ustaleń z klientem Auto Serwis Gl@bcio umożliwia następujące formy płatności:</p>
                <div className="legal-payments"><span className="legal-payment">Kartą</span><span className="legal-payment">Gotówka</span><span className="legal-payment">Przelewem</span><span className="legal-payment">BLIK</span><span className="legal-payment">Płatności Online (Tpay)</span></div>
                <p>Płatności online przez Tpay są dostępne tylko wtedy, gdy dla danej należności udostępniono taki sposób rozliczenia. Obsługa płatności może wymagać przejścia do systemu operatora płatności i podlegać jego warunkom technicznym oraz zasadom bezpieczeństwa.</p>
              </LegalSection>

              <LegalSection id="reklamacje" title="6. Reklamacje i zgłoszenia dotyczące serwisu">
                <p>Zgłoszenia dotyczące działania strony internetowej oraz usług świadczonych drogą elektroniczną można kierować na adres <a href={`mailto:${business.email}`}>{business.email}</a>. W zgłoszeniu warto podać opis problemu, datę jego wystąpienia i dane pozwalające na kontakt zwrotny.</p>
                <p>Reklamacje dotyczące wykonanej usługi warsztatowej rozpatrywane są zgodnie z obowiązującymi przepisami prawa oraz ustaleniami wynikającymi ze zlecenia naprawy, kosztorysu, protokołu lub innego dokumentu dotyczącego danej usługi.</p>
              </LegalSection>

              <LegalSection id="odpowiedzialnosc" title="7. Odpowiedzialność i dostępność serwisu">
                <p>Właściciel dokłada starań, aby informacje w serwisie były aktualne i prawidłowe. Ze względu na charakter usług motoryzacyjnych informacje ogólne nie zastępują indywidualnej diagnostyki konkretnego pojazdu.</p>
                <p>Serwis może być czasowo niedostępny z powodu prac technicznych, aktualizacji, awarii infrastruktury, działań bezpieczeństwa albo przyczyn pozostających poza rozsądną kontrolą właściciela lub administratora technicznego.</p>
              </LegalSection>

              <LegalSection id="konsument" title="8. Prawa konsumenta przy umowach zawieranych na odległość">
                <p>Jeżeli w konkretnym przypadku dojdzie do zawarcia z konsumentem umowy na odległość, zastosowanie mają bezwzględnie obowiązujące przepisy prawa konsumenckiego. Informacje o prawie odstąpienia, sposobie jego wykonania oraz ewentualnych ustawowych wyjątkach powinny być przekazane zgodnie z charakterem zawieranej umowy.</p>
                <p>Rozpoczęcie świadczenia usługi przed upływem ustawowego terminu na odstąpienie może wymagać wyraźnego żądania konsumenta, a całkowite wykonanie usługi może — w przypadkach przewidzianych prawem — wpływać na możliwość skorzystania z prawa odstąpienia.</p>
              </LegalSection>

              <LegalSection id="prawa" title="9. Prawa autorskie i materiały w serwisie">
                <p>Układ strony, materiały tekstowe, grafiki, fotografie, oznaczenia i inne elementy serwisu mogą podlegać ochronie prawnej. Ich kopiowanie, rozpowszechnianie lub wykorzystywanie poza dozwolonym użytkiem wymaga zgody uprawnionego podmiotu, chyba że przepisy prawa stanowią inaczej.</p>
              </LegalSection>

              <LegalSection id="koncowe" title="10. Postanowienia końcowe">
                <p>Regulamin jest udostępniany nieodpłatnie w serwisie w sposób umożliwiający jego odczytanie i zapisanie. W przypadku zmian funkcjonalności lub przepisów treść regulaminu może zostać zaktualizowana. Dla czynności wykonanych przed zmianą stosuje się zasady właściwe dla momentu ich dokonania, o ile przepisy prawa nie stanowią inaczej.</p>
                <p>W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego, w tym przepisy dotyczące świadczenia usług drogą elektroniczną, prawa konsumenckiego oraz ochrony danych osobowych.</p>
              </LegalSection>
            </>
          ) : (
            <>
              <LegalSection id="administrator" title="1. Administrator danych osobowych">
                <p>Administratorem danych osobowych użytkowników serwisu i klientów jest <strong>Auto Serwis Gl@bcio Krzysztof Glabian</strong>.</p>
                <CompanyCard business={business} />
                <div className="legal-highlight"><ShieldCheck style={{ display: "inline", width: 18, marginRight: 8 }} />Administracja techniczna strony jest realizowana przez ZarembaTECH — <a href="https://zarembatech.pl" target="_blank" rel="noreferrer">zarembatech.pl <ExternalLink style={{ display: "inline", width: 14 }} /></a>. Strona jest utrzymywana na infrastrukturze OVHcloud. ZarembaTECH może uzyskiwać dostęp do danych wyłącznie w zakresie niezbędnym do utrzymania, zabezpieczenia, diagnostyki i obsługi technicznej serwisu, zgodnie z poleceniami administratora i odpowiednimi ustaleniami dotyczącymi powierzenia przetwarzania, jeżeli takie przetwarzanie występuje.</div>
              </LegalSection>

              <LegalSection id="zakres" title="2. Jakie dane mogą być przetwarzane">
                <p>W zależności od sposobu korzystania z serwisu mogą być przetwarzane w szczególności:</p>
                <ul><li>imię i nazwisko lub inne oznaczenie osoby kontaktowej,</li><li>numer telefonu i adres e-mail,</li><li>dane przekazane w treści zapytania, w tym informacje o pojeździe i usterce,</li><li>dane związane ze zleceniem, kosztorysem, płatnością i dokumentacją wykonanej usługi,</li><li>adres IP, informacje o urządzeniu i przeglądarce oraz dane z logów technicznych,</li><li>identyfikatory transakcji lub dane niezbędne do obsługi płatności — jeżeli wykorzystywana jest płatność online.</li></ul>
                <p>Formularz kontaktowy dostępny na stronie może przygotowywać wiadomość w lokalnym programie pocztowym użytkownika. W takim przypadku treść jest wysyłana za pomocą wybranego przez użytkownika dostawcy poczty, a nie przechowywana w bazie strony przed wysłaniem.</p>
              </LegalSection>

              <LegalSection id="cele" title="3. Cele i podstawy prawne przetwarzania">
                <ul><li><strong>Kontakt, wycena, rezerwacja i działania przed zawarciem umowy</strong> — w celu odpowiedzi na zapytanie i przygotowania realizacji usługi.</li><li><strong>Wykonanie usługi i obsługa zlecenia</strong> — w zakresie niezbędnym do realizacji umowy dotyczącej diagnostyki, naprawy lub innej usługi.</li><li><strong>Obowiązki księgowe, podatkowe i prawne</strong> — gdy przetwarzanie jest wymagane przepisami.</li><li><strong>Bezpieczeństwo, przeciwdziałanie nadużyciom, ochrona roszczeń i utrzymanie serwisu</strong> — na podstawie prawnie uzasadnionego interesu administratora.</li><li><strong>Marketing lub komunikacja wymagająca zgody</strong> — wyłącznie jeżeli taka zgoda została udzielona i w zakresie, w jakim jest wymagana prawem.</li></ul>
              </LegalSection>

              <LegalSection id="odbiorcy" title="4. Odbiorcy i podmioty wspierające przetwarzanie">
                <p>Dane mogą być przekazywane tylko w zakresie niezbędnym do realizacji danego celu, m.in. podmiotom świadczącym hosting i infrastrukturę serwerową (OVHcloud), administratorowi technicznemu i dostawcy utrzymania strony (ZarembaTECH), dostawcom poczty, księgowości, usług IT i bezpieczeństwa, a także operatorom płatności — np. Tpay — gdy klient korzysta z płatności online.</p>
                <p>Serwis może również prezentować treści lub odnośniki do usług zewnętrznych, m.in. Google. Po przejściu do zewnętrznego serwisu zastosowanie mają zasady prywatności danego dostawcy.</p>
              </LegalSection>

              <LegalSection id="retencja" title="5. Jak długo dane są przechowywane">
                <p>Dane są przechowywane nie dłużej niż jest to konieczne do realizacji celu, dla którego zostały zebrane. Dane związane z umową i rozliczeniami mogą być przechowywane przez okres wymagany przepisami podatkowymi, rachunkowymi i dotyczącymi dochodzenia lub obrony roszczeń.</p>
                <p>Dane z zapytań, które nie prowadzą do realizacji usługi, są usuwane lub ograniczane po ustaniu celu kontaktowego i upływie okresu potrzebnego do zabezpieczenia ewentualnych roszczeń. Logi bezpieczeństwa mogą być przechowywane przez okres adekwatny do celu ochrony systemu.</p>
              </LegalSection>

              <LegalSection id="prawa" title="6. Prawa osoby, której dane dotyczą">
                <p>Na zasadach określonych w RODO osobie, której dane dotyczą, może przysługiwać prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, wniesienia sprzeciwu oraz cofnięcia zgody w dowolnym momencie, jeżeli przetwarzanie odbywa się na podstawie zgody.</p>
                <p>W celu realizacji praw można skontaktować się z administratorem pod adresem <a href={`mailto:${business.email}`}>{business.email}</a>. Osobie przysługuje również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</p>
              </LegalSection>

              <LegalSection id="cookies" title="7. Pliki cookies, pamięć lokalna i logi techniczne">
                <p>Serwis może wykorzystywać pliki cookies lub podobne mechanizmy niezbędne do prawidłowego działania, bezpieczeństwa, zapamiętywania ustawień i obsługi funkcji technicznych. Informacje serwerowe, takie jak adres IP, data żądania, typ przeglądarki lub odpowiedź serwera, mogą być zapisywane w logach technicznych.</p>
                <p>Jeżeli w przyszłości zostaną uruchomione cookies analityczne, reklamowe lub inne mechanizmy niewymagane do podstawowego działania strony, będą one stosowane zgodnie z obowiązującymi wymogami dotyczącymi informacji i zgody użytkownika.</p>
              </LegalSection>

              <LegalSection id="transfer" title="8. Przekazywanie danych poza Europejski Obszar Gospodarczy">
                <p>Niektóre usługi zewnętrzne mogą być świadczone przez podmioty działające globalnie. Jeżeli korzystanie z określonej usługi powoduje przekazanie danych poza EOG, administrator wymaga zastosowania właściwej podstawy prawnej i zabezpieczeń przewidzianych w przepisach o ochronie danych, odpowiednich do konkretnego dostawcy i sposobu przetwarzania.</p>
              </LegalSection>

              <LegalSection id="bezpieczenstwo" title="9. Bezpieczeństwo danych i utrzymanie techniczne">
                <p>Administrator wraz z podmiotami wspierającymi utrzymanie serwisu stosuje środki techniczne i organizacyjne odpowiednie do charakteru przetwarzanych danych i ryzyka, w szczególności szyfrowane połączenie HTTPS, kontrolę dostępu, aktualizacje, kopie zapasowe i działania ograniczające dostęp osób nieuprawnionych.</p>
                <p>ZarembaTECH odpowiada za techniczną administrację strony w zakresie wynikającym z ustaleń z właścicielem serwisu. Hosting realizowany jest na infrastrukturze OVHcloud. Zakres odpowiedzialności poszczególnych podmiotów wynika z ich roli, umów oraz obowiązujących przepisów.</p>
              </LegalSection>

              <LegalSection id="zmiany" title="10. Zmiany polityki prywatności i kontakt">
                <p>Polityka może być aktualizowana w związku ze zmianą funkcjonalności serwisu, dostawców technicznych lub przepisów prawa. Aktualna wersja jest publikowana na tej stronie wraz z datą ostatniej aktualizacji.</p>
                <p>Pytania dotyczące prywatności można kierować na adres <a href={`mailto:${business.email}`}>{business.email}</a> lub korzystając z danych kontaktowych Auto Serwis Gl@bcio wskazanych powyżej.</p>
              </LegalSection>
            </>
          )}
        </article>
      </div>

      <footer className="legal-footer"><div className="legal-shell legal-footer__inner"><span>© {new Date().getFullYear()} Auto Serwis Gl@bcio · NIP 6222576011 · REGON 526255980</span><div className="legal-footer__links"><a href="/regulamin">Regulamin</a><a href="/polityka-prywatnosci">Polityka prywatności</a><a href="https://zarembatech.pl" target="_blank" rel="noreferrer">Administracja techniczna: ZarembaTECH</a></div></div></footer>
    </main>
  );
}

export function TermsPage() { return <LegalLayout kind="terms" />; }
export function PrivacyPolicyPage() { return <LegalLayout kind="privacy" />; }
