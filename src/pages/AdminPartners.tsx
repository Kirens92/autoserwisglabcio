import { useEffect, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ExternalLink, Handshake, ImagePlus, Plus, Save, ShieldCheck, Trash2, Upload } from "lucide-react";
import AdminPanelShell from "@/components/AdminPanelShell";
import { createPartner, defaultPartnersContent, normalizePartnersContent, type Partner, type PartnersContent } from "@/lib/partners";

const fieldClass = "w-full border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#dca92c]/60 focus:ring-1 focus:ring-[#dca92c]/20";
const textareaClass = `${fieldClass} min-h-[130px] resize-y leading-6`;

export default function AdminPartners() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [siteData, setSiteData] = useState<Record<string, unknown>>({});
  const [content, setContent] = useState<PartnersContent>(defaultPartnersContent);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const response = await fetch("/api/site-content", { cache: "no-store" });
    const data = await response.json();
    setSiteData(data && typeof data === "object" ? data : {});
    setContent(normalizePartnersContent(data?.partners));
    setDirty(false);
  };

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then(async (session) => {
        const authenticated = Boolean(session.authenticated);
        setAuth(authenticated);
        if (authenticated) await load();
      })
      .catch(() => setAuth(false));
  }, []);

  const patchContent = (next: PartnersContent) => {
    setContent(next);
    setDirty(true);
    setMessage("");
  };

  const updateSection = (key: "eyebrow" | "title" | "description", value: string) => {
    patchContent({ ...content, [key]: value });
  };

  const updatePartner = <K extends keyof Partner>(index: number, key: K, value: Partner[K]) => {
    patchContent({
      ...content,
      items: content.items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    });
  };

  const addPartner = () => {
    patchContent({ ...content, items: [...content.items, createPartner()] });
  };

  const removePartner = (index: number) => {
    patchContent({ ...content, items: content.items.filter((_, itemIndex) => itemIndex !== index) });
  };

  const movePartner = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= content.items.length) return;
    const items = [...content.items];
    [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
    patchContent({ ...content, items });
  };

  const upload = async (index: number, key: "logo" | "image", event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage(`Wysyłanie pliku ${file.name}…`);
    try {
      const response = await fetch(`/api/admin/upload?name=${encodeURIComponent(file.name)}`, { method: "POST", body: file });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Nie udało się wysłać pliku.");
      updatePartner(index, key, data.image);
      setMessage(key === "logo" ? "Logo zostało wgrane." : "Grafika partnera została wgrana.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się wysłać pliku.");
    } finally {
      event.target.value = "";
    }
  };

  const save = async () => {
    if (content.items.some((item) => !item.name.trim())) {
      setMessage("Każdy partner musi mieć nazwę firmy.");
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const payload = { ...siteData, partners: content };
      const response = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Nie udało się zapisać partnerów.");
      setSiteData(data);
      setContent(normalizePartnersContent(data.partners));
      setDirty(false);
      setMessage("Partnerzy zostali zapisani. Zmiany są widoczne na stronie głównej i /partnerzy.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nie udało się zapisać partnerów.");
    } finally {
      setSaving(false);
    }
  };

  if (auth === null) return <main className="grid min-h-screen place-items-center bg-[#070807] text-white/40">Ładowanie partnerów…</main>;

  if (!auth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070807] p-6 text-white">
        <div className="w-full max-w-lg border border-[#dca92c]/20 bg-[#0b0c0b] p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-[#e0ad31]" />
          <h1 className="mt-5 text-3xl font-bold">Wymagane logowanie</h1>
          <p className="mt-3 text-sm leading-6 text-white/40">Zarządzanie partnerami jest dostępne po zalogowaniu do panelu administratora.</p>
          <Link to="/admin" className="mt-6 inline-flex bg-[#e0ad31] px-6 py-3 text-sm font-bold text-black">Przejdź do logowania</Link>
        </div>
      </main>
    );
  }

  return (
    <AdminPanelShell activePath="/admin/partnerzy" title="Partnerzy" eyebrow="Współpraca i firmy partnerskie" previewHref="/partnerzy">
      <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-7 lg:flex-row lg:items-end">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#e0ad31]">Partnerzy</div>
            <h1 className="mt-3 font-serif text-4xl font-semibold sm:text-5xl">Zarządzaj partnerami bez edycji kodu.</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/40">Logo i nazwa pojawiają się na stronie głównej. Pełna grafika, opis, strona WWW oraz kontakt są prezentowane na podstronie /partnerzy.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={addPartner} className="inline-flex items-center gap-2 border border-[#dca92c]/35 px-5 py-3 text-xs font-bold text-[#e0ad31]"><Plus className="h-4 w-4" />Dodaj partnera</button>
            <button type="button" onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 bg-[#e0ad31] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.08em] text-black disabled:cursor-not-allowed disabled:opacity-35"><Save className="h-4 w-4" />{saving ? "Zapisywanie…" : dirty ? "Zapisz zmiany" : "Zapisano"}</button>
          </div>
        </div>

        <section className="mt-6 border border-white/10 bg-[#0b0c0b] p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3"><Handshake className="h-5 w-5 text-[#e0ad31]" /><div><h2 className="text-lg font-bold">Nagłówek sekcji</h2><p className="mt-1 text-xs text-white/30">Te treści są używane na stronie głównej i na podstronie partnerów.</p></div></div>
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Mały nagłówek</span><input className={fieldClass} value={content.eyebrow} onChange={(e) => updateSection("eyebrow", e.target.value)} /></label>
            <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Tytuł</span><input className={fieldClass} value={content.title} onChange={(e) => updateSection("title", e.target.value)} /></label>
          </div>
          <label className="mt-4 block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Opis sekcji</span><textarea className={textareaClass} value={content.description} onChange={(e) => updateSection("description", e.target.value)} /></label>
        </section>

        <div className="mt-6 space-y-5">
          {content.items.length === 0 && <div className="border border-dashed border-white/15 p-12 text-center text-sm text-white/35">Nie dodano jeszcze żadnego partnera.</div>}

          {content.items.map((partner, index) => (
            <section key={partner.id} className="overflow-hidden border border-white/10 bg-[#0b0c0b]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div><div className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#e0ad31]">Partner {String(index + 1).padStart(2, "0")}</div><div className="mt-1 text-sm font-bold">{partner.name || "Nowy partner"}</div></div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => movePartner(index, -1)} disabled={index === 0} className="border border-white/10 p-2 text-white/45 hover:text-white disabled:opacity-20" title="Przesuń wyżej"><ArrowUp className="h-4 w-4" /></button>
                  <button type="button" onClick={() => movePartner(index, 1)} disabled={index === content.items.length - 1} className="border border-white/10 p-2 text-white/45 hover:text-white disabled:opacity-20" title="Przesuń niżej"><ArrowDown className="h-4 w-4" /></button>
                  <button type="button" onClick={() => removePartner(index)} className="border border-red-400/15 p-2 text-red-300/65 hover:bg-red-400/10 hover:text-red-200" title="Usuń partnera"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-[280px_1fr] lg:p-7">
                <div className="space-y-4">
                  <div className="border border-white/10 bg-black/30 p-4">
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">Logo — strona główna</div>
                    <div className="grid min-h-[150px] place-items-center border border-dashed border-white/10 bg-[#070807] p-5">{partner.logo ? <img src={partner.logo} alt="" className="max-h-24 max-w-full object-contain" /> : <Handshake className="h-10 w-10 text-white/15" />}</div>
                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 border border-[#dca92c]/30 px-4 py-2.5 text-xs font-bold text-[#e0ad31]"><Upload className="h-4 w-4" />Wgraj logo<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(index, "logo", e)} /></label>
                  </div>
                  <div className="border border-white/10 bg-black/30 p-4">
                    <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">Grafika — /partnerzy</div>
                    <div className="grid min-h-[170px] place-items-center overflow-hidden border border-dashed border-white/10 bg-[#070807]">{partner.image ? <img src={partner.image} alt="" className="h-[170px] w-full object-cover" /> : <ImagePlus className="h-10 w-10 text-white/15" />}</div>
                    <label className="mt-3 inline-flex cursor-pointer items-center gap-2 border border-[#dca92c]/30 px-4 py-2.5 text-xs font-bold text-[#e0ad31]"><Upload className="h-4 w-4" />Wgraj grafikę<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(index, "image", e)} /></label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Nazwa firmy *</span><input className={fieldClass} value={partner.name} onChange={(e) => updatePartner(index, "name", e.target.value)} placeholder="Nazwa partnera" /></label>
                    <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Strona WWW</span><input className={fieldClass} value={partner.website} onChange={(e) => updatePartner(index, "website", e.target.value)} placeholder="https://firma.pl" /></label>
                    <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Telefon</span><input className={fieldClass} value={partner.phone} onChange={(e) => updatePartner(index, "phone", e.target.value)} placeholder="+48 ..." /></label>
                    <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">E-mail</span><input type="email" className={fieldClass} value={partner.email} onChange={(e) => updatePartner(index, "email", e.target.value)} placeholder="kontakt@firma.pl" /></label>
                  </div>
                  <label className="block"><span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">Opis firmy</span><textarea className={textareaClass} value={partner.description} onChange={(e) => updatePartner(index, "description", e.target.value)} placeholder="Krótki opis firmy, zakres działalności i charakter współpracy…" /></label>

                  <div className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-black/25 p-4">
                    <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-white/60"><input type="checkbox" checked={partner.active} onChange={(e) => updatePartner(index, "active", e.target.checked)} className="h-4 w-4 accent-[#e0ad31]" /><span>Partner widoczny publicznie</span></label>
                    {partner.website && <a href={/^https?:\/\//i.test(partner.website) ? partner.website : `https://${partner.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-[#e0ad31]">Otwórz stronę <ExternalLink className="h-3.5 w-3.5" /></a>}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {message && <div className="sticky bottom-4 mt-6 border border-[#dca92c]/25 bg-[#151208] px-5 py-4 text-sm text-[#f0c85f] shadow-2xl">{message}</div>}
      </div>
    </AdminPanelShell>
  );
}
