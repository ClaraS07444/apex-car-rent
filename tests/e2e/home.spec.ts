import { expect, test } from "@playwright/test";

test.describe("Startseite: Hero (PRD 8.1 S1, 9.7, 17)", () => {
  test("H1 ist die Wortmarke mit vollständiger Textalternative (A-11)", async ({
    page,
  }) => {
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveAccessibleName(
      "Apex Rent – Porsche GT3 RS mieten in Aachen",
    );
  });

  test("Button ist ab dem ersten Frame klickbar", async ({ page }) => {
    await page.goto("/", { waitUntil: "commit" });
    await page.locator(".hero__cta").click();
    await expect(page).toHaveURL(/\/kontakt$/);
  });

  test("Sequenz endet nach höchstens 1,9 s, das Fahrzeug fährt herein", async ({
    page,
  }) => {
    await page.goto("/");
    const car = page.locator("[data-hero-car]");
    await expect(car).toHaveAttribute("data-state", "drive");
    // Längste Animation: Einfedern, 1600ms Verzögerung + 300ms = 1900ms
    const longest = await page.evaluate(() =>
      Math.max(
        ...document
          .querySelector(".hero")!
          .getAnimations({ subtree: true })
          .map((a) => Number(a.effect?.getComputedTiming().endTime ?? 0)),
      ),
    );
    expect(Math.round(longest)).toBeLessThanOrEqual(1900);
  });

  test("keine Layoutverschiebung während der Sequenz (P-02)", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "chromium", "Layout-Shift-API nur in Chromium");
    await page.goto("/");
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let sum = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries() as PerformanceEntry[] &
              { value: number; hadRecentInput: boolean }[]) {
              if (!entry.hadRecentInput) sum += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => resolve(sum), 2500);
        }),
    );
    expect(cls).toBe(0);
  });

  test("kein horizontaler Scroll trotz randlosem Fahrzeug", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(2000);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("Reduzierte Bewegung (PRD 9.7, A-09)", () => {
  test.use({ reducedMotion: "reduce" });

  test("Hero steht sofort an der Endposition", async ({ page }) => {
    await page.goto("/");
    // Erlaubt sind nur die auf 1ms verkürzten Übergänge aus motion.css
    const moving = await page.evaluate(
      () =>
        document
          .querySelector(".hero")!
          .getAnimations({ subtree: true })
          .filter(
            (a) => Number(a.effect?.getComputedTiming().activeDuration) > 1,
          ).length,
    );
    expect(moving).toBe(0);
    const transform = await page
      .locator("[data-hero-car]")
      .evaluate((el) => getComputedStyle(el).transform);
    expect(transform).toBe("none");
  });
});

test.describe("Scroll-Animationen (PRD 9.7)", () => {
  test("Inhalte unterhalb erscheinen erst beim Scrollen, genau einmal", async ({
    page,
  }) => {
    await page.goto("/");
    const closing = page.locator(".cta-band [data-reveal]");
    await expect(closing).not.toHaveAttribute("data-revealed");
    await closing.scrollIntoViewIfNeeded();
    await expect(closing).toHaveAttribute("data-revealed", "");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(closing).toHaveAttribute("data-revealed", "");
  });
});

test.describe("Ohne JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("sind alle Inhalte sichtbar", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1200);
    const hidden = await page.evaluate(
      () =>
        [
          ...document.querySelectorAll<HTMLElement>(
            "[data-reveal], [data-reveal] > *",
          ),
        ].filter((el) => getComputedStyle(el).opacity !== "1").length,
    );
    expect(hidden).toBe(0);
    await expect(page.locator(".hero__car img")).toBeInViewport();
  });
});

test.describe("Fällt das Motion-Skript aus", () => {
  test("gibt die Notfall-Freigabe nach 2,5 s alle Inhalte frei", async ({
    page,
  }) => {
    // Astro bettet die kleinen Module direkt ein; sie werden hier aus dem HTML
    // entfernt. Das Inline-Skript im head (js-Klasse, Freigabe-Timer) bleibt.
    await page.route("**/", async (route) => {
      const response = await route.fetch();
      const html = (await response.text()).replace(
        /<script type="module">[\s\S]*?<\/script>/g,
        "",
      );
      await route.fulfill({ response, body: html });
    });
    await page.goto("/");
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains("motion-ready"),
      ),
    ).toBe(false);
    await page.waitForTimeout(4500);
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll<HTMLElement>("[data-reveal]")].filter(
          (el) => getComputedStyle(el).opacity !== "1",
        ).length,
    );
    expect(hidden).toBe(0);
    await expect(page.locator(".hero__car img")).toBeInViewport();
  });
});

test.describe("Startseite: Inhalte (PRD 8.1, 7, T-02)", () => {
  test("Sections wechseln Weiß und Schwarz, beginnend mit Weiß", async ({
    page,
  }) => {
    await page.goto("/");
    const tones = await page
      .locator("main > section")
      .evaluateAll((sections) =>
        sections.map((s) => s.getAttribute("data-tone")),
      );
    expect(tones.length).toBe(8);
    tones.forEach((tone, i) =>
      expect(tone).toBe(i % 2 === 0 ? "light" : "dark"),
    );
  });

  test("Fahrzeugkarten mit Preis aus der Datenquelle und Vorbelegung", async ({
    page,
  }) => {
    await page.goto("/en/");
    const cards = page.locator(".vehicle-card");
    await expect(cards).toHaveCount(3);
    await expect(cards.first()).toContainText("510 hp");
    await expect(cards.first()).toContainText("from €2,000 / day");
    await expect(cards.nth(1).locator("a").first()).toHaveAttribute(
      "href",
      "/en/cars?auto=rot",
    );
    await expect(cards.nth(1).locator("a").last()).toHaveAttribute(
      "href",
      "/en/contact?auto=rot",
    );
    await expect(cards.nth(1).locator("a").last()).toHaveAccessibleName(
      "Request GT3 RS Red",
    );
  });

  test("Service-CTAs belegen Anlass und Paket vor", async ({ page }) => {
    await page.goto("/nl/");
    const hrefs = await page
      .locator(".info-card a")
      .evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual([
      "/nl/contact?anlass=event",
      "/nl/contact?anlass=gutschein",
      "/nl/contact?paket=langzeit",
    ]);
  });

  test("Bewertungen sind als Beispielbewertungen gekennzeichnet (E-04)", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#reviews-title")).toHaveText(
      "Beispielbewertungen",
    );
    await expect(page.locator(".home-review")).toHaveCount(3);
    await expect(
      page.locator(".home-review__stars").first(),
    ).toHaveAccessibleName("5 von 5 Sternen");
  });
});
