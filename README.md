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
        ├── rebhaus-drohne.jpg
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
| `mood-messer.jpg` | `index.astro` | Bildband nach dem Abschnitt «Die zwei» |
| `rebberg.jpg` | `index.astro` | Bildband vor dem Abschluss |
| `clos-du-cornalin.jpg` | `kulinarik.astro` | Bildband nach dem Menü |
| `rebhaus-drohne.jpg` | `wein.astro` | Bildband nach der Begleitung |
| `team.jpg` | `organisation.astro` | Bildband nach dem Ablauf |
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
1782 mal 970 Pixel und liefert drei Breiten, die angefragten 2000 fehlen.
Zur Herkunft der Vorlagen siehe Offene Punkte 9 und 10.

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

Vercel, Projekt `stah`. Ein Weg, keine Nebenstrecke. Astro wird erkannt,
Build `npm run build`, Ausgabeordner `dist`.

| Was | Adresse |
|---|---|
| Produktion, Branch `main` | https://stah-yoline7s-projects.vercel.app |
| Vorschau, dieser Branch | https://stah-git-claude-astro-repo-restructure-6pqpq1-yoline7s-projects.vercel.app |
| Zieldomain, noch nicht aufgeschaltet | https://im-stah.ch |

Vercel baut bei jedem Push. `main` geht in die Produktion, jeder andere Branch
bekommt eine eigene Vorschauadresse. Ein Pull Request zeigt sie im Verlauf an.

**Zugriff.** Im Projekt steht die Vercel-Authentifizierung auf «all except custom
domains». Beide `vercel.app`-Adressen verlangen deshalb einen Login im Team
`yoline7's projects`, die Produktionsadresse eingeschlossen. Offen erreichbar wird
die Seite erst über die eigene Domain. Wer die Seite vorher extern zeigen will,
stellt den Schutz im Vercel-Projekt auf «only preview deployments» um.

Die Zieldomain steht in `astro.config.mjs` unter `site`. Sie steuert Canonical,
Open Graph und Sitemap, unabhängig davon, unter welcher Adresse Vercel ausliefert.
Nach dem Aufschalten von `im-stah.ch` die Domain im Vercel-Projekt hinterlegen.

---

## Eckdaten ändern

Preis, Datum, Platzzahl oder Anmeldeschluss stehen ausschliesslich in `src/data/anlass.ts`. Eine Änderung dort wirkt auf alle Seiten, auf die Metadaten und auf den JSON-LD-Block.

---

## Technik

**Schriften.** Cabinet Grotesk für alle Grade ab 20 Pixel, Switzer für den Fliesstext. Beide von der Indian Type Foundry, geladen über `api.fontshare.com`.

Für den Produktivbetrieb gehören die Dateien lokal nach `assets/fonts/` und ins CSS als `@font-face`. Ohne Erreichbarkeit des Dienstes fällt die Seite auf Helvetica zurück.

**Bewegung.** Parallaxe über `animation-timeline: view()` mit JavaScript-Rückfall. Zeilenenthüllung und Bildaufbau über `IntersectionObserver`. Alles schaltet bei `prefers-reduced-motion: reduce` ab.

**Kopfzeile.** Drei Zonen: Wortmarke links, Knopf «Platz sichern» mittig, Burger rechts.
Auf schmalen Schirmen verkürzt der Knopf auf «Anmelden», alle drei Zonen bleiben.
Der Burger öffnet eine vollflächige Überlagerung, die über `clip-path` von oben aufzieht.
`Escape` schliesst, ein Klick auf eine Zeile ebenso. Beim Öffnen erhält `body` ein
`overflow: hidden`, beim Schliessen fällt es weg. Bei `prefers-reduced-motion: reduce`
erscheint die Überlagerung ohne Bewegung. Ohne JavaScript bleibt sie verborgen, die
Unterseiten stehen im Fuss.

**Kontrast auf dem Titelbild.** Der Schleier steht auf `rgba(26,18,12,.40)`, warm statt
neutral. Das Bild trägt Morgenlicht, ein neutralschwarzer Schleier zieht die Wärme heraus.
Der warme Ton ist heller als der neutrale und deckt bei gleicher Deckung deshalb weniger.
Gemessen am gerenderten Bild, gemittelt auf Strichbreite, schlechteste der drei Zeilen:

| Schleier | 1920 | 1440 | 1280 | 390 |
|---|---|---|---|---|
| `rgba(26,18,12,.32)` | 4.09 | 4.11 | 4.11 | 8.23 |
| `rgba(26,18,12,.34)` | 4.27 | 4.29 | 4.29 | 8.46 |
| `rgba(26,18,12,.36)` | 4.47 | 4.50 | 4.50 | 8.73 |
| `rgba(26,18,12,.38)` | 4.63 | 4.65 | 4.65 | 8.85 |
| `rgba(26,18,12,.40)` | 4.85 | 4.87 | 4.87 | 9.13 |

Ab `.38` hält der Wert 4.5 zu 1. Gesetzt ist `.40`, weil die Messung ohne Cabinet Grotesk
lief und die Reserve die Unsicherheit im Schriftbild deckt. Sobald die Schriften lokal
liegen, neu messen und den Schleier senken. Das Bild selbst abzudunkeln ist der falsche
Weg, es war zuvor zu dunkel.

Die Bildbänder tragen keinen Schleier, nur den Filter auf `.band .px img`.

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
4. Anmeldeschluss 15. September 2026, 23:59. Danach schliesst das Formular. Der Wert steht in `src/data/anlass.ts`, die Seiten ziehen ihn von dort.
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
8. **Schriften.** Cabinet Grotesk und Switzer laden weiter von `api.fontshare.com`. Für den Produktivbetrieb gehören sie nach `src/assets/fonts/` und über `@font-face` eingebunden. Ein Versuch scheiterte: Die Netzregel dieser Umgebung sperrt `api.fontshare.com`, und für Cabinet Grotesk existiert auf npm kein Paket. Beschaffung von einem Rechner mit freiem Zugang, danach Schleier auf dem Titelbild neu messen und senken.
9. **Titelbild aus einem Bildschirmfoto.** `clos-morgenlicht.jpg` ist eine Bildschirmaufnahme, 1782 mal 970 Pixel. Sie liefert 960, 1440 und 1782 Pixel Breite, die angefragten 2000 fehlen. Ein Bildschirmfoto trägt bereits eine Kompression, die zweite kommt beim Umrechnen dazu. Es braucht die Aufnahme aus dem Original ab 2000 Pixel Breite.
10. **Mehrfach komprimierte Bänder.** `rebhaus-drohne.jpg` und `rebberg.jpg` sind bereits stark komprimiert. Beim Umrechnen auf WebP wachsen sie deshalb: 262 gegen 185 kB und 140 gegen 106 kB, je bei 1280 Pixel Breite. Die Qualität bleibt bei 72, tiefer zu gehen deckt den Fehler nur zu. Es braucht die Originale aus dem Bestand.

---

## Rechte

Fotos, Wortmarke und Texte gehören der Fernand Cina SA. Die Partnermarken gehören den jeweiligen Inhaberinnen. Keine Nutzung ausserhalb dieses Anlasses ohne schriftliche Zustimmung.

Porträts und Stimmungsbilder stammen aus dem Bestand der Fernand Cina SA.

Cabinet Grotesk und Switzer stehen unter der Lizenz der Indian Type Foundry und dürfen kommerziell verwendet werden.

---

Stand 3. September 2026 · Yoline AG, Salgesch
