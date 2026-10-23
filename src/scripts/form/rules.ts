import { bookingRange, isFriday, parseIso, type PackageKey } from "./dates.ts";

/**
 * Feldregeln des Anfrageformulars (PRD 10.1, 10.2). Reine Funktionen: Eingabe
 * sind die Formularwerte, Ausgabe sind Fehlerschlüssel mit Parametern; die
 * Texte je Sprache liefert die Seite.
 */

/** Längen und Grenzen; auch Quelle für minlength/maxlength im HTML. */
export const LIMITS = {
  name: { min: 2, max: 60 },
  address: { min: 5, max: 200 },
  phoneDigits: { min: 6, max: 20 },
  message: { max: 1000 },
} as const;

export interface FormValues {
  vehicle: string;
  package: PackageKey | "";
  startDate: string;
  duration: string;
  handover: "abholung" | "lieferung";
  deliveryAddress: string;
  return: "aachen" | "abholung";
  pickupAddress: string;
  occasion: string;
  voucherValue: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requirements: boolean;
  message: string;
  privacy: boolean;
}

export type FieldName =
  | "vehicle"
  | "package"
  | "startDate"
  | "duration"
  | "deliveryAddress"
  | "pickupAddress"
  | "voucherValue"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "requirements"
  | "message"
  | "privacy";

export type MessageKey =
  | "vehicleRequired"
  | "packageRequired"
  | "dateRequired"
  | "dateInvalid"
  | "dateRange"
  | "weekendFriday"
  | "durationRequired"
  | "addressLength"
  | "voucherMin"
  | "nameLength"
  | "email"
  | "phone"
  | "requirements"
  | "messageLength"
  | "privacy";

export interface FieldError {
  key: MessageKey;
  params?: Record<string, string | number>;
}

export interface RuleContext {
  /** Heutiges Datum im Browser, JJJJ-MM-TT */
  today: string;
  windowMonths: number;
  maxMonths: number;
  voucherMinimum: number;
}

/** Bei einem Geschenkgutschein werden Fahrzeug, Datum und Voraussetzungen optional. */
export function isVoucher(values: Pick<FormValues, "occasion">): boolean {
  return values.occasion === "gutschein";
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_CHARS = /^\+?[\d ]+$/;

function lengthBetween(value: string, min: number, max: number): boolean {
  const length = value.trim().length;
  return length >= min && length <= max;
}

function checkDate(values: FormValues, ctx: RuleContext): FieldError | null {
  const value = values.startDate.trim();
  if (!value) return isVoucher(values) ? null : { key: "dateRequired" };
  if (!parseIso(value)) return { key: "dateInvalid" };
  const { min, max } = bookingRange(ctx.today, ctx.windowMonths);
  if (value < min || value > max)
    return { key: "dateRange", params: { min, max } };
  if (values.package === "wochenende" && !isFriday(value)) {
    return { key: "weekendFriday" };
  }
  return null;
}

/** Prüft alle Felder; zurück kommen nur Felder mit Fehler. */
export function validateForm(
  values: FormValues,
  ctx: RuleContext,
): Partial<Record<FieldName, FieldError>> {
  const errors: Partial<Record<FieldName, FieldError>> = {};
  const voucher = isVoucher(values);

  if (!voucher && !values.vehicle) errors.vehicle = { key: "vehicleRequired" };
  if (!values.package) errors.package = { key: "packageRequired" };

  const dateError = checkDate(values, ctx);
  if (dateError) errors.startDate = dateError;

  if (values.package === "langzeit") {
    const months = Number(values.duration);
    if (!Number.isInteger(months) || months < 1 || months > ctx.maxMonths) {
      errors.duration = { key: "durationRequired" };
    }
  }

  const { address } = LIMITS;
  if (
    values.handover === "lieferung" &&
    !lengthBetween(values.deliveryAddress, address.min, address.max)
  ) {
    errors.deliveryAddress = { key: "addressLength", params: address };
  }
  if (
    values.return === "abholung" &&
    !lengthBetween(values.pickupAddress, address.min, address.max)
  ) {
    errors.pickupAddress = { key: "addressLength", params: address };
  }

  if (voucher) {
    const amount = Number(values.voucherValue);
    if (
      !values.voucherValue.trim() ||
      !Number.isFinite(amount) ||
      amount < ctx.voucherMinimum
    ) {
      errors.voucherValue = {
        key: "voucherMin",
        params: { min: ctx.voucherMinimum },
      };
    }
  }

  const { name } = LIMITS;
  if (!lengthBetween(values.firstName, name.min, name.max)) {
    errors.firstName = { key: "nameLength", params: name };
  }
  if (!lengthBetween(values.lastName, name.min, name.max)) {
    errors.lastName = { key: "nameLength", params: name };
  }

  if (!EMAIL.test(values.email.trim())) errors.email = { key: "email" };

  const phone = values.phone.trim();
  const digits = phone.replace(/\D/g, "").length;
  if (
    !PHONE_CHARS.test(phone) ||
    digits < LIMITS.phoneDigits.min ||
    digits > LIMITS.phoneDigits.max
  ) {
    errors.phone = { key: "phone", params: LIMITS.phoneDigits };
  }

  if (!voucher && !values.requirements)
    errors.requirements = { key: "requirements" };

  if (values.message.length > LIMITS.message.max) {
    errors.message = { key: "messageLength", params: LIMITS.message };
  }

  if (!values.privacy) errors.privacy = { key: "privacy" };

  return errors;
}
