import { locales, defaultLocale, type Locale } from "../i18n/locales";
import { routes, type PageKey } from "../i18n/routes";
import {
  fill,
  getActiveVehicles,
  getPricing,
  getSeo,
  getUi,
  t,
} from "./content";
import { formatPower, formatPrice } from "./format";

/**
 * Meta-Daten je Seite und Sprache (PRD 13.1, 13.2): Titel, Beschreibung,
 * Canonical, hreflang und Open Graph. Beschreibungen enthalten Platzhalter
 * für Preise und Leistung, damit sie mit den Daten übereinstimmen (T-02).
 */

const DESCRIPTION_LENGTH = { min: 140, max: 160 };

const OG_LOCALE: Record<Locale, string> = {
  de: "de_DE",
  en: "en_GB",
  nl: "nl_NL",
};

/** Open-Graph-Bilder aus scripts/make-og-images.mjs (1200 x 630) */
const OG_IMAGE: Record<PageKey, string> = {
  home: "/og/startseite.jpg",
  vehicles: "/og/fahrzeuge.jpg",
  contact: "/og/kontakt.jpg",
  legalNotice: "/og/rechtliches.jpg",
  privacy: "/og/rechtliches.jpg",
  notFound: "/og/startseite.jpg",
};

/** Fahrzeug, das auf dem OG-Bild der Seite zu sehen ist (Alt-Text) */
const OG_VEHICLE: Partial<Record<PageKey, string>> = {
  home: "silber",
  vehicles: "schwarz",
  contact: "rot",
  notFound: "silber",
};

export interface PageSeo {
  title: string;
  description: string;
  /** null auf der 404-Seite: kein Canonical, keine Alternativen */
  canonical: string | null;
  alternates: { hreflang: string; href: string }[];
  og: {
    image: string;
    imageAlt: string;
    locale: string;
    localeAlternates: string[];
  };
}

export function absoluteUrl(path: string, site: URL): string {
  return new URL(path, site).href;
}

export async function getPageSeo(
  page: PageKey,
  locale: Locale,
  site: URL,
): Promise<PageSeo> {
  const [seo, ui, pricing, vehicles] = await Promise.all([
    getSeo(),
    getUi(),
    getPricing(),
    getActiveVehicles(),
  ]);
  const meta = seo[page];
  const price = (amount: number) => formatPrice(amount, locale);
  const power = vehicles[0]
    ? formatPower(
        vehicles[0].data.powerPs,
        t(ui.vehicle.powerUnit, locale),
        locale,
      )
    : "";

  const title = t(meta.title, locale);
  const description = fill(t(meta.description, locale), {
    day: price(pricing.packages.tag.price),
    weekend: price(pricing.packages.wochenende.price),
    week: price(pricing.packages.woche.price),
    power,
  });

  // Ändern sich Preise, kann eine Beschreibung aus dem Rahmen fallen:
  // dann lieber den Build abbrechen als zu kurze oder abgeschnittene Texte.
  const { min, max } = DESCRIPTION_LENGTH;
  if (description.length < min || description.length > max) {
    throw new Error(
      `Meta-Beschreibung ${page}/${locale} hat ${description.length} Zeichen (erlaubt ${min} bis ${max}): ${description}`,
    );
  }

  const indexable = page !== "notFound";
  const alternates = indexable
    ? [
        ...locales.map((code) => ({
          hreflang: code,
          href: absoluteUrl(routes[page][code], site),
        })),
        {
          hreflang: "x-default",
          href: absoluteUrl(routes[page][defaultLocale], site),
        },
      ]
    : [];

  const ogVehicle = vehicles.find((v) => v.id === OG_VEHICLE[page]);

  return {
    title,
    description,
    canonical: indexable ? absoluteUrl(routes[page][locale], site) : null,
    alternates,
    og: {
      image: absoluteUrl(OG_IMAGE[page], site),
      imageAlt: ogVehicle ? t(ogVehicle.data.alt, locale) : "Apex Rent",
      locale: OG_LOCALE[locale],
      localeAlternates: locales
        .filter((code) => code !== locale)
        .map((code) => OG_LOCALE[code]),
    },
  };
}
