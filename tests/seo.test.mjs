// Prüft die Build-Ausgabe gegen PRD 13 und die SEO-Kriterien aus PRD 17.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const SITE = "https://apex-car-rent.pages.dev";

// Die 15 Seiten aus PRD 6, je Seite die drei Sprachfassungen
const PAGES = {
  home: { de: "/", en: "/en/", nl: "/nl/" },
  vehicles: { de: "/fahrzeuge", en: "/en/cars", nl: "/nl/autos" },
  contact: { de: "/kontakt", en: "/en/contact", nl: "/nl/contact" },
  legalNotice: { de: "/impressum", en: "/en/legal-notice", nl: "/nl/colofon" },
  privacy: { de: "/datenschutz", en: "/en/privacy", nl: "/nl/privacy" },
};
const NOT_FOUND = ["/404", "/en/404", "/nl/404"];

const fileFor = (url) =>
  join(
    DIST,
    url.endsWith("/") ? `${url.slice(1)}index.html` : `${url.slice(1)}.html`,
  );

const decode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

function head(html) {
  const meta = (attr, name) =>
    [
      ...html.matchAll(
        new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`, "g"),
      ),
    ].map((m) => decode(m[1]));
  return {
    title: decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ""),
    description: meta("name", "description")[0] ?? "",
    canonical: html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? null,
    alternates: Object.fromEntries(
      [
        ...html.matchAll(
          /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g,
        ),
      ].map((m) => [m[1], m[2]]),
    ),
    ogUrl: meta("property", "og:url")[0] ?? null,
    ogImage: meta("property", "og:image")[0] ?? null,
    ogTitle: meta("property", "og:title")[0] ?? null,
    twitterCard: meta("name", "twitter:card")[0] ?? null,
    jsonLd: [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].map((m) => JSON.parse(m[1])),
  };
}

const pages = [];
for (const [key, byLocale] of Object.entries(PAGES)) {
  for (const [locale, url] of Object.entries(byLocale)) {
    pages.push({
      key,
      locale,
      url,
      ...head(await readFile(fileFor(url), "utf8")),
    });
  }
}

test("jede Seite: Titel bis 60, Beschreibung 140 bis 160 Zeichen (PRD 13.1, 17)", () => {
  for (const page of pages) {
    assert.ok(
      page.title.length > 0 && page.title.length <= 60,
      `${page.url}: Titel ${page.title.length}`,
    );
    assert.ok(
      page.description.length >= 140 && page.description.length <= 160,
      `${page.url}: Beschreibung ${page.description.length}`,
    );
  }
});

test("Titel und Beschreibungen sind je Seite und Sprache eindeutig", () => {
  assert.equal(new Set(pages.map((p) => p.title)).size, pages.length);
  assert.equal(new Set(pages.map((p) => p.description)).size, pages.length);
});

test("Meta-Beschreibung der Startseite nutzt die Preise aus pricing.json (T-02)", () => {
  const home = pages.find((p) => p.url === "/");
  assert.match(
    home.description,
    /Tag 2\.000\s€, Wochenende 3\.500\s€, Woche 10\.000\s€/,
  );
});

test("selbstreferenzierender Canonical und og:url je Seite", () => {
  for (const page of pages) {
    assert.equal(page.canonical, SITE + page.url, page.url);
    assert.equal(page.ogUrl, page.canonical, page.url);
  }
});

test("hreflang für alle 3 Sprachen plus x-default auf Deutsch, gegenseitig", () => {
  for (const page of pages) {
    const expected = { ...PAGES[page.key] };
    assert.deepEqual(
      page.alternates,
      {
        de: SITE + expected.de,
        en: SITE + expected.en,
        nl: SITE + expected.nl,
        "x-default": SITE + expected.de,
      },
      page.url,
    );
    // Gegenseitigkeit: jede Alternative verweist zurück auf diese Seite
    for (const [, href] of Object.entries(page.alternates)) {
      const target = pages.find((p) => SITE + p.url === href);
      assert.ok(target, `${page.url}: Ziel ${href} fehlt`);
      assert.equal(target.alternates[page.locale], SITE + page.url);
    }
  }
});

test("Open Graph und Twitter Card mit vorhandenem Bild", () => {
  for (const page of pages) {
    assert.ok(
      page.ogImage?.startsWith(`${SITE}/og/`),
      `${page.url}: ${page.ogImage}`,
    );
    assert.ok(
      existsSync(join(DIST, page.ogImage.slice(SITE.length))),
      page.ogImage,
    );
    assert.equal(page.ogTitle, page.title);
    assert.equal(page.twitterCard, "summary_large_image");
  }
});

test("JSON-LD: AutoRental, je Fahrzeug Car mit Angeboten, FAQPage (PRD 13.3)", () => {
  const types = (page) => page.jsonLd.map((d) => d["@type"]);
  for (const page of pages) {
    const expected =
      page.key === "vehicles"
        ? ["AutoRental", "Car", "Car", "Car", "FAQPage"]
        : ["home", "contact"].includes(page.key)
          ? ["AutoRental"]
          : [];
    assert.deepEqual(types(page), expected, page.url);
    for (const data of page.jsonLd)
      assert.equal(data["@context"], "https://schema.org");
  }

  const vehicles = pages.find((p) => p.url === "/fahrzeuge");
  const rental = vehicles.jsonLd[0];
  assert.equal(rental.address.postalCode, "52068");
  assert.deepEqual(rental.geo, {
    "@type": "GeoCoordinates",
    latitude: 50.7735,
    longitude: 6.1325,
  });
  assert.equal(rental.openingHoursSpecification.length, 2);
  assert.equal(rental.sameAs, undefined, "fiktives Instagram nicht als sameAs");

  const cars = vehicles.jsonLd.filter((d) => d["@type"] === "Car");
  for (const car of cars) {
    assert.deepEqual(
      car.offers.map((o) => o.price),
      [2000, 3500, 10000],
    );
    assert.ok(existsSync(join(DIST, car.image.slice(SITE.length))), car.image);
  }
  assert.equal(vehicles.jsonLd.at(-1).mainEntity.length, 6);
});

test("fiktive Bewertungen sind nicht ausgezeichnet (PRD 13.3)", () => {
  for (const page of pages) {
    const json = JSON.stringify(page.jsonLd);
    assert.doesNotMatch(json, /Review|AggregateRating/, page.url);
  }
});

test("404-Seiten haben weder Canonical noch hreflang", async () => {
  for (const url of NOT_FOUND) {
    const page = head(await readFile(fileFor(url), "utf8"));
    assert.equal(page.canonical, null, url);
    assert.deepEqual(page.alternates, {}, url);
  }
});

test("sitemap.xml: 15 URLs mit hreflang-Alternativen, robots.txt verweist darauf", async () => {
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf8");
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .sort();
  assert.deepEqual(locs, pages.map((p) => p.canonical).sort());
  assert.equal([...xml.matchAll(/<xhtml:link /g)].length, 15 * 4);

  const robots = await readFile(join(DIST, "robots.txt"), "utf8");
  assert.match(robots, new RegExp(`^Sitemap: ${SITE}/sitemap\\.xml$`, "m"));
});

test("ohne INDEXIERUNG: X-Robots-Tag in _headers und noindex auf jeder Seite", async () => {
  const headers = await readFile(join(DIST, "_headers"), "utf8");
  assert.match(headers, /^\/\*\n {2}X-Robots-Tag: noindex, nofollow$/m);
  for (const url of [...pages.map((p) => p.url), ...NOT_FOUND]) {
    const html = await readFile(fileFor(url), "utf8");
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/, url);
  }
});
