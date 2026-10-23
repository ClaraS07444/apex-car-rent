// Prüft dist/_headers gegen PRD 15.2 und rechnet die CSP-Hashes unabhängig nach.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const raw = await readFile(join(DIST, "_headers"), "utf8");

const headers = Object.fromEntries(
  raw
    .split("\n")
    .filter((line) => line.startsWith("  "))
    .map((line) => {
      const index = line.indexOf(":");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

const csp = Object.fromEntries(
  headers["Content-Security-Policy"]
    .split(";")
    .map((part) => part.trim().split(/\s+/))
    .map(([name, ...values]) => [name, values]),
);

test("alle Header gelten für jede Antwort (Block /*)", () => {
  assert.match(raw, /^\/\*$/m);
});

test("Sicherheits-Header nach PRD 15.2", () => {
  assert.match(headers["Strict-Transport-Security"], /max-age=\d{7,}/);
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  for (const feature of ["camera=()", "microphone=()", "geolocation=()"]) {
    assert.ok(headers["Permissions-Policy"].includes(feature), feature);
  }
  assert.equal(headers["X-Frame-Options"], "DENY");
});

test("CSP: nur eigene Quellen, Google Maps nur als iframe, kein Einbetten", () => {
  assert.deepEqual(csp["default-src"], ["'self'"]);
  assert.deepEqual(csp["img-src"], ["'self'"]);
  assert.deepEqual(csp["font-src"], ["'self'"]);
  assert.deepEqual(csp["connect-src"], ["'self'"]);
  assert.deepEqual(csp["frame-src"], ["https://www.google.com"]);
  assert.deepEqual(csp["frame-ancestors"], ["'none'"]);
  assert.deepEqual(csp["object-src"], ["'none'"]);
  assert.deepEqual(csp["base-uri"], ["'self'"]);
  const all = Object.values(csp).flat().join(" ");
  assert.doesNotMatch(all, /unsafe-inline|unsafe-eval|unsafe-hashes|\*/);
});

test("CSP-Hashes passen genau zu den eingebetteten Blöcken aller Seiten", async () => {
  const sha = (text) =>
    `'sha256-${createHash("sha256").update(text, "utf8").digest("base64")}'`;
  const scripts = new Set();
  const styles = new Set();
  for (const entry of await readdir(DIST, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const html = await readFile(join(entry.parentPath, entry.name), "utf8");
    for (const [, attrs, body] of html.matchAll(
      /<script([^>]*)>([\s\S]*?)<\/script>/g,
    )) {
      if (/\bsrc=/.test(attrs) || /application\/(ld\+)?json/.test(attrs))
        continue;
      scripts.add(sha(body));
    }
    for (const [, body] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      styles.add(sha(body));
    }
    assert.doesNotMatch(
      html,
      /\sstyle="|\son[a-z]+="/,
      `${entry.name}: Inline-Attribut`,
    );
  }
  assert.deepEqual(csp["script-src"].slice(1).sort(), [...scripts].sort());
  assert.deepEqual(csp["style-src"].slice(1).sort(), [...styles].sort());
  // Bewusst eingebettet sind nur das js-Klassen-Skript und die Layer-Reihenfolge
  assert.equal(scripts.size, 1);
  assert.equal(styles.size, 1);
});
