# Umsetzungs-Methodik Sichtbarkeit · z'Wallis im Stah

**Referenz:** YL-SGU-2026-001 · Version 1.0 · 4. September 2026
**Grundlage:** Dokumentierter Einzelauftrag. Ein Strategie-Papier liegt keines vor.
**Mandant:** Fernand Cina SA, Salgesch · Anlass vom 19. September 2026

---

## 1 · Auftrag und Grundlage

### 1.1 Was fehlt

Die Skill `seo-geo-umsetzung` setzt um, sie entscheidet nicht. Sie verlangt ein Strategie-Papier oder einen belegten Audit-Befund. Beides fehlt.

Deshalb bearbeitet dieser Durchgang nur, was ohne Marktdaten belegbar ist:

| Werkbank | Bearbeitet | Grund |
|---|---|---|
| Schema-Erzeugung | ja | Fakten liegen verifiziert vor |
| Technik-Prüfung | teilweise | Rendering und Auszeichnung prüfbar, Felddaten fehlen |
| Seiten-Rewrite | nein, mit Begründung | siehe 1.3 |
| Off-Page | nein | Nennungsdaten fehlen, Entscheid offen |
| GSC-Quick-Wins | nein | Kein Zugriff, keine Domain, keine Historie |

### 1.2 Der blockierende Umstand

**Die Domain `im-stah.ch` ist nicht aufgeschaltet.** Die Seite läuft auf einer Vercel-Adresse, die der Server mit `x-robots-tag: noindex` ausliefert. Belegt am 4. September 2026 durch Abruf von `/robots.txt`.

Solange das gilt, indexiert nichts. Jede Massnahme in diesem Dokument ist Vorbereitung, keine Wirkung.

### 1.3 Warum kein Seiten-Rewrite

Answer-First verlangt eine Direktantwort von 50 bis 70 Wörtern am Abschnittsanfang und Überschriften als Nutzerfragen.

Die Startseite und die Seiten Kulinarik und Wein sind Verkaufstexte mit Spannungsbogen. Sie tragen Sätze wie «Drei Marken. Ein Rebberg.» Ein Rewrite nach Answer-First zerstört genau das, was in acht Durchgängen gebaut wurde.

**Setzung:** Answer-First gilt nur dort, wo die Absicht hinter der Anfrage informierend ist. Das ist die Seite Organisation. Die drei erzählenden Seiten bleiben unangetastet.

Der Fragenblock auf Organisation erfüllt Answer-First bereits: Überschrift ist die Frage, der erste Satz beantwortet sie.

---

## 2 · Methodik in fünf Werkbänken

### 2.1 Seiten-Rewrite (Answer-First)

**Zweck:** Inhalte so bauen, dass Antwortmaschinen sie zitieren.
**Pflicht-Eingaben:** Ziel-URL, Ziel-Anfrage mit Absicht, Kunden-Stimme.
**Regeln:** Direktantwort 50 bis 70 Wörter an den Abschnittsanfang. Überschriften als Nutzerfragen. Jeder Absatz einzeln zitierbar, ohne Rückverweis auf Ungenanntes.
**Quelle:** wissen/01, wissen/06.

### 2.2 Schema-Erzeugung

**Zweck:** Entitäten und Fakten maschinenlesbar auszeichnen.
**Pflicht-Eingaben:** Seitentyp, verifizierte Entitäten-Fakten, Branchenkatalog.
**Regeln:** Nur verifizierte Fakten markieren. Widerspruch zu anderen Quellen ist ein Defekt. FAQPage nur als Signal, ohne Rich-Result-Erwartung. HowTo nicht einsetzen.
**Quelle:** wissen/02, wissen/06.

### 2.3 Technik-Prüfung

**Zweck:** Lesbarkeit für Crawler sichern.
**Pflicht-Eingaben:** Crawl-Export, Zugriff auf Search Console oder Rohbefunde.
**Regeln:** Kern-Inhalte ohne JavaScript lesbar, KI-Crawler rendern kein JavaScript. Statuscode-Hygiene. Sitemap nur mit kanonischen 200er-Adressen. Felddaten vor Labordaten.
**Quelle:** wissen/03, wissen/08.

### 2.4 Off-Page-Playbook

**Zweck:** Nennungen und Autorität ausserhalb der eigenen Seite.
**Pflicht-Eingaben:** Nennungs- und Linkdaten als Export, Ziel-Publikationen.
**Regeln:** Reihenfolge nach Konversionsnähe. Unverlinkte Nennungen zuerst. Kein Linkkauf, keine uniformen Anker.
**Quelle:** wissen/07.

### 2.5 GSC-Quick-Wins

**Zweck:** Position 8 bis 25 in Klicks überführen.
**Pflicht-Eingaben:** Export aus der Search Console mit Position, Impressionen, Klicks.
**Regeln:** Je Fund die eine Seitenänderung benennen, die den Aufstieg bewirkt. Wirkung im 28-Tage-Fenster nachhalten.
**Quelle:** wissen/09.

---

## 3 · Durchgangs-Protokoll

### 3.1 Die Seitenstruktur, abgelegt

**27 Seiten, neun je Sprache.** Deutsch hält die Wurzel.

| Kennung | Deutsch | Französisch | Englisch | Index |
|---|---|---|---|---|
| Start | `/` | `/fr/` | `/en/` | ja |
| Kulinarik | `/kulinarik` | `/fr/gastronomie` | `/en/food` | ja |
| Wein | `/wein` | `/fr/vin` | `/en/wine` | ja |
| Organisation | `/organisation` | `/fr/infos-pratiques` | `/en/practical` | ja |
| Anmeldung | `/anmeldung` | `/fr/inscription` | `/en/booking` | nein |
| AGB | `/agb` | `/fr/conditions-generales` | `/en/terms` | nein |
| Teilnahme | `/teilnahmebedingungen` | `/fr/conditions-participation` | `/en/participation` | nein |
| Impressum | `/impressum` | `/fr/mentions-legales` | `/en/imprint` | nein |
| Datenschutz | `/datenschutz` | `/fr/protection-des-donnees` | `/en/privacy` | nein |

**Zwölf indexierbare Seiten, fünfzehn auf `noindex`.**

Die Wegtabelle steht einmal, in `src/i18n/ui.ts`. Jede Änderung an einem Weg geht dort durch.

### 3.2 Die Entitäten, abgelegt

Jede Entität steht einmal, mit einer Bedeutung, im ganzen Auftritt. Synonyme erzeugen zwei Entitäten, und zwei Entitäten teilen die Autorität.

| Entität | Typ | Verifizierte Fakten | Quelle |
|---|---|---|---|
| Fernand Cina SA | Organization, Winery | Bahnhofstrasse 27, 3970 Salgesch · CHE-108.106.016 · gegründet 1956 · 20 Hektaren eigenes Rebland · 027 455 09 08 | Handelsregister, eigene Website |
| Clos du Cornalin | Place | Rebbergparzelle oberhalb Salgesch, im Besitz der Fernand Cina SA · Jahrgang 2020 mit 93.4 Punkten an der Expovina Wine Trophy Zürich | fernand-cina.ch |
| z'Wallis im Stah | FoodEvent | 19.09.2026, 10:00 bis 18:00 · CHF 145.00 · 50 Plätze · ab 18 Jahren · Anmeldeschluss 15.09.2026 | Mandat |
| Alisha Cina | Person | Dritte Generation · Winzerin und Weintechnologin, Ecole d'agriculture du Valais · seit 2024 Ecole d'Ingénieurs de Changins, Önologie | Mandat |
| Alain Lerjen | Person | Koch aus Zermatt, Maison 13 · Gault Millau 2021 | gaultmillau.ch |
| Maison 13 Catering | Organization | Küche des Anlasses | Mandat |
| BergBox GmbH | Organization | Talstrasse 3, 3930 Visp · Idee, Erzeugnisse, Projektleitung | Handelsregister |
| Yoline AG | Organization | Konsumgasse 7, 3970 Salgesch · CHE-409.670.864 · Website und Anmeldung | Handelsregister |

**Offen:** Geokoordinaten des Clos du Cornalin und der Kellerei. Ohne sie fehlt dem `Place` die Ortsangabe, die für lokale Antworten zählt.

### 3.3 Der Schema-Plan, abgelegt

| Seite | Heute | Soll | Neu |
|---|---|---|---|
| Start, alle Sprachen | FoodEvent nur auf Deutsch | FoodEvent je Sprache mit `inLanguage`, WebSite, Organization | ja |
| Kulinarik | keines | BreadcrumbList, Person Alain Lerjen | ja |
| Wein | keines | BreadcrumbList, Person Alisha Cina, Organization mit `award` | ja |
| Organisation | keines | BreadcrumbList, FAQPage | ja |
| Anmeldung, Rechtsseiten | keines | keines, sie tragen `noindex` | nein |

**Vier Ergänzungen zum bestehenden FoodEvent:**

1. `location` erhält `geo` mit Koordinaten, sobald sie vorliegen
2. `offers` erhält `validFrom`, damit der Verkaufszeitraum eindeutig ist
3. `organizer` und `performer` werden zu eigenen Entitäten mit `@id`, statt zu blossen Namen
4. `subEvent` entfällt. Ein Tag, ein Anlass

**FAQPage nur als Signal.** Die Rich Results für FAQ wurden am 7. Mai 2026 eingestellt. Der Block bleibt trotzdem, weil er Antwortmaschinen eindeutige Frage-Antwort-Paare liefert.

**HowTo wird nicht eingesetzt.** Der Typ ist eingestellt.

### 3.4 Protokoll der geprüften Werkstücke

| Datum | Werkbank | Gegenstand | Befund | Massnahme | Beleg | Status |
|---|---|---|---|---|---|---|
| 04.09.2026 | Technik | `/robots.txt` | Korrekt. `Allow: /`, Sitemap verwiesen, kein `Disallow`, das ein `noindex` verdecken würde | keine | Abruf, Status 200 | erledigt |
| 04.09.2026 | Technik | Auslieferung | `x-robots-tag: noindex` auf der Vercel-Adresse. Richtig, solange die Domain fehlt | Beim Aufschalten prüfen, dass es entfällt | Kopfzeile im Abruf | offen |
| 04.09.2026 | Technik | Rendering | Kern-Inhalte ohne JavaScript lesbar, statisch gebaut. KI-Crawler rendern kein JavaScript | keine | Quelltext `/fr/` | erledigt |
| 04.09.2026 | Technik | Sitemap-Verweis | `robots.txt` verweist auf `im-stah.ch/sitemap-index.xml`. Die Adresse besteht noch nicht | Beim Aufschalten prüfen | Abruf | offen |
| 04.09.2026 | Technik | hreflang | Vollständig, drei Sprachen plus `x-default` auf Deutsch, Canonical je Sprachfassung | keine | Quelltext `/fr/` | erledigt |
| 04.09.2026 | Technik | Bilder | `alt` in drei Sprachen, `width` und `height` gesetzt, WebP mit `srcset` | keine | Quelltext, Bericht vom 04.09. | erledigt |
| 04.09.2026 | Schema | Alle Seiten | Nur die deutsche Startseite trägt Auszeichnung. Achtzehn Seiten ohne | Schema-Plan nach 3.3 umsetzen | Quelltext `/fr/` ohne JSON-LD | offen |
| 04.09.2026 | Schema | Entitäten | Organisation, Personen und Ort sind unbenannt. Sie stehen als Zeichenketten, nicht als Entitäten | `@id` vergeben, Entitäten verknüpfen | JSON-LD der Startseite | offen |
| 04.09.2026 | Technik | Core Web Vitals | Nicht prüfbar. Felddaten setzen eine laufende Domain voraus | Nach dem Aufschalten messen | keine Daten | blockiert |
| 04.09.2026 | GSC | Sichtbarkeit | Nicht prüfbar. Kein Zugriff, keine Domain, keine Historie | Property einrichten nach dem Aufschalten | keine Daten | blockiert |

---

## 4 · Stimm-Nachweis

Es galt die **Kunden-Stimme**, brandvoice.json YL-FC-2026-008, ergänzt um die für diesen Anlass gesetzte Du-Form.

Die Yoline-Doktrin galt nicht und wurde nicht gemischt. Dieses Dokument selbst folgt der Yoline-Doktrin, weil es ein Yoline-eigenes Arbeitsdokument ist.

Bestätigt: keine Mischung.

---

## 5 · Wirkungs-Nachhaltung

Nichts davon misst sich vor dem Aufschalten der Domain.

| Werkstück | Messpunkt | Termin |
|---|---|---|
| Schema-Auszeichnung | Rich-Results-Test je Seitentyp, ohne Fehler | Tag der Aufschaltung |
| Indexierung | Search Console, zwölf Seiten erfasst, fünfzehn nicht | 14 Tage nach Aufschaltung |
| Core Web Vitals | Felddaten, LCP unter 2.5 s, INP unter 200 ms, CLS unter 0.1 | 28 Tage nach Aufschaltung |
| Zitierung in Antwortmaschinen | Prompt-Set gegen ChatGPT, Perplexity, Google AI Overviews | 28 Tage nach Aufschaltung |
| Anmeldungen nach Kanal | Auswertung aus YoSuite | 20. September 2026 |

**Das Prompt-Set gehört jetzt gebaut, nicht später.** Ohne Messung vor dem Anlass fehlt der Vergleichspunkt.

---

## 6 · Offenes und Zurückgewiesenes

### 6.1 Die Strukturfrage, die vor allem anderen entschieden gehört

**Was passiert am 20. September 2026 mit dieser Seite?**

Die Wege sind dauerhaft. Wer sie später ändert, verliert jede aufgebaute Autorität und braucht Weiterleitungen.

| Weg | Struktur | Folge |
|---|---|---|
| Einmaliger Anlass | `im-stah.ch/` trägt 2026 | Nach dem 19. September ist die Seite ein Archiv ohne Zukunft |
| Reihe | `im-stah.ch/` ist die Dachseite, `im-stah.ch/2026/` der Jahrgang | Autorität wächst über Jahre. Kostet heute einen Umbau der Wegtabelle |

**Empfehlung: die Reihe.** Der Aufwand liegt heute bei einer Stunde. Nach dem Anlass kostet dasselbe eine Woche und verliert Rangsignale.

Das ist ein strategischer Entscheid, kein technischer. Er gehört zu Marco.

### 6.2 Zurückgewiesen

| Werkstück | Grund |
|---|---|
| Seiten-Rewrite Start, Kulinarik, Wein | Answer-First widerspricht dem Verkaufstext. Begründet unter 1.3 |
| GSC-Quick-Wins | Pflicht-Eingaben fehlen vollständig |
| Off-Page-Playbook | Nennungsdaten fehlen. Ohne Strategie-Papier keine Priorisierung |
| Aussagen zu Rankings und Suchvolumen | Keine Datenzufuhr. Leitplanke 1 der Skill |

### 6.3 Offene Punkte

1. **Domain aufschalten.** Alles Weitere hängt daran
2. **Struktur der Reihe entscheiden.** Siehe 6.1
3. **Geokoordinaten** von Kellerei und Clos du Cornalin erheben
4. **Search Console** einrichten, drei Sprachfassungen als eine Property
5. **Prompt-Set** für die Zitier-Messung bauen, vor der Aufschaltung
6. **Off-Page-Entscheid.** Walliser Anlasskalender, Weindorf Salgesch, Valais Wallis Promotion. Ohne Strategie-Papier bleibt es eine Liste ohne Rangfolge
7. **Strategie-Papier.** Fehlt. Dieser Durchgang lief als dokumentierter Einzelauftrag

---

## Abnahme

- [x] Grundlage benannt, als dokumentierter Einzelauftrag
- [x] Jede Protokollzeile vollständig
- [x] Stimm-Nachweis vorhanden
- [x] Nachmess-Termine gesetzt
- [ ] Rendering-Abnahme im Geschäftsdrucksachen-Repo, ausstehend
