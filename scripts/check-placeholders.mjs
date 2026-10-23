// Startfreigabe (PRD 20, DoD): Bricht ab, solange in der Ausgabe noch
// markierte Platzhalter stehen (<mark class="placeholder">), z. B. in den
// Rechtstexten. Läuft bewusst nicht im normalen Build.
// Aufruf: node scripts/check-placeholders.mjs dist
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const dir = process.argv[2];
if (!dir) {
  console.error(
    "Verwendung: node scripts/check-placeholders.mjs <verzeichnis>",
  );
  process.exit(2);
}

const PLACEHOLDER = /<mark class="placeholder"[^>]*>([\s\S]*?)<\/mark>/g;
const found = [];

for (const entry of await readdir(dir, {
  recursive: true,
  withFileTypes: true,
})) {
  if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
  const path = join(entry.parentPath, entry.name);
  const html = await readFile(path, "utf8");
  for (const match of html.matchAll(PLACEHOLDER)) {
    found.push(`${path}: ${match[1].trim()}`);
  }
}

if (found.length > 0) {
  console.error(`${found.length} offene Platzhalter:\n${found.join("\n")}`);
  process.exit(1);
}
console.log("Keine offenen Platzhalter.");
