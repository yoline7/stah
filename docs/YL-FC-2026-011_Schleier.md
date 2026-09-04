# Schleier über dem Titelbild

Referenz YL-FC-2026-011 · Projekt z’Wallis im Stah · Yoline AG
Stand 4. September 2026

Verfahren der Tintenmaske und die Messreihe je Deckungsstufe, drei Sprachen, vier Breiten.

Ausgelagert aus dem README. Wer hier etwas ändert, prüft den Verweis im README.

---

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

**Nach dem Einbau der Wolken neu gemessen,** im ungünstigsten Bild der Wolkenbewegung,
also bei voller Deckkraft und über sechs Stellungen des Weges:

| Stufe | kleinster Kontrast | trägt 4.5 : 1 |
|---|---|---|
| **.36** | **4.53 : 1** | **ja** |
| .38 | 4.67 : 1 | ja |

Der Schleier bleibt auf .36. Die Wolken über dem Titelbild tragen nur 0.28 Grunddeckkraft
und hängen über die Kanten hinaus, unter der Titelzeile ändern sie den Grund kaum. Der
kleinste Wert liegt bei 4.53 gegen 4.53 ohne Wolken.
