import { getEntry, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/locales";

type Localized = Record<Locale, string>;

/** Liefert den Text in der gewünschten Sprache (Vollständigkeit prüft das Schema). */
export function t(text: Localized, locale: Locale): string {
  return text[locale];
}

export async function getBusiness(): Promise<
  CollectionEntry<"business">["data"]
> {
  const entry = await getEntry("business", "business");
  if (!entry) throw new Error("src/content/business.json fehlt.");
  return entry.data;
}

export async function getUi(): Promise<CollectionEntry<"ui">["data"]> {
  const entry = await getEntry("ui", "ui");
  if (!entry) throw new Error("src/content/ui.json fehlt.");
  return entry.data;
}
