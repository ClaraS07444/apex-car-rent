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
    // PRD 8.2 F4: Mietvoraussetzungen, auch im Overlay, in den FAQ und im Formular
    requirements: z.strictObject({
      minimumAge: z.number().int().min(18),
      licenseYears: z.number().int().min(1),
    }),
    // PRD 10.1: Buchungsvorlauf bis 12 Monate, Übergabe 09:00 bis 18:00
    booking: z
      .strictObject({
        windowMonths: z.number().int().min(1),
        handoverFirstHour: z.number().int().min(0).max(23),
        handoverLastHour: z.number().int().min(0).max(23),
      })
      .refine((b) => b.handoverFirstHour <= b.handoverLastHour, {
        message: "handoverFirstHour muss vor handoverLastHour liegen",
      }),
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
        maxMonths: z.number().int().min(1).max(24),
      }),
    }),
    extraKmPrice: euro,
    // PRD 10.1 Feld 7: wählbare Zusatzkilometer
    extraKmOptions: z.array(km).min(1),
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
      requestVehicle: localized,
      contact: localized,
    }),
    packages: z.strictObject({
      tag: localized,
      wochenende: localized,
      woche: localized,
      langzeit: localized,
    }),
    vehicle: z.strictObject({
      powerUnit: localized,
      priceFromPerDay: localized,
      allBooked: localized,
      specs: z.strictObject({
        power: localized,
        transmission: localized,
        drivetrain: localized,
        seats: localized,
      }),
      includedKm: localized,
      perMonth: localized,
    }),
    prices: z.strictObject({
      columns: z.strictObject({
        package: localized,
        period: localized,
        price: localized,
        includedKm: localized,
      }),
      periods: z.strictObject({
        tag: localized,
        wochenende: localized,
        woche: localized,
        langzeit: localized,
      }),
      fromPrice: localized,
      extrasHeading: localized,
      delivery: localized,
      pickup: localized,
      extraKm: localized,
      perKm: localized,
      vouchers: localized,
      deposit: localized,
      vatIncluded: localized,
    }),
    legalUpdated: localized,
    notFound: z.strictObject({
      title: localized,
      text: localized,
      home: localized,
    }),
    dialog: z.strictObject({
      close: localized,
      previous: localized,
      next: localized,
      specs: localized,
      prices: localized,
      conditions: localized,
      conditionsSummary: localized,
      conditionsLink: localized,
    }),
  }),
});

// PRD 8.2 F5: FAQ, Antworten dürfen Platzhalter wie {deposit} enthalten
const faq = defineCollection({
  loader: file("src/content/faq.json"),
  schema: z.strictObject({
    id: z.string(),
    order: z.number().int().nonnegative(),
    question: localized,
    answer: localized,
  }),
});

// Texte der Fahrzeugseite (PRD 8.2); Preise und Daten kommen aus den Daten.
const vehiclesPage = defineCollection({
  loader: singleton("src/content/vehicles-page.json", "vehiclesPage"),
  schema: z.strictObject({
    id: z.literal("vehiclesPage"),
    intro: z.strictObject({
      title: localized,
      text: localized,
      priceAnchor: localized,
    }),
    list: z.strictObject({ heading: localized }),
    prices: z.strictObject({ heading: localized }),
    conditions: z.strictObject({
      heading: localized,
      items: z
        .array(z.strictObject({ title: localized, text: localized }))
        .length(6),
    }),
    faq: z.strictObject({ heading: localized }),
  }),
});

// E-04: fiktive Beispielbewertungen, max. 280 Zeichen (PRD 8.1 S7)
const reviewText = z.strictObject({
  de: text.max(280),
  en: text.max(280),
  nl: text.max(280),
});

// Rechtstexte (PRD S-02): Markdown je Sprache und Seite, z. B. de/impressum.md.
// Offene Angaben stehen als <mark class="placeholder"> im Text (check:launch).
const legal = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "src/content/legal" }),
  schema: z.strictObject({
    title: text,
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format JJJJ-MM-TT"),
  }),
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

// Texte der Kontaktseite und des Anfrageformulars (PRD 8.3, 10)
const contactPage = defineCollection({
  loader: singleton("src/content/contact-page.json", "contactPage"),
  schema: z.strictObject({
    id: z.literal("contactPage"),
    intro: z.strictObject({
      title: localized,
      text: localized,
    }),
    form: z.strictObject({
      heading: localized,
      requiredHint: localized,
      demoNote: localized,
      noscript: localized,
      sections: z.strictObject({
        booking: localized,
        handover: localized,
        person: localized,
      }),
      vehicle: localized,
      vehicleAny: localized,
      package: localized,
      startDate: localized,
      weekendHint: localized,
      returnDate: localized,
      returnDatePending: localized,
      duration: localized,
      durationChoose: localized,
      monthOne: localized,
      monthOther: localized,
      handoverTime: localized,
      noPreference: localized,
      kmLimit: localized,
      kmIncluded: localized,
      kmExtra: localized,
      handover: localized,
      handoverPickup: localized,
      handoverDelivery: localized,
      deliveryAddress: localized,
      returnType: localized,
      returnAachen: localized,
      returnPickup: localized,
      pickupAddress: localized,
      sameAsDelivery: localized,
      occasion: localized,
      occasions: z.strictObject({
        keiner: localized,
        hochzeit: localized,
        event: localized,
        gutschein: localized,
        business: localized,
        fotoshooting: localized,
      }),
      voucherValue: localized,
      voucherHint: localized,
      firstName: localized,
      lastName: localized,
      email: localized,
      phone: localized,
      requirements: localized,
      message: localized,
      messageCounter: localized,
      privacyBefore: localized,
      privacyLink: localized,
      privacyAfter: localized,
      honeypot: localized,
      submit: localized,
      sending: localized,
      errorSummary: localized,
      technicalError: localized,
    }),
    errors: z.strictObject({
      vehicleRequired: localized,
      packageRequired: localized,
      dateRequired: localized,
      dateInvalid: localized,
      dateRange: localized,
      weekendFriday: localized,
      durationRequired: localized,
      addressLength: localized,
      voucherMin: localized,
      nameLength: localized,
      email: localized,
      phone: localized,
      requirements: localized,
      messageLength: localized,
      privacy: localized,
    }),
    preview: z.strictObject({
      heading: localized,
      empty: localized,
      extraKm: localized,
      voucher: localized,
      total: localized,
      deposit: localized,
      disclaimer: localized,
    }),
    success: z.strictObject({
      heading: localized,
      summary: localized,
      again: localized,
    }),
    contact: z.strictObject({
      heading: localized,
    }),
    location: z.strictObject({
      heading: localized,
      route: localized,
      newTab: localized,
      mapNotice: localized,
      mapLoad: localized,
      mapLoading: localized,
      mapError: localized,
      mapErrorLink: localized,
      mapTitle: localized,
    }),
  }),
});

export const collections = {
  business,
  pricing,
  vehicles,
  ui,
  reviews,
  home,
  faq,
  vehiclesPage,
  contactPage,
  legal,
};
