# Feldtabelle Anmeldung

Referenz YL-FC-2026-012 · Projekt z’Wallis im Stah · Yoline AG
Stand 4. September 2026

Felder, Kennungen, Typen und Regeln des Anmeldeformulars. Uebergabe an YoSuite.

Ausgelagert aus dem README. Wer hier etwas ändert, prüft den Verweis im README.

---

`src/ansichten/Anmeldung.astro` ist ein Entwurf. Die produktive Anmeldung läuft über YoSuite.
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
