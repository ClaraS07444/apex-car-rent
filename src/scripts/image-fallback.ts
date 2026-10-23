/**
 * Ladefehler bei Fahrzeugbildern (PRD 10.5): markiert den Rahmen des Bildes,
 * CSS zeigt dann einen Kasten mit dem Fahrzeugnamen. Ein Listener in der
 * Capture-Phase statt onerror-Attributen, damit die Content-Security-Policy
 * keine Inline-Handler erlauben muss.
 */

function markFailed(image: HTMLImageElement): void {
  const frame = image.closest<HTMLElement>("[data-vehicle-image]");
  if (!frame) return;
  // WebKit lässt ein defektes Bild auf Texthöhe schrumpfen; das
  // Seitenverhältnis aus width/height hält die Fläche (kein Layoutsprung).
  // Per CSSOM statt style-Attribut, das die CSP nicht erlaubt.
  const width = Number(image.getAttribute("width"));
  const height = Number(image.getAttribute("height"));
  if (width > 0 && height > 0) frame.style.aspectRatio = `${width} / ${height}`;
  frame.setAttribute("data-failed", "");
}

// error-Ereignisse von Bildern steigen nicht auf, die Capture-Phase erreicht sie
document.addEventListener(
  "error",
  (event) => {
    if (event.target instanceof HTMLImageElement) markFailed(event.target);
  },
  true,
);

// Bilder, die schon vor dem Start dieses Skripts fehlgeschlagen sind;
// noch nicht angefragte (lazy) Bilder haben keine currentSrc.
for (const image of document.querySelectorAll<HTMLImageElement>(
  "[data-vehicle-image] img",
)) {
  if (image.complete && image.naturalWidth === 0 && image.currentSrc) {
    markFailed(image);
  }
}
