const WIDGET_CONTAINER_ID = "motowarsztat-booking";
const WIDGET_SCRIPT_ID = "motowarsztat-booking-loader";

function ensureBookingWidget() {
  const page = document.querySelector<HTMLElement>(".home-page");
  const contactGrid = page?.querySelector<HTMLElement>(".home-contact__grid");
  if (!page || !contactGrid) return;

  let panel = page.querySelector<HTMLElement>(".home-booking-widget-panel");

  if (!panel) {
    panel = document.createElement("section");
    panel.className = "home-booking-widget-panel";
    panel.setAttribute("aria-label", "Rezerwacja wizyty online");

    const heading = document.createElement("div");
    heading.className = "home-booking-widget-panel__heading";
    heading.innerHTML = `
      <span>Rezerwacja online</span>
      <h3>Umów wizytę w dogodnym terminie</h3>
      <p>Wybierz usługę i dostępny termin bezpośrednio w systemie MotoWarsztat.</p>
    `;

    const widget = document.createElement("div");
    widget.id = WIDGET_CONTAINER_ID;
    widget.className = "home-booking-widget";

    panel.append(heading, widget);
    contactGrid.appendChild(panel);
  }

  if (!document.getElementById(WIDGET_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.src = "https://app.motowarsztat.pl/booking-widget/loader.js";
    script.async = true;
    script.dataset.key = "auto-serwis-glabcio";
    script.dataset.lang = "pl";
    document.body.appendChild(script);
  }
}

requestAnimationFrame(ensureBookingWidget);

const bookingObserver = new MutationObserver(ensureBookingWidget);
const root = document.getElementById("root");
if (root) {
  bookingObserver.observe(root, { childList: true, subtree: true });
}
