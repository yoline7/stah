/**
 * Die fuenf Flaechen, die Wolken tragen, und ihre Anzahl.
 * Einzige Quelle. Die Deckkraft je Flaeche steht in site.css unter --grund,
 * weil sie zur Gestaltung gehoert und nicht zur Struktur.
 */
export const flaechen = {
  hero: 2,    // Titelbild, ueber dem Foto und unter dem Schleier
  dunkel: 3,  // Menue und Ausklang, die dunkle Passage
  fakten: 2,  // Abschluss mit dem Faktenfeld
  menue: 2,   // Menueueberlagerung, wenn offen
  fuss: 1,    // Partnerband und Fuss
} as const;

export type Flaeche = keyof typeof flaechen;
