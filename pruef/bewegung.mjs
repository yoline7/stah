import { chromium } from 'playwright';
import sharp from 'sharp';
const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const B = 'http://127.0.0.1:4700';
const b = await chromium.launch({ executablePath: EXE });

async function farbenImBild(p, sel) {
  const el = await p.$(sel);
  const buf = await el.screenshot();
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let bunt = 0, gesamt = 0;
  for (let i = 0; i < info.width * info.height; i++) {
    const q = i * info.channels, r = data[q], g = data[q + 1], bl = data[q + 2];
    const mx = Math.max(r, g, bl), mn = Math.min(r, g, bl);
    gesamt++;
    if (mx > 60 && mx - mn > 26) bunt++;
  }
  return bunt / gesamt;
}

// 1. Zahlenwelle: Farbanteil ohne und mit Welle
const p1 = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p1.goto(B + '/', { waitUntil: 'networkidle' });
await p1.evaluate(() => document.querySelector('.facts').scrollIntoView({ block: 'center' }));
await p1.waitForTimeout(1500);
const vorher = await farbenImBild(p1, '.facts');
await p1.evaluate(() => {
  document.documentElement.style.setProperty('--puls', 'var(--puls-4)');
  document.querySelectorAll('.facts b').forEach((x, i) => {
    x.style.setProperty('--verzug', (i * 140) + 'ms'); x.classList.add('welle');
  });
});
await p1.waitForTimeout(700);
const waehrend = await farbenImBild(p1, '.facts');
console.log('Zahlenwelle  Farbanteil vorher', (vorher * 100).toFixed(2) + ' %', '| waehrend', (waehrend * 100).toFixed(2) + ' %');

// 2. Laufbandspur
const vorherB = await farbenImBild(p1, '.tick');
await p1.evaluate(() => {
  const t = document.querySelector('.tick');
  const breite = innerWidth;
  document.documentElement.style.setProperty('--puls', 'var(--puls-4)');
  [].slice.call(t.querySelectorAll('.track i')).forEach((k) => {
    const r = k.getBoundingClientRect();
    if (r.right < -40 || r.left > breite + 40) return;
    k.style.setProperty('--verzug', Math.round(Math.max(0, Math.min(1, r.left / breite)) * 900) + 'ms');
    k.classList.add('punkt');
  });
  t.classList.add('spur');
});
await p1.waitForTimeout(700);
const waehrendB = await farbenImBild(p1, '.tick');
const grundB = await p1.evaluate(() => {
  const t = document.querySelector('.tick');
  return getComputedStyle(t).backgroundColor;
});
console.log('Laufbandspur Farbanteil vorher', (vorherB * 100).toFixed(2) + ' %', '| waehrend', (waehrendB * 100).toFixed(2) + ' %', '| Grund waehrend der Spur', grundB);
await p1.evaluate(() => document.querySelector('.tick').classList.remove('spur'));
await p1.waitForTimeout(300);
const nachB = await farbenImBild(p1, '.tick');
console.log('Laufbandspur Farbanteil danach', (nachB * 100).toFixed(2) + ' %');

// 3. Taktgeber laesst die Spur laufen, wenn das Band sichtbar ist
const p2 = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p2.goto(B + '/', { waitUntil: 'networkidle' });
await p2.evaluate(() => document.querySelector('.tick').scrollIntoView({ block: 'center' }));
await p2.waitForTimeout(1200);
const spurGesehen = await p2.evaluate(() => new Promise((f) => {
  const bis = performance.now() + 75000;
  const h = setInterval(() => {
    if (document.querySelector('.tick.spur')) { clearInterval(h); f(true); }
    else if (performance.now() > bis) { clearInterval(h); f(false); }
  }, 40);
}));
console.log('Spur vom Taktgeber ausgeloest:', spurGesehen);

// 4. Zeigerfarbe ueber dem Knopf
await b.close();
