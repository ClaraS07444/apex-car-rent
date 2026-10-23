/**
 * Anfrageformular (PRD 8.3 K2, 10): bedingte Felder, Validierung mit
 * Fehlerliste, Preisvorschau, Vorbelegung und alle Formularzustände.
 * Nutzereingaben werden nur als Text (textContent) ausgegeben.
 */
import {
  bookingRange,
  localIso,
  parseIso,
  returnDate,
  type PackageKey,
} from "./dates.ts";
import { estimate, type Estimate, type PricingData } from "./pricing.ts";
import { readPrefill } from "./prefill.ts";
import {
  isVoucher,
  LIMITS,
  validateForm,
  type FieldError,
  type FieldName,
  type FormValues,
  type MessageKey,
  type RuleContext,
} from "./rules.ts";
import { demoSubmitter, type InquirySubmitter } from "./submit.ts";

interface Config {
  locale: string;
  vehicleIds: string[];
  windowMonths: number;
  pricing: PricingData & {
    packages: PricingData["packages"] & {
      tag: { includedKm: number };
      wochenende: { includedKm: number };
      woche: { includedKm: number };
      langzeit: { includedKmPerMonth: number; maxMonths: number };
    };
    voucherMinimum: number;
  };
  messages: Record<MessageKey, string>;
  text: {
    returnDatePending: string;
    kmIncluded: string;
    perMonth: string;
    fromPrice: string;
    messageCounter: string;
    successHeading: string;
    previewExtraKm: string;
    previewVoucher: string;
    delivery: string;
    pickup: string;
    packages: Record<PackageKey, string>;
  };
}

/** Mindest-Ausfüllzeit gegen Bots (PRD 10.1, Spam-Schutz) */
const MIN_FILL_MS = 3000;

function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

function readConfig(): Config | null {
  const element = document.getElementById("inquiry-config");
  if (!element?.textContent) return null;
  try {
    return JSON.parse(element.textContent) as Config;
  } catch {
    return null;
  }
}

function init(config: Config, submitter: InquirySubmitter): void {
  const root = document.querySelector<HTMLElement>("[data-inquiry]");
  const formElement = root?.querySelector<HTMLFormElement>(
    "[data-inquiry-form]",
  );
  if (!root || !formElement) return;
  // Feste Referenz, damit die Typprüfung auch in den Funktionen unten gilt
  const form: HTMLFormElement = formElement;

  const body = form.querySelector<HTMLFieldSetElement>("[data-form-body]");
  const submitButton = form.querySelector<HTMLButtonElement>("[data-submit]");
  const summary = form.querySelector<HTMLElement>("[data-error-summary]");
  const summaryList = form.querySelector<HTMLElement>("[data-error-list]");
  const technicalError = form.querySelector<HTMLElement>(
    "[data-technical-error]",
  );
  const success = root.querySelector<HTMLElement>("[data-success]");
  if (
    !body ||
    !submitButton ||
    !summary ||
    !summaryList ||
    !technicalError ||
    !success
  ) {
    return;
  }

  const locale = config.locale;
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
  const number = new Intl.NumberFormat(locale);
  const longDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const formatDate = (iso: string) => {
    const date = parseIso(iso);
    return date ? longDate.format(date) : iso;
  };
  const km = (value: number) => `${number.format(value)} km`;

  const control = (name: string) =>
    form.elements.namedItem(name) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | RadioNodeList
      | null;

  const value = (name: string): string => {
    const item = control(name);
    if (!item) return "";
    return "value" in item ? item.value : "";
  };

  const checked = (name: string): boolean =>
    (control(name) as HTMLInputElement | null)?.checked ?? false;

  const readValues = (): FormValues => ({
    vehicle: value("vehicle"),
    package: value("package") as FormValues["package"],
    startDate: value("startDate"),
    duration: value("duration"),
    handover: value("handover") === "lieferung" ? "lieferung" : "abholung",
    deliveryAddress: value("deliveryAddress"),
    return: value("return") === "abholung" ? "abholung" : "aachen",
    pickupAddress: value("pickupAddress"),
    occasion: value("occasion"),
    voucherValue: value("voucherValue"),
    firstName: value("firstName"),
    lastName: value("lastName"),
    email: value("email"),
    phone: value("phone"),
    requirements: checked("requirements"),
    message: value("message"),
    privacy: checked("privacy"),
  });

  const ruleContext = (): RuleContext => ({
    today: localIso(new Date()),
    windowMonths: config.windowMonths,
    maxMonths: config.pricing.packages.langzeit.maxMonths,
    voucherMinimum: config.pricing.voucherMinimum,
  });

  // --- Bedingte Felder --------------------------------------------------

  const conditions = [
    ...form.querySelectorAll<HTMLElement>("[data-show-when]"),
  ];

  function matches(rule: string): boolean {
    const negate = rule.includes("!=");
    const [name, expected] = rule.split(negate ? "!=" : "=");
    return (value(name) === expected) !== negate;
  }

  /** Leert alle Eingaben in einem ausgeblendeten Bereich (PRD 10.1). */
  function clearInside(container: HTMLElement): void {
    for (const input of container.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea")) {
      if (input instanceof HTMLInputElement && input.type === "checkbox") {
        input.checked = false;
      } else if (input instanceof HTMLSelectElement) {
        input.selectedIndex = 0;
      } else {
        input.value = "";
      }
      const field = input.closest<HTMLElement>("[data-field]")?.dataset.field;
      if (field) {
        touched.delete(field);
        showError(field, null);
      }
    }
  }

  function updateConditions(): void {
    for (const element of conditions) {
      const show = matches(element.dataset.showWhen ?? "");
      if (element.classList.contains("conditional")) {
        const wasOpen = element.hasAttribute("data-open");
        element.toggleAttribute("data-open", show);
        element.inert = !show;
        if (wasOpen && !show) clearInside(element);
      } else {
        element.hidden = !show;
      }
    }
    // Gutschein: Fahrzeug, Datum und Voraussetzungen werden optional
    const voucher = isVoucher(readValues());
    for (const input of form.querySelectorAll<HTMLInputElement>(
      "[data-required-unless-voucher]",
    )) {
      input.required = !voucher;
    }
    for (const mark of form.querySelectorAll<HTMLElement>(
      '[data-required-mark="unless-voucher"]',
    )) {
      mark.hidden = voucher;
    }
  }

  // --- Abgeleitete Anzeigen ---------------------------------------------

  const returnOutput =
    form.querySelector<HTMLOutputElement>("[data-return-date]");
  const counter = form.querySelector<HTMLElement>("[data-message-counter]");
  const kmBase = form.querySelector<HTMLOptionElement>(
    'select[name="extraKm"] option[value="0"]',
  );
  const startInput = control("startDate") as HTMLInputElement | null;

  function updateDerived(): void {
    const values = readValues();
    const pkg = values.package || null;

    if (returnOutput) {
      const result =
        pkg && values.startDate ? returnDate(pkg, values.startDate) : null;
      returnOutput.textContent = result
        ? formatDate(result)
        : config.text.returnDatePending;
    }

    if (kmBase) {
      const { packages } = config.pricing;
      const included =
        pkg === "langzeit"
          ? fill(config.text.perMonth, {
              value: km(packages.langzeit.includedKmPerMonth),
            })
          : km(packages[pkg ?? "tag"].includedKm);
      kmBase.textContent = fill(config.text.kmIncluded, { km: included });
    }

    if (counter) {
      counter.textContent = fill(config.text.messageCounter, {
        count: number.format(values.message.length),
        max: number.format(LIMITS.message.max),
      });
    }

    renderPreview(values);
  }

  // --- Preisvorschau (PRD 10.3) -----------------------------------------

  const preview = document.querySelector<HTMLElement>("[data-price-preview]");
  const previewLines = preview?.querySelector<HTMLElement>(
    "[data-preview-lines]",
  );
  const previewTotal = preview?.querySelector<HTMLElement>(
    "[data-preview-total]",
  );
  const previewEmpty = preview?.querySelector<HTMLElement>(
    "[data-preview-empty]",
  );
  const previewResult = preview?.querySelector<HTMLElement>(
    "[data-preview-result]",
  );

  function lineLabel(key: string, values: FormValues): string {
    switch (key) {
      case "package":
        return values.package ? config.text.packages[values.package] : "";
      case "delivery":
        return config.text.delivery;
      case "pickup":
        return config.text.pickup;
      case "extraKm":
        return fill(config.text.previewExtraKm, {
          km: km(Number(value("extraKm"))),
        });
      default:
        return config.text.previewVoucher;
    }
  }

  function renderPreview(values: FormValues): void {
    if (!previewLines || !previewTotal || !previewEmpty || !previewResult)
      return;
    const voucher = isVoucher(values);
    const result: Estimate | null = estimate(
      {
        package: values.package || null,
        months: values.duration ? Number(values.duration) : null,
        extraKm: Number(value("extraKm")) || 0,
        delivery: values.handover === "lieferung",
        pickup: values.return === "abholung",
        voucher: voucher ? Number(values.voucherValue) || NaN : null,
      },
      config.pricing,
    );

    previewEmpty.hidden = result !== null;
    previewResult.hidden = result === null;
    if (!result) return;

    previewLines.replaceChildren(
      ...result.lines.map((line) => {
        const row = document.createElement("div");
        const label = document.createElement("dt");
        const amount = document.createElement("dd");
        label.textContent = lineLabel(line.key, values);
        amount.textContent = money.format(line.amount);
        row.append(label, amount);
        return row;
      }),
    );
    const total = money.format(result.total);
    const text = result.from
      ? fill(config.text.fromPrice, { price: total })
      : total;
    if (previewTotal.textContent !== text) previewTotal.textContent = text;
  }

  // --- Validierung und Fehleranzeige (PRD 10.2) -------------------------

  const touched = new Set<string>();

  function errorText(error: FieldError): string {
    const params: Record<string, string | number> = { ...error.params };
    if (error.key === "dateRange") {
      params.min = formatDate(String(params.min));
      params.max = formatDate(String(params.max));
    }
    if (error.key === "voucherMin")
      params.min = money.format(Number(params.min));
    return fill(config.messages[error.key], params);
  }

  function showError(name: string, error: FieldError | null): void {
    const field = form.querySelector<HTMLElement>(`[data-field="${name}"]`);
    const message = document.getElementById(`error-${name}`);
    if (!field || !message) return;
    const errorId = message.id;
    field.toggleAttribute("data-invalid", Boolean(error));
    message.hidden = !error;
    const text = message.querySelector<HTMLElement>("[data-error-text]");
    if (text) text.textContent = error ? errorText(error) : "";

    for (const input of field.querySelectorAll<HTMLElement>(
      "input, select, textarea",
    )) {
      const ids = new Set(
        (input.getAttribute("aria-describedby") ?? "")
          .split(" ")
          .filter(Boolean),
      );
      if (error) {
        ids.add(errorId);
        input.setAttribute("aria-invalid", "true");
      } else {
        ids.delete(errorId);
        input.removeAttribute("aria-invalid");
      }
      if (ids.size > 0)
        input.setAttribute("aria-describedby", [...ids].join(" "));
      else input.removeAttribute("aria-describedby");
    }
  }

  function validateTouched(): void {
    const errors = validateForm(readValues(), ruleContext());
    for (const name of touched) {
      showError(name, errors[name as FieldName] ?? null);
    }
  }

  function showSummary(errors: Partial<Record<FieldName, FieldError>>): void {
    if (!summary || !summaryList) return;
    const entries = Object.entries(errors) as [FieldName, FieldError][];
    summaryList.replaceChildren(
      ...entries.map(([name, error]) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        const target = form.querySelector<HTMLElement>(
          `[data-field="${name}"] :is(input, select, textarea)`,
        );
        link.href = `#${target?.id ?? ""}`;
        // Feldname voranstellen, damit gleiche Meldungen unterscheidbar sind
        const label = form
          .querySelector(`[data-field="${name}"] :is(.field__label, legend)`)
          ?.textContent?.replace("*", "")
          .trim();
        link.textContent = label
          ? `${label}: ${errorText(error)}`
          : errorText(error);
        link.addEventListener("click", (event) => {
          event.preventDefault();
          target?.focus();
        });
        item.append(link);
        return item;
      }),
    );
    summary.hidden = entries.length === 0;
  }

  // --- Zustände ---------------------------------------------------------

  let sending = false;
  let startedAt = Date.now();

  function setSending(active: boolean): void {
    sending = active;
    body!.disabled = active;
    submitButton!.setAttribute("aria-busy", String(active));
    submitButton!.querySelector<HTMLElement>("[data-label-idle]")!.hidden =
      active;
    submitButton!.querySelector<HTMLElement>("[data-label-sending]")!.hidden =
      !active;
  }

  /** Lesbare Zusammenfassung aus den sichtbaren Beschriftungen. */
  function collectSummary(): [string, string][] {
    const rows: [string, string][] = [];
    for (const field of form.querySelectorAll<HTMLElement>("[data-field]")) {
      if (field.closest("[inert]") || field.dataset.field === "privacy")
        continue;
      const label = field
        .querySelector(".field__label, legend")
        ?.textContent?.replace("*", "")
        .trim();
      let text = "";
      const radio = field.querySelector<HTMLInputElement>(
        "input[type=radio]:checked",
      );
      const select = field.querySelector<HTMLSelectElement>("select");
      const input = field.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        "input:not([type=radio]):not([type=checkbox]), textarea",
      );
      const box = field.querySelector<HTMLInputElement>("input[type=checkbox]");
      if (radio) text = radio.closest("label")?.textContent?.trim() ?? "";
      else if (select && select.value)
        text = select.selectedOptions[0]?.textContent ?? "";
      else if (input?.value) {
        text = input.type === "date" ? formatDate(input.value) : input.value;
      } else if (box?.checked) {
        text = box.closest("label")?.textContent?.replace("*", "").trim() ?? "";
      }
      if (text) rows.push([label || "", text.trim()]);
    }
    return rows;
  }

  function showSuccess(firstName: string): void {
    const title = success!.querySelector<HTMLElement>("[data-success-title]");
    const list = success!.querySelector<HTMLElement>("[data-success-summary]");
    if (title)
      title.textContent = fill(config.text.successHeading, {
        name: firstName.trim(),
      });
    list?.replaceChildren(
      ...collectSummary().map(([label, text]) => {
        const row = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = label;
        dd.textContent = text;
        row.append(dt, dd);
        return row;
      }),
    );
    form.hidden = true;
    success!.hidden = false;
    title?.focus();
  }

  function resetForm(): void {
    form.reset();
    touched.clear();
    for (const field of form.querySelectorAll<HTMLElement>("[data-field]")) {
      if (field.dataset.field) showError(field.dataset.field, null);
    }
    summary!.hidden = true;
    technicalError!.hidden = true;
    success!.hidden = true;
    form.hidden = false;
    startedAt = Date.now();
    refresh();
    form.querySelector<HTMLElement>("#inquiry-title")?.focus();
  }

  function refresh(): void {
    updateConditions();
    updateDerived();
  }

  // --- Ereignisse -------------------------------------------------------

  form.addEventListener("input", (event) => {
    const field = (event.target as Element).closest<HTMLElement>("[data-field]")
      ?.dataset.field;
    if (field) touched.add(field);
    // "Wie Lieferadresse" übernimmt die Lieferadresse
    if (checked("sameAsDelivery")) {
      const pickup = control("pickupAddress") as HTMLTextAreaElement | null;
      if (pickup) pickup.value = value("deliveryAddress");
    }
    refresh();
    // Bereits angezeigte Fehler verschwinden, sobald das Feld stimmt
    const errors = validateForm(readValues(), ruleContext());
    for (const name of touched) {
      const shown = form.querySelector(`[data-field="${name}"][data-invalid]`);
      if (shown && !errors[name as FieldName]) showError(name, null);
    }
  });

  // Datumswähler (vor allem mobil) schließen ohne verlässliches focusout;
  // die Auswahl gilt hier als Abschluss des Feldes.
  form.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "date") {
      validateTouched();
    }
  });

  form.addEventListener("focusout", (event) => {
    const field = (event.target as Element).closest<HTMLElement>(
      "[data-field]",
    );
    const related = (event as FocusEvent).relatedTarget as Node | null;
    // Radiogruppen erst prüfen, wenn der Fokus die Gruppe verlässt
    if (field && related && field.contains(related)) return;
    if (field?.dataset.field && touched.has(field.dataset.field))
      validateTouched();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;

    const values = readValues();
    const errors = validateForm(values, ruleContext());
    for (const field of form.querySelectorAll<HTMLElement>("[data-field]")) {
      const name = field.dataset.field;
      if (!name || field.closest("[inert]")) continue;
      touched.add(name);
      showError(name, errors[name as FieldName] ?? null);
    }
    showSummary(errors);
    if (Object.keys(errors).length > 0) {
      summary.focus();
      return;
    }

    technicalError.hidden = true;
    const honeypot = control("website") as HTMLInputElement | null;
    const isSpam =
      Boolean(honeypot?.value) || Date.now() - startedAt < MIN_FILL_MS;

    setSending(true);
    try {
      // Spam: Erfolgsfläche zeigen, Daten verwerfen (PRD 10.4)
      if (!isSpam) {
        const data = Object.fromEntries(
          [...new FormData(form).entries()].map(([key, entry]) => [
            key,
            String(entry),
          ]),
        );
        document.dispatchEvent(new CustomEvent("apex:inquiry-submitted"));
        await submitter.send(data);
      }
      setSending(false);
      showSuccess(values.firstName);
    } catch {
      setSending(false);
      technicalError.hidden = false;
    }
  });

  success.querySelector("[data-again]")?.addEventListener("click", resetForm);

  // --- Start ------------------------------------------------------------

  const prefill = readPrefill(window.location.search, config.vehicleIds);
  const select = (name: string, option?: string) => {
    if (!option) return;
    const item = control(name);
    if (item instanceof RadioNodeList) item.value = option;
    else if (item) item.value = option;
  };
  select("vehicle", prefill.vehicle);
  select("package", prefill.package);
  select("occasion", prefill.occasion);

  // Datumsauswahl auf morgen bis Ende des Buchungsfensters begrenzen. Nur
  // einmal: Chromium verwirft beim Neusetzen von min/max halb getippte
  // Datumsteile, und input feuert schon je Teil (A-02).
  if (startInput) {
    const { min, max } = bookingRange(
      localIso(new Date()),
      config.windowMonths,
    );
    startInput.min = min;
    startInput.max = max;
  }

  refresh();
  // Erst mit JavaScript kann gesendet werden (Demo-Modus, PRD 10.4)
  submitButton.disabled = false;
}

const config = readConfig();
if (config) init(config, demoSubmitter);
