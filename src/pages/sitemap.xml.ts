import type { APIRoute } from "astro";
import { defaultLocale, locales } from "../i18n/locales";
import { routes, type PageKey } from "../i18n/routes";

/**
 * sitemap.xml mit allen 15 URLs und hreflang-Alternativen (PRD 13.1).
 * Quelle ist die Routentabelle; die 404-Seiten gehören nicht hinein.
 */
const PAGES: PageKey[] = [
  "home",
  "vehicles",
  "contact",
  "legalNotice",
  "privacy",
];

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("astro.config.mjs: site fehlt");
  const url = (path: string) => new URL(path, site).href;

  const entries = PAGES.flatMap((page) =>
    locales.map((locale) => {
      const alternates = [
        ...locales.map(
          (code) =>
            `    <xhtml:link rel="alternate" hreflang="${code}" href="${url(routes[page][code])}"/>`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(routes[page][defaultLocale])}"/>`,
      ];
      return `  <url>\n    <loc>${url(routes[page][locale])}</loc>\n${alternates.join("\n")}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
