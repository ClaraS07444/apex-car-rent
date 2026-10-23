// Unit-Tests der Formularlogik (PRD 10.1 bis 10.3, 17). Node 24 führt die
// TypeScript-Module direkt aus (Typen werden entfernt).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addMonths,
  bookingRange,
  isFriday,
  parseIso,
  returnDate,
} from "../src/scripts/form/dates.ts";
import { estimate } from "../src/scripts/form/pricing.ts";
import { readPrefill } from "../src/scripts/form/prefill.ts";
import { LIMITS, validateForm } from "../src/scripts/form/rules.ts";

const pricing = {
  packages: {
    tag: { price: 2000 },
    wochenende: { price: 3500 },
    woche: { price: 10000 },
    langzeit: { pricePerMonth: 20000 },
  },
  extraKmPrice: 5,
  delivery: 500,
  pickup: 500,
};

const ctx = {
  today: "2026-10-23", // Freitag
  windowMonths: 12,
  maxMonths: 12,
  voucherMinimum: 1000,
};

/** Gültige Werte als Ausgangspunkt; einzelne Tests ändern ein Feld. */
function valid(overrides = {}) {
  return {
    vehicle: "rot",
    package: "tag",
    startDate: "2026-10-30",
    duration: "",
    handover: "abholung",
    deliveryAddress: "",
    return: "aachen",
    pickupAddress: "",
    occasion: "",
    voucherValue: "",
    firstName: "Lea",
    lastName: "Beispiel",
    email: "lea@beispiel.de",
    phone: "+49 241 123456",
    requirements: true,
    message: "",
    privacy: true,
    ...overrides,
  };
}

const input = (overrides = {}) => ({
  package: "tag",
  months: null,
  extraKm: 0,
  delivery: false,
  pickup: false,
  voucher: null,
  ...overrides,
});

// --- Datum -----------------------------------------------------------------

test("parseIso erkennt ungültige Kalenderdaten", () => {
  assert.ok(parseIso("2026-02-28"));
  assert.equal(parseIso("2026-02-30"), null);
  assert.equal(parseIso("30.10.2026"), null);
});

test("Rückgabedatum: Tag +1, Wochenende = Montag, Woche +7, Langzeit keins", () => {
  assert.equal(returnDate("tag", "2026-10-30"), "2026-10-31");
  assert.equal(returnDate("wochenende", "2026-10-30"), "2026-11-02");
  assert.equal(returnDate("woche", "2026-10-30"), "2026-11-06");
  assert.equal(returnDate("langzeit", "2026-10-30"), null);
  assert.equal(returnDate("tag", "kein Datum"), null);
});

test("Buchungsfenster: frühestens morgen, spätestens in 12 Monaten", () => {
  assert.deepEqual(bookingRange("2026-10-23", 12), {
    min: "2026-10-24",
    max: "2027-10-23",
  });
  assert.equal(addMonths("2026-01-31", 1), "2026-02-28");
  assert.equal(addMonths("2027-12-31", 2), "2028-02-29");
});

test("Freitag wird erkannt", () => {
  assert.equal(isFriday("2026-10-30"), true);
  assert.equal(isFriday("2026-10-31"), false);
});

// --- Preisvorschau (PRD 10.3, 17) -------------------------------------------

test("Woche mit +500 km und Lieferung ergibt 13.000 € (PRD 17)", () => {
  const result = estimate(
    input({ package: "woche", extraKm: 500, delivery: true }),
    pricing,
  );
  assert.equal(result.total, 13000);
  assert.equal(result.from, false);
});

test("Lieferung erhöht die Vorschau um 500 €", () => {
  const without = estimate(input(), pricing).total;
  const withDelivery = estimate(input({ delivery: true }), pricing).total;
  assert.equal(withDelivery - without, 500);
});

test("Langzeit: Monatspreis x Monate als ab-Preis", () => {
  const result = estimate(input({ package: "langzeit", months: 3 }), pricing);
  assert.equal(result.total, 60000);
  assert.equal(result.from, true);
  assert.equal(estimate(input({ package: "langzeit" }), pricing), null);
});

test("Gutschein: Vorschau ist der Gutscheinwert", () => {
  const result = estimate(input({ voucher: 1500 }), pricing);
  assert.equal(result.total, 1500);
  assert.deepEqual(result.lines, [{ key: "voucher", amount: 1500 }]);
});

test("ohne Paket keine Vorschau", () => {
  assert.equal(estimate(input({ package: null }), pricing), null);
});

// --- Validierung (PRD 10.1, 10.2) -----------------------------------------

test("gültige Anfrage hat keine Fehler", () => {
  assert.deepEqual(validateForm(valid(), ctx), {});
});

test("leeres Formular meldet alle Pflichtfelder", () => {
  const errors = validateForm(
    valid({
      vehicle: "",
      package: "",
      startDate: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      requirements: false,
      privacy: false,
    }),
    ctx,
  );
  assert.deepEqual(Object.keys(errors).sort(), [
    "email",
    "firstName",
    "lastName",
    "package",
    "phone",
    "privacy",
    "requirements",
    "startDate",
    "vehicle",
  ]);
});

test("Wochenende mit Start an einem Nicht-Freitag wird abgelehnt (PRD 17)", () => {
  const errors = validateForm(
    valid({ package: "wochenende", startDate: "2026-10-31" }),
    ctx,
  );
  assert.equal(errors.startDate?.key, "weekendFriday");
  assert.deepEqual(
    validateForm(
      valid({ package: "wochenende", startDate: "2026-10-30" }),
      ctx,
    ),
    {},
  );
});

test("Startdatum: nicht heute, nicht nach 12 Monaten", () => {
  assert.equal(
    validateForm(valid({ startDate: "2026-10-23" }), ctx).startDate?.key,
    "dateRange",
  );
  assert.equal(
    validateForm(valid({ startDate: "2027-10-24" }), ctx).startDate?.key,
    "dateRange",
  );
  assert.equal(
    validateForm(valid({ startDate: "2027-10-23" }), ctx).startDate,
    undefined,
  );
});

test("Langzeit verlangt eine Laufzeit von 1 bis 12 Monaten", () => {
  assert.equal(
    validateForm(valid({ package: "langzeit" }), ctx).duration?.key,
    "durationRequired",
  );
  assert.equal(
    validateForm(valid({ package: "langzeit", duration: "13" }), ctx).duration
      ?.key,
    "durationRequired",
  );
  assert.equal(
    validateForm(valid({ package: "langzeit", duration: "6" }), ctx).duration,
    undefined,
  );
});

test("Lieferung und Abholung verlangen Adressen mit 5 bis 200 Zeichen", () => {
  const errors = validateForm(
    valid({ handover: "lieferung", return: "abholung", pickupAddress: "Weg" }),
    ctx,
  );
  assert.equal(errors.deliveryAddress?.key, "addressLength");
  assert.equal(errors.pickupAddress?.key, "addressLength");
  assert.deepEqual(
    validateForm(
      valid({ handover: "lieferung", deliveryAddress: "Marktplatz 1, Aachen" }),
      ctx,
    ),
    {},
  );
});

test("Gutschein: Fahrzeug, Datum und Voraussetzungen optional, Wert ab 1.000 €", () => {
  const base = valid({
    occasion: "gutschein",
    vehicle: "",
    startDate: "",
    requirements: false,
  });
  assert.equal(validateForm(base, ctx).voucherValue?.key, "voucherMin");
  assert.equal(
    validateForm({ ...base, voucherValue: "999" }, ctx).voucherValue?.key,
    "voucherMin",
  );
  assert.deepEqual(validateForm({ ...base, voucherValue: "1000" }, ctx), {});
});

test("Namen, E-Mail, Telefon und Nachricht nach PRD-Regeln", () => {
  assert.equal(
    validateForm(valid({ firstName: "L" }), ctx).firstName?.key,
    "nameLength",
  );
  assert.equal(
    validateForm(valid({ lastName: "x".repeat(LIMITS.name.max + 1) }), ctx)
      .lastName?.key,
    "nameLength",
  );
  assert.equal(
    validateForm(valid({ email: "lea@beispiel" }), ctx).email?.key,
    "email",
  );
  assert.equal(
    validateForm(valid({ phone: "12345" }), ctx).phone?.key,
    "phone",
  );
  assert.equal(
    validateForm(valid({ phone: "0241-123456" }), ctx).phone?.key,
    "phone",
  );
  assert.equal(
    validateForm(valid({ phone: "+49 241 123456" }), ctx).phone,
    undefined,
  );
  assert.equal(
    validateForm(valid({ message: "x".repeat(1001) }), ctx).message?.key,
    "messageLength",
  );
});

// --- Vorbelegung (PRD 7) ---------------------------------------------------

test("Vorbelegung übernimmt nur bekannte Werte", () => {
  const ids = ["silber", "rot", "schwarz"];
  assert.deepEqual(readPrefill("?auto=schwarz&paket=woche", ids), {
    vehicle: "schwarz",
    package: "woche",
    occasion: undefined,
  });
  assert.deepEqual(readPrefill("?auto=blau&paket=jahr&anlass=<script>", ids), {
    vehicle: undefined,
    package: undefined,
    occasion: undefined,
  });
  assert.equal(readPrefill("?anlass=hochzeit", ids).occasion, "hochzeit");
});
