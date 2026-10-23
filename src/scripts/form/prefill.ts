import type { PackageKey } from "./dates.ts";

/**
 * Vorbelegung aus der URL (PRD 7), z. B. /kontakt?auto=rot&paket=wochenende.
 * Nur Werte aus festen Listen werden übernommen, alles andere ignoriert.
 */

export const PACKAGES: readonly PackageKey[] = [
  "tag",
  "wochenende",
  "woche",
  "langzeit",
];

export const OCCASIONS = [
  "hochzeit",
  "event",
  "gutschein",
  "business",
  "fotoshooting",
] as const;

export type Occasion = (typeof OCCASIONS)[number];

export interface Prefill {
  vehicle?: string;
  package?: PackageKey;
  occasion?: Occasion;
}

function pick<T extends string>(
  value: string | null,
  allowed: readonly T[],
): T | undefined {
  return allowed.find((candidate) => candidate === value);
}

export function readPrefill(
  search: string,
  vehicleIds: readonly string[],
): Prefill {
  const params = new URLSearchParams(search);
  return {
    vehicle: pick(params.get("auto"), vehicleIds),
    package: pick(params.get("paket"), PACKAGES),
    occasion: pick(params.get("anlass"), OCCASIONS),
  };
}
