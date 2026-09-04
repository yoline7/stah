# Arbeitsdokumente

Grundlagen der Arbeit am Projekt z’Wallis im Stah. Sie gehören ins Repository,
weil sie die Zahlen und Entscheide belegen. Sie speisen keine Seite und laufen
nicht im Build.

| Referenz | Titel | Zweck | Stand |
|---|---|---|---|
| YL-FC-2026-010 | [Bewegung](YL-FC-2026-010_Bewegung.md) | Farbpuls, Neonwolken, Takt, Kantenlauf, Zahlenwelle, Laufbandspur, Knöpfe, Zeiger, Seitenübergang, mit allen gemessenen Werten | 4. September 2026 |
| YL-FC-2026-011 | [Schleier](YL-FC-2026-011_Schleier.md) | Verfahren der Tintenmaske und Messreihe je Deckungsstufe, drei Sprachen, vier Breiten | 4. September 2026 |
| YL-FC-2026-012 | [Feldtabelle Anmeldung](YL-FC-2026-012_Feldtabelle-Anmeldung.md) | Felder, Kennungen, Typen und Regeln des Anmeldeformulars, Übergabe an YoSuite | 4. September 2026 |
| YL-SGU-2026-001 | [Umsetzungs-Methodik Sichtbarkeit](YL-SGU-2026-001_Umsetzungs-Methodik-Sichtbarkeit.md) | Auftragsgrundlage, Methodik in fünf Werkbänken, Seitenstruktur, Entitäten, Schema-Plan, Durchgangs-Protokoll, Wirkungs-Nachhaltung | 4. September 2026 |
| YL-SGU-2026-002 | [Schema-Plan](YL-SGU-2026-002_Schema-Plan.md) | Verifizierte Fakten mit Quellen, vollständiges JSON-LD je Seite, was nicht ausgezeichnet wird | 4. September 2026 |

Alle fünf Dokumente liegen vor. `YL-SGU-2026-001` und `-002` sind am
4. September 2026 eingereicht und die Grundlage der Schema-Auszeichnung.

## Benennung

`Referenz_Titel.md`. Die Referenz trägt Herkunft, Reihe, Jahr und laufende Nummer.

Aktenzeichen folgen dem Register von Yoline. Für dieses Mandat gilt YL-FC-2026-###.
Die Nummer wird bei Yoline vergeben, nicht im Repository. Neue Dokumente ohne
zugeteilte Nummer tragen vorläufig YL-FC-2026-XXX und werden vor dem Merge ersetzt.

## Zwei Reihen, ein Ordner

| Reihe | Herkunft | Beispiel |
|---|---|---|
| `YL-FC-2026-###` | Mandat Fernand Cina, die Website ist `YL-FC-2026-009` | Bewegung, Schleier, Feldtabelle |
| `YL-SGU-2026-###` | Skill `seo-geo-umsetzung`, nicht mandatsgebunden | Umsetzungs-Methodik, Schema-Plan |

Beide liegen hier, weil beide die Arbeit an dieser Website belegen. Die Reihe sagt,
woher ein Dokument stammt, nicht wo es liegt.

## Was hier nicht liegt

- Quelltexte, die eine Seite speisen. Die liegen in den Wörterbüchern unter `src/i18n/`
- Der Nachweis der Herkunft der ersten Texte. Der liegt in `content/archiv-2026-09/`
- Prüfskripte. Die liegen in `pruef/`, mit eigenem README
