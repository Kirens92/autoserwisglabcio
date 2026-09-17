import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  Cpu,
  Eye,
  FileText,
  Handshake,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Wrench,
} from "lucide-react";
import logo from "@/assets/nowelogo.png";

const items = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/strona", "Strona główna", FileText],
  ["/admin/ecu-tcu", "ECU | TCU", Cpu],
  ["/admin/uslugi", "Usługi", Wrench],
  ["/admin/realizacje", "Realizacje", ImagePlus],
  ["/admin/partnerzy", "Partnerzy", Handshake],
  ["/admin/opinie", "Opinie Google", Star],
  ["/admin/seo", "SEO", BarChart3],
  ["/admin/ustawienia", "Ustawienia", Settings],
] as const;

type Props = {
  activePath: string;
  title: string;
  eyebrow: string;
  previewHref?: string;
  children: ReactNode;
};

export default function AdminPanelShell({ activePath, title, eyebrow, previewHref, children }: Props) {
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin";
  };

  return (
    <main className="min-h-screen bg-[#070807] text-white">
      <div className="grid min-h-screen xl:grid-cols-[230px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#090a09] xl:flex xl:flex-col">
          <div className="border-b border-white/10 px-6 py-5">
            <img src={logo} alt="Auto Serwis Gl@bcio" className="h-14 w-auto object-contain" />
            <div className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/25">Panel Administratora</div>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {items.map(([href, label, Icon]) => {
              const active = href === activePath;
              return (
                <Link
                  key={href}
                  to={href}
                  className={`flex items-center gap-3 rounded-sm px-4 py-3 text-sm transition ${active ? "border border-[#dca92c]/35 bg-[#dca92c]/10 font-bold text-[#e6b43a]" : "text-white/48 hover:bg-white/[0.035] hover:text-white"}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-5">
            <div className="text-xs font-bold">Auto Serwis Gl@bcio</div>
            <div className="mt-1 text-[10px] text-white/25">CMS · v2</div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090a09]/96 backdrop-blur-xl">
            <div className="flex min-h-[70px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div>
                <div className="text-lg font-bold">{title}</div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/28">{eyebrow}</div>
              </div>
              <div className="flex items-center gap-2">
                {previewHref && (
                  <a
                    href={previewHref}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white/55 transition hover:border-[#dca92c]/40 hover:text-[#dca92c] sm:inline-flex"
                  >
                    <Eye className="h-4 w-4" /> Podgląd
                  </a>
                )}
                <button onClick={logout} className="inline-flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs text-white/45 hover:text-white">
                  <LogOut className="h-4 w-4" /> Wyloguj
                </button>
              </div>
            </div>
            <div className="overflow-x-auto border-t border-white/5 xl:hidden">
              <nav className="flex min-w-max gap-1 px-3 py-2">
                {items.map(([href, label, Icon]) => {
                  const active = href === activePath;
                  return (
                    <Link key={href} to={href} className={`inline-flex items-center gap-2 px-3 py-2 text-xs ${active ? "bg-[#dca92c]/12 font-bold text-[#e6b43a]" : "text-white/42"}`}>
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
