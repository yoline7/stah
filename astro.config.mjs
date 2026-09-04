import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { sprachen, seiten, pfad, kuerzel, standard } from './src/i18n/ui';

/* Seiten ohne Eintrag im Verzeichnis: Anmeldung und die vier Rechtstexte tragen noindex. */
const verborgen = new Set(['anmeldung', 'agb', 'teilnahme', 'impressum', 'datenschutz']);
const offen = seiten.filter((s) => !verborgen.has(s));

/* Einheitliche Schreibweise eines Weges, damit Wurzel und Unterseite gleich behandelt werden. */
const schluessel = (weg) => weg.replace(/\/+$/, '') || '/';
const abschluss = (weg) => (weg.endsWith('/') ? weg : `${weg}/`);

/* Weg zurueck auf die Seitenkennung, damit jede Adresse ihre Schwestern kennt. */
const kennung = new Map();
for (const s of seiten) for (const l of sprachen) kennung.set(schluessel(pfad(l, s)), s);

export default defineConfig({
  site: 'https://im-stah.ch',
  i18n: {
    defaultLocale: standard,
    locales: [...sprachen],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (seite) => {
        const s = kennung.get(schluessel(new URL(seite).pathname));
        return s !== undefined && offen.includes(s);
      },
      serialize: (eintrag) => {
        const s = kennung.get(schluessel(new URL(eintrag.url).pathname));
        if (!s) return eintrag;
        return {
          ...eintrag,
          links: sprachen.map((l) => ({
            lang: kuerzel[l].html,
            url: new URL(abschluss(pfad(l, s)), 'https://im-stah.ch').href,
          })),
        };
      },
    }),
  ],
  build: { format: 'directory' },
});
