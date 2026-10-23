import { expect, test } from "@playwright/test";

test.describe("Indexierung aus (PRD 13.1, E-01)", () => {
  test.beforeEach(({ browserName }) => {
    test.skip(browserName !== "chromium", "Header sind engine-unabhängig");
  });

  for (const path of [
    "/",
    "/en/cars",
    "/nl/contact",
    "/gibt-es-nicht",
    "/sitemap.xml",
  ]) {
    test(`${path}: Antwort trägt X-Robots-Tag noindex`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
    });
  }

  test("sitemap.xml und robots.txt werden mit passendem Typ ausgeliefert", async ({
    request,
  }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()["content-type"]).toContain("xml");
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain(
      "Sitemap: https://apex-car-rent.pages.dev/sitemap.xml",
    );
  });
});
