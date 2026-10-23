import type { Locale } from "../i18n/locales";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type Weekday = (typeof WEEKDAYS)[number];

export interface OpeningSlot {
  days: Weekday[];
  opens: string;
  closes: string;
}

// 1. Januar 2024 war ein Montag; daraus entstehen die Wochentagsnamen je Sprache.
function weekdayName(day: Weekday, locale: Locale): string {
  const date = new Date(Date.UTC(2024, 0, 1 + WEEKDAYS.indexOf(day)));
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC",
  }).format(date);
}

/** "Mo.–Fr. 09:00–19:00" bzw. "Mon–Fri 09:00–19:00" bzw. "ma–vr 09:00–19:00" */
export function formatOpeningSlot(slot: OpeningSlot, locale: Locale): string {
  const indexes = slot.days.map((day) => WEEKDAYS.indexOf(day));
  const contiguous = indexes.every(
    (value, i) => i === 0 || value === indexes[i - 1] + 1,
  );
  const names = slot.days.map((day) => weekdayName(day, locale));
  const days =
    names.length > 1 && contiguous
      ? `${names[0]}–${names[names.length - 1]}`
      : names.join(", ");
  return `${days} ${slot.opens}–${slot.closes}`;
}
