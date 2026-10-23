import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { gotoReady, tabKey } from "./helpers";

/** Datum in lokaler Zeit, n Tage ab heute, als JJJJ-MM-TT. */
function inDays(days: number, weekday?: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  if (weekday !== undefined) {
    while (date.getDay() !== weekday) date.setDate(date.getDate() + 1);
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

async function fillValid(page: Page): Promise<void> {
  await page.locator("#field-vehicle-rot").check();
  await page.locator("#field-package-tag").check();
  await page.locator("#field-startDate").fill(inDays(7));
  await page.locator("#field-firstName").fill("Lea");
  await page.locator("#field-lastName").fill("Beispiel");
  await page.locator("#field-email").fill("lea@beispiel.de");
  await page.locator("#field-phone").fill("+49 241 123456");
  await page.locator("#field-requirements").check();
  await page.locator("#field-privacy").check();
}

/** Zählt simulierte Übermittlungen (Ereignis aus form/index.ts). */
async function countSubmissions(page: Page): Promise<void> {
  await page.addInitScript(() => {
    (window as unknown as { __sent: number }).__sent = 0;
    document.addEventListener("apex:inquiry-submitted", () => {
      (window as unknown as { __sent: number }).__sent += 1;
    });
  });
}

const sent = (page: Page) =>
  page.evaluate(() => (window as unknown as { __sent: number }).__sent);

const total = (page: Page) => page.locator("[data-preview-total]");

test.use({ reducedMotion: "reduce" });

test.describe("Kontaktseite (PRD 8.3)", () => {
  test("H1, Kontaktkästen und Standort", async ({ page }) => {
    await gotoReady(page, "/kontakt");
    await expect(page.locator("h1")).toHaveText("Anfrage und Kontakt");
    await expect(page.locator(".contact-box")).toContainText(
      "+49 241 0000 000",
    );
    await expect(page.locator(".contact-location")).toContainText(
      "52068 Aachen",
    );
    await expect(
      page.getByRole("link", { name: /Route planen/ }),
    ).toHaveAttribute("rel", "noopener");
  });

  test("Formular steht in DE, EN und NL bereit", async ({ page }) => {
    await gotoReady(page, "/en/contact");
    await expect(
      page.getByRole("button", { name: "Send request" }),
    ).toBeEnabled();
    await gotoReady(page, "/nl/contact");
    await expect(
      page.getByRole("button", { name: "Aanvraag versturen" }),
    ).toBeEnabled();
  });
});

test.describe("Vorbelegung (PRD 7, 17)", () => {
  test("/kontakt?auto=schwarz&paket=woche belegt Fahrzeug und Paket vor", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt?auto=schwarz&paket=woche");
    await expect(page.locator("#field-vehicle-schwarz")).toBeChecked();
    await expect(page.locator("#field-package-woche")).toBeChecked();
    await expect(total(page)).toHaveText("10.000 €");
  });

  test("ungültige Werte werden ignoriert", async ({ page }) => {
    await gotoReady(page, "/kontakt?auto=blau&paket=jahr&anlass=party");
    await expect(page.locator("input[name=vehicle]:checked")).toHaveCount(0);
    await expect(page.locator("input[name=package]:checked")).toHaveCount(0);
    await expect(page.locator("#field-occasion")).toHaveValue("");
  });

  test("Gutschein: Wertfeld erscheint, Fahrzeug und Datum werden optional", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt?anlass=gutschein");
    await expect(page.locator("#field-voucherValue")).toBeVisible();
    await expect(page.locator("#field-vehicle-silber")).not.toHaveAttribute(
      "required",
    );
    await expect(page.locator("#field-startDate")).not.toHaveAttribute(
      "required",
    );
    await page.locator("#field-voucherValue").fill("1500");
    await expect(total(page)).toHaveText("1.500 €");
  });
});

test.describe("Validierung (PRD 10.2, 17)", () => {
  test("leeres Absenden: Fehlerliste mit Fokus, jedes Feld nennt seinen Fehler", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt");
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    const summary = page.locator("[data-error-summary]");
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary.locator("li")).toHaveCount(9);
    await expect(summary).toContainText(
      "Vorname: Bitte gib 2 bis 60 Zeichen ein.",
    );

    const email = page.locator("#field-email");
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveAccessibleDescription(
      /Bitte gib eine gültige E-Mail-Adresse an/,
    );

    // Sprunglink setzt den Fokus ins Feld
    await summary.getByRole("link", { name: /^E-Mail:/ }).click();
    await expect(email).toBeFocused();
  });

  test("Fehler erscheinen beim Verlassen eines bearbeiteten Feldes", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt");
    const email = page.locator("#field-email");
    await email.fill("lea@");
    await email.blur();
    await expect(page.locator("#error-email")).toBeVisible();
    await email.fill("lea@beispiel.de");
    await expect(page.locator("#error-email")).toBeHidden();
    await expect(email).not.toHaveAttribute("aria-invalid");
  });

  test("Wochenende mit Startdatum an einem Nicht-Freitag wird abgelehnt", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt");
    await page.locator("#field-package-wochenende").check();
    const date = page.locator("#field-startDate");
    await date.fill(inDays(2, 6)); // ein Samstag
    await date.blur();
    await expect(page.locator("#error-startDate")).toHaveText(
      "Das Wochenendpaket beginnt immer an einem Freitag.",
    );
    await date.fill(inDays(2, 5)); // ein Freitag
    await expect(page.locator("#error-startDate")).toBeHidden();
    await expect(page.locator("[data-return-date]")).toContainText("Montag");
  });

  test("Optionsgruppen sind echte Radiobuttons mit Pfeiltasten (A-07)", async ({
    page,
    browserName,
  }) => {
    await gotoReady(page, "/kontakt");
    await page.locator("#field-vehicle-silber").focus();
    await page.keyboard.press("Space");
    await expect(page.locator("#field-vehicle-silber")).toBeChecked();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#field-vehicle-rot")).toBeChecked();
    await page.keyboard.press(tabKey(browserName));
    await expect(page.locator("#field-vehicle-rot")).not.toBeFocused();
  });
});

test.describe("Bedingte Felder und Preisvorschau (PRD 10.1, 10.3, 17)", () => {
  test("Lieferung blendet die Adresse ein und erhöht die Vorschau um 500 €", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt?paket=tag");
    await expect(total(page)).toHaveText("2.000 €");
    await expect(page.locator("#field-deliveryAddress")).toBeHidden();
    await page.locator("#field-handover-lieferung").check();
    await expect(page.locator("#field-deliveryAddress")).toBeVisible();
    await expect(total(page)).toHaveText("2.500 €");
  });

  test("Woche mit +500 km und Lieferung ergibt 13.000 €", async ({ page }) => {
    await gotoReady(page, "/kontakt?paket=woche");
    await page.locator("#field-extraKm").selectOption("500");
    await page.locator("#field-handover-lieferung").check();
    await expect(total(page)).toHaveText("13.000 €");
  });

  test("Langzeit: Laufzeit statt Rückgabedatum, Vorschau als ab-Preis", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt?paket=langzeit");
    await expect(page.locator("#field-duration")).toBeVisible();
    await expect(page.locator("[data-return-date]")).toBeHidden();
    await page.locator("#field-duration").selectOption("3");
    await expect(total(page)).toHaveText("ab 60.000 €");
  });

  test("ausgeblendete Felder werden geleert", async ({ page }) => {
    await gotoReady(page, "/kontakt");
    await page.locator("#field-handover-lieferung").check();
    await page.locator("#field-deliveryAddress").fill("Marktplatz 1, Aachen");
    await page.locator("#field-handover-abholung").check();
    await page.locator("#field-handover-lieferung").check();
    await expect(page.locator("#field-deliveryAddress")).toHaveValue("");
  });

  test("Nachricht zählt die Zeichen", async ({ page }) => {
    await gotoReady(page, "/kontakt");
    await page.locator("#field-message").fill("Hallo");
    await expect(page.locator("[data-message-counter]")).toHaveText(
      "5 von 1.000 Zeichen",
    );
  });
});

test.describe("Zustände (PRD 10.4, 17)", () => {
  test("Doppelklick erzeugt nur eine Anfrage; Erfolgsfläche mit Zusammenfassung", async ({
    page,
  }) => {
    await countSubmissions(page);
    await gotoReady(page, "/kontakt");
    await fillValid(page);
    await page.waitForTimeout(3100); // Mindest-Ausfüllzeit gegen Bots
    await page.getByRole("button", { name: "Anfrage senden" }).dblclick();

    const title = page.locator("[data-success-title]");
    await expect(title).toHaveText(
      "Danke, Lea. Deine Anfrage ist eingegangen.",
    );
    await expect(title).toBeFocused();
    expect(await sent(page)).toBe(1);
    const success = page.locator("[data-success]");
    await expect(success).toContainText("lea@beispiel.de");
    await expect(success).toContainText("Rot");
    await expect(success).toContainText(
      "Apex Rent ist ein fiktives Unternehmen.",
    );
    await expect(page.locator("[data-inquiry-form]")).toBeHidden();

    await page.getByRole("button", { name: "Neue Anfrage" }).click();
    await expect(page.locator("[data-inquiry-form]")).toBeVisible();
    await expect(page.locator("#field-firstName")).toHaveValue("");
    await expect(page.locator("#inquiry-title")).toBeFocused();
  });

  test("Senden sperrt das Formular und zeigt den Ladezustand", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt");
    await fillValid(page);
    await page.waitForTimeout(3100);
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    await expect(page.locator("[data-label-sending]")).toBeVisible();
    await expect(page.locator("[data-label-sending]")).toHaveText(
      /Wird gesendet/,
    );
    // Das deaktivierte fieldset sperrt alle Felder darin
    await expect(page.locator("#field-firstName")).toBeDisabled();
    await expect(page.locator("[data-submit]")).toBeDisabled();
  });

  test("technischer Fehler: Hinweis, Eingaben bleiben erhalten", async ({
    page,
  }) => {
    await gotoReady(page, "/kontakt?demo=fehler");
    await fillValid(page);
    await page.waitForTimeout(3100);
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    const notice = page.locator("[data-technical-error]");
    await expect(notice).toBeVisible();
    await expect(notice).toContainText("+49 241 0000 000");
    await expect(page.locator("#field-firstName")).toHaveValue("Lea");
    await expect(page.locator("#field-firstName")).toBeEnabled();
  });

  test("Spam (Honeypot oder zu schnell): Erfolg anzeigen, nichts übermitteln", async ({
    page,
  }) => {
    await countSubmissions(page);
    await gotoReady(page, "/kontakt");
    await fillValid(page);
    await page.locator("#field-website").fill("http://spam.example", {
      force: true,
    });
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    await expect(page.locator("[data-success-title]")).toBeVisible();
    expect(await sent(page)).toBe(0);
  });

  test("Fehlerzustand ohne kritische axe-Fehler", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "axe einmal je Engine genügt");
    await gotoReady(page, "/kontakt");
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("[data-reveal]")) {
        el.setAttribute("data-revealed", "");
      }
    });
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations
        .filter((v) => ["critical", "serious"].includes(v.impact ?? ""))
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`),
    ).toEqual([]);
  });
});

test.describe("Karte (PRD 10.5, P-09)", () => {
  test("lädt erst nach Klick auf „Karte laden“", async ({ page }) => {
    const googleRequests: string[] = [];
    page.on("request", (request) => {
      if (/google\./.test(new URL(request.url()).hostname)) {
        googleRequests.push(request.url());
      }
    });
    await page.route(/google\./, (route) =>
      route.fulfill({ contentType: "text/html", body: "<p>Karte</p>" }),
    );
    await gotoReady(page, "/kontakt");
    await page.locator("[data-map]").scrollIntoViewIfNeeded();
    expect(googleRequests).toEqual([]);

    await page.getByRole("button", { name: "Karte laden" }).click();
    const iframe = page.locator("[data-map] iframe");
    await expect(iframe).toHaveAttribute(
      "title",
      "Karte: Standort von Apex Rent",
    );
    await expect(page.locator("[data-map]")).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(googleRequests.length).toBeGreaterThan(0);
    expect(googleRequests[0]).toContain("50.7735,6.1325");
  });
});

test.describe("Ohne JavaScript (PRD 10.4)", () => {
  test.use({ javaScriptEnabled: false });

  test("bleibt das Absenden gesperrt, ein Hinweis erklärt es", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    await expect(page.locator("[data-submit]")).toBeDisabled();
    await expect(
      page.getByText("Bitte aktiviere JavaScript, um das Formular zu nutzen."),
    ).toBeVisible();
  });
});

test.describe("Datenschutz (PRD 17)", () => {
  test("nach dem Laden kein Cookie und kein lokaler Speicher", async ({
    page,
    context,
  }) => {
    await gotoReady(page, "/kontakt");
    expect(await context.cookies()).toEqual([]);
    expect(
      await page.evaluate(() => localStorage.length + sessionStorage.length),
    ).toBe(0);
  });
});
