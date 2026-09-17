import { useEffect, useState } from "react";
import { Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "glabcio-cookie-consent";

type ConsentValue = "all" | "necessary";

const updateGtmConsent = (granted: boolean) => {
  const w = window as unknown as {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  w.dataLayer = w.dataLayer || [];
  const gtag = w.gtag || ((...args: unknown[]) => w.dataLayer.push(args));

  gtag("consent", "update", {
    ad_storage: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    analytics_storage: granted ? "granted" : "denied",
  });

  w.dataLayer.push({ event: "cookie_consent", consent: granted ? "all" : "necessary" });
};

const CookieConsent = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) {
      setVisible(false);
      return;
    }

    let saved: ConsentValue | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
    } catch {
      saved = null;
    }

    if (!saved) {
      setVisible(true);
    } else {
      updateGtmConsent(saved === "all");
    }
  }, [location.pathname]);

  useEffect(() => {
    const reopen = () => {
      if (!location.pathname.startsWith("/admin")) {
        setDetailsOpen(true);
        setVisible(true);
      }
    };

    window.addEventListener("glabcio-open-cookie-settings", reopen);
    return () => window.removeEventListener("glabcio-open-cookie-settings", reopen);
  }, [location.pathname]);

  const save = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Consent Mode is still updated for the current page session.
    }

    updateGtmConsent(value === "all");
    setVisible(false);
    setDetailsOpen(false);
  };

  if (!visible || location.pathname.startsWith("/admin")) return null;

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[#dca92c]/35 bg-[#070908]/[0.98] px-4 py-5 shadow-[0_-18px_55px_rgba(0,0,0,.58)] backdrop-blur-xl sm:px-6"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
    >
      <div className="mx-auto grid max-w-[1380px] gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-start">
        <div className="hidden h-11 w-11 place-items-center border border-[#dca92c]/30 bg-[#dca92c]/10 text-[#e5b23a] sm:grid">
          <Cookie className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="pr-9 lg:pr-0">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#dca92c]">Prywatność i cookies</div>
            <h2 id="cookie-consent-title" className="mt-1 text-lg font-bold text-white sm:text-xl">Twoje ustawienia prywatności</h2>
            <p className="mt-2 max-w-4xl text-xs leading-6 text-white/55 sm:text-sm">
              Używamy niezbędnych mechanizmów do prawidłowego i bezpiecznego działania strony. Google Tag Manager działa z domyślnie zablokowaną zgodą na analitykę i reklamę; dodatkowe kategorie uruchamiamy dopiero po Twojej zgodzie. Szczegóły znajdziesz w <a href="/polityka-cookies" className="font-semibold text-[#e5b23a] underline underline-offset-4">Polityce plików cookies</a>.
            </p>
          </div>

          {detailsOpen && (
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              <div className="flex gap-3 border border-white/10 bg-white/[0.025] p-3.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#e5b23a]" />
                <div><strong className="text-xs text-white">Niezbędne — zawsze aktywne</strong><p className="mt-1 text-[11px] leading-5 text-white/45">Zapamiętanie decyzji, bezpieczeństwo i podstawowe funkcje strony.</p></div>
              </div>
              <div className="flex gap-3 border border-white/10 bg-white/[0.025] p-3.5">
                <Settings2 className="mt-0.5 h-5 w-5 shrink-0 text-[#e5b23a]" />
                <div><strong className="text-xs text-white">Analityczne i reklamowe — za zgodą</strong><p className="mt-1 text-[11px] leading-5 text-white/45">Zgoda przekazywana jest do Google Consent Mode i może sterować tagami skonfigurowanymi w GTM.</p></div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:max-w-[390px] lg:justify-end">
          <button
            type="button"
            onClick={() => save("all")}
            className="min-h-11 bg-[#e0ad31] px-5 text-xs font-extrabold uppercase tracking-[0.08em] text-black transition hover:bg-[#efbd47]"
          >
            Akceptuję wszystkie
          </button>
          <button
            type="button"
            onClick={() => save("necessary")}
            className="min-h-11 border border-[#dca92c]/35 px-5 text-xs font-bold uppercase tracking-[0.08em] text-[#e5b23a] transition hover:bg-[#dca92c]/10"
          >
            Tylko niezbędne
          </button>
          <button
            type="button"
            onClick={() => setDetailsOpen((value) => !value)}
            className="min-h-10 px-2 text-xs font-semibold text-white/55 underline decoration-white/20 underline-offset-4 transition hover:text-white"
          >
            {detailsOpen ? "Ukryj ustawienia" : "Ustawienia cookies"}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => save("necessary")}
        className="absolute right-4 top-4 grid h-8 w-8 place-items-center text-white/35 transition hover:text-white sm:right-6"
        aria-label="Zamknij i pozostaw tylko niezbędne cookies"
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
};

export default CookieConsent;
