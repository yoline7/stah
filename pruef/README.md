# Prüfwerkzeug

Die Skripte hinter jeder Zahl in den Berichten. Sie laufen nicht im Build und
gehören nicht zur Website. Sie liegen im Repository, damit jede Messung
nachvollziehbar bleibt.

## Voraussetzung

```bash
node pruef/server.mjs 4700    # liefert dist/ auf Port 4700 aus
```

Vorher `npm run build`. Playwright und Chromium sind vorhanden, der Pfad zur
ausführbaren Datei steht in `wolkenmess.mjs` unter `EXE`.

## Werkzeug

| Datei | Zweck |
|---|---|
| `server.mjs` | statischer Server für `dist/` |
| `wolkenmess.mjs` | Messbibliothek: Tintenmaske, Leuchtdichte, Kontrast, Wolken anhalten |
| `schleier-wolken.mjs` | Schleier über dem Titelbild, drei Sprachen, vier Breiten, sechs Phasen |
| `text-auf-wolken.mjs` | Textkontrast auf den bewolkten Flächen, ungünstigstes Bild |
| `menue.mjs` | Kontrast in der Menüüberlagerung |
| `wolken-grenzen.mjs` | Grenzen der Wolken: Flächen, reduzierte Bewegung, Korn, ohne JavaScript |
| `bildrate.mjs` | Bildrate beim Rollen über die dunkle Passage |
| `leiter.mjs` | Leiter der Leistungsmassnahmen, Kostentreiber finden |
| `farbe.mjs` | Farbverteilung über 45 Läufe, Orangeanteil, Abstände |
| `bewegung.mjs` | Zahlenwelle, Laufbandspur, Zeigerfarbe |
| `gesamt.mjs` | Gesamtprüfung: Farbe, Bildrate, reduzierte Bewegung, ohne JavaScript, Sprachen |
| `vergleich.mjs` | Wörterbücher nebeneinander, Vollständigkeit und Abweichungen |
| `blick.mjs` | Aufnahmen der bewolkten Flächen |

## Verfahren

Das Messverfahren steht in zwei Dokumenten:

- [`docs/YL-FC-2026-011_Schleier.md`](../docs/YL-FC-2026-011_Schleier.md) für die Tintenmaske und den Schleier
- [`docs/YL-FC-2026-010_Bewegung.md`](../docs/YL-FC-2026-010_Bewegung.md) für Farbpuls, Wolken, Takt und Bildrate

## Erzeugnisse

`*.png`, `*.log` und `*.txt` bleiben ungefolgt. Sie entstehen bei jedem Lauf neu.
