// Verweispruefung ueber alle Markdown-Dateien. Oertliche Ziele werden im
// Dateibaum nachgesehen, Ankerziele in der Zieldatei.
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, normalize, relative } from 'node:path';

const aus = ['node_modules', '.git', 'dist', '.astro', '.vercel'];
const dateien = [];
(function geh(d) {
  for (const n of readdirSync(d)) {
    if (aus.includes(n)) continue;
    const p = join(d, n);
    statSync(p).isDirectory() ? geh(p) : n.endsWith('.md') && dateien.push(p);
  }
})('.');

const muster = /\[[^\]]*\]\(([^)\s]+)\)/g;
const anker = (s) => (s.match(/^#{1,6}\s+(.+)$/gm) || []).map((z) =>
  z.replace(/^#+\s+/, '').toLowerCase().replace(/[^\w\säöüàéèç-]/g, '').trim().replace(/\s+/g, '-'));

let ortlich = 0, fern = 0, post = 0, fehlt = 0;
for (const f of dateien.sort()) {
  const s = readFileSync(f, 'utf8');
  const treffer = [...s.matchAll(muster)].map((m) => m[1]);
  const o = [], x = [];
  for (const l of treffer) {
    if (l.startsWith('http://') || l.startsWith('https://')) { fern++; continue; }
    if (l.startsWith('mailto:') || l.startsWith('tel:')) { post++; continue; }
    ortlich++;
    const ziel = decodeURIComponent(l.split('#')[0]);
    const ank = l.includes('#') ? l.split('#')[1] : null;
    const p = ziel ? normalize(join(dirname(f), ziel)) : f;
    if (!existsSync(p)) { x.push(`${l}  (Datei fehlt)`); fehlt++; continue; }
    if (ank && p.endsWith('.md')) {
      const vorhanden = anker(readFileSync(p, 'utf8'));
      if (!vorhanden.includes(ank.toLowerCase())) { x.push(`${l}  (Anker fehlt)`); fehlt++; }
    }
    o.push(l);
  }
  console.log(`${relative('.', f).padEnd(56)} ${String(o.length + x.length).padStart(2)} oertlich, ${x.length ? 'FEHLER' : 'alle mit Ziel'}`);
  x.forEach((z) => console.log('    ' + z));
}
console.log(`\n${dateien.length} Markdown-Dateien, ${ortlich} oertliche Verweise, ${fern} Fernadressen, ${post} Post- und Rufadressen`);
console.log(fehlt === 0 ? 'Kein oertlicher Verweis ohne Ziel.' : fehlt + ' Verweise ohne Ziel.');
process.exit(fehlt ? 1 : 0);
