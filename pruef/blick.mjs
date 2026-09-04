import { starte, B, halten, ruhig } from './wolkenmess.mjs';
const b = await starte();
const ziele = [
  ['facts', '/', '.facts'],
  ['dunkel', '/', '.s-e.on-dark'],
  ['hero', '/', '.hero'],
  ['fuss', '/', 'footer'],
  ['partner', '/', '.deep'],
];
const t = process.argv[2] ? Number(process.argv[2]) : 0.6;
for (const [name, weg, sel] of ziele) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(B + weg, { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.addStyleTag({ content: ruhig + halten(t) });
  await p.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'center' }); }, sel);
  await p.waitForTimeout(800);
  const el = await p.$(sel);
  await el.screenshot({ path: `pruef/bild-${name}.png` });
  await p.close();
}
await b.close();
console.log('Bilder in pruef/');
