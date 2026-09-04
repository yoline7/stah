/**
 * Sprachen, Wege und Nachschlag.
 *
 * Die Texte liegen in de.ts, fr.ts und en.ts. Die Seiten holen sie ueber t(lang).
 * Die Wegtabelle uebersetzt auch die Seitennamen: /kulinarik, /fr/gastronomie,
 * /en/food. Deutsch laeuft ohne Praefix, die Wurzel gehoert ihr.
 */
import { de } from "./de";
import { fr } from "./fr";
import { en } from "./en";

export const sprachen = ["de", "fr", "en"] as const;
export type Sprache = (typeof sprachen)[number];
export const standard: Sprache = "de";

export const woerterbuch = { de, fr, en } as const;
export type Texte = typeof de;

/** Nachschlag fuer eine Sprache. Fehlt ein Eintrag, faellt er auf Deutsch zurueck. */
export function t(lang: Sprache): Texte {
  return woerterbuch[lang] as Texte;
}

/** Kennung je Seite, davon haengen Wege, Titel und Umschalter ab. */
export const seiten = [
  "start", "kulinarik", "wein", "organisation",
  "anmeldung", "agb", "teilnahme", "impressum", "datenschutz",
] as const;
export type Seite = (typeof seiten)[number];

/** Seitenname je Sprache. Ein franzoesischer Gast liest /fr/gastronomie. */
export const wege: Record<Seite, Record<Sprache, string>> = {
  start:        { de: "",                     fr: "",                          en: "" },
  kulinarik:    { de: "kulinarik",            fr: "gastronomie",               en: "food" },
  wein:         { de: "wein",                 fr: "vin",                       en: "wine" },
  organisation: { de: "organisation",         fr: "infos-pratiques",           en: "practical" },
  anmeldung:    { de: "anmeldung",            fr: "inscription",               en: "booking" },
  agb:          { de: "agb",                  fr: "conditions-generales",      en: "terms" },
  teilnahme:    { de: "teilnahmebedingungen", fr: "conditions-participation",  en: "participation" },
  impressum:    { de: "impressum",            fr: "mentions-legales",          en: "imprint" },
  datenschutz:  { de: "datenschutz",          fr: "protection-des-donnees",    en: "privacy" },
};

/** Weg zu einer Seite in einer Sprache, immer mit fuehrendem Schraegstrich. */
export function pfad(lang: Sprache, seite: Seite): string {
  const name = wege[seite][lang];
  const vor = lang === standard ? "" : `/${lang}`;
  return name ? `${vor}/${name}` : `${vor}/`;
}

/** Sprachkuerzel fuer das lang-Attribut und og:locale. */
export const kuerzel: Record<Sprache, { html: string; og: string }> = {
  de: { html: "de-CH", og: "de_CH" },
  fr: { html: "fr-CH", og: "fr_CH" },
  en: { html: "en",    og: "en" },
};

/** Alle Fassungen einer Seite, fuer hreflang und den Umschalter. */
export function fassungen(seite: Seite): { lang: Sprache; weg: string; html: string }[] {
  return sprachen.map((l) => ({ lang: l, weg: pfad(l, seite), html: kuerzel[l].html }));
}
