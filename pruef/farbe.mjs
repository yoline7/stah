import { chromium } from 'playwright';
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const B = 'http://127.0.0.1:4700';
const b = await chromium.launch({ executablePath: EXE });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(B + '/', { waitUntil: 'networkidle' });

// Auf die Hoehe rollen, auf der Laufband und Faktenfeld zugleich sichtbar sind
await p.evaluate(() => {
  const f = document.querySelector('.facts');
  window.scrollTo({ top: f.getBoundingClientRect().top + window.scrollY - 260, behavior: 'auto' });
});
await p.waitForTimeout(1200);

const flaggen = await p.evaluate(() => ({
  hatLauf: document.documentElement.classList.contains('hat-lauf'),
  hatWelle: document.documentElement.classList.contains('hat-welle'),
}));
console.log('Merkmale:', flaggen);

// Beobachter: jede Bewegung mitschreiben, Farbe und Art
const bericht = await p.evaluate(() => new Promise((fertig) => {
  const laeufe = [];
  let gleichzeitig = 0, maxGleichzeitig = 0, letztesEnde = 0, minLuecke = Infinity;
  const aktiv = new Set();
  const farbe = () => getComputedStyle(document.documentElement).getPropertyValue('--puls').trim();
  const werte = {
    '#C2D9A6': 'gruen-1', '#96C9A8': 'gruen-2', '#7FB6B0': 'gruen-3', '#F0A868': 'orange',
  };
  const loesen = (roh) => {
    const m = roh.match(/--puls-(\d)/);
    if (m) return ['gruen-1','gruen-2','gruen-3','orange'][Number(m[1]) - 1];
    return werte[roh.toUpperCase()] || roh;
  };
  const pruefen = () => {
    const jetzt = performance.now();
    const nun = new Set();
    document.querySelectorAll('.lauf.aktiv, #hd .bar.lauf-kante.aktiv').forEach(e => nun.add('kante:' + (e.className)));
    if (document.querySelector('.facts b.welle')) nun.add('zahlen');
    if (document.querySelector('.tick.spur')) nun.add('band');
    for (const k of nun) if (!aktiv.has(k)) {
      if (letztesEnde) minLuecke = Math.min(minLuecke, jetzt - letztesEnde);
      laeufe.push({ art: k.startsWith('kante') ? 'kante' : k, farbe: loesen(farbe()) });
    }
    for (const k of aktiv) if (!nun.has(k)) letztesEnde = jetzt;
    aktiv.clear(); for (const k of nun) aktiv.add(k);
    maxGleichzeitig = Math.max(maxGleichzeitig, nun.size);
    if (laeufe.length >= 45) { clearInterval(h); fertig({ laeufe, maxGleichzeitig, minLuecke }); }
  };
  const h = setInterval(pruefen, 25);
  setTimeout(() => { clearInterval(h); fertig({ laeufe, maxGleichzeitig, minLuecke }); }, 400000);
}));

const zaehl = {};
bericht.laeufe.forEach(l => { zaehl[l.farbe] = (zaehl[l.farbe] || 0) + 1; });
const folge = bericht.laeufe.map(l => l.farbe);
let zweimal = 0, maxAbstandOrange = 0, letzterOrange = -1, minAbstand = 99;
folge.forEach((f, i) => {
  if (i > 0 && f === folge[i-1]) zweimal++;
  if (f === 'orange') { if (letzterOrange >= 0) minAbstand = Math.min(minAbstand, i - letzterOrange); letzterOrange = i; }
});
const arten = {};
bericht.laeufe.forEach(l => { arten[l.art] = (arten[l.art] || 0) + 1; });
console.log('Laeufe:', bericht.laeufe.length);
console.log('Arten:', arten);
console.log('Farben:', zaehl);
console.log('Orange-Anteil:', ((zaehl.orange || 0) / bericht.laeufe.length * 100).toFixed(1) + ' %');
console.log('Kleinster Abstand zwischen zwei Orange (in Laeufen):', minAbstand === 99 ? 'nur eines' : minAbstand);
console.log('Zweimal dieselbe Farbe hintereinander:', zweimal);
console.log('Hoechste Zahl gleichzeitiger Bewegungen:', bericht.maxGleichzeitig);
console.log('Kleinste Ruhe zwischen zwei Bewegungen (ms):', Math.round(bericht.minLuecke));
await b.close();
