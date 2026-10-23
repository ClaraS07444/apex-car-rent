import { expect, test } from "@playwright/test";
import { routes } from "../../src/i18n/routes";
import { isDesktop, tabKey } from "./helpers";

test.describe("Skip-Link (A-03)", () => {
  test("ist das erste fokussierbare Element und springt zum Inhalt", async ({
    page,
    browserName,
  }) => {
    await page.goto("/");
    await page.keyboard.press(tabKey(browserName));
    const skip = page.locator(".skip-link");
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await expect(skip).toHaveText("Zum Inhalt springen");

    await page.keyboard.press("Enter");
    await expect(page.locator("main#main")).toBeFocused();
  });
});

test.describe("Desktop-Navigation (PRD 6)", () => {
  test.beforeEach(({ page }) => {
    test.skip(!isDesktop(page), "nur ab 1024px");
  });

  for (const [locale, label] of [
    ["de", "Fahrzeuge"],
    ["en", "Cars"],
    ["nl", "Auto's"],
  ] as const) {
    test(`${locale}: aktive Seite ist markiert`, async ({ page }) => {
      await page.goto(routes.vehicles[locale]);
      const nav = page.locator(".site-nav");
      await expect(nav).toBeVisible();
      await expect(nav.locator('[aria-current="page"]')).toHaveText(label);
      await expect(nav.locator("a")).toHaveCount(3);
    });
  }

  test("Leiste verkleinert sich nach 80px Scrollen auf sichtbare 72px", async ({
    page,
  }) => {
    await page.goto("/");
    // Inhalt verlängern, damit gescrollt werden kann (Seiten sind noch leer)
    await page.evaluate(() => {
      document.querySelector("main")!.style.minHeight = "3000px";
    });
    const header = page.locator("[data-site-header]");
    await expect(header).not.toHaveAttribute("data-condensed");

    await page.mouse.wheel(0, 300);
    await expect(header).toHaveAttribute("data-condensed", "");
    await expect
      .poll(async () => {
        const box = await header.boundingBox();
        return box ? Math.round(box.y + box.height) : 0;
      })
      .toBe(72);
  });
});

test.describe("Sprachumschalter (PRD 6, A-13)", () => {
  test("führt auf die entsprechende Seite der Zielsprache", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    const sw = page.locator(".site-footer .lang-switch");
    await expect(sw.locator('a[hreflang="en"]')).toHaveAttribute(
      "href",
      "/en/contact",
    );
    await expect(sw.locator('a[hreflang="nl"]')).toHaveAttribute(
      "href",
      "/nl/contact",
    );
    await expect(sw.locator('a[aria-current="true"]')).toHaveAttribute(
      "hreflang",
      "de",
    );
  });

  test("nennt die Sprachen ausgeschrieben für Screenreader", async ({
    page,
  }) => {
    await page.goto("/");
    const sw = page.locator(".site-footer .lang-switch");
    await expect(sw.locator('a[hreflang="de"]')).toHaveAccessibleName(
      "Deutsch",
    );
    await expect(sw.locator('a[hreflang="en"]')).toHaveAccessibleName(
      "English",
    );
    await expect(sw.locator('a[hreflang="nl"]')).toHaveAccessibleName(
      "Nederlands",
    );
    await expect(sw.locator('a[hreflang="nl"]')).toHaveAttribute("lang", "nl");
  });

  test("behält URL-Parameter beim Wechsel", async ({ page }) => {
    await page.goto("/fahrzeuge?auto=rot");
    const en = page.locator('.site-footer .lang-switch a[hreflang="en"]');
    await expect(en).toHaveAttribute("href", /\/en\/cars\?auto=rot$/);
  });

  test("führt auf der 404-Seite zur Startseite der Zielsprache", async ({
    page,
  }) => {
    await page.goto("/gibt-es-nicht");
    const en = page.locator('.site-footer .lang-switch a[hreflang="en"]');
    await expect(en).toHaveAttribute("href", "/en/");
  });
});

test.describe("Mobile-Menü (PRD 6, A-05)", () => {
  test.beforeEach(({ page }) => {
    test.skip(isDesktop(page), "nur unter 1024px");
  });

  test("öffnet, hält den Fokus im Dialog und schließt per Escape", async ({
    page,
    browserName,
  }) => {
    await page.goto("/");
    const open = page.locator("[data-menu-open]");
    const dialog = page.locator("[data-menu-dialog]");
    await expect(page.locator(".site-nav")).toBeHidden();
    await expect(open).toBeVisible();
    await expect(open).toHaveAccessibleName("Menü öffnen");

    await open.click();
    await expect(dialog).toBeVisible();
    await expect(dialog).toBeFocused();
    await expect(open).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.locator("a", { hasText: "Fahrzeuge" })).toBeVisible();

    // Hintergrund scrollt nicht
    const overflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow,
    );
    expect(overflow).toBe("hidden");

    // Fokus verlässt den Dialog nicht in Richtung Seite
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press(tabKey(browserName));
      const outside = await page.evaluate(() => {
        const el = document.activeElement;
        const d = document.querySelector("[data-menu-dialog]");
        return Boolean(el && el !== document.body && d && !d.contains(el));
      });
      expect(outside).toBe(false);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();
    await expect(open).toHaveAttribute("aria-expanded", "false");
  });

  test("schließt per Kreuz und gibt den Fokus zurück", async ({ page }) => {
    await page.goto("/en/");
    await page.locator("[data-menu-open]").click();
    const close = page.locator("[data-menu-close]");
    await expect(close).toHaveAccessibleName("Close menu");
    await close.click();
    await expect(page.locator("[data-menu-dialog]")).toBeHidden();
    await expect(page.locator("[data-menu-open]")).toBeFocused();
  });

  test("Auswahl eines Menüpunkts navigiert", async ({ page }) => {
    await page.goto("/nl/");
    await page.locator("[data-menu-open]").click();
    await page.locator("[data-menu-dialog] a", { hasText: "Contact" }).click();
    await expect(page).toHaveURL(/\/nl\/contact$/);
    await expect(page.locator("[data-menu-dialog]")).toBeHidden();
  });

  test("Tippflächen sind mindestens 48 x 48 px (A-08)", async ({ page }) => {
    await page.goto("/");
    const box = await page.locator("[data-menu-open]").boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(48);
    expect(box?.height).toBeGreaterThanOrEqual(48);
  });
});

test.describe("Ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("ist die Navigation auch mobil als Liste erreichbar", async ({
    page,
  }) => {
    await page.goto("/fahrzeuge");
    await expect(page.locator(".site-nav")).toBeVisible();
    await expect(page.locator(".site-nav a")).toHaveCount(3);
    await expect(page.locator("[data-menu-open]")).toBeHidden();
  });
});
