import type { PackageKey } from "./dates.ts";

/**
 * Unverbindliche Preisvorschau (PRD 10.3):
 * Paketpreis + Lieferung + Abholung + Zusatz-km x Preis pro km.
 * Langzeit: Monatspreis x Monate, mit Hinweis "ab". Gutschein: Gutscheinwert.
 */

export interface PricingData {
  packages: {
    tag: { price: number };
    wochenende: { price: number };
    woche: { price: number };
    langzeit: { pricePerMonth: number };
  };
  extraKmPrice: number;
  delivery: number;
  pickup: number;
}

export interface EstimateInput {
  package: PackageKey | null;
  months: number | null;
  extraKm: number;
  delivery: boolean;
  pickup: boolean;
  /** Gesetzt, wenn der Anlass "Geschenkgutschein" ist */
  voucher: number | null;
}

export type LineKey = "package" | "delivery" | "pickup" | "extraKm" | "voucher";

export interface Estimate {
  lines: { key: LineKey; amount: number }[];
  total: number;
  /** true bei Langzeit: Preis ist ein "ab"-Preis */
  from: boolean;
}

/** Liefert null, solange für eine Vorschau Angaben fehlen. */
export function estimate(
  input: EstimateInput,
  pricing: PricingData,
): Estimate | null {
  if (input.voucher !== null) {
    if (!Number.isFinite(input.voucher) || input.voucher <= 0) return null;
    return {
      lines: [{ key: "voucher", amount: input.voucher }],
      total: input.voucher,
      from: false,
    };
  }

  if (!input.package) return null;

  let base: number;
  if (input.package === "langzeit") {
    if (!input.months || input.months < 1) return null;
    base = pricing.packages.langzeit.pricePerMonth * input.months;
  } else {
    base = pricing.packages[input.package].price;
  }

  const lines: Estimate["lines"] = [{ key: "package", amount: base }];
  if (input.delivery) lines.push({ key: "delivery", amount: pricing.delivery });
  if (input.pickup) lines.push({ key: "pickup", amount: pricing.pickup });
  if (input.extraKm > 0) {
    lines.push({
      key: "extraKm",
      amount: input.extraKm * pricing.extraKmPrice,
    });
  }

  return {
    lines,
    total: lines.reduce((sum, line) => sum + line.amount, 0),
    from: input.package === "langzeit",
  };
}
