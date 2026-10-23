// Schreibt dist/_headers für Cloudflare Pages (PRD 13.1, 15.2):
// - X-Robots-Tag: noindex, solange INDEXIERUNG nicht "true" ist (E-01)
// - Content-Security-Policy: nur eigene Quellen plus Google Maps im iframe.
//   Die wenigen bewusst eingebetteten Blöcke (Skript und Style im head) sind
//   über SHA-256-Hashes erlaubt, die hier aus den fertigen Seiten berechnet
//   werden; ändert sich ein Block, passt sich die Policy beim Build an.
// - weitere Sicherheits-Header (HSTS, nosniff, Referrer, Permissions).
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const hash = (content) =>
  `'sha256-${createHash("sha256").update(content, "utf8").digest("base64")}'`;

/** Hashes aller ausführbaren Inline-Skripte und Inline-Styles in dist. */
async function inlineHashes(root) {
  const scripts = new Set();
  const styles = new Set();
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    const html = await readFile(join(entry.parentPath, entry.name), "utf8");
    for (const [, attrs, body] of html.matchAll(
      /<script([^>]*)>([\s\S]*?)<\/script>/g,
    )) {
      // Externe Skripte deckt 'self' ab; JSON-Datenblöcke werden nicht ausgeführt
      if (
        /\bsrc=/.test(attrs) ||
        /type="application\/(ld\+)?json"/.test(attrs)
      ) {
        continue;
      }
      scripts.add(hash(body));
    }
    for (const [, body] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
      styles.add(hash(body));
    }
  }
  return { scripts: [...scripts].sort(), styles: [...styles].sort() };
}

/** @returns {import("astro").AstroIntegration} */
export default function cloudflareHeaders() {
  const indexing = process.env.INDEXIERUNG === "true";
  return {
    name: "apex-cloudflare-headers",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const { scripts, styles } = await inlineHashes(fileURLToPath(dir));
        const csp = [
          "default-src 'self'",
          ["script-src 'self'", ...scripts].join(" "),
          ["style-src 'self'", ...styles].join(" "),
          "img-src 'self'",
          "font-src 'self'",
          "connect-src 'self'",
          // Zwei-Klick-Karte (PRD 10.5): eingebettete Google-Maps-Seite
          "frame-src https://www.google.com",
          "form-action 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "frame-ancestors 'none'",
          // Kein upgrade-insecure-requests: alle Verweise sind relativ und HSTS
          // erzwingt HTTPS; die Anweisung bräche nur lokale Tests über http.
        ].join("; ");

        const headers = [
          `Content-Security-Policy: ${csp}`,
          "Strict-Transport-Security: max-age=31536000",
          "X-Content-Type-Options: nosniff",
          "X-Frame-Options: DENY",
          "Referrer-Policy: strict-origin-when-cross-origin",
          "Permissions-Policy: camera=(), microphone=(), geolocation=()",
          ...(indexing ? [] : ["X-Robots-Tag: noindex, nofollow"]),
        ];
        const content = ["/*", ...headers.map((line) => `  ${line}`)].join(
          "\n",
        );
        await writeFile(new URL("_headers", dir), `${content}\n`);
      },
    },
  };
}
