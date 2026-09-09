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

  const widget = document.createElement("div");
  widget.id = WIDGET_CONTAINER_ID;
  widget.className = "home-booking-widget";
  body.appendChild(widget);

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
  const roots = document.querySelectorAll<HTMLElement>(".home-page, .ecu-page, .services-page");
  roots.forEach((root) => {
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
  });
}

function hydrateBookingUi() {
  ensureHomepageBookingTrigger();
  upgradePublicBookingLinks();
  bindBookingTriggers();
}

requestAnimationFrame(hydrateBookingUi);

const bookingObserver = new MutationObserver(hydrateBookingUi);
const root = document.getElementById("root");
if (root) bookingObserver.observe(root, { childList: true, subtree: true });
