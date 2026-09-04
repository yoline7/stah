import { starte, B } from './wolkenmess.mjs';
const b = await starte();
const gerade = 'html{scroll-behavior:auto!important}';
const messe = async (extra, vw = 1440, vh = 900) => {
  const p = await b.newPage({ viewport: { width: vw, height: vh } });
  await p.goto(B + '/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: gerade + (extra || '') });
  await p.waitForTimeout(1000);
  const r = await p.evaluate(async () => {
    const ziel = document.querySelector('.s-e.on-dark');
    const von = ziel.getBoundingClientRect().top + window.scrollY - innerHeight;
    const bis = von + ziel.offsetHeight + innerHeight;
    window.scrollTo(0, von);
    await new Promise((f) => setTimeout(f, 250));
    let n = 0; const start = performance.now();
    return await new Promise((f) => {
      (function s(j) { n++; const t = Math.min(1, (j - start) / 3000);
        window.scrollTo(0, von + (bis - von) * t);
        if (t < 1) requestAnimationFrame(s); else f(n / ((performance.now() - start) / 1000)); })(start);
    });
  });
  await p.close();
  return r;
};
const wenige = '.wolke:nth-child(n+3){display:none!important}';
const k52 = '.wolke{width:clamp(320px,52vw,760px)!important}';
const kornNormal = '.wolken::after{mix-blend-mode:normal!important;opacity:.05!important}';
const kornSoft = '.wolken::after{mix-blend-mode:soft-light!important}';
const ohneKorn = '.wolken::after{display:none!important}';
const ohneMisch = '.wolke{mix-blend-mode:normal!important}';
const leiter = [
  ['ohne Wolken', '.wolken{display:none!important}'],
  ['wie gebaut, 3 Wolken 78vw Korn overlay', ''],
  ['3 Wolken 78vw Korn normal', kornNormal],
  ['3 Wolken 78vw ohne Korn', ohneKorn],
  ['3 Wolken 52vw Korn normal', k52 + kornNormal],
  ['3 Wolken 52vw Korn normal, Wolke normal', k52 + kornNormal + ohneMisch],
  ['2 Wolken 52vw Korn normal', wenige + k52 + kornNormal],
  ['3 Wolken 52vw Korn soft-light', k52 + kornSoft],
];
console.log('Bildrate beim Rollen, 1440 mal 900, drei Sekunden\n');
for (const [name, css] of leiter) {
  const r = await messe(css);
  console.log('  ' + (r >= 55 ? 'ok  ' : '    ') + name.padEnd(38) + r.toFixed(1));
}
await b.close();
