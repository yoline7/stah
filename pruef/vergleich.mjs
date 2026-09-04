// Stellt jede Ueberschrift und jeden Leitsatz der drei Fassungen nebeneinander
import { de } from '../src/i18n/de.ts';
import { fr } from '../src/i18n/fr.ts';
import { en } from '../src/i18n/en.ts';

const flach = (o, vor = '') => {
  const raus = {};
  for (const [k, v] of Object.entries(o)) {
    const weg = vor ? `${vor}.${k}` : k;
    if (typeof v === 'string') raus[weg] = v;
    else if (Array.isArray(v)) v.forEach((e, i) => {
      if (typeof e === 'string') raus[`${weg}[${i}]`] = e;
      else Object.assign(raus, flach(e, `${weg}[${i}]`));
    });
    else if (v && typeof v === 'object') Object.assign(raus, flach(v, weg));
  }
  return raus;
};
const D = flach(de), F = flach(fr), E = flach(en);

const schluessel = Object.keys(D);
const fehltFr = schluessel.filter((k) => !(k in F));
const fehltEn = schluessel.filter((k) => !(k in E));
const zuvielFr = Object.keys(F).filter((k) => !(k in D));
const zuvielEn = Object.keys(E).filter((k) => !(k in D));
console.log('Felder deutsch:', schluessel.length, '| fehlt fr:', fehltFr.length, '| fehlt en:', fehltEn.length,
            '| ueberzaehlig fr:', zuvielFr.length, '| ueberzaehlig en:', zuvielEn.length);
if (fehltFr.length) console.log('  fehlt fr:', fehltFr.join(', '));
if (fehltEn.length) console.log('  fehlt en:', fehltEn.join(', '));
if (zuvielFr.length) console.log('  ueberzaehlig fr:', zuvielFr.join(', '));
if (zuvielEn.length) console.log('  ueberzaehlig en:', zuvielEn.join(', '));

// Koepfe und Leitsaetze: h1, h2, lab, sub, bruecke, die ersten Absaetze
const istKopf = (k) => /(^|\.)h1(\[|$)|(^|\.)h2(\[|$)|(^|\.)lab$|(^|\.)sub$|^bruecke$|(^|\.)p1$|(^|\.)nach$|(^|\.)m$|(^|\.)t$|(^|\.)titel$/.test(k);
const nurRest = process.argv.includes('--rest');
const auswahl = schluessel.filter((k) => (nurRest ? !istKopf(k) : istKopf(k)));
console.log('\nKoepfe und Leitsaetze:', auswahl.length, 'Stellen\n');
for (const k of auswahl) {
  console.log(k);
  console.log('  de  ' + D[k]);
  console.log('  fr  ' + (F[k] ?? '(fehlt)'));
  console.log('  en  ' + (E[k] ?? '(fehlt)'));
}
