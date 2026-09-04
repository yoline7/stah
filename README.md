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

Die Wegtabelle steht einmal, in `src/i18n/ui.ts` unter `wege`. Kopf, Fuss, Umschalter,
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

**Seiten.** Die fünf Inhaltsseiten stehen einmal als Baustein unter `src/seiten/` und
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

**Neue Sprache aufnehmen.** Kürzel in `sprachen` (`src/i18n/ui.ts`), Spalte in `wege`,
Eintrag in `kuerzel`, Wörterbuch `src/i18n/<kürzel>.ts` nach dem Muster von `de.ts`,
fünf Routendateien unter `src/pages/<kürzel>/`, vier Rechtsseiten. Der Prüflauf nennt
jeden fehlenden Eintrag.

---

## Aufbau

```
im-stah/
├── .gitignore
├── astro.config.mjs              Domain, Sprachen, Sitemap, Ausgabeformat
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
├── content/                      Quelltexte der Seiten, nicht gebaut
│   ├── README.md
│   ├── index.md
│   ├── kulinarik.md
│   ├── wein.md
│   └── organisation.md
├── public/                       favicon.svg · robots.txt · preview.jpg
└── src/
    ├── data/anlass.ts            Eckdaten des Anlasses, einzige Quelle
    ├── i18n/
    │   ├── ui.ts                 Sprachen, Wegtabelle, Kürzel, Nachschlag
    │   ├── de.ts                 Wörterbuch Deutsch, zugleich die Vorlage
    │   ├── fr.ts                 Wörterbuch Französisch
    │   └── en.ts                 Wörterbuch Englisch
    ├── layouts/
    │   ├── Base.astro            Metadaten, hreflang, JSON-LD, Kopf und Fuss
    │   └── Legal.astro           Rahmen für die Rechtsseiten, Vorrangvermerk
    ├── components/
    │   ├── Header.astro          Kopfzeile, Menü, Umschalter
    │   ├── Footer.astro          Fusszeile
    │   ├── Partner.astro         Partnerband
    │   ├── Sprachen.astro        Umschalter DE · FR · EN
    │   └── logos/                Wortmarke · Maison13 · Yoline
    ├── seiten/                   die fünf Inhaltsseiten, je einmal
    │   ├── Start.astro
    │   ├── Kulinarik.astro
    │   ├── Wein.astro
    │   ├── Organisation.astro
    │   └── Anmeldung.astro
    ├── pages/                    27 Adressen, siehe Gliederung
    │   ├── index.astro · kulinarik · wein · organisation · anmeldung
    │   ├── agb · teilnahmebedingungen · impressum · datenschutz
    │   ├── fr/                   neun Adressen
    │   └── en/                   neun Adressen
    ├── styles/
    │   ├── fonts.css             @font-face für Switzer und Cabinet Grotesk
    │   ├── site.css
    │   ├── anmeldung.css
    │   └── legal.css
    ├── scripts/
    │   ├── site.js               Taktgeber, Farbpuls, Parallaxe, Zeiger, Band
    │   └── anmeldung.js
    └── assets/
        ├── fonts/
        │   ├── switzer/
        │   │   ├── Switzer-Variable.woff2
        │   │   ├── Switzer-VariableItalic.woff2
        │   │   └── LICENSE       ITF Free Font License 2.0, unverändert
        │   └── cabinet-grotesk/
        │       ├── sieben Schnitte als woff2 mit woff als Rückfall
        │       └── LICENSE       ITF Free Font License 2.0, unverändert
        └── img/
            ├── clos-morgenlicht.jpg · clos-du-cornalin.jpg
            ├── rebhaus-drohne.jpg · rebberg.jpg · team.jpg
            ├── mood-messer.jpg · alisha-cina.jpg · alain-lerjen.jpg
            └── partner/fernand-cina.png · bergbox.png
```

Der Build legt die Startseite als `index.html` ab, die 26 Unterseiten je als Ordner
mit `index.html`.

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

Die deutschen Texte der vier Inhaltsseiten liegen als Quelle in `content/`. Der
Astro-Quelltext ist die Umsetzung, nicht die Quelle. Wer einen deutschen Text ändert,
ändert ihn zuerst dort, danach in `src/i18n/de.ts`.

| Datei | Speist | Deckt |
|---|---|---|
| `content/index.md` | `src/i18n/de.ts` → `start` | Titel, Der Anlass, Der Auftakt, Die zwei, Der Tag, Ab vierzehn Uhr, Der Ort, Abschluss |
| `content/kulinarik.md` | `src/i18n/de.ts` → `kulinarik` | Kopf, Sechs Gänge, Die Wahl, Der Koch, Aus dem Wallis, Aufruf |
| `content/wein.md` | `src/i18n/de.ts` → `wein` | Kopf, Die Begleitung, Das Weingut, Die Weinbegleitung, Aufruf |
| `content/organisation.md` | `src/i18n/de.ts` → `organisation` | Kopf, Der Tag, Durch den Tag, Anfahrt, Gut zu wissen, Fragen, Kontakt, Aufruf |

`content/` wird nicht gebaut. Astro liest ausschliesslich `src/`.

**Was nicht aus den Quelltexten kommt.** Die Bildunterschriften der Bänder, die drei
Pfeilzeilen unter «Mehr dazu», das Laufband, die Anmeldung und die zwölf Rechtsseiten.
Für sie liegt kein Quelltext vor.

**Zahlen führen aus der Datendatei.** Steht in einem Quelltext eine Zahl, ein Datum
oder ein Preis, gilt trotzdem `src/data/anlass.ts`. Datum und Uhrzeit stehen zusätzlich
je Sprache im Wörterbuch, weil die Schreibweise sich unterscheidet: «19. September 2026»,
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
| Anzeige, alle Grade ab 20 Pixel | Cabinet Grotesk | `src/assets/fonts/cabinet-grotesk/`, sieben Schnitte als `woff2` mit `woff` als Rückfall |
| Fliesstext und Mikro-Marken | Switzer | `src/assets/fonts/switzer/`, variabel, Achse `wght` von 100 bis 900, aufrecht und kursiv |

**Switzer.** Von der Indian Type Foundry. Eingebaut sind zwei Dateien, `Switzer-Variable.woff2`
und `Switzer-VariableItalic.woff2`. Die 96 einzelnen Schnitte aus dem Paket sind entfernt,
die variable Fassung deckt jedes Gewicht ab. Familienname im CSS: `"Switzer"`.

**Cabinet Grotesk.** Von der Indian Type Foundry. Die sieben `@font-face`-Regeln stehen in
`src/styles/fonts.css`, alle unter der Familie `"Cabinet Grotesk"` mit den Gewichten 100
bis 800. Die Seite selbst nutzt 400 und 500, die übrigen Schnitte lädt der Browser nie,
weil kein Element sie anfragt. Eine variable Fassung liegt nicht vor, geprüft an der
fehlenden `fvar`-Tabelle. `ttf` und `eot` sind entfernt, sie gehören nicht in einen Build.

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
| `mood-messer.jpg` | Start | Bildband nach «Die zwei» |
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
`src/seiten/` importieren, im Rumpf über `<Image>` einsetzen. Das `<img>` bleibt im
`<div class="px">`, sonst hält die Parallaxe nicht. Jedes Bild braucht einen Schlüssel unter
`bilder` in allen drei Wörterbüchern, sonst hält der Prüflauf an.

---

## Bewegung

Ein Taktgeber in `src/scripts/site.js` führt alle Bewegungen. **Nie laufen zwei
gleichzeitig**, zwischen zwei Bewegungen liegen mindestens zwei Sekunden Ruhe. Gemessen
über 45 Bewegungen: höchstens eine gleichzeitig, kleinste Ruhe 2050 Millisekunden.

### Farbpuls

Vier Töne, drei Grüne und ein Orange als Ausreisser. Sie stehen in `site.css` als
`--puls-1` bis `--puls-4`. Der Taktgeber setzt vor jeder Bewegung `--puls` auf einen davon.

| Marke | Wert | Rolle | Kontrast auf `--deep` |
|---|---|---|---|
| `--puls-1` | `#C2D9A6` | Grün, hell | 13.07 : 1 |
| `--puls-2` | `#96C9A8` | Grün, mittel | 10.64 : 1 |
| `--puls-3` | `#7FB6B0` | Grün, kühl | 8.75 : 1 |
| `--puls-4` | `#F0A868` | Orange, der Ausreisser | 9.97 : 1 |

**Orange ist selten.** Höchstens jeder fünfte Lauf, nie zweimal hintereinander. Gemessen
über 45 Läufe: 8-mal Orange, kleinster Abstand fünf Läufe, kein Ton zweimal hintereinander.

**Farbe erscheint an fünf Stellen, sonst nirgends.**

1. Kantenlauf, `conic-gradient` und waagrechter Lauf
2. Zahlenwelle im Faktenfeld
3. Spur durch das Laufband
4. Füllung des Knopfes «Zur Anmeldung»
5. Zeigerring über den beiden Knöpfen

Gemessen auf sechs Seiten in Ruhe, in drei Sprachen: jede Seite wird zweimal aufgenommen,
einmal mit der Palette und einmal mit vier ausgegrauten Pulsfarben. Der Unterschied beträgt
auf allen sechs Seiten 0.0000 Prozent. Was an farbigen Bildpunkten übrig bleibt, steht in
beiden Aufnahmen gleich und ist Subpixel-Kantenglättung der Schrift, kein Gestaltungsmittel.

### Takt

| Bewegung | Abstand | Dauer |
|---|---|---|
| Kantenlauf | 6 bis 10 Sekunden | 1.4 Sekunden |
| Zahlenwelle | 12 bis 18 Sekunden | 1.4 Sekunden plus 140 ms Versatz je Zahl |
| Laufbandspur | 18 bis 26 Sekunden | 1.8 Sekunden |
| Mindestruhe dazwischen | | 2 Sekunden |

Der Abstand wird je Durchgang neu gewürfelt. Eine Bewegung läuft nur im sichtbaren Bereich,
gesteuert über `IntersectionObserver`. Liegt der Reiter im Hintergrund, hält der Takt an.
Beim Zeigen auf einen Knopf läuft dessen Kante einmal sofort.

### Kantenlauf

Der Lauf sitzt auf der Kante, nie auf der Fläche. Nach 1.4 Sekunden ist er weg.

| Element | Führung |
|---|---|
| Kopfleiste, `#hd .bar` | entlang der unteren Hairline, von links nach rechts |
| Faktenfeld auf der Startseite | Aussenkante, im Uhrzeigersinn |
| Faktenfeld im Abschluss | Aussenkante, im Uhrzeigersinn |
| Knöpfe «Platz sichern» und «Zur Anmeldung» | Aussenkante, im Uhrzeigersinn |

Sonst nirgends. Keine Bildbänder, keine Register, keine Porträts, keine Menüüberlagerung.

### Zahlenwelle

Die Farbe läuft durch die Ziffern, nicht dahinter: `background-clip: text` mit
`-webkit-text-fill-color: transparent`. Der Versatz von 140 Millisekunden je Zahl macht aus
vier Zahlen eine Welle von links nach rechts. `.facts b` trägt `width: fit-content`, sonst
liefe die Welle neben der Ziffer durch den leeren Kasten.

Unabhängig davon zählen die Zahlen beim ersten Erscheinen von 0 auf den Endwert,
900 Millisekunden auf `cubic-bezier(.22,1,.36,1)`, genau einmal je Seitenaufruf.
`font-variant-numeric: tabular-nums` hält die Zeichenbreite fest.

### Laufbandspur

Die Spur läuft über die Trennpunkte zwischen den Wörtern, von links nach rechts. Jeder
Punkt bekommt seinen Versatz aus seiner Lage im Schirm, 0 bis 900 Millisekunden, und
leuchtet dann 900 Millisekunden lang auf. Zusammen 1.8 Sekunden.

### Knöpfe

Beim Zeigen füllt sich der Knopf von unten nach oben, 0.42 Sekunden auf `var(--ease)`,
in der Farbe des laufenden Pulses. Der Pfeil dreht gleichzeitig 45 Grad. Kein Anheben,
keine Vergrösserung, kein Schlagschatten. Der Text im gefüllten Knopf steht auf `--deep`,
Kontrast 8.75 bis 13.07 : 1 je nach Ton.

Der Knopf «Platz sichern» in der Kopfleiste ist bereits weiss gefüllt und behält das.
Eine Füllung von unten hätte dort nichts zu füllen.

### Zeiger

Grundzustand 34 Pixel, Nachführung 0.12. Über Verweisen und Knöpfen wächst er auf 70 Pixel,
die Nachführung geht auf 0.20. Über den beiden Knöpfen nimmt der Ring über 0.24 Sekunden die
Farbe des Pulses an, die Mischung schaltet dafür von `difference` auf `normal`. Über
Bildbändern schrumpft er auf 8 Pixel. Auf Touch und bei reduzierter Bewegung bleibt er aus.

### Laufband, Führung

Beim Zeigen hält es mit Auslauf, beim Verlassen läuft es wieder an. Dafür führt `site.js`
das Band, die CSS-Animation dient als Rückfall ohne JavaScript. Die Punkte stehen auf
Deckung 0.45, damit die Wörter führen.

### Seitenübergang

Astro View Transitions über `<ClientRouter />` im Basis-Layout. Die neue Seite blendet über
0.35 Sekunden auf, die alte über 0.25 ab. Kopfzeile und Fuss bleiben stehen, sie tragen
`transition:persist`. Bei reduzierter Bewegung findet kein Übergang statt.

Weil die Kopfzeile stehen bleibt, hängt `site.js` an `astro:page-load` statt an
`DOMContentLoaded`. Die globalen Horcher und die Bildschleife laufen einmal, der Aufbau je
Seite läuft neu. Beobachter auf bleibenden Elementen werden vor dem Neuaufbau abgeräumt.

### Rückfall

`site.js` prüft `CSS.registerProperty`, `mask-composite` und `conic-gradient` und setzt erst
dann `hat-lauf` auf das Wurzelelement. Für Welle und Spur prüft es zusätzlich
`background-clip: text` und setzt `hat-welle`. Alle Regeln hängen an diesen Klassen. Ohne
Unterstützung, ohne JavaScript und bei reduzierter Bewegung entsteht kein Pseudoelement und
keine Klasse. Nichts geht dadurch kaputt.

Gemessen: 60.7 Bilder je Sekunde während Zahlenwelle und Kantenlauf zugleich.

---

## Schleier über dem Titelbild

`.hero .veil` liegt bei `rgba(26,18,12,.36)`. Der Wert ist gemessen, nicht geschätzt.

**Verfahren.** Die Seite wird zweimal aufgenommen, einmal mit und einmal ohne die
Titelzeile. Die Differenz beider Aufnahmen ergibt die Tintenmaske, also die Bildpunkte,
auf denen wirklich ein Buchstabe steht. Unter dieser Maske wird die Leuchtdichte des
Untergrunds über ein Fenster von Schriftgrad mal 0.10 gemittelt, davon der Höchstwert
gegen die Schriftfarbe gerechnet.

**Ergebnis, kleinster Wert über drei Sprachen und vier Breiten:**

| Stufe | kleinster Kontrast | trägt 4.5 : 1 |
|---|---|---|
| .32 | 4.14 : 1 | nein |
| .34 | 4.33 : 1 | nein |
| **.36** | **4.53 : 1** | **ja** |
| .38 | 4.68 : 1 | ja |
| .40 | 4.91 : 1 | ja |

Gesetzt ist .36, die niedrigste Stufe, die trägt. Der kritische Fall ist die englische und
die französische Titelzeile bei 1920 Pixel Breite. Deutsch allein trüge schon .28. Wer die
Titelzeile ändert, misst neu.

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

**3 · Rechtstexte als Seiten, nicht als Wörterbuch.** Die vier Rechtstexte stehen je Sprache
als eigene `.astro`-Datei, nicht als Einträge im Wörterbuch. Grund: Fliesstext mit
Nummerierung, Zwischentiteln, Listen und Definitionslisten wird in einer Schlüssel-Wert-Liste
unlesbar und fehleranfällig. Die fünf Inhaltsseiten stehen umgekehrt einmal als Baustein,
weil sie aus vielen kurzen, gleich gebauten Feldern bestehen.

**4 · Laufbandspur über die Punkte, nicht durch die Buchstaben.** Vorgesehen war dieselbe
Machart wie bei den Zahlen. Gemessen im Browser trägt sie dort nicht: `background-clip: text`
auf `.tick` schneidet den Verlauf nicht auf die Schrift der Nachfahren zu, weil das Band eine
eigene Zeichenebene führt. Die Spur läuft deshalb über die Trennpunkte. Dauer und Richtung
sind unverändert.

**5 · Sitemap ohne die eingebaute i18n-Option.** `@astrojs/sitemap` verknüpft Sprachfassungen
über gleiche Seitennamen. Die Seitennamen sind hier übersetzt, deshalb baut eine eigene
`serialize`-Funktion die Alternativen aus der Wegtabelle.

**6 · Ein Anmeldeschluss, zwei Wirkungen.** AGB Ziffer 6.1 nannte fest den 13. September.
Der Anmeldeschluss steht seit dem 3. September auf dem 15. September. Die Ziffer rechnet den
Tag danach jetzt aus `src/data/anlass.ts` aus.

---

## Feldtabelle Anmeldung

`src/seiten/Anmeldung.astro` ist ein Entwurf. Die produktive Anmeldung läuft über YoSuite.
Die Beschriftungen kommen je Sprache aus `src/i18n/<sprache>.ts` unter `anmeldung`.

| Feld | Kennung | Typ | Pflicht | Vorgabe |
|---|---|---|---|---|
| Name | `name` | Text | ja | leer |
| E-Mail | `mail` | E-Mail | ja | leer |
| Telefon | `tel` | Telefon | nein | leer |
| Sprache | `sprache` | Deutsch, Français, English | nein | Sprache der Seite |
| Anzahl Personen | `anzahl` | 1 bis 6 | ja | 2 |
| Name je Person | `--` | Text | nein | leer |
| Essen je Person | `e1` bis `e6` | Fleisch oder vegetarisch | ja | Fleisch |
| 18 Jahre und Bedingungen gelesen | `zustimmung` | Kontrollkästchen | ja | nicht gesetzt |
| Post von Fernand Cina | `news` | Kontrollkästchen | nein | nicht gesetzt |
| Warteliste, Name | `w_name` | Text | ja | leer |
| Warteliste, E-Mail | `w_mail` | E-Mail | ja | leer |
| Warteliste, Anzahl | `w_anz` | Text | nein | leer |

**Regeln**

1. Die Werbeeinwilligung steht getrennt von der Zustimmung zu den Bedingungen und ist nie vorangekreuzt. Grundlage: Art. 3 Abs. 1 lit. o UWG.
2. Zur Einwilligung gehören Status, Zeitstempel, Quelle und IP, filterbar und als CSV exportierbar.
3. Bei 50 vergebenen Plätzen `#formular` und `.side` ausblenden, `#warteliste` einblenden.
4. Anmeldeschluss 15. September 2026, 23:59. Der Wert steht in `src/data/anlass.ts`.
5. Preis: Anzahl mal CHF 145.00. Anzeige mit Apostroph ab vier Stellen.
6. Die Küche erhält nur die Zahlen je Schiene und die gemeldeten Allergien, ohne Kontaktdaten.
7. Die Sprachwahl ist freiwillig. Sie geht an Alisha Cina und Alain Lerjen, damit sie wissen, wie viele Gäste sie auf Französisch begleiten. Englisch steht zur Wahl, zugesichert wird es nicht.
8. Die Bestätigungsmail geht in der gewählten Sprache raus, ersatzweise auf Deutsch.

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
5. **Auf `noindex` bleiben 15 Seiten.** Anmeldung und die vier Rechtstexte, je in drei Sprachen. Das `noindex` steht in `src/layouts/Legal.astro` und `src/seiten/Anmeldung.astro`.
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
5. **Zwei Antworten fehlen im Quelltext.** `content/organisation.md` trägt bei «Was passiert bei Regen?» und «Ich kann doch nicht teilnehmen?» nur Platzhalter. Nächster Schritt: beide Antworten im Wortlaut liefern.
6. **Verweis ohne Ziel.** `content/organisation.md` nennt «[Übernachtungsmöglichkeiten entdecken]» ohne Adresse. Nächster Schritt: Adresse liefern, etwa Valais Wallis Promotion.
7. **Schreibweise des Namens.** Die Quelltexte schreiben «Z Wallis im Stah», die Datendatei «z'Wallis im Stah» mit Apostroph. Auf der Seite gilt die Datendatei. Nächster Schritt: die Schreibweise in `content/` angleichen.
8. **Wortmarke Fernand Cina mit Wappen.** Die Datei trägt das Wappen über dem Schriftzug. Der Kasten steht im Partnerband höher als Maison 13, die sichtbare Wortmarke liest sich dadurch kleiner. Nächster Schritt: eine Fassung ohne Wappen beschaffen.
9. **Zeiger, Wort und Zahl widersprechen sich.** Die Vorgabe nennt 0.12 «enger» und 0.20 «Widerstand». Bei `cx += (x - cx) * f` bedeutet ein kleineres `f` mehr Nachlauf. Gesetzt sind die genannten Zahlen. Nächster Schritt: entscheiden, ob die Zahlen oder die Worte gelten.
10. **Maison 13 Catering.** Firmenname, Rechtsform und Adresse fehlen im Impressum, in allen drei Sprachen. Nächster Schritt: bei Maison 13 einholen.
11. **Eringer und Munder Safran.** Beide Herkünfte sind nicht schriftlich bestätigt, beide stehen mehrfach auf der Seite. Nächster Schritt: Bestätigung einholen, sonst die Nennung streichen.
12. **Zahlungsdienstleister und Hosting.** Beide Namen fehlen in der Datenschutzerklärung. Nächster Schritt: nach dem Entscheid eintragen, in allen drei Sprachen.
13. **Titelbild aus einem Bildschirmfoto.** `clos-morgenlicht.jpg` ist eine Bildschirmaufnahme, 1782 mal 970 Pixel. Nächster Schritt: Aufnahme aus dem Bestand ab 2000 Pixel Breite holen, danach den Schleier neu messen.
14. **Mehrfach komprimierte Bänder.** `rebhaus-drohne.jpg` und `rebberg.jpg` wachsen beim Umrechnen auf WebP. Nächster Schritt: Originale aus dem Bestand holen. Die Qualität bleibt bei 72.
15. **Wortmarke des Anlasses.** Die SVG-Datei ist nachgezeichnet, die Konturen sind ab etwa 900 Pixel Breite sichtbar treppig. Nächster Schritt: Für Druck ab A2 die Marke aus der Originalschrift setzen.
16. **Branch lässt sich aus dieser Sitzung nicht löschen.** `git push origin --delete` endet mit HTTP 403. Ursache: Die Zugangsdaten dieser Sitzung dürfen keine Referenzen löschen. Nächster Schritt: Branch nach dem Merge über die GitHub-Oberfläche löschen.

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

Stand 3. September 2026 · Yoline AG, Salgesch
