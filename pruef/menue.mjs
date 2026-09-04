import { starte, B, halten, ruhig, kontrast } from './wolkenmess.mjs';
const b = await starte();
const t = process.argv[2] ? Number(process.argv[2]) : 1;
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(B + '/', { waitUntil: 'load' });
await p.evaluate(() => document.fonts.ready);
await p.addStyleTag({ content: ruhig.replace('#hd{display:none!important;}', '') + halten(t) });
await p.click('#bg');
await p.waitForTimeout(2000);
await p.locator('.mnu').screenshot({ path: 'pruef/bild-menue.png' });
// Kontrast der Menuezeilen und des Fusses, alle Phasen
const stellen = [['Menuezeile', '.mnu .ln .t'], ['Fuss im Menue', '.mnu .fuss span'], ['Umschalter', '.mnu .spr a']];
console.log('Menueueberlagerung, Grunddeckkraft 0.46\n');
for (const [name, sel] of stellen) {
  let min = 99, mp = null;
  for (const ph of [0, 0.25, 0.5, 0.75, 1]) {
    const q = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await q.goto(B + '/', { waitUntil: 'load' });
    await q.evaluate(() => document.fonts.ready);
    await q.addStyleTag({ content: ruhig.replace('#hd{display:none!important;}', '') + halten(ph) });
    await q.click('#bg');
    await q.waitForTimeout(2000);
    const r = await kontrast(q, '.mnu', sel);
    await q.close();
    if (r && r.verhaeltnis < min) { min = r.verhaeltnis; mp = ph; }
  }
  console.log('  ' + (min >= 4.5 ? 'ok  ' : 'FEHL') + ' ' + name.padEnd(16) + min.toFixed(2) + ' : 1   (Phase ' + mp + ')');
}
await p.close(); await b.close();
