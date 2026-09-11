async function getWorkshopAddress() {
  const fallback = "Raszkowska 53, 63-400 Ostrów Wielkopolski";

  try {
    const response = await fetch("/api/site-content", { cache: "no-store" });
    if (!response.ok) throw new Error("site content unavailable");
    const data = await response.json();
    const business = data?.business || {};
    const address = [business.street, business.postalCode, business.city].filter(Boolean).join(" ").trim();
    return address || fallback;
  } catch {
    return fallback;
  }
}

function buildWorkshopMapUrl(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

function buildWorkshopDirectionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;
}

async function ensureHomepageWorkshopMap() {
  const page = document.querySelector<HTMLElement>(".home-page");
  const grid = page?.querySelector<HTMLElement>(".home-contact__grid");
  if (!page || !grid || page.querySelector(".home-workshop-map")) return;

  const card = document.createElement("section");
  card.className = "home-workshop-map";
  card.innerHTML = `
    <div class="home-workshop-map__heading">
      <span>Znajdź nas</span>
      <h3>Zobacz, gdzie jesteśmy</h3>
      <p>Auto Serwis Gl@bcio · Raszkowska 53 · 63-400 Ostrów Wielkopolski</p>
      <a class="home-workshop-map__directions" href="#" target="_blank" rel="noopener noreferrer" aria-label="Wyznacz trasę do Auto Serwis Gl@bcio w Google Maps">
        <span class="home-workshop-map__directions-icon" aria-hidden="true">➤</span>
        <span><strong>Wyznacz trasę</strong><small>Otwórz Google Maps i prowadź do warsztatu</small></span>
      </a>
    </div>
    <div class="home-workshop-map__frame">
      <iframe
        title="Mapa dojazdu do Auto Serwis Gl@bcio"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>
    </div>
  `;

  grid.appendChild(card);

  const address = await getWorkshopAddress();
  const iframe = card.querySelector<HTMLIFrameElement>("iframe");
  const directions = card.querySelector<HTMLAnchorElement>(".home-workshop-map__directions");
  const addressLine = card.querySelector<HTMLParagraphElement>(".home-workshop-map__heading p");

  if (iframe) iframe.src = buildWorkshopMapUrl(address);
  if (directions) directions.href = buildWorkshopDirectionsUrl(address);
  if (addressLine) addressLine.textContent = `Auto Serwis Gl@bcio · ${address}`;
}

function hydrateWorkshopMap() {
  void ensureHomepageWorkshopMap();
}

requestAnimationFrame(hydrateWorkshopMap);

const root = document.getElementById("root");
if (root) {
  const mapObserver = new MutationObserver(hydrateWorkshopMap);
  mapObserver.observe(root, { childList: true, subtree: true });
}
