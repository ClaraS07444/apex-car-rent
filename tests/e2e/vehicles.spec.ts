import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { clickRevealed, gotoReady, isDesktop } from "./helpers";

const openDialog = (page: Page) => page.locator("dialog[open]");

test.describe("Fahrzeugseite: Inhalte (PRD 8.2, 17)", () => {
  test("eine H1 mit Standort", async ({ page }) => {
    await page.goto("/fahrzeuge");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(
      "Porsche 911 GT3 RS mieten in Aachen",
    );
    await page.goto("/nl/autos");
    await expect(page.locator("h1")).toHaveText(
      "Porsche 911 GT3 RS huren in Aken",
    );
  });

  test("alle 3 Fahrzeuge zeigen 510 PS und die Preise", async ({ page }) => {
    await page.goto("/fahrzeuge");
    const items = page.locator(".vehicles-item");
    await expect(items).toHaveCount(3);
    for (const item of await items.all()) {
      await expect(item).toContainText("510 PS");
      await expect(item).toContainText("2.000 €");
      await expect(item).toContainText("3.500 €");
      await expect(item).toContainText("10.000 €");
      await expect(item).toContainText("inkl. 200 km");
    }
  });

  test("Preistabelle mit 4 Paketen, Zusatzleistungen und Kaution", async ({
    page,
  }) => {
    await page.goto("/fahrzeuge");
    const table = page.locator("#prices-title ~ div .price-table");
    await expect(table.locator("tbody tr")).toHaveCount(4);
    await expect(table).toContainText("Fr 12:00 bis Mo 10:00");
    await expect(table).toContainText("ab 20.000 € pro Monat");
    const extras = page.locator(".vehicles-extras");
    await expect(extras).toContainText("Mehrkilometer");
    await expect(extras).toContainText("5 € pro km");
    await expect(extras).toContainText("Alle Preise inkl. MwSt.");
  });

  test("Preistabelle ohne horizontales Scrollen bei 320px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("/fahrzeuge");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("Mietbedingungen nennen alle Pflichtangaben", async ({ page }) => {
    await page.goto("/fahrzeuge");
    const conditions = page.locator("#mietbedingungen");
    await expect(conditions.locator(".info-card")).toHaveCount(6);
    await expect(conditions).toContainText("25 Jahre");
    await expect(conditions).toContainText("Klasse B seit mindestens 4 Jahren");
    await expect(conditions).toContainText("10.000 € bei Übergabe");
    await expect(conditions).toContainText("Bar oder per Karte vor Ort");
    await expect(conditions).toContainText("Kaution bis zu ihrer vollen Höhe");
  });

  test("FAQ: 6 Einträge, mehrere gleichzeitig offen", async ({ page }) => {
    await page.goto("/en/cars");
    const items = page.locator(".faq__item");
    await expect(items).toHaveCount(6);
    await items.nth(0).locator("summary").click();
    await items.nth(2).locator("summary").click();
    await expect(items.nth(0)).toHaveAttribute("open", "");
    await expect(items.nth(2)).toHaveAttribute("open", "");
    await expect(items.nth(2)).toContainText("deposit of €10,000");
  });
});

test.describe("Detail-Overlay (PRD 8.2 F2, 10.5)", () => {
  // Geprüft wird das Verhalten des Overlays; ohne Einflug-Animationen stehen
  // die Buttons beim Klick still (die Animationen testet home.spec.ts).
  test.use({ reducedMotion: "reduce" });

  test("öffnet per Button, setzt ?auto= und hält den Fokus", async ({
    page,
  }) => {
    await gotoReady(page, "/fahrzeuge");
    const trigger = page.locator('[data-vehicle-open="silber"]');
    await clickRevealed(trigger);
    const dialog = openDialog(page);
    await expect(dialog).toHaveAttribute("data-vehicle-dialog", "silber");
    await expect(dialog).toBeFocused();
    await expect(page).toHaveURL(/\/fahrzeuge\?auto=silber$/);
    await expect(dialog).toHaveAccessibleName("GT3 RS Silber");
    await expect(dialog).toContainText("7-Gang-PDK");
    await expect(dialog).toContainText("Kaution");

    await page.keyboard.press("Escape");
    await expect(openDialog(page)).toHaveCount(0);
    await expect(page).toHaveURL(/\/fahrzeuge$/);
    await expect(trigger).toBeFocused();
  });

  test("Zurück schließt das Overlay", async ({ page }) => {
    await gotoReady(page, "/fahrzeuge");
    await clickRevealed(page.locator('[data-vehicle-open="rot"]'));
    await expect(openDialog(page)).toHaveCount(1);
    await page.goBack();
    await expect(openDialog(page)).toHaveCount(0);
    await expect(page).toHaveURL(/\/fahrzeuge$/);
  });

  test("Deeplink /fahrzeuge?auto=rot öffnet direkt, Zurück schließt", async ({
    page,
  }) => {
    // Realistischer Einstieg mit Vorgängerseite (z. B. Suche). In einem leeren
    // Tab überspringt Firefox Verlaufseinträge ohne Nutzeraktion; Zurück
    // verlässt dort die Seite.
    await gotoReady(page, "/");
    await gotoReady(page, "/fahrzeuge?auto=rot");
    await expect(openDialog(page)).toHaveAttribute(
      "data-vehicle-dialog",
      "rot",
    );
    await page.waitForLoadState("load");
    await page.goBack();
    await expect(openDialog(page)).toHaveCount(0);
    await expect(page).toHaveURL(/\/fahrzeuge$/);
  });

  test("unbekannter Wert lässt das Overlay geschlossen", async ({ page }) => {
    await gotoReady(page, "/fahrzeuge?auto=blau");
    await page.waitForTimeout(300);
    await expect(openDialog(page)).toHaveCount(0);
  });

  test("Kreuz schließt, Pfeile wechseln das Fahrzeug", async ({ page }) => {
    await gotoReady(page, "/en/cars?auto=silber");
    const dialog = openDialog(page);
    await dialog.getByRole("button", { name: "Next car" }).click();
    await expect(openDialog(page)).toHaveAttribute(
      "data-vehicle-dialog",
      "rot",
    );
    await expect(page).toHaveURL(/\?auto=rot$/);
    await openDialog(page)
      .getByRole("button", { name: "Previous car" })
      .click();
    await openDialog(page)
      .getByRole("button", { name: "Previous car" })
      .click();
    await expect(openDialog(page)).toHaveAttribute(
      "data-vehicle-dialog",
      "schwarz",
    );
    await openDialog(page).getByRole("button", { name: "Close" }).click();
    await expect(openDialog(page)).toHaveCount(0);
    await expect(page).toHaveURL(/\/en\/cars$/);
  });

  test("Klick auf den Hintergrund schließt (Desktop)", async ({ page }) => {
    test.skip(!isDesktop(page), "Hintergrund nur neben dem Desktop-Dialog");
    await gotoReady(page, "/fahrzeuge?auto=schwarz");
    await expect(openDialog(page)).toHaveCount(1);
    await page.mouse.click(10, 10);
    await expect(openDialog(page)).toHaveCount(0);
  });

  test("Sprachwechsel behält das geöffnete Fahrzeug", async ({ page }) => {
    await gotoReady(page, "/fahrzeuge");
    const en = page.locator('.site-footer a[hreflang="en"]');
    await expect(en).toHaveAttribute("href", /\/en\/cars$/);
    await clickRevealed(page.locator('[data-vehicle-open="rot"]'));
    await expect(en).toHaveAttribute("href", /\/en\/cars\?auto=rot$/);
    await page.keyboard.press("Escape");
    await expect(en).toHaveAttribute("href", /\/en\/cars$/);
  });

  test("Link zu den Mietbedingungen schließt und springt zu F4", async ({
    page,
  }) => {
    await gotoReady(page, "/fahrzeuge?auto=silber");
    await openDialog(page).locator("[data-vehicle-conditions]").click();
    await expect(openDialog(page)).toHaveCount(0);
    await expect(page.locator("#conditions-title")).toBeFocused();
    await expect(page.locator("#mietbedingungen")).toBeInViewport();
  });

  test("Anfrage-Link belegt das Fahrzeug vor", async ({ page }) => {
    await gotoReady(page, "/fahrzeuge?auto=schwarz");
    await expect(
      openDialog(page).getByRole("link", { name: "Dieses Fahrzeug anfragen" }),
    ).toHaveAttribute("href", "/kontakt?auto=schwarz");
  });

  test("geöffnetes Overlay ohne kritische axe-Fehler", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "axe einmal je Engine genügt");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoReady(page, "/fahrzeuge?auto=rot");
    await expect(openDialog(page)).toHaveCount(1);
    const results = await new AxeBuilder({ page })
      .include("dialog[open]")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      results.violations
        .filter((v) => ["critical", "serious"].includes(v.impact ?? ""))
        .map((v) => v.id),
    ).toEqual([]);
  });
});

test.describe("Ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("fehlt nur der Details-Button, alle Daten stehen in der Liste", async ({
    page,
  }) => {
    await page.goto("/fahrzeuge");
    await expect(page.locator("[data-vehicle-open]").first()).toBeHidden();
    await expect(page.locator(".vehicles-item").first()).toContainText("2.000");
  });
});
