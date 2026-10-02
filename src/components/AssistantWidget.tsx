import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SCRIPT_ID = "zarembatech-ai-assistant-widget";

export default function AssistantWidget() {
  const location = useLocation();

  const isAdmin =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  useEffect(() => {
    // Panel administracyjny — widgetu nie ładujemy
    if (isAdmin) {
      return;
    }

    // Zabezpieczenie przed wielokrotnym dodaniem skryptu
    if (document.getElementById(SCRIPT_ID)) {
      return;
    }

    const script = document.createElement("script");

    script.id = SCRIPT_ID;
    script.src = "https://cdn-assistant.zarembatech.pl/widget.js";

    script.dataset.assistantKey = "cmuqjrp6p0007qd5z8xa0uko3";
    script.dataset.apiBase = "https://api-assistant.zarembatech.pl";
    script.dataset.title = "Gl@bcio - Robocik";

    script.defer = true;

    document.body.appendChild(script);
  }, [isAdmin]);

  return null;
}
