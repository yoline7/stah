/**
 * Baut den gemeinsamen Graphen je Seite.
 *
 * Ein @graph je Seite, nicht mehrere einzelne Bloecke. Getrennte Bloecke
 * ohne Kennung erzeugen doppelte Entitaeten, und zwei Entitaeten teilen die
 * Autoritaet. Grundlage: docs/YL-SGU-2026-002_Schema-Plan.md.
 *
 * Diese Datei traegt keinen Text. Alles Sprachliche kommt als Argument aus
 * dem Woerterbuch, alle Zahlen aus anlass.ts, alle Betriebsfakten aus
 * schema.ts. Hier steht nur die Struktur.
 */
import { anlass } from "./anlass";
import { entitaeten, id } from "./schema";

export type Brotkrume = { name: string; url: string };
export type Frage = { f: string; a: string };

export type Bausatz = {
  /** Kennung der Seite, entscheidet ueber die Zusatzknoten */
  seite: "start" | "kulinarik" | "wein" | "organisation";
  /** Sprachkuerzel fuer inLanguage, etwa de-CH */
  sprache: string;
  /** kanonische Adresse der Seite, mit Schraegstrich am Ende */
  weg: string;
  /** Titel der Seite, wird zum Namen des WebPage */
  titel: string;
  /** Beschreibung aus dem Woerterbuch */
  beschreibung: string;
  /** Vorschaubild, absolute Adresse */
  bild: string;
  /** Adresse der Anmeldung in derselben Sprache */
  anmeldung: string;
  /** zwei Stufen, Start und diese Seite. Auf der Startseite leer */
  brotkrumen: Brotkrume[];
  /** Kennung der Hauptentitaet, etwa alain-lerjen */
  hauptsache?: string;
  /** Fragen aus dem sichtbaren Fragenblock, woertlich */
  fragen?: Frage[];
};

export function graph(b: Bausatz) {
  const knoten: Record<string, unknown>[] = [...(entitaeten as readonly Record<string, unknown>[])];

  /* Die Seite selbst. Traegt die Hauptentitaet und den Brotkrumenpfad. */
  const seite: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${b.weg}#seite`,
    url: b.weg,
    name: b.titel,
    description: b.beschreibung,
    inLanguage: b.sprache,
    isPartOf: { "@id": id("website") },
  };
  if (b.hauptsache) seite.mainEntity = { "@id": id(b.hauptsache) };
  if (b.brotkrumen.length) seite.breadcrumb = { "@id": `${b.weg}#pfad` };
  knoten.push(seite);

  /* Brotkrumen bilden Hierarchie ab, nie Sprungmarken. Zwei Stufen. */
  if (b.brotkrumen.length) {
    knoten.push({
      "@type": "BreadcrumbList",
      "@id": `${b.weg}#pfad`,
      itemListElement: b.brotkrumen.map((k, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: k.name,
        item: k.url,
      })),
    });
  }

  /* Der Anlass, auf allen drei Startseiten. */
  if (b.seite === "start") {
    knoten.push({
      "@type": "FoodEvent",
      "@id": id("anlass"),
      name: anlass.name,
      description: b.beschreibung,
      inLanguage: b.sprache,
      url: b.weg,
      image: b.bild,
      startDate: `${anlass.datumIso}T${anlass.beginn}:00+02:00`,
      endDate: `${anlass.datumIso}T${anlass.ende}:00+02:00`,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      maximumAttendeeCapacity: anlass.plaetze,
      typicalAgeRange: `${anlass.mindestalter}-`,
      location: { "@id": id("clos-du-cornalin") },
      organizer: { "@id": id("fernand-cina") },
      performer: [{ "@id": id("alisha-cina") }, { "@id": id("alain-lerjen") }],
      sponsor: [{ "@id": id("bergbox") }, { "@id": id("maison-13") }],
      offers: {
        "@type": "Offer",
        "@id": id("ticket"),
        price: anlass.preis.toFixed(2),
        priceCurrency: "CHF",
        url: b.anmeldung,
        availability: "https://schema.org/InStock",
        /* validFrom bleibt weg, der Verkaufsstart ist nicht gesetzt. */
        validThrough: `${anlass.anmeldeschlussIso}T23:59:00+02:00`,
      },
    });
  }

  /* Fragen und Antworten, woertlich aus dem sichtbaren Block. */
  if (b.fragen && b.fragen.length) {
    knoten.push({
      "@type": "FAQPage",
      "@id": `${b.weg}#fragen`,
      inLanguage: b.sprache,
      mainEntity: b.fragen.map((q) => ({
        "@type": "Question",
        name: q.f,
        acceptedAnswer: { "@type": "Answer", text: q.a },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": knoten };
}
