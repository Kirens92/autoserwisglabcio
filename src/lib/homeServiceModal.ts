import { openBookingModal } from "./motowarsztatBooking";
import "../pages/HomeServiceModal.css";

type ServiceDetails = {
  icon?: string;
  title: string;
  description?: string;
  image?: string;
  fullDescription?: string;
  faq?: string;
  items?: string[];
};

let cachedServices: ServiceDetails[] | null = null;
let previousBodyOverflow = "";

async function loadServices(): Promise<ServiceDetails[]> {
  if (cachedServices) return cachedServices;
  try {
    const response = await fetch("/api/services", { cache: "no-store" });
    if (!response.ok) throw new Error("services unavailable");
    const data = await response.json();
    cachedServices = Array.isArray(data) ? data : [];
  } catch {
    cachedServices = [];
  }
  return cachedServices;
}

function parseFaq(text?: string) {
  if (!text?.trim()) return [];
  return text
    .split("\n")
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => {
      const [question, ...answerParts] = row.split("|");
      return { question: question.trim(), answer: answerParts.join("|").trim() };
    })
    .filter((row) => row.question && row.answer);
}

function closeModal() {
  const overlay = document.querySelector<HTMLElement>(".home-service-modal");
  if (!overlay) return;
  overlay.remove();
  document.body.style.overflow = previousBodyOverflow;
  document.removeEventListener("keydown", onKeydown);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closeModal();
}

function createText(tag: keyof HTMLElementTagNameMap, className: string, text: string) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function openServiceModal(service: ServiceDetails, fallbackImage?: string) {
  closeModal();

  const overlay = document.createElement("div");
  overlay.className = "home-service-modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", `Szczegóły usługi: ${service.title}`);

  const dialog = document.createElement("article");
  dialog.className = "home-service-modal__dialog";

  const close = document.createElement("button");
  close.type = "button";
  close.className = "home-service-modal__close";
  close.setAttribute("aria-label", "Zamknij szczegóły usługi");
  close.textContent = "×";
  close.addEventListener("click", closeModal);

  const hero = document.createElement("div");
  hero.className = "home-service-modal__hero";
  const image = document.createElement("img");
  image.src = service.image || fallbackImage || "";
  image.alt = service.title;
  const shade = document.createElement("div");
  shade.className = "home-service-modal__shade";
  const heroCopy = document.createElement("div");
  heroCopy.className = "home-service-modal__hero-copy";
  heroCopy.append(
    createText("span", "home-service-modal__eyebrow", "Auto Serwis Gl@bcio"),
    createText("h2", "", service.title),
    createText("p", "", service.description || "Profesjonalna obsługa serwisowa dopasowana do potrzeb Twojego samochodu."),
  );
  hero.append(image, shade, heroCopy);

  const content = document.createElement("div");
  content.className = "home-service-modal__content";

  const main = document.createElement("div");
  main.className = "home-service-modal__main";
  const info = document.createElement("section");
  info.append(
    createText("div", "home-service-modal__section-label", "Pełne informacje"),
    createText("p", "home-service-modal__description", service.fullDescription?.trim() || service.description || "Skontaktuj się z nami, aby poznać szczegóły tej usługi."),
  );
  main.appendChild(info);

  if (Array.isArray(service.items) && service.items.length) {
    const scope = document.createElement("section");
    scope.className = "home-service-modal__scope";
    scope.appendChild(createText("h3", "", "Zakres usługi"));
    const grid = document.createElement("div");
    grid.className = "home-service-modal__scope-grid";
    service.items.forEach((item) => {
      const row = document.createElement("div");
      row.innerHTML = `<span aria-hidden="true">✓</span>`;
      row.appendChild(createText("strong", "", item));
      grid.appendChild(row);
    });
    scope.appendChild(grid);
    main.appendChild(scope);
  }

  const faqRows = parseFaq(service.faq);
  if (faqRows.length) {
    const faq = document.createElement("section");
    faq.className = "home-service-modal__faq";
    faq.appendChild(createText("h3", "", "Najczęstsze pytania"));
    faqRows.forEach((row) => {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = row.question;
      const answer = createText("p", "", row.answer);
      details.append(summary, answer);
      faq.appendChild(details);
    });
    main.appendChild(faq);
  }

  const aside = document.createElement("aside");
  aside.className = "home-service-modal__aside";
  aside.append(
    createText("span", "home-service-modal__aside-label", "Potrzebujesz tej usługi?"),
    createText("strong", "home-service-modal__aside-title", "Umów dogodny termin"),
    createText("p", "home-service-modal__aside-copy", "Wybierz dogodny termin online albo przejdź do pełnej strony usług, aby zobaczyć cały zakres oferty."),
  );

  const actions = document.createElement("div");
  actions.className = "home-service-modal__actions";

  const booking = document.createElement("button");
  booking.type = "button";
  booking.className = "home-service-modal__booking";
  booking.textContent = "Zarezerwuj wizytę online";
  booking.addEventListener("click", () => {
    closeModal();
    openBookingModal();
  });

  const allServices = document.createElement("a");
  allServices.href = "/uslugi";
  allServices.className = "home-service-modal__all";
  allServices.textContent = "Zobacz wszystkie usługi";

  actions.append(booking, allServices);
  aside.appendChild(actions);
  content.append(main, aside);

  dialog.append(close, hero, content);
  overlay.appendChild(dialog);

  overlay.addEventListener("mousedown", (event) => {
    if (event.target === overlay) closeModal();
  });

  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", onKeydown);
  document.body.appendChild(overlay);
  requestAnimationFrame(() => close.focus());
}

export function bindHomepageServiceModals() {
  const page = document.querySelector<HTMLElement>(".home-page");
  if (!page) return;

  const cards = Array.from(page.querySelectorAll<HTMLElement>(".home-service-card"));
  cards.forEach((card, index) => {
    const link = card.querySelector<HTMLAnchorElement>('a[href="/uslugi"]');
    if (!link || link.dataset.serviceModalBound === "true") return;

    link.dataset.serviceModalBound = "true";
    link.setAttribute("aria-haspopup", "dialog");
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const services = await loadServices();
      const title = card.querySelector("h3")?.textContent?.trim() || "Usługa";
      const service = services.find((item) => item.title?.trim() === title) || services[index] || {
        title,
        description: card.querySelector("p")?.textContent?.trim() || "",
      };
      const fallbackImage = card.querySelector<HTMLImageElement>("img")?.src;
      openServiceModal(service, fallbackImage);
    });
  });
}
