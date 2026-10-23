// Hält die erlaubten Icon-Namen in Icon.astro und die Dateien in src/icons gleich.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const root = new URL("../src/", import.meta.url);

test("IconName entspricht genau den SVG-Dateien in src/icons", async () => {
  const files = (await readdir(new URL("icons/", root)))
    .filter((name) => name.endsWith(".svg"))
    .map((name) => name.replace(/\.svg$/, ""))
    .sort();

  const source = await readFile(new URL("components/Icon.astro", root), "utf8");
  const union = source.match(/export type IconName =([^;]+);/)?.[1] ?? "";
  const names = [...union.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]).sort();

  assert.deepEqual(names, files);
});

test("alle Icons nutzen viewBox 0 0 256 256 und currentColor", async () => {
  for (const name of await readdir(new URL("icons/", root))) {
    if (!name.endsWith(".svg")) continue;
    const svg = await readFile(new URL(`icons/${name}`, root), "utf8");
    assert.match(svg, /viewBox="0 0 256 256"/, name);
    assert.match(svg, /fill="currentColor"/, name);
  }
});
