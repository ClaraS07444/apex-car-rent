import type { APIRoute } from "astro";

/**
 * robots.txt verweist auf die Sitemap (PRD 13.1). Crawlen bleibt erlaubt,
 * auch bei ausgeschalteter Indexierung: Nur so sehen Suchmaschinen das
 * noindex in Meta-Tag und X-Robots-Tag.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("astro.config.mjs: site fehlt");
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap.xml", site).href}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
