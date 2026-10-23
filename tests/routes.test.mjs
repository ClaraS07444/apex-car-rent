// Prüft die Build-Ausgabe gegen die URL-Tabelle aus PRD Abschnitt 6.
// Die Erwartung ist hier bewusst unabhängig von src/i18n/routes.ts notiert.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;

const expected = {
  de: ["/", "/fahrzeuge", "/kontakt", "/impressum", "/datenschutz", "/404"],
  en: [
    "/en/",
    "/en/cars",
    "/en/contact",
    "/en/legal-notice",
    "/en/privacy",
    "/en/404",
  ],
  nl: [
    "/nl/",
    "/nl/autos",
    "/nl/contact",
    "/nl/colofon",
    "/nl/privacy",
    "/nl/404",
  ],
};

// Abbildung wie bei Cloudflare (auto-trailing-slash):
// "/en/" -> en/index.html, "/en/cars" -> en/cars.html
function fileFor(url) {
  return url.endsWith("/")
    ? `${url.slice(1)}index.html`
    : `${url.slice(1)}.html`;
}

async function listHtml(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) =>
      relative(DIST, join(entry.parentPath, entry.name)).split(sep).join("/"),
    )
    .sort();
}

test("Build erzeugt genau die 15 Seiten und 3 Sprach-404 aus dem PRD", async () => {
  const actual = await listHtml(DIST);
  const wanted = Object.values(expected).flat().map(fileFor).sort();
  assert.deepEqual(actual, wanted);
});

for (const [locale, urls] of Object.entries(expected)) {
  for (const url of urls) {
    test(`${url} hat lang="${locale}" und ist ohne INDEXIERUNG auf noindex`, async () => {
      const html = await readFile(join(DIST, fileFor(url)), "utf8");
      assert.match(html, new RegExp(`<html lang="${locale}"`));
      assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
      assert.equal(html.match(/<main\b/g)?.length, 1);
    });
  }
}
