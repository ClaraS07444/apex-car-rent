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
  }),
});

export const collections = { business, pricing, vehicles, ui };
