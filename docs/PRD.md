PRD – Apex Rent Konzept-Website
Oct 22, 2026 · @Clara
Dieses PRD beschreibt die dreisprachige Konzept-Website einer fiktiven Porsche-GT-Vermietung in Aachen. Sie dient als Portfolio-Referenz des Webdesigners. Status: Entwurf zur Freigabe, Version 1.1 (23.10.2026: Entscheidung E-13 Analytics ergänzt).
Legende der Kennzeichnungen
Kennzeichnung	Bedeutung
[Fakt]	Aus dem Briefing oder den Rückfragen des Auftraggebers
[Fiktiv]	Erfundene Geschäftsdaten, ausdrücklich erlaubt, weil es ein Konzept ist
[Annahme]	Lücke, die ich mit einem plausiblen Wert gefüllt habe; Freigabe nötig
[Empfehlung]	Fachlicher Vorschlag; gilt, solange nichts anderes entschieden wird
[Offen]	Entscheidung des Auftraggebers erforderlich, siehe Abschnitt 18 und Schlussliste
Eingangsmaterial: Desktop-Hero-Entwurf, Smartphone-Hero-Entwurf, A-Bildmarke schwarz und weiß-silber, Wortmarke „APEX rent“ schwarz, Fahrzeugbilder Porsche 911 GT3 RS in Silber, Rot und Schwarz (Seitenprofil, Fahrtrichtung links). Strukturvorbild: hprent.de.
1. Executive Summary
Apex Rent wird eine dreiseitige, dreisprachige (DE, EN, NL) Website für die fiktive Vermietung von drei Porsche 911 GT3 RS in Aachen. Die primäre Conversion ist eine Mietanfrage über ein Formular, die manuell bestätigt wird. Es gibt keine Online-Buchung und keine Online-Zahlung.
•	Zweck [Fakt]: Portfolio-Konzept des Webdesigners für ein nicht existierendes Unternehmen. Die Seite läuft dauerhaft als Entwicklungs-Deployment ohne eigene Domain.
•	Angebot [Fakt]: 3 Fahrzeuge (Silber, Rot, Schwarz), je 510 PS. Tag 2.000 €, Wochenende 3.500 €, Woche 10.000 €, Kaution 10.000 €. Lieferung und Abholung je 500 €. Gutscheine ab 1.000 €, Langzeitmiete ab 20.000 € pro Monat.
•	Design [Fakt]: Schwarz-Weiß im Wechsel pro Section, eckige Kästen in der Gegenfarbe, Rot #C8102E nur für Details, Manrope Light 300, keine Emojis.
•	Signatur-Moment [Fakt]: Im Hero fliegen Logo, Claim und Button von links ein. Das Auto fährt langsamer von rechts in die Seite hinein.
•	Qualitätsanspruch [Empfehlung]: Die Seite muss selbst als Arbeitsprobe bestehen: Lighthouse 95+ in allen Kategorien, WCAG 2.2 AA, keine Layoutsprünge.
Die Seite ist nicht indexiert, das Formular ist eine Demo ohne Übertragung, und die Fahrzeugbilder bleiben unverändert (Entscheidungen am Dokumentende).
2. Ziele und Erfolgsindikatoren
Das eigentliche Ziel ist eine überzeugende Arbeitsprobe. Das simulierte Ziel ist eine Vermietungsseite, die Anfragen erzeugt. Messbar gemacht wird die Arbeitsprobe; die simulierte Conversion wird nicht erfasst (E-13).
Ziel	Indikator	Zielwert	Messung
Arbeitsprobe: technische Qualität	Lighthouse Performance, Mobile	≥ 90 (Desktop ≥ 95)	Lighthouse, 3 Läufe, Median
Arbeitsprobe: technische Qualität	Lighthouse Accessibility, Best Practices, SEO	je 100 (Best Practices ≥ 95)	Lighthouse
Arbeitsprobe: Ladeerlebnis	LCP / CLS / INP	≤ 2,5 s / ≤ 0,05 / ≤ 200 ms	Lighthouse Mobile-Profil, Chrome DevTools
Arbeitsprobe: Designtreue	Hero entspricht den Entwürfen	Freigabe durch Auftraggeber bei 1440 px und 390 px	Visueller Vergleich mit Entwurf
Arbeitsprobe: Barrierefreiheit	Kritische und schwere axe-Fehler	0	axe DevTools auf allen Seiten, alle Sprachen
Für ein Konzept ohne echten Traffic werden keine Conversion-Werte erfasst, die Seite nutzt kein Analytics (E-13). Abnahmerelevant sind ausschließlich die technischen und gestalterischen Indikatoren.
3. Zielgruppen und Kernbedürfnisse
Die Seite spricht zwei Ebenen an: reale Betrachter des Portfolios und die fiktiven Mieter, für die das Produkt gestaltet ist.
Zielgruppe	Wer	Kernbedürfnis	Was die Seite liefern muss
A. Portfolio-Betrachter (real)	Potenzielle Kunden des Webdesigners, Agenturen	Qualität in Sekunden erkennen	Starker Hero, saubere Animation, fehlerfreies Mobile, Hinweis auf den Urheber
B. Erlebnis-Mieter [Annahme]	25–55 Jahre, Sportwagen-Fans aus Aachen, NRW, Raum Maastricht/Heerlen, Ostbelgien	Einmal einen GT3 RS fahren, ohne Risiko und Bürokratie	Preis, Kaution, Bedingungen sofort sichtbar; einfacher Anfrageweg
C. Anlass-Mieter [Annahme]	Hochzeitspaare, Geburtstage, Schenkende	Fahrzeug für einen festen Termin oder als Geschenk	Hinweis auf Hochzeit/Event und Gutscheine, Lieferung an den Ort
D. Business und Langzeit [Annahme]	Unternehmer, Events, Fotoshootings, Expats	Planbare längere Nutzung, persönlicher Ansprechpartner	Langzeitpreis, Kontakt per Telefon und Formular
Gemeinsame Bedürfnisse aller Mieter: volle Preistransparenz vor der Anfrage, klare Mietvoraussetzungen (Alter, Führerschein, Kaution), Vertrauen in einen seriösen Anbieter und eine Anfrage in unter 2 Minuten.
Sprachen [Fakt]: Deutsch, Englisch, Niederländisch. Das Niederländische zielt auf die Grenzregion; dort heißt Aachen „Aken“ [Empfehlung: in NL-Texten durchgehend „Aken“].
4. Positionierung und Botschaft
Apex Rent ist die kompromisslose Spezialvermietung für ein einziges Modell: Ein Fahrzeug, drei Farben, volle Leistung, transparente Preise, persönlicher Service in Aachen.
•	Abgrenzung zum Vorbild: HP Rent bietet eine breite Flotte vom Kleinwagen bis zum SUV. Apex Rent setzt auf Fokus und Exklusivität. Fahrzeugkategorien und Filter entfallen daher.
•	Claim [Fakt]: „Dein Herzschlag. Unsere PS.“
o	EN [Empfehlung]: „Your heartbeat. Our horsepower.“
o	NL [Empfehlung]: „Jouw hartslag. Onze pk's.“
•	Kernbotschaften:
a.	Leistung: 510 PS, Rennsport-Gene, Straßenzulassung.
b.	Klarheit: Alle Preise, die Kaution und die Bedingungen stehen öffentlich auf der Seite.
c.	Persönlich: Übergabe vor Ort oder Lieferung, Anfrage wird individuell bestätigt.
d.	Anlass: Hochzeit, Event, Geschenkgutschein oder Langzeitmiete.
•	Tonalität [Annahme]: Du-Form in DE, da der Claim duzt. EN „you“, NL informelles „je/jij“. Kurz, selbstbewusst, ohne Superlative-Inflation, keine Ausrufezeichen-Ketten, keine Emojis.
•	Bildsprache: Freigestellte Fahrzeuge im Seitenprofil auf reinem Weiß oder Schwarz. Keine Stockfotos von Menschen.
5. Scope
Muss-Anforderungen bilden den Launch-Umfang. Soll kommt in den Launch, wenn der Zeitplan es erlaubt. Kann ist ein späterer Ausbau.
ID	Anforderung	Priorität
S-01	3 Seiten: Startseite, Fahrzeuge, Kontakt	Muss
S-02	Rechtsseiten Impressum und Datenschutz (Inhalte des Webdesigners als Betreiber)	Muss
S-03	3 Sprachen DE, EN, NL mit eigenen URLs und Sprachumschalter	Muss
S-04	Hero Desktop und Smartphone exakt nach Entwurf, inkl. Einflug-Animation	Muss
S-05	Scroll-Animationen für alle Elemente, mit reduzierter Bewegung als Alternative	Muss
S-06	Fahrzeugkarten mit Preisen, Detail-Overlay je Fahrzeug	Muss
S-07	Anfrageformular mit Validierung und allen Zuständen	Muss
S-08	Mietbedingungen, Preise und Zusatzleistungen öffentlich	Muss
S-09	Technisches SEO, Local-SEO-Markup, hreflang	Muss
S-10	Kein Analytics und kein Consent-Banner; ohne Zustimmung wird nichts auf dem Endgerät gespeichert (E-13)	Muss
S-11	Konzept-Hinweis im Footer und im Formular	Muss
S-12	Bewertungs-Section	Muss, Umsetzung siehe Entscheidung E-04
S-13	Karte mit Zwei-Klick-Aktivierung	Muss
S-14	Unverbindliche Preisvorschau im Formular	Soll
S-15	FAQ-Accordion auf der Fahrzeugseite	Soll
S-16	Vorbelegung des Formulars aus Fahrzeugkarte (Fahrzeug, Paket)	Soll
S-17	Drehende Räder beim Einfahren (benötigt freigestellte Rad-Assets)	Kann
S-18	Weitere Fahrzeugansichten (Front, Heck, Innenraum) im Overlay	Kann
S-19	Bearbeitungsoberfläche (CMS-Admin) für Inhalte	Kann
Out of Scope: Online-Buchung mit Verfügbarkeitskalender, Online-Zahlung, Kundenkonto oder Login, Gutschein-Shop mit Kauf, Blog, Newsletter, Live-Chat, WhatsApp-Integration, Google Business Profile (für eine fiktive Firma nicht zulässig), eigene Domain, Mehrwährung, AGB-Seite.
6. Sitemap und Navigation
Die Website hat 3 Hauptseiten und 2 Rechtsseiten je Sprache, insgesamt 15 URLs. Deutsch liegt ohne Präfix auf der Wurzel [Empfehlung].
Seite	DE	EN	NL	In Hauptnavigation
Startseite	/	/en/	/nl/	ja
Fahrzeuge	/fahrzeuge	/en/cars	/nl/autos	ja
Kontakt	/kontakt	/en/contact	/nl/contact	ja
Impressum	/impressum	/en/legal-notice	/nl/colofon	nein, Footer
Datenschutz	/datenschutz	/en/privacy	/nl/privacy	nein, Footer
404	jede unbekannte URL	sprachabhängig	sprachabhängig	nein
Fahrzeug-Details [Empfehlung]: Kein eigener URL-Pfad, sondern Overlay auf der Fahrzeugseite mit Deeplink per Parameter, z. B. /fahrzeuge?auto=silber. So bleibt es bei 3 Seiten, und drei fast gleiche Detailseiten konkurrieren nicht um dieselben Suchbegriffe.
Hauptnavigation Desktop (≥ 1024 px):
•	Schwarze Leiste, volle Breite, Höhe 96 px; nach 80 px Scrollen auf 72 px verkleinert.
•	Links: A-Bildmarke weiß-silber, Höhe 56 px, verlinkt auf die Startseite.
•	Mitte-links: STARTSEITE, FAHRZEUGE, KONTAKT in Versalien, Manrope 300, 15 px, Laufweite 0,12 em, weiß. Anordnung wie im Entwurf.
•	Rechts: Sprachumschalter „DE / EN / NL“, aktive Sprache weiß mit 2 px roter Unterstreichung, inaktive 60 % Deckkraft.
•	Aktive Seite: 2 px rote Linie unter dem Menüpunkt. Hover: Linie wächst in 200 ms von links auf volle Breite.
•	Die Leiste bleibt beim Scrollen fixiert (sticky).
Hauptnavigation Mobile (< 1024 px):
•	Schwarze Leiste, Höhe 64 px, Bildmarke links (40 px), Menü-Symbol mit 3 Linien rechts. Tippfläche ≥ 48 × 48 px.
•	Tippen öffnet ein Vollbild-Overlay in Schwarz. Die Menüpunkte fliegen gestaffelt von links ein (60 ms Versatz), darunter der Sprachumschalter und die Telefonnummer.
•	Das Symbol wird zum Schließen-Kreuz. Schließen per Kreuz, Escape oder Auswahl eines Punkts. Seite dahinter scrollt nicht.
•	Fokus bleibt im geöffneten Overlay gefangen und kehrt beim Schließen zum Menü-Button zurück.
Sprachwechsel: Führt immer auf die entsprechende Seite der Zielsprache, inklusive Parameter (z. B. geöffnetes Fahrzeug). Keine automatische Weiterleitung nach Browsersprache, keine Speicherung in Cookies.
Footer (alle Seiten): Bildmarke, Kurzbeschreibung, Adresse, Telefon, E-Mail, Öffnungszeiten, Instagram-Link, Links Impressum und Datenschutz, Sprachumschalter, Konzept-Hinweis. Kein Urheber-Credit (E-11).
7. Nutzerwege und Conversions
Die primäre Conversion ist eine erfolgreich abgeschickte Mietanfrage. Jeder Weg auf der Seite führt in höchstens zwei Klicks zum Formular.
Kernwege
1.	Schnellentschlossen: Startseite → Hero „Jetzt mieten“ → Kontakt, Formular ohne Vorbelegung.
2.	Vergleichend: Startseite → Flotten-Teaser → Fahrzeuge → Detail-Overlay → „Dieses Fahrzeug anfragen“ → Kontakt mit vorbelegtem Fahrzeug.
3.	Direkteinstieg über Suche: Google „Porsche GT3 RS mieten Aachen“ → Fahrzeuge → Preise und Bedingungen → Anfrage.
4.	Anlass: Startseite → Section Anlässe → „Hochzeit anfragen“ oder „Gutschein anfragen“ → Kontakt mit vorbelegtem Anlass.
5.	Telefonisch: Footer oder Kontaktseite → Telefonnummer ablesen. Die Nummer ist fiktiv und nicht verlinkt (E-03).
 
Nutzerwege zur Mietanfrage · 2 Einstiege, 1 Prüfung
Von der Startseite führt „Jetzt mieten“ direkt ins Formular; über Fahrzeuge und Detail-Overlay sind es zwei Klicks. Fehler führen zurück ins Formular, ohne dass Eingaben verloren gehen.
Conversions: Die primäre Conversion bleibt die erfolgreich abgeschickte Mietanfrage. Sie wird nicht gemessen; es gibt keine Tracking-Events (E-13).
CTA-Vorbelegung: Buttons übergeben Werte per URL-Parameter an die Kontaktseite, z. B. /kontakt?auto=rot&paket=wochenende&anlass=hochzeit. Ungültige Werte werden ignoriert, das Feld bleibt leer.
8. Seite-für-Seite-Spezifikation
Jede Seite folgt dem Farbwechsel: Hero weiß, danach schwarz, weiß, schwarz im Wechsel. Der Footer ist immer schwarz und durch eine 2 px rote Linie abgesetzt. Animationsdetails stehen in Abschnitt 9 (Motion). Breakpoints: Mobile < 600 px, Tablet 600–1023 px, Laptop 1024–1439 px, Desktop ≥ 1440 px.
8.1 Startseite
S1 Hero (weiß)
•	Zweck: Markenauftritt und sofortiger Weg zur Anfrage.
•	Inhalt: Wortmarke „APEX rent“ als Bild (H1 als visuell verborgener Text: „Apex Rent – Porsche GT3 RS mieten in Aachen“), Claim „Dein Herzschlag. Unsere PS.“ in 2 Zeilen, Button „JETZT MIETEN“, Fahrzeug Silber.
•	Layout Desktop (≥ 1024 px, Referenz 1440 × 830):
o	Höhe: 100 svh minus Navigation, min. 680 px, max. 920 px.
o	Wortmarke oben links, linker Rand 40 px, Breite 54 % des Viewports, Abstand nach oben 94 px. Wortmarke, Claim und Button stehen auf derselben linken Kante (gemessen am Desktop-Entwurf; Entscheidung 23.10.2026: Entwurf vor PRD-Zahlen).
o	Claim links unter der Wortmarke, Schriftgröße clamp(32 px, 3 vw, 52 px), Zeilenhöhe 1,15.
o	Button unter dem Claim, Breite 28 % des Viewports (min. 320 px), Höhe 56 px, schwarzer Kasten, weiße Versalien.
o	Fahrzeug unten rechts, linke Kante bei 40,5 % des Viewports, Breite 79 vw, Bodenlinie 76 px über der Unterkante des Hero (gemessen am Desktop-Entwurf, 23.10.2026). Das Heck mit Flügel ragt über den rechten Rand hinaus und wird abgeschnitten, wie im Entwurf. Keine horizontale Scrollleiste.
o	Wortmarke und Fahrzeug überlappen sich nicht.
•	Layout Mobile (< 600 px, Referenz 390 × 844):
o	Reihenfolge von oben: Wortmarke zentriert (volle Breite minus 2 × 20 px), Fahrzeug komplett sichtbar inkl. Flügel (75 % Breite, zentriert), Claim linksbündig (26–30 px), Button rechtsbündig (Breite 50 %, Höhe 48 px).
o	Der gesamte Hero passt bei 390 × 844 ohne Scrollen in den sichtbaren Bereich.
o	Der Smartphone-Entwurf zeigt nur die obere Hälfte des Bildschirms (ca. 390 × 440 px). Der Hero bleibt kompakt wie im Entwurf und wird nicht auf die volle Viewport-Höhe gestreckt; die folgende Section ist darunter angeschnitten sichtbar.
•	Tablet [Annahme]: Mobile-Layout mit Wortmarke max. 640 px und Fahrzeug 70 % Breite.
•	CTA: „JETZT MIETEN“ → /kontakt.
•	Assets: Wortmarke schwarz (SVG), Fahrzeug Silber freigestellt (AVIF/WebP, transparent, ≥ 2400 px breit).
•	Interaktion: Einflug-Sequenz beim Laden (Abschnitt 9). Button-Hover: Farbumkehr mit 1 px schwarzem Rahmen.
S2 Ablauf (schwarz)
•	Zweck: Unsicherheit über den Mietprozess nehmen.
•	Inhalt: Überschrift „In drei Schritten auf die Straße“. Drei Karten mit roter Nummer, Icon, Titel und einem Satz:
a.	„Fahrzeug wählen“: Silber, Rot oder Schwarz, dazu das passende Paket.
b.	„Anfrage senden“: Wunschtermin angeben, wir bestätigen persönlich innerhalb von 24 Stunden [Fiktiv].
c.	„Schlüssel übernehmen“: Abholung in Aachen oder Lieferung zu dir, kurze Einweisung, los geht's.
•	Layout: Weiße Kästen, schwarzer Text. Ab 768 px 3 Spalten mit 32 px Abstand, darunter 1 Spalte.
•	CTA: „Fahrzeuge ansehen“ → /fahrzeuge (weißer Kasten).
•	Interaktion: Karten fliegen gestaffelt ein.
S3 Vorteile (weiß)
•	Zweck: Gründe für Apex Rent auf einen Blick.
•	Inhalt: Überschrift „Warum Apex“. Vier Kästen: „510 PS“, „Klare Preise ohne Kleingedrucktes“, „Vollkasko inklusive“, „Persönliche Übergabe“. Je Icon, Titel, ein Satz.
•	Layout: Schwarze Kästen mit weißem Text, rote 24 px Linie über jedem Titel. 4 Spalten ab 1024 px, 2 × 2 ab 600 px, sonst 1 Spalte.
•	CTA: keiner.
S4 Flotten-Teaser (schwarz)
•	Zweck: Die drei Fahrzeuge mit Preis zeigen und zum Detail oder zur Anfrage führen.
•	Inhalt: Überschrift „Die Flotte“, Unterzeile „Ein Modell. Drei Charaktere.“ Pro Fahrzeug eine Karte: Bild, Name (z. B. „GT3 RS Silber“), Kerndaten „510 PS“, Preis „ab 2.000 € / Tag“.
•	Layout: Weiße Kästen. 3 Spalten ab 1024 px, sonst gestapelt. Bild füllt die Kartenbreite, Seitenverhältnis 3:1.
•	CTA: „Details“ → /fahrzeuge?auto=… öffnet das Overlay. „Anfragen“ → /kontakt?auto=….
•	Interaktion: Hover (nur Zeigegeräte): Fahrzeug fährt 12 px nach links, rote 2 px Linie erscheint am unteren Kartenrand.
S5 Anlässe und Services (weiß)
•	Zweck: Zusatzumsatz und Anlass-Mieter abholen.
•	Inhalt: Vier schwarze Kästen:
o	„Hochzeit und Events“: Preis individuell, CTA „Anlass anfragen“ → anlass=event.
o	„Lieferung und Abholung“: je 500 €, ohne CTA.
o	„Gutscheine“: ab 1.000 €, CTA „Gutschein anfragen“ → anlass=gutschein.
o	„Langzeitmiete“: ab 20.000 € pro Monat, CTA „Langzeit anfragen“ → paket=langzeit.
•	Layout: 4 Spalten ab 1024 px, 2 × 2 ab 600 px, sonst 1 Spalte.
S6 Über uns (schwarz)
•	Zweck: Vertrauen und Persönlichkeit.
•	Inhalt: Überschrift „Über Apex Rent“. Text [Fiktiv]: Apex Rent ist in Aachen zu Hause und hat sich bewusst auf ein Fahrzeug spezialisiert, den 911 GT3 RS. Jede Übergabe erfolgt persönlich, jede Anfrage wird vom Team selbst beantwortet, ohne versteckte Kosten. Daneben 4 Fakten-Kästen: „3 Fahrzeuge“, „510 PS“, „Standort Aachen“, „DE · EN · NL“.
•	Layout: Desktop 2 Spalten (Text 7/12, Fakten 5/12 als 2 × 2-Raster), Mobile gestapelt.
S7 Bewertungen (weiß)
•	Zweck: Sozialer Beweis.
•	Inhalt: 3 Bewertungskarten mit Sternen (rot), Text max. 280 Zeichen, Vorname und Initial, Monat und Jahr. Herkunft und Kennzeichnung siehe Entscheidung E-04.
•	Layout: Schwarze Kästen, 3 Spalten ab 1024 px, sonst gestapelt.
S8 Abschluss-CTA (schwarz)
•	Inhalt: „Bereit für 510 PS?“ und ein Satz.
•	CTA: „Jetzt mieten“ → /kontakt (weißer Kasten), „Fahrzeuge ansehen“ → /fahrzeuge (weißer Rahmen, transparent).
•	Layout: Zentriert, Buttons nebeneinander ab 600 px, sonst untereinander in voller Breite.
8.2 Fahrzeuge
Grundregel: Fahrzeugbilder stehen immer auf weißer Fläche. Auf schwarzen Sections liegen sie in weißen Kästen, damit das schwarze Fahrzeug sichtbar bleibt.
F1 Seitenkopf (weiß)
•	Zweck: SEO-Einstieg und Preisanker.
•	Inhalt: H1 „Porsche 911 GT3 RS mieten in Aachen“, Intro mit 2 Sätzen, Preisanker „ab 2.000 € pro Tag“, schwarzes Fahrzeug.
•	Layout: Desktop: Text links (5/12), Fahrzeug rechts, fährt wie im Hero von rechts ein. Mobile: Text, darunter Fahrzeug in 90 % Breite.
F2 Fahrzeugliste (schwarz)
•	Zweck: Vergleich und Einstieg in Detail oder Anfrage.
•	Inhalt pro Fahrzeug: Bild, Name, Kennwerte (510 PS [Fakt]; 7-Gang-PDK, Hinterradantrieb, 2 Sitze [Annahme]), Preise Tag/Wochenende/Woche, Inklusiv-Kilometer.
•	Layout: Ein weißer Kasten pro Fahrzeug, volle Inhaltsbreite. Desktop: Bild 7/12, Daten 5/12; die Bildseite wechselt von Fahrzeug zu Fahrzeug. Mobile: Bild oben, Daten darunter.
•	CTA: „Details“ öffnet das Overlay. „Dieses Fahrzeug anfragen“ → /kontakt?auto=….
•	Detail-Overlay:
o	Modaler Dialog auf weißem Grund. Desktop max. 960 px breit, zentriert, schwarzer Hintergrund mit 80 % Deckkraft. Mobile Vollbild.
o	Inhalt: großes Bild, Name, Datentabelle, Preistabelle mit Inklusiv-km, Kaution, Zusatzleistungen, Kurzfassung der Mietbedingungen mit Link zu F4, CTA.
o	URL wird auf ?auto=silber|rot|schwarz gesetzt. Browser-Zurück schließt das Overlay. Ein Aufruf der URL öffnet es direkt.
o	Schließen per Kreuz, Escape oder Klick auf den Hintergrund. Fokus bleibt im Dialog und kehrt danach zum auslösenden Button zurück.
o	[Soll] Pfeile „vorheriges / nächstes Fahrzeug“.
F3 Preise und Pakete (weiß)
•	Zweck: Vollständige Preistransparenz an einer Stelle.
•	Inhalt:
Paket	Zeitraum	Preis	Inklusiv-km
Tag	24 Stunden	2.000 € [Fakt]	200 km [Annahme]
Wochenende	Fr 12:00 bis Mo 10:00 [Annahme]	3.500 € [Fakt]	500 km [Annahme]
Woche	7 Tage	10.000 € [Fakt]	1.200 km [Annahme]
Langzeit	ab 1 Monat	ab 20.000 € pro Monat [Fakt]	3.000 km pro Monat [Annahme]
•	Zusatzleistungen: Lieferung 500 €, Abholung 500 € [Fakt], Mehrkilometer 5 € pro km [Annahme], Gutscheine ab 1.000 € [Fakt]. Kaution 10.000 € [Fakt]. Alle Preise inkl. MwSt. [Annahme].
•	Layout: Tabelle mit schwarzer Kopfzeile und 1 px schwarzen Trennlinien. Unter 600 px wird jede Zeile zu einem eigenen Kasten, ohne horizontales Scrollen.
F4 Mietbedingungen (schwarz)
•	Inhalt: Sechs weiße Kästen mit Icon:
a.	Mindestalter 25 Jahre [Fakt].
b.	Führerschein Klasse B seit mindestens 4 Jahren [Fakt].
c.	Kaution 10.000 € bei Übergabe [Fakt].
d.	Zahlung bar oder per Karte vor Ort [Fakt].
e.	Vollkasko inklusive; bei einem Schaden wird die Kaution einbehalten [Fakt]. Formulierung: „bis zur Höhe der Kaution“ [Annahme].
f.	Mitbringen: Ausweis oder Reisepass und Führerschein [Annahme].
•	Layout: 3 × 2 ab 1024 px, 2 Spalten ab 600 px, sonst 1 Spalte.
F5 FAQ (weiß) [Soll]
•	Inhalt [Fiktiv]: 6 Fragen, u. a. Ablauf der Bestätigung, Lieferung, Schadensfall, Zusatzfahrer, Auslandsfahrten, Gutscheine.
•	Interaktion: Accordion, mehrere Einträge gleichzeitig offen erlaubt. Plus-Icon dreht sich beim Öffnen um 45°. Höhenanimation 250 ms.
F6 Abschluss-CTA (schwarz): wie Startseite S8.
8.3 Kontakt
K1 Seitenkopf (weiß)
•	Inhalt: H1 „Anfrage und Kontakt“, Intro: Wunschtermin nennen, Bestätigung innerhalb von 24 Stunden [Fiktiv]. Rotes Fahrzeug fährt von rechts ein.
•	Layout: wie F1.
K2 Anfrageformular (schwarz)
•	Zweck: Primäre Conversion.
•	Layout Desktop: Formular 8/12, rechts 4/12 eine mitlaufende Spalte mit Preisvorschau [Soll] und Kontakt-Kästen. Mobile: Formular, Preisvorschau, Kontakt-Kästen untereinander.
•	Felder, Regeln und Zustände: Abschnitt 10.
•	Kontakt-Kästen (weiß) [Fiktiv]: Telefon +49 241 0000 000, E-Mail anfrage@apex-rent.example, Instagram @apexrent.aachen, Öffnungszeiten Mo–Fr 9–19 Uhr, Sa 10–16 Uhr, So nach Vereinbarung.
K3 Standort (weiß)
•	Inhalt [Fiktiv]: Apex Rent, Apexstraße 1, 52068 Aachen. Öffnungszeiten. Karte mit Zwei-Klick-Aktivierung (Abschnitt 10). Link „Route planen“ öffnet Google Maps in neuem Tab.
•	Layout: Desktop: Adresse 4/12, Karte 8/12 im Format 16:9. Mobile: Adresse, darunter Karte im Format 4:3.
9. Designsystem
Das System besteht aus drei Farben, einer Schrift in einem Schnitt, rechten Winkeln und einer zentralen Bewegungslogik. Alle Werte werden als Design-Tokens (CSS Custom Properties) einmal definiert und überall referenziert.
9.1 Farben
Token	Wert	Verwendung	Kontrast
color-black	#000000 [Fakt]	Section-Hintergrund, Kästen auf Weiß, Text auf Weiß	21:1 zu Weiß
color-white	#FFFFFF [Fakt]	Section-Hintergrund, Kästen auf Schwarz, Text auf Schwarz	21:1 zu Schwarz
color-red	#C8102E [Fakt]	Akzentlinien, aktive Zustände, Fokusring, Schritt-Nummern, Sterne, Fehlerrahmen	5,9:1 zu Weiß, 3,6:1 zu Schwarz
color-muted-on-white	#595959 [Empfehlung]	Sekundärtext auf Weiß	7,0:1
color-muted-on-black	#A6A6A6 [Empfehlung]	Sekundärtext auf Schwarz	8,6:1
Regeln:
•	Rot erscheint nie als Fließtext auf Schwarz, weil 3,6:1 die Grenze von 4,5:1 für normalen Text verfehlt. Erlaubt auf Schwarz: Linien, Icons, Fokusringe, Text ab 24 px.
•	Kästen haben immer die Gegenfarbe ihrer Section: Auf Schwarz weiße Kästen mit schwarzem Text, auf Weiß schwarze Kästen mit weißem Text.
•	Fließtext steht ohne Kasten direkt auf der Section-Farbe.
•	Keine Verläufe, keine Schatten, keine Transparenz-Effekte außer dem Overlay-Hintergrund.
9.2 Typografie
Manrope Light 300 [Fakt] für alle Texte, selbst gehostet als WOFF2, Zeichensätze Latin und Latin Extended. Die handschriftliche Schrift im Entwurf ist nur Skizze und wird durch Manrope ersetzt.
Stil	Desktop	Mobile	Zeilenhöhe	Besonderheit
Hero-Claim	clamp(32, 3 vw, 52) px	26–30 px	1,15	
H1	56 px	36 px	1,1	Laufweite −0,01 em
H2	40 px	30 px	1,15	
H3	24 px	20 px	1,25	
Fließtext	18 px	17 px	1,6	Zeilenlänge max. 68 Zeichen
Klein	15 px	15 px	1,5	Untergrenze für jeden Text
Navigation, Buttons, Labels	15 px	15 px	1	Versalien, Laufweite 0,12 em
Der Light-Schnitt ist bei kleinen Größen dünn. Deshalb gilt 15 px als absolute Untergrenze. Entscheidung E-07 klärt, ob für Texte unter 16 px ausnahmsweise Regular 400 erlaubt ist.
9.3 Spacing und Raster
•	Basis 8 px. Abstands-Tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
•	Section-Innenabstand oben und unten: 128 px Desktop, 96 px Tablet, 72 px Mobile.
•	Seitenränder: 64 px ab 1440 px, 48 px ab 1024 px, 32 px ab 600 px, 20 px darunter.
•	Raster: 12 Spalten mit 32 px Abstand ab 1024 px, 8 Spalten mit 24 px ab 600 px, 4 Spalten mit 16 px darunter.
•	Maximale Inhaltsbreite 1280 px. Ausnahme: Hero-Fahrzeug darf randlos laufen.
•	Eckenradius überall 0. Rahmen 1 px.
9.4 Komponenten
Komponente	Varianten	Zustände
Button	Primär (gefüllt in Gegenfarbe), Sekundär (1 px Rahmen, transparent)	Normal, Hover (Farbumkehr), Fokus (2 px roter Ring, 3 px Abstand), Gedrückt, Deaktiviert (40 % Deckkraft), Laden
Textlink	Inline	Hover: rote Unterstreichung 2 px; Fokus wie Button
Karte	Ablauf, Vorteil, Fahrzeug, Service, Bewertung, Fakt	Normal, Hover (nur Fahrzeug)
Preistabelle	Tabelle ab 600 px, Kasten-Liste darunter	–
Formularfelder	Text, E-Mail, Telefon, Datum, Auswahl, Optionsgruppe als Kästen, Checkbox, Textfeld	Leer, Fokus, Ausgefüllt, Fehler, Deaktiviert
Accordion	–	Zu, Offen, Fokus
Modal	Fahrzeug-Detail	Öffnen, Offen, Schließen
Navigation	Desktop-Leiste, Mobile-Overlay	Normal, Verkleinert, Offen
Sprachumschalter	Navigation, Footer	Aktiv, Inaktiv, Fokus
Kartenplatzhalter	–	Inaktiv, Lädt, Aktiv, Fehler
Buttons: Höhe 56 px Desktop, 48 px Mobile, Innenabstand 0 × 32 px. Mindest-Tippfläche 48 × 48 px.
9.5 Icons und Logo
•	Keine Emojis, nirgendwo, auch nicht in Meta-Daten, Übersetzungen oder Fehlermeldungen [Fakt].
•	Icons [Empfehlung]: Phosphor Icons, Schnitt „Light“, passend zur Light-Schrift. Größe 24 px, Farbe = Textfarbe, inline als SVG.
•	Benötigte Icons: Tacho, Kalender, Schlüssel, Schild mit Haken, Kartennadel, Telefon, Brief, Instagram, Uhr, Geschenk, Lieferwagen, Herz (statt Ringe, da Phosphor kein Ringe-Symbol hat; entschieden 23.10.2026), Euro, Ausweis, Lenkrad, Stern, Plus, Kreuz, Pfeil rechts, Menü.
•	Logo-Einsatz: A-Bildmarke weiß-silber auf Schwarz (Navigation, Footer), A-Bildmarke schwarz auf Weiß. Wortmarke schwarz im Hero; weiße Wortmarke fehlt noch (Abschnitt 11).
9.6 Bildwelt
•	Freigestellte Fahrzeuge im exakten Seitenprofil, Fahrtrichtung links, ohne Hintergrund.
•	Alle drei Fahrzeuge im identischen Maßstab, damit Radstand und Bodenlinie bei Wechseln übereinstimmen.
•	Keine Menschen, keine Stockfotos, keine Hintergrundlandschaften.
9.7 Motion
Grundsätze: Bewegt werden nur transform und opacity. Jede Animation läuft einmal. Eine zentrale Motion-Logik steuert alles über Datenattribute (z. B. data-reveal="left"), Dauern und Kurven kommen aus Tokens. Keine Inline-Stile pro Element, kein Scroll-Jacking, kein Parallax.
Token	Wert
ease-out	cubic-bezier(0.22, 1, 0.36, 1)
ease-drive	cubic-bezier(0.16, 1, 0.3, 1), stark abbremsend wie beim Einparken
dur-hover	200 ms
dur-reveal	600 ms
dur-hero-text	700 ms
dur-drive	1.600 ms
Hero-Sequenz beim Laden (Desktop und Mobile):
Element	Start	Ende	Dauer	Verzögerung
Wortmarke	120 px links (Mobile 60 px), unsichtbar	Endposition, sichtbar	700 ms, ease-out	150 ms
Claim	wie Wortmarke	Endposition, sichtbar	700 ms	300 ms
Button	wie Wortmarke	Endposition, sichtbar	700 ms	450 ms
Fahrzeug	komplett rechts außerhalb des Viewports, voll sichtbar	Endposition	1.600 ms, ease-drive	200 ms
Fahrzeug, Einfedern	Neigung −0,6°	0°	300 ms	direkt nach Ankunft
Das Fahrzeug blendet nicht ein, es fährt sichtbar herein. Die Sequenz endet nach höchstens 1,9 s. Der Button ist ab dem ersten Frame klickbar. [Kann] Drehende Räder setzen separate Rad-Assets voraus.
Scroll-Animationen:
•	Auslöser: Element erreicht 85 % der Viewport-Höhe. Läuft einmal, nicht beim Zurückscrollen.
•	Überschriften und Text: von links (−48 px), 600 ms.
•	Fahrzeugbilder: von rechts (+80 px), 900 ms, ease-drive.
•	Kartengruppen: von links, gestaffelt um 80 ms, höchstens 6 Elemente Staffelung.
•	Bereits beim Laden sichtbare Elemente animieren sofort.
•	Ohne JavaScript ist jeder Inhalt sichtbar. Der versteckte Ausgangszustand gilt nur, wenn JavaScript aktiv ist.
Reduzierte Bewegung: Bei prefers-reduced-motion entfallen alle Verschiebungen. Inhalte erscheinen sofort oder mit einer Einblendung von max. 200 ms. Das Hero-Fahrzeug steht direkt an seiner Endposition.
10. Funktionen und Zustände
Die einzige komplexe Funktion ist das Anfrageformular. Alle übrigen Funktionen sind Navigation, Overlay, Accordion, Karte und Sprachwechsel.
10.1 Anfrageformular: Felder
#	Feld	Typ	Pflicht	Regel
1	Fahrzeug	Optionsgruppe als Kästen mit Minibild: Silber, Rot, Schwarz, „Egal“	ja	Vorbelegung per ?auto=
2	Paket	Optionsgruppe: Tag, Wochenende, Woche, Langzeit	ja	Vorbelegung per ?paket=
3	Startdatum	Datum	ja, außer bei Gutschein	Frühestens morgen, spätestens in 12 Monaten [Annahme]. Wochenende: Start muss ein Freitag sein
4	Rückgabedatum	Nur Anzeige, berechnet	–	Tag +1 Tag, Wochenende = folgender Montag, Woche +7 Tage
5	Laufzeit	Auswahl 1–12 Monate	nur bei Langzeit	ersetzt Feld 4
6	Wunschuhrzeit Übergabe	Auswahl 09:00–18:00, stündlich [Annahme]	nein	
7	Kilometerlimit	Auswahl: Inklusiv-km des Pakets, +200 km, +500 km, +1.000 km	ja, Standard Inklusiv-km	Preis 5 € pro Zusatz-km [Annahme]
8	Übergabe	Optionsgruppe: Abholung in Aachen, Lieferung (+500 €)	ja, Standard Abholung	
9	Lieferadresse	Textfeld	nur bei Lieferung	5–200 Zeichen
10	Rückgabe	Optionsgruppe: Rückgabe in Aachen, Abholung durch uns (+500 €)	ja, Standard Rückgabe in Aachen	
11	Abholadresse	Textfeld mit Checkbox „wie Lieferadresse“	nur bei Abholung	5–200 Zeichen
12	Anlass	Auswahl: keiner, Hochzeit, Event, Geschenkgutschein, Business, Fotoshooting	nein	Vorbelegung per ?anlass=
13	Gutscheinwert	Zahl in €	nur bei Geschenkgutschein	mindestens 1.000 €; Fahrzeug und Datum werden dann optional
14	Vorname, Nachname	Text	ja	je 2–60 Zeichen
15	E-Mail	E-Mail	ja	gültiges Format
16	Telefon	Telefon	ja	6–20 Ziffern, + und Leerzeichen erlaubt
17	Voraussetzungen	Checkbox: „Ich bin mindestens 25 Jahre alt und habe seit mindestens 4 Jahren einen Führerschein Klasse B.“	ja, außer bei Gutschein	ersetzt die Abfrage des Geburtsdatums (Datensparsamkeit)
18	Nachricht	Textfeld	nein	max. 1.000 Zeichen mit Zähler
19	Datenschutz	Checkbox mit Link	ja	
–	Spam-Schutz	Unsichtbares Honeypot-Feld und Mindest-Ausfüllzeit 3 s	–	kein CAPTCHA
Bedingte Felder (5, 9, 11, 13) erscheinen mit einer Höhenanimation von 250 ms und werden beim Ausblenden geleert.
10.2 Validierung
•	Geprüft wird beim Verlassen eines Feldes, sobald es einmal bearbeitet wurde, und vollständig beim Absenden.
•	Beim Absenden mit Fehlern erscheint oben eine Fehlerliste mit Sprunglinks. Der Fokus springt auf diese Liste.
•	Fehlerdarstellung: 2 px roter Rahmen am Feld, Warn-Icon in Rot und weißer Fehlertext darunter, per aria-describedby verknüpft. Fehler werden nie nur über Farbe vermittelt.
•	Alle Meldungen liegen in allen 3 Sprachen vor. Beispiel: „Das Wochenendpaket beginnt immer an einem Freitag.“
10.3 Preisvorschau [Soll]
•	Formel: Paketpreis + Lieferung + Abholung + Zusatz-km × 5 €. Langzeit: 20.000 € × Monate, mit dem Hinweis „ab“. Gutschein: Gutscheinwert.
•	Die Kaution steht als eigene Zeile darunter: „Kaution 10.000 €, vor Ort, wird erstattet“.
•	Unter der Summe steht „Unverbindliche Vorschau. Verbindlich ist unsere Bestätigung.“
•	Aktualisierung bei jeder Eingabe. Screenreader erhalten die neue Summe per aria-live="polite".
10.4 Zustände des Formulars
Zustand	Verhalten
Leer	Standardwerte gesetzt, Pflichtfelder mit Sternchen und erklärendem Hinweis am Formularanfang
Ausfüllen	Bedingte Felder erscheinen, Preisvorschau aktualisiert sich
Fehler	wie 10.2
Senden	Button zeigt „Wird gesendet“ und ein drehendes Icon, Felder gesperrt, kein Doppel-Absenden
Erfolg	Formular wird durch eine Erfolgsfläche ersetzt: „Danke, [Vorname]. Deine Anfrage ist eingegangen.“, Zusammenfassung, Konzept-Hinweis, Button „Neue Anfrage“. Fokus auf die Überschrift
Technischer Fehler	Hinweis über dem Button: Senden fehlgeschlagen, bitte erneut versuchen oder anrufen. Eingaben bleiben erhalten
Spam erkannt	Erfolgsfläche wird angezeigt, Daten werden verworfen
Ohne JavaScript	Modus Demo: Hinweis „Bitte JavaScript aktivieren“. Modus Versand: normales Absenden mit serverseitiger Prüfung
Ob die Anfrage tatsächlich versendet wird oder nur simuliert, klärt Entscheidung E-02.
10.5 Weitere Funktionen und Zustände
Funktion	Zustände und Verhalten
Bilder	Platz wird über das Seitenverhältnis reserviert (kein Layoutsprung). Hintergrund während des Ladens = Section-Farbe, kein Flackern. Fehler: Kasten mit Fahrzeugname als Text
Hero-Fahrzeug	Animation startet, sobald das Bild dekodiert ist, spätestens nach 1,5 s. Ist es dann nicht geladen, läuft die Text-Sequenz allein und das Fahrzeug blendet nach dem Laden in 300 ms ein
Karte	Inaktiv: schwarzer Kasten mit Kartennadel, Hinweis auf Datenübertragung an Google, Button „Karte laden“. Lädt: Hinweis „Karte wird geladen“. Aktiv: eingebettete Karte. Fehler: Hinweis und Link „Route in Google Maps öffnen“. Die Zustimmung wird nicht gespeichert
Detail-Overlay	Öffnen 300 ms (Einblenden und 24 px von unten), Schließen 200 ms. Unbekannter ?auto=-Wert: Overlay bleibt zu
Accordion	Zu, Offen, Fokus. Zustand per aria-expanded
Sprachumschalter	Fehlt eine Übersetzung, wird die Seite nicht ausgeliefert (Build-Fehler statt leerer Texte)
Leerzustand Fahrzeuge	Sind alle Fahrzeuge in den Inhalten deaktiviert: Hinweis „Derzeit sind alle Fahrzeuge vergeben“ und Kontakt-CTA
Leerzustand Bewertungen	Section wird ausgeblendet, der Farbwechsel der Folge-Sections bleibt korrekt
404	Weiße Seite in Sprache der URL: „Diese Seite ist von der Strecke abgekommen.“ Buttons zur Startseite und zu den Fahrzeugen, Status 404
11. Content- und Asset-Inventar
Die Fahrzeugbilder und Rasterlogos liegen vor. Es fehlen vor allem Vektorlogos, die weiße Wortmarke, Übersetzungen und Rechtstexte. „Claude-Entwurf“ heißt: Ich liefere den Text, der Webdesigner gibt frei.
11.1 Assets
Asset	Format und Anforderung	Owner	Status
A-Bildmarke schwarz	Raster vorhanden	Webdesigner	Vorhanden
A-Bildmarke weiß-silber	Raster vorhanden	Webdesigner	Vorhanden
Logos als Vektor (Bildmarke schwarz, weiß-silber; Wortmarke)	SVG, transparenter Hintergrund	Claude (aus den Rastern nachgebaut, 22.10.2026)	Vorhanden
Wortmarke weiß	SVG, für Footer und schwarze Flächen	Claude (aus den Rastern nachgebaut, 22.10.2026)	Vorhanden
Favicon und App-Icons	aus der A-Bildmarke, 32 px, 180 px, 512 px, SVG	Webdesigner	Fehlt
Fahrzeuge Silber, Rot, Schwarz	freigestellt, transparent; vorliegende Bilder ca. 1.536 px breit, Ziel ≥ 2.400 px für randlosen Desktop-Hero; ausgeliefert als AVIF und WebP	Webdesigner	Vorhanden
Hero-Entwürfe Desktop und Mobile	Referenz für Abnahme	Webdesigner	Vorhanden
Open-Graph-Bilder	1.200 × 630 px je Seite und Sprache	Webdesigner	Fehlt
Kartenplatzhalter	eigene Grafik, keine Google-Kacheln	Webdesigner	Fehlt
Icon-Set	Phosphor Light, MIT-Lizenz	Entwicklung	Fehlt
Schrift Manrope 300	WOFF2, selbst gehostet, SIL Open Font License	Entwicklung	Fehlt
Rad-Assets für drehende Räder [Kann]	freigestellte Räder je Fahrzeug	Webdesigner	Fehlt
11.2 Inhalte
Inhalt	Umfang	Owner	Status
Texte Deutsch	alle Sections laut Abschnitt 8, eigene Formulierungen	Claude-Entwurf	In Arbeit
Übersetzungen Englisch und Niederländisch	alle Texte, Meta-Daten, Fehlermeldungen	Claude-Entwurf	In Arbeit
Fiktive Geschäftsdaten	Adresse, Telefon, E-Mail, Instagram, Öffnungszeiten, Preise	Webdesigner	Vorhanden
FAQ	6 Fragen und Antworten in 3 Sprachen	Claude-Entwurf	Fehlt
Bewertungen	3 Stück in 3 Sprachen, siehe E-04	Claude-Entwurf	Fehlt
Impressum und Datenschutz	Angaben des Webdesigners als Betreiber, 3 Sprachen	Webdesigner	Fehlt
Meta-Titel und Beschreibungen	3 Seiten × 3 Sprachen nach Abschnitt 13	Claude-Entwurf	Fehlt
UI-Texte	Buttons, Labels, Fehlermeldungen, Zustände, 404 in 3 Sprachen	Claude-Entwurf	Fehlt
11.3 Kerntexte in drei Sprachen [Empfehlung]
Element	DE	EN	NL
Claim	Dein Herzschlag. Unsere PS.	Your heartbeat. Our horsepower.	Jouw hartslag. Onze pk's.
Navigation	Startseite · Fahrzeuge · Kontakt	Home · Cars · Contact	Home · Auto's · Contact
Haupt-CTA	Jetzt mieten	Rent now	Nu huren
Fahrzeug-CTA	Dieses Fahrzeug anfragen	Request this car	Deze auto aanvragen
Formular-Button	Anfrage senden	Send request	Aanvraag versturen
Ablauf	In drei Schritten auf die Straße	On the road in three steps	In drie stappen de weg op
Flotte	Die Flotte. Ein Modell. Drei Charaktere.	The fleet. One model. Three characters.	De vloot. Eén model. Drie karakters.
Pakete	Tag · Wochenende · Woche · Langzeit	Day · Weekend · Week · Long-term	Dag · Weekend · Week · Langdurig
H1 Fahrzeuge	Porsche 911 GT3 RS mieten in Aachen	Rent a Porsche 911 GT3 RS in Aachen	Porsche 911 GT3 RS huren in Aken
H1 Kontakt	Anfrage und Kontakt	Request and contact	Aanvraag en contact
Abschluss-CTA	Bereit für 510 PS?	Ready for 510 hp?	Klaar voor 510 pk?
Konzept-Hinweis	Konzeptprojekt: Apex Rent ist ein fiktives Unternehmen.	Concept project: Apex Rent is a fictional company.	Conceptproject: Apex Rent is een fictief bedrijf.
12. Technische Architektur und Integrationen
Die Seite wird als vorgerendertes, statisches HTML ausgeliefert. Alle Inhalte liegen getrennt vom Code in strukturierten Dateien, damit der Webdesigner Preise, Fahrzeuge und Texte ohne Eingriff in Komponenten ändert [Fakt: eigene Lösung, Pflege durch Webdesigner].
12.1 Architektur-Anforderungen
ID	Anforderung	Prüfung
T-01	Jede Seite in jeder Sprache existiert als fertiges HTML, ohne Rendering im Browser	Seitenquelltext enthält alle Texte
T-02	Eine einzige Datenquelle für Geschäftsdaten, Preise und Fahrzeuge. Eine Preisänderung wirkt auf Karten, Tabelle, Overlay, Preisvorschau und strukturierte Daten	Preis in der Datei ändern, alle 5 Stellen zeigen den neuen Wert
T-03	Inhalte werden beim Build gegen ein Schema geprüft. Fehlende Übersetzung oder fehlendes Pflichtfeld bricht den Build ab	Build mit gelöschtem NL-Text schlägt fehl
T-04	JavaScript nur für Hero, Scroll-Animation, Navigation, Overlay, Accordion, Formular, Karte. Gesamt ≤ 30 KB komprimiert [Empfehlung]	Netzwerk-Tab
T-05	Styles über Design-Tokens und komponentenbezogenes CSS. Keine Inline-Stile, keine doppelten Werte	Code-Review
T-06	Eine zentrale Motion-Logik, gesteuert über Datenattribute	Code-Review
T-07	Bildpipeline erzeugt AVIF und WebP in 480, 800, 1.200, 1.600 und 2.400 px Breite mit srcset und sizes	Ausgelieferte Bildgrößen passend zum Viewport
T-08	Schaltbare Umgebungswerte: INDEXIERUNG (Standard aus), FORMULAR_MODUS (demo oder versand); ANALYTICS entfällt (E-13)	Umschalten ohne Codeänderung
T-09	Browser: jeweils die letzten 2 Versionen von Chrome, Edge, Firefox, Safari macOS und iOS, Samsung Internet; iOS ab 16	Test-Matrix Abschnitt 17
T-10	README mit Anleitung: Preis ändern, Fahrzeug hinzufügen, Text ändern, neu veröffentlichen	Ein Dritter schafft jede Änderung in unter 10 Minuten
12.2 Datenmodell
Objekt	Felder
Fahrzeug	id, aktiv, Reihenfolge, Farbschlüssel, Name und Farbname je Sprache, Bild, PS, Getriebe, Antrieb, Sitze, Alt-Text je Sprache
Preise	Tag, Wochenende, Woche, Langzeit pro Monat, Inklusiv-km je Paket, Preis pro Zusatz-km, Lieferung, Abholung, Kaution, Gutschein-Minimum, Währung
Betrieb	Name, Adresse, Geo-Koordinaten, Telefon, E-Mail, Instagram, Öffnungszeiten (maschinenlesbar)
Bewertung	Text je Sprache, Name, Sterne, Datum, aktiv
FAQ	Frage und Antwort je Sprache, Reihenfolge
Seiteninhalte	Texte je Section und Sprache, Meta-Titel, Meta-Beschreibung, OG-Bild
12.3 Integrationen
Integration	Zweck	Umsetzung
Formularversand	Anfrage an Postfach des Webdesigners (nur im Modus versand)	Serverlose Funktion, Prüfung serverseitig, Versand per E-Mail, keine Speicherung in einer Datenbank
Google Maps	Standortkarte	Eingebettete Karte, geladen erst nach Klick
Instagram	Link	Nur Link, keine Einbettung
12.4 Technologie-Empfehlung
Astro mit statischer Ausgabe passt zu allen Anforderungen: eingebautes Sprach-Routing, Inhaltssammlungen mit Schema-Prüfung, Bildoptimierung und standardmäßig kein JavaScript. Dazu TypeScript, natives CSS mit Custom Properties und für Animationen IntersectionObserver plus Web Animations API ohne zusätzliche Bibliothek. Hosting auf einer statischen Plattform mit Vorschau-URL und serverlosen Funktionen. Gleichwertige Alternativen sind zulässig, wenn sie T-01 bis T-10 erfüllen.
13. SEO und Local SEO
SEO wird vollständig umgesetzt und ist prüfbar, bleibt aber per Umgebungswert auf „noindex“, solange Entscheidung E-01 nichts anderes festlegt. Grund: Eine indexierte fiktive Vermietung würde echte Suchende zu einem nicht existierenden Angebot führen.
13.1 Technisches SEO
•	Je Seite genau eine H1, logische Überschriftenfolge ohne Sprünge.
•	html lang je Sprache (de, en, nl). hreflang für alle 3 Sprachen plus x-default auf Deutsch, gegenseitig verlinkt.
•	Selbstreferenzierender Canonical je URL. Parameter-URLs (?auto=, ?paket=) zeigen per Canonical auf die Seite ohne Parameter.
•	sitemap.xml mit allen 15 URLs und hreflang-Alternativen. robots.txt verweist auf die Sitemap.
•	Bei INDEXIERUNG aus: meta robots „noindex, nofollow“ und Header X-Robots-Tag auf jeder Antwort.
•	Meta-Titel max. 60 Zeichen, Beschreibung 140–160 Zeichen, je Seite und Sprache eindeutig.
•	Open Graph und Twitter Card mit eigenem Bild je Seite.
•	Alt-Texte für alle Inhaltsbilder, z. B. „Porsche 911 GT3 RS in Silber, Seitenansicht“. Dekorative Bilder mit leerem Alt-Text.
•	Sprechende URLs ohne Endung, Kleinbuchstaben, keine Weiterleitungsketten.
13.2 Keywords und Meta-Daten [Empfehlung]
Seite	Fokus DE	Fokus EN	Fokus NL
Startseite	Sportwagen mieten Aachen	sports car rental Aachen	sportwagen huren Aken
Fahrzeuge	Porsche GT3 RS mieten Aachen	rent Porsche GT3 RS Aachen	Porsche GT3 RS huren Aken
Kontakt	Sportwagen Mietanfrage Aachen	sports car rental enquiry Aachen	sportwagen huren aanvraag Aken
Nebenbegriffe: Hochzeitsauto Porsche, Sportwagen Gutschein, Porsche Langzeitmiete, Sportwagen Lieferung Maastricht und Heerlen [Annahme: Liefergebiet].
Seite	Meta-Titel DE	Meta-Beschreibung DE
Startseite	Apex Rent | Porsche GT3 RS mieten in Aachen	Drei Porsche 911 GT3 RS mit 510 PS in Aachen mieten. Tag 2.000 €, Wochenende 3.500 €, Woche 10.000 €. Lieferung möglich. Jetzt anfragen.
Fahrzeuge	Porsche 911 GT3 RS mieten Aachen | Preise	GT3 RS in Silber, Rot oder Schwarz: alle Preise, Inklusiv-Kilometer, Kaution und Mietbedingungen auf einen Blick. Persönliche Übergabe in Aachen.
Kontakt	Mietanfrage und Kontakt | Apex Rent Aachen	Wunschtermin, Paket und Fahrzeug wählen und Anfrage senden. Bestätigung innerhalb von 24 Stunden. Abholung in Aachen oder Lieferung.
13.3 Local SEO
•	Name, Adresse und Telefon sind auf allen Seiten zeichengleich (Footer, Kontakt, strukturierte Daten), aus einer Datenquelle (T-02).
•	„Aachen“ bzw. „Aken“ erscheint in Titel, H1 und Einleitung der Fahrzeugseite.
•	Strukturierte Daten als JSON-LD: Typ AutoRental mit Adresse, Geo-Koordinaten, Öffnungszeiten, Telefon, Preisspanne und Instagram als sameAs. Auf der Fahrzeugseite je Fahrzeug Typ Car mit Angeboten. FAQ als FAQPage [Soll].
•	Fiktive Bewertungen werden nicht als strukturierte Daten ausgezeichnet.
•	Google Business Profile ist Out of Scope, da für fiktive Unternehmen unzulässig.
13.4 Analytics
•	Entfällt (E-13). Es wird kein Analytics- oder Tracking-Skript eingebunden.
•	Die Seite setzt keine Cookies und schreibt nichts in den lokalen Speicher, daher ist kein Consent-Banner nötig.
14. Accessibility-Anforderungen
Zielstandard ist WCAG 2.2 Stufe AA auf allen Seiten und in allen Sprachen.
ID	Anforderung	Prüfung
A-01	Kontrast Text mindestens 4,5:1, große Schrift und Bedienelemente mindestens 3:1. Kein roter Fließtext auf Schwarz	Kontrastprüfer für jede Farbkombination aus 9.1
A-02	Alles ist per Tastatur bedienbar, in logischer Reihenfolge. Sichtbarer Fokus: 2 px roter Ring mit 3 px Abstand	Komplettdurchlauf nur mit Tab, Enter, Leertaste, Escape
A-03	„Zum Inhalt springen“-Link als erstes Element, sichtbar bei Fokus	Tastaturtest
A-04	Semantische Landmarks: header, nav, main, footer; Sections mit Überschrift	Screenreader-Landmarkliste
A-05	Mobile-Menü und Overlay: Fokus bleibt im Dialog, Escape schließt, Fokus kehrt zurück, Hintergrund ist für Screenreader ausgeblendet	VoiceOver iOS, NVDA Windows
A-06	Formular: Jedes Feld hat ein sichtbares Label. Pflichtfelder sind im Text gekennzeichnet. Fehler sind per aria-describedby verknüpft und werden nicht nur farblich vermittelt	Screenreader liest Label, Pflicht und Fehler vor
A-07	Optionsgruppen als Kästen sind echte Radiobuttons mit Gruppenbeschriftung	Pfeiltasten wechseln die Auswahl
A-08	Tippflächen mindestens 48 × 48 px auf Touch-Geräten	Messung bei 390 px
A-09	prefers-reduced-motion wird respektiert (9.7). Keine Animation länger als 5 s, nichts blinkt	Betriebssystem-Einstellung aktivieren
A-10	Text bis 200 % Zoom ohne Informationsverlust, bei 320 px Breite kein horizontales Scrollen	Browser-Zoom, Viewport 320 px
A-11	Wortmarke im Hero hat eine Textalternative; die H1 ist für Screenreader vorhanden	Screenreader
A-12	Preisvorschau und Erfolgsmeldung werden per aria-live angesagt	Screenreader
A-13	Sprachumschalter: Links mit hreflang und lang-Attribut, ausgeschriebener Sprachname für Screenreader	Screenreader liest „Deutsch“, „English“, „Nederlands“
A-14	Icons sind dekorativ (aria-hidden) oder haben einen zugänglichen Namen, wenn sie allein stehen	axe
15. Performance- und Sicherheitsanforderungen
15.1 Performance
Gemessen mit Lighthouse im Mobile-Profil, Median aus 3 Läufen, je Seite und Sprache.
ID	Kennzahl	Zielwert
P-01	Largest Contentful Paint	≤ 2,5 s
P-02	Cumulative Layout Shift	≤ 0,05, auch während der Hero-Animation
P-03	Interaction to Next Paint	≤ 200 ms
P-04	Gesamtgewicht Startseite beim ersten Laden	≤ 900 KB, davon Hero-Fahrzeug ≤ 250 KB in Mobile-Größe
P-05	JavaScript komprimiert	≤ 30 KB [Empfehlung]
P-06	Schriftdatei Manrope 300	eine WOFF2-Datei, ≤ 40 KB, per preload geladen, font-display: swap
P-07	Animationen	nur transform und opacity, 60 fps auf einem Mittelklasse-Smartphone
P-08	Bilder unterhalb des sichtbaren Bereichs	lazy geladen. Hero-Fahrzeug mit fetchpriority="high"
P-09	Google Maps	wird beim Seitenaufruf nicht geladen, nur nach Klick
15.2 Sicherheit
•	Auslieferung nur über HTTPS mit HSTS.
•	Security-Header: Content-Security-Policy (nur eigene Quellen; Google Maps ausdrücklich erlaubt), X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy ohne Kamera, Mikrofon, Standort, frame-ancestors none.
•	Formular im Modus versand: serverseitige Validierung aller Felder, Längenbegrenzung, Escaping in der E-Mail, Ratenbegrenzung 5 Anfragen pro IP und Stunde, Honeypot, keine Speicherung der Daten.
•	Zugangsdaten für E-Mail-Versand nur als Umgebungsvariablen, nie im Repository.
•	Externe Links mit rel="noopener".
•	Abhängigkeiten ohne bekannte kritische Sicherheitslücken zum Launch (npm audit oder gleichwertig).
16. Datenschutzrelevante Integrationen zur fachlichen Prüfung
Diese Liste ist keine Rechtsberatung. Sie benennt, was eine fachkundige Person vor dem öffentlichen Betrieb prüfen sollte. Ziel ist eine Seite ohne Consent-Banner, was nur hält, wenn nichts ohne Zustimmung auf dem Endgerät gespeichert oder ausgelesen wird.
Integration	Welche Daten	Vorgesehene Lösung	Zu prüfen
Hosting	IP-Adresse, Zeitpunkt, angefragte URL in Server-Logs	Anbieter mit Auftragsverarbeitungsvertrag, Log-Aufbewahrung kurz	AV-Vertrag, Serverstandort, Speicherdauer
Anfrageformular, Modus versand	Name, E-Mail, Telefon, Adressen, Termine, Nachricht	Versand per E-Mail an den Webdesigner, keine Datenbank	Transparenz: Nutzer müssen erkennen, dass kein echtes Unternehmen antwortet. Zweck, Rechtsgrundlage, Löschfrist, E-Mail-Dienstleister
Anfrageformular, Modus demo	keine, Daten verlassen den Browser nicht	Simulierter Versand	Bestätigen, dass keine Übertragung und keine Speicherung stattfindet
Google Maps	IP-Adresse, Geräteinformationen an Google, ggf. Cookies	Zwei-Klick-Lösung mit Hinweistext vor dem Laden	Ob der Klick mit Hinweis als Einwilligung genügt; Drittlandübermittlung; Formulierung in der Datenschutzerklärung
Schrift Manrope	keine Übertragung an Dritte	Selbst gehostet statt über Google Fonts	Kein externer Schriftaufruf im Netzwerk-Tab
Icons	keine	Inline-SVG im eigenen Code	–
Instagram	keine, bis zum Klick	Nur Link, keine Einbettung	–
Fiktive Kontaktdaten	–	Telefon, E-Mail-Domain, Adresse und Instagram-Name sind erfunden	Dass keine Angabe zufällig einer realen Person oder Firma gehört
Rechtsseiten: Impressum und Datenschutzerklärung nennen den Webdesigner als tatsächlichen Betreiber. Die Inhalte erstellt oder prüft der Webdesigner; ein Generator oder eine Fachperson ist empfohlen.
17. Akzeptanzkriterien
Geprüft wird bei 320, 390, 768, 1024, 1440 und 1920 px Breite, in allen 3 Sprachen, in Chrome, Safari (macOS und iOS) und Firefox. Jeder Punkt ist bestanden oder nicht bestanden.
Hero
•	☐ Bei 1440 × 830 entsprechen Position und Größe von Wortmarke, Claim, Button und Fahrzeug dem Desktop-Entwurf; Abweichung je Element ≤ 16 px.
•	☐ Bei 390 × 844 entspricht die Reihenfolge dem Smartphone-Entwurf: Wortmarke, Fahrzeug mit Flügel, Claim links, Button rechts. Alles ohne Scrollen sichtbar.
•	☐ Desktop: Das Fahrzeugheck wird am rechten Rand abgeschnitten, es entsteht keine horizontale Scrollleiste.
•	☐ Wortmarke, Claim und Button kommen in dieser Reihenfolge von links; das Fahrzeug fährt sichtbar von rechts herein und bremst ab. Sequenz endet nach ≤ 1,9 s.
•	☐ Während der Sequenz CLS = 0. Der Button ist sofort klickbar.
•	☐ Mit reduzierter Bewegung steht alles sofort an der Endposition.
Farbsystem und Layout
•	☐ Auf jeder Seite wechseln sich die Sections weiß und schwarz ab, beginnend mit Weiß; der Footer ist schwarz mit roter Linie.
•	☐ Buttons, Karten und Hervorhebungen stehen in Kästen der Gegenfarbe, Fließtext ohne Kasten.
•	☐ Rot kommt nur als Detail vor, nie als Fließtext auf Schwarz.
•	☐ Kein Element hat abgerundete Ecken, Schatten oder Verläufe.
•	☐ Alle Texte in Manrope 300, keine Schrift unter 15 px.
•	☐ Im gesamten Code, in allen Texten und Meta-Daten gibt es kein Emoji (automatische Prüfung im Build).
•	☐ Bei keiner Breite von 320 bis 1920 px gibt es horizontales Scrollen, überlappende oder abgeschnittene Texte.
Animation
•	☐ Jedes Element außerhalb des Startbildschirms fliegt beim Erreichen von 85 % Viewport-Höhe ein, genau einmal.
•	☐ Mit deaktiviertem JavaScript sind alle Inhalte sichtbar.
•	☐ Die Performance-Aufzeichnung zeigt beim Scrollen keine Layout- oder Paint-Spitzen durch Animationen.
Navigation und Sprache
•	☐ Alle 15 URLs liefern Status 200, unbekannte URLs Status 404 mit Seite in der passenden Sprache.
•	☐ Der Sprachwechsel führt auf die entsprechende Seite und behält Parameter.
•	☐ Das Mobile-Menü öffnet und schließt per Tippen, Escape und Linkauswahl; der Hintergrund scrollt nicht.
•	☐ Die aktive Seite ist in der Navigation rot markiert.
Fahrzeuge
•	☐ Alle 3 Fahrzeuge zeigen 510 PS, 2.000 € Tag, 3.500 € Wochenende, 10.000 € Woche.
•	☐ /fahrzeuge?auto=rot öffnet direkt das Overlay des roten Fahrzeugs; Zurück schließt es.
•	☐ Eine Preisänderung in der Datenquelle erscheint nach dem Build an allen 5 Stellen (T-02).
•	☐ Mietbedingungen nennen Alter 25, Führerschein 4 Jahre, Kaution 10.000 €, Zahlung bar oder Karte vor Ort, Vollkasko mit Kautionseinbehalt.
Formular
•	☐ /kontakt?auto=schwarz&paket=woche belegt Fahrzeug und Paket vor.
•	☐ Absenden ohne Pflichtfelder zeigt die Fehlerliste, Fokus springt dorthin, jedes Feld nennt seinen Fehler.
•	☐ Wochenende mit Startdatum an einem Nicht-Freitag wird abgelehnt.
•	☐ Lieferung blendet die Lieferadresse ein und erhöht die Preisvorschau um 500 €.
•	☐ Woche mit +500 km und Lieferung ergibt in der Vorschau 13.000 € (10.000 + 500 + 2.500).
•	☐ Doppelklick auf Absenden erzeugt nur eine Anfrage.
•	☐ Erfolgs- und Fehlerzustand erscheinen wie in 10.4; bei Fehler bleiben alle Eingaben erhalten.
SEO und Datenschutz
•	☐ Jede Seite hat eine H1, eindeutigen Titel ≤ 60 Zeichen und Beschreibung 140–160 Zeichen in jeder Sprache.
•	☐ hreflang, Canonical und sitemap.xml validieren fehlerfrei; JSON-LD besteht den Rich-Results-Test ohne Fehler.
•	☐ Bei INDEXIERUNG aus trägt jede Antwort noindex.
•	☐ Im Netzwerk-Tab gibt es keine Anfrage an einen Analytics- oder Tracking-Dienst (E-13).
•	☐ Nach dem Laden jeder Seite ist im Browser kein Cookie und kein Eintrag im lokalen Speicher vorhanden.
Qualität
•	☐ Lighthouse Mobile: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100 (bei Prüfung mit INDEXIERUNG an).
•	☐ axe meldet 0 kritische und 0 schwere Fehler.
•	☐ Kompletter Durchlauf vom Hero bis zur Erfolgsmeldung nur mit der Tastatur möglich.
•	☐ Google Maps lädt erst nach Klick auf „Karte laden“ (Netzwerk-Tab).
•	☐ Konzept-Hinweis steht im Footer jeder Seite und in der Erfolgsmeldung.
18. Risiken, Annahmen und offene Entscheidungen
Das größte Risiko ist, dass eine fiktive Firma für echt gehalten wird. Das zweitgrößte ist die sichtbare Nutzung von Porsche-Markenzeichen in einem öffentlichen Portfolio.
18.1 Risiken
ID	Risiko	Auswirkung	Gegenmaßnahme
R-01	Besucher halten Apex Rent für echt	Echte Anfragen mit persönlichen Daten, enttäuschte Interessenten	Noindex (E-01), Demo-Formular (E-02), Konzept-Hinweis im Footer und in der Erfolgsmeldung
R-02	Porsche-Wappen, Schriftzug „GT3 RS“ und Modellname auf der Seite	Eindruck einer Verbindung zu Porsche, mögliche markenrechtliche Beanstandung	Vom Auftraggeber bewusst akzeptiert: Bilder bleiben ohne Hinweis und ohne Retusche (E-05). Die Seite ist nicht indexiert (E-01)
R-03	Fahrzeugbilder sind ca. 1.536 px breit, der Desktop-Hero braucht bei 1440 px und Retina-Display ca. 2.450 px	Unscharfes Hauptbild	Gelöst für den Hero: Silber liegt seit 22.10.2026 in 2.400 × 1.600 px vor. Rot und Schwarz (1.536 px) reichen für Karten und Overlay
R-04	Die Bilder wirken KI-generiert; Details können bei großer Darstellung unstimmig sein	Qualitätseindruck der Arbeitsprobe leidet	Sichtprüfung bei 100 %, Retusche vor Launch
R-05	Manrope Light ist bei kleinen Größen dünn	Schlechtere Lesbarkeit, vor allem Weiß auf Schwarz	Mindestgröße 15 px; E-07
R-06	Ausgeblendete Hero-Elemente zählen erst nach dem Einblenden für den LCP	LCP-Ziel gefährdet	Wortmarke nur verschieben statt ausblenden, falls P-01 verfehlt wird
R-07	Englische und niederländische Texte sind länger als deutsche	Umbrüche in Buttons und Kästen	Layouttests mit der längsten Sprache je Element
R-08	Fiktive Adresse ist in Google Maps nicht auffindbar	Leere oder falsche Karte	Karte über Koordinaten statt Adresse (E-06)
R-09	Datumsauswahl sieht je Browser und System anders aus	Gestaltung nicht ganz einheitlich	Natives Datumsfeld bleibt (zuverlässig, zugänglich); nur das Feld selbst wird gestaltet
R-10	Wunsch nach Online-Buchung während der Umsetzung	Umfang wächst stark	Bleibt Out of Scope, eigenes Folgeprojekt
18.2 Annahmen
Alle mit [Annahme] markierten Werte gelten bis zur Freigabe als Platzhalter. Die wichtigsten:
•	Inklusiv-Kilometer: Tag 200, Wochenende 500, Woche 1.200, Langzeit 3.000 pro Monat. Zusatz-km 5 €.
•	Wochenende: Freitag 12:00 bis Montag 10:00.
•	Fahrzeugdaten neben PS: 7-Gang-PDK, Hinterradantrieb, 2 Sitze.
•	Preise inklusive MwSt.
•	Du-Ansprache und die Übersetzungen des Claims.
•	Bestätigung von Anfragen innerhalb von 24 Stunden, Buchungsvorlauf ab morgen bis 12 Monate.
•	Übergabezeiten 09:00–18:00, mitzubringen Ausweis und Führerschein.
•	Schaden: Kaution wird bis zu ihrer vollen Höhe einbehalten.
•	Tablet nutzt das Mobile-Hero-Layout.
Hinweis zur Leistungsangabe: Das Briefing nennt 510 PS. Der reale 911 GT3 RS (Typ 992) hat nach meinem Kenntnisstand 525 PS. Für ein Konzept unkritisch, fachkundigen Betrachtern könnte es aber auffallen.
Die offenen Entscheidungen stehen gesammelt am Ende des Dokuments.
19. Entwicklungsphasen und Abhängigkeiten
Die Umsetzung läuft in 8 Phasen. Inhalte und Fundament können parallel laufen, sobald das PRD freigegeben ist. Einen Termin gibt es nicht [Fakt].
Phase	Inhalt	Abhängig von	Ergebnis
P0 Freigabe	Entscheidungen E-01 bis E-13, Annahmen bestätigen	–	Freigegebenes PRD
P1 Inhalte und Assets	DE-Texte, Übersetzungen EN/NL, FAQ, Bewertungen, SVG-Logos, weiße Wortmarke, Bilder in hoher Auflösung	P0 (E-03, E-04, E-05, E-09)	Vollständige Inhaltsdateien und Assets
P2 Fundament	Projekt, Tokens, Schrift, Raster, Datenmodell mit Schema-Prüfung, Sprach-Routing, Emoji-Prüfung im Build	P0	Leere Seiten in 3 Sprachen, Build-Prüfungen aktiv
P3 Komponenten	Navigation, Buttons, Karten, Preistabelle, Accordion, Modal, Formularfelder, Footer, Motion-Logik	P2	Komponenten mit allen Zuständen
P4 Seiten und Hero	Startseite mit Hero-Sequenz, Fahrzeuge mit Overlay, Kontakt, Rechtsseiten, 404	P3; finale Assets aus P1	Alle 15 URLs mit echten Inhalten
P5 Funktionen	Formularlogik, Preisvorschau, Demo- oder Versandmodus, Karte	P3, E-02	Formular erfüllt Abschnitt 10
P6 SEO und Feinschliff	Meta-Daten, hreflang, Sitemap, JSON-LD, Animations-Feinabstimmung	P4, P5	SEO-Kriterien erfüllt
P7 QA und Abnahme	Checkliste Abschnitt 17, Test-Matrix, Korrekturen, Designabnahme Hero	P1–P6	Alle Kriterien bestanden
P8 Veröffentlichung	Deployment auf Dev-URL, Security-Header, README	P7, E-12	Öffentliche Konzept-URL
Kritischer Pfad: P0 → P2 → P3 → P4 → P7 → P8. Die Hero-Abnahme hängt zusätzlich an den hochaufgelösten Fahrzeugbildern aus P1.
20. Definition of Done
Das Projekt ist fertig, wenn alle Punkte erfüllt sind.
•	☐ Alle Muss-Anforderungen aus Abschnitt 5 sind umgesetzt; umgesetzte Soll-Anforderungen sind dokumentiert.
•	☐ Alle Akzeptanzkriterien aus Abschnitt 17 sind bestanden, mit Prüfprotokoll (Datum, Browser, Breite, Ergebnis).
•	☐ Der Auftraggeber hat Hero Desktop und Mobile visuell abgenommen.
•	☐ Alle Texte liegen in DE, EN und NL vor, freigegeben, ohne Platzhalter und ohne Emojis.
•	☐ Alle [Annahme]-Werte sind bestätigt oder ersetzt.
•	☐ Impressum und Datenschutzerklärung sind vom Webdesigner erstellt und geprüft.
•	☐ Die Punkte aus Abschnitt 16 sind fachlich geprüft.
•	☐ Lighthouse- und axe-Ergebnisse sind als Bericht gespeichert.
•	☐ Code ist versioniert, ohne Zugangsdaten im Repository, ohne Linter-Fehler.
•	☐ Das README erklärt Preis ändern, Fahrzeug hinzufügen, Text ändern und Veröffentlichen; ein Test mit einer Preisänderung war erfolgreich.
•	☐ Die Seite läuft auf der Dev-URL mit den freigegebenen Umgebungswerten (Indexierung, Formularmodus).
Noch freizugebende Entscheidungen
Stand 23.10.2026: Alle 13 Entscheidungen sind getroffen. Das PRD ist freigabereif.
ID	Entscheidung	Ergebnis	Status
E-01	Indexierung durch Suchmaschinen	Noindex. SEO bleibt vollständig umgesetzt und per Schalter aktivierbar	Empfehlung freigegeben
E-02	Formularversand	Demo ohne Übertragung. Daten verlassen den Browser nicht	Empfehlung freigegeben
E-03	Telefon und Instagram	Beides fiktiv und nur als Text: keine Anruf-Verlinkung, kein Instagram-Link. Events phone_click und instagram_click entfallen	Anders entschieden
E-04	Bewertungen	Fiktiv, gekennzeichnet als „Beispielbewertungen“, ohne Google-Logo	Empfehlung freigegeben
E-05	Porsche-Zeichen in den Bildern	Bilder bleiben unverändert, ohne Hinweis und ohne Retusche. Risiko R-02 vom Auftraggeber akzeptiert	Anders entschieden
E-06	Kartenpunkt	Neutraler Punkt in einem Aachener Gewerbegebiet, Koordinaten statt Adresse: 50.7735, 6.1325 (Gewerbegebiet Rothe Erde, PLZ 52068, Parkplatz ohne Gebäude im Umkreis von 25 m laut OpenStreetMap; festgelegt 23.10.2026)	Empfehlung freigegeben
E-07	Schriftschnitt kleiner Texte	Light 300, Mindestgröße 15 px	Empfehlung freigegeben
E-08	Fahrzeugdetails	Overlay mit Deeplink	Empfehlung freigegeben
E-09	Ansprache	Du	Empfehlung freigegeben
E-10	Annahmen aus 18.2	Alle freigegeben	Empfehlung freigegeben
E-11	Urheber-Credit im Footer	Vorerst kein Credit. Kann später im Footer ergänzt werden	Anders entschieden
E-12	Hosting	Cloudflare (statische Auslieferung mit Vorschau-URLs, Security-Header per _headers, 404-Seite je Sprache)	Empfehlung freigegeben
E-13	Analytics	Kein Analytics, da Konzeptseite ohne echten Traffic. Entfallen: Messung der simulierten Conversion (Abschnitt 2), Event-Liste (Abschnitt 7), Schalter ANALYTICS (T-08), Analytics in 12.3, 13.4, 15.2 und 16 sowie das zugehörige Akzeptanzkriterium	Anders entschieden

