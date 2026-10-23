import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/locales";

type Localized = Record<Locale, string>;

/** Liefert den Text in der gewünschten Sprache (Vollständigkeit prüft das Schema). */
export function t(text: Localized, locale: Locale): string {
  return text[locale];
}

/** Ersetzt Platzhalter wie {price} oder {power} in einem Text. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

// Einzeldateien: Collection-Name = Eintrags-ID = Dateiname
type Singleton = "business" | "pricing" | "ui" | "home";

async function getSingleton<C extends Singleton>(
  collection: C,
): Promise<CollectionEntry<C>["data"]> {
  const entry = await getEntry(collection, collection);
  if (!entry) throw new Error(`src/content/${collection}.json fehlt.`);
  return entry.data as CollectionEntry<C>["data"];
}

export const getBusiness = () => getSingleton("business");
export const getPricing = () => getSingleton("pricing");
export const getUi = () => getSingleton("ui");
export const getHome = () => getSingleton("home");

/** Aktive Fahrzeuge in der festgelegten Reihenfolge (PRD 12.2). */
export async function getActiveVehicles(): Promise<
  CollectionEntry<"vehicles">[]
> {
  const all = await getCollection("vehicles", ({ data }) => data.active);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Aktive Bewertungen in der festgelegten Reihenfolge. */
export async function getActiveReviews(): Promise<
  CollectionEntry<"reviews">[]
> {
  const all = await getCollection("reviews", ({ data }) => data.active);
  return all.sort((a, b) => a.data.order - b.data.order);
}
