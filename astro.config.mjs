// @ts-check
import { defineConfig, envField } from "astro/config";
import cloudflareHeaders from "./integrations/cloudflare-headers.mjs";

export default defineConfig({
  // Basis für Canonical, hreflang, Sitemap und Open Graph (PRD 13.1)
  site: "https://apex-car-rent.pages.dev",
  // "preserve": Seiten werden zu fahrzeuge.html (Cloudflare: /fahrzeuge),
  // index-Dateien zu en/index.html (Cloudflare: /en/). Siehe PRD Abschnitt 6.
  build: {
    format: "preserve",
  },
  integrations: [cloudflareHeaders()],
  env: {
    schema: {
      // PRD T-08 / E-01: Indexierung ist standardmäßig aus.
      INDEXIERUNG: envField.boolean({
        context: "server",
        access: "public",
        default: false,
      }),
    },
  },
});
