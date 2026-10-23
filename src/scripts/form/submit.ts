/**
 * Versand der Anfrage. Schnittstelle für Demo- und späteren Versandmodus
 * (PRD 10.4, 12.3, E-02). Ein Versand-Adapter würde die Daten an eine
 * serverlose Funktion schicken und bei Fehlern ablehnen.
 */

export type InquiryData = Readonly<Record<string, string>>;

export interface InquirySubmitter {
  send(data: InquiryData): Promise<void>;
}

const DEMO_DELAY_MS = 800;

/**
 * Demo (E-02): Die Daten verlassen den Browser nicht. Für die Qualitätsprüfung
 * simuliert ?demo=fehler den Zustand "Technischer Fehler" (PRD 10.4).
 */
export const demoSubmitter: InquirySubmitter = {
  send: () =>
    new Promise((resolve, reject) => {
      const fail =
        new URLSearchParams(window.location.search).get("demo") === "fehler";
      window.setTimeout(
        () => (fail ? reject(new Error("Simulierter Fehler")) : resolve()),
        DEMO_DELAY_MS,
      );
    }),
};
