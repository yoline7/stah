// Oertliche Pruefung der Auszeichnung, je Seitentyp und je Sprache.
// Ersatz fuer den Rich-Results-Test und den Validator von schema.org,
// solange beide Adressen am Netzfilter scheitern.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const WURZEL = 'https://im-stah.ch/';
const seiten = {
  start: { de: '', fr: 'fr', en: 'en' },
  kulinarik: { de: 'kulinarik', fr: 'fr/gastronomie', en: 'en/food' },
  wein: { de: 'wein', fr: 'fr/vin', en: 'en/wine' },
  organisation: { de: 'organisation', fr: 'fr/infos-pratiques', en: 'en/practical' },
};
const ohne = {
  anmeldung: ['anmeldung', 'fr/inscription', 'en/booking'],
  agb: ['agb', 'fr/conditions-generales', 'en/terms'],
  teilnahme: ['teilnahmebedingungen', 'fr/conditions-participation', 'en/participation'],
  impressum: ['impressum', 'fr/mentions-legales', 'en/imprint'],
  datenschutz: ['datenschutz', 'fr/protection-des-donnees', 'en/privacy'],
};
const kuerzel = { de: 'de-CH', fr: 'fr-CH', en: 'en' };
const ENTITAETEN = ['website', 'fernand-cina', 'soulfood', 'maison-13', 'bergbox',
  'yoline', 'alisha-cina', 'alain-lerjen', 'clos-du-cornalin', 'kellerei'];
const PLATZHALTER = [/\{[a-z]/i, /\bXXX\b/, /\bTODO\b/, /0\.000000/, /vercel\.app/, /Lorem/, /Platzhalter/];

const lies = (weg) => readFileSync(join('dist', weg, 'index.html'), 'utf8');
const graph = (s) => {
  const m = s.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/);
  return m ? JSON.parse(m[1])['@graph'] : null;
};

/** Alle @id einsammeln: mit weiteren Feldern ist Definition, allein ist Verweis. */
function sammle(o, def, ref) {
  if (Array.isArray(o)) { o.forEach((v) => sammle(v, def, ref)); return; }
  if (o === null || typeof o !== 'object') return;
  if (o['@id']) (Object.keys(o).length === 1 ? ref : def).push(o['@id']);
  Object.values(o).forEach((v) => sammle(v, def, ref));
}

/** Jeden Blattwert einsammeln, fuer Platzhalter und Leerwerte. */
function blaetter(o, aus, pfad = '') {
  if (Array.isArray(o)) { o.forEach((v, i) => blaetter(v, aus, `${pfad}[${i}]`)); return; }
  if (o !== null && typeof o === 'object') { Object.entries(o).forEach(([k, v]) => blaetter(v, aus, pfad ? `${pfad}.${k}` : k)); return; }
  aus.push([pfad, o]);
}

let fehler = 0;
const meld = (t) => { fehler++; console.log('    FEHLER ' + t); };

console.log('Zwoelf indexierbare Seiten, vier Typen mal drei Sprachen\n');
const zaehler = Object.fromEntries(ENTITAETEN.map((e) => [e, 0]));
const erwartet = { start: 'FoodEvent', kulinarik: 'BreadcrumbList', wein: 'BreadcrumbList', organisation: 'FAQPage' };

for (const [typ, sprachen] of Object.entries(seiten)) {
  for (const [sp, weg] of Object.entries(sprachen)) {
    const html = lies(weg);
    const g = graph(html);
    const kopf = `  ${typ}/${sp}`.padEnd(26);
    if (!g) { console.log(kopf + 'kein Graph'); meld('Graph fehlt'); continue; }
    const def = [], ref = [];
    sammle(g, def, ref);
    const einmal = def.length === new Set(def).size;
    if (!einmal) meld(`${typ}/${sp}: Kennung doppelt definiert: ${def.filter((x, i) => def.indexOf(x) !== i)}`);
    const offen = [...new Set(ref)].filter((r) => !def.includes(r));
    if (offen.length) meld(`${typ}/${sp}: Verweis ohne Ziel: ${offen}`);
    const fremd = [...def, ...ref].filter((i) => !i.startsWith(WURZEL));
    if (fremd.length) meld(`${typ}/${sp}: Kennung ausserhalb der Wurzel: ${fremd}`);
    // Entitaeten genau einmal
    for (const e of ENTITAETEN) {
      const n = def.filter((i) => i === WURZEL + '#' + e).length;
      if (n !== 1) meld(`${typ}/${sp}: Entitaet #${e} ${n} mal definiert`);
      else zaehler[e]++;
    }
    // Platzhalter und Leerwerte
    const b = [];
    blaetter(g, b);
    const leer = b.filter(([, v]) => v === '' || v === null);
    if (leer.length) meld(`${typ}/${sp}: Leerwert bei ${leer.map((x) => x[0])}`);
    const pl = b.filter(([, v]) => typeof v === 'string' && PLATZHALTER.some((r) => r.test(v)));
    if (pl.length) meld(`${typ}/${sp}: Platzhalter bei ${pl.map((x) => x[0] + '=' + x[1])}`);
    // inLanguage je Sprachfassung
    const sprachfelder = b.filter(([p]) => p.endsWith('inLanguage') || p.match(/inLanguage\[\d\]$/));
    const seitig = g.filter((n) => n.inLanguage && typeof n.inLanguage === 'string');
    const falsch = seitig.filter((n) => n.inLanguage !== kuerzel[sp]);
    if (falsch.length) meld(`${typ}/${sp}: inLanguage falsch: ${falsch.map((n) => n['@type'] + '=' + n.inLanguage)}`);
    // Typ vorhanden
    const typen = g.flatMap((n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]));
    if (!typen.includes(erwartet[typ])) meld(`${typ}/${sp}: ${erwartet[typ]} fehlt`);
    if (typ !== 'start' && typen.includes('FoodEvent')) meld(`${typ}/${sp}: FoodEvent gehoert nur auf die Startseite`);
    // Verbotene Typen
    for (const v of ['HowTo', 'Menu', 'AggregateRating', 'Review', 'LocalBusiness']) {
      if (b.some(([p, w]) => p.includes('@type') && w === v) || typen.includes(v)) meld(`${typ}/${sp}: ${v} ausgezeichnet`);
    }
    // Verzeichnisvermerk
    if (/name="robots"[^>]*noindex/.test(html)) meld(`${typ}/${sp}: traegt noindex`);
    const wieviel = seitig.map((n) => n.inLanguage)[0] || '-';
    console.log(kopf + `${g.length} Knoten, ${def.length} Definitionen, ${new Set(ref).size} Verweise, ${erwartet[typ]}, inLanguage ${wieviel}`);
  }
}

console.log('\nJede Entitaet auf allen zwoelf Seiten genau einmal');
for (const e of ENTITAETEN) {
  console.log('  ' + (zaehler[e] === 12 ? 'ok  ' : 'FEHL') + ` #${e}`.padEnd(20) + `${zaehler[e]} von 12`);
  if (zaehler[e] !== 12) fehler++;
}

console.log('\nFuenfzehn Seiten mit noindex, ohne Auszeichnung');
for (const [typ, wege] of Object.entries(ohne)) {
  for (const weg of wege) {
    const html = lies(weg);
    const g = graph(html);
    const ni = /name="robots"[^>]*noindex/.test(html);
    const ok = !g && ni;
    if (!ok) meld(`${typ}/${weg}: Graph ${g ? 'vorhanden' : 'fehlt'}, noindex ${ni}`);
    console.log('  ' + (ok ? 'ok  ' : 'FEHL') + ` /${weg}`.padEnd(34) + (g ? `${g.length} Knoten` : 'kein Schema') + ', ' + (ni ? 'noindex' : 'OHNE noindex'));
  }
}

// vercel.app im ganzen Bauwerk
const alle = [];
(function geh(d) { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? geh(p) : alle.push(p); } })('dist');
const v = alle.filter((f) => /\.(html|xml|txt|json)$/.test(f) && readFileSync(f, 'utf8').includes('vercel.app'));
console.log(`\nvercel.app im gebauten Ergebnis: ${v.length} Fundstellen` + (v.length ? ' ' + v.map((f) => relative('dist', f)) : ''));
if (v.length) fehler++;

console.log(`\n${fehler === 0 ? 'Alle oertlichen Pruefungen bestanden.' : fehler + ' Fehler.'}`);
process.exit(fehler ? 1 : 0);
