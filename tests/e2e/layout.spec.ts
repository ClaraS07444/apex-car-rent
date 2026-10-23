import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { allPaths } from "./helpers";

test.describe("Footer (PRD 6, E-03, S-11)", () => {
  for (const [path, note] of [
    ["/", "Konzeptprojekt: Apex Rent ist ein fiktives Unternehmen."],
    ["/en/", "Concept project: Apex Rent is a fictional company."],
    ["/nl/", "Conceptproject: Apex Rent is een fictief bedrijf."],
  ] as const) {
    test(`${path}: Kontaktdaten und Konzept-Hinweis`, async ({ page }) => {
      await page.goto(path);
      const footer = page.locator(".site-footer");
      await expect(footer).toContainText("Apexstraße 1");
      await expect(footer).toContainText("52068 Aachen");
      await expect(footer).toContainText("+49 241 0000 000");
      await expect(footer).toContainText("anfrage@apex-rent.example");
      await expect(footer).toContainText("@apexrent.aachen");
      await expect(footer).toContainText(note);
      // Fiktive Kontaktdaten sind nicht verlinkt (E-03)
      await expect(
        footer.locator(
          'a[href^="tel:"], a[href^="mailto:"], a[href*="instagram"]',
        ),
      ).toHaveCount(0);
    });
  }

  test("Öffnungszeiten je Sprache aus den Daten formatiert", async ({
    page,
  }) => {
    await page.goto("/en/");
    const footer = page.locator(".site-footer");
    await expect(footer).toContainText("Mon–Fri 09:00–19:00");
    await expect(footer).toContainText("Sat 10:00–16:00");
    await expect(footer).toContainText("Sunday by appointment");
  });
});

test.describe("404 (PRD 10.5)", () => {
  for (const [path, lang] of [
    ["/gibt-es-nicht", "de"],
    ["/en/does-not-exist", "en"],
    ["/nl/bestaat-niet", "nl"],
  ] as const) {
    test(`${path} liefert Status 404 in der Sprache der URL`, async ({
      page,
    }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
    });
  }
});

test.describe("Barrierefreiheit (axe, WCAG 2.2 AA)", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(
      browserName !== "chromium",
      "axe-Ergebnisse sind engine-unabhängig",
    );
  });

  for (const path of allPaths) {
    test(`${path}: keine kritischen oder schweren Fehler`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const severe = results.violations.filter((v) =>
        ["critical", "serious"].includes(v.impact ?? ""),
      );
      expect(
        severe.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(", ")}`,
        ),
      ).toEqual([]);
    });
  }
});

test.describe("Kein horizontaler Overflow (A-10, PRD 17)", () => {
  test.beforeEach(({ browserName, page }) => {
    test.skip(
      browserName !== "chromium" || (page.viewportSize()?.width ?? 0) < 1024,
      "einmal je Breite genügt",
    );
  });

  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    test(`${width}px auf allen Seiten`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of allPaths) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow, path).toBeLessThanOrEqual(0);
      }
    });
  }
});
