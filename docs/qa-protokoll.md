# Prüfprotokoll Apex Rent

Abnahme nach PRD Abschnitt 17 (Phase P7, Inkrement 13).

- **Datum:** 23.10.2026
- **Stand:** Branch `main`, Commit „QA und Abnahme“ (Inkrement 13)
- **Prüfumgebung:** macOS 26.5.1, Node 24.22.1, lokaler Build (`dist/`) über `scripts/serve-dist.mjs` (bildet Cloudflare Pages nach: URL-Regeln, Sprach-404, `_headers`)

## Status

| Status          | Bedeutung                                                               |
| --------------- | ----------------------------------------------------------------------- |
| Bestanden       | automatisch geprüft, Test im Repository, bei jedem Lauf wiederholbar    |
| Teilweise       | automatisch geprüfter Teil bestanden, ein Teil braucht Sichtprüfung     |
| Offen           | braucht eine Entscheidung oder Sichtprüfung durch die Auftraggeberin    |
| BLOCKED         | in dieser Umgebung nicht ausführbar (echte Geräte, externe Dienste)     |

## Test-Matrix

| Projekt          | Engine (Playwright 1.64.1) | Breite × Höhe    |
| ---------------- | -------------------------- | ---------------- |
| desktop-chromium | Chromium 156               | 1440 × 900       |
| desktop-firefox  | Firefox 157                | 1440 × 900       |
| desktop-webkit   | WebKit 27.2 (Safari macOS) | 1440 × 900       |
| mobile-chromium  | Chromium 156, Pixel 7      | 412 × 915, Touch |
| mobile-webkit    | WebKit 27.2, iPhone 13     | 390 × 844, Touch |

Weitere Breiten (320, 390, 768, 1024, 1440, 1920 px) setzen einzelne Tests selbst. Prüfungen, die nicht vom Browser abhängen, zum Beispiel auf berechnete Stile über alle 18 Seiten, laufen nur in desktop-chromium; die Spalte „Browser“ nennt das.

Gesamtlauf am 23.10.2026:

| Befehl             | Ergebnis                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| `npm run check`    | 0 Fehler, 0 Warnungen, Formatierung sauber                               |
| `npm test`         | 77 von 77 bestanden (Build, Routen, SEO, Sicherheit, Formularlogik)      |
| `npx playwright test` | 489 bestanden, 0 fehlgeschlagen, 171 übersprungen (absichtlich nur in einem Projekt) |

## Ergebnisse je Kriterium

### Hero

| Kriterium | Browser / Breite | Ergebnis | Nachweis |
| --- | --- | --- | --- |
| 1440 × 830: Position und Größe wie Desktop-Entwurf, ≤ 16 px | – | Offen | Per Pixelmessung am Entwurf ausgerichtet (Inkrement 6). Visuelle Abnahme durch die Auftraggeberin steht aus (PRD 20). |
| 390 × 844: Wortmarke, Fahrzeug, Claim links, Button rechts, ohne Scrollen | Chromium, 390 × 844, DE/EN/NL | Bestanden | `acceptance.spec.ts` „Hero Smartphone“ |
| Desktop: Heck abgeschnitten, kein horizontaler Scroll | alle 5 | Bestanden | `home.spec.ts` „kein horizontaler Scroll“ |
| Reihenfolge von links, Fahrzeug fährt herein, Ende ≤ 1,9 s | alle 5 | Bestanden | `home.spec.ts` „Sequenz endet nach höchstens 1,9 s“ |
| CLS = 0, Button sofort klickbar | alle 5 | Bestanden | `home.spec.ts`; Lighthouse CLS 0,000 auf allen Seiten |
| Reduzierte Bewegung: sofort an der Endposition | alle 5 | Bestanden | `home.spec.ts` „Reduzierte Bewegung“ |

### Farbsystem und Layout

| Kriterium | Browser / Breite | Ergebnis | Nachweis |
| --- | --- | --- | --- |
| Sections weiß/schwarz im Wechsel ab Weiß, Footer schwarz mit roter Linie | Chromium, alle 18 Seiten | Bestanden | `acceptance.spec.ts` „Sections wechseln …“ |
| Buttons, Karten, Hervorhebungen in Kästen der Gegenfarbe | – | Offen | Sichtprüfung, gemeinsam mit der Designabnahme |
| Rot nie als Fließtext auf Schwarz | Chromium, 390 und 1440, alle 18 Seiten | Bestanden | `acceptance.spec.ts`; dabei gefunden und behoben: rote Pflichtfeld-Sternchen auf Schwarz |
| Keine runden Ecken, Schatten, Verläufe | Chromium, 390 und 1440, alle 18 Seiten | Bestanden | `acceptance.spec.ts`; ausgenommen sind native Radiobuttons/Checkboxen. Der Silberverlauf in der A-Bildmarke ist Teil des Logos, kein CSS. |
| Manrope 300, keine Schrift unter 15 px | Chromium, 390 und 1440, alle 18 Seiten | Bestanden | `acceptance.spec.ts` |
| Kein Emoji in Code, Texten, Meta-Daten | Build | Bestanden | `scripts/check-emoji.mjs` bricht den Build ab; Unit-Tests |
| Kein horizontales Scrollen 320 bis 1920 px; keine überlappenden oder abgeschnittenen Texte | alle 5, 6 Breiten, alle 18 Seiten | Teilweise | Overflow: `layout.spec.ts` bestanden. Überlappungen und abgeschnittene Texte: Sichtprüfung offen. |

### Animation

| Kriterium | Browser / Breite | Ergebnis | Nachweis |
| --- | --- | --- | --- |
| Elemente fliegen bei 85 % Viewport-Höhe ein, genau einmal | alle 5 | Bestanden | `home.spec.ts` „Scroll-Animationen“ |
| Ohne JavaScript alle Inhalte sichtbar | alle 5 | Bestanden | `home.spec.ts`, `vehicles.spec.ts`, `navigation.spec.ts` „Ohne JavaScript“ |
| Keine Layout- oder Paint-Spitzen beim Scrollen | – | Teilweise | Scroll-Animationen nutzen nur `transform` und `opacity` (Code-Prüfung); Lighthouse TBT 0 ms, CLS 0. Eine DevTools-Performance-Aufzeichnung wurde nicht gemacht. |

### Navigation und Sprache

| Kriterium | Browser / Breite | Ergebnis | Nachweis |
| --- | --- | --- | --- |
| 15 URLs mit Status 200, unbekannte URLs 404 in passender Sprache | alle 5 | Bestanden | Unit-Test „genau die 15 Seiten“, `layout.spec.ts`, `legal.spec.ts` |
| Sprachwechsel führt auf die entsprechende Seite, behält Parameter | alle 5 | Bestanden | `navigation.spec.ts` „Sprachumschalter“ |
| Mobile-Menü: Tippen, Escape, Linkauswahl; Hintergrund scrollt nicht | Mobil | Bestanden | `navigation.spec.ts` „Mobile-Menü“ |
| Aktive Seite rot markiert | Desktop, DE/EN/NL | Bestanden | `navigation.spec.ts` „aktive Seite ist markiert“ (prüft die rote Linie) |

### Fahrzeuge

| Kriterium | Browser / Breite | Ergebnis | Nachweis |
| --- | --- | --- | --- |
| 510 PS, 2.000 € / 3.500 € / 10.000 € | alle 5 | Bestanden | `vehicles.spec.ts` |
| `/fahrzeuge?auto=rot` öffnet das Overlay, Zurück schließt | alle 5 | Bestanden | `vehicles.spec.ts` „Deeplink“ |
| Preisänderung erscheint an allen 5 Stellen (T-02) | Build | Bestanden | Preisänderung testweise durchgeführt, README beschreibt den Ablauf; Unit-Test „Meta-Beschreibung nutzt die Preise“ |
| Mietbedingungen: 25 Jahre, 4 Jahre Führerschein, 10.000 € Kaution, Zahlung, Vollkasko | alle 5 | Bestanden | `vehicles.spec.ts` „Mietbedingungen“ |
| Bild-Ladefehler zeigt Kasten mit Fahrzeugnamen (PRD 10.5) | alle 5 | Bestanden | `vehicles.spec.ts` „Bild-Ladefehler“ (neu in Inkrement 13) |

### Formular

| Kriterium | Browser / Breite | Ergebnis | Nachweis |
| --- | --- | --- | --- |
| `/kontakt?auto=schwarz&paket=woche` belegt vor | alle 5 | Bestanden | `contact.spec.ts` „Vorbelegung“ |
| Leeres Absenden: Fehlerliste, Fokus, Fehler je Feld | alle 5 | Bestanden | `contact.spec.ts` „leeres Absenden“ |
| Wochenende mit Start an einem Nicht-Freitag abgelehnt | alle 5 + Unit | Bestanden | `contact.spec.ts`, `rules`-Unit-Test |
| Lieferung blendet Adresse ein, Vorschau +500 € | alle 5 + Unit | Bestanden | `contact.spec.ts`, `pricing`-Unit-Test |
| Woche + 500 km + Lieferung = 13.000 € | alle 5 + Unit | Bestanden | `contact.spec.ts`, `pricing`-Unit-Test |
| Doppelklick erzeugt nur eine Anfrage | alle 5 | Bestanden | `contact.spec.ts` „Doppelklick“ |
| Erfolgs- und Fehlerzustand nach 10.4, Eingaben bleiben erhalten | alle 5 | Bestanden | `contact.spec.ts` „Zustände“ |

### SEO und Datenschutz

| Kriterium | Browser / Breite | Ergebnis | Nachweis |
| --- | --- | --- | --- |
| Eine H1, Titel ≤ 60, Beschreibung 140–160, je Sprache eindeutig | Build | Bestanden | Unit-Tests SEO; H1 in den Seiten-Specs |
| hreflang, Canonical, sitemap.xml fehlerfrei | Build | Bestanden | Unit-Tests „hreflang“, „Canonical“, „sitemap.xml“ |
| JSON-LD besteht Googles Rich-Results-Test | – | BLOCKED | Externer Google-Dienst, hier nicht ausgeführt. Struktur ist per Unit-Test geprüft (AutoRental, Car, FAQPage). Prüfung: Quelltext einer Seite unter search.google.com/test/rich-results einfügen. |
| Bei INDEXIERUNG aus trägt jede Antwort noindex | alle 5 + Build | Bestanden | `seo.spec.ts`, Unit-Test „ohne INDEXIERUNG“ |
| Keine Anfrage an Analytics- oder Tracking-Dienste | Chromium, alle 18 Seiten | Bestanden | `acceptance.spec.ts`: außer der eigenen Domain keine einzige Anfrage, auch nach Scrollen bis zum Seitenende |
| Kein Cookie, kein lokaler Speicher nach dem Laden | Chromium, alle 18 Seiten | Bestanden | `acceptance.spec.ts`, `contact.spec.ts` |

### Qualität

| Kriterium | Browser / Breite | Ergebnis | Nachweis |
| --- | --- | --- | --- |
| Lighthouse Mobile: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100 | Lighthouse 12.6.1, mobil | Bestanden | siehe unten |
| axe: 0 kritische, 0 schwere Fehler | alle 18 Seiten, Overlay, Formular-Fehlerzustand | Bestanden | `layout.spec.ts`, `vehicles.spec.ts`, `contact.spec.ts` (WCAG 2.2 AA) |
| Vom Hero bis zur Erfolgsmeldung nur mit Tastatur | Chromium, 1440 | Bestanden | `acceptance.spec.ts` „Tastatur“; dabei gefunden und behoben: Datum ließ sich nicht eintippen |
| Google Maps erst nach Klick auf „Karte laden“ | alle 5 | Bestanden | `contact.spec.ts` „Karte“ |
| Konzept-Hinweis im Footer jeder Seite und in der Erfolgsmeldung | Chromium, alle 18 Seiten | Bestanden | `acceptance.spec.ts`, `contact.spec.ts` |

## Lighthouse

Lighthouse 12.6.1, Standard-Mobilprofil (simuliertes Mittelklasse-Smartphone, gedrosselte Verbindung), Median aus 3 Läufen je Seite.

| Seite | Performance | Accessibility | Best Practices | SEO* | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 99 | 100 | 100 | 100 | 1,8 s | 0 |
| `/en/` | 99 | 100 | 100 | 100 | 1,8 s | 0 |
| `/nl/` | 99 | 100 | 100 | 100 | 1,8 s | 0 |
| `/fahrzeuge` | 99 | 100 | 100 | 100 | 1,8 s | 0 |
| `/en/cars` | 99 | 100 | 100 | 100 | 1,8 s | 0 |
| `/nl/autos` | 99 | 100 | 100 | 100 | 1,8 s | 0 |
| `/kontakt` | 99 | 100 | 100 | 100 | 2,0 s | 0 |
| `/en/contact` | 99 | 100 | 100 | 100 | 1,9 s | 0 |
| `/nl/contact` | 99 | 100 | 100 | 100 | 2,0 s | 0 |
| `/impressum` | 100 | 100 | 100 | 100 | 1,4 s | 0 |
| `/en/legal-notice` | 100 | 100 | 100 | 100 | 1,4 s | 0 |
| `/nl/colofon` | 100 | 100 | 100 | 100 | 1,4 s | 0 |
| `/datenschutz` | 100 | 100 | 100 | 100 | 1,5 s | 0 |
| `/en/privacy` | 100 | 100 | 100 | 100 | 1,5 s | 0 |
| `/nl/privacy` | 100 | 100 | 100 | 100 | 1,5 s | 0 |
| `/404`, `/en/404`, `/nl/404` | 100 | 100 | 100 | – | 1,4 s | 0 |

\* SEO wie im PRD vorgegeben mit einem Build mit `INDEXIERUNG=true` gemessen (1 Lauf je Seite, der Wert ist nicht zeitabhängig). Im Standard-Build liegt SEO bei 69, weil `noindex` absichtlich die Indexierung verhindert (E-01). Die 404-Seiten sind nie indexierbar und deshalb ausgenommen.

Lokale Messung ohne CDN; auf Cloudflare sind die Werte nicht schlechter zu erwarten, aber nicht gemessen.

## In Inkrement 13 gefunden und behoben

| Befund | Kriterium | Korrektur |
| --- | --- | --- |
| Pflichtfeld-Sternchen rot (15 px) auf Schwarz, Kontrast 3,6:1 | Rot nie als Fließtext auf Schwarz (PRD 9.1, A-01) | Sternchen übernimmt die Textfarbe der Fläche (`src/components/form/fields.css`) |
| Startdatum ließ sich in Chromium nicht eintippen: Jedes Teil-Ereignis setzte `min`/`max` neu, Chromium verwarf dabei die halbe Eingabe | Tastatur-Durchlauf (A-02) | Grenzen werden einmal beim Start gesetzt (`src/scripts/form/index.ts`) |
| Kein Favicon, jede Seite erzeugte einen 404 auf `/favicon.ico` (Console-Fehler, Best Practices 96) | Lighthouse Best Practices, vollständige Metadaten | A-Bildmarke als SVG-Favicon (`src/layouts/BaseLayout.astro`) |
| Bild-Ladefehler zeigte nichts; WebKit ließ die Fläche auf Texthöhe schrumpfen | PRD 10.5, kein Layoutsprung | Kasten mit Fahrzeugnamen in Bildgröße (`src/components/VehicleImage.astro`, `src/scripts/image-fallback.ts`) |

## Offen und BLOCKED

| Punkt | Status | Was fehlt |
| --- | --- | --- |
| Designabnahme Hero Desktop und Mobile | Offen | Visuelle Abnahme durch die Auftraggeberin (PRD 20) |
| Kästen der Gegenfarbe, keine Überlappungen | Offen | Sichtprüfung, sinnvollerweise zusammen mit der Designabnahme |
| Performance-Aufzeichnung beim Scrollen | Offen | Chrome DevTools > Performance, einmal Startseite scrollen |
| Echte Geräte: Safari iOS, Chrome Android, Safari macOS | BLOCKED | Geprüft wurden die Engines in Playwright (WebKit, Chromium mit Geräteprofil), keine physischen Geräte |
| Screenreader (VoiceOver, TalkBack, NVDA) | BLOCKED | Nur auf echten Geräten aussagekräftig; axe und Tastatur-Durchlauf sind bestanden |
| Google Rich-Results-Test | BLOCKED | Externer Dienst, Anleitung oben |
| Apple-Touch-Icon (PNG) | Offen | Es gibt nur die SVG-Bildmarke; Safari und Startbildschirm-Symbole nutzen kein SVG. Braucht eine PNG-Fassung der Bildmarke. |

Nicht Teil von PRD 17, aber vor einem echten Start nötig (PRD 20): Freigabe der EN/NL-Texte, Umgebungswert für den Formularmodus. Die Cloudflare-Angaben in der Datenschutzerklärung sind seit 23.10.2026 mit Mustertext gefüllt; `npm run check:launch` meldet keine offenen Platzhalter mehr.
