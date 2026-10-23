// @ts-check
import { defineConfig, envField } from "astro/config";

export default defineConfig({
  // "preserve": Seiten werden zu fahrzeuge.html (Cloudflare: /fahrzeuge),
  // index-Dateien zu en/index.html (Cloudflare: /en/). Siehe PRD Abschnitt 6.
  build: {
    format: "preserve",
  },
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
