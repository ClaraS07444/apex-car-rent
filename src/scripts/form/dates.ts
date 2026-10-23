/**
 * Datumslogik des Anfrageformulars (PRD 10.1, Felder 3 bis 5).
 * Daten sind ISO-Strings JJJJ-MM-TT ohne Uhrzeit; gerechnet wird in UTC,
 * damit Sommerzeitwechsel keinen Tag verschieben.
 */

export type PackageKey = "tag" | "wochenende" | "woche" | "langzeit";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function fromUtc(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** Kalenderdatum eines Date-Objekts in lokaler Zeit, z. B. "heute" im Browser. */
export function localIso(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Wandelt JJJJ-MM-TT in ein UTC-Datum; null bei ungültigen Angaben wie 2026-02-30. */
export function parseIso(iso: string): Date | null {
  const match = ISO_DATE.exec(iso);
  if (!match) return null;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return fromUtc(date) === iso ? date : null;
}

export function addDays(iso: string, days: number): string {
  const date = parseIso(iso);
  if (!date) throw new RangeError(`Ungültiges Datum: ${iso}`);
  date.setUTCDate(date.getUTCDate() + days);
  return fromUtc(date);
}

/** Addiert Monate; fehlt der Tag im Zielmonat, gilt dessen letzter Tag. */
export function addMonths(iso: string, months: number): string {
  const date = parseIso(iso);
  if (!date) throw new RangeError(`Ungültiges Datum: ${iso}`);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return fromUtc(date);
}

/** 0 = Sonntag ... 5 = Freitag, 6 = Samstag */
export function weekday(iso: string): number {
  const date = parseIso(iso);
  if (!date) throw new RangeError(`Ungültiges Datum: ${iso}`);
  return date.getUTCDay();
}

export function isFriday(iso: string): boolean {
  return weekday(iso) === 5;
}

/** Frühestens morgen, spätestens heute + Buchungsfenster (PRD 10.1 Feld 3). */
export function bookingRange(
  todayIso: string,
  windowMonths: number,
): { min: string; max: string } {
  return { min: addDays(todayIso, 1), max: addMonths(todayIso, windowMonths) };
}

/**
 * Rückgabedatum (PRD 10.1 Feld 4): Tag +1 Tag, Wochenende = folgender Montag,
 * Woche +7 Tage. Bei Langzeit ersetzt die Laufzeit das Rückgabedatum.
 */
export function returnDate(pkg: PackageKey, startIso: string): string | null {
  if (!parseIso(startIso)) return null;
  switch (pkg) {
    case "tag":
      return addDays(startIso, 1);
    case "wochenende": {
      const untilMonday = (8 - weekday(startIso)) % 7 || 7;
      return addDays(startIso, untilMonday);
    }
    case "woche":
      return addDays(startIso, 7);
    case "langzeit":
      return null;
  }
}
