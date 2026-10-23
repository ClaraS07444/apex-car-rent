/**
 * Zentrale Motion-Logik (PRD 9.7, T-06): Scroll-Animationen über data-reveal
 * und der Start einfahrender Fahrzeuge über data-drive-in. Bewegt werden nur transform und opacity;
 * Dauern und Kurven kommen aus den CSS-Tokens.
 */

const DRIVE_IN_TIMEOUT_MS = 1500;

/** Elemente erscheinen einmal, sobald sie 85 % der Viewport-Höhe erreichen. */
function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -15% 0px" },
  );

  for (const target of targets) observer.observe(target);
}

/**
 * Ein Fahrzeug fährt los, sobald sein Bild dekodiert ist, spätestens nach
 * 1,5 s. Ist es dann noch nicht geladen, bleibt es verborgen und blendet nach
 * dem Laden in 300 ms ein (PRD 10.5).
 */
function startDriveIn(car: HTMLElement): void {
  const image = car.querySelector("img");
  if (!image) return;

  const setState = (state: "drive" | "wait" | "fade") => {
    car.dataset.state = state;
  };

  const decoded = image.decode().then(
    () => true,
    () => false,
  );
  const timeout = new Promise<false>((resolve) =>
    window.setTimeout(() => resolve(false), DRIVE_IN_TIMEOUT_MS),
  );

  void Promise.race([decoded, timeout]).then((ready) => {
    if (ready) {
      setState("drive");
      return;
    }
    setState("wait");
    const reveal = () => setState("fade");
    image.addEventListener("load", reveal, { once: true });
    image.addEventListener("error", reveal, { once: true });
    if (image.complete) reveal();
  });
}

document.documentElement.classList.add("motion-ready");
initReveal();
document.querySelectorAll<HTMLElement>("[data-drive-in]").forEach(startDriveIn);
