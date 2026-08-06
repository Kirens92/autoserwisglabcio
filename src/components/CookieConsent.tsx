import { useEffect, useState } from "react";

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
    if (!saved) {
      setVisible(true);
    } else {
      updateGtmConsent(saved === "all");
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "all");
    updateGtmConsent(true);
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(STORAGE_KEY, "necessary");
    updateGtmConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] px-4 sm:px-6 py-4 bg-background/95 backdrop-blur-lg border-t gold-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <p className="text-muted-foreground font-body text-sm leading-relaxed flex-1">
          Używamy plików cookie, aby analizować ruch na stronie i poprawiać jej
          działanie. Możesz zaakceptować wszystkie pliki lub wybrać tylko te
          niezbędne do działania strony.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={reject}
            className="px-5 py-2.5 border border-primary/40 text-primary font-body font-semibold text-xs sm:text-sm tracking-wider uppercase hover:bg-primary/5 transition-all"
          >
            Tylko niezbędne
          </button>
          <button
            onClick={accept}
            className="px-5 py-2.5 bg-gradient-gold text-primary-foreground font-body font-semibold text-xs sm:text-sm tracking-wider uppercase hover:brightness-110 transition-all"
          >
            Akceptuj wszystkie
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
