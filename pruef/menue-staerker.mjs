// Menueueberlagerung, drei Sprachen, vier Breiten, fuenf Phasen.
// Messung vor dem Setzen: die mittlere Verlaufsstufe wird per Stilblock erhoeht.
import { starte, B, halten, ruhig, kontrast } from './wolkenmess.mjs';

const stufe = (prozent) => `
  .wolken[data-flaeche="dunkel"] .wolke,
  .wolken[data-flaeche="menue"] .wolke{
    background:radial-gradient(closest-side,
      color-mix(in oklab, var(--ton) 34%, transparent) 0%,
      color-mix(in oklab, var(--ton) ${prozent}%, transparent) 44%,
      transparent 82%)!important;
  }`;

const wege = { de: '/', fr: '/fr/', en: '/en/' };
const breiten = [[1920, 1080], [1440, 900], [1280, 800], [390, 844]];
const phasen = [0, 0.25, 0.5, 0.75, 1];
const stellen = [['Menuezeile', '.mnu .ln .t'], ['Fuss im Menue', '.mnu .fuss span'], ['Umschalter', '.mnu .spr a']];
const ohneKopf = ruhig.replace('#hd{display:none!important;}', '');

const prozente = process.argv.slice(2).map(Number);
const b = await starte();

for (const pz of prozente) {
  console.log('\nMenue, mittlere Stufe ' + pz + ' Prozent' + (pz === 14 ? ' (heutiger Wert)' : ''));
  let gesamt = 99;
  for (const [name, sel] of stellen) {
    let min = 99;
    for (const [sp, weg] of Object.entries(wege)) {
      for (const [vw, vh] of breiten) {
        for (const ph of phasen) {
          const q = await b.newPage({ viewport: { width: vw, height: vh } });
          await q.goto(B + weg, { waitUntil: 'load' });
          await q.evaluate(() => document.fonts.ready);
          await q.addStyleTag({ content: ohneKopf + halten(ph) + (pz === 14 ? '' : stufe(pz)) });
          await q.click('#bg');
          await q.waitForTimeout(1800);
          const r = await kontrast(q, '.mnu', sel);
          await q.close();
          if (r && r.verhaeltnis < min) min = r.verhaeltnis;
        }
      }
    }
    gesamt = Math.min(gesamt, min);
    console.log('  ' + (min >= 4.5 ? 'ok  ' : 'FEHL') + ' ' + name.padEnd(16) + 'kleinster ' + min.toFixed(2));
  }
  console.log('  kleinster Wert insgesamt: ' + gesamt.toFixed(2) + ' zu 1');
}
await b.close();
