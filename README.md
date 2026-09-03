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
    │   ├── fonts.css             @font-face für Cabinet Grotesk
    │   ├── site.css
    │   ├── anmeldung.css
    │   └── legal.css
    ├── scripts/
    │   ├── site.js
    │   └── anmeldung.js
    └── assets/
        ├── fonts/cabinet-grotesk/
        │   ├── CabinetGrotesk-Thin.woff2 · .woff
        │   ├── CabinetGrotesk-Extralight.woff2 · .woff
        │   ├── CabinetGrotesk-Light.woff2 · .woff
        │   ├── CabinetGrotesk-Regular.woff2 · .woff
        │   ├── CabinetGrotesk-Medium.woff2 · .woff
        │   ├── CabinetGrotesk-Bold.woff2 · .woff
        │   ├── CabinetGrotesk-Extrabold.woff2 · .woff
        │   └── LICENSE               ITF Free Font License 2.0, unverändert
        └── img/
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

## Befehle

```bash
npm install       # einmalig
npm run dev       # Entwicklung auf http://localhost:4321
npm run build     # baut nach dist/
npm run preview   # dist/ lokal prüfen
npm run check     # Typen und Vorlagen prüfen
```

---

## Schriften

Beide Schriften liegen im Repository. Die Seite lädt keine Schrift von einem fremden Server.

| Rolle | Schrift | Woher |
|---|---|---|
| Anzeige, alle Grade ab 20 Pixel | Cabinet Grotesk | `src/assets/fonts/cabinet-grotesk/`, sieben Schnitte als `woff2` mit `woff` als Rückfall |
| Fliesstext und Mikro-Marken | Schibsted Grotesk Variable | `@fontsource-variable/schibsted-grotesk`, Achse `wght` von 400 bis 900 |

**Cabinet Grotesk.** Von der Indian Type Foundry, bezogen über Fontshare. Lizenz ITF Free Font License 2.0, Wortlaut unverändert unter `src/assets/fonts/cabinet-grotesk/LICENSE`. Die sieben `@font-face`-Regeln stehen in `src/styles/fonts.css`, alle unter der Familie `"Cabinet Grotesk"` mit den Gewichten 100 bis 800. Die Seite selbst nutzt 400 und 500, die übrigen Schnitte lädt der Browser nie, weil kein Element sie anfragt.

Eine variable Fassung liegt nicht vor, geprüft an der fehlenden `fvar`-Tabelle in den TTF-Dateien. Deshalb je eine Regel pro Schnitt. `ttf` und `eot` sind entfernt, sie gehören nicht in einen Build.

Die Lizenz verbietet jede Änderung an den Dateien, ausdrücklich auch Teilsätze und Formatwandlung. Die Dateien stammen deshalb unverändert aus dem Paket von Fontshare. Wer Ladezeit sparen will, darf nicht subsetten.

**Schibsted Grotesk.** Unter der SIL Open Font License 1.1, aus dem Paketregister. Eingebunden im Frontmatter von `Base.astro`, `Legal.astro` und `anmeldung.astro`. Der Familienname im CSS lautet `"Schibsted Grotesk Variable"`, nicht `"Schibsted Grotesk"`. Aus dem Paket lädt der Browser zwei Dateien, `latin` und `latin-ext`, je als variable `woff2`. Die Kursivschnitte bleiben ungenutzt.

**Neue Schrift einbauen.** Dateien nach `src/assets/fonts/<name>/`, Lizenz daneben, `@font-face` in `src/styles/fonts.css`. Das Blatt wird von `site.css`, `legal.css` und `anmeldung.css` über `@import` gezogen, damit alle neun Seiten die Schrift haben. Pfade relativ halten, Astro versieht die Dateien beim Bauen mit einer Prüfsumme.

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

## Technik

**Bewegung.** Parallaxe über `animation-timeline: view()` mit JavaScript-Rückfall. Zeilenenthüllung und Bildaufbau über `IntersectionObserver`. Alles schaltet bei `prefers-reduced-motion: reduce` ab.

**Kopfzeile.** Drei Zonen: Wortmarke links, Knopf «Platz sichern» mittig, Burger rechts.
Auf schmalen Schirmen verkürzt der Knopf auf «Anmelden», alle drei Zonen bleiben.
Der Burger öffnet eine vollflächige Überlagerung, die über `clip-path` von oben aufzieht.
`Escape` schliesst, ein Klick auf eine Zeile ebenso. Beim Öffnen erhält `body` ein
`overflow: hidden`, beim Schliessen fällt es weg. Bei `prefers-reduced-motion: reduce`
erscheint die Überlagerung ohne Bewegung. Ohne JavaScript bleibt sie verborgen, die
Unterseiten stehen im Fuss.

**Kontrast auf dem Titelbild.** Der Schleier steht auf `rgba(26,18,12,.32)`, warm statt
neutral. Das Bild trägt Morgenlicht, ein neutralschwarzer Schleier zieht die Wärme heraus.

Gemessen wird am gerenderten Bild: eine Aufnahme mit Text, eine ohne. Die Differenz
ergibt die Maske der Buchstaben. Unter dieser Maske wird die Leuchtdichte auf
Strichbreite gemittelt und die hellste Stelle gegen `var(--paper)` gerechnet.

| Schleier | 1920 | 1440 | 1280 | 390 |
|---|---|---|---|---|
| `rgba(26,18,12,.32)` | 5.71 | 5.35 | 5.29 | 8.26 |
| `rgba(26,18,12,.34)` | 5.93 | 5.56 | 5.49 | 8.48 |
| `rgba(26,18,12,.36)` | 6.17 | 5.80 | 5.72 | 8.75 |
| `rgba(26,18,12,.38)` | 6.34 | 5.95 | 5.88 | 8.87 |
| `rgba(26,18,12,.40)` | 6.60 | 6.20 | 6.13 | 9.15 |

Gesetzt ist `.32`, die niedrigste Stufe, die 4.5 zu 1 hält. Je weniger Schleier, desto
mehr Bild. Der Wert ist gegen drei Fenstergrössen geprüft, 0.10, 0.16 und 0.24 em, und
hält in allen dreien.

Wer das Bild weiter aufhellt oder das Titelbild tauscht, misst neu. Das Bild selbst
abzudunkeln ist der falsche Weg, es war zuvor zu dunkel.

Die Bildbänder tragen keinen Schleier, nur den Filter auf `.band .px img`.

**Karten.** Keine eingebettete Karte. Adresse und Verweise auf Google Maps und den SBB-Fahrplan öffnen extern. Daten fliessen erst beim Klick, so steht es in der Datenschutzerklärung.

**Auszeichnung.** Das Basis-Layout erzeugt Open Graph und Twitter Card für jede Seite. Die Startseite trägt zusätzlich einen `FoodEvent`-Block nach schema.org, gespeist aus `src/data/anlass.ts`.

**Sitemap.** `@astrojs/sitemap` erzeugt beim Bauen `sitemap-index.xml`. Anmeldung und Rechtsseiten sind ausgenommen und tragen `noindex`.

---

## Eckdaten ändern

Preis, Datum, Platzzahl oder Anmeldeschluss stehen ausschliesslich in `src/data/anlass.ts`. Eine Änderung dort wirkt auf alle Seiten, auf die Metadaten und auf den JSON-LD-Block.

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

## Offene Punkte

Jeder Punkt nennt die Ursache und den nächsten Schritt.

1. **Maison 13 Catering.** Firmenname, Rechtsform und Adresse fehlen im Impressum. Ursache: Angaben liegen nicht vor. Nächster Schritt: bei Maison 13 einholen und im Impressum ergänzen.
2. **Eringer.** Die Herkunft des Fleisches ist nicht schriftlich bestätigt, der Name steht mehrfach auf der Seite. Ursache: mündliche Zusage. Nächster Schritt: schriftliche Bestätigung einholen, sonst die Nennung streichen.
3. **Munder Safran.** Die Bezugsquelle ist nicht bestätigt. Ursache: wie oben. Nächster Schritt: Bestätigung einholen.
4. **Zahlungsdienstleister und Hosting.** Beide Namen fehlen in der Datenschutzerklärung. Ursache: Der Zahlungsdienstleister ist noch nicht gewählt, Hosting läuft über Vercel. Nächster Schritt: nach dem Entscheid beide Namen unter Ziffer 4 eintragen.
5. **Juristische Prüfung.** AGB, Teilnahmebedingungen, Impressum und Datenschutzerklärung sind nach bestem Wissen erstellt, jedoch nicht anwaltlich geprüft. Ursache: keine Prüfung beauftragt. Nächster Schritt: Prüfung vor dem Aufschalten der Anmeldung.
6. **Französisch.** Salgesch liegt an der Sprachgrenze, eine französische Fassung fehlt. Ursache: offener Entscheid. Nächster Schritt: entscheiden, ob eine Fassung nötig ist, danach `astro-i18n` prüfen.
7. **Wortmarke.** Die SVG-Datei ist nachgezeichnet, die Konturen sind ab etwa 900 Pixel Breite sichtbar treppig. Ursache: kein Original aus der Schrift. Nächster Schritt: Für Druck ab A2 die Marke aus der Originalschrift setzen.
8. **Schriftdateien in einem öffentlichen Repository.** Die `woff2`-Dateien liegen in einem öffentlichen Repository und sind damit für jeden herunterladbar. Ursache: Abschnitt 02 der ITF Free Font License nennt «repository» und «publicly accessible servers» unter den untersagten Wegen der Weitergabe. Derselbe Abschnitt erlaubt im Schlusssatz das Selbsthosten für die eigene Website, was die Auslieferung über `im-stah.ch` deckt. Die Kopie im Repository ist davon nicht erfasst. Nächster Schritt: entweder eine schriftliche Bestätigung der Indian Type Foundry einholen, oder das Repository auf privat stellen, oder die Schriftdateien aus der Versionsverwaltung nehmen und beim Bauen zuliefern.
9. **Titelbild aus einem Bildschirmfoto.** `clos-morgenlicht.jpg` ist eine Bildschirmaufnahme, 1782 mal 970 Pixel. Sie liefert 960, 1440 und 1782 Pixel Breite, die angefragten 2000 fehlen. Ursache: Das Original liegt nicht vor, ein Bildschirmfoto trägt bereits eine Kompression, die zweite kommt beim Umrechnen dazu. Nächster Schritt: Aufnahme aus dem Bestand der Fernand Cina SA ab 2000 Pixel Breite holen, danach den Schleier neu messen.
10. **Mehrfach komprimierte Bänder.** `rebhaus-drohne.jpg` und `rebberg.jpg` wachsen beim Umrechnen auf WebP: 262 gegen 185 kB und 140 gegen 106 kB, je bei 1280 Pixel Breite. Ursache: Die Vorlagen sind bereits stark komprimiert. Nächster Schritt: Originale aus dem Bestand holen. Die Qualität bleibt bei 72, tiefer zu gehen deckt die Ursache nur zu.

---

## Rechte

Fotos, Wortmarke und Texte gehören der Fernand Cina SA. Die Partnermarken gehören den jeweiligen Inhaberinnen. Keine Nutzung ausserhalb dieses Anlasses ohne schriftliche Zustimmung.

Porträts und Stimmungsbilder stammen aus dem Bestand der Fernand Cina SA.

**Cabinet Grotesk.** Copyright © 2026 Indian Type Foundry, alle Rechte vorbehalten. Lizenz: ITF Free Font License (FFL), Version 2.0 vom 17. August 2026. Der Wortlaut liegt unverändert unter `src/assets/fonts/cabinet-grotesk/LICENSE`. Kommerzielle Nutzung ist erlaubt, ebenso das Selbsthosten. Änderungen an den Dateien sind untersagt, Weitergabe an Dritte ebenso. Ein Urhebervermerk ist nicht verlangt, er steht dennoch in `src/styles/fonts.css`.

**Schibsted Grotesk.** Copyright 2023 The Schibsted-Grotesk Project Authors. Lizenz: SIL Open Font License, Version 1.1. Kommerzielle Nutzung und Weitergabe sind erlaubt. Bezogen über `@fontsource-variable/schibsted-grotesk`, der Wortlaut liegt im Paket unter `node_modules/@fontsource-variable/schibsted-grotesk/LICENSE`.

**Switzer wird nicht mehr verwendet.** Für den Fliesstext steht Schibsted Grotesk. Eine Lizenz für Switzer liegt nicht vor.

---

Stand 3. September 2026 · Yoline AG, Salgesch
