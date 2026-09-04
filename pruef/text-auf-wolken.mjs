import { starte, B, halten, kontrast, ruhig } from './wolkenmess.mjs';

const faelle = [
  // [Name, Weg, Rollziel, Behaelter, Text]
  ['dunkel · Kopf',        '/', '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark .head'],
  ['dunkel · Fliesstext',  '/', '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark p.sec'],
  ['dunkel · Marke',       '/', '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark .lab .stick'],
  ['dunkel · Register',    '/organisation/', '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark .weg p'],
  ['dunkel · Marke Posten','/organisation/', '.s-e.on-dark', '.s-e.on-dark', '.s-e.on-dark .weg .mono'],
  ['dunkel · Menuezeile',  '/kulinarik/', '.s-d.on-dark .mn', '.s-d.on-dark', '.s-d.on-dark .mn .ti'],
  ['dunkel · Weinspalte',  '/kulinarik/', '.s-d.on-dark .mn', '.s-d.on-dark', '.s-d.on-dark .mn .wn'],
  ['fakten · Zahl',        '/', '.facts', '.facts', '.facts b'],
  ['fakten · Beschriftung','/', '.facts', '.facts', '.facts .mono'],
  ['fuss · Partnermarke',  '/', '.deep', '.deep', '.deep .partners .mono.sec'],
  ['fuss · Fussverweise',  '/', 'footer', 'footer', 'footer .in-f'],
];

const phasen = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
const ohneWolken = process.argv.includes('--ohne');
const wegDamit = '.wolken{display:none!important}';
const b = await starte();
let schlimmster = 99;
console.log((ohneWolken ? 'Grundlinie OHNE Wolken' : 'Text auf bewolkten Flaechen, unguenstigstes Bild aus sechs Phasen') + ', 1440 mal 900\n');
for (const [name, weg, rollen, behaelter, text] of faelle) {
  let min = 99, minPhase = null;
  for (const t of (ohneWolken ? [0] : phasen)) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(B + weg, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    await p.addStyleTag({ content: ruhig + halten(t) + (ohneWolken ? wegDamit : '') });
    await p.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'center' }); }, rollen);
    await p.waitForTimeout(2200);   // Zahlen zaehlen 900 ms, danach steht das Bild
    const r = await kontrast(p, behaelter, text);
    await p.close();
    if (r && r.verhaeltnis < min) { min = r.verhaeltnis; minPhase = t; }
  }
  if (min === 99) { console.log('  ' + name.padEnd(24) + ' nicht messbar'); continue; }
  schlimmster = Math.min(schlimmster, min);
  const zeichen = min >= 4.5 ? 'ok  ' : 'FEHL';
  console.log('  ' + zeichen + ' ' + name.padEnd(24) + min.toFixed(2) + ' : 1   (Phase ' + minPhase + ')');
}
console.log('\nkleinster Wert:', schlimmster.toFixed(2), ': 1');
await b.close();
