import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import glabcioLogo from "./assets/nowelogo.png";
import "./index.css";
import "./pages/NewHomepageBackgroundFix.css";
import "./pages/NewHomepageReadabilityFix.css";
import "./pages/NewHomepagePhoneOnly.css";
import "./pages/NewHomepageBooking.css";
import "./lib/motowarsztatBooking";

const applyBrandLogo = () => {
  document
    .querySelectorAll<HTMLImageElement>(
      'img[alt="Auto Serwis Gl@bcio"], img[alt="Logo Auto Serwis Gl@bcio"]',
    )
    .forEach((image) => {
      if (image.src !== glabcioLogo) {
        image.src = glabcioLogo;
        image.decoding = "async";
      }
    });
};

type PhoneOption = {
  label: string;
  href: string;
};

function normalizePhoneHref(phone: string, href?: string) {
  const source = (href || phone || "").replace(/^tel:/i, "").trim();
  const normalized = source.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : "";
}

async function getPanelPhones(): Promise<PhoneOption[]> {
  try {
    const response = await fetch("/api/site-content", { cache: "no-store" });
    if (!response.ok) throw new Error("site content unavailable");
    const data = await response.json();
    const business = data?.business || {};
    const result: PhoneOption[] = [];

    if (business.phone) {
      const href = normalizePhoneHref(business.phone, business.phoneHref);
      if (href) result.push({ label: String(business.phone), href });
    }

    if (business.phone2) {
      const href = normalizePhoneHref(business.phone2, business.phoneHref2);
      if (href && !result.some((item) => item.href === href)) {
        result.push({ label: String(business.phone2), href });
      }
    }

    if (result.length) return result;
  } catch {
    // Fall back to the numbers already rendered on the page.
  }

  const fallback = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      '.home-page .home-topbar__phones a[href^="tel:"], .home-page .home-contact-phonebox a[href^="tel:"]',
    ),
  )
    .map((anchor) => ({ label: anchor.textContent?.trim() || anchor.href.replace(/^tel:/, ""), href: anchor.href }))
    .filter((item, index, array) => item.href && array.findIndex((entry) => entry.href === item.href) === index);

  return fallback;
}

function openPhonePicker(phones: PhoneOption[]) {
  document.querySelector(".glabcio-phone-modal")?.remove();

  const overlay = document.createElement("div");
  overlay.className = "glabcio-phone-modal";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Wybierz numer telefonu");

  const dialog = document.createElement("div");
  dialog.className = "glabcio-phone-modal__dialog";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "glabcio-phone-modal__close";
  closeButton.setAttribute("aria-label", "Zamknij");
  closeButton.textContent = "×";

  const eyebrow = document.createElement("p");
  eyebrow.className = "glabcio-phone-modal__eyebrow";
  eyebrow.textContent = "Kontakt telefoniczny";

  const title = document.createElement("h2");
  title.textContent = phones.length > 1 ? "Wybierz numer telefonu" : "Zadzwoń do nas";

  const description = document.createElement("p");
  description.textContent = "Dotknij lub kliknij numer, aby rozpocząć połączenie.";

  const phoneList = document.createElement("div");
  phoneList.className = "glabcio-phone-modal__phones";

  phones.slice(0, 2).forEach((phone, index) => {
    const link = document.createElement("a");
    link.href = phone.href;
    link.setAttribute("aria-label", `Zadzwoń pod numer ${phone.label}`);

    const number = document.createElement("span");
    number.textContent = phone.label;
    const action = document.createElement("span");
    action.textContent = index === 0 ? "Zadzwoń" : "Zadzwoń";

    link.append(number, action);
    phoneList.appendChild(link);
  });

  const previousOverflow = document.body.style.overflow;
  const close = () => {
    overlay.remove();
    document.body.style.overflow = previousOverflow;
    document.removeEventListener("keydown", onKeydown);
  };
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };

  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  document.addEventListener("keydown", onKeydown);

  dialog.append(closeButton, eyebrow, title, description, phoneList);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";
  closeButton.focus();
}

const applyPhoneOnlyContact = () => {
  const page = document.querySelector<HTMLElement>(".home-page");
  if (!page) return;

  const contactCopy = page.querySelector<HTMLElement>(".home-contact__copy");
  const phoneBox = page.querySelector<HTMLElement>(".home-contact-phonebox");

  if (contactCopy && phoneBox && !page.querySelector(".home-phone-only-cta")) {
    const callButton = document.createElement("button");
    callButton.type = "button";
    callButton.className = "home-btn home-btn--gold home-phone-only-cta";
    callButton.textContent = "Zadzwoń teraz →";
    phoneBox.insertAdjacentElement("afterend", callButton);
  }

  page.querySelectorAll<HTMLElement>("a, button").forEach((element) => {
    const label = (element.textContent || "").replace(/\s+/g, " ").trim().toLocaleLowerCase("pl");
    if (!label.includes("zadzwoń teraz") || element.dataset.phonePickerBound === "true") return;

    element.dataset.phonePickerBound = "true";
    element.addEventListener("click", async (event) => {
      event.preventDefault();
      const phones = await getPanelPhones();
      if (phones.length) openPhonePicker(phones);
    });
  });
};

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(() => {
  applyBrandLogo();
  applyPhoneOnlyContact();
});

const rootObserver = new MutationObserver(() => {
  applyBrandLogo();
  applyPhoneOnlyContact();
});
rootObserver.observe(document.getElementById("root")!, {
  childList: true,
  subtree: true,
});
