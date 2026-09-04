// Messung VOR dem Setzen. Die mittlere Verlaufsstufe wird per Stilblock
// erhoeht, nur auf der dunklen Passage und der Menueueberlagerung.
import { starte, B, halten, ruhig, kontrast } from './wolkenmess.mjs';

const stufe = (prozent) => `
  .wolken[data-flaeche="dunkel"] .wolke,
  .wolken[data-flaeche="menue"] .wolke{
    background:radial-gradient(closest-side,
      color-mix(in oklab, var(--ton) 34%, transparent) 0%,
      color-mix(in oklab, var(--ton) ${prozent}%, transparent) 44%,
      transparent 82%)!important;
  }`;

const wege = { de: ['/', '/kulinarik/', '/organisation/'], fr: ['/fr/', '/fr/gastronomie/', '/fr/infos-pratiques/'], en: ['/en/', '/en/food/', '/en/practical/'] };
const breiten = [[1920, 1080], [1440, 900], [1280, 800], [390, 844]];
const phasen = [0, 0.5, 1.0];

// [Name, Sprachindex des Weges, Rollziel, Behaelter, Text]
const stellen = [
  ['dunkel · Kopf', 0, '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark .head'],
  ['dunkel · Fliesstext', 0, '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark p.sec'],
  ['dunkel · Marke', 0, '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark .lab .stick'],
  ['dunkel · Register', 2, '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark .weg p'],
  ['dunkel · Marke Posten', 2, '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark .weg .mono'],
  ['dunkel · Menuezeile', 1, '.s-d.on-dark .mn', '.s-d.on-dark', '.s-d.on-dark .mn .ti'],
  ['dunkel · Weinspalte', 1, '.s-d.on-dark .mn', '.s-d.on-dark', '.s-d.on-dark .mn .wn'],
];

const prozente = process.argv.slice(2).map(Number);
const b = await starte();

async function mess(weg, vw, vh, behaelter, text, rollen, phase, p_) {
  const p = await b.newPage({ viewport: { width: vw, height: vh } });
  await p.goto(B + weg, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: ruhig + halten(phase) + (p_ === null ? '' : stufe(p_)) });
  await p.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'center' }); }, rollen);
  await p.waitForTimeout(1500);
  const r = await kontrast(p, behaelter, text);
  await p.close();
  return r ? r.verhaeltnis : null;
}

for (const pz of prozente) {
  console.log('\n' + (pz === 14 ? 'Mittlere Stufe 14 Prozent, der heutige Wert' : `Mittlere Stufe ${pz} Prozent`));
  let gesamt = 99;
  for (const [name, si, rollen, behaelter, text] of stellen) {
    const lang = Object.keys(wege)[0];
    let zeile = [], min = 99;
    for (const [sp, liste] of Object.entries(wege)) {
      for (const [vw, vh] of breiten) {
        let m = 99;
        for (const ph of phasen) {
          const v = await mess(liste[si], vw, vh, behaelter, text, rollen, ph, pz === 14 ? null : pz);
          if (v !== null && v < m) m = v;
        }
        if (m < 99) { zeile.push(`${sp}/${vw}: ${m.toFixed(2)}`); min = Math.min(min, m); }
      }
    }
    gesamt = Math.min(gesamt, min);
    console.log('  ' + (min >= 4.5 ? 'ok  ' : 'FEHL') + ' ' + name.padEnd(24) + 'kleinster ' + min.toFixed(2));
  }
  console.log('  kleinster Wert insgesamt: ' + gesamt.toFixed(2) + ' zu 1');
}
await b.close();
