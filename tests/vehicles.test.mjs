// Prüft die Fahrzeugbilder, bevor Astro sie verarbeitet (PRD 9.6, T-07).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const vehiclesDir = new URL("../src/content/vehicles/", import.meta.url);

/** Breite und Höhe aus dem PNG-Header (IHDR) lesen. */
async function pngSize(url) {
  const header = await readFile(url);
  assert.equal(header.toString("ascii", 1, 4), "PNG", `${url} ist kein PNG`);
  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

const vehicles = await Promise.all(
  (await readdir(vehiclesDir))
    .filter((name) => name.endsWith(".json"))
    .map(async (name) => {
      const data = JSON.parse(
        await readFile(new URL(name, vehiclesDir), "utf8"),
      );
      return { name, image: new URL(data.image, new URL(name, vehiclesDir)) };
    }),
);

test("jedes Fahrzeug verweist auf eine vorhandene PNG-Datei", async () => {
  assert.equal(vehicles.length, 3);
  for (const { name, image } of vehicles) {
    await assert.doesNotReject(pngSize(image), `${name}: ${image.pathname}`);
  }
});

test("alle Zuschnitte haben dasselbe Seitenverhältnis (Abweichung < 0,5 %)", async () => {
  const ratios = await Promise.all(
    vehicles.map(async ({ image }) => {
      const { width, height } = await pngSize(image);
      return width / height;
    }),
  );
  const min = Math.min(...ratios);
  const max = Math.max(...ratios);
  assert.ok(
    (max - min) / min < 0.005,
    `Seitenverhältnisse: ${ratios.join(", ")}`,
  );
});
