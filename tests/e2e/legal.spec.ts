import { expect, test } from "@playwright/test";

test.describe("Rechtsseiten (PRD S-02)", () => {
  for (const [path, title] of [
    ["/impressum", "Impressum"],
    ["/datenschutz", "Datenschutzerklärung"],
    ["/en/legal-notice", "Legal notice"],
    ["/en/privacy", "Privacy policy"],
    ["/nl/colofon", "Colofon"],
    ["/nl/privacy", "Privacyverklaring"],
  ] as const) {
    test(`${path}: H1, Konzept-Hinweis bzw. Inhalt, Stand`, async ({
      page,
    }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(title);
      await expect(page.locator(".legal__updated time")).toHaveAttribute(
        "datetime",
        /^\d{4}-\d{2}-\d{2}$/,
      );
      // Footer markiert die aktive Rechtsseite
      await expect(
        page.locator('.site-footer a[aria-current="page"]'),
      ).toHaveCount(1);
    });
  }

  test("Datenschutz beschreibt die tatsächliche Verarbeitung", async ({
    page,
  }) => {
    await page.goto("/datenschutz");
    const body = page.locator(".legal__body");
    await expect(body).toContainText("keine Cookies");
    await expect(body).toContainText("Anfrageformular ist eine Demonstration");
    await expect(body).toContainText(
      "erst geladen, wenn du auf „Karte laden“ klickst",
    );
    await expect(body).toContainText("keine Verbindung zu Google Fonts");
  });

  test("offene Angaben sind sichtbar als Platzhalter markiert", async ({
    page,
  }) => {
    // Offen sind noch die Cloudflare-Angaben in der Datenschutzerklärung
    await page.goto("/datenschutz");
    const placeholders = page.locator("mark.placeholder");
    await expect(placeholders.first()).toBeVisible();
    await expect(placeholders.first()).toHaveText(/^\[.+\]$/);
  });

  test("Datenschutz-Link im Formular führt zur Datenschutzseite", async ({
    page,
  }) => {
    await page.goto("/en/contact");
    await page.getByRole("link", { name: "privacy policy" }).click();
    await expect(page).toHaveURL(/\/en\/privacy$/);
  });
});

test.describe("404 (PRD 10.5)", () => {
  for (const [path, title, home] of [
    ["/gibt-es-nicht", "Diese Seite ist von der Strecke abgekommen.", "/"],
    ["/en/does-not-exist", "This page has gone off track.", "/en/"],
    ["/nl/bestaat-niet", "Deze pagina is uit de bocht gevlogen.", "/nl/"],
  ] as const) {
    test(`${path}: Status 404, Text und Wege zurück in der Sprache der URL`, async ({
      page,
    }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.locator("h1")).toHaveText(title);
      const links = page.locator(".not-found__actions a");
      await expect(links).toHaveCount(2);
      await expect(links.first()).toHaveAttribute("href", home);
      await expect(page.locator(".site-nav a[aria-current]")).toHaveCount(0);
    });
  }
});
