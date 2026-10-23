import type { Locale } from "./locales";

/**
 * Einzige Quelle aller URLs (PRD Abschnitt 6). Navigation, Sprachumschalter,
 * hreflang, Canonical und Sitemap lesen später ausschließlich diese Tabelle.
 */
export const routes = {
  home: { de: "/", en: "/en/", nl: "/nl/" },
  vehicles: { de: "/fahrzeuge", en: "/en/cars", nl: "/nl/autos" },
  contact: { de: "/kontakt", en: "/en/contact", nl: "/nl/contact" },
  legalNotice: {
    de: "/impressum",
    en: "/en/legal-notice",
    nl: "/nl/colofon",
  },
  privacy: { de: "/datenschutz", en: "/en/privacy", nl: "/nl/privacy" },
  notFound: { de: "/404", en: "/en/404", nl: "/nl/404" },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof routes;

/** Wandelt einen Pfad in den Parameter der Route [...path] um ("/" wird undefined). */
export function toRouteParam(path: string): string | undefined {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return trimmed === "" ? undefined : trimmed;
}
