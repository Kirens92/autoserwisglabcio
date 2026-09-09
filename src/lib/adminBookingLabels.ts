function replaceExactText(root: HTMLElement, from: string, to: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if ((node.textContent || "").trim() === from) node.textContent = (node.textContent || "").replace(from, to);
    node = walker.nextNode();
  }
}

function updateAdminBookingLabels() {
  if (!window.location.pathname.startsWith("/admin/strona") && !window.location.pathname.startsWith("/admin/seo")) return;
  const root = document.getElementById("root");
  if (!root) return;

  replaceExactText(root, "Kontakt / formularz", "Kontakt / rezerwacja online");
  replaceExactText(root, "Kontakt i formularz", "Kontakt i rezerwacja online");
  replaceExactText(root, "Tytuł formularza", "Tytuł rezerwacji online");
  replaceExactText(root, "Opis formularza", "Opis rezerwacji online");
  replaceExactText(root, "Tekst przycisku formularza", "Tekst przycisku rezerwacji");

  root.querySelectorAll<HTMLElement>("p").forEach((paragraph) => {
    if (paragraph.textContent?.includes("formularzem otwierającym wiadomość e-mail")) {
      paragraph.textContent = "Sekcja końcowa z numerami telefonu, danymi warsztatu i rezerwacją online przez formularz MotoWarsztat.";
    }
  });
}

requestAnimationFrame(updateAdminBookingLabels);
const observer = new MutationObserver(updateAdminBookingLabels);
const root = document.getElementById("root");
if (root) observer.observe(root, { childList: true, subtree: true });
