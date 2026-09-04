# Bewegung

Referenz YL-FC-2026-010 · Projekt z’Wallis im Stah · Yoline AG
Stand 4. September 2026

Farbpuls, Neonwolken, Takt, Kantenlauf, Zahlenwelle, Laufbandspur, Knoepfe, Seitenuebergang. Mit allen gemessenen Werten.

Ausgelagert aus dem README. Wer hier etwas ändert, prüft den Verweis im README.

---

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

**Farbe erscheint an vier Stellen, sonst nirgends.**

1. Kantenlauf, `conic-gradient` und waagrechter Lauf
2. Zahlenwelle im Faktenfeld
3. Spur durch das Laufband
4. Füllung des Knopfes «Zur Anmeldung»

Gemessen auf sechs Seiten in Ruhe, in drei Sprachen: jede Seite wird zweimal aufgenommen,
einmal mit der Palette und einmal mit vier ausgegrauten Pulsfarben. Der Unterschied beträgt
auf allen sechs Seiten 0.0000 Prozent. Was an farbigen Bildpunkten übrig bleibt, steht in
beiden Aufnahmen gleich und ist Subpixel-Kantenglättung der Schrift, kein Gestaltungsmittel.

### Neonwolken

Der Kantenlauf ist ein Puls von 1.4 Sekunden. Die Wolke ist Licht und bleibt. Grosse,
weiche Farbfelder ziehen dauerhaft und sehr langsam über die dunklen Flächen und leuchten
sie aus, statt sie zu bemalen. Reine CSS-Animation, kein Taktgeber.

**Fünf Flächen, sonst keine.**

| Fläche | Wolken | Grunddeckkraft | Töne |
|---|---|---|---|
| Titelbild, über dem Foto und unter dem Schleier | 2 | 0.28 | Petrolgrün, Salbei |
| Menü und Ausklang, die dunkle Passage | 3 | 0.40 | Petrolgrün, Salbei, Orange |
| Faktenfeld | 2 | 0.34 | Petrolgrün, Salbei |
| Menüüberlagerung, wenn offen | 2 | 0.46 | Petrolgrün, Orange |
| Partnerband und Fuss | je 1 | 0.22 | Salbei |

Die Töne sind dieselben wie beim Kantenlauf, `--wolke-1` bis `--wolke-3` zeigen auf
`--puls-3`, `--puls-2` und `--puls-4`. Ein Farbsystem, nicht zwei.

Kein Orange auf dem Titelbild und keines im Faktenfeld. Beide Flächen tragen Text, der
den Kontrast hält, und die Zahlen bleiben kühl. Auf keiner Fläche stehen zwei Orange.

**Bewegung.** Zwei Kreisläufe je Wolke, mit eigener Dauer. Der Weg läuft über 78 bis
128 Sekunden, die Deckkraft schwingt über 61 bis 97 Sekunden zwischen 0.55 und 1.0 der
Grunddeckkraft. Beide `alternate`, endlos, auf `cubic-bezier(.45,.05,.55,.95)`. Jede Wolke
startet mit eigenem Vorlauf, zwei Wolken derselben Fläche laufen nie in dieselbe Richtung.
Der Weg beträgt höchstens 9vw waagrecht und 7vh senkrecht.

**Lage.** Jede Wolke hängt zu einem guten Teil ausserhalb ihrer Fläche. So liest sich die
Wolke als Licht von aussen, nicht als Fleck in der Mitte.

**Korn.** Ein feines Korn liegt still auf denselben Flächen, `feTurbulence` mit
`baseFrequency` 0.9 und `numOctaves` 3, in Graustufen, Kachel 180 mal 180 Pixel, als
Data-URI eingebettet. Keine zusätzliche Anfrage, keine Animation. Es liegt in der
Wolkenschicht und damit unter dem Text.

**Grenzen.**

- Ohne `color-mix` entsteht keine Wolke. Die Regeln hängen an einem `@supports`-Block, ohne Unterstützung bleibt `.wolke` auf `display:none`.
- Bei reduzierter Bewegung stehen die Wolken still und bleiben sichtbar. Der halbe Vorlauf hält sie in mittlerer Stellung und Deckkraft.
- Ohne JavaScript erscheinen sie unverändert, alle 13 stehen im Markup.
- Ausserhalb des Sichtfelds ruhen sie, gesetzt über `IntersectionObserver`. Das ist eine Leistungsbremse, keine Führung.
- Unter 700 Pixel Breite trägt jede Fläche höchstens zwei Wolken.
- Kein Element ändert durch die Wolken Grösse oder Lage.

**Gemessener Textkontrast auf den bewolkten Flächen,** im ungünstigsten Bild aus sechs
Phasen, 1440 mal 900:

| Stelle | Kontrast |
|---|---|
| Menüzeile in der Überlagerung | 16.60 : 1 |
| Menüzeile im Menü, Kulinarik | 16.41 : 1 |
| Register, Organisation | 14.62 : 1 |
| Zahl im Faktenfeld | 14.92 : 1 |
| Kopf der dunklen Passage | 13.48 : 1 |
| Fussverweise | 7.89 : 1 |
| Partnermarke | 7.69 : 1 |
| Fliesstext der dunklen Passage | 7.34 : 1 |
| Weinspalte im Menü | 7.02 : 1 |
| Mikro-Marke im Posten | 6.70 : 1 |
| Fuss in der Überlagerung | 6.66 : 1 |
| Beschriftung im Faktenfeld | 6.61 : 1 |

Kleinster Wert 6.61 : 1. Grundlinie ohne Wolken 7.67 : 1, der Verlust beträgt also
höchstens 1.06.

**Gemessene Bildrate** beim Rollen über die dunkle Passage, vier Sekunden:

| Breite | Bilder je Sekunde |
|---|---|
| 1920 mal 1080 | 51.1 bis 59.9, streut |
| 1440 mal 900 | 59.4 bis 60.3 |
| 1280 mal 800 | 60.3 bis 60.4 |
| 390 mal 844 | 60.3 bis 60.5 |

Der Fall 1920 streut über fünf Läufe um bis zu 8.8 Bilder, und zwar bei jeder
Verlaufsstufe der Wolken gleich. Zwischen 14 und 20 Prozent liegen höchstens 2.0 Bilder,
also weniger als die Streuung. Ursache: Die Messumgebung rechnet ohne Grafikkarte. Die
früher genannten 59.7 waren ein Einzellauf und tragen als Untergrenze nicht.

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

### Zeiger, entfernt am 4. September 2026

Ein eigener Zeigerring lief dem Mauszeiger nach, 34 Pixel im Grundzustand, 70 über Verweisen
und Knöpfen, Mischung `difference`. Der Auftraggeber hat den Effekt am 4. September 2026
abgelehnt. Markup, Stil und Steuerung sind entfernt, der Systemzeiger gilt wieder. Damit
entfällt auch der frühere offene Punkt zum Widerspruch zwischen 0.12 und 0.20.

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
`background-clip: text` und setzt `hat-welle`. Die Wolken hängen nicht an JavaScript,
sie hängen an einem `@supports`-Block mit `color-mix`. Alle Regeln hängen an diesen Klassen. Ohne
Unterstützung, ohne JavaScript und bei reduzierter Bewegung entsteht kein Pseudoelement und
keine Klasse. Nichts geht dadurch kaputt.

Gemessen: 60.7 Bilder je Sekunde während Zahlenwelle und Kantenlauf zugleich.
