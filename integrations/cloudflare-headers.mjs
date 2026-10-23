// Schreibt dist/_headers für Cloudflare Pages. Bei ausgeschalteter Indexierung
// (PRD E-01, Umgebungswert INDEXIERUNG nicht "true") trägt jede Antwort
// X-Robots-Tag: noindex (PRD 13.1). Sicherheits-Header folgen in Inkrement 12.
import { writeFile } from "node:fs/promises";

/** @returns {import("astro").AstroIntegration} */
export default function cloudflareHeaders() {
  const indexing = process.env.INDEXIERUNG === "true";
  return {
    name: "apex-cloudflare-headers",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        const rules = ["/*"];
        if (!indexing) rules.push("  X-Robots-Tag: noindex, nofollow");
        await writeFile(new URL("_headers", dir), `${rules.join("\n")}\n`);
      },
    },
  };
}
