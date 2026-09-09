const WIDGET_CONTAINER_ID = "motowarsztat-booking";
const WIDGET_SCRIPT_ID = "motowarsztat-booking-loader";
const MODAL_CLASS = "home-booking-modal";
const OPEN_CLASS = "is-open";
const TRIGGER_SELECTOR = "[data-motowarsztat-booking-trigger]";

let previousBodyOverflow = "";
let keydownBound = false;

function closeBookingModal() {
  const modal = document.querySelector<HTMLElement>(`.${MODAL_CLASS}`);
  if (!modal) return;

  modal.classList.remove(OPEN_CLASS);
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = previousBodyOverflow;
}

function handleBookingKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closeBookingModal();
}

function ensureWidgetScript() {
  if (document.getElementById(WIDGET_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = WIDGET_SCRIPT_ID;
  script.src = "https://app.motowarsztat.pl/booking-widget/loader.js";
  script.async = true;
  script.dataset.key = "auto-serwis-glabcio";
  script.dataset.lang = "pl";
  document.body.appendChild(script);
}

function ensureBookingModal() {
  let modal = document.querySelector<HTMLElement>(`.${MODAL_CLASS}`);
  if (modal) return modal;

  modal = document.createElement("div");
  modal.className = MODAL_CLASS;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-label", "Rezerwacja wizyty online");

  const dialog = document.createElement("section");
  dialog.className = "home-booking-modal__dialog";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "home-booking-modal__close";
  closeButton.setAttribute("aria-label", "Zamknij rezerwację");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", closeBookingModal);

  const heading = document.createElement("div");
  heading.className = "home-booking-modal__heading";
  heading.innerHTML = `
    <span>Rezerwacja online</span>
    <h2>Umów wizytę w dogodnym terminie</h2>
    <p>Wybierz usługę i dostępny termin bezpośrednio w systemie MotoWarsztat.</p>
  `;

  const body = document.createElement("div");
  body.className = "home-booking-modal__body";

  const widgetShell = document.createElement("div");
  widgetShell.className = "home-booking-widget-shell";

  const widget = document.createElement("div");
  widget.id = WIDGET_CONTAINER_ID;
  widget.className = "home-booking-widget";
  widgetShell.appendChild(widget);
  body.appendChild(widgetShell);

  dialog.append(closeButton, heading, body);
  modal.appendChild(dialog);

  modal.addEventListener("mousedown", (event) => {
    if (event.target === modal) closeBookingModal();
  });

  document.body.appendChild(modal);

  if (!keydownBound) {
    document.addEventListener("keydown", handleBookingKeydown);
    keydownBound = true;
  }

  return modal;
}

export function openBookingModal() {
  const modal = ensureBookingModal();
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  modal.classList.add(OPEN_CLASS);
  modal.setAttribute("aria-hidden", "false");
  ensureWidgetScript();

  requestAnimationFrame(() => {
    modal.querySelector<HTMLElement>(".home-booking-modal__close")?.focus();
  });
}

function bindBookingTriggers() {
  document.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR).forEach((trigger) => {
    if (trigger.dataset.motowarsztatBookingBound === "true") return;
    trigger.dataset.motowarsztatBookingBound = "true";
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openBookingModal();
    });
  });
}

async function buildWorkshopMapUrl() {
  const fallback = "Raszkowska 53, 63-400 Ostrów Wielkopolski";

  try {
    const response = await fetch("/api/site-content", { cache: "no-store" });
    if (!response.ok) throw new Error("site content unavailable");
    const data = await response.json();
    const business = data?.business || {};
    const address = [business.street, business.postalCode, business.city].filter(Boolean).join(" ").trim();
    return `https://www.google.com/maps?q=${encodeURIComponent(address || fallback)}&output=embed`;
  } catch {
    return `https://www.google.com/maps?q=${encodeURIComponent(fallback)}&output=embed`;
  }
}

async function ensureHomepageWorkshopMap() {
  const page = document.querySelector<HTMLElement>(".home-page");
  const contactCopy = page?.querySelector<HTMLElement>(".home-contact__copy");
  if (!page || !contactCopy || page.querySelector(".home-workshop-map")) return;

  const card = document.createElement("section");
  card.className = "home-workshop-map";
  card.innerHTML = `
    <div class="home-workshop-map__heading">
      <span>Znajdź nas</span>
      <h3>Umów wizytę w serwisie i zobacz, gdzie jesteśmy</h3>
      <p>Auto Serwis Gl@bcio · Raszkowska 53 · 63-400 Ostrów Wielkopolski</p>
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

  const bookingButton = page.querySelector<HTMLElement>(".home-booking-open");
  if (bookingButton) bookingButton.insertAdjacentElement("afterend", card);
  else contactCopy.appendChild(card);

  const iframe = card.querySelector<HTMLIFrameElement>("iframe");
  if (iframe) iframe.src = await buildWorkshopMapUrl();
}

function ensureHomepageBookingTrigger() {
  const page = document.querySelector<HTMLElement>(".home-page");
  const phoneBox = page?.querySelector<HTMLElement>(".home-contact-phonebox");
  if (!page || !phoneBox) return;

  if (!page.querySelector(".home-booking-open")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "home-btn home-btn--outline home-booking-open";
    button.dataset.motowarsztatBookingTrigger = "true";
    button.innerHTML = "Zarezerwuj wizytę online <span aria-hidden=\"true\">→</span>";
    phoneBox.insertAdjacentElement("afterend", button);
  }
}

function upgradePublicBookingLinks() {
  if (window.location.pathname.startsWith("/admin")) return;
  const root = document.getElementById("root");
  if (!root) return;

  root.querySelectorAll<HTMLAnchorElement | HTMLButtonElement>("a,button").forEach((element) => {
    if (element.dataset.motowarsztatBookingTrigger === "true") return;
    const text = (element.textContent || "").replace(/\s+/g, " ").trim().toLocaleLowerCase("pl");
    const shouldUpgrade = text === "napisz do nas" || text === "napisz e-mail" || text.includes("napisz do nas") || text.includes("napisz e-mail");
    if (!shouldUpgrade) return;

    if (element instanceof HTMLAnchorElement) {
      element.removeAttribute("href");
      element.setAttribute("role", "button");
    }
    element.dataset.motowarsztatBookingTrigger = "true";
    element.textContent = "Zarezerwuj wizytę online";
  });
}

function hydrateBookingUi() {
  ensureHomepageBookingTrigger();
  void ensureHomepageWorkshopMap();
  upgradePublicBookingLinks();
  bindBookingTriggers();
}

requestAnimationFrame(hydrateBookingUi);

const bookingObserver = new MutationObserver(hydrateBookingUi);
const root = document.getElementById("root");
if (root) bookingObserver.observe(root, { childList: true, subtree: true });
