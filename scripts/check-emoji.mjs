// Bricht ab, wenn in Quell- oder Ausgabedateien ein Emoji steht (PRD 9.5, 17).
// Aufruf: node scripts/check-emoji.mjs <verzeichnis> [weitere Verzeichnisse]
import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TEXT_EXTENSIONS = new Set([
  ".astro",
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".txt",
  ".xml",
]);

// Emoji-Darstellung, als Emoji erzwungene Zeichen (U+FE0F), Tastenkappen
// und Flaggen. Typografische Zeichen wie ©, ™, €, – oder → bleiben erlaubt.
const EMOJI =
  /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F|\u20E3|\p{Regional_Indicator}/gu;

/** Liefert alle Emoji-Fundstellen eines Textes mit Zeilennummer. */
export function findEmoji(text) {
  const hits = [];
  text.split("\n").forEach((line, index) => {
    for (const match of line.matchAll(EMOJI)) {
      hits.push({ line: index + 1, char: match[0] });
    }
  });
  return hits;
}

async function scan(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  const problems = [];
  for (const entry of entries) {
    if (!entry.isFile() || !TEXT_EXTENSIONS.has(extname(entry.name))) continue;
    const path = join(entry.parentPath, entry.name);
    for (const hit of findEmoji(await readFile(path, "utf8"))) {
      problems.push(`${path}:${hit.line}  ${hit.char}`);
    }
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dirs = process.argv.slice(2);
  if (dirs.length === 0) {
    console.error("Verwendung: node scripts/check-emoji.mjs <verzeichnis> ...");
    process.exit(2);
  }
  const problems = (await Promise.all(dirs.map(scan))).flat();
  if (problems.length > 0) {
    console.error(
      `Emoji gefunden (PRD 9.5 verbietet Emojis):\n${problems.join("\n")}`,
    );
    process.exit(1);
  }
  console.log(`Emoji-Prüfung bestanden: ${dirs.join(", ")}`);
}
