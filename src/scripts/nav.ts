/**
 * Navigation (PRD 6): Mobile-Menü, verkleinerte Leiste beim Scrollen und
 * Übernahme der URL-Parameter beim Sprachwechsel.
 */

const desktop = window.matchMedia("(min-width: 1024px)");

function initMenu(): void {
  const dialog =
    document.querySelector<HTMLDialogElement>("[data-menu-dialog]");
  const openButton =
    document.querySelector<HTMLButtonElement>("[data-menu-open]");
  const closeButton =
    dialog?.querySelector<HTMLButtonElement>("[data-menu-close]");
  if (!dialog || !openButton || !closeButton) return;

  openButton.addEventListener("click", () => {
    dialog.showModal();
    // Fokus auf den Dialog selbst: Screenreader sagen "Hauptnavigation" an,
    // Tab führt zum ersten Link, beim Antippen erscheint kein Fokusring.
    dialog.focus();
    openButton.setAttribute("aria-expanded", "true");
  });

  closeButton.addEventListener("click", () => dialog.close());

  // Auswahl eines Menüpunkts schließt das Menü; die Navigation läuft normal weiter.
  dialog.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      dialog.close();
    }
  });

  // Gilt für Kreuz, Escape und Linkauswahl: Fokus zurück zum Menü-Button.
  dialog.addEventListener("close", () => {
    openButton.setAttribute("aria-expanded", "false");
    openButton.focus();
  });

  desktop.addEventListener("change", (event) => {
    if (event.matches && dialog.open) dialog.close();
  });
}

function initCondensedHeader(): void {
  const header = document.querySelector<HTMLElement>("[data-site-header]");
  const sentinel = document.querySelector<HTMLElement>(
    "[data-header-sentinel]",
  );
  if (!header || !sentinel) return;

  new IntersectionObserver(([entry]) => {
    header.toggleAttribute("data-condensed", !entry.isIntersecting);
  }).observe(sentinel);
}

function initLanguageLinks(): void {
  const { search } = window.location;
  if (!search) return;

  for (const link of document.querySelectorAll<HTMLAnchorElement>(
    "[data-lang-link]",
  )) {
    const url = new URL(link.href);
    url.search = search;
    link.href = url.href;
  }
}

initMenu();
initCondensedHeader();
initLanguageLinks();
