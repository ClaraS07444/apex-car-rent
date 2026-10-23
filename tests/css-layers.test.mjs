// Prüft, dass die Kaskaden-Schichten auf jeder Seite in der festgelegten
// Reihenfolge entstehen. Entscheidend ist die erste Erwähnung eines Layers
// über alle Stylesheets der Seite in Ladereihenfolge.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const EXPECTED = [
  "tokens",
  "base",
  "layout",
  "components",
  "pages",
  "utilities",
  "motion",
];

function layerOrder(css) {
  const order = [];
  for (const [, names] of css.matchAll(/@layer\s+([a-z\s,-]+?)\s*[{;]/g)) {
    for (const name of names.split(",").map((n) => n.trim())) {
      if (!order.includes(name)) order.push(name);
    }
  }
  return order;
}

const pages = (await readdir(DIST, { recursive: true })).filter((f) =>
  f.endsWith(".html"),
);

for (const page of pages) {
  test(`${page}: Layer-Reihenfolge`, async () => {
    const html = await readFile(join(DIST, page), "utf8");
    const hrefs = [
      ...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g),
    ].map((m) => m[1]);
    assert.ok(hrefs.length > 0, "kein Stylesheet eingebunden");
    const inline = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(
      (m) => m[1],
    );
    const css = (
      await Promise.all(hrefs.map((href) => readFile(join(DIST, href), "utf8")))
    )
      .concat(inline)
      .join("\n");
    assert.deepEqual(layerOrder(css), EXPECTED);
  });
}
