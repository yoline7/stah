# Quelltexte

Hier liegen die Texte, aus denen die Seiten gebaut sind. Sie sind die Quelle,
der Astro-Quelltext ist die Umsetzung. Wer einen Text ändert, ändert ihn hier
und trägt die Änderung danach in die Seite.

| Datei | Speist |
|---|---|
| `index.md` | `src/pages/index.astro` |
| `kulinarik.md` | `src/pages/kulinarik.astro` |
| `wein.md` | `src/pages/wein.astro` |
| `organisation.md` | `src/pages/organisation.astro` |

Die Dateien werden nicht gebaut. Astro liest nur `src/`, `content/` bleibt aussen vor.

Zahlen, Daten und Preise stehen in `src/data/anlass.ts`. Weicht ein Text davon ab,
gilt die Datendatei. Die Abweichungen aus dem Stand vom 3. September 2026 stehen
im Hauptdokument unter «Offene Punkte».
