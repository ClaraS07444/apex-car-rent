import { expect, test, type Page } from "@playwright/test";
import { allPaths, gotoReady } from "./helpers";

/**
 * Der Testserver liefert dist/_headers wie Cloudflare aus; die
 * Content-Security-Policy ist also in allen Browsertests aktiv. Diese Tests
 * prüfen zusätzlich ausdrücklich, dass sie nichts blockiert (PRD 15.2).
 */

/**
 * Sammelt CSP-Verletzungen der Seite. Ausgenommen ist nur ein Signal von
 * WebKit zu seiner eigenen Darstellung von <select> (style-src-attr ohne
 * Quelldatei): Es ändert nachweislich nichts an Darstellung oder Funktion,
 * und eigene style-Attribute schließt tests/security.test.mjs aus.
 */
async function collectViolations(
  page: Page,
  browserName: string,
): Promise<string[]> {
  const violations: string[] = [];
  await page.exposeFunction(
    "__reportViolation",
    (directive: string, uri: string, source: string) => {
      const webkitSelect =
        browserName === "webkit" && directive === "style-src-attr" && !source;
      if (!webkitSelect) violations.push(`${directive}: ${uri} (${source})`);
    },
  );
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      (
        window as unknown as {
          __reportViolation: (d: string, u: string, s: string) => void;
        }
      ).__reportViolation(
        event.violatedDirective,
        event.blockedURI || "inline",
        event.sourceFile,
      );
    });
  });
  return violations;
}

test.describe("Content-Security-Policy (PRD 15.2)", () => {
  test("die Antwort trägt die Policy und die Sicherheits-Header", async ({
    request,
  }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-frame-options"]).toBe("DENY");
  });

  test("keine Verletzung auf allen Seiten", async ({ page, browserName }) => {
    const violations = await collectViolations(page, browserName);
    for (const path of allPaths) {
      await page.goto(path);
      await page.waitForLoadState("load");
    }
    expect(violations).toEqual([]);
  });

  test("Skripte laufen unter der Policy: Animation, Menü, Overlay", async ({
    page,
    browserName,
  }) => {
    const violations = await collectViolations(page, browserName);
    await gotoReady(page, "/");
    await expect(page.locator("html")).toHaveClass(/motion-ready/);
    await gotoReady(page, "/fahrzeuge?auto=rot");
    await expect(page.locator("dialog[open]")).toHaveCount(1);
    expect(violations).toEqual([]);
  });

  test("Formular und Zwei-Klick-Karte funktionieren unter der Policy", async ({
    page,
    browserName,
  }) => {
    const violations = await collectViolations(page, browserName);
    await page.route(/google\./, (route) =>
      route.fulfill({ contentType: "text/html", body: "<p>Karte</p>" }),
    );
    await gotoReady(page, "/kontakt?paket=woche");
    await expect(page.locator("[data-preview-total]")).toHaveText("10.000 €");
    await page.getByRole("button", { name: "Karte laden" }).click();
    await expect(page.locator("[data-map]")).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(violations).toEqual([]);
  });
});
