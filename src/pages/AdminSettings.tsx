import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Database, HardDrive, KeyRound, Server, ShieldCheck } from "lucide-react";
import logo from "@/assets/nowelogobg.png";

export default function AdminSettings() {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((session) => setAuth(Boolean(session.authenticated)))
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return <main className="grid min-h-screen place-items-center bg-[#070807] text-white/40">Ładowanie ustawień…</main>;
  if (!auth) return <main className="grid min-h-screen place-items-center bg-[#070807] p-6 text-white"><div className="border border-[#dca92c]/20 bg-[#0b0c0b] p-8 text-center"><ShieldCheck className="mx-auto h-9 w-9 text-[#e0ad31]" /><h1 className="mt-5 text-2xl font-bold">Wymagane logowanie</h1><p className="mt-3 text-sm text-white/40">Ustawienia systemu są dostępne wyłącznie dla administratora.</p><Link to="/admin" className="mt-5 inline-flex bg-[#e0ad31] px-5 py-3 text-sm font-bold text-black">Przejdź do logowania</Link></div></main>;

  return (
    <main className="min-h-screen bg-[#070807] text-white">
      <header className="border-b border-white/10 bg-[#090a09]">
        <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-4"><img src={logo} alt="Auto Serwis Gl@bcio" className="h-12 w-auto" /><div><div className="text-sm font-bold">Ustawienia systemu</div><div className="text-[10px] uppercase tracking-[0.16em] text-white/25">Gl@bcio CMS</div></div></div>
          <Link to="/admin" className="inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white/50 hover:text-[#e0ad31]"><ArrowLeft className="h-4 w-4" />Dashboard</Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e0ad31]">Konfiguracja produkcyjna</div>
        <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Ustawienia i bezpieczeństwo</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/40">Najważniejsze elementy konfiguracji serwera są przechowywane jako zmienne środowiskowe w Coolify, a nie w publicznej części CMS.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[
            [HardDrive, "Trwałe dane CMS", "DATA_DIR powinien wskazywać katalog z persistent volume. Przechowuje treści, realizacje, ECU/TCU i uploadowane zdjęcia."],
            [KeyRound, "Dostęp administratora", "ADMIN_LOGIN, ADMIN_PASSWORD i SESSION_SECRET są konfigurowane po stronie serwera. Nie wpisuj ich w kodzie strony."],
            [Server, "Google Places", "GOOGLE_PLACES_API_KEY jest używany wyłącznie przez backend do pobierania oceny i opinii Google."],
            [ShieldCheck, "Indeksowanie", "Wersje testowe pozostają z noindex. Po akceptacji projektu ustawiamy index, follow i przełączamy nową stronę na docelowe adresy."],
          ].map(([Icon, title, text]) => <section key={String(title)} className="border border-white/10 bg-[#0b0c0b] p-6"><Icon className="h-6 w-6 text-[#e0ad31]" /><h2 className="mt-4 text-lg font-bold">{String(title)}</h2><p className="mt-3 text-sm leading-7 text-white/40">{String(text)}</p></section>)}
        </div>
        <div className="mt-6 border border-[#dca92c]/20 bg-[#dca92c]/[0.04] p-6"><div className="flex items-start gap-4"><Database className="mt-1 h-6 w-6 shrink-0 text-[#e0ad31]" /><div><h2 className="font-bold">Zalecany persistent volume</h2><code className="mt-3 block border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/65">DATA_DIR=/app/data · volume: /app/data</code><p className="mt-3 text-xs leading-6 text-white/35">Dzięki temu treści i zdjęcia dodawane z panelu nie znikają po redeployu aplikacji.</p></div></div></div>
      </div>
    </main>
  );
}
