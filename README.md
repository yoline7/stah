# z'Wallis im Stah

Website zum Anlass vom 19. September 2026 im Clos du Cornalin über Salgesch.

Sieben Weine, sechs Gänge, Musik den ganzen Tag. CHF 145.00 pro Person, 50 Plätze.

Dreisprachig: Deutsch, Französisch, Englisch. Deutsch ist die Grundfassung und bei
den Rechtstexten die verbindliche.

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

Astro, statischer Export. Gewählt wegen vier Punkten:

1. **Eine Quelle für die Eckdaten.** Datum, Preis, Plätze und Anmeldeschluss stehen in `src/data/anlass.ts`.
2. **Eine Quelle je Sprache.** Die Texte liegen in `src/i18n/de.ts`, `fr.ts` und `en.ts`. Die Seiten holen sie über `t(lang)`.
3. **Kopf, Fuss und Partnerband einmal.** Als Bausteine, nicht 27-mal kopiert.
4. **Bilder und Sitemap automatisch.** Astro rechnet Bilder um, versieht sie mit Prüfsummen und erzeugt die Sitemap beim Bauen.

Kein Framework im Auslieferungsergebnis. Der Build erzeugt reines HTML, CSS und JavaScript.

---

## Gliederung

27 Seiten, neun je Sprache. Die Seitennamen sind mitübersetzt.

| Kennung | Deutsch | Français | English | Verzeichnis |
|---|---|---|---|---|
| `start` | `/` | `/fr/` | `/en/` | ja |
| `kulinarik` | `/kulinarik` | `/fr/gastronomie` | `/en/food` | ja |
| `wein` | `/wein` | `/fr/vin` | `/en/wine` | ja |
| `organisation` | `/organisation` | `/fr/infos-pratiques` | `/en/practical` | ja |
| `anmeldung` | `/anmeldung` | `/fr/inscription` | `/en/booking` | nein, `noindex` |
| `agb` | `/agb` | `/fr/conditions-generales` | `/en/terms` | nein, `noindex` |
| `teilnahme` | `/teilnahmebedingungen` | `/fr/conditions-participation` | `/en/participation` | nein, `noindex` |
| `impressum` | `/impressum` | `/fr/mentions-legales` | `/en/imprint` | nein, `noindex` |
| `datenschutz` | `/datenschutz` | `/fr/protection-des-donnees` | `/en/privacy` | nein, `noindex` |

Die Wegtabelle steht einmal, in `src/i18n/sprachen.ts` unter `wege`. Kopf, Fuss, Umschalter,
`hreflang` und die Sitemap ziehen ihre Adressen von dort. Ein neuer Seitenname wird
dort geändert, nicht in den Seiten.

Deutsch läuft ohne Präfix, die Wurzel gehört ihr. Franz&ouml;sisch und Englisch liegen
unter `/fr/` und `/en/`.

---

## Sprachen

**Einstellung.** `astro.config.mjs`:

```js
i18n: { defaultLocale: 'de', locales: ['de','fr','en'],
        routing: { prefixDefaultLocale: false } }
```

**Wörterbücher.** `src/i18n/de.ts`, `fr.ts` und `en.ts` tragen alle Texte der fünf
Inhaltsseiten, dazu Kopf, Fuss, Metadaten, Bildbeschreibungen und das Anmeldeformular. `de.ts` ist die
Vorlage, `Texte = typeof de` erzwingt beim Prüflauf, dass keine Fassung einen Eintrag
verliert.

**Seiten.** Die fünf Inhaltsseiten stehen einmal als Baustein unter `src/ansichten/` und
nehmen `lang` als Eigenschaft. Die 15 Dateien unter `src/pages/` sind vier Zeilen lang
und reichen nur die Sprache durch.

**Rechtstexte.** Die zwölf Rechtsseiten stehen je Sprache als eigene Datei. Begründung
unter «Bewusste Abweichungen».

**Kopfangaben je Seite.** `lang` am `<html>`, `canonical`, vier `link rel="alternate"`
(drei Sprachen plus `x-default` auf Deutsch), `og:locale` und `og:locale:alternate`.
Der JSON-LD-Block steht nur einmal, auf der deutschen Startseite.

| Sprache | `lang` | `og:locale` |
|---|---|---|
| Deutsch | `de-CH` | `de_CH` |
| Französisch | `fr-CH` | `fr_CH` |
| Englisch | `en` | `en` |

**Umschalter.** `DE · FR · EN` rechts neben dem Burger. Er zeigt immer dieselbe Seite in
der anderen Sprache, nicht die Startseite. Unter 720 Pixel Breite wandert er in die
Menüüberlagerung, damit die Kopfleiste eng bleibt. Auf den Rechtsseiten und in der
Anmeldung steht er neben «Zurück zum Anlass».

**Sitemap.** `@astrojs/sitemap` mit eigener `serialize`-Funktion. Die Alternativen werden
aus derselben Wegtabelle gebaut, weil die Seitennamen übersetzt sind und die eingebaute
`i18n`-Option gleiche Namen voraussetzt. Aufgenommen sind die zwölf Seiten mit
Verzeichniseintrag, die 15 mit `noindex` bleiben draussen.

**Sprache im Formular.** Das Feld «Sprache» steht auf der Sprache der Seite. Auf
`/fr/inscription` ist Französisch vorgewählt, auf `/en/booking` Englisch.

**Neue Sprache aufnehmen.** Kürzel in `sprachen` (`src/i18n/sprachen.ts`), Spalte in `wege`,
Eintrag in `kuerzel`, Wörterbuch `src/i18n/<kürzel>.ts` nach dem Muster von `de.ts`,
fünf Routendateien unter `src/pages/<kürzel>/`, vier Rechtsseiten. Der Prüflauf nennt
jeden fehlenden Eintrag.

---

## Aufbau

Je Ordner eine Zeile: was hineingehört und was nicht.

```
im-stah/
├── .gitignore · astro.config.mjs · package.json · package-lock.json
├── tsconfig.json · README.md
├── content/                Archiv. Quelltexte, die die Seite nicht mehr speisen
│   └── archiv-2026-09/     erster Textauftrag, nur Deutsch, mit eigenem README
├── docs/                   Arbeitsdokumente. Belegen Zahlen und Entscheide,
│                           speisen keine Seite, laufen nicht im Build
├── pruef/                  Prüfskripte. Die Zahlen der Berichte, nicht im Build
├── public/                 wird unverändert ausgeliefert, ohne Prüfsumme im Namen
└── src/
    ├── assets/
    │   ├── fonts/          je Schrift ein Ordner, nur woff2, Lizenz daneben
    │   └── img/            Fotos für astro:assets, partner/ für Partnermarken
    ├── components/         Bausteine unter einer Seite, logos/ für Vektormarken
    ├── data/               sprachneutrale Fakten, eine Datei je Gegenstand
    ├── i18n/               Wörterbücher je Sprache und die Wegtabelle
    ├── layouts/            Seitengerüste, Kopf bis Fuss
    ├── ansichten/          ganze Seiten als Baustein, recht/ je Sprache
    ├── pages/              nur Adressen, je Datei vier Zeilen
    ├── scripts/            Browserskripte, kein Modul, kein Bündler
    └── styles/             ein Blatt je Gerüst, fonts.css für alle
```

**Was wohin gehört**

| Ordner | gehört hinein | gehört nicht hinein |
|---|---|---|
| `content/` | Nachweis der Herkunft von Text | Text, der eine Seite speist |
| `docs/` | Verfahren, Messreihen, Übergaben | Anleitung zum Bauen, die steht hier |
| `pruef/` | Messskripte | Erzeugnisse, siehe `pruef/.gitignore` |
| `public/` | `robots.txt`, `favicon.svg`, `preview.jpg` | Bilder, die über `astro:assets` laufen |
| `src/assets/fonts/` | `woff2` und `LICENSE` | `ttf`, `otf`, `woff`, Einzelschnitte neben einer variablen Fassung |
| `src/assets/img/` | jedes Bild genau einmal | Bilder ohne Einbindung |
| `src/components/` | Bausteine, die in eine Seite gehen | ganze Seiten |
| `src/data/` | Zahlen, Daten, Preise, Strukturlisten | Text in einer Sprache |
| `src/i18n/` | jeder sichtbare Text, je Sprache | Zahlen, die aus `data/` kommen |
| `src/ansichten/` | eine Ansicht je Seite, `lang` als Eigenschaft | Routen |
| `src/pages/` | Import und Aufruf einer Ansicht | Inhalt, Prosa, Auszeichnung |

**Der ganze Baum mit Dateinamen und Grössen** entsteht mit
`find . -type d \( -name node_modules -o -name dist -o -name .astro \) -prune -o -type f -print`.

Der Build legt die Startseite als `index.html` ab, die 26 Unterseiten je als Ordner
mit `index.html`.

---

## Benennung

Ein Muster im ganzen Repository, nicht drei.

| Was | Muster | Beispiel |
|---|---|---|
| Astro-Bausteine | Grossbuchstabe, ohne Trenner | `Header.astro`, `Start.astro` |
| Astro-Routen | klein, mit Bindestrich | `infos-pratiques.astro` |
| Stile und Skripte | klein, ohne Trenner | `site.css`, `anmeldung.js` |
| Bilder | klein, mit Bindestrich, sprechend | `clos-du-cornalin.jpg` |
| Wörterbücher | Sprachkürzel | `de.ts`, `fr.ts`, `en.ts` |
| Dokumente in `docs/` | Referenz, dann Titel | `YL-FC-2026-010_Bewegung.md` |

**Zwei Ausnahmen, beide begründet.**

`src/pages/` trägt den Namen nicht aus Wahl. Astro leitet daraus die Adressen ab.

Die Schriftdateien behalten die Schreibweise der Foundry, etwa
`CabinetGrotesk-Bold.woff2`. Die Lizenz verbietet jede Änderung an den Dateien,
und ein Dateiname gehört dazu.

**Jeder Bildname ist eine Adresse.** Astro versieht ihn beim Bauen mit einer
Prüfsumme. Wer ein Bild umbenennt, ändert die Adresse jeder umgerechneten Fassung.

---

## Arbeitsweise

**Ein Weg, keine Nebenstrecke.** Entwicklung auf einem Branch, Merge nach `main`
als Squash, Vercel baut aus `main`.

1. **Nach jedem Merge auf Inhaltsgleichheit prüfen.** `git diff origin/main HEAD`
   muss leer sein. Ein Squash-Merge gegen einen veralteten Kopf lässt sonst
   Commits liegen, geschehen bei PR #1.
2. **Nach jedem Squash-Merge den lokalen Branch löschen, nicht zurücksetzen.**
   Ein zurückgesetzter Branch weicht vom Fernstand ab und braucht einen
   Force-Push. Ein gelöschter Branch erzeugt die Lage nicht.
3. **Kein Force-Push,** ausser der Fernstand trägt nur bereits gemergte Geschichte.
   Das ist vorher zu belegen, mit `git diff origin/<branch> origin/main`.
4. **Jede Zahl wird gemessen, nicht geschätzt.** Die Skripte liegen in `pruef/`,
   das Verfahren in `docs/`.
5. **Vor dem Umbau der Struktur eine Bestandsaufnahme.** Erst Liste, dann
   verschieben. Nichts wird auf Verdacht gelöscht.
6. **Fernbranches werden über die GitHub-Oberfläche gelöscht.** Die Zugangsdaten
   einer Claude-Code-Sitzung dürfen keine Referenzen löschen, `git push --delete`
   endet mit HTTP 403. Belegt am 3. und am 4. September 2026.

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

## Texte

**Die Quelle sind die drei Wörterbücher unter `src/i18n/`.** Wer Text ändert, ändert
das Wörterbuch. `de.ts` ist die Vorlage, `Texte = typeof de` erzwingt beim Prüflauf,
dass keine Fassung einen Eintrag verliert.

`content/archiv-2026-09/` trägt die deutschen Quelltexte des ersten Textauftrags vom
3. September 2026. Sie speisen die Website nicht mehr, sie belegen die Herkunft.
Für Französisch und Englisch hat dort nie ein Quelltext existiert, beide entstanden
direkt in den Wörterbüchern.

| Archivdatei | Deckte |
|---|---|
| `index.md` | Titel, Der Anlass, Der Auftakt, Die zwei, Der Tag, Ab vierzehn Uhr, Der Ort, Abschluss |
| `kulinarik.md` | Kopf, Sechs Gänge, Die Wahl, Der Koch, Aus dem Wallis, Aufruf |
| `wein.md` | Kopf, Die Begleitung, Das Weingut, Die Weinbegleitung, Aufruf |
| `organisation.md` | Kopf, Der Tag, Durch den Tag, Anfahrt, Gut zu wissen, Fragen, Kontakt, Aufruf |

`content/` wird nicht gebaut. Astro liest ausschliesslich `src/`.

**Was nie aus einem Quelltext kam.** Die Bildunterschriften der Bänder, die drei
Pfeilzeilen unter «Mehr dazu», das Laufband, die Bildbeschreibungen, die Anmeldung
und die zwölf Rechtsseiten.

**Zahlen führen aus der Datendatei.** Steht in einem Text eine Zahl, ein Datum oder
ein Preis, gilt `src/data/anlass.ts`. Datum und Uhrzeit stehen zusätzlich je Sprache
im Wörterbuch, weil die Schreibweise sich unterscheidet: «19. September 2026»,
«19 septembre 2026», «19 September 2026».

**Übersetzung.** Französisch duzt, Englisch nutzt «you». Eigennamen bleiben stehen:
Clos du Cornalin, Fernand Cina, Maison 13, BergBox, Salgesch, z'Wallis im Stah. Wo ein
Name ausserhalb des Wallis unbekannt ist, trägt die Übersetzung eine kurze Erklärung,
etwa «la parcelle de vigne au-dessus de Salgesch» oder «the only saffron village in
Switzerland».

**Gesperrte Wörter.** «Beats», «Vibes» und «Atmosphäre» kommen im Build nicht vor,
in keiner Sprache. Die Musik heisst Musik.

---

## Schriften

Beide Schriften liegen im Repository. Die Seite lädt keine Schrift von einem fremden
Server. `fontshare` kommt im Build nicht vor.

| Rolle | Schrift | Woher |
|---|---|---|
| Anzeige, alle Grade ab 20 Pixel | Cabinet Grotesk | `src/assets/fonts/cabinet-grotesk/`, sieben Schnitte als `woff2` |
| Fliesstext und Mikro-Marken | Switzer | `src/assets/fonts/switzer/`, variabel, Achse `wght` von 100 bis 900, aufrecht und kursiv |

**Switzer.** Von der Indian Type Foundry. Eingebaut sind zwei Dateien, `Switzer-Variable.woff2`
und `Switzer-VariableItalic.woff2`. Die 96 einzelnen Schnitte aus dem Paket sind entfernt,
die variable Fassung deckt jedes Gewicht ab. Familienname im CSS: `"Switzer"`.

**Cabinet Grotesk.** Von der Indian Type Foundry. Die sieben `@font-face`-Regeln stehen in
`src/styles/fonts.css`, alle unter der Familie `"Cabinet Grotesk"` mit den Gewichten 100
bis 800. Die Seite selbst nutzt 400 und 500, die übrigen Schnitte lädt der Browser nie,
weil kein Element sie anfragt. Eine variable Fassung liegt nicht vor, geprüft an der
fehlenden `fvar`-Tabelle. `ttf` und `eot` sind entfernt, sie gehören nicht in einen Build.

Der `woff`-Rückfall ist am 4. September 2026 entfernt, sieben Dateien und 192 KB.
Jeder Browser mit Unterstützung für `@font-face` liest seit 2016 `woff2`.

**Keine Änderung an den Dateien.** Die Lizenz verbietet jede Änderung, ausdrücklich auch
Teilsätze und Formatwandlung. Beide Schriften liegen unverändert aus dem Paket der Indian
Type Foundry. Wer Ladezeit sparen will, darf nicht subsetten.

**Einbindung.** `src/styles/fonts.css` wird von `site.css`, `legal.css` und `anmeldung.css`
über `@import` gezogen. Die Rechtsseiten und die Anmeldung laden `site.css` nicht, ohne den
`@import` stünden sie ohne Schrift da.

**Neue Schrift einbauen.** Dateien nach `src/assets/fonts/<name>/`, Lizenz daneben,
`@font-face` in `src/styles/fonts.css`. Pfade relativ halten, Astro versieht die Dateien
beim Bauen mit einer Prüfsumme.

---

## Bilder

Jedes Bild steht genau einmal, die beiden Porträts zweimal. Alle 27 Seiten ziehen aus
demselben Bestand, die Sprache ändert an den Bildern nichts.

| Bild | Seite | Stelle |
|---|---|---|
| `clos-morgenlicht.jpg` | Start | Titelbild |
| `stimmung-messer.jpg` | Start | Bildband nach «Die zwei» |
| `rebberg.jpg` | Start | Bildband vor dem Abschluss |
| `clos-du-cornalin.jpg` | Kulinarik | Bildband nach dem Menü |
| `rebhaus-drohne.jpg` | Wein | Bildband nach der Begleitung |
| `team.jpg` | Organisation | Bildband nach dem Ablauf |
| `alisha-cina.jpg` | Start, Wein | Porträt |
| `alain-lerjen.jpg` | Start, Kulinarik | Porträt |

**Umrechnung.** Alles läuft über `astro:assets`. Astro erzeugt die Grössen beim Bauen und
legt sie mit Prüfsumme nach `dist/_astro/`.

| Bildart | Breiten | Qualität | Laden |
|---|---|---|---|
| Titelbild | 960, 1440, 2000 | 72 | `eager`, `fetchpriority="high"` |
| Bildbänder | 960, 1440, 2000 | 72 | `lazy` |
| Porträts | 480, 760, 1000 | 80 | `lazy` |
| Partnermarken | keine Umrechnung | | `lazy` |

Format ist `webp`. Astro rechnet nie hinauf. Partnermarken bleiben PNG mit Alphakanal und
tragen `densities={[1]}`, damit `srcset` gesetzt ist, ohne dass umgerechnet wird.

**Bildbeschreibungen.** Jedes `alt` steht in den drei Wörterbüchern unter `bilder`, je Bild
ein Schlüssel. Im Quelltext steht kein festes `alt` mehr, nur `alt={w.bilder.<schluessel>}`.
Die Beschreibung nennt, was zu sehen ist, und wiederholt weder Titel noch Bildunterschrift.
Im Build tragen alle drei Sprachen je 18 `alt`, zusammen 54.

**Neues Bild einsetzen.** Datei nach `src/assets/img/`, im Frontmatter des Bausteins unter
`src/ansichten/` importieren, im Rumpf über `<Image>` einsetzen. Das `<img>` bleibt im
`<div class="px">`, sonst hält die Parallaxe nicht. Jedes Bild braucht einen Schlüssel unter
`bilder` in allen drei Wörterbüchern, sonst hält der Prüflauf an.

---

## Bewegung

Ein Taktgeber führt alle Bewegungen: Farbpuls, Neonwolken, Kantenlauf, Zahlenwelle,
Laufbandspur, Knöpfe, Zeiger, Seitenübergang. Nie laufen zwei gleichzeitig.

**Der ganze Abschnitt mit allen gemessenen Werten liegt in
[`docs/YL-FC-2026-010_Bewegung.md`](docs/YL-FC-2026-010_Bewegung.md).**
Wer eine Bewegung ändert, misst dort neu und trägt den Wert nach.

---

## Schleier über dem Titelbild

`.hero .veil` liegt bei `rgba(26,18,12,.36)`. Der Wert ist gemessen, nicht geschätzt.
Er ist die niedrigste Stufe, die über drei Sprachen und vier Breiten 4.5 zu 1 trägt,
kleinster Wert 4.53 zu 1 im ungünstigsten Bild der Wolkenbewegung.

**Verfahren und Messreihe liegen in
[`docs/YL-FC-2026-011_Schleier.md`](docs/YL-FC-2026-011_Schleier.md).**
Wer die Titelzeile ändert, misst neu.

---

## Bewusste Abweichungen

**1 · Verläufe und Schein, gesetzt am 3. September 2026 auf Weisung des Auftraggebers.**
Die Gestaltungs-Doktrin von Yoline sperrt Verläufe und Schein. Für `im-stah.ch` ist die
Sperre aufgehoben. Gedeckt sind: `conic-gradient` als Kantenlauf, `linear-gradient` als
waagrechter Lauf auf der Hairline, `background-clip: text` für Zahlenwelle und Spur.
Gesperrt bleiben: Verlauf auf einer Fläche, Schein nach aussen, Schlagschatten, Milchglas,
Radius über 8 Pixel.

**2 · Buntfarbe.** Der frühere Vermerk sperrte Buntfarbe als Akzent. Mit dem Auftrag vom
3. September 2026 ist Farbe an fünf genau benannten Stellen zugelassen, siehe «Bewegung».
Ausserhalb dieser fünf Stellen bleibt die Seite unbunt.

**3 · Rechtstexte als Ansicht je Sprache, nicht als Wörterbuch.** Die vier Rechtstexte
stehen je Sprache als eigene Datei unter `src/ansichten/recht/<sprache>/`, nicht als
Einträge im Wörterbuch. Grund: Fliesstext mit Nummerierung, Zwischentiteln, Listen und
Definitionslisten wird in einer Schlüssel-Wert-Liste unlesbar und fehleranfällig. Die
fünf Inhaltsseiten stehen umgekehrt einmal als Baustein, weil sie aus vielen kurzen,
gleich gebauten Feldern bestehen.

Bis zum 4. September 2026 lag diese Prosa in den Routendateien. Damit trugen zwölf
Routen 58 bis 128 Zeilen. Jetzt tragen alle 27 vier Zeilen.

**4 · Laufbandspur über die Punkte, nicht durch die Buchstaben.** Vorgesehen war dieselbe
Machart wie bei den Zahlen. Gemessen im Browser trägt sie dort nicht: `background-clip: text`
auf `.tick` schneidet den Verlauf nicht auf die Schrift der Nachfahren zu, weil das Band eine
eigene Zeichenebene führt. Die Spur läuft deshalb über die Trennpunkte. Dauer und Richtung
sind unverändert.

**5 · Wolken kleiner und ohne Mischmodus, gemessen erzwungen.** Vorgesehen waren
`clamp(420px, 78vw, 1100px)`, `mix-blend-mode: screen` auf der Wolke und
`mix-blend-mode: overlay` mit Deckung 0.04 auf dem Korn. Mit diesen Werten hält die
Bildrate beim Rollen über die dunkle Passage nur 33.7 Bilder je Sekunde bei 1440 und
23.3 bei 1920. Gesetzt sind deshalb `clamp(320px, 52vw, 640px)`, Mischmodus `normal`
auf der Wolke und `normal` mit Deckung 0.05 auf dem Korn. Damit hält die Bildrate 60.3
bei 1440 und 59.7 bei 1920.

Die Messreihe, 1440 mal 900, drei Sekunden, je eine Änderung gegenüber der Vorgabe:

| Zustand | Bilder je Sekunde |
|---|---|
| ohne Wolken | 60.3 |
| Vorgabe, drei Wolken, 78vw, Korn overlay | 33.7 |
| Korn auf normal | 38.2 |
| ohne Korn | 42.7 |
| 52vw und Korn normal | 44.2 |
| 52vw, Korn normal, Wolke normal | 60.4 |

Der Verlust an Wirkung ist gering: auf nahezu schwarzem Grund liegt `screen` ohnehin
fast auf `normal`, und die kleinere Wolke hängt jetzt über die Kante hinaus, damit sie
weiter als Licht von aussen liest. Anzahl, Dauer, Töne und Deckkraft bleiben wie gesetzt.
Die Reihenfolge der Vorgabe, zuerst Anzahl, dann Grösse, zuletzt Deckkraft, wurde
geprüft: die Anzahl zu senken bringt nur 36.8, die Grösse dagegen den Sprung.

**6 · Korn liegt unter dem Text, nicht darüber.** Vorgesehen war `z-index:1` auf einer
eigenen Klasse. Gesetzt ist `.wolken::after`, also innerhalb der Wolkenschicht. Bei
Deckung 0.05 ist der Unterschied im Bild nicht zu sehen, der Text kann so aber unter
keinen Umständen bedeckt werden.

**7 · Mikro-Marken auf dunklem Grund aufgehellt.** Beim Messen der bewolkten Flächen
fielen zwei Stellen auf, die schon vorher zu schwach waren: `.weg .mono` und `.mono.sec`
im Partnerband standen auf `--sec-light` und hielten auf dunklem Grund nur 3.66 und
3.90 zu 1. Sie tragen jetzt `--sec-dark` und halten 7.67 zu 1. Das ist eine Korrektur,
keine Abweichung.

**8 · Sitemap ohne die eingebaute i18n-Option.** `@astrojs/sitemap` verknüpft Sprachfassungen
über gleiche Seitennamen. Die Seitennamen sind hier übersetzt, deshalb baut eine eigene
`serialize`-Funktion die Alternativen aus der Wegtabelle.

**9 · Ein Anmeldeschluss, zwei Wirkungen.** AGB Ziffer 6.1 nannte fest den 13. September.
Der Anmeldeschluss steht seit dem 3. September auf dem 15. September. Die Ziffer rechnet den
Tag danach jetzt aus `src/data/anlass.ts` aus.

---

## Feldtabelle Anmeldung

`src/ansichten/Anmeldung.astro` ist ein Entwurf. Die produktive Anmeldung läuft über
YoSuite. Die Beschriftungen kommen je Sprache aus `src/i18n/<sprache>.ts` unter `anmeldung`.

**Felder, Kennungen und Regeln liegen in
[`docs/YL-FC-2026-012_Feldtabelle-Anmeldung.md`](docs/YL-FC-2026-012_Feldtabelle-Anmeldung.md).**

---

## Eckdaten ändern

Preis, Datum, Platzzahl oder Anmeldeschluss stehen ausschliesslich in `src/data/anlass.ts`.
Eine Änderung dort wirkt auf alle 27 Seiten, auf die Metadaten und auf den JSON-LD-Block.
Die sprachabhängige Schreibweise von Datum und Uhrzeit steht zusätzlich in den drei
Wörterbüchern und wird dort mitgeführt.

---

## Inhaltliche Regeln

- Anrede durchgehend du, im Französischen tu, im Englischen you
- Schweizer Rechtschreibung, ss statt scharfem S, echte Umlaute
- Kein Gedankenstrich
- Beträge als CHF 145.00, ab vier Stellen mit Apostroph
- Auszeichnungen nur mit Wettbewerb, Ort und Jahr
- Gesperrt: Beats, Vibes, Atmosphäre, einzigartig, unvergesslich, aussergewöhnlich, leidenschaftlich, kulinarische Reise, Location, Event

---

## Sichtbarkeit

Grundlage sind zwei Dokumente unter `docs/`. `YL-SGU-2026-001` hält die Methodik fest,
`YL-SGU-2026-002` den Schema-Plan mit Quelle und Datum je Angabe. Beide sind am
4. September 2026 eingereicht. Wer eine Angabe in der Auszeichnung ändert, ändert sie
zuerst dort.

**Verzeichnis oder nicht.** Zwölf Seiten gehören ins Verzeichnis, vier je Sprache:
Startseite, Kulinarik, Wein, Organisation. Fünfzehn Seiten tragen `noindex`, also die
Anmeldung und die zwölf Rechtsseiten. Die Steuerung sitzt in der Seitenkopfzeile, nicht in
`robots.txt`. `robots.txt` sperrt keinen Weg, sonst könnte eine Suchmaschine den Vermerk
nie lesen.

**Ein Graph je Seite.** Jede der zwölf Seiten trägt genau einen Block
`application/ld+json` mit einem `@graph`. Zehn Entitäten stehen in jedem Graphen, gebaut in
`src/data/schema.ts`. Sie sind sprachneutral, jede trägt ihre Kennung auf
`https://im-stah.ch/`, niemals auf einer Vorschauadresse.

| Kennung | Typ | Gegenstand |
|---|---|---|
| `#website` | `WebSite` | die Website des Anlasses, drei Sprachen |
| `#fernand-cina` | `Organization`, `Winery` | Fernand Cina SA, Salgesch, gegründet 1956 |
| `#soulfood` | `Organization` | Soulfood by Alain GmbH, Zermatt |
| `#maison-13` | `Organization` | Maison 13 GmbH, Visp |
| `#bergbox` | `Organization` | BergBox GmbH, Visp |
| `#yoline` | `Organization` | Yoline AG, Salgesch, Umsetzung |
| `#alisha-cina` | `Person` | Winzerin und Weintechnologin |
| `#alain-lerjen` | `Person` | Koch |
| `#clos-du-cornalin` | `Place` | Rebbergparzelle oberhalb von Salgesch |
| `#kellerei` | `Place` | Kellerei Fernand Cina |

Eine Kennung mit weiteren Feldern ist die Festlegung, eine Kennung allein ist der Verweis.
Jede Kennung wird je Seite genau einmal festgelegt, jeder Verweis findet sein Ziel.
`src/data/graph.ts` baut daraus den Graphen je Seite und trägt selbst keinen Text, die
Sprache kommt als Argument aus `src/layouts/Base.astro`.

**Was je Seitenart dazukommt.**

| Seite | Zusätzlich |
|---|---|
| Startseite | `WebPage`, `FoodEvent` `#anlass` mit `location`, `organizer`, `performer`, `sponsor` als Verweis, dazu `Offer` `#ticket` |
| Kulinarik | `WebPage`, `BreadcrumbList`, Hauptsache `#alain-lerjen` |
| Wein | `WebPage`, `BreadcrumbList`, Hauptsache `#alisha-cina` |
| Organisation | `WebPage`, `BreadcrumbList`, `FAQPage` mit elf Fragen |
| Anmeldung, Rechtsseiten | nichts, die Seiten tragen `noindex` |

Der `FoodEvent` steht in allen drei Sprachen, jeweils mit `inLanguage` und mit einer
`offers.url` in derselben Sprache. `validFrom` bleibt aus, für den Verkaufsstart liegt kein
Datum vor. Die `FAQPage` wird aus dem sichtbaren Fragenblock erzeugt, Wort für Wort aus dem
Wörterbuch. Elf Fragen je Sprache, keine Frage steht in der Auszeichnung, die nicht auf der
Seite steht.

**Was bewusst fehlt.** `HowTo` und `AggregateRating` sind nicht ausgezeichnet, die
zugehörigen Darstellungen in der Suche sind eingestellt. `Menu` bleibt aus, das Menü des
Anlasses ist keine dauerhafte Karte. `Review` bleibt aus, es liegt keine Bewertung vor.
`LocalBusiness` bleibt aus, der Anlass ist kein Ladengeschäft mit Öffnungszeiten. `geo`
liegt in `src/data/schema.ts` vorbereitet und ausgeklammert, die Koordinaten fehlen.

**Prüfen.** Die Struktur wird örtlich geprüft: je Seite die Zahl der Festlegungen und der
Verweise, jede Kennung genau einmal festgelegt, kein Verweis ohne Ziel, keine Kennung
ausserhalb von `https://im-stah.ch/`. Der Rich-Results-Test von Google und der Validator
von schema.org laufen von aussen, aus der Arbeitsumgebung sind beide Adressen gesperrt.
Sie gehören vor dem Aufschalten von einem Arbeitsplatz mit freiem Zugang gefahren.

---

## Veröffentlichen

Vercel, Projekt `stah`. Ein Weg, keine Nebenstrecke. Astro wird erkannt,
Build `npm run build`, Ausgabeordner `dist`.

| Was | Adresse |
|---|---|
| Produktion, Branch `main` | https://stah-yoline7s-projects.vercel.app |
| Vorschau, dieser Branch | https://stah-git-claude-astro-repo-restructure-6pqpq1-yoline7s-projects.vercel.app |
| Zieldomain, noch nicht aufgeschaltet | https://im-stah.ch |

Vercel baut bei jedem Push. `main` geht in die Produktion, jeder andere Branch bekommt eine
eigene Vorschauadresse.

**Zugriff.** Im Projekt steht die Vercel-Authentifizierung auf «all except custom domains».
Beide `vercel.app`-Adressen verlangen deshalb einen Login im Team `yoline7's projects`.
Offen erreichbar wird die Seite erst über die eigene Domain.

Die Zieldomain steht in `astro.config.mjs` unter `site`. Sie steuert Canonical, Open Graph,
`hreflang` und Sitemap, unabhängig davon, unter welcher Adresse Vercel ausliefert.

### Beim Aufschalten von im-stah.ch prüfen

Vercel setzt auf jeder `.vercel.app`-Adresse den Kopf `x-robots-tag: noindex`. Auf einer
eigenen Domain setzt Vercel ihn nicht. Solange die Zieldomain fehlt, ist die Seite
deshalb für Suchmaschinen unsichtbar, und das ist richtig so.

Beim Aufschalten der Domain der Reihe nach prüfen:

1. **Domain hinterlegen.** Im Vercel-Projekt `stah` unter Settings, Domains.
2. **Kopf abfragen.** `curl -I https://im-stah.ch/` darf kein `x-robots-tag` mehr tragen. Dasselbe für `/fr/` und `/en/`.
3. **Zugriffsschutz.** Die Vercel-Authentifizierung steht auf «all except custom domains», die eigene Domain ist damit offen. Prüfen, dass `https://im-stah.ch/` ohne Login antwortet.
4. **Indexierbar bleiben zwölf Seiten.** Start, Kulinarik, Wein und Organisation, je in drei Sprachen. Sie tragen kein `noindex`.
5. **Auf `noindex` bleiben 15 Seiten.** Anmeldung und die vier Rechtstexte, je in drei Sprachen. Das `noindex` steht in `src/layouts/Legal.astro` und `src/ansichten/Anmeldung.astro`.
6. **`robots.txt` trägt kein `Disallow`.** Eine gesperrte Seite wird nicht gelesen, also wird ihr `noindex` nie gesehen. Die Sperre gehört auf die Seite, nicht in `robots.txt`.
7. **Sitemap abrufen.** `https://im-stah.ch/sitemap-index.xml` muss zwölf Adressen führen, jede mit drei `hreflang`-Alternativen.
8. **Search Console.** Domain aufnehmen, Sitemap einreichen, danach die Abdeckung prüfen.

---

## Offene Punkte

Jeder Punkt nennt die Ursache und den nächsten Schritt.

1. **Schriftdateien im Repository.** Die `woff2` von Switzer und Cabinet Grotesk liegen im Repository. Ursache: Abschnitt 02 der ITF Free Font License nennt «repository» und «publicly accessible servers» unter den untersagten Wegen der Weitergabe. Der Schlusssatz desselben Abschnitts erlaubt das Selbsthosten für die eigene Website, was die Auslieferung über `im-stah.ch` deckt. Nächster Schritt: Das Repository wird privat gestellt, das erledigt der Auftraggeber. Damit ist die Weitergabe beendet. Wer vorher geklont hat, trägt die Dateien weiterhin bei sich, siehe «Rechte».
2. **Übersetzung nicht muttersprachlich geprüft.** Die französische und die englische Fassung sind sorgfältig erstellt, aber von keiner muttersprachlichen Person gegengelesen. Ursache: kein Lektorat beauftragt. Nächster Schritt: Gegenlesen beauftragen, insbesondere für die zwölf Rechtsseiten.
3. **Rechtstexte nur auf Deutsch verbindlich.** Die französischen und englischen Rechtstexte tragen den Vorrangvermerk, und AGB Ziffer 13 hält die deutsche Fassung fest. Ursache: Übersetzungen sind nicht anwaltlich geprüft. Nächster Schritt: Prüfung der deutschen Fassung beauftragen, danach die Übersetzungen abgleichen.
4. **Juristische Prüfung.** AGB, Teilnahmebedingungen, Impressum und Datenschutzerklärung sind nach bestem Wissen erstellt, jedoch nicht anwaltlich geprüft. Nächster Schritt: Prüfung vor dem Aufschalten der Anmeldung.
5. **Zwei Antworten fehlen im Quelltext.** `content/archiv-2026-09/organisation.md` trägt bei «Was passiert bei Regen?» und «Ich kann doch nicht teilnehmen?» nur Platzhalter. Nächster Schritt: beide Antworten im Wortlaut liefern.
6. **Verweis ohne Ziel.** `content/archiv-2026-09/organisation.md` nennt «[Übernachtungsmöglichkeiten entdecken]» ohne Adresse. Nächster Schritt: Adresse liefern, etwa Valais Wallis Promotion.
7. **Schreibweise des Namens.** Die Quelltexte schreiben «Z Wallis im Stah», die Datendatei «z'Wallis im Stah» mit Apostroph. Auf der Seite gilt die Datendatei. Nächster Schritt: nur die Datendatei zählt, das Archiv bleibt wie es ist.
8. **Wortmarke Fernand Cina mit Wappen.** Die Datei trägt das Wappen über dem Schriftzug. Der Kasten steht im Partnerband höher als Maison 13, die sichtbare Wortmarke liest sich dadurch kleiner. Nächster Schritt: eine Fassung ohne Wappen beschaffen.
9. **Zeiger, Wort und Zahl widersprechen sich.** Die Vorgabe nennt 0.12 «enger» und 0.20 «Widerstand». Bei `cx += (x - cx) * f` bedeutet ein kleineres `f` mehr Nachlauf. Gesetzt sind die genannten Zahlen. Nächster Schritt: entscheiden, ob die Zahlen oder die Worte gelten.
10. **Maison 13 Catering.** Firmenname, Rechtsform und Adresse fehlen im Impressum, in allen drei Sprachen. Nächster Schritt: bei Maison 13 einholen.
11. **Eringer und Munder Safran.** Beide Herkünfte sind nicht schriftlich bestätigt, beide stehen mehrfach auf der Seite. Nächster Schritt: Bestätigung einholen, sonst die Nennung streichen.
12. **Zahlungsdienstleister und Hosting.** Beide Namen fehlen in der Datenschutzerklärung. Nächster Schritt: nach dem Entscheid eintragen, in allen drei Sprachen.
13. **Titelbild aus einem Bildschirmfoto.** `clos-morgenlicht.jpg` ist eine Bildschirmaufnahme, 1782 mal 970 Pixel. Nächster Schritt: Aufnahme aus dem Bestand ab 2000 Pixel Breite holen, danach den Schleier neu messen.
14. **Mehrfach komprimierte Bänder.** `rebhaus-drohne.jpg` und `rebberg.jpg` wachsen beim Umrechnen auf WebP. Nächster Schritt: Originale aus dem Bestand holen. Die Qualität bleibt bei 72.
15. **Wortmarke des Anlasses.** Die SVG-Datei ist nachgezeichnet, die Konturen sind ab etwa 900 Pixel Breite sichtbar treppig. Nächster Schritt: Für Druck ab A2 die Marke aus der Originalschrift setzen.
16. **Fernbranch lässt sich aus dieser Sitzung nicht löschen.** `git push origin --delete` endet mit HTTP 403. Ursache: Die Zugangsdaten dieser Sitzung dürfen keine Referenzen löschen. Zuletzt am 4. September 2026 versucht, wieder HTTP 403. Nächster Schritt: Branch nach dem Merge über die GitHub-Oberfläche löschen.
17. **Geokoordinaten fehlen.** Die zwei `Place` der Auszeichnung, `#kellerei` und `#clos-du-cornalin`, tragen nur eine Postadresse. Ursache: Es liegen keine Koordinaten vor. Der Block `geo` liegt in `src/data/schema.ts` vorbereitet und ausgeklammert. Ohne Koordinaten fehlt beiden Orten der Ortsbezug, der für örtliche Antworten zählt. Nächster Schritt: Breite und Länge beider Orte auf sechs Stellen liefern, danach den Block einsetzen.
18. **Rebfläche widerspricht sich in drei Quellen.** `fernand-cina.ch` nennt 20 Hektaren, `sierretourisme.ch` und `vinum-montis.ch` nennen 18, `valais.ch` nennt 16. Ursache: Die Fremdverzeichnisse sind nicht nachgeführt. Auf dieser Seite gilt die eigene Website, also 20 Hektaren, in allen drei Sprachen. In der Auszeichnung steht die Zahl nicht, der Schema-Plan führt sie nicht im Graphen. Zwei Zahlen zur gleichen Firma schwächen die Autorität der Entität. Nächster Schritt: Zahl beim Mandanten bestätigen, danach die drei Fremdverzeichnisse nachführen lassen.

---

## Rechte

Fotos, Wortmarke und Texte gehören der Fernand Cina SA. Die Partnermarken gehören den
jeweiligen Inhaberinnen. Keine Nutzung ausserhalb dieses Anlasses ohne schriftliche
Zustimmung.

Porträts und Stimmungsbilder stammen aus dem Bestand der Fernand Cina SA.

**Switzer und Cabinet Grotesk.** Copyright © 2026 Indian Type Foundry, alle Rechte
vorbehalten. Lizenz: ITF Free Font License (FFL), Version 2.0 vom 17. August 2026. Der
Wortlaut liegt unverändert unter `src/assets/fonts/switzer/LICENSE` und
`src/assets/fonts/cabinet-grotesk/LICENSE`. Beide Dateien sind Byte für Byte gleich, geprüft
mit `cmp`.

Was die Lizenz deckt:

| Abschnitt | Aussage |
|---|---|
| 01 | Kommerzielle Nutzung erlaubt, ohne Begrenzung nach Zahl der Nutzenden, Geräte oder Seitenaufrufe |
| 01 | Selbsthosten der Webschriften auf der eigenen Website erlaubt |
| 01 | Ein Urhebervermerk ist nicht verlangt. Er steht dennoch in `src/styles/fonts.css` |
| 02 | Jede Änderung an den Dateien untersagt, ausdrücklich auch Teilsätze und Formatwandlung |
| 02 | Weitergabe über «repository» und «publicly accessible servers» untersagt |

Das Repository ist privat. Die Schriftdateien dürfen nach der ITF Free Font License
nicht über ein öffentliches Repository weitergegeben werden. Wird das Repository je
öffentlich gestellt, müssen die Schriftdateien vorher entfernt werden, auch aus der
Git-Geschichte.

Das Entfernen aus der Git-Geschichte trifft jeden Commit, der eine Datei unter
`src/assets/fonts/` anfasst. Es schreibt die Geschichte neu, alle offenen Branches müssen
danach neu aufgesetzt werden. Wer das Repository vorher geklont hat, trägt die Dateien
weiterhin bei sich.

---

Stand 4. September 2026 · Yoline AG, Salgesch
