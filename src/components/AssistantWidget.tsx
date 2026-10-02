import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    ZarembaAssistant?: {
      init?: () => void;
      destroy?: () => void;
    };
  }
}

const SCRIPT_ID = "zarembatech-ai-assistant-script";

export default function AssistantWidget() {
  const location = useLocation();

  const isAdmin =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  useEffect(() => {
    if (isAdmin) {
      window.ZarembaAssistant?.destroy?.();
      return;
    }

    const existingScript = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      window.ZarembaAssistant?.init?.();
      return;
    }

    const script = document.createElement("script");

    script.id = SCRIPT_ID;
    script.src =
      "https://cdn-assistant.zarembatech.pl/widget.js";

    script.dataset.assistantKey =
      "cmuqjrp6p0007qd5z8xa0uko3";

    script.dataset.apiBase =
      "https://api-assistant.zarembatech.pl";

    script.dataset.title = "Gl@bcio - Robocik";

    script.async = true;

    document.body.appendChild(script);

    return () => {
      // celowo nie usuwamy tutaj skryptu
      // kontrolę nad UI ma destroy()
    };
  }, [isAdmin]);

  return null;
}
