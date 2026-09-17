export type Partner = {
  id: string;
  name: string;
  logo: string;
  image: string;
  description: string;
  website: string;
  phone: string;
  email: string;
  active: boolean;
};

export type PartnersContent = {
  eyebrow: string;
  title: string;
  description: string;
  items: Partner[];
};

export const defaultPartnersContent: PartnersContent = {
  eyebrow: "Nasi partnerzy",
  title: "Firmy, z którymi współpracujemy",
  description: "Sprawdzeni partnerzy Auto Serwis Gl@bcio — firmy i marki, z którymi łączy nas współpraca oparta na jakości i zaufaniu.",
  items: [],
};

export function createPartner(): Partner {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `partner-${Date.now()}`,
    name: "",
    logo: "",
    image: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    active: true,
  };
}

export function normalizePartnersContent(input: unknown): PartnersContent {
  const source = input && typeof input === "object" ? input as Partial<PartnersContent> : {};
  const items = Array.isArray(source.items)
    ? source.items
        .filter((item): item is Partner => Boolean(item && typeof item === "object"))
        .map((item) => ({
          id: String(item.id || `partner-${Math.random().toString(36).slice(2)}`),
          name: String(item.name || ""),
          logo: String(item.logo || ""),
          image: String(item.image || ""),
          description: String(item.description || ""),
          website: String(item.website || ""),
          phone: String(item.phone || ""),
          email: String(item.email || ""),
          active: item.active !== false,
        }))
    : [];

  return {
    eyebrow: typeof source.eyebrow === "string" && source.eyebrow.trim() ? source.eyebrow : defaultPartnersContent.eyebrow,
    title: typeof source.title === "string" && source.title.trim() ? source.title : defaultPartnersContent.title,
    description: typeof source.description === "string" && source.description.trim() ? source.description : defaultPartnersContent.description,
    items,
  };
}

export function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
