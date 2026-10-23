import { getImage } from "astro:assets";
import type { Locale } from "../i18n/locales";
import { routes, type PageKey } from "../i18n/routes";
import {
  getActiveVehicles,
  getBusiness,
  getFaq,
  getPricing,
  getUi,
  t,
} from "./content";
import { formatPrice } from "./format";
import { absoluteUrl } from "./seo";

/**
 * Strukturierte Daten als JSON-LD (PRD 13.3), alle Werte aus den
 * Datenquellen (T-02). Fiktive Bewertungen werden bewusst nicht ausgezeichnet.
 * Instagram fehlt als sameAs, weil der Name fiktiv ist (E-03, PRD 16).
 */

type JsonLd = Record<string, unknown>;

async function autoRental(locale: Locale, site: URL): Promise<JsonLd> {
  const [business, pricing] = await Promise.all([getBusiness(), getPricing()]);
  const { address, geo } = business;
  const prices = [
    pricing.packages.tag.price,
    pricing.packages.wochenende.price,
    pricing.packages.woche.price,
    pricing.packages.langzeit.pricePerMonth,
  ];
  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": absoluteUrl("/#apex-rent", site),
    name: business.name,
    url: absoluteUrl(routes.home[locale], site),
    image: absoluteUrl("/og/startseite.jpg", site),
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressCountry: address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHoursSpecification: business.openingHours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
      opens: slot.opens,
      closes: slot.closes,
    })),
    priceRange: `${formatPrice(Math.min(...prices), locale)} – ${formatPrice(Math.max(...prices), locale)}`,
  };
}

async function cars(locale: Locale, site: URL): Promise<JsonLd[]> {
  const [vehicles, pricing, ui] = await Promise.all([
    getActiveVehicles(),
    getPricing(),
    getUi(),
  ]);
  const packages = ["tag", "wochenende", "woche"] as const;
  return Promise.all(
    vehicles.map(async ({ data }) => {
      const image = await getImage({
        src: data.image,
        width: 1200,
        format: "webp",
      });
      return {
        "@context": "https://schema.org",
        "@type": "Car",
        name: t(data.name, locale),
        brand: { "@type": "Brand", name: data.brand },
        model: data.model,
        color: t(data.colorName, locale),
        image: absoluteUrl(image.src, site),
        seatingCapacity: data.seats,
        vehicleTransmission: t(data.transmission, locale),
        offers: packages.map((key) => ({
          "@type": "Offer",
          name: t(ui.packages[key], locale),
          price: pricing.packages[key].price,
          priceCurrency: pricing.currency,
          seller: { "@id": absoluteUrl("/#apex-rent", site) },
        })),
      };
    }),
  );
}

async function faqPage(locale: Locale): Promise<JsonLd> {
  const entries = await getFaq(locale);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

export async function getStructuredData(
  page: PageKey,
  locale: Locale,
  site: URL,
): Promise<JsonLd[]> {
  switch (page) {
    case "home":
    case "contact":
      return [await autoRental(locale, site)];
    case "vehicles":
      return [
        await autoRental(locale, site),
        ...(await cars(locale, site)),
        await faqPage(locale),
      ];
    default:
      return [];
  }
}

/** JSON für ein script-Element; "<" maskiert, damit nichts das Element beendet. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
