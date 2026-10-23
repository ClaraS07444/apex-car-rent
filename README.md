# Apex Rent

Konzept-Website einer fiktiven Porsche-GT3-RS-Vermietung in Aachen, in Deutsch, Englisch und Niederländisch. Die Seite ist eine Arbeitsprobe: Apex Rent gibt es nicht, das Anfrageformular sendet nichts.

- Live (Entwicklungs-Deployment): https://apex-car-rent.pages.dev
- Anforderungen: [docs/PRD.md](docs/PRD.md)
- Technik: [Astro](https://astro.build) mit statischer Ausgabe, natives CSS, TypeScript, keine weiteren Laufzeit-Bibliotheken

## Schnellstart

Voraussetzung ist Node.js 24 (siehe `.nvmrc`).

```sh
npm ci            # Abhängigkeiten genau nach package-lock.json installieren
npm run dev       # Entwicklungsserver auf http://localhost:4321
npm run build     # fertige Seite nach dist/ bauen (inkl. Prüfungen)
```

| Befehl                 | Zweck                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run dev`          | Entwicklungsserver mit automatischem Neuladen                                                                    |
| `npm run build`        | Baut `dist/`; prüft dabei alle Inhalte und bricht bei Fehlern ab                                                 |
| `npm run check`        | Typprüfung und Formatierung                                                                                      |
| `npm run format`       | Formatierung automatisch korrigieren                                                                             |
| `npm test`             | Build und Prüfungen der Ausgabe (Routen, SEO, Sicherheit, Formularlogik)                                         |
| `npm run test:e2e`     | Browsertests in Chrome, Firefox, Safari, Android und iPhone; einmalig vorher `npx playwright install`            |
| `npm run check:launch` | Startfreigabe: listet offene Platzhalter (z. B. in den Rechtstexten) und schlägt fehl, solange welche übrig sind |

## Inhalte ändern

Alle Inhalte liegen in `src/content/`. Jeder übersetzbare Text steht dort dreimal: `"de"`, `"en"`, `"nl"`. Fehlt eine Sprache, ist ein Pflichtfeld leer oder steht irgendwo ein Emoji, **bricht der Build mit einer Meldung ab**. Das ist Absicht: Lieber kein Deployment als eine halbe Seite.

Nach jeder Änderung: `npm run build` ausführen, Meldungen lesen, mit `npm run dev` ansehen.

### Preis ändern

Datei: `src/content/pricing.json`

| Feld                              | Bedeutung                            |
| --------------------------------- | ------------------------------------ |
| `packages.tag.price`              | Tagespreis in Euro                   |
| `packages.wochenende.price`       | Wochenendpreis                       |
| `packages.woche.price`            | Wochenpreis                          |
| `packages.langzeit.pricePerMonth` | Langzeitmiete pro Monat              |
| `packages.*.includedKm`           | Inklusiv-Kilometer je Paket          |
| `extraKmPrice`                    | Preis je Zusatzkilometer             |
| `extraKmOptions`                  | wählbare Zusatzkilometer im Formular |
| `delivery`, `pickup`              | Lieferung, Abholung                  |
| `deposit`                         | Kaution                              |
| `voucherMinimum`                  | Mindestwert Gutschein                |

Beträge als ganze Zahl ohne Punkt und ohne Euro-Zeichen eintragen, also `2100` statt `2.100 €`. Die Seite formatiert sie je Sprache selbst.

Ein geänderter Preis erscheint nach dem Build automatisch überall: Fahrzeugkarten, Preistabelle, Detail-Overlay, Preisvorschau im Formular, strukturierte Daten für Suchmaschinen und Meta-Beschreibung.

Hinweis: Die Meta-Beschreibungen müssen 140 bis 160 Zeichen lang sein. Wird ein Preis deutlich länger (z. B. fünfstellig statt vierstellig), kann der Build deshalb abbrechen. Dann die Beschreibung in `src/content/seo.json` leicht kürzen oder verlängern.

### Text ändern

| Was                                                                      | Datei                                                                    |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Startseite (Hero-Claim, Ablauf, Vorteile, Services, Über uns, Abschluss) | `src/content/home.json`                                                  |
| Fahrzeugseite (Einleitung, Überschriften, Mietbedingungen)               | `src/content/vehicles-page.json`                                         |
| Häufige Fragen                                                           | `src/content/faq.json`                                                   |
| Kontaktseite, Formular, Fehlermeldungen                                  | `src/content/contact-page.json`                                          |
| Navigation, Buttons, Footer, 404-Seite, wiederkehrende Texte             | `src/content/ui.json`                                                    |
| Beispielbewertungen (Startseite)                                         | `src/content/reviews.json` (`"active": false` blendet eine aus)          |
| Seitentitel und Beschreibungen für Suchmaschinen                         | `src/content/seo.json` (Titel max. 60, Beschreibung 140 bis 160 Zeichen) |
| Impressum und Datenschutz                                                | `src/content/legal/<sprache>/impressum.md` bzw. `datenschutz.md`         |
| Adresse, Telefon, Öffnungszeiten, Kartenpunkt, Mindestalter              | `src/content/business.json`                                              |

Platzhalter wie `{price}`, `{power}` oder `{age}` in den Texten bitte stehen lassen; dort setzt die Seite den aktuellen Wert aus den Daten ein.

In den Rechtstexten markiert `<mark class="placeholder">[…]</mark>` eine noch offene Angabe. Vor einer echten Veröffentlichung muss `npm run check:launch` ohne Fehler durchlaufen.

### Fahrzeug hinzufügen

1. Originalbild als freigestelltes PNG nach `assets/images/porsche-<farbe>.png` legen (Seitenansicht, Fahrtrichtung links, gleicher Maßstab wie die vorhandenen Bilder).
2. In `scripts/crop-vehicles.mjs` die Zeile `const SOURCES = { ... }` um die Farbe ergänzen, z. B. `blue: "blue"`.
3. `node scripts/crop-vehicles.mjs` ausführen. Das Skript schneidet alle Fahrzeuge auf denselben Rahmen zu und legt `src/assets/vehicles/gt3rs-<farbe>.png` an.
4. In `src/content/vehicles/` eine Kopie von `rot.json` unter dem neuen Namen anlegen, z. B. `blau.json`. **Der Dateiname ist zugleich der Wert in Links wie `/kontakt?auto=blau`.**
5. In der neuen Datei `order`, `name`, `colorName`, `alt` (je Sprache) und den Bildpfad `image` anpassen.
6. `npm run build` und `npm run dev`: Das Fahrzeug erscheint in Flotte, Fahrzeugliste, Overlay, Formular und strukturierten Daten.

Ein Fahrzeug vorübergehend ausblenden: `"active": false`. Sind alle Fahrzeuge ausgeblendet, zeigt die Seite automatisch „Derzeit sind alle Fahrzeuge vergeben“.

### Bilder für Social Media

Die Vorschaubilder für geteilte Links liegen in `public/og/` (1200 × 630). `node scripts/make-og-images.mjs` erzeugt sie aus Wortmarke und Fahrzeugbildern neu. Gestaltete Bilder können sie unter denselben Dateinamen ersetzen.

## Veröffentlichen

Jeder Push auf `main` löst bei Cloudflare Pages automatisch einen neuen Build aus. Nach etwa ein bis zwei Minuten ist die neue Fassung unter der Live-Adresse erreichbar.

```sh
npm run check && npm test   # vorher lokal prüfen
git add -A && git commit -m "Preis Tagesmiete angepasst"
git push
```

Einstellungen des Cloudflare-Pages-Projekts:

| Einstellung            | Wert              |
| ---------------------- | ----------------- |
| Production Branch      | `main`            |
| Framework Preset       | Astro             |
| Build Command          | `npm run build`   |
| Build Output Directory | `dist`            |
| Node.js-Version        | aus `.nvmrc` (24) |

Umgebungswerte (Cloudflare: Settings > Environment variables):

| Name          | Wirkung                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `INDEXIERUNG` | Nur bei `true` dürfen Suchmaschinen die Seite aufnehmen. Ohne den Wert tragen alle Seiten und Antworten `noindex` (Standard, PRD E-01). |

Sicherheits-Header (Content-Security-Policy, HSTS u. a.) und `noindex` schreibt der Build automatisch nach `dist/_headers` (`integrations/cloudflare-headers.mjs`). Wer eine neue externe Quelle einbindet, etwa ein Skript oder einen eingebetteten Dienst, muss sie dort erlauben, sonst blockiert der Browser sie.

## Für die Qualitätsprüfung

- `?demo=fehler` an der Kontaktseite (`/kontakt?demo=fehler`) simuliert den Zustand „Senden fehlgeschlagen“.
- Das Formular läuft im Demo-Modus: Eingaben verlassen den Browser nicht (PRD E-02). Die Schnittstelle für einen echten Versand liegt in `src/scripts/form/submit.ts`.
- Die Karte lädt erst nach Klick auf „Karte laden“; vorher geht keine Anfrage an Google.

## Aufbau

```
src/
  content/       Inhalte und Daten (siehe oben), mit Schema in content.config.ts
  pages/         Routen: alle Seiten aus der Tabelle in src/i18n/routes.ts
  views/         eine Datei je Seitentyp (Startseite, Fahrzeuge, Kontakt, ...)
  components/    wiederverwendbare Bausteine
  layouts/       Grundgerüst jeder Seite (Kopf, Navigation, Footer)
  scripts/       Browser-Skripte: Navigation, Animation, Overlay, Formular, Karte
  styles/        Design-Tokens und globale Stile
  lib/           Hilfsfunktionen für Inhalte, Formatierung, SEO
scripts/         Werkzeuge: Bildzuschnitt, OG-Bilder, Prüfungen, Testserver
tests/           Prüfungen der Build-Ausgabe und Browsertests (tests/e2e)
```

Alle URLs stehen an genau einer Stelle: `src/i18n/routes.ts`.
