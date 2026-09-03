# z'Wallis im Stah

Website zum Anlass vom 19. September 2026 im Clos du Cornalin über Salgesch.

Sieben Weine, sechs Gänge, elektronische Musik bis in den Abend. CHF 145.00 pro Person, 50 Plätze.

---

## Beteiligte

| Rolle | Betrieb |
|---|---|
| Veranstalterin, Rebberg, Keller und Wein | Fernand Cina SA, Salgesch |
| Küche | Maison 13 Catering |
| Idee und Erzeugnisse | BergBox GmbH, Visp |
| Konzept, Produktentwicklung, Website und Anmeldung | Yoline AG, Salgesch |

---

## Technikentscheid

Astro, statischer Export. Gewählt wegen drei Punkten:

1. **Eine Quelle für die Eckdaten.** Datum, Preis, Plätze und Anmeldeschluss stehen in `src/data/anlass.ts`. Vorher lagen sie über neun Dateien verteilt.
2. **Kopf, Fuss und Partnerband einmal.** Als Bausteine, nicht neunmal kopiert.
3. **Bilder und Sitemap automatisch.** Astro rechnet Bilder um, versieht sie mit Prüfsummen und erzeugt die Sitemap beim Bauen.

Kein Framework im Auslieferungsergebnis. Der Build erzeugt reines HTML, CSS und JavaScript.

---

## Aufbau

```
im-stah/
├── .github/workflows/deploy.yml  Build und Auslieferung auf GitHub Pages
├── .gitignore
├── astro.config.mjs              Domain, Sitemap, Ausgabeformat
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
├── public/                       favicon.svg · robots.txt · preview.jpg
└── src/
    ├── data/anlass.ts            Eckdaten des Anlasses, einzige Quelle
    ├── layouts/
    │   ├── Base.astro            Metadaten, JSON-LD, Kopf- und Fussbereich
    │   └── Legal.astro           Rahmen für die Rechtsseiten
    ├── components/
    │   ├── Header.astro          Kopfzeile mit Navigation
    │   ├── Footer.astro          Fusszeile
    │   ├── Partner.astro         Partnerband
    │   └── logos/
    │       ├── Wortmarke.astro
    │       ├── Maison13.astro
    │       └── Yoline.astro
    ├── pages/
    │   ├── index.astro           Startseite: Was, Wer, Wie, Warum
    │   ├── kulinarik.astro       Menü, Koch, Herkunft
    │   ├── wein.astro            Weinbegleitung, Weingut, Winzerin
    │   ├── organisation.astro    Ablauf, Anfahrt, Fragen, Kontakt
    │   ├── anmeldung.astro       Formular, wird durch YoSuite ersetzt
    │   ├── agb.astro
    │   ├── teilnahmebedingungen.astro
    │   ├── impressum.astro
    │   └── datenschutz.astro
    ├── styles/
    │   ├── site.css
    │   ├── anmeldung.css
    │   └── legal.css
    ├── scripts/
    │   ├── site.js
    │   └── anmeldung.js
    └── assets/img/
        ├── clos-morgenlicht.jpg
        ├── clos-du-cornalin.jpg
        ├── rhonetal.jpg
        ├── rebberg.jpg
        ├── team.jpg
        ├── mood-messer.jpg
        ├── alisha-cina.jpg
        ├── alain-lerjen.jpg
        └── partner/
            ├── fernand-cina.png
            └── bergbox.png
```

Neun Seiten, neun Dateien in `src/pages/`. Der Build legt sie nach `dist/`,
die Startseite als `index.html`, die acht Unterseiten je als Ordner mit `index.html`.

---

## Bilder

Jedes Bild steht genau einmal, die beiden Porträts zweimal.

| Bild | Seite | Stelle |
|---|---|---|
| `clos-morgenlicht.jpg` | `index.astro` | Titelbild |
| `team.jpg` | `index.astro` | Bildband nach dem Abschnitt «Die zwei» |
| `rebberg.jpg` | `index.astro` | Bildband vor dem Abschluss |
| `mood-messer.jpg` | `kulinarik.astro` | Bildband nach dem Menü |
| `clos-du-cornalin.jpg` | `wein.astro` | Bildband nach der Begleitung |
| `rhonetal.jpg` | `organisation.astro` | Bildband bei der Anfahrt |
| `alisha-cina.jpg` | `index.astro`, `wein.astro` | Porträt |
| `alain-lerjen.jpg` | `index.astro`, `kulinarik.astro` | Porträt |

**Umrechnung.** Alles läuft über `astro:assets`. Astro erzeugt die Grössen beim Bauen
und legt sie mit Prüfsumme nach `dist/_astro/`.

| Bildart | Breiten | Qualität | Laden |
|---|---|---|---|
| Titelbild | 960, 1440, 2000 | 72 | `eager`, `fetchpriority="high"` |
| Bildbänder | 960, 1440, 2000 | 72 | `lazy` |
| Porträts | 480, 760, 1000 | 80 | `lazy` |
| Partnermarken | keine Umrechnung | | `lazy` |

Format ist `webp`. Astro rechnet nie hinauf. Liegt eine Vorlage unter der grössten
angefragten Breite, fällt die Reihe entsprechend kürzer aus. `clos-du-cornalin.jpg`
misst 820 mal 1100 Pixel und liefert deshalb nur eine Breite.

Das Titelbild braucht Querformat und Breite. `clos-morgenlicht.jpg` misst
1782 mal 970 Pixel und liefert zwei Breiten. Für die volle Wirkung auf grossen
Bildschirmen fehlt eine Vorlage ab 2000 Pixel.

Partnermarken bleiben PNG mit Alphakanal und behalten ihre Grösse. Sie tragen
`densities={[1]}`, damit `srcset` gesetzt ist, ohne dass umgerechnet wird.

**Neues Bild einsetzen.** Datei nach `src/assets/img/`, im Frontmatter importieren,
im Rumpf über `<Image>` einsetzen. Bildbänder folgen der Bauweise aus `index.astro`:
`<section class="band mm">` mit `<div class="px" data-px="0.18">` und der Unterschrift
in `.q`. Das `<img>` bleibt im `<div class="px">`, sonst hält die Parallaxe nicht.
Jedes Bild braucht ein `alt`, das den Inhalt beschreibt.

---

## Befehle

```bash
npm install       # einmalig
npm run dev       # Entwicklung auf http://localhost:4321
npm run build     # baut nach dist/
npm run preview   # dist/ lokal prüfen
npm run check     # Typen und Vorlagen prüfen
```

---

## Veröffentlichen

**Vercel**

Repository verbinden. Astro wird erkannt, Build `npm run build`, Ausgabeordner `dist`.

**Netlify**

Build `npm run build`, Publish `dist`.

**GitHub Pages**

`.github/workflows/deploy.yml` baut bei jedem Push auf `main` über `withastro/action@v3`
mit Node 22 und liefert über `actions/deploy-pages@v4` aus. In `astro.config.mjs` bleibt
`site` auf der Zieldomain. In den Repository-Einstellungen unter Pages muss die Quelle
auf GitHub Actions stehen.

**Klassischer Webserver**

`npm run build`, danach den Inhalt von `dist/` hochladen.

Nach dem Aufschalten die Domain in `astro.config.mjs` prüfen. Sie steuert Canonical, Open Graph und Sitemap.

---

## Eckdaten ändern

Preis, Datum, Platzzahl oder Anmeldeschluss stehen ausschliesslich in `src/data/anlass.ts`. Eine Änderung dort wirkt auf alle Seiten, auf die Metadaten und auf den JSON-LD-Block.

---

## Technik

**Schriften.** Cabinet Grotesk für alle Grade ab 20 Pixel, Switzer für den Fliesstext. Beide von der Indian Type Foundry, geladen über `api.fontshare.com`.

Für den Produktivbetrieb gehören die Dateien lokal nach `assets/fonts/` und ins CSS als `@font-face`. Ohne Erreichbarkeit des Dienstes fällt die Seite auf Helvetica zurück.

**Bewegung.** Parallaxe über `animation-timeline: view()` mit JavaScript-Rückfall. Zeilenenthüllung und Bildaufbau über `IntersectionObserver`. Alles schaltet bei `prefers-reduced-motion: reduce` ab.

**Karten.** Keine eingebettete Karte. Adresse und Verweise auf Google Maps und den SBB-Fahrplan öffnen extern. Daten fliessen erst beim Klick, so steht es in der Datenschutzerklärung.

**Auszeichnung.** Das Basis-Layout erzeugt Open Graph und Twitter Card für jede Seite. Die Startseite trägt zusätzlich einen `FoodEvent`-Block nach schema.org, gespeist aus `src/data/anlass.ts`.

**Sitemap.** `@astrojs/sitemap` erzeugt beim Bauen `sitemap-index.xml`. Anmeldung und Rechtsseiten sind ausgenommen und tragen `noindex`.

---

## Anmeldung

`src/pages/anmeldung.astro` ist ein Entwurf. Die produktive Anmeldung läuft über YoSuite.

**Felder**

| Feld | Typ | Pflicht |
|---|---|---|
| Name | Text | ja |
| E-Mail | E-Mail | ja |
| Telefon | Telefon | nein |
| Anzahl Personen | 1 bis 6 | ja |
| Name je Person | Text | nein |
| Essen je Person | Fleisch oder vegetarisch | ja |
| 18 Jahre und Bedingungen gelesen | Kontrollkästchen | ja |
| Post von Fernand Cina | Kontrollkästchen | nein |

**Regeln**

1. Die Werbeeinwilligung steht getrennt von der Zustimmung zu den Bedingungen und ist nie vorangekreuzt. Grundlage: Art. 3 Abs. 1 lit. o UWG.
2. Zur Einwilligung gehören Status, Zeitstempel, Quelle und IP, filterbar und als CSV exportierbar.
3. Bei 50 vergebenen Plätzen `#formular` und `.side` ausblenden, `#warteliste` einblenden.
4. Anmeldeschluss 12. September 2026, 23:59. Danach schliesst das Formular.
5. Preis: Anzahl mal CHF 145.00. Anzeige mit Apostroph ab vier Stellen.
6. Die Küche erhält nur die Zahlen je Schiene und die gemeldeten Allergien, ohne Kontaktdaten.

---

## Inhaltliche Regeln

- Anrede durchgehend du
- Schweizer Rechtschreibung, ss statt scharfem S, echte Umlaute
- Kein Gedankenstrich
- Beträge als CHF 145.00, ab vier Stellen mit Apostroph
- Auszeichnungen nur mit Wettbewerb, Ort und Jahr
- Gesperrt: einzigartig, unvergesslich, aussergewöhnlich, leidenschaftlich, kulinarische Reise, Location, Event

---

## Offene Punkte

1. **Maison 13 Catering.** Firmenname, Rechtsform und Adresse fehlen im Impressum.
2. **Eringer.** Die Herkunft braucht eine schriftliche Bestätigung. Der Name steht mehrfach auf der Seite.
3. **Munder Safran.** Bezugsquelle bestätigen.
4. **Zahlungsdienstleister und Hosting.** Namen fehlen in der Datenschutzerklärung.
5. **Juristische Prüfung.** AGB, Teilnahmebedingungen, Impressum und Datenschutzerklärung sind nach bestem Wissen erstellt, jedoch nicht anwaltlich geprüft.
6. **Französisch.** Salgesch liegt an der Sprachgrenze. Eine Fassung fehlt und ist ein offener Entscheid.
7. **Wortmarke.** Die SVG-Datei ist nachgezeichnet. Die Konturen sind ab etwa 900 Pixel Breite sichtbar treppig. Für Druck ab A2 braucht es die Marke aus der Originalschrift.
8. **Schriften.** Für den Produktivbetrieb nach `src/assets/fonts/` legen und über `@font-face` einbinden, statt vom fremden Server zu laden.
9. **Titelbild.** `clos-morgenlicht.jpg` stammt aus einem Bildschirmfoto und misst 1782 mal 970 Pixel. Es liefert 960 und 1782 Pixel Breite, nicht die volle Reihe. Eine Aufnahme aus dem Original ab 2000 Pixel Breite wäre der bessere Weg.

---

## Rechte

Fotos, Wortmarke und Texte gehören der Fernand Cina SA. Die Partnermarken gehören den jeweiligen Inhaberinnen. Keine Nutzung ausserhalb dieses Anlasses ohne schriftliche Zustimmung.

Porträts und Stimmungsbilder stammen aus dem Bestand der Fernand Cina SA.

Cabinet Grotesk und Switzer stehen unter der Lizenz der Indian Type Foundry und dürfen kommerziell verwendet werden.

---

Stand 3. September 2026 · Yoline AG, Salgesch
