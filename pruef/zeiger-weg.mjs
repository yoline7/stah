// Beleg: kein eigener Zeiger mehr, Systemzeiger greift wieder.
import { starte, B } from './wolkenmess.mjs';
const b = await starte();
const wege = ['/', '/fr/', '/en/', '/kulinarik/', '/organisation/', '/anmeldung/'];
let fehler = 0;
for (const w of wege) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const meldungen = [];
  p.on('pageerror', (e) => meldungen.push(String(e)));
  p.on('console', (m) => m.type() === 'error' && meldungen.push(m.text()));
  await p.goto(B + w, { waitUntil: 'networkidle' });
  await p.mouse.move(700, 400);
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const kreise = [...document.querySelectorAll('body *')].filter((e) => {
      const s = getComputedStyle(e);
      return s.position === 'fixed' && s.borderRadius.startsWith('50%') && s.pointerEvents === 'none';
    }).map((e) => e.id || e.className);
    return {
      cur: !!document.getElementById('cur'),
      cc: document.body.classList.contains('cc'),
      zeigerBody: getComputedStyle(document.body).cursor,
      zeigerLink: (() => { const a = document.querySelector('a'); return a ? getComputedStyle(a).cursor : '-'; })(),
      kreise,
    };
  });
  const ok = !r.cur && !r.cc && r.zeigerBody !== 'none' && r.zeigerLink !== 'none' && r.kreise.length === 0 && meldungen.length === 0;
  if (!ok) fehler++;
  console.log('  ' + (ok ? 'ok  ' : 'FEHL') + ` ${w}`.padEnd(18) +
    `#cur ${r.cur}, body.cc ${r.cc}, cursor ${r.zeigerBody}/${r.zeigerLink}, feste Kreise ${r.kreise.length}, Fehler ${meldungen.length}`);
  meldungen.forEach((m) => console.log('        ' + m));
  await p.close();
}
await b.close();
console.log(fehler ? `\n${fehler} Seiten mit Befund.` : '\nKein eigener Zeiger mehr, keine Skriptfehler.');
process.exit(fehler ? 1 : 0);
