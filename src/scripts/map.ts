/**
 * Zwei-Klick-Karte (PRD 10.5, P-09): Der iframe entsteht erst nach dem Klick
 * auf "Karte laden". Lädt die Karte nicht innerhalb von 10 s, erscheint der
 * Fehlerzustand mit Link zu Google Maps.
 */

const LOAD_TIMEOUT_MS = 10_000;

function initMap(map: HTMLElement): void {
  const button = map.querySelector<HTMLButtonElement>("[data-map-load]");
  const status = map.querySelector<HTMLElement>("[data-map-status]");
  const error = map.querySelector<HTMLElement>("[data-map-error]");
  const loadingText = map
    .querySelector<HTMLTemplateElement>("[data-map-texts]")
    ?.content.querySelector("[data-loading]")?.textContent;
  const src = map.dataset.mapSrc;
  if (!button || !status || !error || !src) return;

  const setState = (state: "loading" | "active" | "error") => {
    map.dataset.state = state;
  };

  button.addEventListener("click", () => {
    setState("loading");
    status.textContent = loadingText ?? "";
    map.focus();

    const showError = () => {
      iframe.remove();
      status.textContent = "";
      error.hidden = false;
      setState("error");
    };

    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = map.dataset.mapTitle ?? "";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;

    if (!navigator.onLine) {
      showError();
      return;
    }

    const timer = window.setTimeout(showError, LOAD_TIMEOUT_MS);
    iframe.addEventListener(
      "load",
      () => {
        window.clearTimeout(timer);
        status.textContent = "";
        setState("active");
      },
      { once: true },
    );
    map.append(iframe);
  });
}

document.querySelectorAll<HTMLElement>("[data-map]").forEach(initMap);
