export const locales = ["de", "en", "nl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

/** Sprachnamen in der jeweiligen Sprache selbst (PRD A-13). */
export const languageNames: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  nl: "Nederlands",
};
