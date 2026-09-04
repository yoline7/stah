import { chromium } from 'playwright';
import sharp from 'sharp';
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const B = 'http://127.0.0.1:4700';
const b = await chromium.launch({ executablePath: EXE });
let ok = 0, bad = 0;
const pruef = (t, w) => { if (w) { ok++; console.log('  ok   ' + t); } else { bad++; console.log('  FEHL ' + t); } };

async function buntAnteil(p, sel) {
  const el = await p.$(sel); const buf = await el.screenshot();
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let bunt = 0, g = 0;
  for (let i = 0; i < info.width * info.height; i++) {
    const q = i * info.channels, r = data[q], gg = data[q + 1], bl = data[q + 2];
    const mx = Math.max(r, gg, bl), mn = Math.min(r, gg, bl);
    g++; if (mx > 60 && mx - mn > 26) bunt++;
  }
  return bunt / g;
}

console.log('\n1 · Knopffuellung traegt die Farbe');
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('.send').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(900);
  const vor = await buntAnteil(p, '.send');
  await p.hover('.send'); await p.waitForTimeout(700);
  const nach = await buntAnteil(p, '.send');
  const fuell = await p.evaluate(() => getComputedStyle(document.querySelector('.send'), '::before').backgroundColor);
  console.log('   Farbanteil ruhend', (vor * 100).toFixed(2) + ' %', '| gefuellt', (nach * 100).toFixed(2) + ' %', '| Fuellung', fuell);
  pruef('Fuellung ist farbig', nach > vor + .2);
  await p.close();
}

console.log('\n2 · Kantenlauf traegt die Farbe');
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const g = await p.evaluate(() => {
    document.documentElement.style.setProperty('--puls', 'var(--puls-4)');
    return {
      ring: getComputedStyle(document.querySelector('#hd .cta'), '::after').backgroundImage,
      kante: getComputedStyle(document.querySelector('#hd .bar'), '::after').backgroundImage,
    };
  });
  pruef('Ringlauf nennt die Pulsfarbe', /240, 168, 104/.test(g.ring));
  pruef('Kantenlauf nennt die Pulsfarbe', /240, 168, 104/.test(g.kante));
  await p.close();
}

console.log('\n3 · Farbe nirgends sonst, Seite in Ruhe');
// Gemessen wird der Unterschied zur selben Seite mit ausgegrauten Pulsfarben.
// Subpixel-Kantenglaettung der Schrift faellt damit heraus, sie steht in beiden Aufnahmen.
for (const [name, weg] of [['Start', '/'], ['Kulinarik', '/kulinarik/'], ['Wein', '/wein/'],
                           ['Organisation', '/organisation/'], ['fr Start', '/fr/'], ['en Wein', '/en/wine/']]) {
  const werte = [];
  for (const grau of [false, true]) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(B + weg, { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    // Die Wolken tragen auf den fuenf dunklen Flaechen absichtlich Farbe.
    // Geprueft wird hier der Puls, also Kantenlauf, Welle, Spur, Fuellung, Zeiger.
    let regeln = '.px,.band,.hero .px,figure .ph,.partners,.wolken{visibility:hidden!important}';
    if (grau) regeln += ':root{--puls-1:#8A8C8E!important;--puls-2:#8A8C8E!important;--puls-3:#8A8C8E!important;--puls-4:#8A8C8E!important;--puls:#8A8C8E!important;}';
    await p.addStyleTag({ content: regeln });
    await p.waitForTimeout(300);
    const buf = await p.screenshot({ fullPage: true });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    let bunt = 0, g = 0;
    for (let i = 0; i < info.width * info.height; i++) {
      const q = i * info.channels, r = data[q], gg = data[q + 1], bl = data[q + 2];
      const mx = Math.max(r, gg, bl), mn = Math.min(r, gg, bl);
      g++; if (mx > 60 && mx - mn > 26) bunt++;
    }
    werte.push(bunt / g);
    await p.close();
  }
  const abstand = Math.abs(werte[0] - werte[1]);
  console.log('   ' + name.padEnd(14), 'mit Palette ' + (werte[0] * 100).toFixed(3) + ' % | ausgegraut ' + (werte[1] * 100).toFixed(3) + ' % | Unterschied ' + (abstand * 100).toFixed(4) + ' %');
  pruef(name + ' zeigt in Ruhe keine Pulsfarbe ausserhalb der Wolken', abstand < 0.0002);
}

console.log('\n4 · Bildrate waehrend der Bewegungen');
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelector('.facts').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(900);
  const fps = await p.evaluate(() => new Promise((f) => {
    let n = 0; const start = performance.now();
    // waehrend der Messung laufen Welle und Kantenlauf
    document.querySelectorAll('.facts b').forEach((x, i) => { x.style.setProperty('--verzug', (i * 140) + 'ms'); x.classList.add('welle'); });
    document.querySelector('#hd .bar').classList.add('aktiv');
    (function z() { n++; if (performance.now() - start < 3000) requestAnimationFrame(z); else f(n / ((performance.now() - start) / 1000)); })();
  }));
  console.log('   ' + fps.toFixed(1) + ' Bilder je Sekunde');
  pruef('mindestens 55 Bilder je Sekunde', fps >= 55);
  await p.close();
}

console.log('\n5 · Reduzierte Bewegung');
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  const z = await p.evaluate(() => ({
    lauf: document.documentElement.classList.contains('hat-lauf'),
    welle: document.documentElement.classList.contains('hat-welle'),
    aktiv: document.querySelectorAll('.aktiv, .welle, .spur').length,
    zeiger: getComputedStyle(document.getElementById('cur')).display,
    sichtbar: document.querySelectorAll('.fu.in, .rl.in').length > 0,
  }));
  console.log('  ', z);
  pruef('kein Lichtlauf', !z.lauf && !z.welle && z.aktiv === 0);
  pruef('kein eigener Zeiger', z.zeiger === 'none');
  pruef('Inhalte sichtbar', z.sichtbar);
  await p.close();
}

console.log('\n6 · Ohne JavaScript');
{
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  for (const [name, weg] of [['Start', '/'], ['fr Start', '/fr/'], ['en Anmeldung', '/en/booking/'], ['fr AGB', '/fr/conditions-generales/']]) {
    const p = await c.newPage();
    await p.goto(B + weg, { waitUntil: 'load' });
    const z = await p.evaluate(() => ({
      h1: (document.querySelector('h1') || {}).textContent || '',
      verweise: document.querySelectorAll('a[href^="/"]').length,
      sichtbarH1: (() => { const h = document.querySelector('h1'); if (!h) return false;
        const s = getComputedStyle(h); return s.visibility !== 'hidden' && s.display !== 'none' && h.getBoundingClientRect().height > 0; })(),
    }));
    console.log('   ' + name.padEnd(14), 'h1:', JSON.stringify(z.h1.trim().slice(0, 46)), '| Verweise:', z.verweise);
    pruef(name + ' zeigt Titel und Verweise ohne JS', z.sichtbarH1 && z.verweise > 4);
    await p.close();
  }
  await c.close();
}

console.log('\n7 · Sprachen, Umschalter und Kopfangaben');
{
  const faelle = [
    ['/', 'de-CH', '/fr/', '/en/'],
    ['/fr/gastronomie/', 'fr-CH', '/kulinarik', '/en/food'],
    ['/en/practical/', 'en', '/organisation', '/fr/infos-pratiques'],
    ['/fr/conditions-generales/', 'fr-CH', '/agb', '/en/terms'],
  ];
  for (const [weg, lang, a1, a2] of faelle) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(B + weg, { waitUntil: 'domcontentloaded' });
    const z = await p.evaluate(() => ({
      lang: document.documentElement.lang,
      hreflang: [].map.call(document.querySelectorAll('link[rel=alternate]'), (l) => l.hreflang + ' ' + new URL(l.href).pathname),
      canonical: (document.querySelector('link[rel=canonical]') || {}).href,
      og: (document.querySelector('meta[property="og:locale"]') || {}).content,
      umschalter: [].map.call(document.querySelectorAll('.spr a'), (a) => a.getAttribute('href')),
    }));
    console.log('   ' + weg.padEnd(30), z.lang, '|', z.og || '(kein og)', '|', z.hreflang.join(', '));
    pruef(weg + ' traegt lang=' + lang, z.lang === lang);
    pruef(weg + ' traegt vier Alternativen inkl. x-default', z.hreflang.length === 4 && z.hreflang.some((x) => x.startsWith('x-default')));
    pruef(weg + ' Umschalter zeigt die Schwestern', z.umschalter.some((h) => h.startsWith(a1)) && z.umschalter.some((h) => h.startsWith(a2)));
    await p.close();
  }
}

console.log('\n8 · Vorrangvermerk auf den uebersetzten Rechtstexten');
{
  for (const [weg, wort] of [['/fr/conditions-generales/', 'allemande'], ['/en/terms/', 'German'], ['/fr/protection-des-donnees/', 'allemande'], ['/en/privacy/', 'German'], ['/agb/', null]]) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(B + weg, { waitUntil: 'domcontentloaded' });
    const t = await p.evaluate(() => (document.querySelector('.vorrang') || {}).textContent || '');
    if (wort) pruef(weg + ' nennt den Vorrang der deutschen Fassung', t.includes(wort));
    else pruef(weg + ' traegt keinen Vorrangvermerk', t === '');
    await p.close();
  }
}

console.log('\nErgebnis: ' + ok + ' erfuellt, ' + bad + ' offen');
await b.close();
process.exit(bad ? 1 : 0);
