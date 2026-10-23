// Liefert dist/ für Tests so aus wie Cloudflare (html_handling "auto-trailing-slash",
// not_found_handling "404-page"):
//   /fahrzeuge -> fahrzeuge.html     /en/ -> en/index.html
//   /fahrzeuge.html -> 307 /fahrzeuge  /en -> 307 /en/
//   unbekannt -> nächstgelegene 404.html mit Status 404
// Aufruf: node scripts/serve-dist.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../dist/", import.meta.url));
const PORT = Number(process.argv[2] ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

/** Pfad innerhalb von dist auflösen; Ausbruch per ".." wird abgewiesen. */
function resolveInRoot(urlPath) {
  const full = normalize(join(ROOT, urlPath));
  return full.startsWith(ROOT) || full + sep === ROOT ? full : null;
}

async function notFoundPage(urlPath) {
  const parts = urlPath.split("/").filter(Boolean);
  for (let i = parts.length; i >= 0; i--) {
    const candidate = resolveInRoot(`${parts.slice(0, i).join("/")}/404.html`);
    if (candidate && (await isFile(candidate))) return candidate;
  }
  return null;
}

/**
 * Header aus dist/_headers wie bei Cloudflare Pages; unterstützt wird der
 * Block für "/*", den der Build schreibt (astro.config.mjs).
 */
async function globalHeaders() {
  try {
    const lines = (await readFile(join(ROOT, "_headers"), "utf8")).split("\n");
    const headers = {};
    let inGlobal = false;
    for (const line of lines) {
      if (!line.trim()) continue;
      if (!/^\s/.test(line)) {
        inGlobal = line.trim() === "/*";
        continue;
      }
      const [name, ...value] = line.trim().split(":");
      if (inGlobal && name) headers[name.trim()] = value.join(":").trim();
    }
    return headers;
  } catch {
    return {};
  }
}

const HEADERS = await globalHeaders();

async function send(res, status, file, headers = {}) {
  const body = await readFile(file);
  const type = TYPES[extname(file)] ?? "application/octet-stream";
  res.writeHead(status, { ...HEADERS, "content-type": type, ...headers });
  res.end(body);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", "http://localhost");
    const path = decodeURIComponent(url.pathname);
    const redirect = (to) => {
      res.writeHead(307, { ...HEADERS, location: to + url.search });
      res.end();
    };

    if (path.endsWith("/index.html")) return redirect(path.slice(0, -10));
    if (path.endsWith(".html")) return redirect(path.slice(0, -5));

    const direct = resolveInRoot(path);
    if (direct && !path.endsWith("/") && (await isFile(direct))) {
      return send(res, 200, direct);
    }
    if (path.endsWith("/")) {
      const index = resolveInRoot(`${path}index.html`);
      if (index && (await isFile(index))) return send(res, 200, index);
    } else {
      const html = resolveInRoot(`${path}.html`);
      if (html && (await isFile(html))) return send(res, 200, html);
      const index = resolveInRoot(`${path}/index.html`);
      if (index && (await isFile(index))) return redirect(`${path}/`);
    }

    const page404 = await notFoundPage(path);
    if (page404) return send(res, 404, page404);
    res.writeHead(404).end("Not found");
  } catch (error) {
    console.error(error);
    res.writeHead(500).end("Server error");
  }
}).listen(PORT, () => {
  console.log(`dist/ auf http://localhost:${PORT}`);
});
