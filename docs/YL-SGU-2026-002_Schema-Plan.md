# Schema-Plan · z'Wallis im Stah

**Referenz:** YL-SGU-2026-002 · 4. September 2026
**Grundlage:** YL-SGU-2026-001, Kapitel 3.3

---

## 1 · Grundsätze

**Ein Graph je Seite, nicht viele einzelne Blöcke.** Getrennte Blöcke ohne Kennung erzeugen doppelte Entitäten. Ein `@graph` mit `@id` verknüpft sie.

**Nur verifizierte Fakten.** Jede Angabe unten hat eine Quelle. Was fehlt, steht als offener Punkt und wird nicht ergänzt.

**Kennungen auf der Zieldomain.** Alle `@id` beginnen mit `https://im-stah.ch/`. Auch solange die Seite auf Vercel läuft. Die Kennung ist eine Identität, keine Adresse.

**Sichtbarkeit vor Auszeichnung.** Ausgezeichnet wird nur, was auf derselben Seite steht. Das gilt besonders für den Fragenblock.

---

## 2 · Verifizierte Fakten

| Entität | Fakt | Quelle |
|---|---|---|
| Fernand Cina SA | Bahnhofstrasse 27, 3970 Salgesch, CHE-108.106.016, 027 455 09 08, gegründet 1956, 20 Hektaren | Handelsregister, fernand-cina.ch |
| Clos du Cornalin | Rebbergparzelle oberhalb Salgesch, Jahrgang 2020 mit 93.4 Punkten an der Expovina Wine Trophy Zürich | fernand-cina.ch |
| Soulfood by Alain GmbH | Zermatt, CHE-470.322.511, c/o Lerjen Alain, Wiestibodenweg 84, 3920 Zermatt, Statutendatum 21.05.2021 | Handelsregister, Moneyhouse |
| Alain Lerjen | Koch aus Zermatt, Inhaber von Soulfood by Alain GmbH, arbeitet mit Maison 13 | Handelsregister, Gault Millau 2021 |
| Alisha Cina | Dritte Generation, Winzerin und Weintechnologin, Ecole d'agriculture du Valais, seit 2024 Ecole d'Ingénieurs de Changins | Mandat |
| BergBox GmbH | Talstrasse 3, 3930 Visp | Handelsregister |
| Yoline AG | Konsumgasse 7, 3970 Salgesch, CHE-409.670.864 | Handelsregister |
| Instagram Soulfood | `@soulfood_by_alain` | Instagram |
| Maison 13 GmbH | Torweg 3, 3930 Visp, CHE-487.015.661, Statutendatum 03.10.2025, maison13.ch | Handelsregister, Moneyhouse, Locaris |
| BergBox GmbH | Talstrasse 3, 3930 Visp, CHE-402.156.454, Statutendatum 30.06.2020, bergbox.ch, info@bergbox.ch, 079 714 7779 | Handelsregister, Locaris, bergbox.ch |
| Instagram Maison 13 | `@maison13.swiss` | Instagram |
| Instagram Fernand Cina | `@fernand.cina` | Instagram |
| Facebook Fernand Cina | `facebook.com/fernandcina` | Facebook |
| Facebook BergBox | `facebook.com/bergbox.ch` | Facebook |
| Fernand Cina, Übergabe | 1987 an Manfred und Damian Cina | fernand-cina.ch |
| Fernand Cina, Sortiment | rund 40 verschiedene Weine | fernand-cina.ch |

**Ein Widerspruch, ungelöst gemeldet.** Zur Rebfläche kursieren drei Zahlen:

| Quelle | Angabe |
|---|---|
| fernand-cina.ch | 20 Hektaren |
| valais.ch | 16 Hektaren |
| sierretourisme.ch, vinum-montis.ch | 18 Hektaren |

Die eigene Website ist die massgebende Quelle, also 20 Hektaren. Der Widerspruch gehört mit dem Mandanten geklärt, damit die Fremdverzeichnisse nachgeführt werden. Zwei Entitäten mit verschiedenen Zahlen schwächen die Autorität.

**Offen, nicht auszeichnen bis belegt:**

- Geokoordinaten von Kellerei und Clos du Cornalin
- Telefonnummer von Soulfood by Alain GmbH
- Instagram oder Website von Soulfood ausserhalb des Profils

---

## 3 · Der gemeinsame Graph

Steht im Basis-Layout, auf allen zwölf indexierbaren Seiten. `{lang}` wird je Sprache gesetzt, `{url}` ist die kanonische Adresse der Seite.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://im-stah.ch/#website",
      "url": "https://im-stah.ch/",
      "name": "z'Wallis im Stah",
      "inLanguage": ["de-CH", "fr-CH", "en"],
      "publisher": { "@id": "https://im-stah.ch/#fernand-cina" }
    },
    {
      "@type": ["Organization", "Winery"],
      "@id": "https://im-stah.ch/#fernand-cina",
      "name": "Fernand Cina SA",
      "url": "https://www.fernand-cina.ch/",
      "foundingDate": "1956",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "UID",
        "value": "CHE-108.106.016"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bahnhofstrasse 27",
        "postalCode": "3970",
        "addressLocality": "Salgesch",
        "addressRegion": "Wallis",
        "addressCountry": "CH"
      },
      "telephone": "+41274550908",
      "email": "administration@fernand-cina.ch",
      "award": "Expovina Wine Trophy Zürich, höchstbenotete Goldmedaille mit 93.4 Punkten für den Cornalin Clos du Cornalin 2020",
      "sameAs": [
        "https://www.instagram.com/fernand.cina/",
        "https://www.facebook.com/fernandcina/"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://im-stah.ch/#soulfood",
      "name": "Soulfood by Alain GmbH",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "UID",
        "value": "CHE-470.322.511"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Wiestibodenweg 84",
        "postalCode": "3920",
        "addressLocality": "Zermatt",
        "addressRegion": "Wallis",
        "addressCountry": "CH"
      },
      "sameAs": ["https://www.instagram.com/soulfood_by_alain/"],
      "founder": { "@id": "https://im-stah.ch/#alain-lerjen" }
    },
    {
      "@type": "Organization",
      "@id": "https://im-stah.ch/#maison-13",
      "name": "Maison 13 GmbH",
      "url": "https://www.maison13.ch/",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "UID",
        "value": "CHE-487.015.661"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Torweg 3",
        "postalCode": "3930",
        "addressLocality": "Visp",
        "addressRegion": "Wallis",
        "addressCountry": "CH"
      },
      "sameAs": ["https://www.instagram.com/maison13.swiss/"]
    },
    {
      "@type": "Organization",
      "@id": "https://im-stah.ch/#bergbox",
      "name": "BergBox GmbH",
      "url": "https://bergbox.ch/",
      "foundingDate": "2020",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "UID",
        "value": "CHE-402.156.454"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Talstrasse 3",
        "postalCode": "3930",
        "addressLocality": "Visp",
        "addressRegion": "Wallis",
        "addressCountry": "CH"
      },
      "email": "info@bergbox.ch",
      "telephone": "+41797147779",
      "sameAs": ["https://www.facebook.com/bergbox.ch/"]
    },
    {
      "@type": "Organization",
      "@id": "https://im-stah.ch/#yoline",
      "name": "Yoline AG",
      "url": "https://yoline.ch",
      "identifier": {
        "@type": "PropertyValue",
        "propertyID": "UID",
        "value": "CHE-409.670.864"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Konsumgasse 7",
        "postalCode": "3970",
        "addressLocality": "Salgesch",
        "addressRegion": "Wallis",
        "addressCountry": "CH"
      }
    },
    {
      "@type": "Person",
      "@id": "https://im-stah.ch/#alisha-cina",
      "name": "Alisha Cina",
      "jobTitle": "Winzerin und Weintechnologin",
      "worksFor": { "@id": "https://im-stah.ch/#fernand-cina" },
      "alumniOf": [
        { "@type": "EducationalOrganization", "name": "Ecole d'agriculture du Valais" },
        { "@type": "EducationalOrganization", "name": "Ecole d'Ingénieurs de Changins" }
      ],
      "knowsLanguage": ["de-CH", "fr-CH"]
    },
    {
      "@type": "Person",
      "@id": "https://im-stah.ch/#alain-lerjen",
      "name": "Alain Lerjen",
      "jobTitle": "Koch",
      "worksFor": [
        { "@id": "https://im-stah.ch/#soulfood" },
        { "@id": "https://im-stah.ch/#maison-13" }
      ],
      "knowsLanguage": ["de-CH", "fr-CH"]
    },
    {
      "@type": "Place",
      "@id": "https://im-stah.ch/#clos-du-cornalin",
      "name": "Clos du Cornalin",
      "description": "Rebbergparzelle oberhalb von Salgesch, im Besitz der Fernand Cina SA",
      "address": {
        "@type": "PostalAddress",
        "postalCode": "3970",
        "addressLocality": "Salgesch",
        "addressRegion": "Wallis",
        "addressCountry": "CH"
      }
    },
    {
      "@type": "Place",
      "@id": "https://im-stah.ch/#kellerei",
      "name": "Kellerei Fernand Cina",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bahnhofstrasse 27",
        "postalCode": "3970",
        "addressLocality": "Salgesch",
        "addressRegion": "Wallis",
        "addressCountry": "CH"
      }
    }
  ]
}
```

**Sobald die Koordinaten vorliegen,** erhalten beide `Place` einen Block:

```json
"geo": { "@type": "GeoCoordinates", "latitude": 0.000000, "longitude": 0.000000 }
```

Ohne Koordinaten fehlt der Ortsbezug, der für lokale Antworten zählt. Das ist der wertvollste offene Punkt.

---

## 4 · Startseite, je Sprache

Ergänzt den gemeinsamen Graph. `{lang}` ist `de-CH`, `fr-CH` oder `en`. `{url}` ist `https://im-stah.ch/`, `/fr/` oder `/en/`.

```json
{
  "@type": "FoodEvent",
  "@id": "https://im-stah.ch/#anlass",
  "name": "z'Wallis im Stah",
  "description": "{beschreibung aus dem Wörterbuch}",
  "inLanguage": "{lang}",
  "url": "{url}",
  "image": "https://im-stah.ch/preview.jpg",
  "startDate": "2026-09-19T10:00:00+02:00",
  "endDate": "2026-09-19T18:00:00+02:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "maximumAttendeeCapacity": 50,
  "typicalAgeRange": "18-",
  "location": { "@id": "https://im-stah.ch/#clos-du-cornalin" },
  "organizer": { "@id": "https://im-stah.ch/#fernand-cina" },
  "performer": [
    { "@id": "https://im-stah.ch/#alisha-cina" },
    { "@id": "https://im-stah.ch/#alain-lerjen" }
  ],
  "sponsor": [
    { "@id": "https://im-stah.ch/#bergbox" },
    { "@id": "https://im-stah.ch/#maison-13" }
  ],
  "offers": {
    "@type": "Offer",
    "@id": "https://im-stah.ch/#ticket",
    "price": "145.00",
    "priceCurrency": "CHF",
    "url": "{url}anmeldung",
    "availability": "https://schema.org/InStock",
    "validThrough": "2026-09-15T23:59:00+02:00"
  }
}
```

**Vier Änderungen gegenüber heute:**

1. `location`, `organizer` und `performer` verweisen auf Entitäten statt auf Zeichenketten
2. `sponsor` benennt BergBox und Maison 13
3. `inLanguage` je Sprachfassung, der Block läuft auf allen drei Startseiten
4. `offers.url` zeigt auf die Anmeldung in derselben Sprache

**`validFrom` fehlt bewusst.** Der Verkaufsstart ist nicht gesetzt. Sobald er steht, gehört er hinein.

---

## 5 · Unterseiten

### Kulinarik

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "{Start}", "item": "{url_start}" },
    { "@type": "ListItem", "position": 2, "name": "{Kulinarik}", "item": "{url_seite}" }
  ]
}
```

Dazu auf derselben Seite `"mainEntity": { "@id": "https://im-stah.ch/#alain-lerjen" }` auf dem `WebPage`.

### Wein

Gleicher Breadcrumb, `mainEntity` verweist auf `#alisha-cina`.

### Organisation

Gleicher Breadcrumb, dazu `FAQPage`.

**Die Fragen werden aus dem sichtbaren Fragenblock erzeugt, nicht erfunden.** Jede ausgezeichnete Frage muss wörtlich auf der Seite stehen, mit ihrer Antwort. Das ist Bedingung, kein Stil.

```json
{
  "@type": "FAQPage",
  "@id": "{url_seite}#fragen",
  "inLanguage": "{lang}",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{Fragetext, wörtlich aus dem Wörterbuch}",
      "acceptedAnswer": { "@type": "Answer", "text": "{Antworttext, wörtlich}" }
    }
  ]
}
```

Die Rich Results für FAQ wurden am 7. Mai 2026 eingestellt. Der Block bleibt als Signal für Antwortmaschinen.

### Anmeldung und Rechtsseiten

Kein Schema. Sie tragen `noindex`.

---

## 6 · Was nicht ausgezeichnet wird

| Typ | Grund |
|---|---|
| `HowTo` | Eingestellt |
| `Menu` mit den sechs Gängen | Die Weine bleiben bis zum Anlass offen. Eine Auszeichnung, die mehr verrät als die Seite, ist ein Widerspruch |
| `AggregateRating` | Keine Bewertungen. Erfundene Bewertungen sind ein Verstoss |
| `Review` | Dasselbe |
| `LocalBusiness` für den Anlass | Der Anlass ist kein Betrieb. Fernand Cina ist als Organization ausgezeichnet |

---

## 7 · Prüfung

Nach dem Einbau, je Seitentyp und je Sprache:

1. Rich-Results-Test von Google, ohne Fehler
2. Schema-Markup-Validator von schema.org, ohne Fehler
3. Jede `@id` ist genau einmal definiert und beliebig oft referenziert
4. Jede ausgezeichnete Frage steht wörtlich sichtbar auf derselben Seite
5. Keine Kennung zeigt auf `vercel.app`
6. Kein Platzhalter, kein `...`, keine leere Zeichenkette
