import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * Inhaltsmodell (PRD 12.2). Jede Datei wird beim Build gegen ihr Schema
 * geprüft; ein fehlendes Pflichtfeld oder eine fehlende Übersetzung bricht
 * den Build ab (PRD T-03).
 */

const text = z.string().trim().min(1);

/** Übersetzbarer Text: DE, EN und NL sind Pflicht. */
const localized = z.strictObject({ de: text, en: text, nl: text });

const euro = z.number().int().positive();
const km = z.number().int().positive();
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Format HH:MM");

const weekday = z.enum([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

/** Liest eine JSON-Datei mit genau einem Objekt als einzelnen Eintrag. */
function singleton(path: string, id: string) {
  return file(path, { parser: (raw) => [{ ...JSON.parse(raw), id }] });
}

const business = defineCollection({
  loader: singleton("src/content/business.json", "business"),
  schema: z.strictObject({
    id: z.literal("business"),
    name: text,
    address: z.strictObject({
      street: text,
      postalCode: z.string().regex(/^\d{5}$/),
      city: text,
      country: z.string().regex(/^[A-Z]{2}$/),
    }),
    // E-06: neutraler Kartenpunkt statt Geocoding der fiktiven Adresse
    geo: z.strictObject({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
    phone: z.string().regex(/^\+[\d ]{6,20}$/),
    email: z.email(),
    instagram: z.string().regex(/^@[a-z0-9._]+$/),
    openingHours: z
      .array(
        z
          .strictObject({
            days: z.array(weekday).min(1),
            opens: time,
            closes: time,
          })
          .refine((slot) => slot.opens < slot.closes, {
            message: "opens muss vor closes liegen",
          }),
      )
      .min(1),
    openingHoursNote: localized,
  }),
});

const pricing = defineCollection({
  loader: singleton("src/content/pricing.json", "pricing"),
  schema: z.strictObject({
    id: z.literal("pricing"),
    currency: z.literal("EUR"),
    pricesIncludeVat: z.boolean(),
    packages: z.strictObject({
      tag: z.strictObject({ price: euro, includedKm: km }),
      wochenende: z.strictObject({ price: euro, includedKm: km }),
      woche: z.strictObject({ price: euro, includedKm: km }),
      langzeit: z.strictObject({
        pricePerMonth: euro,
        includedKmPerMonth: km,
      }),
    }),
    extraKmPrice: euro,
    delivery: euro,
    pickup: euro,
    deposit: euro,
    voucherMinimum: euro,
  }),
});

// Dateiname = Fahrzeug-ID = Wert des URL-Parameters ?auto= (PRD 6, 7).
const vehicles = defineCollection({
  loader: glob({ pattern: "*.json", base: "src/content/vehicles" }),
  schema: ({ image }) =>
    z.strictObject({
      active: z.boolean(),
      order: z.number().int().nonnegative(),
      name: localized,
      colorName: localized,
      image: image(),
      alt: localized,
      powerPs: z.number().int().positive(),
      transmission: localized,
      drivetrain: localized,
      seats: z.number().int().positive(),
    }),
});

// Wiederkehrende Oberflächentexte (Navigation, Footer, Hinweise)
const ui = defineCollection({
  loader: singleton("src/content/ui.json", "ui"),
  schema: z.strictObject({
    id: z.literal("ui"),
    skipLink: localized,
    homeLink: localized,
    mainNav: localized,
    menuOpen: localized,
    menuClose: localized,
    languageSwitch: localized,
    pages: z.strictObject({
      home: localized,
      vehicles: localized,
      contact: localized,
      legalNotice: localized,
      privacy: localized,
    }),
    footer: z.strictObject({
      description: localized,
      contactHeading: localized,
      hoursHeading: localized,
      legalNav: localized,
      phone: localized,
      email: localized,
      instagram: localized,
    }),
    conceptNote: localized,
    cta: z.strictObject({
      rent: localized,
      viewCars: localized,
      details: localized,
      request: localized,
      contact: localized,
    }),
    vehicle: z.strictObject({
      powerUnit: localized,
      priceFromPerDay: localized,
      allBooked: localized,
    }),
  }),
});

// E-04: fiktive Beispielbewertungen, max. 280 Zeichen (PRD 8.1 S7)
const reviewText = z.strictObject({
  de: text.max(280),
  en: text.max(280),
  nl: text.max(280),
});

const reviews = defineCollection({
  loader: file("src/content/reviews.json"),
  schema: z.strictObject({
    id: z.string(),
    active: z.boolean(),
    order: z.number().int().nonnegative(),
    name: z.string().regex(/^\p{Lu}\p{Ll}+ \p{Lu}\.$/u, "Vorname und Initial"),
    stars: z.number().int().min(1).max(5),
    date: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Format JJJJ-MM"),
    text: reviewText,
  }),
});

const titled = z.strictObject({ title: localized, text: localized });

// Texte der Startseite (PRD 8.1); Zahlen und Preise kommen aus den Daten.
const home = defineCollection({
  loader: singleton("src/content/home.json", "home"),
  schema: z.strictObject({
    id: z.literal("home"),
    hero: z.strictObject({
      title: localized,
      claimLine1: localized,
      claimLine2: localized,
    }),
    steps: z.strictObject({
      heading: localized,
      items: z.array(titled).length(3),
    }),
    benefits: z.strictObject({
      heading: localized,
      // Titel "510 PS" entsteht aus den Fahrzeugdaten (T-02)
      power: z.strictObject({ text: localized }),
      items: z.array(titled).length(3),
    }),
    fleet: z.strictObject({ heading: localized, subline: localized }),
    services: z.strictObject({
      heading: localized,
      event: z.strictObject({
        title: localized,
        price: localized,
        cta: localized,
      }),
      delivery: z.strictObject({ title: localized, price: localized }),
      voucher: z.strictObject({
        title: localized,
        price: localized,
        cta: localized,
      }),
      longTerm: z.strictObject({
        title: localized,
        price: localized,
        cta: localized,
      }),
    }),
    about: z.strictObject({
      heading: localized,
      text: localized,
      facts: z.strictObject({
        vehicles: localized,
        location: localized,
      }),
    }),
    reviews: z.strictObject({ heading: localized, rating: localized }),
    closing: z.strictObject({ heading: localized, text: localized }),
  }),
});

export const collections = { business, pricing, vehicles, ui, reviews, home };
