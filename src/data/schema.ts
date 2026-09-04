/**
 * Die zehn Entitaeten des gemeinsamen Graphen.
 *
 * Grundlage: docs/YL-SGU-2026-002_Schema-Plan.md, Kapitel 2 und 3.
 * Jede Angabe hier ist belegt. Was nicht belegt ist, steht nicht drin und
 * ist im README unter «Offene Punkte» geführt.
 *
 * Kennungen liegen auf der Zieldomain, auch solange die Seite auf Vercel
 * laeuft. Eine Kennung ist eine Identitaet, keine Adresse. Deshalb steht
 * die Wurzel hier fest und nicht aus Astro.site.
 *
 * Zahlen, Daten und Preise des Anlasses stehen nicht hier, sondern in
 * anlass.ts. Diese Datei traegt nur sprachneutrale Fakten zu Betrieben,
 * Menschen und Orten.
 */
import { anlass } from "./anlass";

/** Wurzel jeder Kennung. Nie auf vercel.app zeigen. */
export const wurzel = "https://im-stah.ch/";

/** Kennung einer Entitaet im Graphen. */
export const id = (name: string) => `${wurzel}#${name}`;

const wallis = { addressRegion: "Wallis", addressCountry: "CH" } as const;

const anschrift = (strasse: string, plz: string, ort: string) => ({
  "@type": "PostalAddress",
  streetAddress: strasse,
  postalCode: plz,
  addressLocality: ort,
  ...wallis,
});

const uid = (wert: string) => ({
  "@type": "PropertyValue",
  propertyID: "UID",
  value: wert,
});

/**
 * Vorbereitet, bleibt aus. Sobald die Koordinaten der Kellerei und des
 * Clos du Cornalin vorliegen, erhaelt jeder Place diesen Block:
 *
 *   geo: { "@type": "GeoCoordinates", latitude: 0.000000, longitude: 0.000000 }
 *
 * Bis dahin nicht auszeichnen. Ohne Koordinaten fehlt beiden Orten der
 * Ortsbezug, der fuer lokale Antworten zaehlt. Siehe README, Offene Punkte.
 */

export const entitaeten = [
  {
    "@type": "WebSite",
    "@id": id("website"),
    url: wurzel,
    name: anlass.name,
    inLanguage: ["de-CH", "fr-CH", "en"],
    publisher: { "@id": id("fernand-cina") },
  },
  {
    "@type": ["Organization", "Winery"],
    "@id": id("fernand-cina"),
    name: "Fernand Cina SA",
    url: "https://www.fernand-cina.ch/",
    foundingDate: "1956",
    identifier: uid("CHE-108.106.016"),
    address: anschrift("Bahnhofstrasse 27", "3970", "Salgesch"),
    telephone: "+41274550908",
    email: anlass.mail,
    award: "Expovina Wine Trophy Zürich, höchstbenotete Goldmedaille mit 93.4 Punkten für den Cornalin Clos du Cornalin 2020",
    sameAs: [
      "https://www.instagram.com/fernand.cina/",
      "https://www.facebook.com/fernandcina/",
    ],
  },
  {
    "@type": "Organization",
    "@id": id("soulfood"),
    name: "Soulfood by Alain GmbH",
    identifier: uid("CHE-470.322.511"),
    address: anschrift("Wiestibodenweg 84", "3920", "Zermatt"),
    sameAs: ["https://www.instagram.com/soulfood_by_alain/"],
    founder: { "@id": id("alain-lerjen") },
  },
  {
    "@type": "Organization",
    "@id": id("maison-13"),
    name: "Maison 13 GmbH",
    url: "https://www.maison13.ch/",
    identifier: uid("CHE-487.015.661"),
    address: anschrift("Torweg 3", "3930", "Visp"),
    sameAs: ["https://www.instagram.com/maison13.swiss/"],
  },
  {
    "@type": "Organization",
    "@id": id("bergbox"),
    name: "BergBox GmbH",
    url: "https://bergbox.ch/",
    foundingDate: "2020",
    identifier: uid("CHE-402.156.454"),
    address: anschrift("Talstrasse 3", "3930", "Visp"),
    email: "info@bergbox.ch",
    telephone: "+41797147779",
    sameAs: ["https://www.facebook.com/bergbox.ch/"],
  },
  {
    "@type": "Organization",
    "@id": id("yoline"),
    name: "Yoline AG",
    url: "https://yoline.ch",
    identifier: uid("CHE-409.670.864"),
    address: anschrift("Konsumgasse 7", "3970", "Salgesch"),
  },
  {
    "@type": "Person",
    "@id": id("alisha-cina"),
    name: "Alisha Cina",
    jobTitle: "Winzerin und Weintechnologin",
    worksFor: { "@id": id("fernand-cina") },
    alumniOf: [
      { "@type": "EducationalOrganization", name: "Ecole d’agriculture du Valais" },
      { "@type": "EducationalOrganization", name: "Ecole d’Ingénieurs de Changins" },
    ],
    knowsLanguage: ["de-CH", "fr-CH"],
  },
  {
    "@type": "Person",
    "@id": id("alain-lerjen"),
    name: "Alain Lerjen",
    jobTitle: "Koch",
    worksFor: [{ "@id": id("soulfood") }, { "@id": id("maison-13") }],
    knowsLanguage: ["de-CH", "fr-CH"],
  },
  {
    "@type": "Place",
    "@id": id("clos-du-cornalin"),
    name: anlass.ort,
    description: "Rebbergparzelle oberhalb von Salgesch, im Besitz der Fernand Cina SA",
    address: {
      "@type": "PostalAddress",
      postalCode: "3970",
      addressLocality: anlass.dorf,
      ...wallis,
    },
  },
  {
    "@type": "Place",
    "@id": id("kellerei"),
    name: "Kellerei Fernand Cina",
    address: anschrift("Bahnhofstrasse 27", "3970", anlass.dorf),
  },
] as const;
