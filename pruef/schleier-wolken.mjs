// Schleier ueber dem Titelbild, im unguenstigsten Bild der Wolkenbewegung.
import { starte, B, halten, ruhig, kontrast } from './wolkenmess.mjs';

const wege = { de: '/', fr: '/fr/', en: '/en/' };
const breiten = [[1920, 1080], [1440, 900], [1280, 800], [390, 844]];
const phasen = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
const stufen = ['.36', '.38', '.40', '.42'];

const b = await starte();
async function mess(lang, weg, vw, vh, phase, stufe) {
  const p = await b.newPage({ viewport: { width: vw, height: vh } });
  await p.goto(B + weg, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: ruhig + halten(phase) + `.hero .veil{background:rgba(26,18,12,${stufe})!important}` });
  await p.waitForTimeout(1200);
  const r = await kontrast(p, '.hero', '.hero h1');
  await p.close();
  return r ? r.verhaeltnis : null;
}

// Schritt 1: je Fall die unguenstigste Phase bei .36
const faelle = [];
for (const [lang, weg] of Object.entries(wege)) for (const [vw, vh] of breiten) {
  let min = 99, mp = 0;
  for (const t of phasen) {
    const v = await mess(lang, weg, vw, vh, t, '.36');
    if (v !== null && v < min) { min = v; mp = t; }
  }
  faelle.push({ lang, weg, vw, vh, phase: mp, bei36: min });
  console.error(`  ${lang}/${vw} unguenstigste Phase ${mp}, bei .36: ${min.toFixed(2)}`);
}

// Schritt 2: alle Stufen an der jeweils unguenstigsten Phase
console.log('\nSchleier im unguenstigsten Bild der Wolkenbewegung\n');
for (const stufe of stufen) {
  const zeile = [];
  let min = 99;
  for (const f of faelle) {
    const v = await mess(f.lang, f.weg, f.vw, f.vh, f.phase, stufe);
    zeile.push(`${f.lang}/${f.vw}: ${v === null ? '-' : v.toFixed(2)}`);
    if (v !== null) min = Math.min(min, v);
  }
  console.log(`Schleier ${stufe}  kleinster ${min.toFixed(2)}  ${zeile.join('  ')}`);
}
await b.close();
