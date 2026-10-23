/**
 * Detail-Overlay der Fahrzeugseite (PRD 8.2 F2, 10.5, 17).
 *
 * Die URL ist die Quelle des Zustands: ?auto=<id> heißt "Overlay offen".
 * Öffnen legt einen Verlaufseintrag an, damit Zurück das Overlay schließt.
 * Kreuz, Escape und Klick auf den Hintergrund gehen denselben Weg zurück.
 * Unbekannte Werte lassen das Overlay geschlossen.
 */

const PARAM = "auto";
const STATE_KEY = "apexVehicle";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const dialogs = new Map<string, HTMLDialogElement>();
for (const dialog of document.querySelectorAll<HTMLDialogElement>(
  "[data-vehicle-dialog]",
)) {
  const id = dialog.dataset.vehicleDialog;
  if (id) dialogs.set(id, dialog);
}
const order = [...dialogs.keys()];

let returnFocusTo: HTMLElement | null = null;
let afterClose: (() => void) | null = null;

function paramFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get(PARAM);
}

function urlFor(id: string | null): string {
  const url = new URL(window.location.href);
  if (id) url.searchParams.set(PARAM, id);
  else url.searchParams.delete(PARAM);
  return url.href;
}

/** Hält URL-abhängige Links (Sprachumschalter) aktuell, siehe nav.ts. */
function announceUrlChange(): void {
  document.dispatchEvent(new CustomEvent("apex:urlchange"));
}

function show(id: string): void {
  const dialog = dialogs.get(id);
  if (!dialog || dialog.open) return;
  dialog.showModal();
  dialog.focus();
}

/** Schließt mit 200ms-Animation; ohne Animation (reduzierte Bewegung) sofort. */
async function hide(dialog: HTMLDialogElement): Promise<void> {
  if (!dialog.open) return;
  if (!reducedMotion.matches) {
    dialog.dataset.closing = "";
    await Promise.allSettled(
      dialog.getAnimations().map((animation) => animation.finished),
    );
    delete dialog.dataset.closing;
  }
  dialog.close();
}

/** Bringt die Dialoge in den Zustand, den die URL beschreibt. */
async function syncWithUrl(): Promise<void> {
  const id = paramFromUrl();
  const target = id && dialogs.has(id) ? id : null;

  for (const [key, dialog] of dialogs) {
    if (dialog.open && key !== target) {
      await hide(dialog);
      if (!target) {
        const fallback = document.querySelector<HTMLElement>(
          `[data-vehicle-open="${key}"]`,
        );
        (returnFocusTo ?? fallback)?.focus();
        returnFocusTo = null;
        afterClose?.();
        afterClose = null;
      }
    }
  }
  if (target) show(target);
  announceUrlChange();
}

function open(id: string, trigger: HTMLElement): void {
  if (!dialogs.has(id)) return;
  returnFocusTo = trigger;
  history.pushState({ [STATE_KEY]: id }, "", urlFor(id));
  void syncWithUrl();
}

/** Schließen geht über den Verlauf zurück, damit Zurück/Vor konsistent bleiben. */
function requestClose(): void {
  if (history.state?.[STATE_KEY]) {
    history.back();
  } else {
    history.replaceState(null, "", urlFor(null));
    void syncWithUrl();
  }
}

/** Pfeile: vorheriges/nächstes Fahrzeug, ohne neuen Verlaufseintrag. */
function step(direction: number): void {
  const current = paramFromUrl();
  if (!current) return;
  const index = order.indexOf(current);
  const next = order[(index + direction + order.length) % order.length];
  history.replaceState({ [STATE_KEY]: next }, "", urlFor(next));
  const dialog = dialogs.get(current);
  if (dialog) dialog.close();
  void syncWithUrl();
}

function init(): void {
  if (dialogs.size === 0) return;

  for (const trigger of document.querySelectorAll<HTMLElement>(
    "[data-vehicle-open]",
  )) {
    trigger.addEventListener("click", () => {
      const id = trigger.dataset.vehicleOpen;
      if (id) open(id, trigger);
    });
  }

  for (const [id, dialog] of dialogs) {
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      requestClose();
    });
    // Schließt der Browser den Dialog selbst (Escape ohne abfangbares cancel),
    // steht ?auto= noch in der URL; dann den Verlauf nachziehen.
    dialog.addEventListener("close", () => {
      if (paramFromUrl() === id) requestClose();
    });
    dialog.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      // Klick auf den abgedunkelten Hintergrund trifft den Dialog selbst
      if (target === dialog) return requestClose();
      if (target.closest("[data-vehicle-close]")) return requestClose();

      const stepButton = target.closest<HTMLElement>("[data-vehicle-step]");
      if (stepButton) return step(Number(stepButton.dataset.vehicleStep));

      const conditions = target.closest<HTMLAnchorElement>(
        "[data-vehicle-conditions]",
      );
      if (conditions) {
        event.preventDefault();
        const section = document.querySelector<HTMLElement>(
          conditions.hash || "#",
        );
        // Erst nach zwei Frames springen: Beim Zurückgehen im Verlauf stellt
        // der Browser zuvor die alte Scrollposition wieder her.
        afterClose = () =>
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              section?.scrollIntoView();
              section
                ?.querySelector<HTMLElement>("h2")
                ?.focus({ preventScroll: true });
            }),
          );
        returnFocusTo = null;
        requestClose();
      }
    });
  }

  // Safari ordnet Klicks auf den Hintergrund während der Öffnungsanimation
  // dem <html> zu statt dem Dialog; daher gilt jeder Klick außerhalb als
  // Hintergrundklick. Nicht dazu zählen der Klick, der den Dialog öffnet, und
  // Klicks in einem Dialog (die behandelt der Dialog selbst, z. B. die Pfeile).
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (
      !(target instanceof Element) ||
      target.closest("[data-vehicle-open], [data-vehicle-dialog]")
    ) {
      return;
    }
    const open = [...dialogs.values()].find((dialog) => dialog.open);
    if (open && !open.contains(target)) requestClose();
  });

  window.addEventListener("popstate", () => void syncWithUrl());

  // Deeplink: Overlay sofort öffnen und einen Eintrag ohne Parameter
  // davorlegen, damit Zurück nur schließt. Firefox legt Einträge, die während
  // des Ladens entstehen, nicht an; daher erst nach dem load-Ereignis.
  const initial = paramFromUrl();
  if (initial && dialogs.has(initial)) {
    show(initial);
    const addHistoryEntry = () => {
      if (paramFromUrl() !== initial) return;
      history.replaceState(null, "", urlFor(null));
      history.pushState({ [STATE_KEY]: initial }, "", urlFor(initial));
      announceUrlChange();
    };
    if (document.readyState === "complete") addHistoryEntry();
    else window.addEventListener("load", addHistoryEntry, { once: true });
  }
}

init();
