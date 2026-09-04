// Kontrast auf bewolkten Flaechen, im unguenstigsten Bild der Wolkenbewegung.
// Verfahren: zwei Aufnahmen, mit und ohne den Text. Die Differenz ist die
// Tintenmaske. Unter der Maske wird die Leuchtdichte des Grundes ueber ein
// Fenster von Schriftgrad mal 0.10 gemittelt, davon der Hoechstwert.
import { chromium } from 'playwright';
import sharp from 'sharp';

export const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
export const B = 'http://127.0.0.1:4700';
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
export const lum = (r, g, b) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
export const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

/** Enthuellung und Laufband stillstellen, damit die Tintenmaske nur den Text zeigt. */
export const ruhig = `
  .fu,.rl>span,.mm>.px,.px{opacity:1!important;transform:none!important;transition:none!important;}
  .tick .track{animation:none!important;transform:none!important;}
  #cur{display:none!important;}
  #hd{display:none!important;}
  #pg{display:none!important;}
  .lauf::after,#hd .bar::after{display:none!important;}
  .mnu,.mnu *{transition:none!important;}
  .mnu .ln>a{transform:none!important;}`;

/** Wolken anhalten: Deckkraft auf Maximum, Weg auf den Anteil t des Kreislaufs. */
export const halten = (t) => `
  .wolke{
    animation-play-state:paused!important;
    animation-delay:calc(var(--dauer) * ${-t}), calc(var(--atem) * -1)!important;
  }`;

export async function aufnahme(el) {
  const b = await el.screenshot();
  const { data, info } = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  return { data, W: info.width, H: info.height, K: info.channels };
}

/** Kleinster Kontrast eines Textes gegen seinen Grund, im Kasten des Behaelters. */
export async function kontrast(p, behaelter, textSel) {
  const el = await p.$(behaelter);
  if (!el) return null;
  const daten = await p.evaluate((ts) => {
    const t = document.querySelector(ts);
    if (!t) return null;
    const cs = getComputedStyle(t);
    return { farbe: cs.color, grad: parseFloat(cs.fontSize) };
  }, textSel);
  if (!daten) return null;

  const mit = await aufnahme(el);
  await p.addStyleTag({ content: `${textSel}{visibility:hidden!important}` });
  await p.waitForTimeout(150);
  const ohne = await aufnahme(el);
  if (mit.W !== ohne.W || mit.H !== ohne.H) return null;

  const { W, H, K } = ohne;
  const L = new Float64Array(W * H);
  for (let i = 0, q = 0; i < W * H; i++, q += K) L[i] = lum(ohne.data[q], ohne.data[q + 1], ohne.data[q + 2]);
  const maske = new Uint8Array(W * H);
  let n = 0;
  for (let i = 0, q = 0; i < W * H; i++, q += K) {
    const d = Math.abs(mit.data[q] - ohne.data[q]) + Math.abs(mit.data[q + 1] - ohne.data[q + 1]) + Math.abs(mit.data[q + 2] - ohne.data[q + 2]);
    if (d > 60) { maske[i] = 1; n++; }
  }
  if (!n) return null;
  const m = daten.farbe.match(/[\d.]+/g).map(Number);
  const textL = lum(m[0], m[1], m[2]);
  const f = Math.max(1, Math.round(daten.grad * 0.10 / 2));
  let max = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!maske[y * W + x]) continue;
    let s = 0, c = 0;
    for (let dy = -f; dy <= f; dy++) for (let dx = -f; dx <= f; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy < 0 || yy >= H || xx < 0 || xx >= W) continue;
      s += L[yy * W + xx]; c++;
    }
    const v = s / c; if (v > max) max = v;
  }
  return { verhaeltnis: ratio(textL, max), punkte: n };
}

export async function starte() {
  return chromium.launch({ executablePath: EXE });
}
