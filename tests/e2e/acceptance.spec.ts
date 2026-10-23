import { expect, test, type Page } from "@playwright/test";
import { allPaths, gotoReady } from "./helpers";

/**
 * Akzeptanzkriterien aus PRD 17 (Farbsystem, Typografie, Datenschutz,
 * Tastatur), die sich über berechnete Stile prüfen lassen. Je Breite einmal
 * in Chromium; die übrigen Browser decken die Funktionstests ab.
 */

test.use({ reducedMotion: "reduce" });

/** Alle sichtbaren Elemente mit eigenem Text, inklusive Kontext. */
async function textElements(page: Page) {
  return page.evaluate(() => {
    const visible = (el: Element) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return (
        rect.width > 1 &&
        rect.height > 1 &&
        style.visibility !== "hidden" &&
        style.display !== "none" &&
        !el.closest("[hidden], dialog:not([open]), .visually-hidden, [inert]")
      );
    };
    const background = (el: Element | null): string => {
      for (let node = el; node; node = node.parentElement) {
        const color = getComputedStyle(node).backgroundColor;
        if (color !== "rgba(0, 0, 0, 0)" && color !== "transparent")
          return color;
      }
      return "rgb(255, 255, 255)";
    };
    return [...document.body.querySelectorAll("*")]
      .filter((el) =>
        [...el.childNodes].some(
          (node) =>
            node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        ),
      )
      .filter(
        (el) => !["OPTION", "SCRIPT", "STYLE", "TEMPLATE"].includes(el.tagName),
      )
      .filter(visible)
      .map((el) => {
        const style = getComputedStyle(el);
        return {
          text: el.textContent?.trim().slice(0, 40) ?? "",
          tag: el.tagName,
          size: Number.parseFloat(style.fontSize),
          family: style.fontFamily,
          weight: style.fontWeight,
          color: style.color,
          background: background(el),
        };
      });
  });
}

for (const width of [390, 1440]) {
  test.describe(`Gestaltung bei ${width}px (PRD 9, 17)`, () => {
    test.beforeEach(({ browserName, page }) => {
      test.skip(
        browserName !== "chromium" || (page.viewportSize()?.width ?? 0) < 1024,
        "einmal je Breite in Chromium",
      );
    });

    test("Texte: Manrope 300, nirgends unter 15px", async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const problems: string[] = [];
      for (const path of allPaths) {
        await gotoReady(page, path);
        for (const item of await textElements(page)) {
          if (item.size < 14.99)
            problems.push(`${path} ${item.tag} ${item.size}px "${item.text}"`);
          if (
            !item.family.startsWith('"Manrope"') &&
            !item.family.startsWith("Manrope")
          ) {
            problems.push(
              `${path} ${item.tag} Schrift ${item.family} "${item.text}"`,
            );
          }
          if (item.weight !== "300")
            problems.push(
              `${path} ${item.tag} Schnitt ${item.weight} "${item.text}"`,
            );
        }
      }
      expect(problems).toEqual([]);
    });

    test("Rot nie als Text unter 24px auf Schwarz (PRD 9.1, A-01)", async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const problems: string[] = [];
      for (const path of allPaths) {
        await gotoReady(page, path);
        for (const item of await textElements(page)) {
          if (
            item.color === "rgb(200, 16, 46)" &&
            item.background === "rgb(0, 0, 0)" &&
            item.size < 24
          ) {
            problems.push(`${path} ${item.tag} "${item.text}"`);
          }
        }
      }
      expect(problems).toEqual([]);
    });

    test("keine runden Ecken, Schatten oder Verläufe", async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const problems: string[] = [];
      for (const path of allPaths) {
        await gotoReady(page, path);
        const found = await page.evaluate(() =>
          [...document.querySelectorAll("*")].flatMap((el) => {
            const style = getComputedStyle(el);
            const issues: string[] = [];
            const label = `${el.tagName}.${el.className}`.slice(0, 60);
            // Native Radiobuttons und Checkboxen zeichnet der Browser selbst
            if (
              !(el instanceof HTMLInputElement) &&
              style.borderRadius !== "0px"
            ) {
              issues.push(`${label} border-radius ${style.borderRadius}`);
            }
            if (style.boxShadow !== "none") issues.push(`${label} box-shadow`);
            if (style.backgroundImage.includes("gradient"))
              issues.push(`${label} Verlauf`);
            return issues;
          }),
        );
        problems.push(...found.map((issue) => `${path} ${issue}`));
      }
      expect(problems).toEqual([]);
    });
  });
}

test.describe("Auf jeder Seite (PRD 17, S-11)", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== "chromium", "einmal genügt");
  });

  test("Konzept-Hinweis im Footer", async ({ page }) => {
    for (const path of allPaths) {
      await page.goto(path);
      await expect(page.locator(".site-footer__note"), path).toContainText(
        /Apex Rent (ist ein fiktives Unternehmen|is a fictional company|is een fictief bedrijf)/,
      );
    }
  });

  test("Sections wechseln Weiß und Schwarz, Footer schwarz mit roter Linie", async ({
    page,
  }) => {
    for (const path of allPaths) {
      await page.goto(path);
      const tones = await page
        .locator("main > section")
        .evaluateAll((sections) =>
          sections.map((s) => s.getAttribute("data-tone")),
        );
      expect(tones.length, path).toBeGreaterThan(0);
      tones.forEach((tone, i) =>
        expect(tone, `${path} Section ${i + 1}`).toBe(
          i % 2 === 0 ? "light" : "dark",
        ),
      );
      const footer = await page.locator("footer").evaluate((el) => {
        const style = getComputedStyle(el);
        return [style.backgroundColor, style.borderTopColor].join(" ");
      });
      expect(footer, path).toBe("rgb(0, 0, 0) rgb(200, 16, 46)");
    }
  });

  test("keine Anfrage an fremde Dienste, also auch kein Tracking (E-13)", async ({
    page,
  }) => {
    const foreign: string[] = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (url.protocol.startsWith("http") && url.hostname !== "localhost") {
        foreign.push(request.url());
      }
    });
    for (const path of allPaths) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.mouse.wheel(0, 20000);
      await page.waitForLoadState("networkidle");
    }
    expect(foreign).toEqual([]);
  });

  test("nach dem Laden kein Cookie und kein lokaler Speicher", async ({
    page,
    context,
  }) => {
    for (const path of allPaths) {
      await page.goto(path);
      await page.waitForLoadState("load");
      expect(await context.cookies(), path).toEqual([]);
      expect(
        await page.evaluate(() => localStorage.length + sessionStorage.length),
        path,
      ).toBe(0);
    }
  });
});

test.describe("Tastatur (PRD 17, A-02)", () => {
  // Feste Browser-Sprache, damit die Reihenfolge im Datumsfeld bekannt ist
  test.use({ locale: "en-US" });

  test.beforeEach(({ browserName, page }) => {
    test.skip(
      browserName !== "chromium" || (page.viewportSize()?.width ?? 0) < 1024,
      "Ablauf einmal am Desktop",
    );
  });

  /** Drückt Tab, bis das Ziel den Fokus hat (nur Tastatur, kein Klick). */
  async function tabTo(page: Page, selector: string, max = 80) {
    for (let i = 0; i < max; i++) {
      if (
        await page.evaluate((s) => document.activeElement?.matches(s), selector)
      )
        return;
      await page.keyboard.press("Tab");
    }
    throw new Error(`${selector} nicht per Tab erreichbar`);
  }

  test("vom Hero bis zur Erfolgsmeldung nur mit der Tastatur", async ({
    page,
  }) => {
    await gotoReady(page, "/");
    await tabTo(page, ".hero__cta");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/kontakt$/);
    await page.evaluate(() => document.fonts.ready);

    await tabTo(page, "#field-vehicle-silber");
    await page.keyboard.press("Space");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#field-vehicle-rot")).toBeChecked();

    await tabTo(page, "input[name=package]");
    await page.keyboard.press("Space");
    await expect(page.locator("#field-package-tag")).toBeChecked();

    // Datumsfeld per Tastatur, Reihenfolge in en-US: MM TT JJJJ
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const pad = (n: number) => String(n).padStart(2, "0");
    await tabTo(page, "#field-startDate");
    await page.keyboard.type(
      `${pad(date.getMonth() + 1)}${pad(date.getDate())}${date.getFullYear()}`,
    );

    for (const [id, value] of [
      ["firstName", "Lea"],
      ["lastName", "Beispiel"],
      ["email", "lea@beispiel.de"],
      ["phone", "+49 241 123456"],
    ] as const) {
      await tabTo(page, `#field-${id}`);
      await page.keyboard.type(value);
    }
    await tabTo(page, "#field-requirements");
    await page.keyboard.press("Space");
    await tabTo(page, "#field-privacy");
    await page.keyboard.press("Space");

    await page.waitForTimeout(3100); // Mindest-Ausfüllzeit gegen Bots
    await tabTo(page, "[data-submit]");
    await page.keyboard.press("Enter");

    const title = page.locator("[data-success-title]");
    await expect(title).toHaveText(
      "Danke, Lea. Deine Anfrage ist eingegangen.",
    );
    await expect(title).toBeFocused();
  });
});

test.describe("Hero Smartphone (PRD 17)", () => {
  test.beforeEach(({ browserName, page }) => {
    test.skip(
      browserName !== "chromium" || (page.viewportSize()?.width ?? 0) < 1024,
      "einmal in Chromium",
    );
  });

  test("390 x 844: Wortmarke, Fahrzeug, Claim links, Button rechts, ohne Scrollen", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["/", "/en/", "/nl/"]) {
      await gotoReady(page, path);
      const box = async (selector: string) => {
        const rect = await page.locator(selector).boundingBox();
        if (!rect) throw new Error(`${selector} fehlt`);
        return rect;
      };
      const mark = await box(".hero__wordmark");
      const car = await box(".hero__car");
      const claim = await box(".hero__claim");
      const cta = await box(".hero__cta");
      expect(mark.y, path).toBeLessThan(car.y);
      expect(car.y, path).toBeLessThan(claim.y);
      expect(claim.x, path).toBeLessThan(cta.x);
      for (const rect of [mark, car, claim, cta]) {
        expect(rect.y + rect.height, path).toBeLessThanOrEqual(844);
      }
    }
  });
});
