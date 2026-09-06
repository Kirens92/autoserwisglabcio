import { FormEvent, useEffect, useState } from "react";

type Service = { icon: string; title: string; description: string; items?: string[] };
const icons = ["Wrench", "Zap", "Monitor", "Fuel", "Cpu"];
const emptyService = (): Service => ({ icon: "Cpu", title: "", description: "", items: [] });

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const load = () => fetch("/api/services").then((r) => r.json()).then(setServices);
  useEffect(() => { fetch("/api/admin/session").then((r) => r.json()).then((data) => { setAuthenticated(data.authenticated); if (data.authenticated) load(); }); }, []);
  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ login, password }) });
    if (response.ok) { setAuthenticated(true); setPassword(""); load(); } else setMessage("Nieprawidłowy login lub hasło.");
  };
  const save = async () => {
    const response = await fetch("/api/admin/services", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(services) });
    setMessage(response.ok ? "Zapisano zmiany." : "Nie udało się zapisać zmian.");
  };
  if (!authenticated) return <main className="min-h-screen bg-background text-foreground grid place-items-center p-6"><form onSubmit={submitLogin} className="w-full max-w-sm border gold-border bg-card p-8 space-y-4"><h1 className="font-heading text-3xl">Panel usług</h1><input required value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" className="w-full p-3 bg-background border gold-border" /><input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Hasło" className="w-full p-3 bg-background border gold-border" /><button className="w-full p-3 bg-primary text-primary-foreground">Zaloguj</button><p>{message}</p></form></main>;
  return <main className="min-h-screen bg-background text-foreground p-6 md:p-12"><div className="max-w-4xl mx-auto"><h1 className="font-heading text-4xl mb-8">Edytor usług</h1><div className="space-y-6">{services.map((service, index) => <section key={index} className="border gold-border p-5 space-y-3"><input value={service.title} onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, title: e.target.value } : s))} placeholder="Tytuł" className="w-full p-3 bg-card border gold-border" /><select value={service.icon} onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, icon: e.target.value } : s))} className="p-3 bg-card border gold-border">{icons.map((icon) => <option key={icon}>{icon}</option>)}</select><textarea value={service.description} onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, description: e.target.value } : s))} placeholder="Opis" className="w-full p-3 bg-card border gold-border min-h-28" /><textarea value={(service.items || []).join("\n")} onChange={(e) => setServices(services.map((s, i) => i === index ? { ...s, items: e.target.value.split("\n").filter(Boolean) } : s))} placeholder="Punkty listy — jeden w wierszu" className="w-full p-3 bg-card border gold-border min-h-24" /><button onClick={() => setServices(services.filter((_, i) => i !== index))} className="text-red-400">Usuń kafelek</button></section>)}</div><div className="flex gap-4 mt-8"><button onClick={() => setServices([...services, emptyService()])} className="p-3 border gold-border">Dodaj kafelek</button><button onClick={save} className="p-3 bg-primary text-primary-foreground">Zapisz</button></div><p className="mt-4">{message}</p></div></main>;
}
